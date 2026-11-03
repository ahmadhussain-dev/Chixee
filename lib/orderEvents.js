import { EventEmitter } from "node:events";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

// One shared order feed per server instance, however many browsers are listening.
// - On MongoDB Atlas (replica set) it uses a change stream: zero polling, updates arrive instantly.
// - If change streams aren't available (e.g. a standalone local mongod) it falls back to ONE light
//   query every few seconds per server instance, instead of one query per open browser tab.
// - Writes made by this instance are also pushed straight to listeners.
// The feed only runs while someone is connected.

const POLL_MS = 4000;
const g = globalThis;
if (!g._chixeeOrderBus) {
  g._chixeeOrderBus = { emitter: new EventEmitter(), listeners: 0, stop: null, seen: new Map() };
  g._chixeeOrderBus.emitter.setMaxListeners(0);
}
const bus = g._chixeeOrderBus;

// Drop duplicates (the same change can arrive from a local write and from the change stream).
export function publish(order) {
  if (!order?.code) return;
  const stamp = new Date(order.updatedAt || Date.now()).getTime();
  if ((bus.seen.get(order.code) || 0) >= stamp) return;
  bus.seen.set(order.code, stamp);
  if (bus.seen.size > 2000) bus.seen.delete(bus.seen.keys().next().value);
  bus.emitter.emit("order", order);
}

export function subscribe(fn) {
  bus.emitter.on("order", fn);
  bus.listeners++;
  if (bus.listeners === 1) start();
  return () => {
    bus.emitter.off("order", fn);
    bus.listeners--;
    if (bus.listeners === 0 && bus.stop) {
      bus.stop();
      bus.stop = null;
    }
  };
}

async function start() {
  try {
    await dbConnect();
  } catch (e) {
    console.error("[orders feed] database unavailable:", e.message);
    return;
  }
  if (bus.listeners === 0) return;
  let fellBack = false;
  const fallback = () => {
    if (fellBack || bus.listeners === 0) return;
    fellBack = true;
    startPolling();
  };
  try {
    const stream = Order.watch([{ $match: { operationType: { $in: ["insert", "update", "replace"] } } }], { fullDocument: "updateLookup" });
    stream.on("change", (c) => c.fullDocument && publish(c.fullDocument));
    stream.on("error", () => {
      stream.close().catch(() => {});
      fallback();
    });
    bus.stop = () => stream.close().catch(() => {});
  } catch {
    fallback();
  }
}

function startPolling() {
  let since = new Date();
  let busy = false;
  const timer = setInterval(async () => {
    if (busy) return;
    busy = true;
    try {
      const changed = await Order.find({ updatedAt: { $gt: since } }).sort({ updatedAt: 1 }).limit(200).lean();
      for (const o of changed) {
        publish(o);
        if (o.updatedAt > since) since = o.updatedAt;
      }
    } catch (e) {
      console.error("[orders feed] poll failed:", e.message);
    } finally {
      busy = false;
    }
  }, POLL_MS);
  bus.stop = () => clearInterval(timer);
}

// Server-Sent Events response that forwards matching orders to one browser.
export function sseResponse(req, { filter, shape }) {
  const enc = new TextEncoder();
  let cleanup = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const write = (s) => {
        try { controller.enqueue(enc.encode(s)); } catch { cleanup(); }
      };
      write("retry: 3000\n\n");
      const unsubscribe = subscribe((o) => {
        if (filter(o)) write(`event: order\ndata: ${JSON.stringify(shape(o))}\n\n`);
      });
      const ping = setInterval(() => write(": ping\n\n"), 25000); // keeps proxies from closing the connection
      cleanup = () => {
        unsubscribe();
        clearInterval(ping);
        cleanup = () => {};
        try { controller.close(); } catch {}
      };
      req.signal.addEventListener("abort", () => cleanup());
    },
    cancel() {
      cleanup();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
