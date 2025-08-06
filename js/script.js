document.addEventListener("DOMContentLoaded", function () {
  const isMobile = window.innerWidth < 768;
  const header = document.querySelector("header.navbar");
  const btn = document.getElementById("toggle-dark");
  const logoImg = document.getElementById("logo-img");

  // Função para trocar a logo conforme o tema
  function updateLogo() {
    if (!logoImg) return;
    if (document.body.classList.contains("dark-mode")) {
      logoImg.src = "../img/logo_f5f5f5.svg";
    } else {
      logoImg.src = "../img/logo.svg";
    }
  }

  // Inicializa o modo escuro
  initDarkMode();

  // Inicializa o SortableJS se não for mobile
  function initializeSortable() {
    const gallery = document.getElementById("interactive-gallery");
    if (gallery && !isMobile) {
      new Sortable(gallery, {
        animation: 200,
        draggable: ".col-6, .col-12",
        ghostClass: "sortable-ghost",
      });
    }
  }

  initializeSortable();

  window.addEventListener("resize", function () {
    if (window.innerWidth < 768) {
      document.querySelectorAll(".col-6, .col-12").forEach((item) => {
        item.classList.remove("sortable-ghost");
      });
    } else {
      initializeSortable();
    }
  });

  // Botão de voltar ao topo
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

  // AOS
  AOS.init();

  // Vanilla Tilt para desktop apenas
  if (window.innerWidth >= 768) {
    VanillaTilt.init(document.querySelectorAll(".tilt-cell"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }

  // Gyroscópio no mobile
  if (window.innerWidth < 768 && window.DeviceOrientationEvent) {
    const handleOrientation = (event) => {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;

      document.querySelectorAll(".tilt-cell").forEach((el) => {
        const tiltX = gamma / 2;
        const tiltY = beta / 4;
        el.style.transform = `rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
      });
    };

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

  // Fancybox
  Fancybox.bind("[data-fancybox]", {
    dragToClose: true,
    groupAll: true,
    animated: true,
    showClass: "fancybox-zoomIn",
    hideClass: "fancybox-zoomOut",
  });

  // SLIDER MOBILE
  if (window.innerWidth < 768) {
    const slides = document.querySelectorAll(".fade-slide");
    let current = 0;

    function show(i) {
      slides.forEach((s, idx) => {
        s.style.opacity = idx === i ? "1" : "0";
        s.style.zIndex = idx === i ? "1" : "0";
      });
    }

    show(current);

    setInterval(() => {
      current = (current + 1) % slides.length;
      show(current);
    }, 4000);
  }

  // Botão “Veja Mais” com fade somente no mobile
  const btnVerMais = document.getElementById("verMaisBtn");
  if (btnVerMais) {
    btnVerMais.addEventListener("click", () => {
      const hiddenItems = document.querySelectorAll(
        "#interactive-gallery .gallery-item.d-none"
      );

      hiddenItems.forEach((item, index) => {
        item.classList.remove("d-none");
        if (window.innerWidth < 768) {
          setTimeout(() => {
            item.classList.add("show");
          }, 100 * index);
        }
      });

      btnVerMais.style.display = "none";
    });
  }

  // Tooltips Bootstrap
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

  // Revelação de Fotografia
  document.querySelectorAll(".photo-reveal").forEach((container) => {
    const img = container.querySelector(".reveal-image");

    container.addEventListener("mouseenter", () => {
      if (!img.classList.contains("show")) {
        img.classList.add("show");
      }
    });
  });

  // Função para iniciar dark mode e configurar o header, botão e logo
  function initDarkMode() {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentMode = localStorage.getItem("theme");

    if (currentMode === "dark") {
      document.body.classList.add("dark-mode");
      header.classList.add("navbar-dark");
      header.classList.remove("navbar-light");
      if (btn) {
        btn.classList.remove("btn-outline-dark");
        btn.classList.add("btn-outline-light");
      }
    } else {
      document.body.classList.remove("dark-mode");
      header.classList.add("navbar-light");
      header.classList.remove("navbar-dark");
      if (btn) {
        btn.classList.remove("btn-outline-light");
        btn.classList.add("btn-outline-dark");
      }
    }

    updateLogo(); // Atualiza a logo ao iniciar

    if (btn) {
      btn.addEventListener("click", function () {
        toggleDarkMode();
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }
  }

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      header.classList.add("navbar-dark");
      header.classList.remove("navbar-light");
      if (btn) {
        btn.classList.remove("btn-outline-dark");
        btn.classList.add("btn-outline-light");
      }
    } else {
      header.classList.add("navbar-light");
      header.classList.remove("navbar-dark");
      if (btn) {
        btn.classList.remove("btn-outline-light");
        btn.classList.add("btn-outline-dark");
      }
    }

    updateLogo(); // Atualiza a logo ao alternar tema
  }
});
