// 🌙 Modo claro/oscuro con persistencia
function initDarkMode() {
  const darkToggle = document.getElementById("darkToggle");
  const currentTheme = localStorage.getItem("theme");

  // Aplicar el tema basado en la configuración guardada
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkToggle.textContent = "☀️ Modo Claro";
    darkToggle.setAttribute("aria-pressed", "true");
  }

  // Evento para cambiar entre modo claro y oscuro
  darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    darkToggle.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
    localStorage.setItem("theme", isDark ? "dark" : "light");
    darkToggle.setAttribute("aria-pressed", isDark);
  });
}

// ⬆ Botón "Ir arriba" con visibilidad dinámica
function initScrollTop() {
  const scrollTopBtn = document.getElementById("scrollTop");

  // Mostrar el botón solo cuando se ha desplazado hacia abajo
  window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  // Desplazar suavemente hacia arriba al hacer clic
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 🍔 Menú responsive con accesibilidad
function initHamburgerMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !expanded);
    menu.classList.toggle("open");
    menuToggle.classList.toggle("open");
  });
}

// 🚀 Inicializar todo al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initScrollTop();
  initHamburgerMenu();
  initLightbox();

  // visibilidad del foco para usuarios de teclado
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
    }
  });

  // Enlaces externos 
  Array.from(document.links).forEach(link => {
    try {
      const origin = new URL(link.href).origin;
      if (origin !== location.origin) {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    } catch (err) {
      console.error('Error procesando enlace:', err);
    }
  });
});

// Lightbox para la galería de imágenes
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  let currentIndex = -1;

  // Función para abrir la galería
  const openLightbox = index => {
    const btn = galleryItems[index];
    const src = btn.dataset.src;
    const caption = btn.dataset.caption || '';
    if (!src) return;

    lbImage.src = src;
    lbImage.alt = btn.querySelector('img')?.alt || '';
    lbCaption.textContent = caption;
    lightbox.setAttribute('aria-hidden', 'false');
    currentIndex = index;
    lbClose.focus();
  };

  // Función para cerrar la galería
  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    currentIndex = -1;
  };

  // Añadir eventos a los elementos de la galería
  galleryItems.forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(i));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  // Navegación en la lightbox
  lbPrev?.addEventListener('click', () => {
    if (currentIndex > 0) openLightbox(currentIndex - 1);
  });
  lbNext?.addEventListener('click', () => {
    if (currentIndex < galleryItems.length - 1) openLightbox(currentIndex + 1);
  });

  lbClose?.addEventListener('click', closeLightbox);

  // Cerrar lightbox con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
      closeLightbox();
    }
    if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowLeft' && currentIndex > 0) openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) openLightbox(currentIndex + 1);
    }
  });
}

function buscarTxt(texto) {
  let cuerpo = document.body;
  let iter = document.createNodeIterator(cuerpo, NodeFilter.SHOW_TEXT);
  let actual, marca = "~";
  let buscar = new RegExp("(" + texto + ")", 'ig');
  let reempl = new RegExp(marca + "(" + texto + ")" + marca, 'ig');
  let txt = cuerpo.innerHTML, reemp;
  cuerpo.innerHTML = txt.replaceAll('<enc[^>]*>(.*?)<\\/enc > /ig, "$1"');
  if (texto != '') {
    let pos = cuerpo.innerText.search(buscar);
    if (pos >= 0) {
      while (actual = iter.nextNode()) {
        actual.data = actual.data.replaceAll(buscar, marca + '$1' + marca);
      }
      txt = cuerpo.innerHTML;
      reemp = '<enc style="background:#deb1b1;">$1</enc>'; // Estilo para el resaltado
      cuerpo.innerHTML = txt.replaceAll(reempl, reemp);
      document.querySelector('enc').scrollIntoView(); // Desplazarse a la primera coincidencia
    } else {
      alert(texto + " no encontrado");
    }
  }
}