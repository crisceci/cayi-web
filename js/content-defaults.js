// Contenido por defecto de la web de Cayi Studio.
// Esto es lo que se ve mientras no hay nada guardado en Supabase todavía
// (o si el panel de administrador aún no está configurado).
// El panel de administrador (admin.html) parte de estos mismos valores
// la primera vez que lo abres, y la web pública (index.html) los usa
// como respaldo si Supabase no responde.
//
// A partir de esta versión, portfolio / services / testimonials / clients /
// social / contactExtra son listas de largo libre: se puede agregar o quitar
// elementos desde el panel sin tocar código, y cada elemento puede tener
// campos personalizados ("extra") además de los campos fijos.
window.CAYI_DEFAULT_CONTENT = {
  colors: {
    ink: "#08090B",
    orange: "#EF8B3C",
    pink: "#C81760",
    teal: "#20C997"
  },
  hero: {
    eyebrow: "Ver Portafolio",
    title: "Creamos imágenes<br>que hacen ver<br>tu marca diferente.",
    p1: "Fotografía · Video · Producción visual",
    p2: "",
    media: "videos/cayi-hero.mp4"
  },
  portfolio: [
    { title: "Evento Corporativo",     category: "eventos",    client: "", image: "images/portfolio-eventos.svg",    extra: [] },
    { title: "Sesión de Estudio",      category: "estudio",    client: "", image: "images/portfolio-estudio.svg",    extra: [] },
    { title: "Campaña Publicitaria",   category: "publicidad", client: "", image: "images/portfolio-publicidad.svg", extra: [] },
    { title: "Contenido para Redes",   category: "contenido",  client: "", image: "images/portfolio-contenido.svg",  extra: [] },
    { title: "Retrato Profesional",    category: "estudio",    client: "", image: "images/portfolio-retrato.svg",    extra: [] },
    { title: "Backstage de Evento",    category: "eventos",    client: "", image: "images/portfolio-backstage.svg",  extra: [] }
  ],
  services: [
    { title: "Eventos Corporativos", desc: "Cobertura fotográfica y de video para conferencias, lanzamientos, workshops y celebraciones de empresa. Capturamos los momentos clave para que tu evento siga contando su historia después de terminado.", image: "images/service-eventos.svg", extra: [] },
    { title: "Fotografía de Estudio", desc: "Sesiones en estudio con iluminación controlada para retratos corporativos, equipos de trabajo, productos o books personales — resultados consistentes y de alta calidad.", image: "images/service-estudio.svg", extra: [] },
    { title: "Fotografía Publicitaria", desc: "Imágenes pensadas para vender: producto, campaña o marca, con dirección de arte enfocada en lo que tu audiencia necesita ver para conectar y convertir.", image: "images/service-publicidad.svg", extra: [] },
    { title: "Creación de Contenido", desc: "Fotografía y video para Instagram, TikTok y el resto de tus redes — contenido pensado para el feed, las historias y los formatos que tu marca necesita en el día a día.", image: "images/service-contenido.svg", extra: [] }
  ],
  about: {
    title: "No solo hacemos imágenes.<br>Creamos la forma en la que<br>tu marca es recordada.",
    p1: "Somos <strong>Cayi Studio</strong>, un equipo de fotografía y video que trabaja de cerca con cada cliente para entender qué necesita comunicar — y traducirlo en imágenes que se sostienen en el tiempo.",
    p2: "Desde una sesión de estudio hasta la cobertura completa de un evento corporativo, cuidamos cada detalle: la luz, el encuadre, el tiempo de entrega.",
    image: "images/about-placeholder.svg"
  },
  testimonials: [
    { quote: "El equipo de Cayi Studio entendió exactamente lo que necesitábamos para nuestro evento y entregó todo a tiempo.", name: "Valeria Chumpitaz", role: "Coordinadora de Marketing, Grupo Estrella", avatar: "images/avatar-1.svg", extra: [] },
    { quote: "Muy profesionales, creativos y fáciles de coordinar. Las fotos superaron nuestras expectativas.", name: "Renzo Salcedo", role: "Gerente de Eventos, Hotel Miraflores Bay", avatar: "images/avatar-2.svg", extra: [] },
    { quote: "Recomendamos a Cayi Studio para cualquier proyecto que necesite calidad y cumplimiento.", name: "Milagros Quispe", role: "Fundadora, Estudio Nima", avatar: "images/avatar-3.svg", extra: [] }
  ],
  clients: [
    { name: "Cliente 1", logo: "", extra: [] },
    { name: "Cliente 2", logo: "", extra: [] },
    { name: "Cliente 3", logo: "", extra: [] },
    { name: "Cliente 4", logo: "", extra: [] },
    { name: "Cliente 5", logo: "", extra: [] },
    { name: "Cliente 6", logo: "", extra: [] },
    { name: "Cliente 7", logo: "", extra: [] },
    { name: "Cliente 8", logo: "", extra: [] }
  ],
  social: [
    { platform: "Instagram", url: "" },
    { platform: "LinkedIn", url: "" },
    { platform: "TikTok", url: "" }
  ],
  contact: {
    phone: "+51 000 000 000",
    email: "hola@cayistudio.pe"
  },
  contactExtra: []
};

// Combina el contenido guardado en Supabase con los valores por defecto.
// Las listas (portfolio, services, testimonials, clients, social, contactExtra)
// ya no se mezclan elemento por elemento: si hay una lista guardada, se usa
// tal cual (porque el panel ahora permite agregar/quitar elementos libremente,
// así que su longitud ya no tiene por qué coincidir con la de los valores
// por defecto). Si no hay nada guardado todavía, se usan los valores por defecto.
window.CAYI_mergeContent = function (saved) {
  var d = window.CAYI_DEFAULT_CONTENT;
  saved = saved || {};
  function arr(key) {
    return Array.isArray(saved[key]) ? saved[key] : d[key];
  }

  // Migración automática (una sola vez): versiones anteriores de la web
  // guardaban las redes sociales como contact.instagram / contact.facebook /
  // contact.tiktok en vez del arreglo `social` de ahora. Si todavía no existe
  // `social` guardado pero sí hay datos reales en esos campos viejos, se
  // migran solos la primera vez que carga esta versión — así no se pierden
  // links que ya habías guardado antes de este cambio.
  var social = arr('social');
  if (!Array.isArray(saved.social) && saved.contact) {
    var legacy = [];
    if (saved.contact.instagram) legacy.push({ platform: 'Instagram', url: saved.contact.instagram });
    if (saved.contact.linkedin) legacy.push({ platform: 'LinkedIn', url: saved.contact.linkedin });
    if (saved.contact.facebook) legacy.push({ platform: 'Facebook', url: saved.contact.facebook });
    if (saved.contact.tiktok) legacy.push({ platform: 'TikTok', url: saved.contact.tiktok });
    if (legacy.length) social = legacy;
  }

  return {
    colors: Object.assign({}, d.colors, saved.colors),
    hero: Object.assign({}, d.hero, saved.hero),
    portfolio: arr('portfolio'),
    services: arr('services'),
    about: Object.assign({}, d.about, saved.about),
    testimonials: arr('testimonials'),
    clients: arr('clients'),
    social: social,
    contact: Object.assign({}, d.contact, saved.contact),
    contactExtra: arr('contactExtra')
  };
};

// Copia profunda simple (JSON-safe) — se usa en admin.html para no mutar
// accidentalmente CAYI_DEFAULT_CONTENT mientras se edita en el panel.
window.CAYI_clone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
