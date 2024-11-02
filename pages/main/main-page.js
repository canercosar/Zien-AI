import { getFirestore, collection, getDocs, addDoc, query, where, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getUserDetail, setUser } from "../../userOperation.js"
import { getCompanyDetail } from "../../companyOperation.js"
import { getCameraDetail } from "../../cameraOperation.js"

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

  let aCurrentUser = await getUserDetail(userId),
    aCurrentUserCompanyDetail = await getCompanyDetail(aCurrentUser[0]?.companyCode),
    aCurrentCameras = await getCameraDetail(aCurrentUser[0]?.companyCode, ""),
    aCurrentDepartman = aCurrentUserCompanyDetail[0]?.departments;

  localStorage.setItem("currentUser", aCurrentUser);
  document.getElementById('userName').textContent = aCurrentUser[0].name + " " + aCurrentUser[0].surname;
  document.getElementById('authName').textContent = aCurrentUser[0].title;
  document.getElementById('userPhoto').src = aCurrentUser[0].userPhoto;

  document.getElementById('companyName').textContent = aCurrentUserCompanyDetail[0].companyName;

  document.getElementById('cameraCount').textContent = aCurrentCameras?.length;
  document.getElementById('activeCameraCount').textContent = aCurrentCameras?.length;

  if (aCurrentUser[0].userPhoto !== "") {
    document.getElementById("profilePhotoDiv").style.display = "inline";
  } else {
    document.getElementById("profilePhotoDiv").style.display = "none";

  }
  if (aCurrentUser[0].isAdmin) {
    // Admin rozetini görünür yapın
    document.getElementById("adminBadge").style.display = "inline";
    document.getElementById("adminPages").style.display = "inline";
    document.getElementById("samplePages").style.display = "inline";
  } else {
    // Admin değilse gizli kalsın
    document.getElementById("adminBadge").style.display = "none";
    document.getElementById("adminPages").style.display = "none";
    document.getElementById("samplePages").style.display = "none";
  }


  // Dropdown menüyü dolduracak fonksiyon
  function populateDropdownMenu(items) {
    const dropdownMenu = document.getElementById("dynamicDropdownMenu");
    if (items) {
      // Her menü elemanını oluştur ve ekle
      items.forEach((item, index) => {
        const menuItem = document.createElement("a");
        menuItem.className = "dropdown-item";
        menuItem.href = "#";

        // İkon ve metni ekle
        const icon = document.createElement("i");
        icon.className = "mdi mdi-home-map-marker me-2 text-primary";
        menuItem.appendChild(icon);
        menuItem.appendChild(document.createTextNode(item.departmentName));

        dropdownMenu.appendChild(menuItem);

        // Menü elemanları arasına ayraç ekle (sonuncusundan sonra değil)
        if (index < items.length - 1) {
          const divider = document.createElement("div");
          divider.className = "dropdown-divider";
          dropdownMenu.appendChild(divider);
        }
      });
    } else {

    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case "AKTİF":
        return "badge badge-gradient-success";
      case "ERİŞİLEMİYOR":
        return "badge badge-gradient-warning";
      case "BEKLEMEDE":
        return "badge badge-gradient-info";
      case "KAPALI":
        return "badge badge-gradient-danger";
      default:
        return "badge badge-gradient-secondary";
    }
  }

  // Tabloyu dolduracak fonksiyon
  function populateCameraTable(cameras, departments) {
    const tableBody = document.getElementById("cameraTableBody");
    tableBody.innerHTML = ""; // Önceden olan verileri temizler

    cameras.forEach(camera => {
      const department = departments[0].departments.find(dep => dep.departmentId === camera.department);

      if (department) {
        camera.departmentId = department.departmentId;
        camera.departmentName = department.departmentName;
      }
      const row = document.createElement("tr");

      // Konum Hücresi
      const rtspCell = document.createElement("td");
      const rtspLink = document.createElement("a");

      // Bağlantı özelliklerini ayarla
      rtspLink.href = camera.rtsp;           // RTSP bağlantısını `href` özelliğine atar
      rtspLink.textContent = camera.rtsp; // Gösterilecek metin
      rtspLink.target = "_blank";            // Yeni sekmede açmak için

      rtspCell.appendChild(rtspLink);
      row.appendChild(rtspCell);

      // Durum Hücresi
      // const statusCell = document.createElement("td");
      // // const statusLabel = document.createElement("label");
      // // statusLabel.className = getStatusBadge(camera.department);
      // statusLabel.textContent = camera.department;
      // statusCell.appendChild(statusLabel);
      // row.appendChild(statusCell);

      const companyCodeCell = document.createElement("td");
      companyCodeCell.textContent = camera.companyCode + " (" + departments[0].companyName + ")";
      row.appendChild(companyCodeCell);

      const departmentCell = document.createElement("td");
      departmentCell.textContent = camera.department + " (" + camera.departmentName + ")";
      row.appendChild(departmentCell);

      const rtspUserCell = document.createElement("td");
      rtspUserCell.textContent = camera.rtspUser;
      row.appendChild(rtspUserCell);

      const rtspUserPassCell = document.createElement("td");
      rtspUserPassCell.textContent = camera.rtspPassword;
      row.appendChild(rtspUserPassCell);

      tableBody.appendChild(row);
    });
  }

  // Tabloyu doldur
  populateCameraTable(aCurrentCameras, aCurrentUserCompanyDetail);

  // Dropdown menüyü doldur
  populateDropdownMenu(aCurrentDepartman);

  if (!aCurrentUser.length > 0) {
    await setUser(userId);
  }

  // try {
  //   const q = query(collection(db, "companies"));
  //   const querySnapshot = await getDocs(q);

  //   querySnapshot.forEach((doc) => {
  //     // console.log(doc.data());
  //   });
  // } catch (e) {
  //   console.error("Veri Alınamadı ", e);
  // }
} else {
  window.location.href = "pages/login/login.html";
}

window.logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('currentUser');
  window.location.href = "pages/login/login.html";
};

