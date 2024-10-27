import { getUserDetail, setUser } from "../../userOperation.js"

const userCreateButton = document.getElementById("userCreateButtonId");
const userUID = document.getElementById("InputFirebaseUID");
const modal = document.getElementById("statusErrorsModal");

userCreateButton.addEventListener("click", async (event) => {
  event.preventDefault();

  let oUserDetail = {
    assignDepartment: document.getElementById("InputAssignDepartmentId").value,
    companyCode: document.getElementById("InputCompanyCodeId").value,
    name: document.getElementById("InputUsername").value,
    surname: document.getElementById("InputSurname").value,
    title: document.getElementById("InputUserTitleId").value,
    userLoginId: document.getElementById("InputFirebaseUID").value,
    userPhoto: document.getElementById("InputUserPhotoId").value,
    email: document.getElementById("InputEmail").value,
    isAdmin: document.getElementById("CheckBoxIsAdminId").checked
  };

  try {
    await setUser(oUserDetail);
    const statusSuccessModal = new bootstrap.Modal(document.getElementById('statusSuccessModalUser'));
    statusSuccessModal?.show();
  } catch (error) {
  }
});

const multiInputContainerDepartment = document.getElementById('multiInputContainerDepartment');
const multiInputContainerDepartmentName = document.getElementById('multiInputContainerDepartmentName');
const inputFieldDepartment = document.getElementById('InputDepartment');
const inputFieldDepartmentName = document.getElementById('InputDepartmentName');

// Fonksiyon: Etiket Ekle
function addTag(text, inputField, multiInputContainer) {
  const tag = document.createElement('span');
  tag.classList.add('tag');
  tag.textContent = text;
  tag.style.cssText = 'padding: 5px; background-color: #e0e0e0; border-radius: 5px; margin-right: 5px;';

  const closeButton = document.createElement('span');
  closeButton.textContent = ' x';
  closeButton.style.cssText = 'margin-left: 5px; cursor: pointer;';

  closeButton.addEventListener('click', () => {
    multiInputContainer.removeChild(tag);
  });

  tag.appendChild(closeButton);
  multiInputContainer.insertBefore(tag, inputField);
}

// Olay Dinleyici: Enter veya Virgül Tuşu ile Değer Ekle
inputFieldDepartment.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    const text = inputFieldDepartment.value.trim();
    if (text) {
      addTag(text, inputFieldDepartment, multiInputContainerDepartment);
      inputFieldDepartment.value = ''; // Giriş alanını temizle
    }
  }
});

inputFieldDepartmentName.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    const text = inputFieldDepartmentName.value.trim();
    if (text) {
      addTag(text, inputFieldDepartmentName, multiInputContainerDepartmentName);
      inputFieldDepartmentName.value = ''; // Giriş alanını temizle
    }
  }
});


userUID.addEventListener("change", async (event) => {
  event.preventDefault();

  let sUserUID = document.getElementById("InputFirebaseUID").value;
  if (sUserUID !== "") {
    try {
      let aUsers = await getUserDetail(sUserUID),
        oUser = aUsers[0];

      document.getElementById("InputAssignDepartmentId").value = oUser.assignDepartment;
      document.getElementById("InputCompanyCodeId").value = oUser.companyCode;
      document.getElementById("InputUsername").value = oUser.name;
      document.getElementById("InputSurname").value = oUser.surname;
      document.getElementById("InputUserTitleId").value = oUser.title;
      document.getElementById("InputUserPhotoId").value = oUser.userPhoto;
      document.getElementById("InputEmail").value = oUser.email;
      document.getElementById("CheckBoxIsAdminId").checked = oUser.isAdmin;

    } catch (error) {
    }
  }

});

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
