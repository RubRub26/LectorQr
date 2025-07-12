// ======= TEMA OSCURO / CLARO =======

const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");
const body = document.body;

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggleBtn.addEventListener("click", function() {
  const currentTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

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
          const qrText = qrCode.data.trim();
          const isLink = qrText.startsWith("http://") || qrText.startsWith("https://");

          if (isLink) {
            output.innerHTML = `
              <p>Enlace detectado:</p>
              <a href="${qrText}" target="_blank">${qrText}</a>
            `;
          } else {
            output.innerHTML = `
              <p>Texto detectado:</p>
              <div style="margin-top:10px; word-wrap: break-word; color: var(--text-color);">${qrText}</div>
              <button onclick="copyText(\`${escapeQuotes(qrText)}\`)" class="copy-btn" style="margin-top:10px; cursor:pointer;">
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

dropZone.addEventListener("click", function() {
  fileInput.click();
});

// ======= FUNCIÓN COPIAR TEXTO =======

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert("Texto copiado al portapapeles"))
    .catch(() => alert("No se pudo copiar el texto"));
}

// ======= FUNCIÓN PARA ESCAPAR COMILLAS =======

function escapeQuotes(str) {
  return str.replace(/`/g, '\\`').replace(/\\/g, '\\\\');
}
