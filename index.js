import { getFirestore, collection, getDocs, addDoc, query, where, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getUserDetail, setUser } from "./userOperation.js"
import { getCompanyDetail} from "./companyOperation.js"

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
const user = auth.currentUser;
const db = getFirestore(app);
const userId = localStorage.getItem("userId");

if (userId) {
  console.log("Giriş yapan kullanıcının UID'si:", userId);

    let aCurrentUser = await getUserDetail(userId);
    let aCurrentUserCompanyDetail = await getCompanyDetail(aCurrentUser[0].companyCode);

    localStorage.setItem("currentUser", aCurrentUser);
    document.getElementById('userName').textContent = aCurrentUser[0].name + " " + aCurrentUser[0].surname;
    document.getElementById('authName').textContent = aCurrentUser[0].title;

    document.getElementById('companyName').textContent = aCurrentUserCompanyDetail[0].companyName;

    if (!aCurrentUser.length > 0) {
      await setUser(userId);
    }

  try {
    const q = query(collection(db, "companies"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  } catch (e) {
    console.error("Veri Alınamadı ", e);
  }
} else {
  window.location.href = "pages/login/login.html";
}

window.logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('currentUser');
  window.location.href = "pages/login/login.html";
};