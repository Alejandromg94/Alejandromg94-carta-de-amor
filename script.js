const card = document.getElementById("letter-card");
const content = document.getElementById("card-content");
const coverText = document.getElementById("cover-text");
const btnNo = document.getElementById("btn-no");
const successView = document.getElementById("success-view");
const backgroundMusic = document.getElementById("background-music");

let backgroundMusicStarted = false;
let musicTimeoutId = null;
let musicAudioContext = null;

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

function startSynthMelody() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return;
  }

  if (musicAudioContext) {
    return;
  }

  musicAudioContext = new AudioContextCtor();
  const melody = [
    523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 493.88, 523.25,
  ];
  let noteIndex = 0;

  const playNextNote = () => {
    if (!backgroundMusicStarted) {
      return;
    }

    const frequency = melody[noteIndex % melody.length];
    const oscillator = musicAudioContext.createOscillator();
    const gainNode = musicAudioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.0001, musicAudioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.02,
      musicAudioContext.currentTime + 0.02,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      musicAudioContext.currentTime + 0.46,
    );

    oscillator.connect(gainNode);
    gainNode.connect(musicAudioContext.destination);

    oscillator.start(musicAudioContext.currentTime);
    oscillator.stop(musicAudioContext.currentTime + 0.5);

    noteIndex += 1;
    musicTimeoutId = window.setTimeout(playNextNote, 400);
  };

  musicAudioContext.resume().then(playNextNote);
}

function startBackgroundMusic() {
  if (backgroundMusicStarted) {
    return;
  }

  backgroundMusicStarted = true;

  if (backgroundMusic) {
    backgroundMusic.volume = 0.25;
    backgroundMusic.currentTime = 0;

    const playPromise = backgroundMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        startSynthMelody();
      });
      return;
    }
  }

  startSynthMelody();
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

  // Iniciamos la melodía suave al aceptar
  startBackgroundMusic();
}
