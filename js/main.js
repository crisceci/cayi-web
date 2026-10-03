var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Menú móvil ----------
var navToggle = document.getElementById('navToggle');
var mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mainNav.addEventListener('click', function (e) {
    if (!e.target.closest('a')) return;
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
}

// ---------- Navbar: fondo con blur al hacer scroll ----------
(function navbarScroll() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ---------- Año automático en el footer ----------
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Resalta en el menú la sección que se está viendo ----------
(function scrollspy() {
  var sections = document.querySelectorAll('main section[id], .clients-marquee[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

// ---------- Parallax muy sutil en la imagen del héroe ----------
(function heroParallax() {
  if (prefersReducedMotion) return;
  var hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', function () {
    var media = document.querySelector('.hero-bg img, .hero-bg video');
    if (!media) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    var progress = -rect.top / (hero.offsetHeight || 1);
    media.style.transform = 'translateY(' + Math.round(progress * 60) + 'px) scale(1.06)';
  }, { passive: true });
})();

// ---------- Entrada del héroe (GSAP) — se dispara después del splash ----------
function playHeroEntrance() {
  if (!window.gsap) return;
  var targets = ['.hero-tag', '#heroTitle', '#heroP1', '#heroActions'];
  gsap.set(targets, { opacity: 0, y: 26 });
  gsap.set('.hero-bg', { opacity: 0, scale: 1.08 });
  gsap.to('.hero-bg', { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' });
  gsap.to('.hero-tag', { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: 'power2.out' });
  gsap.to('#heroTitle', { opacity: 1, y: 0, duration: 0.75, delay: 0.36, ease: 'power2.out' });
  gsap.to('#heroP1', { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power2.out' });
  gsap.to('#heroActions', { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' });
}

// ---------- Sonido de bienvenida (sintetizado, sin archivos de audio) ----------
function playChime() {
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();

    function scheduleNotes() {
      var now = ctx.currentTime;
      var notes = [523.25, 659.25, 783.99];
      notes.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        var start = now + i * 0.09;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.4, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.8);
      });
    }

    if (ctx.state === 'running') {
      scheduleNotes();
    } else {
      var onFirstInteraction = function () {
        ctx.resume().then(scheduleNotes).catch(function () {});
        cleanup();
      };
      var cleanup = function () {
        ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
          document.removeEventListener(evt, onFirstInteraction);
        });
      };
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
        document.addEventListener(evt, onFirstInteraction, { once: true, passive: true });
      });
    }
  } catch (e) { /* Web Audio no soportado — silencioso */ }
}

// ---------- Splash de bienvenida ("Cayi Studio") ----------
(function splash() {
  var el = document.getElementById('splash');
  if (!el) { playHeroEntrance(); return; }

  function finish() {
    document.body.classList.remove('splash-active');
    el.classList.add('splash-hidden');
    playHeroEntrance();
  }

  var safety = setTimeout(finish, 4000);

  if (prefersReducedMotion || !window.gsap) {
    clearTimeout(safety);
    finish();
    return;
  }

  document.body.classList.add('splash-active');
  playChime();

  var letters = el.querySelectorAll('.splash-letter');
  gsap.set(letters, {
    opacity: 0,
    x: function (i, target) { return target.getAttribute('data-dir') === 'left' ? -70 : 70; }
  });
  gsap.set('#splashSub', { opacity: 0, y: 10 });
  gsap.set('#splashShine', { xPercent: 0 });

  var tl = gsap.timeline({ onComplete: function () { clearTimeout(safety); finish(); } });
  tl.to(letters, { opacity: 1, x: 0, duration: 0.55, ease: 'back.out(1.7)', stagger: 0.08 })
    .to('#splashSub', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
    .to('#splashShine', { xPercent: 800, duration: 0.7, ease: 'power2.inOut' }, '-=0.1')
    .to({}, { duration: 0.3 })
    .to(el, { opacity: 0, duration: 0.5, ease: 'power1.inOut' });
})();

// ---------- Cursor personalizado (solo escritorio con mouse fino) ----------
// Usa delegación de eventos porque las tarjetas del portafolio se vuelven a
// crear cada vez que se actualiza el contenido (ver renderPortfolio más abajo).
(function customCursor() {
  var dot = document.getElementById('cursorDot');
  var label = document.getElementById('cursorLabel');
  if (!dot || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  window.addEventListener('mousemove', function (e) {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  }, { passive: true });

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('.portfolio-item')) {
      dot.classList.add('is-view');
      if (label) label.textContent = 'Ver';
    }
  });
  document.addEventListener('mouseout', function (e) {
    var toItem = e.target.closest('.portfolio-item');
    var stillInside = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.portfolio-item');
    if (toItem && !stillInside) dot.classList.remove('is-view');
  });
})();

