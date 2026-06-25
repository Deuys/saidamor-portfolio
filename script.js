/**
 * Portfolio de Said Amor
 * Développement : JavaScript Vanilla (sans dépendance)
 * Fonctionnalités :
 * - Changement de thème clair/sombre
 * - Animation du terminal
 * - Révélation progressive des sections
 * - Navigation dynamique
 * - Défilement fluide
 */

"use strict";

/* ------------------------------------------------- Theme ------------------------------------------------------------ */
const ThemeManager = (() => {
  const KEY = "sa-theme";
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

  const ICONS = {
    dark: `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `,

    light: `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3
               7 7 0 0 0 21 12.79z"></path>
    </svg>
  `,
  };
  function updateIcons(theme) {
    document.querySelectorAll(".theme-icon-switch").forEach((skillIcon) => {
      const src = skillIcon.getAttribute("src");

      if (!src) return;

      if (theme === "dark") {
        if (!src.includes("-white")) {
          skillIcon.src = src.replace(".svg", "-white.svg");
        }
      } else {
        skillIcon.src = src.replace("-white.svg", ".svg");
      }
    });
  }
  function get() {
    return (
      localStorage.getItem(KEY) ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
    );
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    icon.innerHTML = ICONS[theme];
    updateIcons(theme);
    btn.setAttribute(
      "aria-label",
      `Basculer vers le mode ${theme === "dark" ? "clair" : "sombre"}`,
    );
    localStorage.setItem(KEY, theme);
  }

  function toggle() {
    apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }

  function init() {
    apply(get());
    btn.addEventListener("click", toggle);
  }

  return { init };
})();

/* -------------------------------------------------------- Navbar ----------------------------------------------------  */
const NavManager = (() => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("navHamburger");
  const links = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-link");
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    hamburger.classList.toggle("open", isOpen);
    links.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);

    if (window.innerWidth <= 481) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
  }

  function closeMenu() {
    if (!isOpen) return;

    isOpen = false;
    hamburger.classList.remove("open");
    links.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");

    if (window.innerWidth <= 768) {
      document.body.style.overflow = "";
    }
  }

  function updateActive() {
  let current = null;

  const scrollY = window.scrollY + window.innerHeight * 0.35;
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < top + height) {
      current = id;
    }
  });

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    current = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`
    );
  });
}
  function init() {
    hamburger.addEventListener("click", toggleMenu);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
        updateActive();
      },
      { passive: true },
    );

    updateActive();
  }

  return { init };
})();

/* ------------------------------------ Animations d'apparition au défilement -------------------------------------------*/
const RevealManager = (() => {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  function init() {
    elements.forEach((el) => observer.observe(el));
  }

  return { init };
})();

/* ------------------------------------------ Terminal ---------------------------------------------------------------- */
const Terminal = (() => {
  const container = document.getElementById("terminalBody");
  const SPEED = 1.6; // Multiplicateur de vitesse :
  // Script du terminal — simulation réaliste d'un dev session
  const SCRIPT = [
    { type: "prompt", delay: 400, text: "$ whoami" },
    { type: "output", delay: 200, text: "said.amor — Full Stack Developer" },
    { type: "empty", delay: 100 },
    { type: "prompt", delay: 800, text: "$ ls skills/" },
    {
      type: "output",
      delay: 150,
      text: "angular/  symfony/  nodejs/  docker/",
    },
    { type: "output", delay: 50, text: "mysql/    mongodb/  git/     linux/" },
    { type: "empty", delay: 100 },
    { type: "prompt", delay: 900, text: "$ cat status.json" },
    { type: "info", delay: 100, text: "{" },
    { type: "info", delay: 60, text: '  "status": "available",' },
    { type: "info", delay: 60, text: '  "project": "Factura SaaS",' },
    { type: "info", delay: 60, text: '  "certification": "in progress",' },
    {
      type: "info",
      delay: 60,
      text: '  "passion": ["dev", "security", "oss"]',
    },
    { type: "info", delay: 60, text: "}" },
    { type: "empty", delay: 100 },
    { type: "prompt", delay: 700, text: "$ git log --oneline -3" },
    {
      type: "output",
      delay: 80,
      text: "a3f92c1 feat: JWT auth + refresh tokens",
    },
    { type: "output", delay: 80, text: "7b2e4d0 feat: invoice PATCH endpoint" },
    {
      type: "output",
      delay: 80,
      text: "c91f033 fix: CORS policy + security hdrs",
    },
    { type: "empty", delay: 100 },
    { type: "prompt", delay: 600, text: '$ echo "Open to opportunities"' },
    { type: "success", delay: 100, text: "✓ Open to opportunities" },
    { type: "empty", delay: 200 },
    { type: "cursor", delay: 300 },
  ];

  function createLine(type, text) {
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    if (type === "cursor") {
      line.innerHTML = '<span class="cursor">|</span>';
    } else if (type === "empty") {
      // just spacing
    } else {
      line.textContent = text;
    }
    return line;
  }

  async function run() {
    if (!container) return;

    let totalDelay = 0;

    SCRIPT.forEach((item) => {
      totalDelay += item.delay * SPEED;
      setTimeout(() => {
        const line = createLine(item.type, item.text);
        container.appendChild(line);
        // Auto-scroll
        container.scrollTop = container.scrollHeight;
      }, totalDelay);
    });

    // Redémarrage du terminal après animation terminée
    const totalDuration = totalDelay + 10500;
    setTimeout(() => {
      container.innerHTML = "";
      run();
    }, totalDuration);
  }

  function init() {
    // Attend que le Hero soit visible avant de démarrer
    setTimeout(run, 2600);
  }

  return { init };
})();

/* ------------------------------------- Défilement fluide entre les sections ------------------------------------- */
const SmoothScroll = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const offset =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-h",
            ),
          ) || 64;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }
  return { init };
})();

/* ---------------------------------------- Gestion du téléchargement du CV ----------------------------------------- */
const CVHandler = (() => {
  function init() {
    document.querySelectorAll("[download]").forEach((link) => {
      link.addEventListener("click", (e) => {
        // Aucun CV disponible pour le moment : affichage d'un message temporaire
        if (!link.href || link.href === "#") {
          e.preventDefault();
          const original = link.textContent;
          link.textContent = " CV bientôt disponible";
          link.style.opacity = "0.6";
          setTimeout(() => {
            link.innerHTML = original;
            link.style.opacity = "";
          }, 2000);
        }
      });
    });
  }
  return { init };
})();

/* ------------------------- Initialisation de l'application - Point d'entrée du portfolio ---------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  NavManager.init();
  RevealManager.init();
  Terminal.init();
  SmoothScroll.init();
  CVHandler.init();
});
