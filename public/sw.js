// Service worker for Chixee notifications (Web Push). Shows the notification and opens the right page when tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: "Chixee", body: event.data?.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || "Chixee", {
      body: data.body || "",
      icon: data.icon || "/icon.png",
      badge: data.badge || "/icon.png",
      tag: data.tag,
      renotify: !!data.tag,
      requireInteraction: !!data.sticky,
      vibrate: [120, 60, 120],
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      const same = wins.find((w) => w.url === url);
      if (same) return same.focus();
      return self.clients.openWindow(url);
    })
  );
});
