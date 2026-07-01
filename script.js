const card = document.getElementById("letter-card");
const content = document.getElementById("card-content");
const coverText = document.getElementById("cover-text");
const btnNo = document.getElementById("btn-no");
const successView = document.getElementById("success-view");

// 1. Abre la carta al hacerle click
function openLetter() {
  if (card.classList.contains("closed")) {
    card.classList.remove("closed");
    coverText.style.display = "none";
    content.style.display = "flex";
  }
}

// 2. Mueve el botón "No" de forma aleatoria por la pantalla
function moveButton(event) {
  // Evita que el evento cierre o altere la carta de fondo
  event.stopPropagation();

  const padding = 50;
  // Restamos el ancho y alto del botón para que no se salga de los bordes
  const maxX = window.innerWidth - btnNo.offsetWidth - padding;
  const maxY = window.innerHeight - btnNo.offsetHeight - padding;

  // Cálculo de la posición aleatoria
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  // Aplicamos fixed para que se mueva por toda la ventana del navegador
  btnNo.style.position = "fixed";
  btnNo.style.left = randomX + "px";
  btnNo.style.top = randomY + "px";
}

// 3. Acción al presionar "SÍ"
function accepted(event) {
  event.stopPropagation();

  // Ocultamos la vista de la pregunta
  content.style.display = "none";

  // Forzamos la desaparición total del botón "No" en toda la pantalla
  btnNo.style.setProperty("display", "none", "important");

  // Mostramos la sorpresa final con tu galería de fotos
  successView.style.display = "block";
}
