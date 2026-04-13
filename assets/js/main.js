/**
 * Ultimate Clean & Optimized Personal Portfolio JS (FINAL FIXED VERSION)
 */

(function () {
  "use strict";

  // =============================
  // Helper Functions
  // =============================
  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const elements = select(el, all);
    if (!elements || (all && elements.length === 0)) return;

    if (all) {
      elements.forEach(e => e.addEventListener(type, listener));
    } else {
      elements.addEventListener(type, listener);
    }
  };

  const scrollto = (el) => {
    const element = select(el);
    if (!element) return;

    const offset = 80;
    const top = element.offsetTop - offset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  };

  // =============================
  // Mobile Navigation
  // =============================
  on("click", ".mobile-nav-toggle", function () {
    const navbar = select("#navbar");
    if (!navbar) return;

    navbar.classList.toggle("navbar-mobile");

    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  // =============================
  // Navigation Handling
  // =============================
  on("click", "#navbar .nav-link", function (e) {
    const section = select(this.hash);
    if (!section) return;

    e.preventDefault();

    const navbar = select("#navbar");
    const header = select("#header");
    const sections = select("section", true);
    const navlinks = select("#navbar .nav-link", true);

    navlinks.forEach(el => el.classList.remove("active"));
    this.classList.add("active");

    // close mobile nav
    if (navbar && navbar.classList.contains("navbar-mobile")) {
      navbar.classList.remove("navbar-mobile");

      const toggle = select(".mobile-nav-toggle");
      if (toggle) {
        toggle.classList.remove("bi-x");
        toggle.classList.add("bi-list");
      }
    }

    // header state
    if (this.hash === "#header") {
      header?.classList.remove("header-top");
      sections.forEach(sec => sec.classList.remove("section-show"));
      return;
    }

    if (header && !header.classList.contains("header-top")) {
      header.classList.add("header-top");

      setTimeout(() => {
        sections.forEach(sec => sec.classList.remove("section-show"));
        section.classList.add("section-show");
      }, 250);
    } else {
      sections.forEach(sec => sec.classList.remove("section-show"));
      section.classList.add("section-show");
    }

    scrollto(this.hash);
  }, true);

  // =============================
  // Load on Hash
  // =============================
  window.addEventListener("load", () => {
    if (!window.location.hash) return;

    const initial = select(window.location.hash);
    if (!initial) return;

    const header = select("#header");
    const navlinks = select("#navbar .nav-link", true);

    header?.classList.add("header-top");

    navlinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === window.location.hash
      );
    });

    setTimeout(() => {
      initial.classList.add("section-show");
    }, 250);

    scrollto(window.location.hash);
  });

  // =============================
  // Skills Animation (Waypoint)
  // =============================
  if (typeof Waypoint !== "undefined") {
    const skills = select(".skills-content");

    if (skills) {
      new Waypoint({
        element: skills,
        offset: "85%",
        handler: function () {
          select(".progress .progress-bar", true).forEach(el => {
            el.style.width = el.getAttribute("aria-valuenow") + "%";
          });
        }
      });
    }
  }

  // =============================
  // Swiper Init
  // =============================
  if (typeof Swiper !== "undefined") {
    new Swiper(".testimonials-slider", {
      speed: 700,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      breakpoints: {
        1200: { slidesPerView: 3 }
      }
    });

    new Swiper(".portfolio-details-slider", {
      speed: 500,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    });
  }

  // =============================
  // Portfolio Filter (Isotope)
  // =============================
  window.addEventListener("load", () => {
    if (typeof Isotope === "undefined") return;

    const container = select(".portfolio-container");
    if (!container) return;

    const iso = new Isotope(container, {
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows"
    });

    on("click", "#portfolio-flters li", function (e) {
      e.preventDefault();

      select("#portfolio-flters li", true)
        .forEach(el => el.classList.remove("filter-active"));

      this.classList.add("filter-active");

      iso.arrange({
        filter: this.getAttribute("data-filter")
      });
    }, true);
  });

  // =============================
  // Lightbox (GLightbox)
  // =============================
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".portfolio-lightbox" });

    GLightbox({
      selector: ".portfolio-details-lightbox",
      width: "90%",
      height: "90vh"
    });
  }

  // =============================
  // Typing Effect (FIXED SAFE LOOP)
  // =============================
  const texts = [
    "Network Engineer",
    "Network Security Engineer",
    "Cyber Security Engineer",
    "IoT Engineer"
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingStarted = false;

  function typeEffect() {
    const el = document.getElementById("profession");
    if (!el) return;

    const current = texts[textIndex];

    if (!isDeleting) {
      charIndex++;
    } else {
      charIndex--;
    }

    el.textContent = current.substring(0, charIndex);

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === current.length) {
      speed = 1500;
      isDeleting = true;
    } 
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 500;
    }

    setTimeout(typeEffect, speed);
  }

  window.addEventListener("load", () => {
    if (!typingStarted) {
      typingStarted = true;
      typeEffect();
    }
  });

  // =============================
  // Counter
  // =============================
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  // =============================
  // Theme System (AUTO + MANUAL FIXED)
  // =============================
  const toggleBtn = document.getElementById("theme-toggle");

  function updateToggleIcon(theme) {
    if (!toggleBtn) return;

    toggleBtn.innerHTML =
      theme === "light"
        ? '<i class="bi bi-sun"></i>'
        : '<i class="bi bi-moon"></i>';
  }

  function applyTheme(theme, save = true) {
    if (theme === "light") {
      document.body.classList.add("light-mode");
      updateToggleIcon("light");

      if (save) localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      updateToggleIcon("dark");

      if (save) localStorage.setItem("theme", "dark");
    }
  }

  function getThemeByTime() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "light" : "dark";
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      applyTheme(savedTheme, false);
    } else {
      applyTheme(getThemeByTime(), false);
    }
  }

  window.addEventListener("load", initTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-mode");
      applyTheme(isLight ? "dark" : "light");
    });
  }

})();