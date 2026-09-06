/* ==========================================================================
   MARVAC COMPOSITES — Products listing logic
   ========================================================================== */

const VALVE_ICON_SVG = `<svg viewBox="0 0 64 64"><path d="M4 26h14v12H4z" fill="#c9d3de"/><path d="M46 26h14v12H46z" fill="#c9d3de"/><rect x="16" y="20" width="32" height="24" rx="6" fill="#e7ecf1" stroke="#aab6c4" stroke-width="1.5"/><circle cx="32" cy="32" r="8" fill="#0F2E73"/><rect x="29" y="10" width="6" height="14" rx="2" fill="#0F2E73"/><rect x="18" y="8" width="28" height="6" rx="3" fill="#1FD0DE"/></svg>`;

function chipButton(cat, count) {
  return `<button class="chip" data-cat="${cat.id}">${cat.label}<span style="opacity:.6; margin-left:6px;">${count}</span></button>`;
}

function productCardHTML(p) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
    : `<div class="pc-icon">${VALVE_ICON_SVG}</div>`;
  return `
  <a href="product.html?slug=${p.slug}" class="card product-card">
    <div class="pc-img">
      ${media}
      <span class="pc-tag">${getCategoryLabel(p.category)}</span>
    </div>
    <div class="pc-body">
      <h3>${p.name}</h3>
      <p>${p.blurb}</p>
      <span class="pc-link">View Details <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></span>
    </div>
  </a>`;
}

function render() {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const countEl = document.getElementById("resultCount");
  const activeChip = document.querySelector(".chip.active");
  const activeCat = activeChip ? activeChip.dataset.cat : "all";
  const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();

  let list = PRODUCTS.filter((p) => activeCat === "all" || p.category === activeCat);
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  grid.innerHTML = list.map(productCardHTML).join("");
  empty.style.display = list.length ? "none" : "block";
  grid.style.display = list.length ? "grid" : "none";
  countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const chipRow = document.getElementById("chipRow");
  const footerCats = document.getElementById("footerCats");

  CATEGORIES.forEach((cat) => {
    const count = PRODUCTS.filter((p) => p.category === cat.id).length;
    chipRow.insertAdjacentHTML("beforeend", chipButton(cat, count));
  });
  if (footerCats) {
    footerCats.innerHTML = CATEGORIES.slice(0, 4)
      .map((c) => `<li><a href="products.html?cat=${c.id}">${c.label}</a></li>`)
      .join("");
  }

  // Pre-select category from URL
  const params = new URLSearchParams(location.search);
  const preselect = params.get("cat");
  if (preselect) {
    const target = document.querySelector(`.chip[data-cat="${preselect}"]`);
    if (target) {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      target.classList.add("active");
    }
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      render();
    });
  });

  document.getElementById("searchInput").addEventListener("input", render);

  render();
});
