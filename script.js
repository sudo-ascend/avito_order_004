const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".header-panel");
const menuLinks = document.querySelectorAll(
  '.site-nav a, .brand[href^="#"], .footer-nav a'
);
const revealItems = document.querySelectorAll("[data-reveal]");
const faqQuestions = document.querySelectorAll(".faq-question");
const yearNode = document.getElementById("currentYear");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const reviewTrack = document.querySelector("[data-review-track]");
const reviewControls = document.querySelectorAll("[data-review-control]");

const syncHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Открыть меню");
};

const openMenu = () => {
  body.classList.add("menu-open");
  menuToggle?.setAttribute("aria-expanded", "true");
  menuToggle?.setAttribute("aria-label", "Закрыть меню");
};

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", () => {
    if (body.classList.contains("menu-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1040) {
      closeMenu();
    }
  });
}

menuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();

    target.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

if (!prefersReducedMotion.matches && revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const expanded = question.getAttribute("aria-expanded") === "true";
    const answer = question.nextElementSibling;

    faqQuestions.forEach((otherQuestion) => {
      const otherAnswer = otherQuestion.nextElementSibling;
      otherQuestion.setAttribute("aria-expanded", "false");
      otherAnswer?.setAttribute("hidden", "");
    });

    if (!expanded) {
      question.setAttribute("aria-expanded", "true");
      answer?.removeAttribute("hidden");
    }
  });
});

if (reviewTrack && reviewControls.length) {
  const getReviewStep = () => Math.max(reviewTrack.clientWidth * 0.82, 320);

  reviewControls.forEach((control) => {
    control.addEventListener("click", () => {
      const direction = control.getAttribute("data-review-control") === "next" ? 1 : -1;

      reviewTrack.scrollBy({
        left: getReviewStep() * direction,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });
