import { getFirestore, collection, getDocs, query, where, setDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyC9YvUI6EDGTcULTRAxiRmE3id1h6aezAQ",
	authDomain: "zientech-161c4.firebaseapp.com",
	projectId: "zientech-161c4",
	storageBucket: "zientech-161c4.appspot.com",
	messagingSenderId: "99032226847",
	appId: "1:99032226847:web:8cad75113b4d77aff3c92a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const fnGetNotifDetail = async (sCompanyCode) => {
	let aNotifDetail = [];
	let queryDetail =
		query(collection(db, "logs"),
			where("companyCode", "==", sCompanyCode)
		);
	let querySnapshot = await getDocs(queryDetail);

	querySnapshot.forEach((doc) => {
	//	aNotifDetail.push(doc.data());

		aNotifDetail.push({ id: doc.id, ...doc.data() });
	});

	return aNotifDetail;
};

export { fnGetNotifDetail as getNotifDetail }