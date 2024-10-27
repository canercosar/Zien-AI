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
