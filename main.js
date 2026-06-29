/* ═══════════════════════════════════════════════
   main.js — Estudios Ópalo
   Funciones compartidas entre todas las páginas
   ═══════════════════════════════════════════════ */

/* ── Starfield ── */
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.005,
        speed: Math.random() * 0.08 + 0.01
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a > 1 || s.a < 0) s.da *= -1;
      s.y -= s.speed;
      if (s.y < 0) s.y = canvas.height;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,232,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();
  makeStars(320);
  draw();
  window.addEventListener('resize', () => { resize(); makeStars(320); });
})();


/* ── Parallax (sólo en hero) ── */
function initParallax() {
  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;
  const layers = document.querySelectorAll('[data-speed]');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        layers.forEach(el => {
          const sp = parseFloat(el.dataset.speed) || 0;
          el.style.transform = `translate3d(0,${sy * sp}px,0)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  heroEl.addEventListener('mousemove', e => {
    const w = window.innerWidth, h = window.innerHeight;
    const dx = (e.clientX - w / 2) / w;
    const dy = (e.clientY - h / 2) / h;
    layers.forEach(el => {
      const sp = parseFloat(el.dataset.speed) || 0;
      el.style.transform = `translate3d(${dx * sp * 80}px,${dy * sp * 80 + window.scrollY * sp}px,0)`;
    });
  });
}

/* ── Parallax foto de fondo Origen ── */
function initOrigenParallax() {
  const bg = document.getElementById('origenBg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const section = document.getElementById('origen');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom < 0 || rect.top > viewH) return;
    const progress = -rect.top / (viewH + section.offsetHeight);
    bg.style.transform = `translateY(${progress * 120}px)`;
  }, { passive: true });
}

/* ── Scroll reveal ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── Menú móvil ── */
function closeMobile() {
  const mob = document.getElementById('mobileMenu');
  if (mob) mob.classList.remove('open');
}
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  if (ham) ham.addEventListener('click', () => mob.classList.add('open'));
  if (mob) mob.addEventListener('click', e => { if (e.target === e.currentTarget) closeMobile(); });
});

/* ── Tema compartido SweetAlert2 ── */
const swalTheme = {
  background: '#1a0e2e',
  color: '#f0e8ff',
  confirmButtonColor: '#f6a6e8',
  cancelButtonColor: '#512f5c',
  backdrop: 'rgba(13,6,24,0.85)'
};

/* Helper interno — nunca falla si Swal no cargó */
function _swal(opts) {
  if (typeof window.Swal !== 'undefined') {
    window.Swal.fire(opts);
  } else {
    console.warn('SweetAlert2 no está cargado todavía.');
  }
}

/* ── Helpers SweetAlert ── */
function showTeam(m) {
  _swal({
    title: `<span style="font-family:Georgia,serif;color:#f6a6e8">${m.name}</span>`,
    html: `<div style="text-align:center">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,${m.color},#1a0e2e);display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;margin:0 auto 1rem;border:2px solid rgba(246,166,232,0.4)">${m.init}</div>
      <p style="color:#ed9e6f;letter-spacing:3px;font-size:0.8rem;text-transform:uppercase">${m.role}</p>
      <p style="color:rgba(240,232,255,0.65);font-size:0.9rem;line-height:1.8;margin-top:1rem">${m.desc || 'Integrante clave del equipo Ópalo.'}</p>
    </div>`,
    confirmButtonText: 'Cerrar',
    ...swalTheme
  });
}

function showProject(title, desc) {
  _swal({
    title: `<span style="font-size:1.1rem;color:#f6a6e8">${title}</span>`,
    html: `<p style="color:rgba(240,232,255,0.75);font-size:0.95rem;line-height:1.8">${desc}</p>`,
    confirmButtonText: 'Cerrar',
    ...swalTheme
  });
}

function showNoticia(titulo, contenido) {
  _swal({
    title: `<span style="font-size:1.1rem;color:#f6a6e8">${titulo}</span>`,
    html: `<p style="color:rgba(240,232,255,0.75);font-size:0.95rem;line-height:1.8">${contenido}</p>`,
    confirmButtonText: 'Cerrar',
    ...swalTheme
  });
}

function changeLang() {
  _swal({
    title: `<span style="color:#f6a6e8">Idioma / Language</span>`,
    html: `<div style="display:flex;gap:1rem;justify-content:center;margin-top:1rem">
      <button onclick="Swal.close()" style="background:rgba(246,166,232,0.15);border:1px solid #f6a6e8;color:#f6a6e8;padding:8px 24px;border-radius:20px;cursor:pointer;letter-spacing:2px">ES</button>
      <button onclick="Swal.close()" style="background:rgba(237,158,111,0.15);border:1px solid #ed9e6f;color:#ed9e6f;padding:8px 24px;border-radius:20px;cursor:pointer;letter-spacing:2px">EN</button>
    </div>`,
    showConfirmButton: false,
    ...swalTheme
  });
}
