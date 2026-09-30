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

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
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

// ---------- Animaciones al hacer scroll (librería AOS) ----------
if (window.AOS) {
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60, disable: prefersReducedMotion });
}

// ---------- Parallax muy sutil en la imagen del héroe ----------
(function heroParallax() {
  if (prefersReducedMotion) return;
  var media = document.querySelector('.hero-bg img, .hero-bg video');
  var hero = document.querySelector('.hero');
  if (!media || !hero) return;
  window.addEventListener('scroll', function () {
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
(function customCursor() {
  var dot = document.getElementById('cursorDot');
  var label = document.getElementById('cursorLabel');
  if (!dot || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  window.addEventListener('mousemove', function (e) {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  }, { passive: true });

  document.querySelectorAll('.portfolio-item').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      dot.classList.add('is-view');
      if (label) label.textContent = 'Ver';
    });
    item.addEventListener('mouseleave', function () { dot.classList.remove('is-view'); });
  });
})();

// ---------- Filtros del portafolio ----------
(function portfolioFilters() {
  var bar = document.getElementById('portfolioFilters');
  var grid = document.getElementById('portfolioGrid');
  if (!bar || !grid) return;

  var buttons = bar.querySelectorAll('.filter-btn');
  var items = grid.querySelectorAll('.portfolio-item');

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    var filter = btn.dataset.filter;

    buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
    items.forEach(function (item) {
      var show = filter === 'todos' || item.dataset.category === filter;
      item.classList.toggle('hidden', !show);
    });
  });
})();

// ---------- Carrusel de testimonios ----------
(function testimonialCarousel() {
  var track = document.getElementById('testimonialTrack');
  var prevBtn = document.getElementById('testiPrev');
  var nextBtn = document.getElementById('testiNext');
  var counter = document.getElementById('testiCounter');
  if (!track || !prevBtn || !nextBtn) return;

  var slides = track.querySelectorAll('.testimonial-slide');
  var current = 0;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function render() {
    slides.forEach(function (slide, i) { slide.classList.toggle('active', i === current); });
    if (counter) counter.textContent = pad(current + 1) + ' / ' + pad(slides.length);
    prevBtn.disabled = slides.length <= 1;
    nextBtn.disabled = slides.length <= 1;
  }

  prevBtn.addEventListener('click', function () {
    current = (current - 1 + slides.length) % slides.length;
    render();
  });
  nextBtn.addEventListener('click', function () {
    current = (current + 1) % slides.length;
    render();
  });

  render();
})();

// ---------- Contenido dinámico (Panel de administrador vía Supabase) ----------
// Si no configuraste supabase-config.js todavía, esta sección simplemente no
// hace nada y la web se ve con el contenido de ejemplo que ya está en el HTML.
(function contentSync() {
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

  function hydrate(content) {
    // Colores de marca
    if (content.colors) {
      var root = document.documentElement.style;
      if (content.colors.ink) root.setProperty('--ink', content.colors.ink);
      if (content.colors.orange) root.setProperty('--orange', content.colors.orange);
      if (content.colors.pink) root.setProperty('--pink', content.colors.pink);
      if (content.colors.teal) root.setProperty('--teal', content.colors.teal);
    }

    // Héroe
    if (content.hero) {
      var eyebrow = document.getElementById('heroEyebrow');
      var title = document.getElementById('heroTitle');
      var p1 = document.getElementById('heroP1');
      var p2 = document.getElementById('heroP2');
      if (eyebrow) eyebrow.textContent = content.hero.eyebrow;
      if (title) title.innerHTML = content.hero.title;
      if (p1) p1.innerHTML = content.hero.p1;
      if (p2) p2.innerHTML = content.hero.p2;
      if (content.hero.media) setMedia(document.querySelector('[data-hero-media]'), content.hero.media, 'Reel de Cayi Studio', false);
    }

    // Portafolio
    (content.portfolio || []).forEach(function (item, i) {
      var card = document.querySelector('[data-portfolio="' + i + '"]');
      if (!card) return;
      var img = card.querySelector('img');
      var h3 = card.querySelector('h3');
      var cat = card.querySelector('.portfolio-cat');
      if (img && item.image) { img.src = item.image; img.alt = item.title || ''; }
      if (h3) h3.textContent = item.title;
      if (cat && item.category) cat.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);
      if (item.category) card.dataset.category = item.category;
    });

    // Servicios
    (content.services || []).forEach(function (item, i) {
      var row = document.querySelector('[data-service="' + i + '"]');
      if (!row) return;
      var h3 = row.querySelector('h3');
      var p = row.querySelector('p');
      var img = row.querySelector('img');
      if (h3) h3.textContent = item.title;
      if (p) p.textContent = item.desc;
      if (img && item.image) img.src = item.image;
    });

    // Nosotros
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

    // Testimonios
    (content.testimonials || []).forEach(function (item, i) {
      var card = document.querySelector('[data-testimonial="' + i + '"]');
      if (!card) return;
      var p = card.querySelector('p');
      var strong = card.querySelector('footer strong');
      var span = card.querySelector('footer span');
      if (p) p.textContent = item.quote;
      if (strong) strong.textContent = item.name;
      if (span) span.textContent = item.role;
    });

    // Clientes (cada logo aparece 2 veces en la marquesina — se actualizan ambas copias)
    (content.clients || []).forEach(function (item, i) {
      document.querySelectorAll('[data-client="' + i + '"]').forEach(function (box) {
        if (item.logo) {
          box.innerHTML = '';
          var img = document.createElement('img');
          img.src = item.logo;
          img.alt = item.name || '';
          img.style.maxHeight = '32px';
          img.style.filter = 'grayscale(1) brightness(1.8)';
          box.appendChild(img);
        } else {
          box.textContent = item.name;
        }
      });
    });

    // Contacto
    if (content.contact) {
      var phoneLink = document.getElementById('contactPhoneLink');
      var emailLink = document.getElementById('contactEmailLink');
      var addressText = document.getElementById('contactAddressText');
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
      if (addressText && content.contact.address) addressText.textContent = content.contact.address;

      ['instagram', 'facebook', 'tiktok'].forEach(function (key) {
        var url = content.contact[key];
        if (!url) return;
        document.querySelectorAll('[data-social="' + key + '"]').forEach(function (a) {
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener';
        });
      });
    }
  }

  var url = window.SUPABASE_URL;
  var key = window.SUPABASE_ANON_KEY;
  var notConfigured = !url || !key || url.indexOf('tu-proyecto') !== -1;
  if (notConfigured || !window.supabase || !window.CAYI_mergeContent) return;

  var client = window.supabase.createClient(url, key);

  function loadAndHydrate() {
    client.from('cayi_web_content').select('data').eq('id', 1).single()
      .then(function (res) {
        if (res.error || !res.data) return;
        hydrate(window.CAYI_mergeContent(res.data.data));
      })
      .catch(function (err) { console.warn('Cayi Studio: no se pudo cargar el contenido de Supabase', err); });
  }

  loadAndHydrate();

  // Actualiza la web al instante si editas algo en el panel de administrador (sin recargar la página)
  client
    .channel('cayi_web_content_public')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cayi_web_content' }, function (payload) {
      if (payload.new && payload.new.data) hydrate(window.CAYI_mergeContent(payload.new.data));
    })
    .subscribe();
})();
