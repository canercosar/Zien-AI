import { getUserDetail, setUser } from "../../userOperation.js"
import { getCompanyDetail } from "../../companyOperation.js"
import { getNotifDetail } from "../../notificationOperation.js"

import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { app, auth, db } from '../../firebaseConfig.js';

const userId = localStorage.getItem("userId");

let aCurrentUser = await getUserDetail(userId),
  aCurrentNotif = await getNotifDetail(aCurrentUser[0]?.companyCode, "");


function NotifTablePage(notification) {
  const tableBody = document.getElementById("notifTableDinamic");
  if (tableBody) {
    tableBody.innerHTML = ""; // Önceden olan verileri temizler

    notification.forEach(notif => {
      const row = document.createElement("tr");

      if (notif.isFire) {
        row.style.borderLeft = "4px solid #cd1111"; // Sola kırmızı bir kenarlık ekler
        row.style.boxShadow = "2px 2px 8px rgba(205, 0, 0, 0.3)"; // Hafif kırmızı gölge ekler
        row.style.borderRadius = "4px"; // Hafif yuvarlatma
      }

      // Görsel Hücresi
      const imageCell = document.createElement("td");
      const image = document.createElement("img");

      // Görsel özelliklerini ayarla
      image.src = notif.imageUrl;
      image.alt = "Image";
      image.style.width = "100px";
      image.style.height = "auto";
      image.style.cursor = "pointer";

      // Görsele tıklanınca modal göster
      image.addEventListener("click", () => {
        document.getElementById("modalImage").src = notif.imageUrl;
        document.getElementById("imageModal").style.display = "flex";
      });

      imageCell.appendChild(image);
      row.appendChild(imageCell);

      const companyCodeCell = document.createElement("td");
      companyCodeCell.textContent = notif.companyCode;
      row.appendChild(companyCodeCell);

      // Kontrol durumu hücresi
      const checkStatusCell = document.createElement("td");
      if (notif.isCheck) {
        checkStatusCell.textContent = "Kontrol Edildi";
        checkStatusCell.style.color = "green";
        checkStatusCell.style.fontWeight = "bold";
      } else {
        checkStatusCell.textContent = "Kontrol Edilmedi";
        checkStatusCell.style.color = "orange";
        checkStatusCell.style.fontWeight = "bold";
      }
      row.appendChild(checkStatusCell);

      // Evet ve Hayır butonları hücresi
      if (!notif.isCheck) {
        const actionCell = document.createElement("td");

        // Evet butonu
        const yesButton = document.createElement("button");
        yesButton.textContent = "Evet";
        yesButton.className = "btn btn-gradient-danger btn-rounded table_btn";
        yesButton.onclick = () => handleButtonClick(notif, true); // Evet butonuna tıklanınca işlev çağrılır
        actionCell.appendChild(yesButton);

        // Hayır butonu
        const noButton = document.createElement("button");
        noButton.textContent = "Hayır";
        noButton.className = "btn btn-gradient-warning btn-rounded table_btn";
        noButton.onclick = () => handleButtonClick(notif, false); // Hayır butonuna tıklanınca işlev çağrılır
        actionCell.appendChild(noButton);

        row.appendChild(actionCell);
      } else {
        const actionCell = document.createElement("td");
        if (notif.isFire) {
          actionCell.textContent = "Yangın Doğrulandı!";
          actionCell.style.color = "red";
          actionCell.style.fontWeight = "bold";
          checkStatusCell.style.color = "red";
          row.appendChild(actionCell);
        } else {
          actionCell.textContent = "Yangın Görünmedi";
          actionCell.style.color = "green";
          actionCell.style.fontWeight = "bold";
          row.appendChild(actionCell);
        }

      }

      if (notif.isCheck) {
        const recheckCell = document.createElement("td");

        const recheckButton = document.createElement("button");
        recheckButton.textContent = "Tekrar Değerlendir";
        recheckButton.className = "btn btn-gradient-dark btn-rounded";
        recheckButton.onclick = () => openRecheckModal(notif.imageUrl, notif);

        recheckCell.appendChild(recheckButton);
        row.appendChild(recheckCell);
      }

      tableBody.appendChild(row);
    });
  }
}

function openRecheckModal(imageUrl, notif) {
  document.getElementById("modalCheckImage").src = imageUrl;
  document.getElementById("imageCheckModal").style.display = "flex";

  // Modal içinde Evet butonu
  const confirmButton = document.getElementById("confirmButton");
  const notConfirmButton = document.getElementById("notConfirmButton");
  confirmButton.onclick = () => handleButtonClick(notif, true);
  notConfirmButton.onclick = () => handleButtonClick(notif, false);
}

async function handleButtonClick(notif, isConfirmed) {
  notif.isCheck = true; // `isCheck` alanını true olarak günceller
  notif.isFire = isConfirmed; // `isFire` alanını buton durumuna göre ayarlar

  const logData = {
    id: notif.id,
    timestamp: new Date().toISOString(),
    isCheck: notif.isCheck,
    isFire: notif.isFire, // `isFire` alanını ekler
    companyCode: notif.companyCode,
    logId: notif.logId,
    imagePath: notif.imagePath,
    imageUrl: notif.imageUrl,
    industryZoneId: notif.industryZoneId
  };

  try {
    // Güncellenmiş veriyi Firebase'e kaydeder
    await fnSetLogs(logData)
    const checkmodal = document.getElementById("imageCheckModal");
    checkmodal.style.display = "none";
  } catch (error) {

  }

  // Sayfayı yeniden yüklemek veya tabloyu güncellemek için fonksiyonu çağırın
  NotifTablePage([logData]); // Örnek olarak sadece logData'yı günceller
}

// Modal'ın dışına tıklanınca kapatmak için işlev
window.onclick = function (event) {
  const modal = document.getElementById("imageModal");
  const checkmodal = document.getElementById("imageCheckModal");
  if (event.target === modal) {
    modal.style.display = "none";
  } else if (event.target === checkmodal) {
    checkmodal.style.display = "none";
  }
};

const fnSetLogs = async (oLogs) => {
  await setDoc(doc(db, "logs", oLogs.id), oLogs);
};


NotifTablePage(aCurrentNotif);

export { NotifTablePage };