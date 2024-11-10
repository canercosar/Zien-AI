import { getFirestore, collection, getDocs, query, where, setDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { app, auth, db } from './firebaseConfig.js'; // Firebase yapılandırma dosyasını import et

// const firebaseConfig = {
// 	apiKey: "AIzaSyC9YvUI6EDGTcULTRAxiRmE3id1h6aezAQ",
// 	authDomain: "zientech-161c4.firebaseapp.com",
// 	projectId: "zientech-161c4",
// 	storageBucket: "zientech-161c4.appspot.com",
// 	messagingSenderId: "99032226847",
// 	appId: "1:99032226847:web:8cad75113b4d77aff3c92a"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

const fnGetCompanyDetail = async (sCompanyId) => {
	let aCompanies = [];
	let queryDetail = query(collection(db, "companies"), where("companyCode", "==", sCompanyId));
	let querySnapshot = await getDocs(queryDetail);

	querySnapshot.forEach((doc) => {
		aCompanies.push({ id: doc.id, ...doc.data() });
	});

	return aCompanies;
};

const fnSetCompany = async (oCompany) => {
	await setDoc(doc(db, "companies", oCompany.id), oCompany);
};


const fnGetUsers = async (oFiltered) => {
	let aUsers = [];
	let queryDetail = query(collection(db, "users"));
	let querySnapshot = await getDocs(queryDetail);

	querySnapshot.forEach((doc) => {
		aUsers.push(doc.data());
	});

	return aUsers;
};

const fnCreateCompany = async (oCompany) => {
	// await setDoc(doc(db, "companies", oCompany.companyCode), oCompany);
	// const docRef = await addDoc(collection(db, "companies"), oCompany);

	await addDoc(collection(db, "companies"), oCompany);
};

export { fnGetCompanyDetail as getCompanyDetail, fnCreateCompany as setCompany, fnSetCompany as updateCompany }