function createElement(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([attributeName, attributeValue]) => {
    if (v === undefined || v === null) return;
    if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  return node;
}

export function SearchIcon() {
  const svg = el("svg", "", { viewBox: "0 0 24 24", fill: "none" });
  svg.innerHTML = `
    <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="2"/>
    <path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `;
  return svg;
}

export function BellIcon() {
  const svg = el("svg", "", { viewBox: "0 0 24 24", fill: "none" });
  svg.innerHTML = `
    <path d="M12 22a2.5 2.5 0 0 0 2.45-2H9.55A2.5 2.5 0 0 0 12 22Z" fill="currentColor" opacity=".7"/>
    <path d="M18 16H6c1-1 1-2 1-6a5 5 0 0 1 10 0c0 4 0 5 1 6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  `;
  return svg;
}

export function ChatIcon() {
  const svg = el("svg", "", { viewBox: "0 0 24 24", fill: "none" });
  svg.innerHTML = `
    <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.5-4.5A8 8 0 1 1 21 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  `;
  return svg;
}

export function Header({ initialQuery, onSearch, onReset }) {
const header = createElement('header', 'header')
const inner = createElement('div', 'header-inner')
const brand = createElement('a', 'brand', { href: '#' })
const badge = createElement('div', 'brand-badge', { text: 'P' })
const name = createElement('span', '', { text: 'Pinterest' })
  brand.append(badge, name);
  brand.addEventListener("click", (event) => {
  event.preventDefault();
  onReset();
});

  const chipHome = el("a", "nav-chip", { href: "#", text: "Inicio" });
  const chipExplore = el("a", "nav-chip", { href: "#", text: "Explorar" });
  const chipCreate = el("a", "nav-chip", { href: "#", text: "Crear" });

  const searchWrap = el("form", "search");
  const icon = SearchIcon();
  const input = el("input", "", {
    type: "search",
    placeholder: "Buscar",
    value: initialQuery || ""
  });
  searchWrap.append(icon, input);

  searchWrap.addEventListener("submit", (event) => {
    e.preventDefault();
    const query = input.value.trim();
    if (q) onSearch(q);
  });

  const actions = el("div", "header-actions");
  const btnBell = el("button", "icon-btn", { type: "button", "aria-label": "Notificaciones" });
  btnBell.append(BellIcon());

  const btnChat = el("button", "icon-btn", { type: "button", "aria-label": "Mensajes" });
  btnChat.append(ChatIcon());

  const btnProfile = el("button", "icon-btn", { type: "button", "aria-label": "Perfil" });
  btnProfile.textContent = "☺";

  actions.append(btnBell, btnChat, btnProfile);

  inner.append(brand, chipHome, chipExplore, chipCreate, searchWrap, actions);
  header.append(inner);

  return { header, input };
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function MasonryGrid() {
  const grid = el("section", "masonry");
  return grid;
}

export function PinCard(photo) {

  const card = el("article", "pin");

  const media = el("a", "pin-media", {
    href: photo.links?.html || "#",
    target: "_blank",
    rel: "noreferrer"
  });

  const img = el("img", "", {
    src: photo.urls?.small,
    alt: photo.alt_description || photo.description || "Imagen"
  });

  const overlay = el("div", "pin-overlay");
  const ctas = el("div", "pin-cta");

  const btnVisit = el("a", "btn btn-primary", {
    href: photo.links?.html || "#",
    target: "_blank",
    rel: "noreferrer",
    text: "Visitar"
  });

  const btnMore = el("button", "btn btn-ghost", { type: "button", text: "⋯" });
  btnMore.addEventListener("click", (event) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Acciones (placeholder): guardar, compartir, reportar…");
  });

  ctas.append(btnVisit, btnMore);
  media.append(img, overlay, ctas);

  const meta = el("div", "pin-meta");

  const user = el("a", "user", {
    href: photo.user?.links?.html || "#",
    target: "_blank",
    rel: "noreferrer"
  });

  const avatar = el("img", "avatar", {
    src: photo.user?.profile_image?.medium,
    alt: photo.user?.name || "Usuario"
  });

  const userInfo = el("div", "user-info");
  const userName = el("div", "user-name", { text: photo.user?.name || "Usuario" });

  const userMeta = el("div", "user-sub");
  const date = el("span", "", { text: formatDate(photo.created_at) });
  const dot = el("span", "", { text: "•" });
  dot.style.opacity = ".45";
  const likes = el("span", "", { text: `❤ ${photo.likes ?? 0}` });

  sub.append(date, dot, likes);
  info.append(uname, sub);
  user.append(avatar, info);

  const stat = el("div", "stat", { text: photo.user?.username ? `@${photo.user.username}` : "" });

  meta.append(user, stat);

  card.append(media, meta);
  return card;
}

export function Loader() {
  const wrap = el("div", "loader");
  const dots = el("div", "");
  dots.style.display = "flex";
  dots.style.gap = "6px";
  dots.append(el("span", "dot"), el("span", "dot"), el("span", "dot"));

  const label = el("span", "", { text: "Cargando" });
  wrap.append(dots, label);
  return wrap;
}

export function EmptyState(query) {
  const box = el("div", "empty");
  box.innerHTML = `<strong>No hay resultados</strong><br/>Prueba con otra búsqueda: <em>${query}</em>`;
  return box;
}
