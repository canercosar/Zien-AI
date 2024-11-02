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

const fnGetCameraDetail = async (sCompanyCode, sDepartment) => {
	let aCameras = [];
	let queryDetail =
		query(collection(db, "cameras"),
			where("companyCode", "==", sCompanyCode)
		);
	let querySnapshot = await getDocs(queryDetail);

	querySnapshot.forEach((doc) => {
		aCameras.push(doc.data());
	});

	return aCameras;
};

const fnSetCamera = async (oCameraDetail) => {
	await addDoc(collection(db, "cameras"), oCameraDetail);
};

export { fnGetCameraDetail as getCameraDetail, fnSetCamera as setCamera }