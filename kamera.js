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

export {populateCameraTable as populateCameraTable}