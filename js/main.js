(() => {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typewriter (language-aware) ---------- */
  const twText = document.getElementById("twText");
  const rolesByLang = {
    en: ["circuits.", "softwares.", "websites.", "data systems."],
    fa: ["مدار.", "نرم‌افزار.", "وبسایت.", "سیستم داده."]
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let twGeneration = 0; // bumped on language switch to stop stale timers

  const startTypewriter = (lang) => {
    if (!twText) return;
    const roles = rolesByLang[lang] || rolesByLang.en;
    twGeneration++;
    const myGen = twGeneration;

    if (prefersReducedMotion) {
      twText.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const TYPE_SPEED = 60;
    const DELETE_SPEED = 35;
    const HOLD_TIME = 1400;

    const tick = () => {
      if (myGen !== twGeneration) return; // a newer language switch superseded this loop
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
    setTimeout(tick, 400);
  };

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

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i % 6) * 0.06 + "s";
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  /* ---------- Parallax layers ---------- */
  const parallaxEls = document.querySelectorAll("[data-speed]");
  if (parallaxEls.length && !prefersReducedMotion) {
    const updateParallax = () => {
      const scrollTop = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.2;
        el.style.transform = `translateY(${scrollTop * speed}px)`;
      });
    };
    let pTicking = false;
    window.addEventListener("scroll", () => {
      if (!pTicking) {
        requestAnimationFrame(() => { updateParallax(); pTicking = false; });
        pTicking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- IC card spotlight + tilt ---------- */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll(".ic-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        card.style.setProperty("--rx", ((0.5 - py) * 6) + "deg");
        card.style.setProperty("--ry", ((px - 0.5) * 8) + "deg");
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Language toggle (EN / FA) ---------- */
  const html = document.documentElement;
  const langButtons = document.querySelectorAll(".lang-toggle");

  const applyLangUI = (lang) => {
    langButtons.forEach(btn => {
      btn.querySelectorAll(".lang-toggle__opt").forEach(opt => {
        opt.classList.toggle("active", opt.dataset.lang === lang);
      });
    });
    document.title = lang === "fa"
      ? "آرمان سلطانی — مهندس برق، توسعه‌دهنده وب و متخصص فناوری اطلاعات"
      : "Arman Soltani (آرمان سلطانی) — Electrical Engineer, Web Developer & IT Specialist";
  };

  const setLang = (lang, persist) => {
    if (lang === "fa") {
      html.classList.add("lang-fa");
      html.setAttribute("lang", "fa");
      html.setAttribute("dir", "rtl");
    } else {
      html.classList.remove("lang-fa");
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
    }
    applyLangUI(lang);
    startTypewriter(lang);
    if (persist) {
      try { localStorage.setItem("site-lang", lang); } catch (e) {}
    }
  };

  // Sync button states + typewriter with whatever the pre-paint script already applied
  const initialLang = html.classList.contains("lang-fa") ? "fa" : "en";
  applyLangUI(initialLang);
  startTypewriter(initialLang);

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const next = html.classList.contains("lang-fa") ? "en" : "fa";
      setLang(next, true);
    });
  });

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