// ---------- Filtros del portafolio ----------
// Delegado sobre la barra de filtros (fija) y re-consulta las tarjetas cada
// clic, así funciona sin importar cuántos proyectos haya en ese momento.
(function portfolioFilters() {
  var bar = document.getElementById('portfolioFilters');
  if (!bar) return;
  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    bar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
    var filter = btn.dataset.filter;
    document.querySelectorAll('#portfolioGrid .portfolio-item').forEach(function (item) {
      item.classList.toggle('hidden', !(filter === 'todos' || item.dataset.category === filter));
    });
  });
})();

// ==================================================================
// Contenido dinámico — todo lo que se puede agregar/quitar desde el
// panel de administrador (Portafolio, Servicios, Testimonios, Clientes,
// Redes sociales, Datos de contacto adicionales) se dibuja aquí a partir
// de los datos, en vez de vivir como HTML fijo en index.html.
// ==================================================================
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function renderExtra(extra) {
  if (!extra || !extra.length) return '';
  var rows = extra.filter(function (e) { return e && e.label; }).map(function (e) {
    return '<div class="extra-row"><dt>' + esc(e.label) + '</dt><dd>' + esc(e.value) + '</dd></div>';
  }).join('');
  return rows ? '<dl class="extra-fields">' + rows + '</dl>' : '';
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url || '');
}

function setMedia(container, url, altText, isDecorative) {
  if (!container || !url) return;
  var existing = container.querySelector('img, video');
  var wantVideo = isVideoUrl(url);
  var isVideoEl = existing && existing.tagName === 'VIDEO';

  if (wantVideo && !isVideoEl) {
    var v = document.createElement('video');
    v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
    if (existing) existing.replaceWith(v); else container.appendChild(v);
    existing = v;
  } else if (!wantVideo && isVideoEl) {
    var img = document.createElement('img');
    img.loading = 'lazy';
    existing.replaceWith(img);
    existing = img;
  }
  if (!existing) return;
  existing.src = url;
  if (!wantVideo) existing.alt = isDecorative ? '' : (altText || '');
}

// ---------- Servicios (filas editoriales numeradas) ----------
function renderServices(items) {
  var container = document.getElementById('serviceRows');
  if (!container) return;
  container.innerHTML = (items || []).map(function (item, i) {
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    return '<article class="service-row" data-aos="fade-up">' +
      '<span class="service-num">' + num + '</span>' +
      '<div class="service-row-text"><h3>' + esc(item.title) + '</h3><p>' + esc(item.desc) + '</p>' + renderExtra(item.extra) + '</div>' +
      '<div class="service-row-media"><img src="' + esc(item.image || '') + '" alt="" loading="lazy"></div>' +
      '<span class="service-arrow">→</span>' +
    '</article>';
  }).join('');
}

// ---------- Portafolio (bento/masonry + filtros) ----------
var BENTO_PATTERN = ['big', 'normal', 'small', 'tall', 'normal', 'wide', 'small', 'tall'];
function renderPortfolio(items) {
  var grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  grid.innerHTML = (items || []).map(function (item, i) {
    var spanClass = BENTO_PATTERN[i % BENTO_PATTERN.length];
    var cls = 'portfolio-item' + (spanClass !== 'normal' ? ' ' + spanClass : '');
    var cat = item.category || '';
    var catLabel = cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '';
    return '<article class="' + cls + '" data-category="' + esc(cat) + '">' +
      '<div class="portfolio-media"><img src="' + esc(item.image || '') + '" alt="' + esc(item.title || '') + '" loading="lazy"></div>' +
      '<div class="portfolio-overlay">' +
        (catLabel ? '<span class="portfolio-cat">' + esc(catLabel) + '</span>' : '') +
        '<h3>' + esc(item.title || '') + '</h3>' +
        (item.client ? '<p class="portfolio-client">' + esc(item.client) + '</p>' : '') +
        renderExtra(item.extra) +
        '<span class="portfolio-link">Ver proyecto →</span>' +
      '</div>' +
    '</article>';
  }).join('');
}

