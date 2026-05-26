// Service Worker ON Coaching — Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'ON Coaching', body: 'Nouveau message reçu', icon: '/faviconNoText.png' };
  try { data = { ...data, ...event.data?.json() }; } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    '/faviconNoText.png',
      badge:   '/faviconNoText.png',
      tag:     'oncoaching-notif',
      renotify: true,
      data:    { url: data.url ?? '/admin/messages' },
      actions: [{ action: 'open', title: 'Voir le message' }],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/admin/messages';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes('/admin') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  if (event.action === 'open') {
    event.notification.close();
    clients.openWindow('/admin/messages');
  }
});
