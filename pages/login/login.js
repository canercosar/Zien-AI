import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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
const loginForm = document.getElementById("login-form");
const modal = document.getElementById("statusErrorsModal");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const email = document.getElementById("formInputEmail").value;
  const password = document.getElementById("formInputPassword").value;
  
  try {
    // Kullanıcı girişi için Firebase kimlik doğrulama
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Giriş başarılı
    window.location.href = "../../index.html";
    localStorage.setItem("userId", userCredential.user.uid)

  } catch (error) {
    // errorMessage.innerText = `Kullanıcı Bilgileri Yanlış!`;
    const statusErrorsModal = new bootstrap.Modal(document.getElementById('statusErrorsModal'));
    statusErrorsModal.show();
  }
});

// Kullanıcı sayfanın herhangi bir yerine tıkladığında modalı kapat
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