// ---------- Testimonios (carrusel) ----------
var testimonialState = { current: 0 };
function initTestimonialCarousel() {
  var track = document.getElementById('testimonialTrack');
  var prevBtn = document.getElementById('testiPrev');
  var nextBtn = document.getElementById('testiNext');
  var counter = document.getElementById('testiCounter');
  if (!track || !prevBtn || !nextBtn) return;

  var slides = track.querySelectorAll('.testimonial-slide');
  testimonialState.current = 0;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function update() {
    slides.forEach(function (s, i) { s.classList.toggle('active', i === testimonialState.current); });
    counter.textContent = slides.length ? (pad(testimonialState.current + 1) + ' / ' + pad(slides.length)) : '00 / 00';
    prevBtn.disabled = slides.length <= 1;
    nextBtn.disabled = slides.length <= 1;
  }
  prevBtn.onclick = function () { testimonialState.current = (testimonialState.current - 1 + slides.length) % slides.length; update(); };
  nextBtn.onclick = function () { testimonialState.current = (testimonialState.current + 1) % slides.length; update(); };
  update();
}

function renderTestimonials(items) {
  var track = document.getElementById('testimonialTrack');
  if (!track) return;
  track.innerHTML = (items || []).map(function (item, i) {
    return '<blockquote class="testimonial-slide' + (i === 0 ? ' active' : '') + '">' +
      '<p>' + esc(item.quote) + '</p>' +
      '<footer>' +
        (item.avatar ? '<img class="testi-avatar" src="' + esc(item.avatar) + '" alt="" loading="lazy">' : '') +
        '<div><strong>' + esc(item.name) + '</strong><span>' + esc(item.role) + '</span>' + renderExtra(item.extra) + '</div>' +
      '</footer>' +
    '</blockquote>';
  }).join('');
  initTestimonialCarousel();
}

// ---------- Clientes (marquesina) ----------
function renderClients(items) {
  var track = document.getElementById('clientsMarquee');
  if (!track) return;
  function logoHtml(item, hidden) {
    var inner = item.logo
      ? '<img src="' + esc(item.logo) + '" alt="' + esc(item.name || '') + '" style="max-height:32px;filter:grayscale(1) brightness(1.8)">'
      : esc(item.name || '');
    return '<div class="client-logo"' + (hidden ? ' aria-hidden="true"' : '') + '>' + inner + '</div>';
  }
  var list = items || [];
  track.innerHTML = list.map(function (item) { return logoHtml(item, false); }).join('') +
    list.map(function (item) { return logoHtml(item, true); }).join('');
}

// ---------- Redes sociales ----------
function renderSocial(items) {
  var html = (items || []).filter(function (i) { return i && i.url; }).map(function (item) {
    return '<a href="' + esc(item.url) + '" target="_blank" rel="noopener" aria-label="' + esc(item.platform) + '">' + esc(item.platform) + '</a>';
  }).join('');
  var main = document.getElementById('socialLinks');
  var footer = document.getElementById('socialLinksFooter');
  if (main) main.innerHTML = html;
  if (footer) footer.innerHTML = html;
}

// ---------- Datos de contacto adicionales ----------
function renderContactExtra(items) {
  var list = document.getElementById('contactExtraList');
  if (!list) return;
  list.innerHTML = (items || []).filter(function (i) { return i && i.label && i.value; }).map(function (item) {
    return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg><span>' +
      esc(item.label) + ': ' + esc(item.value) + '</span></li>';
  }).join('');
}

