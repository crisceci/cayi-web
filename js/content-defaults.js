// Contenido por defecto de la web de Cayi Studio.
// Esto es lo que se ve mientras no hay nada guardado en Supabase todavía
// (o si el panel de administrador aún no está configurado).
// El panel de administrador (admin.html) parte de estos mismos valores
// la primera vez que lo abres, y la web pública (index.html) los usa
// como respaldo si Supabase no responde.
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
    { title: "Evento Corporativo",     category: "eventos",    client: "", image: "images/portfolio-eventos.svg" },
    { title: "Sesión de Estudio",      category: "estudio",    client: "", image: "images/portfolio-estudio.svg" },
    { title: "Campaña Publicitaria",   category: "publicidad", client: "", image: "images/portfolio-publicidad.svg" },
    { title: "Contenido para Redes",   category: "contenido",  client: "", image: "images/portfolio-contenido.svg" },
    { title: "Retrato Profesional",    category: "estudio",    client: "", image: "images/portfolio-retrato.svg" },
    { title: "Backstage de Evento",    category: "eventos",    client: "", image: "images/portfolio-backstage.svg" }
  ],
  services: [
    { title: "Eventos Corporativos", desc: "Cobertura fotográfica y de video para conferencias, lanzamientos, workshops y celebraciones de empresa. Capturamos los momentos clave para que tu evento siga contando su historia después de terminado.", image: "images/service-eventos.svg" },
    { title: "Fotografía de Estudio", desc: "Sesiones en estudio con iluminación controlada para retratos corporativos, equipos de trabajo, productos o books personales — resultados consistentes y de alta calidad.", image: "images/service-estudio.svg" },
    { title: "Fotografía Publicitaria", desc: "Imágenes pensadas para vender: producto, campaña o marca, con dirección de arte enfocada en lo que tu audiencia necesita ver para conectar y convertir.", image: "images/service-publicidad.svg" },
    { title: "Creación de Contenido", desc: "Fotografía y video para Instagram, TikTok y el resto de tus redes — contenido pensado para el feed, las historias y los formatos que tu marca necesita en el día a día.", image: "images/service-contenido.svg" }
  ],
  about: {
    title: "No solo hacemos imágenes.<br>Creamos la forma en la que<br>tu marca es recordada.",
    p1: "Somos <strong>Cayi Studio</strong>, un equipo de fotografía y video que trabaja de cerca con cada cliente para entender qué necesita comunicar — y traducirlo en imágenes que se sostienen en el tiempo.",
    p2: "Desde una sesión de estudio hasta la cobertura completa de un evento corporativo, cuidamos cada detalle: la luz, el encuadre, el tiempo de entrega.",
    image: "images/about-placeholder.svg"
  },
  testimonials: [
    { quote: "El equipo de Cayi Studio entendió exactamente lo que necesitábamos para nuestro evento y entregó todo a tiempo.", name: "Valeria Chumpitaz", role: "Coordinadora de Marketing, Grupo Estrella" },
    { quote: "Muy profesionales, creativos y fáciles de coordinar. Las fotos superaron nuestras expectativas.", name: "Renzo Salcedo", role: "Gerente de Eventos, Hotel Miraflores Bay" },
    { quote: "Recomendamos a Cayi Studio para cualquier proyecto que necesite calidad y cumplimiento.", name: "Milagros Quispe", role: "Fundadora, Estudio Nima" }
  ],
  clients: [
    { name: "Cliente 1", logo: "" },
    { name: "Cliente 2", logo: "" },
    { name: "Cliente 3", logo: "" },
    { name: "Cliente 4", logo: "" },
    { name: "Cliente 5", logo: "" },
    { name: "Cliente 6", logo: "" },
    { name: "Cliente 7", logo: "" },
    { name: "Cliente 8", logo: "" }
  ],
  contact: {
    phone: "+51 000 000 000",
    email: "hola@cayistudio.pe",
    address: "Agrega tu ciudad o dirección",
    instagram: "",
    facebook: "",
    tiktok: ""
  }
};

// Combina el contenido guardado en Supabase con los valores por defecto,
// para que campos nuevos que agreguemos en el futuro no rompan sitios ya guardados.
window.CAYI_mergeContent = function (saved) {
  var d = window.CAYI_DEFAULT_CONTENT;
  saved = saved || {};
  function mergeArray(defArr, savedArr) {
    if (!Array.isArray(savedArr)) return defArr;
    return defArr.map(function (defItem, i) {
      return Object.assign({}, defItem, savedArr[i] || {});
    });
  }
  return {
    colors: Object.assign({}, d.colors, saved.colors),
    hero: Object.assign({}, d.hero, saved.hero),
    portfolio: mergeArray(d.portfolio, saved.portfolio),
    services: mergeArray(d.services, saved.services),
    about: Object.assign({}, d.about, saved.about),
    testimonials: mergeArray(d.testimonials, saved.testimonials),
    clients: mergeArray(d.clients, saved.clients),
    contact: Object.assign({}, d.contact, saved.contact)
  };
};
