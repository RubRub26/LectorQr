// Cambiar el tema al hacer clic en el botón
document.getElementById("theme-toggle").addEventListener("click", function() {
  const body = document.body;
  // Alternar entre 'light' y 'dark'
  body.setAttribute("data-theme", body.getAttribute("data-theme") === "dark" ? "light" : "dark");

  // Cambiar el icono del botón dependiendo del tema
  const themeIcon = document.querySelector(".theme-toggle-btn i");
  if (body.getAttribute("data-theme") === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
});

// Variables para el lector de QR desde la imagen
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const output = document.getElementById("output");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");

// **Leer imagen cuando se selecciona un archivo**
fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        // Establecer el tamaño del canvas a la imagen
        canvas.width = img.width;
        canvas.height = img.height;
        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Intentar leer el código QR
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
        if (qrCode) {
          // Si se detectó un código QR, mostrar el resultado
          const dataType = (qrCode.data.startsWith("http") ? "Enlace detectado" : "Texto detectado");
          output.innerHTML = `${dataType}: <a href="${qrCode.data}" target="_blank">${qrCode.data}</a>`;
        } else {
          // Si no se detecta código QR
          output.innerHTML = "QR ilegible o no detectado.";
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// **Abrir el selector de archivos cuando se hace clic en la zona de arrastre**
dropZone.addEventListener("click", function() {
  fileInput.click();
});
