import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const db = getFirestore(app);
const loginForm = document.getElementById("login-form");
const modal = document.getElementById("statusErrorsModal");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("exampleInputEmail1").value;
  const password = document.getElementById("exampleInputPassword1").value;
  
  try {
    // Kullanıcı girişi için Firebase kimlik doğrulama
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Giriş başarılı
    const user = userCredential.user,
          userID = user.uid;
    console.log("Giriş başarılı:", userID);
    localStorage.setItem("userId", userID); 
    window.location.href = "../../index.html";

    // Firebase Firestore veritabanına belge ekleme işlemi
    // try {
    //   const uid = user.uid; // Kimlik doğrulaması yapılmış kullanıcının UID'sini al
    //   const docRef = await addDoc(collection(db, "companies"), {
    //     companyCode: "1009",
    //     userUid: uid // Kullanıcı UID'sini belgeye ekle
    //   });
    //   console.log("Belge başarıyla yazıldı, ID: ", docRef.id);

    //   // const q = query(collection(db, "companies"), where("companyCode", "==", "1005"));
    //   //   const querySnapshot = await getDocs(q);
    //   //   querySnapshot.forEach((doc) => {
    //   //     console.log(`${doc.id} => ${doc.data().companyCode}`);
    //   //   });
    // } catch (e) {
    //   console.error("Bilgi Alınamadı ", e);
    // }
  } catch (error) {
    // errorMessage.innerText = `Kullanıcı Bilgileri Yanlış!`;
    const statusErrorsModal = new bootstrap.Modal(document.getElementById('statusErrorsModal'));
    statusErrorsModal.show();
  }
});

// Kullanıcı sayfanın herhangi bir yerine tıkladığında modalı kapat
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
