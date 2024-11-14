import { getUserDetail, setUser } from "./userOperation.js"
import { getCompanyDetail, updateCompany } from "./companyOperation.js"
import { getCameraDetail } from "./cameraOperation.js"
import { getNotifDetail } from "./notificationOperation.js"
import { populateCameraTable } from "./kamera.js"
import { populateCameraTablePage } from './pages/kameralar/cameraPage.js';
import { NotifTablePage } from './pages/bildirim/bildirim.js';
import { app, auth, db } from './firebaseConfig.js'; // Firebase yapılandırma dosyasını import et
import { NotificationHandler } from './notificationHandler.js'; // Bildirim handler'ı import et

const loadingOverlay = document.getElementById('loading');
const messaging = firebase.messaging();
let _currentTokenFCM;

// Sınıfın bir örneğini oluşturun ve metodu çağırın
const notificationHandler = new NotificationHandler();
notificationHandler.requestNotificationPermission();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then((registration) => {
      // console.log('Service worker registered:', registration);
    })
    .catch((error) => {
      // console.error('Error registering service worker:', error);
    });

}

messaging.onMessage((payload) => {
  const alertSound = document.getElementById("alertSound");
  alertSound.play();
  const modal = document.getElementById("fireAlertModal");
  const firePhoto = document.getElementById("firePhoto");

  firePhoto.src = payload.data.imageUrl;
  modal.style.display = "block";
});


const user = auth.currentUser;
const userId = localStorage.getItem("userId");

let aCurrentCameras, aCurrentUserCompanyDetail, aCurrentLogs;

if (userId) {
  let aCurrentUser = await getUserDetail(userId);
  aCurrentUserCompanyDetail = await getCompanyDetail(aCurrentUser[0]?.companyCode);
  aCurrentCameras = await getCameraDetail(aCurrentUser[0]?.companyCode, "");
  aCurrentLogs = await getNotifDetail(aCurrentUser[0]?.companyCode, "");
  let aCurrentDepartman = aCurrentUserCompanyDetail[0]?.departments;

  let aSystemTokens = aCurrentUserCompanyDetail[0].userFCMTokens?.length > 0 ? aCurrentUserCompanyDetail[0].userFCMTokens : [];
  let oCurrentToken = aSystemTokens.find(x => x.FCMToken === notificationHandler._currentTokenFCM);
  let oCurrentUser = aSystemTokens.find(x => x.userLoginId === aCurrentUser[0]?.userLoginId,);

  //aSystemTokens içindeki FCM Token'da userId unique olmalı ve bu id'nin duplicate olma durumunda güncelleme yapmalı
  let sBrand = navigator.userAgentData.brands.map(item => item.brand).join(', ');

  if (!oCurrentToken) {
    aSystemTokens.push({
      "FCMToken": notificationHandler._currentTokenFCM,
      "userLoginId": aCurrentUser[0]?.userLoginId,
      "brandDetails": sBrand,
      "platform": navigator.userAgentData.platform
    });

    aCurrentUserCompanyDetail[0].userFCMTokens = aSystemTokens;

    updateCompany({
      ...aCurrentUserCompanyDetail[0]
    });
  }

  if (oCurrentUser) {
    // userLoginId'ye göre filtreleme ve FCMToken'ı güncelleme
    let filteredTokens = aSystemTokens.reduce((acc, curr) => {
      // Aynı userLoginId'ye sahip öğe zaten varsa FCMToken'ı güncelle
      let existing = acc.find(item => item.userLoginId === curr.userLoginId);
      if (existing) {
        existing.FCMToken = notificationHandler._currentTokenFCM;  // Yeni token'ı yazıyoruz
        existing.brandDetails = sBrand;
        existing.platform = navigator.userAgentData.platform;
      } else {
        acc.push(curr);  // Eğer duplicate yoksa, öğeyi ekliyoruz
      }
      return acc;
    }, []);

    aCurrentUserCompanyDetail[0].userFCMTokens = filteredTokens;

    updateCompany({
      ...aCurrentUserCompanyDetail[0]
    });

  }

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

  populateCameraTable(aCurrentCameras, aCurrentUserCompanyDetail);

  // Dropdown menüyü doldur
  populateDropdownMenu(aCurrentDepartman);

  if (!aCurrentUser.length > 0) {
    await setUser(userId);
  }

  loadingOverlay.style.display = 'none';
} else {
  window.location.href = "pages/login/login.html";
}

window.loadContent = (page) => {
  fetch(page)
    .then(response => {
      if (!response.ok) {
        throw new Error('İçerik yüklenemedi');
      }
      return response.text();
    })
    .then(data => {
      const loadingOverlay = document.getElementById('loading');
      loadingOverlay.style.display = 'flex';
      setTimeout(() => {
        const mainContent = document.getElementById("main-content");
        mainContent.innerHTML = data;
        const scriptSrc = page.replace('.html', '.js');
        const existingScript = document.getElementById("dynamic-script");
        if (existingScript) {
          existingScript.remove();
        }
        const script = document.createElement("script");
        script.src = scriptSrc;
        script.type = "module";
        script.id = "dynamic-script";
        script.onload = () => {
          populateCameraTablePage(aCurrentCameras, aCurrentUserCompanyDetail);
          NotifTablePage(aCurrentLogs);
        }
        document.body.appendChild(script);
        const links = document.querySelectorAll('.nav-link');

        // Tüm nav-link'lerden active sınıfını kaldır
        links.forEach(link => {
          link.classList.remove('activeLinkC');
        });

        // Aktif olan linke active sınıfını ekle
        const activeLink = Array.from(links).find(link => link.getAttribute('onclick')?.includes(page));
        if (activeLink) {
          activeLink.classList.add('activeLinkC');
        }
        loadingOverlay.style.display = 'none';
      }, 300);
    })
    .catch(error => {
      document.getElementById("main-content").innerHTML = "<p>İçerik yüklenemedi: " + error.message + "</p>";
    });
};

function fetchNotifications(notifications) {
  const sortedNotifications = notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentNotifications = sortedNotifications.slice(0, 3);

  const notificationList = document.getElementById("notificationList");
  notificationList.innerHTML = "";

  recentNotifications.forEach((notif) => {
    const listItem = document.createElement("a");
    listItem.classList.add("dropdown-item", "preview-item");

    listItem.innerHTML = `
      <div >
        <img src="${notif.imageUrl}" alt="Notification Image" style="width: 40px; height: auto;">
      </div>
      <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
        <h6 class="preview-subject font-weight-normal mb-1">Yangın Bildirimi!</h6>
        <p class="text-gray ellipsis mb-0"> Şirket Kodu: ${notif.companyCode} </p>
      </div>
    `;

    notificationList.appendChild(listItem);
    const divider = document.createElement("div");
    divider.classList.add("dropdown-divider");
    notificationList.appendChild(divider);
  });
}

fetchNotifications(aCurrentLogs);

window.toggleBellIcon = () => {
  const icon = document.getElementById("notificationIcon");
  if (icon.classList.contains("mdi-bell-outline")) {
    icon.classList.remove("mdi-bell-outline");
    icon.classList.add("mdi-bell");
  } else {
    icon.classList.remove("mdi-bell");
    icon.classList.add("mdi-bell-outline");
  }
}

function closeModal(choice) {
  if (choice) {
    alert("Evet seçildi.");
  } else {
    alert("Hayır seçildi.");
  }
  document.getElementById("fireAlertModal").style.display = "none";
  document.getElementById("alertSound").pause();
}

window.logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('currentUser');
  window.location.href = "pages/login/login.html";
};

