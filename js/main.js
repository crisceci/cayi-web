// ---------- Menú móvil ----------
var navToggle = document.getElementById('navToggle');
var mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Año automático en el footer ----------
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Animaciones al hacer scroll (librería AOS) ----------
if (window.AOS) {
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
}

// ---------- Entrada del héroe (GSAP) ----------
if (window.gsap) {
  gsap.set(['#heroEyebrow', '#heroTitle', '#heroP1', '#heroP2', '#heroActions'], { opacity: 0, y: 22 });
  gsap.set('.hero-media', { opacity: 0, scale: 0.96 });
  gsap.to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
  gsap.to('#heroTitle',   { opacity: 1, y: 0, duration: 0.7, delay: 0.22, ease: 'power2.out' });
  gsap.to('#heroP1',      { opacity: 1, y: 0, duration: 0.7, delay: 0.36, ease: 'power2.out' });
  gsap.to('#heroP2',      { opacity: 1, y: 0, duration: 0.7, delay: 0.46, ease: 'power2.out' });
  gsap.to('#heroActions', { opacity: 1, y: 0, duration: 0.7, delay: 0.56, ease: 'power2.out' });
  gsap.to('.hero-media',  { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
}

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
    }

    // Video del héroe (reel destacado)
    if (content.hero && content.hero.media) {
      setMedia(document.querySelector('[data-hero-media]'), content.hero.media, 'Reel de Cayi Studio', false);
    }

    // Portafolio
    (content.portfolio || []).forEach(function (item, i) {
      var card = document.querySelector('[data-portfolio="' + i + '"]');
      if (!card) return;
      var img = card.querySelector('img');
      var h3 = card.querySelector('h3');
      var p = card.querySelector('p');
      if (img && item.image) { img.src = item.image; img.alt = item.title || ''; }
      if (h3) h3.textContent = item.title;
      if (p) p.textContent = item.client;
    });

    // Servicios
    (content.services || []).forEach(function (item, i) {
      var card = document.querySelector('[data-service="' + i + '"]');
      if (!card) return;
      var h3 = card.querySelector('h3');
      var p = card.querySelector('p');
      if (h3) h3.textContent = item.title;
      if (p) p.textContent = item.desc;
    });

    // Nosotros
    if (content.about) {
      var aboutTitle = document.getElementById('aboutTitle');
      var aboutP1 = document.getElementById('aboutP1');
      var aboutP2 = document.getElementById('aboutP2');
      var aboutImg = document.getElementById('aboutImg');
      if (aboutTitle) aboutTitle.textContent = content.about.title;
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
      if (p) p.textContent = '"' + item.quote + '"';
      if (strong) strong.textContent = item.name;
      if (span) span.textContent = item.role;
    });

    // Clientes
    (content.clients || []).forEach(function (item, i) {
      var box = document.querySelector('[data-client="' + i + '"]');
      if (!box) return;
      if (item.logo) {
        box.innerHTML = '';
        var img = document.createElement('img');
        img.src = item.logo;
        img.alt = item.name || '';
        img.style.maxWidth = '80%';
        img.style.maxHeight = '60%';
        box.appendChild(img);
      } else {
        box.textContent = item.name;
      }
    });

    // Contacto
    if (content.contact) {
      var phoneLink = document.getElementById('contactPhoneLink');
      var emailLink = document.getElementById('contactEmailLink');
      var addressText = document.getElementById('contactAddressText');
      if (phoneLink && content.contact.phone) {
        phoneLink.textContent = content.contact.phone;
        phoneLink.href = 'tel:' + content.contact.phone.replace(/[^\d+]/g, '');
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
