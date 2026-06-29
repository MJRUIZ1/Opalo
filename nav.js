/* nav.js — Navegación + Accesibilidad compartidos
   El atributo data-page en <body> marca el enlace activo. */

(function () {
  const pages = [
    { href: 'index.html',          label: 'Quiénes Somos',     key: 'index' },
    { href: 'proyectos.html',      label: 'Proyectos',         key: 'proyectos' },
    { href: 'futuros.html',        label: 'Futuros Proyectos', key: 'futuros' },
    { href: 'noticias.html',       label: 'Noticias',          key: 'noticias' },
    { href: 'colaboraciones.html', label: 'Colaboraciones',    key: 'colaboraciones' },
  ];

  const currentPage = document.body.dataset.page || '';

  const links = pages.map(p =>
    `<li><a href="${p.href}"${currentPage === p.key ? ' class="active"' : ''}>${p.label}</a></li>`
  ).join('\n      ');

  const mobileLinks = pages.map(p =>
    `<a href="${p.href}" onclick="closeMobile()">${p.label}</a>`
  ).join('\n    ');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav>
      <a class="nav-logo" href="index.html"><img src="img/opblanco.png" alt="Ópalo" width="70"></a>
      <ul class="nav-links">
        ${links}
        <li><button class="lang-btn" onclick="changeLang()">ES ▾</button></li>
        <li style="position:relative;">
          <button class="a11y-btn" id="a11yBtn" onclick="toggleA11yMenu()" aria-label="Opciones de accesibilidad" title="Accesibilidad">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="5" r="1.5"/>
              <path d="M12 8v5m0 0l-3 4m3-4l3 4"/>
              <path d="M8.5 10.5l-2 .5m9-1l2 .5"/>
            </svg>
          </button>

          <div class="a11y-menu" id="a11yMenu" role="menu" aria-hidden="true">
            <div class="a11y-menu-title">Accesibilidad</div>

            <button class="a11y-option" onclick="toggleA11y('fontSize')" id="opt-fontSize">
              <span class="a11y-icon">Aa</span>
              <span class="a11y-label">Texto grande</span>
              <span class="a11y-check" id="chk-fontSize">✓</span>
            </button>

            <button class="a11y-option" onclick="toggleA11y('contrast')" id="opt-contrast">
              <span class="a11y-icon">◑</span>
              <span class="a11y-label">Alto contraste</span>
              <span class="a11y-check" id="chk-contrast">✓</span>
            </button>

            <button class="a11y-option" onclick="toggleA11y('dyslexia')" id="opt-dyslexia">
              <span class="a11y-icon">𝖠</span>
              <span class="a11y-label">Fuente dislexia</span>
              <span class="a11y-check" id="chk-dyslexia">✓</span>
            </button>

            <button class="a11y-option" onclick="toggleA11y('lightMode')" id="opt-lightMode">
              <span class="a11y-icon" id="icon-lightMode">☀️</span>
              <span class="a11y-label" id="label-lightMode">Fondo claro</span>
              <span class="a11y-check" id="chk-lightMode">✓</span>
            </button>

            <button class="a11y-option a11y-disabled" onclick="showAudioMsg()" id="opt-audio">
              <span class="a11y-icon">🔊</span>
              <span class="a11y-label">Audio</span>
              <span class="a11y-badge">Próximamente</span>
            </button>

            <button class="a11y-reset" onclick="resetA11y()">Restablecer todo</button>
          </div>
        </li>
      </ul>
      <div class="hamburger" id="hamburger"><span></span><span></span><span></span></div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      ${mobileLinks}
    </div>
  `);

  /* ══════════════════════════════════
     Lógica de accesibilidad
  ══════════════════════════════════ */
  const A11Y_KEY = 'opalo-a11y';
  let state = JSON.parse(localStorage.getItem(A11Y_KEY) || '{}');

  function applyAll() {
    document.documentElement.classList.toggle('a11y-font-large', !!state.fontSize);
    document.documentElement.classList.toggle('a11y-contrast',   !!state.contrast);
    document.documentElement.classList.toggle('a11y-dyslexia',   !!state.dyslexia);
    document.documentElement.classList.toggle('a11y-light',      !!state.lightMode);

    ['fontSize', 'contrast', 'dyslexia', 'lightMode'].forEach(k => {
      const chk = document.getElementById('chk-' + k);
      const opt = document.getElementById('opt-' + k);
      if (chk) chk.style.opacity = state[k] ? '1' : '0';
      if (opt) opt.classList.toggle('active', !!state[k]);
    });

    /* Actualizar ícono y texto del botón de fondo */
    const icon  = document.getElementById('icon-lightMode');
    const label = document.getElementById('label-lightMode');
    if (icon && label) {
      icon.textContent  = state.lightMode ? '🌙' : '☀️';
      label.textContent = state.lightMode ? 'Fondo oscuro' : 'Fondo claro';
    }
  }

  window.toggleA11y = function (key) {
    state[key] = !state[key];
    localStorage.setItem(A11Y_KEY, JSON.stringify(state));
    applyAll();
  };

  window.resetA11y = function () {
    state = {};
    localStorage.removeItem(A11Y_KEY);
    applyAll();
  };

  window.showAudioMsg = function () {
    if (typeof window.Swal !== 'undefined') {
      window.Swal.fire({
        title: '<span style="color:#D8A8FF">🔊 Audio</span>',
        html: '<p style="color:rgba(240,232,255,0.7)">Esta función estará disponible próximamente.</p>',
        confirmButtonText: 'Entendido',
        background: '#120830',
        color: '#f0e8ff',
        confirmButtonColor: '#D8A8FF',
      });
    } else {
      alert('Esta función estará disponible próximamente.');
    }
  };

  window.toggleA11yMenu = function () {
    const menu = document.getElementById('a11yMenu');
    const btn  = document.getElementById('a11yBtn');
    const open = menu.classList.toggle('open');
    menu.setAttribute('aria-hidden', String(!open));
    btn.classList.toggle('active', open);
    if (open) {
      setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
          if (!menu.contains(e.target) && e.target !== btn) {
            menu.classList.remove('open');
            btn.classList.remove('active');
            menu.setAttribute('aria-hidden', 'true');
            document.removeEventListener('click', closeMenu);
          }
        });
      }, 50);
    }
  };

  document.addEventListener('DOMContentLoaded', applyAll);
})();
