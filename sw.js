// Service worker: shows push notifications and opens the lead when tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch { d = { title: "Y CRM", body: event.data?.text() }; }
  event.waitUntil(self.registration.showNotification(d.title || "Y CRM", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png",
    tag: d.tag || undefined, renotify: true, requireInteraction: true, 
    data: { url: d.url || "./" }, vibrate: [200, 100, 200],
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.registration.scope).href;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { await c.navigate(target).catch(() => {}); return c.focus(); }
    return self.clients.openWindow(target);
  })());
});
self.addEventListener("fetch", () => {}); // network-only; keeps install prompt eligible
