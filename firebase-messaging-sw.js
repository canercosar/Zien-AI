importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyC9YvUI6EDGTcULTRAxiRmE3id1h6aezAQ",
  authDomain: "zientech-161c4.firebaseapp.com",
  projectId: "zientech-161c4",
  storageBucket: "zientech-161c4.appspot.com",
  messagingSenderId: "99032226847",
  appId: "1:99032226847:web:8cad75113b4d77aff3c92a"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirime tıklanıldığında
self.addEventListener('notificationclick', function (event) {
  // console.log('[firebase-messaging-sw.js] Notification click Received.');

  event.notification.close();

  // Bildirim verilerini al
  const data = event.notification.data;

  // Popup penceresini aç
  event.waitUntil(
    clients.openWindow('/notification-details?title=' + data.title + '&body=' + data.body)
  );
});