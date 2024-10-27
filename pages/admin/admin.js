import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getUserDetail, setUser } from "../../userOperation.js"

// Firebase yapılandırma bilgilerini buraya ekleyin
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
const userRegisterForm = document.getElementById("userRegisterFormId");
const modal = document.getElementById("statusErrorsModal");

userRegisterForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let oUserDetail = {
    assignDepartment: document.getElementById("InputAssingDepartmentId").value,
    companyCode: document.getElementById("InputCompanyCodeId").value,
    name: document.getElementById("InputUsername").value,
    surname: document.getElementById("InputSurname").value,
    title: document.getElementById("InputUserTitleId").value,
    userLoginId: document.getElementById("InputFirebaseUID").value,
    userPhoto: document.getElementById("InputUserPhotoId").value,
    email: document.getElementById("InputEmail").value,
    isAdmin: document.getElementById("InputFirebaseUID").value,
  };


  try {
    await setUser(oUserDetail);
  } catch (error) {
  }
});

// Kullanıcı sayfanın herhangi bir yerine tıkladığında modalı kapat
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
