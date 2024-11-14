// Firebase Messaging servisini doğru şekilde import edin
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js";

// Firebase yapılandırması için app'i doğru import edin
import { app } from './firebaseConfig.js'; // Firebase config dosyasındaki app'i import et

class NotificationHandler {
	constructor() {
		this._currentTokenFCM = null;
		this.messaging = getMessaging(app); // Messaging servisini al
	}

	// Bildirim izni isteme
	requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				getToken(this.messaging, {
					applicationServerKey: 'BETB9VQsjY3lanuUe3rU19PgHFKoDFJ7OFcv7kNVyYnGcdlV9Ci8ye2An7b_2RnX1gO5SNs0MwBzrF232g-xMzQ'
				})
					.then((currentToken) => {
						if (currentToken) {
							this._currentTokenFCM = currentToken;
							// console.log('Current token for client: ', currentToken);
						} else {
							// console.log('No registration token available.');
						}
					}).catch((err) => {
						console.error('An error occurred while retrieving token: ', err);
					});
			} else {
				// console.log('Unable to get permission to notify.');
			}
		});
	}
}

// Service Worker kaydını da doğru şekilde yapın
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./firebase-messaging-sw.js')
		.then((registration) => {
			// console.log('Service worker registered:', registration);
		})
		.catch((error) => {
			console.error('Error registering service worker:', error);
		});
}

export { NotificationHandler };
