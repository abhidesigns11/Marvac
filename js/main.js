/* ==========================================================================
   MARVAC COMPOSITES — Shared site behaviour (v2: motion + interaction layer)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
    document.querySelectorAll(".mobile-panel a").forEach((a) => {
      a.addEventListener("click", () => document.body.classList.remove("menu-open"));
    });
  }

  /* ---- Header: subtle "scrolled" state ---- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onHeaderScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

  /* ---- Back-to-top button ---- */
  const topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener(
      "scroll",
      () => topBtn.classList.toggle("show", window.scrollY > 500),
      { passive: true }
    );
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---- Scroll reveal (+ staggered children) ---- */
  const revealEls = document.querySelectorAll(".reveal");
  document.querySelectorAll(".reveal-group").forEach((group) => {
    group.querySelectorAll(":scope > *").forEach((child, i) => {
      child.classList.add("reveal-item");
      child.style.setProperty("--stagger", i);
    });
  });

  const runCounters = (root) => {
    root.querySelectorAll("[data-count-to]").forEach((el) => animateCount(el));
  };

  if (("IntersectionObserver" in window) && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            runCounters(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
    document.querySelectorAll(".reveal-group").forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
    document.querySelectorAll(".reveal-group").forEach((el) => {
      el.classList.add("in");
      runCounters(el);
    });
  }

  /* ---- Animated count-up for stat numbers ---- */
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || "";
    const prefix = el.dataset.countPrefix || "";
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---- Card spotlight: soft cursor-follow highlight ----
     Delegated on document so it also covers cards rendered
     dynamically later (e.g. the product grid). */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }

  /* ---- Set active nav link based on current page ---- */
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".main-nav a, .mobile-panel a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
});

function showUnavailable() {
  alert("We are currently not available on this platform. Please connect with us via WhatsApp, Email or Instagram.");
}
