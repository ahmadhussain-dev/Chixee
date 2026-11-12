// Small structured logger: one JSON line per event, so Vercel's log search can filter by event, status or request id.
// log.info("order.created", { code }) -> {"level":"info","event":"order.created","code":"...","time":"..."}
function write(level, event, data = {}) {
  const line = JSON.stringify({ level, event, ...data, time: new Date().toISOString() });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event, data) => write("info", event, data),
  warn: (event, data) => write("warn", event, data),
  error: (event, data) => write("error", event, data),
};
