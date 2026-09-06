/* ==========================================================================
   MARVAC COMPOSITES — Shared site behaviour
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
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

  /* ---- Back-to-top button ---- */
  const topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener("scroll", () => {
      topBtn.classList.toggle("show", window.scrollY > 500);
    });
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
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
