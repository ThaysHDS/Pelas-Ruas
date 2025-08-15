document.addEventListener("DOMContentLoaded", function () {
  // Constantes e seletores iniciais
  const MOBILE_BREAKPOINT = 768;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const header = document.querySelector("header.navbar");
  const btnMobile = document.getElementById("toggle-dark"); // botão de tema no mobile
  const btnDesktop = document.getElementById("toggle-dark-desktop"); // botão de tema no desktop
  const btnHamburguer = document.getElementById("menu-toggle"); // botão hamburguer no mobile
  const logoImg = document.getElementById("logo-img");
  let sortableInstance = null;

  // Atualiza a logo conforme o tema
  function updateLogo() {
    if (!logoImg) return;
    logoImg.src = document.body.classList.contains("dark-mode")
      ? "img/logo_f5f5f5.svg"
      : "img/logo.svg";
  }

  // Inicializa o dark mode com base no localStorage ou preferências do navegador
  initDarkMode();

  // Inicializa a funcionalidade de ordenação com SortableJS (desktop apenas)
  function initializeSortable() {
    const gallery = document.getElementById("interactive-gallery");
    if (gallery && !isMobile && !sortableInstance) {
      sortableInstance = new Sortable(gallery, {
        animation: 200,
        draggable: ".col-6, .col-12",
        ghostClass: "sortable-ghost",
      });
    }
  }

  initializeSortable();

  // Remove classes de ordenação ao redimensionar para mobile, reinicializa ao voltar para desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      document.querySelectorAll(".col-6, .col-12").forEach((item) => {
        item.classList.remove("sortable-ghost");
      });
    } else {
      initializeSortable();
    }
  });

  // Botão de voltar ao topo aparece ao rolar para baixo
  const scrollBtn = document.querySelector(".scroll-top-btn");

  window.addEventListener("scroll", () => {
    if (scrollBtn)
      scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Inicialização do AOS (animações de scroll)
  AOS.init();

  // Vanilla Tilt no desktop para dar efeito de tilt aos elementos
  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    VanillaTilt.init(document.querySelectorAll(".tilt-cell"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }

  // Efeito de giroscópio no mobile para elementos tilt
  if (isMobile && window.DeviceOrientationEvent) {
    const handleOrientation = (event) => {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      document.querySelectorAll(".tilt-cell").forEach((el) => {
        const tiltX = gamma / 2;
        const tiltY = beta / 4;
        el.style.transform = `rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
      });
    };

    // Solicita permissão no iOS
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            console.warn("Permissão negada para giroscópio.");
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  // Fancybox para imagens ou conteúdos com modal animado
  Fancybox.bind("[data-fancybox]", {
    dragToClose: true,
    groupAll: true,
    animated: true,
    showClass: "fancybox-zoomIn",
    hideClass: "fancybox-zoomOut",
  });

  // Slider automático para elementos fade no mobile
  if (isMobile) {
    const slides = document.querySelectorAll(".fade-slide");
    let current = 0;

    function show(i) {
      slides.forEach((s, idx) => {
        s.style.opacity = idx === i ? "1" : "0";
        s.style.zIndex = idx === i ? "1" : "0";
      });
    }

    if (slides.length > 0) {
      show(current);
      setInterval(() => {
        current = (current + 1) % slides.length;
        show(current);
      }, 4000);
    }
  }

  // Botão “Veja mais” revela itens ocultos no grid
  const btnVerMais = document.getElementById("verMaisBtn");
  if (btnVerMais) {
    btnVerMais.addEventListener("click", () => {
      const hiddenItems = document.querySelectorAll(
        "#interactive-gallery .gallery-item.d-none"
      );

      hiddenItems.forEach((item, index) => {
        item.classList.remove("d-none");
        if (isMobile) {
          setTimeout(() => {
            item.classList.add("show");
          }, 100 * index);
        }
      });

      btnVerMais.style.display = "none";
    });
  }

  // Tooltips Bootstrap com desaparecimento automático
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipTriggerList.forEach((el) => {
    const tooltip = new bootstrap.Tooltip(el, {
      placement: "right",
      fallbackPlacements: ["top", "left"],
      boundary: "viewport",
      trigger: "manual",
    });

    el.addEventListener("mouseenter", () => {
      tooltip.show();
      setTimeout(() => {
        tooltip.hide();
      }, 2000);
    });

    el.addEventListener("mouseleave", () => {
      tooltip.hide();
    });
  });

  // Efeito de revelação em hover nas fotos com classe .photo-reveal
  document.querySelectorAll(".photo-reveal").forEach((container) => {
    const img = container.querySelector(".reveal-image");

    container.addEventListener("mouseenter", () => {
      if (!img.classList.contains("show")) {
        img.classList.add("show");
      }
    });
  });

  // Inicializa dark mode com base no localStorage ou sistema
  function initDarkMode() {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentMode = localStorage.getItem("theme");

    const isDark = currentMode === "dark" || (!currentMode && prefersDark);
    document.body.classList.toggle("dark-mode", isDark);
    header.classList.toggle("navbar-dark", isDark);
    header.classList.toggle("navbar-light", !isDark);

    // Aplica classes nos dois botões, se existirem
    [btnMobile, btnDesktop, btnHamburguer].forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle("btn-outline-light", isDark);
      btn.classList.toggle("btn-outline-dark", !isDark);

      // Evento de clique para alternar tema
      btn.addEventListener("click", () => {
        toggleDarkMode();
        const newMode = document.body.classList.contains("dark-mode")
          ? "dark"
          : "light";
        localStorage.setItem("theme", newMode);
      });
    });

    updateLogo(); // Atualiza logo com base no tema
  }

  // Alterna dark/light mode
  function toggleDarkMode() {
    const isDark = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", isDark);
    header.classList.toggle("navbar-dark", isDark);
    header.classList.toggle("navbar-light", !isDark);

    // Atualiza classes dos botões
    [btnMobile, btnDesktop, btnHamburguer].forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle("btn-outline-light", isDark);
      btn.classList.toggle("btn-outline-dark", !isDark);
    });

    updateLogo(); // Atualiza logo com base no novo tema
  }
});
