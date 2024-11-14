import { getUserDetail, setUser } from "../../userOperation.js"
import { getCompanyDetail, setCompany } from "../../companyOperation.js"
import { getCameraDetail, setCamera } from "../../cameraOperation.js"

const modal = document.getElementById("statusErrorsModal");
const multiInputContainerDepartment = document.getElementById('multiInputContainerDepartment');
const multiInputContainerDepartmentName = document.getElementById('multiInputContainerDepartmentName');
const inputFieldDepartment = document.getElementById('InputDepartment');
const inputFieldDepartmentName = document.getElementById('InputDepartmentName');

async function onSaveUser(event) {
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
}

async function onSaveCompanyCode(event) {
  event.preventDefault();

  let aDepartments = getDepartmentTags(),
    aDepartmentsName = getDepartmentNameTags();

  if (aDepartments.length !== aDepartmentsName.length) {
    //Department sayısı tutarsız uyarısı ver.
  }

  let oCompany = {
    "adress": document.getElementById("InputCompanyAdress").value,
    "companyCode": document.getElementById("InputCompanyCode").value,
    "companyName": document.getElementById("InputCompanyName").value,
    "departments": []
  };

  for (let index = 0; index < aDepartments.length; index++) {
    const sDepartment = aDepartments[index];

    oCompany.departments.push({
      departmentId: sDepartment,
      departmentName: aDepartmentsName[index]
    });
  }

  try {
    await setCompany(oCompany);
    const statusSuccessModal = new bootstrap.Modal(document.getElementById('statusSuccessModalUser'));
    statusSuccessModal?.show();
  } catch (error) {
    // console.log(error);
  }

}

// Tüm etiketleri depolamak için bir dizi tanımlayın
let departmentTags = [];
let departmentNameTags = [];

// Etiket ekleme fonksiyonu
function addTag(text, inputField, multiInputContainer, tagsArray) {
  const tag = document.createElement('span');
  tag.classList.add('tag');
  tag.textContent = text;
  tag.style.cssText = 'padding: 5px; background-color: #e0e0e0; border-radius: 5px; margin-right: 5px;';

  const closeButton = document.createElement('span');
  closeButton.textContent = ' x';
  closeButton.style.cssText = 'margin-left: 5px; cursor: pointer;';

  closeButton.addEventListener('click', () => {
    multiInputContainer.removeChild(tag);
    // Diziden etiketi kaldırın
    const index = tagsArray.indexOf(text);
    if (index !== -1) {
      tagsArray.splice(index, 1);
    }
  });

  tag.appendChild(closeButton);
  multiInputContainer.insertBefore(tag, inputField);

  // Etiketi diziye ekleyin
  tagsArray.push(text);
}

// Departman etiketi eklerken çağrılan fonksiyon
async function onKeydownDepartment(event) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    const text = inputFieldDepartment.value.trim();
    if (text) {
      addTag(text, inputFieldDepartment, multiInputContainerDepartment, departmentTags);
      inputFieldDepartment.value = '';
    }
  }
}

// Departman adı etiketi eklerken çağrılan fonksiyon
async function onKeydownDepartmentName(event) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    const text = inputFieldDepartmentName.value.trim();
    if (text) {
      addTag(text, inputFieldDepartmentName, multiInputContainerDepartmentName, departmentNameTags);
      inputFieldDepartmentName.value = '';
    }
  }
}

function getDepartmentTags() {
  return departmentTags;
}

function getDepartmentNameTags() {
  return departmentNameTags;
}

async function onChangeUserUID(event) {
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
}

async function onSaveCamera(event) {
  event.preventDefault();

  let oCamera = {
    companyCode: document.getElementById("InputCompanyCodeForCamera").value,
    department: document.getElementById("InputDepartmentForCamera").value,
    rtsp: document.getElementById("InputRTSP").value,
    rtspUser: document.getElementById("InputRTSPUser").value,
    rtspPassword: document.getElementById("InputRTSPPassword").value
  };

  try {
    await setCamera(oCamera);
    const statusSuccessModal = new bootstrap.Modal(document.getElementById('statusSuccessModalUser'));
    statusSuccessModal?.show();
  } catch (error) {
  }
}

window.onSaveCamera = onSaveCamera;
window.onSaveCompanyCode = onSaveCompanyCode;
window.onKeydownDepartment = onKeydownDepartment;
window.onKeydownDepartmentName = onKeydownDepartmentName;
window.onSaveUser = onSaveUser;
window.onChangeUserUID = onChangeUserUID;

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
