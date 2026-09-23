// Contenido por defecto de la web de Cayi Studio.
// Esto es lo que se ve mientras no hay nada guardado en Supabase todavía
// (o si el panel de administrador aún no está configurado).
// El panel de administrador (admin.html) parte de estos mismos valores
// la primera vez que lo abres, y la web pública (index.html) los usa
// como respaldo si Supabase no responde.
window.CAYI_DEFAULT_CONTENT = {
  colors: {
    ink: "#121212",
    orange: "#EF8B3C",
    pink: "#C81760",
    teal: "#1C8C7C"
  },
  hero: {
    eyebrow: "Ver Portafolio",
    title: "Más que fotografía y video,<br> construimos la imagen de tu marca.",
    p1: "¿Necesitas contenido visual que conecte con tu público? En <strong>Cayi Studio</strong> creamos fotografía y video con una mirada cuidada, pensados para que tu marca, tu evento o tu producto se vean como se merecen.",
    p2: "Trabajamos eventos corporativos, sesiones de estudio, campañas publicitarias y contenido para redes sociales — todo con el mismo cuidado en cada detalle, desde la primera idea hasta la entrega final.",
    media: "images/hero-reel-placeholder.svg"
  },
  portfolio: [
    { title: "Evento Corporativo",     client: "Nombre del cliente", image: "images/portfolio-1.svg" },
    { title: "Sesión de Estudio",      client: "Nombre del cliente", image: "images/portfolio-2.svg" },
    { title: "Campaña Publicitaria",   client: "Nombre del cliente", image: "images/portfolio-3.svg" },
    { title: "Contenido para Redes",   client: "Nombre del cliente", image: "images/portfolio-4.svg" },
    { title: "Retrato Profesional",    client: "Nombre del cliente", image: "images/portfolio-5.svg" },
    { title: "Backstage de Evento",    client: "Nombre del cliente", image: "images/portfolio-6.svg" }
  ],
  services: [
    { title: "Fotografía y Video para Eventos Corporativos", desc: "Cobertura fotográfica y de video para conferencias, lanzamientos, workshops y celebraciones de empresa. Capturamos los momentos clave para que tu evento siga contando su historia después de terminado." },
    { title: "Fotografía de Estudio", desc: "Sesiones en estudio con iluminación controlada para retratos corporativos, equipos de trabajo, productos o books personales — resultados consistentes y de alta calidad." },
    { title: "Fotografía Publicitaria", desc: "Imágenes pensadas para vender: producto, campaña o marca, con dirección de arte enfocada en lo que tu audiencia necesita ver para conectar y convertir." },
    { title: "Creación de Contenido", desc: "Fotografía y video para Instagram, TikTok y el resto de tus redes — contenido pensado para el feed, las historias y los formatos que tu marca necesita en el día a día." }
  ],
  about: {
    title: "Un equipo que cree que cada imagen debe contar algo",
    p1: "Somos <strong>Cayi Studio</strong>, un equipo de fotografía y video que trabaja de cerca con cada cliente para entender qué necesita comunicar — y traducirlo en imágenes que se sostienen en el tiempo.",
    p2: "Desde una sesión de estudio hasta la cobertura completa de un evento corporativo, cuidamos cada detalle: la luz, el encuadre, el tiempo de entrega.",
    image: "images/about-placeholder.svg"
  },
  testimonials: [
    { quote: "El equipo de Cayi Studio entendió exactamente lo que necesitábamos para nuestro evento y entregó todo a tiempo.", name: "Nombre Apellido", role: "Cargo, Empresa" },
    { quote: "Muy profesionales, creativos y fáciles de coordinar. Las fotos superaron nuestras expectativas.", name: "Nombre Apellido", role: "Cargo, Empresa" },
    { quote: "Recomendamos a Cayi Studio para cualquier proyecto que necesite calidad y cumplimiento.", name: "Nombre Apellido", role: "Cargo, Empresa" }
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