// ---------- Aplica todo el contenido (por defecto, o guardado en Supabase) ----------
function applyContent(content) {
  if (content.colors) {
    var root = document.documentElement.style;
    if (content.colors.ink) root.setProperty('--ink', content.colors.ink);
    if (content.colors.orange) root.setProperty('--orange', content.colors.orange);
    if (content.colors.pink) root.setProperty('--pink', content.colors.pink);
    if (content.colors.teal) root.setProperty('--teal', content.colors.teal);
  }

  if (content.hero) {
    var eyebrow = document.getElementById('heroEyebrow');
    var title = document.getElementById('heroTitle');
    var p1 = document.getElementById('heroP1');
    if (eyebrow) eyebrow.textContent = content.hero.eyebrow;
    if (title) title.innerHTML = content.hero.title;
    if (p1) p1.innerHTML = content.hero.p1;
    if (content.hero.media) setMedia(document.querySelector('[data-hero-media]'), content.hero.media, 'Reel de Cayi Studio', false);
  }

  renderServices(content.services);
  renderPortfolio(content.portfolio);

  if (content.about) {
    var aboutTitle = document.getElementById('aboutTitle');
    var aboutP1 = document.getElementById('aboutP1');
    var aboutP2 = document.getElementById('aboutP2');
    var aboutImg = document.getElementById('aboutImg');
    if (aboutTitle) aboutTitle.innerHTML = content.about.title;
    if (aboutP1) aboutP1.innerHTML = content.about.p1;
    if (aboutP2) aboutP2.innerHTML = content.about.p2;
    if (aboutImg && content.about.image) aboutImg.src = content.about.image;
  }

  renderTestimonials(content.testimonials);
  renderClients(content.clients);
  renderSocial(content.social);
  renderContactExtra(content.contactExtra);

  if (content.contact) {
    var phoneLink = document.getElementById('contactPhoneLink');
    var emailLink = document.getElementById('contactEmailLink');
    var whatsapp = document.getElementById('contactWhatsapp');
    if (phoneLink && content.contact.phone) {
      var digits = content.contact.phone.replace(/[^\d+]/g, '');
      phoneLink.textContent = content.contact.phone;
      phoneLink.href = 'tel:' + digits;
      if (whatsapp) whatsapp.href = 'https://wa.me/' + digits.replace('+', '');
    }
    if (emailLink && content.contact.email) {
      emailLink.textContent = content.contact.email;
      emailLink.href = 'mailto:' + content.contact.email;
    }
  }
}

// ---------- Primer dibujo: contenido por defecto, sin esperar red ----------
if (window.CAYI_mergeContent) {
  applyContent(window.CAYI_mergeContent({}));
}

// ---------- Animaciones al hacer scroll (librería AOS) ----------
// Se inicializa después del primer dibujo de contenido, para que detecte
// las filas de servicios/tarjetas ya presentes en el DOM.
if (window.AOS) {
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60, disable: prefersReducedMotion });
}

// ---------- Panel de administrador vía Supabase ----------
// Si no configuraste supabase-config.js todavía, esta sección simplemente no
// hace nada y la web se queda con el contenido por defecto de arriba.
(function contentSync() {
  var url = window.SUPABASE_URL;
  var key = window.SUPABASE_ANON_KEY;
  var notConfigured = !url || !key || url.indexOf('tu-proyecto') !== -1;
  if (notConfigured || !window.supabase || !window.CAYI_mergeContent) return;

  var client = window.supabase.createClient(url, key);

  function refreshAOS() { if (window.AOS && window.AOS.refresh) window.AOS.refresh(); }

  function loadAndApply() {
    client.from('cayi_web_content').select('data').eq('id', 1).single()
      .then(function (res) {
        if (res.error || !res.data) return;
        applyContent(window.CAYI_mergeContent(res.data.data));
        refreshAOS();
      })
      .catch(function (err) { console.warn('Cayi Studio: no se pudo cargar el contenido de Supabase', err); });
  }

  loadAndApply();

  // Actualiza la web al instante si editas algo en el panel de administrador (sin recargar la página)
  client
    .channel('cayi_web_content_public')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cayi_web_content' }, function (payload) {
      if (payload.new && payload.new.data) {
        applyContent(window.CAYI_mergeContent(payload.new.data));
        refreshAOS();
      }
    })
    .subscribe();
})();
