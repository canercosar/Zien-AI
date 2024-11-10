// Firebase yapılandırması ve başlatma
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyC9YvUI6EDGTcULTRAxiRmE3id1h6aezAQ",
	authDomain: "zientech-161c4.firebaseapp.com",
	projectId: "zientech-161c4",
	storageBucket: "zientech-161c4.appspot.com",
	messagingSenderId: "99032226847",
	appId: "1:99032226847:web:8cad75113b4d77aff3c92a"
};

// Firebase app başlatma
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerine erişim
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };