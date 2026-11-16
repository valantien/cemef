// Comportamentos do site do CEMEF: menu, acordeões e arte decorativa.
// Tudo funciona sem JavaScript; aqui só se acrescenta interação.

// Menu (RF1): botão com aria-expanded e aria-controls; Esc fecha.
const header = document.querySelector('.ag-site-header');
const menuBtn = header?.querySelector('.ag-menu-btn');
if (header && menuBtn) {
  const set = (open) => {
    header.classList.toggle('ag-is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => set(!header.classList.contains('ag-is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('ag-is-open')) { set(false); menuBtn.focus(); }
  });
  document.addEventListener('click', (e) => { if (!header.contains(e.target)) set(false); });
}

// Acordeões (componente faq do AGENTIC).
// Painel fechado fica "inert": seus links não recebem foco pelo teclado.
document.querySelectorAll('[data-ag-acc-item]').forEach((item) => {
  const btn = item.querySelector('[data-ag-acc-btn]');
  const panel = item.querySelector('[data-ag-acc-panel]');
  if (panel) panel.inert = true;
  btn?.addEventListener('click', () => {
    const open = !item.classList.contains('ag-is-open');
    item.classList.toggle('ag-is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (panel) panel.inert = !open;
  });
});

// Vídeos (RF3): troca a fachada pelo player youtube-nocookie só depois do clique.
document.querySelectorAll('[data-video]').forEach((fig) => {
  const play = fig.querySelector('[data-video-play]');
  play?.addEventListener('click', (e) => {
    e.preventDefault();
    const box = fig.querySelector('.cm-video-box');
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${fig.dataset.video}?autoplay=1`;
    f.title = play.textContent.trim();
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.replaceChildren(f);
    f.focus();
  });
});

// Arte decorativa: campo de "cetim" gerado por semente. Sempre aria-hidden (RF7).
const PALETAS = {
  night: ['#0B0A09', '#2a2620', '#6b6253', '#EFE9DF'],
  bone: ['#d9d1c2', '#EBE6DC', '#b9ad97', '#F7F4EE'],
  azul: ['#0B0A09', '#0a3550', '#006CA8', '#EFE9DF'],
};
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function pinta(cv) {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (cv.width = Math.max(1, Math.round(r.width * dpr)));
  const h = (cv.height = Math.max(1, Math.round(r.height * dpr)));
  const ctx = cv.getContext('2d');
  const pal = PALETAS[cv.dataset.pal] || PALETAS.night;
  const rand = rng(Number(cv.dataset.seed || 7));
  ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
  // dobras: faixas largas e suaves, como tecido sob luz
  for (let i = 0; i < 9; i++) {
    const x = rand() * w, y = rand() * h, rad = (0.35 + rand() * 0.7) * Math.max(w, h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const c = pal[1 + Math.floor(rand() * 3)];
    g.addColorStop(0, c + (i < 3 ? '66' : '33')); g.addColorStop(1, c + '00');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  ctx.globalCompositeOperation = 'soft-light';
  for (let i = 0; i < 14; i++) {
    const y0 = rand() * h, amp = (0.05 + rand() * 0.2) * h, f = 1 + rand() * 2.5, ph = rand() * 6.28;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) ctx.lineTo(x, y0 + Math.sin((x / w) * f * 6.28 + ph) * amp);
    ctx.lineWidth = (20 + rand() * 120) * dpr; ctx.strokeStyle = pal[3] + '22'; ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
  cv.classList.add('ag-is-painted');
}
const artes = document.querySelectorAll('canvas.cm-art:not(.cm-cetim)');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { pinta(e.target); io.unobserve(e.target); } }), { rootMargin: '200px' });
  artes.forEach((c) => io.observe(c));
} else artes.forEach(pinta);
let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => document.querySelectorAll('canvas.cm-art.ag-is-painted').forEach((c) => (c.classList.contains('cm-cetim') ? pintaCetim(c) : pinta(c))), 250); });

// ---------------------------------------------------------------------------
// Hero viva do CEMEF (D19). Código próprio, escrito a partir da descrição do
// comportamento da hero do AGENTIC: um cetim escuro pintado uma vez (o zoom
// "respira" em CSS) e fios de luz que escorrem num campo de fluxo e sobem.
// Azul FAETEC no lugar do lime. Tudo decorativo (aria-hidden no .ag-hero-frame).
// ---------------------------------------------------------------------------

// Ruído de gradiente 2D com permutação por semente.
function criaRuido(seed) {
  const r = rng(seed), p = new Uint8Array(512), g = [];
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  for (let i = 0; i < 256; i++) { const a = r() * 6.2832; g.push([Math.cos(a), Math.sin(a)]); }
  const suave = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const n = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const X = xi & 255, Y = yi & 255;
    const d = (h, dx, dy) => { const v = g[h]; return v[0] * dx + v[1] * dy; };
    const a = d(p[p[X] + Y], xf, yf), b = d(p[p[X + 1] + Y], xf - 1, yf);
    const c = d(p[p[X] + Y + 1], xf, yf - 1), e = d(p[p[X + 1] + Y + 1], xf - 1, yf - 1);
    const u = suave(xf), v = suave(yf);
    return (a + (b - a) * u) + ((c + (e - c) * u) - (a + (b - a) * u)) * v; // ~[-0.7, 0.7]
  };
  n.fbm = (x, y, oit) => { let s = 0, amp = 0.5, f = 1; for (let o = 0; o < oit; o++) { s += amp * n(x * f, y * f); f *= 2.03; amp *= 0.5; } return s; };
  return n;
}

// Cetim: mapa de alturas com ruído dobrado sobre si mesmo, iluminado do alto à esquerda.
const RAMPA = [[3, 3, 3], [20, 18, 16], [58, 54, 47], [163, 154, 138], [244, 236, 221], [255, 255, 255]];
function pintaCetim(cv) {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = (cv.width = Math.max(1, Math.round(r.width * dpr)));
  const H = (cv.height = Math.max(1, Math.round(r.height * dpr)));
  const seed = Number(cv.dataset.seed || 7), rand = rng(seed + 11), ruido = criaRuido(seed);
  const ganho = Number(cv.dataset.ganho || 0.55), escala = Number(cv.dataset.escala || 0.5);
  // calcula em ~110 mil pixels e amplia suavemente
  const k = Math.min(1, Math.sqrt(110000 / (W * H)));
  const w = Math.max(2, Math.round(W * k)), h = Math.max(2, Math.round(H * k)), menor = Math.min(w, h);
  const freq = 0.9 * (0.8 + rand() * 0.5) * escala, ox = rand() * 50, oy = rand() * 50;
  const alt = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = (x / menor) * freq + ox, v = (y / menor) * freq + oy;
    const qx = ruido.fbm(u, v, 4), qy = ruido.fbm(u + 5.2, v + 1.3, 4);
    alt[y * w + x] = ruido.fbm(u + 1.9 * qx, v + 1.9 * qy, 4);
  }
  const amp = 0.16 * menor; // altura das dobras: 16% do menor lado
  let L = [-0.5, -0.62, 0.6]; const nl = Math.hypot(...L); L = L.map((c) => c / nl);
  let M = [L[0], L[1], L[2] + 1]; const nm = Math.hypot(...M); M = M.map((c) => c / nm);
  const img = new ImageData(w, h), px = img.data, cx = w / 2, cy = h / 2, rmax = Math.hypot(cx, cy);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    const dx = (alt[y * w + Math.min(w - 1, x + 1)] - alt[y * w + Math.max(0, x - 1)]) * amp / 2;
    const dy = (alt[Math.min(h - 1, y + 1) * w + x] - alt[Math.max(0, y - 1) * w + x]) * amp / 2;
    const nn = Math.hypot(dx, dy, 1), nx = -dx / nn, ny = -dy / nn, nz = 1 / nn;
    const dif = Math.max(0, (nx * L[0] + ny * L[1] + nz * L[2] + 0.4) / 1.4);
    let tom = (0.62 * dif * dif + 0.12 * (alt[i] + 0.5) + 0.04) * ganho;
    tom = Math.max(0, Math.min(0.999, tom));
    const pos = tom * (RAMPA.length - 1), a = Math.floor(pos), f = pos - a, c0 = RAMPA[a], c1 = RAMPA[a + 1];
    let R = c0[0] + (c1[0] - c0[0]) * f, G = c0[1] + (c1[1] - c0[1]) * f, B = c0[2] + (c1[2] - c0[2]) * f;
    const esp = Math.pow(Math.max(0, nx * M[0] + ny * M[1] + nz * M[2]), 46) * ganho;
    R += 190 * esp; G += 185 * esp; B += 175 * esp;
    const brilho = Math.min(0.22, (1 - nz) * 0.6) * ganho; // reflexo azul FAETEC nas encostas
    R += (0 - R) * brilho; G += (108 - G) * brilho; B += (168 - B) * brilho;
    const vin = 1 - 0.5 * Math.pow(Math.hypot(x - cx, y - cy) / rmax, 2);
    px[i * 4] = R * vin; px[i * 4 + 1] = G * vin; px[i * 4 + 2] = B * vin; px[i * 4 + 3] = 255;
  }
  const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
  tmp.getContext('2d').putImageData(img, 0, 0);
  const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(tmp, 0, 0, W, H);
  cv.classList.add('ag-is-painted');
}
document.querySelectorAll('canvas.cm-cetim').forEach((cv) => {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); requestAnimationFrame(() => pintaCetim(cv)); } }, { rootMargin: '900px' });
    io.observe(cv);
  } else pintaCetim(cv);
});

// Fios de luz: partículas num campo de fluxo, com rastro curto e deriva para cima.
(() => {
  const cv = document.querySelector('canvas.cm-fios');
  if (!cv) return;
  const hero = cv.closest('.ag-hero');
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ruido = criaRuido(1899), rand = rng(2002);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, ps = [], t = 0, raf = 0, visivel = true;
  const nasce = (p, inicio) => {
    p.x = rand() * W;
    p.y = inicio ? (0.15 + rand() * 0.95) * H : H + rand() * 20 * dpr;
    p.px = p.x; p.py = p.y; p.vida = 80 + Math.floor(rand() * 240);
    p.azul = rand() < 0.04;
  };
  function medir() {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = Math.max(1, Math.round(r.width * dpr));
    H = cv.height = Math.max(1, Math.round(r.height * dpr));
    const n = Math.min(2600, Math.round((r.width * r.height) / 560));
    ps = Array.from({ length: n }, () => { const p = {}; nasce(p, true); return p; });
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) passo(); // já começa com rastros
  }
  function passo() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 0.8 * dpr;
    const creme = new Path2D(), azul = new Path2D(), esc = 0.0016 / dpr;
    for (const p of ps) {
      const ang = ruido.fbm(p.x * esc + t, p.y * esc + t * 0.7, 2) * 6.2832 * 1.6 * 1.4;
      p.px = p.x; p.py = p.y;
      p.x += Math.cos(ang) * 1.5 * dpr;
      p.y += Math.sin(ang) * 1.5 * dpr - 0.5 * dpr;
      const alvo = p.azul ? azul : creme;
      alvo.moveTo(p.px, p.py); alvo.lineTo(p.x, p.y);
      if (--p.vida <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10) nasce(p, false);
    }
    ctx.strokeStyle = 'rgba(255,236,214,0.13)'; ctx.stroke(creme);
    ctx.strokeStyle = 'rgba(70,165,230,0.5)'; ctx.stroke(azul);
    t += 0.0012;
  }
  const quadro = () => { passo(); raf = requestAnimationFrame(quadro); };
  function liga() {
    cancelAnimationFrame(raf);
    const anda = visivel && !document.hidden && !calmo.matches;
    hero?.classList.toggle('ag-is-off', !anda); // pausa também o zoom e o grão (CSS)
    if (anda) raf = requestAnimationFrame(quadro);
  }
  if (calmo.matches) return; // sem fios para quem pediu menos movimento
  medir(); liga();
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visivel = es[0].isIntersecting; liga(); }).observe(cv);
  document.addEventListener('visibilitychange', liga);
  calmo.addEventListener?.('change', () => { if (calmo.matches) { cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); } else liga(); });
  let tm; window.addEventListener('resize', () => { clearTimeout(tm); tm = setTimeout(() => { medir(); liga(); }, 250); });
})();
