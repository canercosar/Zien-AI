const userId = localStorage.getItem("userId");

if (userId) {
  // console.log("Giriş yapan kullanıcının UID'si:", userId);
} else {
  window.location.href = "pages/samples/login.html";
}
function logout() {
  // localStorage'daki userID'yi temizle
  localStorage.removeItem('userId');

  // Login sayfasına yönlendir
  window.location.href = "pages/login/login.html";
}