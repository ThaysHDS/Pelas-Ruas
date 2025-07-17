document.addEventListener("DOMContentLoaded", function () {
  const isMobile = window.innerWidth < 768;

  // Função para inicializar o SortableJS se a tela for grande
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

  // Inicializa o SortableJS
  initializeSortable();

  // Recarrega o SortableJS se a janela for redimensionada
  window.addEventListener("resize", function() {
    if (window.innerWidth < 768) {
      document.querySelectorAll('.col-6, .col-12').forEach(item => {
        item.classList.remove('sortable-ghost');
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

  // Gyroscópio no mobile (com permissão em iOS)
  if (window.innerWidth < 768 && window.DeviceOrientationEvent) {
    const handleOrientation = (event) => {
      const gamma = event.gamma || 0; // X
      const beta = event.beta || 0; // Y

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

  // BOTÃO “VEJA MAIS” COM FADE SOMENTE EM MOBILE
  const btn = document.getElementById("verMaisBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const hiddenItems = document.querySelectorAll(
        "#interactive-gallery .gallery-item.d-none"
      );

      hiddenItems.forEach((item, index) => {
        item.classList.remove("d-none");

        // Aplica o fade apenas se for mobile
        if (window.innerWidth < 768) {
          setTimeout(() => {
            item.classList.add("show");
          }, 100 * index); 
        }
      });

      btn.style.display = "none";
    });
  }

  // ✅ TOOLTIPS BOOTSTRAP
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
});
