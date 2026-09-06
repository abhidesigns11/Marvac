/* ==========================================================================
   MARVAC COMPOSITES — Product detail rendering
   ========================================================================== */

const VALVE_ICON_SVG_LG = `<svg viewBox="0 0 64 64"><path d="M4 26h14v12H4z" fill="#c9d3de"/><path d="M46 26h14v12H46z" fill="#c9d3de"/><rect x="16" y="20" width="32" height="24" rx="6" fill="#e7ecf1" stroke="#aab6c4" stroke-width="1.5"/><circle cx="32" cy="32" r="8" fill="#0F2E73"/><rect x="29" y="10" width="6" height="14" rx="2" fill="#0F2E73"/><rect x="18" y="8" width="28" height="6" rx="3" fill="#1FD0DE"/></svg>`;

function relatedCardHTML(p) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
    : `<div class="pc-icon">${VALVE_ICON_SVG_LG}</div>`;
  return `
  <a href="product.html?slug=${p.slug}" class="card product-card">
    <div class="pc-img">${media}</div>
    <div class="pc-body">
      <h3>${p.name}</h3>
      <p>${p.blurb}</p>
      <span class="pc-link">View Details <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></span>
    </div>
  </a>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const product = getProductBySlug(slug) || PRODUCTS[0];

  document.title = `${product.name} | Marvac Composites`;
  document.getElementById("crumbCat").innerHTML =
    `<a href="products.html?cat=${product.category}" style="color:var(--ink-soft);">${getCategoryLabel(product.category)}</a>`;
  document.getElementById("crumbName").textContent = product.name;

  const media = product.image
    ? `<img src="${product.image}" alt="${product.name}">`
    : `<div class="pc-icon">${VALVE_ICON_SVG_LG}</div>`;

  const gallery = product.gallery && product.gallery.length
    ? `<div class="pd-gallery">${product.gallery.map((g) => `<img src="${g}" alt="${product.name} detail">`).join("")}</div>`
    : "";

  const specRows = product.specs
    .map((s) => `<div class="spec-row"><span>${s.label}</span><span>${s.value}</span></div>`)
    .join("");

  const waMsg = encodeURIComponent(
    `Hello Marvac Composites, I'm interested in ${product.name}. Could you share pricing and availability?`
  );

  document.getElementById("productDetail").innerHTML = `
    <div class="pd-media-wrap">
      <div class="pd-media">${media}</div>
      ${gallery}
    </div>
    <div class="pd-info">
      <span class="pd-tag">${getCategoryLabel(product.category)}</span>
      <h1>${product.name}</h1>
      <p class="tagline">${product.tagline}</p>
      <p class="desc">${product.description}</p>
      <div class="spec-list">${specRows}</div>
      <div class="pd-actions">
        <a href="https://wa.me/+919033607734?text=${waMsg}" target="_blank" class="btn btn--eco">Enquire on WhatsApp</a>
        <a href="tel:+919033607734" class="btn btn--ghost">Call for Pricing</a>
      </div>
    </div>
  `;

  document.getElementById("waFloat").href = `https://wa.me/+919033607734?text=${waMsg}`;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const relatedFallback = related.length ? related : PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);
  document.getElementById("relatedGrid").innerHTML = relatedFallback.map(relatedCardHTML).join("");
});
