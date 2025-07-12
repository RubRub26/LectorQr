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
// ======= LECTOR DE QR MEJORADO =======

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
          const isLink = qrCode.data.startsWith("http://") || qrCode.data.startsWith("https://");
          if (isLink) {
            output.innerHTML = `
              <p>Enlace detectado:</p>
              <a href="${qrCode.data}" target="_blank">${qrCode.data}</a>
            `;
          } else {
            output.innerHTML = `
              <p>Texto detectado:</p>
              <div style="margin-top:10px; word-wrap: break-word; color: var(--text-color);">${qrCode.data}</div>
              <button onclick="copyText('${escapeQuotes(qrCode.data)}')" class="copy-btn">
                <i class="fa fa-copy"></i> Copiar Texto
              </button>
            `;
          }
        } else {
          output.innerHTML = "QR ilegible o no detectado.";
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ======= BOTÓN DE COPIAR =======

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert("Texto copiado al portapapeles");
    })
    .catch(err => {
      alert("No se pudo copiar el texto");
    });
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

