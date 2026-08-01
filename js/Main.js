(() => {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typewriter ---------- */
  const twText = document.getElementById("twText");
  const roles = [
    "circuits.",
    "software.",
    "companies.",
    "data pipelines."
  ];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (twText) {
    if (prefersReducedMotion) {
      twText.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const TYPE_SPEED = 60;
      const DELETE_SPEED = 35;
      const HOLD_TIME = 1400;

      const tick = () => {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          twText.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          twText.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      };
      setTimeout(tick, 500);
    }
  }

  /* ---------- Scroll progress: desktop trace fill + mobile rail ---------- */
  const traceFill = document.getElementById("traceFill");
  const mobileRailFill = document.getElementById("mobileRailFill");

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (traceFill) traceFill.style.height = pct + "%";
    if (mobileRailFill) mobileRailFill.style.width = pct + "%";
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  /* ---------- Active section highlighting ---------- */
  const sections = document.querySelectorAll("main > header[id], main > section[id]");
  const traceNodes = document.querySelectorAll(".trace-node");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  const setActive = (id) => {
    traceNodes.forEach(n => n.classList.toggle("active", n.dataset.target === id));
    mobileLinks.forEach(n => n.classList.toggle("active", n.dataset.target === id));
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }

  /* ---------- Skill meters: animate on view ---------- */
  const meters = document.querySelectorAll(".meter");
  if ("IntersectionObserver" in window && meters.length) {
    const meterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          meterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    meters.forEach(m => meterObserver.observe(m));
  } else {
    meters.forEach(m => m.classList.add("in-view"));
  }

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
