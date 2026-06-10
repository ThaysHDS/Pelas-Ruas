document.addEventListener('DOMContentLoaded', function () {
  const MOBILE_BREAKPOINT = 768;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  
  const header = document.querySelector('header.navbar');
  const btnMobile = document.getElementById('toggle-dark');
  const btnDesktop = document.getElementById('toggle-dark-desktop');
  const btnHamburguer = document.getElementById('menu-toggle');
  const logoImg = document.getElementById('logo-img');
  const scrollBtn = document.querySelector('.scroll-top-btn');
  const btnVerMais = document.getElementById('verMaisBtn');
  const gallery = document.getElementById('interactive-gallery');
  
  let sortableInstance = null;
  let carouselInterval = null;
  let deviceOrientationListener = null;
  let scrollThrottleTimer = null;
  let resizeThrottleTimer = null;
  let tiltCells = [];
  let lastScrollY = 0;

  function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  function updateLogo() {
    if (!logoImg) return;
    logoImg.src = document.body.classList.contains('dark-mode')
      ? 'img/logo_f5f5f5.svg'
      : 'img/logo.svg';
  }

  initDarkMode();

  function initializeSortable() {
    if (gallery && !isMobile && !sortableInstance) {
      sortableInstance = new Sortable(gallery, {
        animation: 200,
        draggable: '.col-6, .col-12',
        ghostClass: 'sortable-ghost',
      });
    }
  }

  function destroySortable() {
    if (sortableInstance) {
      sortableInstance.destroy();
      sortableInstance = null;
    }
  }

  initializeSortable();

  const handleResize = throttle(function () {
    const isNowMobile = window.innerWidth < MOBILE_BREAKPOINT;
    
    if (isNowMobile && sortableInstance) {
      destroySortable();
      document.querySelectorAll('.col-6, .col-12').forEach((item) => {
        item.classList.remove('sortable-ghost');
      });
    } else if (!isNowMobile && !sortableInstance) {
      initializeSortable();
    }
  }, 250);

  window.addEventListener('resize', handleResize);

  const handleScroll = throttle(function () {
    if (scrollBtn) {
      const shouldShow = window.scrollY > 300;
      if ((lastScrollY > 300) !== shouldShow) {
        scrollBtn.style.display = shouldShow ? 'block' : 'none';
        lastScrollY = window.scrollY;
      }
    }
  }, 150);

  window.addEventListener('scroll', handleScroll);

  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  AOS.init({
    once: false,
    duration: 800,
  });

  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    tiltCells = document.querySelectorAll('.tilt-cell');
    if (tiltCells.length > 0) {
      VanillaTilt.init(tiltCells, {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
      });
    }
  }

  if (isMobile && window.DeviceOrientationEvent) {
    tiltCells = document.querySelectorAll('.tilt-cell');
    
    if (tiltCells.length > 0) {
      let lastGamma = 0;
      let lastBeta = 0;
      let rafId = null;

      const updateTilt = () => {
        tiltCells.forEach((el) => {
          const tiltX = lastGamma / 2;
          const tiltY = lastBeta / 4;
          el.style.transform = `rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
        });
        rafId = null;
      };

      deviceOrientationListener = (event) => {
        lastGamma = event.gamma || 0;
        lastBeta = event.beta || 0;
        
        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      };

      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationListener);
            } else {
              console.warn('Permissão negada para giroscópio.');
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationListener);
      }
    }
  }

  Fancybox.bind('[data-fancybox]', {
    dragToClose: true,
    groupAll: true,
    animated: true,
    showClass: 'fancybox-zoomIn',
    hideClass: 'fancybox-zoomOut',
  });

  if (isMobile) {
    const slides = document.querySelectorAll('.fade-slide');
    let current = 0;

    function show(i) {
      slides.forEach((s, idx) => {
        s.style.opacity = idx === i ? '1' : '0';
        s.style.zIndex = idx === i ? '1' : '0';
      });
    }

    if (slides.length > 0) {
      show(current);
      carouselInterval = setInterval(() => {
        current = (current + 1) % slides.length;
        show(current);
      }, 4000);
    }
  }

  if (btnVerMais) {
    let isClicked = false;
    btnVerMais.addEventListener('click', () => {
      if (isClicked) return;
      isClicked = true;

      const hiddenItems = document.querySelectorAll(
        '#interactive-gallery .gallery-item.d-none',
      );

      hiddenItems.forEach((item, index) => {
        item.classList.remove('d-none');
        if (isMobile) {
          setTimeout(() => {
            item.classList.add('show');
          }, 100 * index);
        }
      });

      btnVerMais.style.display = 'none';
    });
  }

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]',
  );

  const tooltips = new Map();

  tooltipTriggerList.forEach((el) => {
    const tooltip = new bootstrap.Tooltip(el, {
      placement: 'right',
      fallbackPlacements: ['top', 'left'],
      boundary: 'viewport',
      trigger: 'manual',
    });

    tooltips.set(el, tooltip);
    let tooltipTimeout = null;

    el.addEventListener('mouseenter', () => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      tooltip.show();
      tooltipTimeout = setTimeout(() => {
        tooltip.hide();
      }, 2000);
    });

    el.addEventListener('mouseleave', () => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      tooltip.hide();
    });
  });

  document.querySelectorAll('.photo-reveal').forEach((container) => {
    const img = container.querySelector('.reveal-image');
    if (!img) return;

    container.addEventListener('mouseenter', () => {
      if (!img.classList.contains('show')) {
        img.classList.add('show');
      }
    });
  });

  function initDarkMode() {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentMode = localStorage.getItem('theme');

    const isDark = currentMode === 'dark' || (!currentMode && prefersDark);
    document.body.classList.toggle('dark-mode', isDark);
    header.classList.toggle('navbar-dark', isDark);
    header.classList.toggle('navbar-light', !isDark);

    [btnMobile, btnDesktop].forEach((btn) => {
      if (!btn) return;

      btn.addEventListener('click', () => {
        toggleDarkMode();

        const newMode = document.body.classList.contains('dark-mode')
          ? 'dark'
          : 'light';

        localStorage.setItem('theme', newMode);
      });
    });

    updateLogo();
  }

  function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', isDark);
    header.classList.toggle('navbar-dark', isDark);
    header.classList.toggle('navbar-light', !isDark);

    [btnMobile, btnDesktop, btnHamburguer].forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle('btn-outline-light', isDark);
      btn.classList.toggle('btn-outline-dark', !isDark);
    });

    updateLogo();
  }

  window.addEventListener('beforeunload', () => {
    if (carouselInterval) clearInterval(carouselInterval);
    if (scrollThrottleTimer) clearTimeout(scrollThrottleTimer);
    if (resizeThrottleTimer) clearTimeout(resizeThrottleTimer);
    if (deviceOrientationListener) {
      window.removeEventListener('deviceorientation', deviceOrientationListener);
    }
    destroySortable();
    tooltips.forEach(tooltip => tooltip.dispose());
  });
});