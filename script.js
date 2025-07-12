// ======= TEMA OSCURO / CLARO =======

// Obtener elementos
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");
const body = document.body;

// Leer el tema guardado o poner 'light' por defecto
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

// Cambiar tema al hacer clic
themeToggleBtn.addEventListener("click", function() {
  const currentTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

// Función para aplicar tema e icono
function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// ======= LECTOR DE QR =======

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const output = document.getElementById("output");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");

fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
        if (qrCode) {
          const dataType = qrCode.data.startsWith("http") ? "Enlace detectado" : "Texto detectado";
          output.innerHTML = `${dataType}: <a href="${qrCode.data}" target="_blank">${qrCode.data}</a>`;
        } else {
          output.innerHTML = "QR ilegible o no detectado.";
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

dropZone.addEventListener("click", function() {
  fileInput.click();
});
