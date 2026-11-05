/* =====================================================================
   CONFIGURACIÓN, REGIONES AMBA (CABA + GBA) Y DATOS DE RESPALDO OFFLINE
   ===================================================================== */
const DATA_SOURCE_URL = "./data/parroquias.json";
const ADMIN_MASTER_PIN = "1118";
const CABA_CENTER = [-34.5975, -58.3855];
const CABA_ZOOM = 13;
const MASS_DURATION_MIN = 45;
const NEXT_WINDOW_MIN = 60;
const PAGE_SIZE = 24; // Lote de renderizado incremental para soportar +100 registros sin bloquear el hilo móvil
const CROWD_STORAGE_KEY = "crowd_status_v1";
const CROWD_TTL_MS = 3 * 60 * 60 * 1000; // Vigencia temporal de 3 horas para reportes de concurrencia por servicio

// Niveles del Indicador de Concurrencia Comunitario ("Lleno / Vacío")
const CROWD_LEVELS = {
  tranquilo: {
    id: "tranquilo",
    label: "Tranquilo (🟢)",
    short: "🟢 Tranquilo",
    dot: "🟢"
  },
  moderado: {
    id: "moderado",
    label: "Moderado (🟡)",
    short: "🟡 Moderado",
    dot: "🟡"
  },
  lleno: {
    id: "lleno",
    label: "Lleno (🔴)",
    short: "🔴 Lleno",
    dot: "🔴"
  }
};

const REGIONS = [
  { id: "ALL", label: "Todas" },
  { id: "CABA", label: "CABA" },
  { id: "Zona Norte", label: "Zona Norte" },
  { id: "Zona Oeste", label: "Zona Oeste" },
  { id: "Zona Sur", label: "Zona Sur" }
];

// Dominios de prueba genéricos o inexistentes que deben filtrarse para evitar errores DNS
const PLACEHOLDER_DOMAINS = new Set([
  "catedralmetropolitana.org.ar",
  "basilicadelpilar.org.ar",
  "sanantoniodepadua.org.ar",
  "obispado-lomas.org.ar",
  "sannicolasdebari.com.ar",
  "santarsicio.org",
  "capillacarmen.org",
  "basilicasantisimosacramento.org.ar",
  "sanjosedeflores.org.ar",
  "parroquialasvictorias.org.ar",
  "inmaculadabelgrano.org.ar",
  "basilicamariaauxiliadora.com.ar",
  "parroquiadeguadalupe.com.ar",
  "parroquiacaacupe.org.ar",
  "parroquiasantelmo.org",
  "example.com",
  "ejemplo.com"
]);

// Puntos de referencia fijos de CABA y GBA (Norte, Oeste, Sur) para selección manual de cercanía
const REFERENCE_ZONES = [
  { id: "san-nicolas", region: "CABA", nombre: "San Nicolás (Microcentro)", lat: -34.6083, lng: -58.3722 },
  { id: "recoleta", region: "CABA", nombre: "Recoleta", lat: -34.5875, lng: -58.3931 },
  { id: "retiro", region: "CABA", nombre: "Retiro", lat: -34.5987, lng: -58.3845 },
  { id: "palermo", region: "CABA", nombre: "Palermo", lat: -34.5826, lng: -58.4259 },
  { id: "belgrano", region: "CABA", nombre: "Belgrano", lat: -34.5614, lng: -58.4563 },
  { id: "coghlan", region: "CABA", nombre: "Coghlan", lat: -34.5642, lng: -58.4751 },
  { id: "caballito", region: "CABA", nombre: "Caballito", lat: -34.6186, lng: -58.4426 },
  { id: "flores", region: "CABA", nombre: "Flores", lat: -34.6285, lng: -58.4641 },
  { id: "almagro", region: "CABA", nombre: "Almagro", lat: -34.6095, lng: -58.4208 },
  { id: "san-telmo", region: "CABA", nombre: "San Telmo", lat: -34.6212, lng: -58.3731 },
  { id: "vicente-lopez", region: "Zona Norte", nombre: "Vicente López (GBA Norte)", lat: -34.5256, lng: -58.4774 },
  { id: "san-isidro", region: "Zona Norte", nombre: "San Isidro (GBA Norte)", lat: -34.4675, lng: -58.5091 },
  { id: "tigre", region: "Zona Norte", nombre: "Tigre (GBA Norte)", lat: -34.4265, lng: -58.5796 },
  { id: "ramos-mejia", region: "Zona Oeste", nombre: "Ramos Mejía (GBA Oeste)", lat: -34.6424, lng: -58.5648 },
  { id: "moron", region: "Zona Oeste", nombre: "Morón (GBA Oeste)", lat: -34.6512, lng: -58.6219 },
  { id: "lujan", region: "Zona Oeste", nombre: "Luján (GBA Oeste)", lat: -34.5642, lng: -59.1213 },
  { id: "avellaneda", region: "Zona Sur", nombre: "Avellaneda (GBA Sur)", lat: -34.6627, lng: -58.3647 },
  { id: "lomas-de-zamora", region: "Zona Sur", nombre: "Lomas de Zamora (GBA Sur)", lat: -34.7609, lng: -58.4061 },
  { id: "quilmes", region: "Zona Sur", nombre: "Quilmes (GBA Sur)", lat: -34.7206, lng: -58.2546 }
];

// Respaldo local sincronizado con data/parroquias.json para garantizar carga inicial 100% offline
const FALLBACK_PARISHES = [
  {
    id: 1,
    nombre: "Catedral Metropolitana de Buenos Aires",
    tipo: "Catedral",
    region: "CABA",
    direccion: "San Martín 27, San Nicolás, CABA",
    barrio: "San Nicolás",
    coordenadas: { lat: -34.6083, lng: -58.3722 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:30", "12:30", "17:30"] },
      { dia: "Sábados y Domingos", horarios: ["10:00", "11:30", "18:30"] }
    ],
    horariosConfesiones: "Media hora antes de cada misa",
    telefono: "+54 11 4331-2845",
    webOficial: "https://arzbaires.org.ar",
    etiquetas: ["Historica", "Centro", "Catedral"]
  },
  {
    id: 2,
    nombre: "Basílica Nuestra Señora del Pilar",
    tipo: "Basílica",
    region: "CABA",
    direccion: "Junín 1904, Recoleta, CABA",
    barrio: "Recoleta",
    coordenadas: { lat: -34.5875, lng: -58.3931 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:00", "19:00"] },
      { dia: "Domingos", horarios: ["10:00", "11:30", "12:30", "20:00"] }
    ],
    horariosConfesiones: "Sábados de 17:00 a 18:30",
    telefono: "+54 11 4803-6798",
    webOficial: "",
    etiquetas: ["Historica", "Adoracion Perpetua", "Basilica"]
  },
  {
    id: 3,
    nombre: "Basílica San Antonio de Padua",
    tipo: "Basílica",
    region: "CABA",
    direccion: "Agüero 2030, Recoleta, CABA",
    barrio: "Recoleta",
    coordenadas: { lat: -34.5902, lng: -58.3985 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["09:00", "19:30"] },
      { dia: "Domingos", horarios: ["10:30", "12:00", "19:30"] }
    ],
    horariosConfesiones: "15 minutos antes de cada misa",
    telefono: "+54 11 4822-4512",
    webOficial: "",
    etiquetas: ["Basilica", "Recoleta"]
  },
  {
    id: 4,
    nombre: "Catedral Nuestra Señora de la Paz",
    tipo: "Catedral",
    region: "Zona Sur",
    direccion: "Sáenz 438, Lomas de Zamora, Provincia de Buenos Aires",
    barrio: "Lomas de Zamora",
    coordenadas: { lat: -34.7609, lng: -58.4061 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:00", "19:00"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "20:00"] }
    ],
    horariosConfesiones: "Sábados de 10:00 a 12:00",
    telefono: "+54 11 4243-2311",
    webOficial: "",
    etiquetas: ["Catedral", "Historica", "Zona Sur"]
  },
  {
    id: 5,
    nombre: "Parroquia San Nicolás de Bari",
    tipo: "Parroquia",
    region: "CABA",
    direccion: "Av. Santa Fe 1352, Recoleta, CABA",
    barrio: "Recoleta",
    coordenadas: { lat: -34.5982, lng: -58.3871 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:00", "12:30", "19:00"] },
      { dia: "Domingos", horarios: ["11:00", "20:00"] }
    ],
    horariosConfesiones: "Durante las horas de misa",
    telefono: "+54 11 4812-4022",
    webOficial: "",
    etiquetas: ["Parroquia", "Centro"]
  },
  {
    id: 6,
    nombre: "Parroquia San Tarsicio",
    tipo: "Parroquia",
    region: "CABA",
    direccion: "Zapiola 4541, Coghlan, CABA",
    barrio: "Coghlan",
    coordenadas: { lat: -34.5642, lng: -58.4751 },
    horariosMisa: [
      { dia: "Martes a Sábados", horarios: ["19:00"] },
      { dia: "Domingos", horarios: ["10:30", "19:00"] }
    ],
    horariosConfesiones: "Sábados previo a misa",
    telefono: "+54 11 4542-1100",
    webOficial: "",
    etiquetas: ["Parroquia", "Barrio"]
  },
  {
    id: 7,
    nombre: "Capilla del Hospital de Clínicas",
    tipo: "Capilla",
    region: "CABA",
    direccion: "Av. Córdoba 2351, Recoleta, CABA",
    barrio: "Recoleta",
    coordenadas: { lat: -34.5972, lng: -58.3992 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["11:00"] },
      { dia: "Domingos", horarios: ["10:00"] }
    ],
    horariosConfesiones: "Consultar en secretaría",
    telefono: "+54 11 5950-8000",
    webOficial: "https://www.fmed.uba.ar",
    etiquetas: ["Capilla", "Hospitalario"]
  },
  {
    id: 8,
    nombre: "Capilla Nuestra Señora del Carmen",
    tipo: "Capilla",
    region: "CABA",
    direccion: "Rodríguez Peña 840, Recoleta, CABA",
    barrio: "Recoleta",
    coordenadas: { lat: -34.5961, lng: -58.3902 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["18:00"] },
      { dia: "Domingos", horarios: ["11:00"] }
    ],
    horariosConfesiones: "Media hora antes",
    telefono: "+54 11 4811-9000",
    webOficial: "",
    etiquetas: ["Capilla"]
  },
  {
    id: 9,
    nombre: "Basílica del Santísimo Sacramento",
    tipo: "Basílica",
    region: "CABA",
    direccion: "San Martín 1039, Retiro, CABA",
    barrio: "Retiro",
    coordenadas: { lat: -34.5955, lng: -58.3756 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:00", "12:00", "19:00"] },
      { dia: "Sábados y Domingos", horarios: ["10:00", "12:00", "19:00"] }
    ],
    horariosConfesiones: "Lunes a viernes de 11:00 a 12:00 y 18:00 a 19:00",
    telefono: "+54 11 4311-5790",
    webOficial: "",
    etiquetas: ["Basilica", "Adoracion", "Retiro"]
  },
  {
    id: 10,
    nombre: "Basílica San José de Flores",
    tipo: "Basílica",
    region: "CABA",
    direccion: "Av. Rivadavia 6950, Flores, CABA",
    barrio: "Flores",
    coordenadas: { lat: -34.6286, lng: -58.4641 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:00", "12:00", "19:30"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "19:30"] }
    ],
    horariosConfesiones: "Todos los días de 17:30 a 19:15",
    telefono: "+54 11 4611-1896",
    webOficial: "",
    etiquetas: ["Basilica", "Historica", "Flores"]
  },
  {
    id: 11,
    nombre: "Parroquia Nuestra Señora de las Victorias",
    tipo: "Parroquia",
    region: "CABA",
    direccion: "Paraguay 1204, Retiro, CABA",
    barrio: "Retiro",
    coordenadas: { lat: -34.5987, lng: -58.3845 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["07:30", "12:00", "18:30"] },
      { dia: "Domingos", horarios: ["11:00", "19:30"] }
    ],
    horariosConfesiones: "Durante las horas de misa",
    telefono: "+54 11 4812-3490",
    webOficial: "",
    etiquetas: ["Centro", "Parroquia"]
  },
  {
    id: 12,
    nombre: "Parroquia Inmaculada Concepción (La Redonda)",
    tipo: "Parroquia",
    region: "CABA",
    direccion: "Vuelta de Obligado 2042, Belgrano, CABA",
    barrio: "Belgrano",
    coordenadas: { lat: -34.5614, lng: -58.4563 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:30", "12:00", "19:30"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "12:30", "19:30", "21:00"] }
    ],
    horariosConfesiones: "Media hora antes de cada misa",
    telefono: "+54 11 4783-8008",
    webOficial: "",
    etiquetas: ["Historica", "Parroquia", "Belgrano"]
  },
  {
    id: 13,
    nombre: "Basílica María Auxiliadora y San Carlos",
    tipo: "Basílica",
    region: "CABA",
    direccion: "Hipólito Yrigoyen 3999, Almagro, CABA",
    barrio: "Almagro",
    coordenadas: { lat: -34.6143, lng: -58.4227 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:00", "19:00"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "12:15", "19:00"] }
    ],
    horariosConfesiones: "Sábados y domingos durante las misas",
    telefono: "+54 11 4981-6767",
    webOficial: "",
    etiquetas: ["Basilica", "Salesianos", "Almagro"]
  },
  {
    id: 14,
    nombre: "Basílica del Espíritu Santo (Ntra. Sra. de Guadalupe)",
    tipo: "Basílica",
    region: "CABA",
    direccion: "Mansilla 3865, Palermo, CABA",
    barrio: "Palermo",
    coordenadas: { lat: -34.5891, lng: -58.4184 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:00", "19:30"] },
      { dia: "Domingos", horarios: ["09:30", "11:00", "12:30", "19:30"] }
    ],
    horariosConfesiones: "Media hora antes de cada celebración",
    telefono: "+54 11 4822-9100",
    webOficial: "",
    etiquetas: ["Basilica", "Palermo"]
  },
  {
    id: 15,
    nombre: "Parroquia Nuestra Señora de Caacupé",
    tipo: "Parroquia",
    region: "CABA",
    direccion: "Av. Rivadavia 4879, Caballito, CABA",
    barrio: "Caballito",
    coordenadas: { lat: -34.6177, lng: -58.4352 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["09:00", "19:00"] },
      { dia: "Domingos", horarios: ["09:30", "11:00", "19:00", "20:15"] }
    ],
    horariosConfesiones: "20 minutos antes de cada misa",
    telefono: "+54 11 4901-1916",
    webOficial: "",
    etiquetas: ["Parroquia", "Caballito"]
  },
  {
    id: 16,
    nombre: "Parroquia San Pedro González Telmo",
    tipo: "Parroquia",
    region: "CABA",
    direccion: "Humberto 1º 340, San Telmo, CABA",
    barrio: "San Telmo",
    coordenadas: { lat: -34.6212, lng: -58.3716 },
    horariosMisa: [
      { dia: "Martes a Sábados", horarios: ["18:30"] },
      { dia: "Domingos", horarios: ["10:00", "11:30", "19:00"] }
    ],
    horariosConfesiones: "Domingos media hora antes de misa",
    telefono: "+54 11 4361-1168",
    webOficial: "",
    etiquetas: ["Historica", "Parroquia", "San Telmo"]
  },
  {
    id: 17,
    nombre: "Catedral San Isidro Labrador",
    tipo: "Catedral",
    region: "Zona Norte",
    direccion: "Av. del Libertador 16200, San Isidro, GBA Norte",
    barrio: "San Isidro",
    coordenadas: { lat: -34.4675, lng: -58.5091 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["09:00", "19:00"] },
      { dia: "Domingos", horarios: ["09:30", "11:00", "12:30", "19:00", "20:15"] }
    ],
    horariosConfesiones: "Media hora antes de cada misa",
    telefono: "+54 11 4743-0285",
    webOficial: "",
    etiquetas: ["Catedral", "Historica", "Zona Norte"]
  },
  {
    id: 18,
    nombre: "Parroquia Inmaculada Concepción de Tigre",
    tipo: "Parroquia",
    region: "Zona Norte",
    direccion: "Av. Liniers 1560, Tigre, GBA Norte",
    barrio: "Tigre",
    coordenadas: { lat: -34.4265, lng: -58.5796 },
    horariosMisa: [
      { dia: "Martes a Sábados", horarios: ["19:00"] },
      { dia: "Domingos", horarios: ["10:00", "11:30", "19:00"] }
    ],
    horariosConfesiones: "Sábados y domingos 30 minutos antes de misa",
    telefono: "+54 11 4749-0630",
    webOficial: "",
    etiquetas: ["Parroquia", "Historica", "Zona Norte"]
  },
  {
    id: 19,
    nombre: "Parroquia San Gabriel de la Dolorosa",
    tipo: "Parroquia",
    region: "Zona Norte",
    direccion: "Gaspar Campos 859, Vicente López, GBA Norte",
    barrio: "Vicente López",
    coordenadas: { lat: -34.5256, lng: -58.4774 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:30", "19:00"] },
      { dia: "Domingos", horarios: ["09:30", "11:00", "19:30"] }
    ],
    horariosConfesiones: "20 minutos antes de cada misa",
    telefono: "+54 11 4791-3342",
    webOficial: "",
    etiquetas: ["Parroquia", "Zona Norte"]
  },
  {
    id: 20,
    nombre: "Basílica Nacional Nuestra Señora de Luján",
    tipo: "Basílica",
    region: "Zona Oeste",
    direccion: "San Martín 51, Luján, Provincia de Buenos Aires",
    barrio: "Luján",
    coordenadas: { lat: -34.5642, lng: -59.1213 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:00", "10:00", "11:30", "17:00", "19:00"] },
      { dia: "Sábados y Domingos", horarios: ["07:00", "08:00", "09:30", "11:00", "13:00", "15:00", "17:00", "19:00"] }
    ],
    horariosConfesiones: "Todos los días de 08:30 a 18:30",
    telefono: "+54 2323 42-0058",
    webOficial: "https://santuariodelujan.org.ar",
    etiquetas: ["Basilica", "Santuario Nacional", "Zona Oeste"]
  },
  {
    id: 21,
    nombre: "Catedral Inmaculada Concepción del Buen Viaje",
    tipo: "Catedral",
    region: "Zona Oeste",
    direccion: "Belgrano 327, Morón, GBA Oeste",
    barrio: "Morón",
    coordenadas: { lat: -34.6512, lng: -58.6219 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:00", "11:00", "19:00"] },
      { dia: "Domingos", horarios: ["08:30", "10:00", "11:30", "19:00", "20:00"] }
    ],
    horariosConfesiones: "Lunes a sábados de 10:00 a 12:00 y 17:30 a 19:00",
    telefono: "+54 11 4629-8912",
    webOficial: "",
    etiquetas: ["Catedral", "Zona Oeste"]
  },
  {
    id: 22,
    nombre: "Parroquia Nuestra Señora del Carmen",
    tipo: "Parroquia",
    region: "Zona Oeste",
    direccion: "Álvarez Jonte 77, Ramos Mejía, GBA Oeste",
    barrio: "Ramos Mejía",
    coordenadas: { lat: -34.6424, lng: -58.5648 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:00", "19:00"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "19:00"] }
    ],
    horariosConfesiones: "Media hora antes de cada misa",
    telefono: "+54 11 4658-0432",
    webOficial: "",
    etiquetas: ["Parroquia", "Zona Oeste"]
  },
  {
    id: 23,
    nombre: "Catedral de la Inmaculada Concepción de Quilmes",
    tipo: "Catedral",
    region: "Zona Sur",
    direccion: "Rivadavia 355, Quilmes, GBA Sur",
    barrio: "Quilmes",
    coordenadas: { lat: -34.7206, lng: -58.2546 },
    horariosMisa: [
      { dia: "Lunes a Sábados", horarios: ["08:30", "19:00"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "19:00"] }
    ],
    horariosConfesiones: "Durante las celebraciones",
    telefono: "+54 11 4253-2241",
    webOficial: "",
    etiquetas: ["Catedral", "Zona Sur"]
  },
  {
    id: 24,
    nombre: "Catedral Nuestra Señora de la Asunción",
    tipo: "Catedral",
    region: "Zona Sur",
    direccion: "San Martín 745, Avellaneda, GBA Sur",
    barrio: "Avellaneda",
    coordenadas: { lat: -34.6627, lng: -58.3647 },
    horariosMisa: [
      { dia: "Martes a Sábados", horarios: ["18:30"] },
      { dia: "Domingos", horarios: ["09:30", "11:00", "19:00"] }
    ],
    horariosConfesiones: "30 minutos antes de cada misa",
    telefono: "+54 11 4201-8432",
    webOficial: "",
    etiquetas: ["Catedral", "Zona Sur"]
  }
];

/* =====================================================================
   Utilidades, Clasificación Regional (CABA / GBA) e Indexación Masiva
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function toMinutes(hhmm) {
  const m = String(hhmm || "").match(/(\d{1,2}):(\d{2})/);
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

function getCoords(p) {
  if (p.coordenadas && typeof p.coordenadas.lat === "number" && typeof p.coordenadas.lng === "number") {
    return p.coordenadas;
  }
  if (typeof p.lat === "number" && typeof p.lng === "number") {
    return { lat: p.lat, lng: p.lng };
  }
  return null;
}

function getTags(p) {
  return p.etiquetas || p.tags || [];
}

function getPhone(p) {
  return p.telefono || p.tel || "";
}

/**
 * Clasifica automáticamente cualquier templo en:
 * "CABA", "Zona Norte", "Zona Oeste" o "Zona Sur".
 */
const NORTE_KEYWORDS = ["zona norte", "gba norte", "san isidro", "vicente lopez", "olivos", "martinez", "acassuso", "beccar", "tigre", "san fernando", "pilar", "escobar", "malvinas argentinas", "san martin", "villa ballester"];
const OESTE_KEYWORDS = ["zona oeste", "gba oeste", "moron", "ramos mejia", "haedo", "castelar", "ituzaingo", "merlo", "moreno", "lujan", "hurlingham", "san justo", "la matanza", "ciudadela", "caseros", "tres de febrero"];
const SUR_KEYWORDS = ["zona sur", "gba sur", "lomas", "lomas de zamora", "banfield", "temperley", "adrogue", "almirante brown", "avellaneda", "lanus", "quilmes", "bernal", "berazategui", "florencio varela", "ezeiza", "esteban echeverria", "monte grande"];

function inferRegion(p) {
  const explicit = norm(p.region || p.zona || "");
  if (explicit === "caba" || explicit === "capital federal") return "CABA";
  if (explicit.includes("norte")) return "Zona Norte";
  if (explicit.includes("oeste")) return "Zona Oeste";
  if (explicit.includes("sur")) return "Zona Sur";

  const combined = norm(`${p.barrio || ""} ${p.direccion || ""} ${getTags(p).join(" ")}`);
  if (NORTE_KEYWORDS.some(k => combined.includes(k))) return "Zona Norte";
  if (OESTE_KEYWORDS.some(k => combined.includes(k))) return "Zona Oeste";
  if (SUR_KEYWORDS.some(k => combined.includes(k))) return "Zona Sur";
  return "CABA";
}

/**
 * Pre-indexa los registros en memoria para que búsquedas y filtros sobre +100 o +500 templos
 * se ejecuten en menos de 1 ms sin recalcular normalizaciones por pulsación.
 */
function prepareDataset(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(p => {
    const region = inferRegion(p);
    const tags = getTags(p);
    const searchIndex = norm([
      p.nombre,
      p.tipo,
      region,
      p.barrio,
      p.direccion,
      ...tags
    ].join(" "));
    return {
      ...p,
      region,
      _idStr: String(p.id),
      _region: region,
      _searchIndex: searchIndex,
      _isMajor: isMajorTemple(p.tipo)
    };
  });
}

function normalizeOfficialUrl(rawUrl) {
  if (typeof rawUrl !== "string") return "";
  let clean = rawUrl.trim();
  if (!clean || clean === "#" || clean === "-") return "";

  if (!/^https?:\/\//i.test(clean)) {
    clean = "https://" + clean.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(clean);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (!host || !host.includes(".") || PLACEHOLDER_DOMAINS.has(host)) {
      return "";
    }
    return parsed.href;
  } catch (e) {
    return "";
  }
}

function buildGoogleMapsPlaceUrl(p) {
  const query = `${p.nombre}, ${p.direccion || p.barrio || "Buenos Aires"}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildDirectionsUrl(p) {
  const coords = getCoords(p);
  const dest = coords
    ? `${coords.lat},${coords.lng}`
    : encodeURIComponent(`${p.nombre}, ${p.direccion}`);
  const originParam = state.userLoc
    ? `&origin=${encodeURIComponent(`${state.userLoc.lat},${state.userLoc.lng}`)}`
    : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}${originParam}`;
}

function isMajorTemple(tipo) {
  const t = norm(tipo);
  return t === "catedral" || t === "basilica";
}

function getTypeBadgeClass(tipo) {
  if (isMajorTemple(tipo)) return "major";
  if (norm(tipo) === "capilla") return "capilla";
  return "minor";
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatKm(km) {
  return `${km.toFixed(1).replace(".", ",")} km`;
}

const Store = (() => {
  const mem = {};
  return {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return mem[k] ?? def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };
})();

/* =====================================================================
   Estado de la Aplicación
   ===================================================================== */
const savedAdminParishes = Store.get("parishes_admin_data", null);
let PARISHES = prepareDataset(
  Array.isArray(savedAdminParishes) && savedAdminParishes.length
    ? savedAdminParishes
    : Store.get("parishes_cache_v6", FALLBACK_PARISHES)
);

const state = {
  view: "list", // 'list' | 'map' | 'community' | 'profile'
  commTab: "all", // 'all' | 'following' | 'ranking' | 'people'
  detailSection: "horarios", // 'horarios' | 'actividades'
  q: "",
  region: "ALL", // 'ALL' | 'CABA' | 'Zona Norte' | 'Zona Oeste' | 'Zona Sur'
  barrio: null,
  soloFav: false,
  soloNow: false,
  sortByNear: false,
  userLoc: null,
  favs: new Set(Store.get("favs", []).map(String)),
  current: null,
  selectedServiceHour: null, // Hora de servicio seleccionada en el widget de concurrencia
  visibleLimit: PAGE_SIZE,
  isAdmin: Boolean(Store.get("admin_unlocked", false))
};

/* =====================================================================
   Navegación por Pestañas (Listado, Mapa, Comunidad y Perfil)
   ===================================================================== */
function switchView(targetView) {
  const validViews = ["list", "map", "community", "profile"];
  if (!validViews.includes(targetView)) return;
  state.view = targetView;
  document.body.setAttribute("data-active-view", targetView);

  const panels = {
    list: $("#view-list"),
    map: $("#view-map"),
    community: $("#view-community"),
    profile: $("#view-profile")
  };
  const tabs = {
    list: $("#tab-list"),
    map: $("#tab-map"),
    community: $("#tab-community"),
    profile: $("#tab-profile")
  };

  validViews.forEach(v => {
    const active = v === targetView;
    if (panels[v]) {
      panels[v].classList.toggle("is-active", active);
      panels[v].setAttribute("aria-hidden", String(!active));
    }
    if (tabs[v]) {
      tabs[v].classList.toggle("is-active", active);
      tabs[v].setAttribute("aria-selected", String(active));
    }
  });

  if (targetView === "map") {
    initMap();
    requestAnimationFrame(() => {
      if (map) {
        map.invalidateSize();
        fitMapToBounds(filtered());
      }
    });
  } else if (targetView === "community") {
    renderCommunityView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (targetView === "profile") {
    renderProfileView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* =====================================================================
   Motor de Fechas y Horarios de Misa (Mapeo Inteligente de Días y Rangos)
   ===================================================================== */
const SHORT_DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function tokenToDayIndex(word) {
  const w = norm(word);
  if (w.startsWith("dom")) return 0;
  if (w.startsWith("lun")) return 1;
  if (w.startsWith("mar")) return 2;
  if (w.startsWith("mie") || w.startsWith("mié")) return 3;
  if (w.startsWith("jue")) return 4;
  if (w.startsWith("vie")) return 5;
  if (w.startsWith("sab") || w.startsWith("sáb")) return 6;
  return null;
}

function parseDaysFromLabel(diaLabel) {
  const days = new Set();
  const text = norm(diaLabel);
  if (!text) return days;

  if (text.includes("todos los dias") || text.includes("diario") || text.includes("lunes a domingo")) {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }
  if (text.includes("dias habiles") || text.includes("dias de semana") || text.includes("semana")) {
    [1, 2, 3, 4, 5].forEach(d => days.add(d));
  }
  if (text.includes("fin de semana") || text.includes("fines de semana")) {
    days.add(6);
    days.add(0);
  }

  const rangeRegex = /\b(dom\w*|lun\w*|mar\w*|mie\w*|jue\w*|vie\w*|sab\w*)\s*(?:a|-|al)\s*(dom\w*|lun\w*|mar\w*|mie\w*|jue\w*|vie\w*|sab\w*)\b/g;
  let match;
  let hadRange = false;
  while ((match = rangeRegex.exec(text)) !== null) {
    const start = tokenToDayIndex(match[1]);
    const end = tokenToDayIndex(match[2]);
    if (start !== null && end !== null) {
      hadRange = true;
      if (start >= 1 && end === 0) {
        for (let d = start; d <= 6; d++) days.add(d);
        days.add(0);
      } else if (start <= end) {
        for (let d = start; d <= end; d++) days.add(d);
      } else {
        for (let d = start; d <= 6; d++) days.add(d);
        for (let d = 0; d <= end; d++) days.add(d);
      }
    }
  }

  if (!hadRange) {
    const tokens = text.split(/[\s,y/]+/);
    tokens.forEach(tok => {
      const idx = tokenToDayIndex(tok);
      if (idx !== null) days.add(idx);
    });
  }

  return days;
}

function matchesDayGroup(diaLabel, dayIndex) {
  return parseDaysFromLabel(diaLabel).has(dayIndex);
}

function getMassHoursForDay(p, dayIndex) {
  let rawHours = [];
  if (Array.isArray(p.horariosMisa)) {
    rawHours = p.horariosMisa
      .filter(m => matchesDayGroup(m.dia, dayIndex))
      .flatMap(m => Array.isArray(m.horarios) ? m.horarios : []);
  } else if (Array.isArray(p.misas)) {
    rawHours = p.misas
      .filter(m => Array.isArray(m.d) && m.d.includes(dayIndex))
      .flatMap(m => Array.isArray(m.h) ? m.h : []);
  }

  return rawHours
    .map(h => ({ raw: String(h).trim(), mins: toMinutes(h) }))
    .filter(item => !Number.isNaN(item.mins))
    .sort((a, b) => a.mins - b.mins);
}

function findNextAvailableMass(p, todayIndex) {
  for (let offset = 1; offset <= 7; offset++) {
    const targetDay = (todayIndex + offset) % 7;
    const hours = getMassHoursForDay(p, targetDay);
    if (hours.length > 0) {
      const dayLabel = offset === 1 ? "mañana" : SHORT_DAY_NAMES[targetDay];
      return {
        label: `${dayLabel} ${hours[0].raw} h`,
        rawHour: hours[0].raw
      };
    }
  }
  return null;
}

function getMassStatus(p) {
  const now = new Date();
  const today = now.getDay();
  const cur = now.getHours() * 60 + now.getMinutes();

  const todayTimes = getMassHoursForDay(p, today);

  const ongoing = todayTimes.find(t => cur >= t.mins && cur <= t.mins + MASS_DURATION_MIN);
  if (ongoing) {
    return {
      isNowOrSoon: true,
      serviceHour: ongoing.raw,
      label: `Misa ahora · inició ${ongoing.raw} h`
    };
  }

  const upcoming = todayTimes.filter(t => t.mins > cur);
  if (upcoming.length > 0) {
    const next = upcoming[0];
    const diff = next.mins - cur;
    if (diff <= NEXT_WINDOW_MIN) {
      return {
        isNowOrSoon: true,
        serviceHour: next.raw,
        label: `Próxima misa hoy: ${next.raw} h (en ${diff} min)`
      };
    }
    return {
      isNowOrSoon: false,
      serviceHour: next.raw,
      label: `Próxima misa hoy: ${next.raw} h`
    };
  }

  const nextAvailable = findNextAvailableMass(p, today);
  if (todayTimes.length > 0) {
    const listStr = todayTimes.map(t => t.raw).join(" · ");
    const fallbackHour = todayTimes[todayTimes.length - 1].raw;
    return {
      isNowOrSoon: false,
      serviceHour: nextAvailable ? nextAvailable.rawHour : fallbackHour,
      label: nextAvailable
        ? `Hoy (${listStr} h) finalizadas · Próxima: ${nextAvailable.label}`
        : `Misas de hoy: ${listStr} h`
    };
  }

  if (nextAvailable) {
    return {
      isNowOrSoon: false,
      serviceHour: nextAvailable.rawHour,
      label: `Próxima misa: ${nextAvailable.label}`
    };
  }

  return {
    isNowOrSoon: false,
    serviceHour: "general",
    label: "Consultar horarios en la ficha"
  };
}

/* =====================================================================
   Indicador de Concurrencia Comunitario ("Lleno / Vacío") en Tiempo Real
   ===================================================================== */
function getTodayDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getAllDistinctHours(p) {
  if (!Array.isArray(p.horariosMisa)) return [];
  const seen = new Set();
  const list = [];
  p.horariosMisa.forEach(group => {
    (group.horarios || []).forEach(h => {
      const clean = String(h).trim();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        list.push(clean);
      }
    });
  });
  return list.sort((a, b) => (toMinutes(a) || 0) - (toMinutes(b) || 0));
}

function getDefaultServiceHour(p) {
  const status = getMassStatus(p);
  if (status.serviceHour && status.serviceHour !== "general") {
    return status.serviceHour;
  }
  const all = getAllDistinctHours(p);
  return all[0] || "general";
}

function buildCrowdKey(parishId, serviceHour) {
  return `${String(parishId)}__${getTodayDateKey()}__${String(serviceHour || "general").trim()}`;
}

function loadCrowdMap() {
  const mapObj = Store.get(CROWD_STORAGE_KEY, {});
  const now = Date.now();
  let mutated = false;
  Object.keys(mapObj).forEach(k => {
    const entry = mapObj[k];
    if (!entry || !entry.updatedAt || now - entry.updatedAt > CROWD_TTL_MS) {
      delete mapObj[k];
      mutated = true;
    }
  });
  if (mutated) Store.set(CROWD_STORAGE_KEY, mapObj);
  return mapObj;
}

function getCrowdStatus(parishId, serviceHour) {
  const crowdMap = loadCrowdMap();
  const key = buildCrowdKey(parishId, serviceHour);
  if (crowdMap[key] && CROWD_LEVELS[crowdMap[key].level]) {
    return crowdMap[key];
  }
  return null;
}

function getActiveParishCrowd(p) {
  const defaultHour = getDefaultServiceHour(p);
  const direct = getCrowdStatus(p.id, defaultHour);
  if (direct) return direct;

  // Si un usuario reportó en otro horario del mismo templo hoy recientemente, lo devuelve como referencia activa
  const crowdMap = loadCrowdMap();
  const prefix = `${String(p.id)}__${getTodayDateKey()}__`;
  let latest = null;
  Object.keys(crowdMap).forEach(k => {
    if (k.startsWith(prefix)) {
      const item = crowdMap[k];
      if (!latest || item.updatedAt > latest.updatedAt) {
        latest = item;
      }
    }
  });
  return latest;
}

function setCrowdStatus(parishId, serviceHour, level) {
  if (!CROWD_LEVELS[level]) return null;
  const crowdMap = loadCrowdMap();
  const slot = String(serviceHour || "general").trim();
  const key = buildCrowdKey(parishId, slot);

  const record = {
    parishId: String(parishId),
    serviceHour: slot,
    dateKey: getTodayDateKey(),
    level,
    updatedAt: Date.now(),
    byAdmin: Boolean(state.isAdmin)
  };

  crowdMap[key] = record;
  Store.set(CROWD_STORAGE_KEY, crowdMap);
  return record;
}

function clearCrowdStatus(parishId, serviceHour) {
  const crowdMap = loadCrowdMap();
  const key = buildCrowdKey(parishId, serviceHour);
  delete crowdMap[key];
  Store.set(CROWD_STORAGE_KEY, crowdMap);
}

function formatRelativeMinutes(timestamp) {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSec < 45) return " recién actualizado";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `hace ${hrs} h`;
}

function renderCrowdBadgeHtml(p) {
  const report = getActiveParishCrowd(p);
  if (!report || !CROWD_LEVELS[report.level]) return "";
  const cfg = CROWD_LEVELS[report.level];
  const slotNote = report.serviceHour && report.serviceHour !== "general" ? ` · ${report.serviceHour} h` : "";
  return `<span class="crowd-badge ${cfg.id}" title="Concurrencia comunitaria reportada">${cfg.short}${slotNote}</span>`;
}

/* =====================================================================
   Inicialización del Mapa (100% OpenStreetMap Libre + Marcadores Jerárquicos)
   ===================================================================== */
let map = null;
let markersLayer = null;
let userMarker = null;
const markerById = new Map();

const SVG_PIN_MAJOR = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 4.5v15M7.5 9.5h9"/>
  </svg>`;

const SVG_PIN_MINOR = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
    <path d="M12 5.5v13M8 10h8"/>
  </svg>`;

function initMap() {
  const mapEl = $("#map");
  if (!mapEl || typeof L === "undefined" || map) return;

  map = L.map(mapEl, {
    center: CABA_CENTER,
    zoom: CABA_ZOOM,
    zoomControl: false,
    attributionControl: true
  });

  // Controles de zoom ubicados arriba a la izquierda (debajo de la barra superior) para no chocar con el botón flotante "Cerca de mí"
  L.control.zoom({ position: "topleft" }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  // Enlace directo del botón del popup a la ficha de detalles (incluso cuando Leaflet intercepta eventos internos del popup)
  map.on("popupopen", (e) => {
    const popupEl = e.popup && e.popup.getElement ? e.popup.getElement() : null;
    if (!popupEl) return;
    const btn = popupEl.querySelector("[data-popup-id]");
    if (btn) {
      btn.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const pid = btn.getAttribute("data-popup-id");
        map.closePopup();
        openDetail(pid);
      };
    }
  });

  mapEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-popup-id]");
    if (btn) {
      map.closePopup();
      openDetail(btn.dataset.popupId);
    }
  });

  renderMapMarkers(filtered());
}

function createHierarchyIcon(p) {
  const major = p._isMajor ?? isMajorTemple(p.tipo);
  const isCapilla = norm(p.tipo) === "capilla";
  const size = major ? 42 : 32;
  const cls = major ? "pin-wrap major" : `pin-wrap minor${isCapilla ? " capilla" : ""}`;
  const svg = major ? SVG_PIN_MAJOR : SVG_PIN_MINOR;

  return L.divIcon({
    className: "custom-pin-icon",
    html: `<div class="${cls}" title="${p.tipo}: ${p.nombre}">${svg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)]
  });
}

function fitMapToBounds(items) {
  if (!map) return;
  const bounds = [];
  if (state.userLoc) bounds.push([state.userLoc.lat, state.userLoc.lng]);

  items.forEach(p => {
    const coords = getCoords(p);
    if (coords) bounds.push([coords.lat, coords.lng]);
  });

  if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [52, 42], maxZoom: 15 });
  } else if (bounds.length === 1) {
    map.setView(bounds[0], 15);
  } else {
    map.setView(CABA_CENTER, CABA_ZOOM);
  }
}

function renderMapMarkers(items) {
  if (!map || !markersLayer) return;

  markersLayer.clearLayers();
  markerById.clear();

  if (state.userLoc) {
    const uIcon = L.divIcon({
      className: "custom-pin-icon",
      html: `<div class="pin-user" title="Ubicación de referencia: ${state.userLoc.label}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    userMarker = L.marker([state.userLoc.lat, state.userLoc.lng], {
      icon: uIcon,
      zIndexOffset: 900
    }).bindPopup(`<strong>Referencia:</strong> ${state.userLoc.label}`);
    markersLayer.addLayer(userMarker);
  }

  items.forEach((p) => {
    const coords = getCoords(p);
    if (!coords) return;

    const major = p._isMajor ?? isMajorTemple(p.tipo);
    const status = getMassStatus(p);
    const badgeCls = getTypeBadgeClass(p.tipo);
    const distHtml = typeof p.distanceKm === "number"
      ? `<span class="dist-badge">${formatKm(p.distanceKm)}</span>`
      : "";
    const crowdHtml = renderCrowdBadgeHtml(p);

    const popupHtml = `
      <div class="map-popup">
        <div class="map-popup-top">
          <span class="type-badge ${badgeCls}">${p.tipo || "Templo"}</span>
          ${distHtml}
          ${crowdHtml}
        </div>
        <h3>${p.nombre}</h3>
        <p class="p-addr">${p.direccion}</p>
        <p class="p-next ${status.isNowOrSoon ? "live" : ""}">${status.label}</p>
        <button type="button" class="p-btn" data-popup-id="${p.id}">Ver ficha completa</button>
      </div>`;

    const marker = L.marker([coords.lat, coords.lng], {
      icon: createHierarchyIcon(p),
      zIndexOffset: major ? 500 : 100
    }).bindPopup(popupHtml);

    markersLayer.addLayer(marker);
    markerById.set(String(p.id), marker);
  });

  if (state.view === "map") {
    fitMapToBounds(items);
  }
}

/* =====================================================================
   Estrategia de Ubicación Híbrida (GPS + Selector Manual AMBA + Fallback)
   ===================================================================== */
function renderZoneSelector() {
  const sel = $("#manual-zone");
  if (!sel) return;

  const groups = ["CABA", "Zona Norte", "Zona Oeste", "Zona Sur"];
  const optgroupsHtml = groups.map(reg => {
    const zones = REFERENCE_ZONES.filter(z => z.region === reg);
    if (!zones.length) return "";
    return `<optgroup label="${reg}">${zones.map(z => `<option value="${z.id}">Zona: ${z.nombre}</option>`).join("")}</optgroup>`;
  }).join("");

  sel.innerHTML =
    `<option value="">Ubicación: Orden alfabético (general)</option>` +
    `<option value="__gps__" hidden>Mi ubicación actual (GPS)</option>` +
    optgroupsHtml;
}

function updateDistances(lat, lng) {
  PARISHES.forEach(p => {
    const coords = getCoords(p);
    if (coords) {
      p.distanceKm = haversineKm(lat, lng, coords.lat, coords.lng);
    }
  });
}

function clearDistances() {
  PARISHES.forEach(p => { delete p.distanceKm; });
}

function showLocationBanner(msg) {
  const banner = $("#loc-banner");
  const text = $("#loc-banner-text");
  if (!banner || !text) return;
  text.textContent = msg || "No pudimos obtener tu ubicación automática. Mostrando listado general o elegí tu zona manualmente";
  banner.hidden = false;
}

function hideLocationBanner() {
  const banner = $("#loc-banner");
  if (banner) banner.hidden = true;
}

function syncLocationUI() {
  const fab = $("#btn-near");
  const fabLabel = $("#btn-near-label");
  const inlineGps = $("#btn-gps-inline");
  const sel = $("#manual-zone");

  const isGps = state.sortByNear && state.userLoc?.source === "gps";
  const isManual = state.sortByNear && state.userLoc?.source === "manual";

  if (fab && fabLabel) {
    fab.classList.remove("loading");
    fab.setAttribute("aria-pressed", String(state.sortByNear));
    fabLabel.textContent = isGps
      ? "Cerca de mí (GPS)"
      : isManual
      ? `Cerca de ${state.userLoc.label}`
      : "Cerca de mí";
  }

  if (inlineGps) {
    inlineGps.setAttribute("aria-pressed", String(isGps));
    inlineGps.textContent = isGps ? "GPS activo" : "Usar GPS";
  }

  if (sel) {
    if (isGps) {
      sel.value = "__gps__";
    } else if (isManual) {
      sel.value = state.userLoc.id;
    } else {
      sel.value = "";
    }
  }
}

function applyManualZone(zoneId) {
  hideLocationBanner();
  if (!zoneId || zoneId === "__gps__") {
    state.sortByNear = false;
    state.userLoc = null;
    clearDistances();
    syncLocationUI();
    state.visibleLimit = PAGE_SIZE;
    renderList();
    return;
  }

  const zone = REFERENCE_ZONES.find(z => z.id === zoneId);
  if (!zone) return;

  state.userLoc = {
    id: zone.id,
    lat: zone.lat,
    lng: zone.lng,
    label: zone.nombre,
    source: "manual"
  };
  state.sortByNear = true;
  updateDistances(zone.lat, zone.lng);
  syncLocationUI();
  state.visibleLimit = PAGE_SIZE;
  renderList();
  toast(`Ordenado por cercanía a ${zone.nombre}`);
}

function fallbackFromGeolocationError(customNotice) {
  const noticeMsg = customNotice || "No se pudo obtener tu ubicación, usando vista predeterminada de CABA";
  state.sortByNear = false;
  state.userLoc = null;
  clearDistances();
  syncLocationUI();
  showLocationBanner(`${noticeMsg}. Podés elegir tu zona o barrio manualmente.`);
  state.visibleLimit = PAGE_SIZE;
  renderList();
  if (map) {
    map.setView(CABA_CENTER, CABA_ZOOM);
  }
  toast(noticeMsg);

  // Activa y destaca el selector manual de zonas/barrios como respaldo inmediato
  const manualSelect = $("#manual-zone");
  if (manualSelect && state.view === "list") {
    manualSelect.focus();
  }
}

function requestGpsLocation(e) {
  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }

  const fab = $("#btn-near");
  const fabLabel = $("#btn-near-label");
  const inlineGps = $("#btn-gps-inline");

  if (fab && fabLabel) {
    fab.classList.add("loading");
    fabLabel.textContent = "Ubicando…";
  }
  if (inlineGps) {
    inlineGps.textContent = "Ubicando…";
  }

  const successCallback = (position) => {
    hideLocationBanner();
    const { latitude, longitude } = position.coords;

    state.userLoc = {
      id: "__gps__",
      lat: latitude,
      lng: longitude,
      label: "tu ubicación GPS",
      source: "gps"
    };
    state.sortByNear = true;
    updateDistances(latitude, longitude);
    syncLocationUI();
    state.visibleLimit = PAGE_SIZE;
    renderList();

    if (map) {
      map.setView([latitude, longitude], 14, { animate: true });
    }
    toast("Ubicación obtenida · Ordenado por cercanía");
  };

  const errorCallback = (error) => {
    console.warn("Geolocalización falló o fue denegada (código " + (error && error.code) + "):", error && error.message);
    fallbackFromGeolocationError("No se pudo obtener tu ubicación, usando vista predeterminada de CABA");
  };

  try {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      alert("El navegador no soporta geolocalización.");
      fallbackFromGeolocationError("No se pudo obtener tu ubicación, usando vista predeterminada de CABA");
    }
  } catch (err) {
    console.warn("Excepción al solicitar geolocalización:", err);
    fallbackFromGeolocationError("No se pudo obtener tu ubicación, usando vista predeterminada de CABA");
  }
}

/* =====================================================================
   Render: Regiones (CABA/GBA), Chips, Listado Paginado (+100 registros) y Sugerencias
   ===================================================================== */
const ICON_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>';
const ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

function renderRegionTabs() {
  const container = $("#region-tabs");
  if (!container) return;

  const counts = { ALL: PARISHES.length };
  PARISHES.forEach(p => {
    const r = p._region || inferRegion(p);
    counts[r] = (counts[r] || 0) + 1;
  });

  container.innerHTML = REGIONS.map(r => {
    const count = counts[r.id] || 0;
    const active = state.region === r.id;
    return `<button type="button" class="region-pill" data-region="${r.id}" aria-pressed="${active}">
      <span>${r.label}</span>
      <small>(${count})</small>
    </button>`;
  }).join("");
}

function renderChips() {
  renderRegionTabs();

  const scopedParishes = state.region === "ALL"
    ? PARISHES
    : PARISHES.filter(p => (p._region || inferRegion(p)) === state.region);

  const barrios = [...new Set(scopedParishes.map(p => p.barrio).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es-AR"));

  $("#chips").innerHTML =
    `<button class="chip live" data-now aria-pressed="${state.soloNow}"><span class="dot" aria-hidden="true"></span>Misa ahora / Próxima hora</button>` +
    `<button class="chip fav" data-fav aria-pressed="${state.soloFav}">Favoritos</button>` +
    `<button class="chip" data-open-ranking="true">🏆 Ranking</button>` +
    barrios.map(b => `<button class="chip" data-barrio="${b}" aria-pressed="${state.barrio === b}">${b}</button>`).join("");
}

function filtered() {
  const q = norm(state.q);
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  const list = PARISHES.filter(p => {
    const pid = p._idStr || String(p.id);
    if (state.region !== "ALL" && (p._region || inferRegion(p)) !== state.region) return false;
    if (state.soloFav && !state.favs.has(pid)) return false;
    if (state.soloNow && !getMassStatus(p).isNowOrSoon) return false;
    if (state.barrio && p.barrio !== state.barrio) return false;
    if (!tokens.length) return true;

    const haystack = p._searchIndex || norm([p.nombre, p.tipo, p.region, p.barrio, p.direccion, ...getTags(p)].join(" "));
    for (let i = 0; i < tokens.length; i++) {
      if (!haystack.includes(tokens[i])) return false;
    }
    return true;
  });

  if (state.sortByNear && state.userLoc) {
    list.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  } else {
    list.sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"));
  }
  return list;
}

function renderCardHtml(p) {
  const pid = p._idStr || String(p.id);
  const status = getMassStatus(p);
  const major = p._isMajor ?? isMajorTemple(p.tipo);
  const badgeCls = getTypeBadgeClass(p.tipo);
  const region = p._region || inferRegion(p);
  const tags = getTags(p);
  const distTag = typeof p.distanceKm === "number"
    ? `<span class="dist-badge" aria-label="Distancia aproximada">${formatKm(p.distanceKm)}</span>`
    : "";
  const regionTag = region !== "CABA"
    ? `<span class="region-tag">${region}</span>`
    : "";
  const crowdTag = renderCrowdBadgeHtml(p);
  const adminEditBtn = state.isAdmin
    ? `<button type="button" class="card-edit-btn" data-edit="${pid}" aria-label="Editar ${p.nombre}">${ICON_EDIT}<span>Editar</span></button>`
    : "";

  return `
  <div class="card-wrap" style="position:relative">
    <button class="card ${major ? "card-major" : ""}" data-id="${pid}">
      <div class="card-head">
        <span class="type-badge ${badgeCls}">${p.tipo || "Templo"}</span>
        ${regionTag}
        ${distTag}
        ${crowdTag}
      </div>
      <h2>${p.nombre}</h2>
      <div class="card-meta">
        <p class="addr">${p.direccion}</p>
      </div>
      <p class="next ${status.isNowOrSoon ? "live" : ""}">${status.label}</p>
      <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </button>
    <button class="heart" data-heart="${pid}" aria-pressed="${state.favs.has(pid)}"
      aria-label="Favorito: ${p.nombre}">${ICON_HEART}</button>
    ${adminEditBtn}
  </div>`;
}

function renderList() {
  const items = filtered();
  const total = items.length;
  const visibleItems = items.slice(0, state.visibleLimit);

  const regionNote = state.region !== "ALL" ? ` en ${state.region}` : "";
  const refNote = state.sortByNear && state.userLoc
    ? ` · desde ${state.userLoc.label}`
    : "";
  $("#count").textContent = total
    ? `${total} ${total === 1 ? "resultado" : "resultados"}${regionNote}${refNote}`
    : "";

  $("#list").innerHTML = visibleItems.length
    ? visibleItems.map(renderCardHtml).join("")
    : `<div class="empty"><strong>No encontramos parroquias</strong>Probá con otro nombre, zona o quitá algún filtro.</div>`;

  const sentinel = $("#list-sentinel");
  const btnMore = $("#btn-load-more");
  if (sentinel && btnMore) {
    if (total > visibleItems.length) {
      const remaining = total - visibleItems.length;
      sentinel.hidden = false;
      btnMore.textContent = `Mostrar más parroquias (${remaining} restantes)`;
    } else {
      sentinel.hidden = true;
    }
  }

  renderMapMarkers(items);
}

function renderSuggest() {
  const box = $("#suggest"), q = norm(state.q);
  if (!q) { box.classList.remove("open"); return; }
  const hits = PARISHES
    .filter(p => (p._searchIndex || norm([p.nombre, p.tipo, p.barrio, p.direccion].join(" "))).includes(q))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"))
    .slice(0, 6);
  box.innerHTML = hits.map(p => `<button role="option" data-sug="${p.nombre}"><span>${p.nombre}</span><small>${p.barrio} · ${p._region || inferRegion(p)}</small></button>`).join("");
  box.classList.toggle("open", hits.length > 0);
}

/* =====================================================================
   Favoritos
   ===================================================================== */
function toggleFav(id) {
  const pid = String(id);
  state.favs.has(pid) ? state.favs.delete(pid) : state.favs.add(pid);
  Store.set("favs", [...state.favs]);
  toast(state.favs.has(pid) ? "Agregado a favoritos" : "Quitado de favoritos");
  renderList();
  syncDetailFav();
}

function syncDetailFav() {
  if (!state.current) return;
  const on = state.favs.has(String(state.current.id)), b = $("#d-fav");
  b.classList.toggle("heart-on", on);
  b.setAttribute("aria-label", on ? "Quitar de favoritos" : "Agregar a favoritos");
}

/* =====================================================================
   Vista de Detalle, Widget de Concurrencia ("Lleno / Vacío") y Enlaces
   ===================================================================== */
function renderMisasBlock(p, activeSlot) {
  const rows = Array.isArray(p.horariosMisa)
    ? p.horariosMisa.map(s => {
        const pills = (s.horarios || []).map(h => {
          const cleanH = String(h).trim();
          const crowd = getCrowdStatus(p.id, cleanH);
          const dotHtml = crowd && CROWD_LEVELS[crowd.level]
            ? `<span class="h-dot" aria-hidden="true">${CROWD_LEVELS[crowd.level].dot}</span>`
            : "";
          const isSel = cleanH === activeSlot;
          return `<button type="button" class="hour-pill ${isSel ? "is-selected" : ""}" data-select-slot="${cleanH}" title="Seleccionar misa de las ${cleanH} h para ver o reportar concurrencia">${dotHtml}<span>${cleanH}</span></button>`;
        }).join("");
        return `<div class="row"><span class="d">${s.dia}</span><span class="h">${pills}</span></div>`;
      }).join("")
    : "";

  const currentCrowd = getCrowdStatus(p.id, activeSlot);
  const currentLevel = currentCrowd ? currentCrowd.level : null;
  const slotLabel = activeSlot && activeSlot !== "general" ? `Misa ${activeSlot} h` : "Servicio actual";

  let metaText = "Tocá una opción para informar cómo está el templo en este horario.";
  if (currentCrowd && CROWD_LEVELS[currentLevel]) {
    const authorNote = currentCrowd.byAdmin ? " · Verificado por Admin" : " · Reporte comunitario";
    metaText = `Estado: ${CROWD_LEVELS[currentLevel].label} (${formatRelativeMinutes(currentCrowd.updatedAt)}${authorNote})`;
  }

  return `
    <div class="block" id="misas-block">
      <h3>Horarios de Misa</h3>
      ${rows}
      <div class="crowd-widget" id="crowd-widget" aria-label="Indicador de concurrencia comunitario">
        <div class="crowd-head">
          <span class="crowd-title">Concurrencia en tiempo real</span>
          <span class="crowd-slot-badge" id="crowd-slot-badge">${slotLabel}</span>
        </div>
        <p class="crowd-sub">Elegí un horario arriba o actualizá con un toque la ocupación actual del templo:</p>
        <div class="crowd-buttons" role="group" aria-label="Niveles de concurrencia">
          <button type="button" class="crowd-btn tranquilo" data-crowd-level="tranquilo" aria-pressed="${currentLevel === "tranquilo"}">
            <span>Tranquilo (🟢)</span>
          </button>
          <button type="button" class="crowd-btn moderado" data-crowd-level="moderado" aria-pressed="${currentLevel === "moderado"}">
            <span>Moderado (🟡)</span>
          </button>
          <button type="button" class="crowd-btn lleno" data-crowd-level="lleno" aria-pressed="${currentLevel === "lleno"}">
            <span>Lleno (🔴)</span>
          </button>
        </div>
        <div class="crowd-meta">
          <span id="crowd-meta-text">${metaText}</span>
          ${currentCrowd ? `<button type="button" class="crowd-clear-btn" id="btn-clear-crowd">Restablecer</button>` : ""}
        </div>
      </div>
    </div>`;
}

function renderConfesionesBlock(p) {
  const conf = p.horariosConfesiones;
  const content = typeof conf === "string" && conf.trim()
    ? `<div class="row"><span class="d">Atención</span><span class="h">${conf}</span></div>`
    : `<div class="row"><span class="d">Atención</span><span class="h">Consultar en secretaría</span></div>`;
  return `<div class="block"><h3>Confesiones</h3>${content}</div>`;
}

function openDetail(id) {
  const pid = String(id);
  const p = PARISHES.find(x => String(x.id) === pid);
  if (!p) return;
  state.current = p;
  state.selectedServiceHour = getDefaultServiceHour(p);
  state.detailSection = "horarios";

  const badgeCls = getTypeBadgeClass(p.tipo);
  const region = p._region || inferRegion(p);
  const tags = getTags(p);
  const tel = getPhone(p);
  const validWebUrl = normalizeOfficialUrl(p.webOficial);
  const mapsPlaceUrl = buildGoogleMapsPlaceUrl(p);
  const distInfo = typeof p.distanceKm === "number" ? ` · A ${formatKm(p.distanceKm)}` : "";
  const isFollowingParish = isCurrentUserFollowingParish(pid);
  const parishFollowers = getParishFollowersCount(pid);
  const activities = getParishActivities(p);

  $("#d-body").innerHTML = `
    <div class="sheet-type-row">
      <span class="type-badge ${badgeCls}">${p.tipo || "Templo"}</span>
      <span class="region-tag">${region}</span>
    </div>
    <h2 id="d-name">${p.nombre}</h2>
    <p class="sub">${p.direccion}${distInfo}</p>
    <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>

    <div class="parish-social-bar" id="parish-social-bar">
      <div class="parish-followers-count">
        Comunidad: <strong id="d-parish-followers">${parishFollowers}</strong> seguidores
      </div>
      <button type="button" class="btn-follow-parish ${isFollowingParish ? "is-following" : ""}" id="btn-follow-parish" data-follow-parish="${pid}">
        <span>${isFollowingParish ? "Siguiendo Parroquia ✓" : "+ Seguir Parroquia"}</span>
      </button>
    </div>

    <div class="sheet-section-tabs" role="tablist" aria-label="Secciones de la parroquia">
      <button type="button" class="sheet-sec-tab is-active" data-sheet-sec="horarios">Horarios y Misa</button>
      <button type="button" class="sheet-sec-tab" data-sheet-sec="actividades">Actividades / Grupos (${activities.length})</button>
    </div>

    <div id="d-sec-horarios">
      <div id="d-misas-container">${renderMisasBlock(p, state.selectedServiceHour)}</div>
      ${renderConfesionesBlock(p)}
    </div>

    <div id="d-sec-actividades" class="block">
      <h3>Actividades y Grupos Parroquiales</h3>
      <p class="note" style="margin-top:0;margin-bottom:8px">Sumate a los espacios de oración, coro, catequesis y misión de esta comunidad:</p>
      <div class="activities-grid" id="d-activities-grid">
        ${renderActivitiesCardsHtml(p)}
      </div>
    </div>

    <div class="block"><h3>Contacto y Ubicación</h3>
      <div class="row"><span class="d">Teléfono</span><span class="h">${tel || "No disponible"}</span></div>
      <div class="row"><span class="d">Región</span><span class="h">${region}</span></div>
      <div class="row"><span class="d">Barrio / Partido</span><span class="h">${p.barrio}</span></div>
      <div class="row"><span class="d">Dirección</span><span class="h">${p.direccion}</span></div>
    </div>

    <div class="external-links-wrap">
      <a class="btn-web-source" id="d-web-link" ${validWebUrl ? "" : "hidden"} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>Visitar web oficial / fuente</span>
      </a>

      <a class="btn-maps-place" id="d-maps-place" href="${mapsPlaceUrl}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/>
          <circle cx="12" cy="11" r="2.2"/>
        </svg>
        <span>Ver ficha del templo en Google Maps</span>
      </a>
    </div>

    <div class="correction-box">
      <button type="button" class="btn-suggest" id="btn-open-correction" aria-expanded="false" aria-controls="correction-form">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
        Sugerir corrección de horarios
      </button>

      <form class="correction-form" id="correction-form">
        <h3>Sugerir corrección de horarios</h3>
        <div class="form-field">
          <label for="c-name">Tu nombre</label>
          <input id="c-name" name="nombre" type="text" required placeholder="Ej.: María Gómez" autocomplete="name">
        </div>
        <div class="form-field">
          <label for="c-email">Correo electrónico (obligatorio)</label>
          <input id="c-email" name="email" type="email" required placeholder="tu@correo.com" autocomplete="email">
        </div>
        <div class="form-field">
          <label for="c-error">Error detectado</label>
          <input id="c-error" name="error" type="text" required placeholder="Ej.: Misa de domingo 11:30 h cambió">
        </div>
        <div class="form-field">
          <label for="c-schedule">Nuevo horario propuesto</label>
          <textarea id="c-schedule" name="horario" required placeholder="Ej.: Domingos 12:00 y 18:30 h"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-sm cancel" id="btn-cancel-correction">Cancelar</button>
          <button type="submit" class="btn-sm submit">Enviar reporte</button>
        </div>
      </form>

      <div class="correction-alert" id="correction-alert" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        <span id="correction-alert-text">¡Reporte enviado al administrador! Gracias por colaborar.</span>
      </div>
    </div>`;

  const webLink = $("#d-web-link");
  if (validWebUrl && webLink) {
    webLink.href = validWebUrl;
    webLink.target = "_blank";
    webLink.rel = "noopener noreferrer";
    webLink.hidden = false;
  } else if (webLink) {
    webLink.removeAttribute("href");
    webLink.hidden = true;
  }

  const dEdit = $("#d-edit");
  if (dEdit) {
    dEdit.hidden = !state.isAdmin;
  }

  const call = $("#d-call");
  tel
    ? (call.href = "tel:" + tel.replace(/[^+\d]/g, ""), call.removeAttribute("aria-disabled"))
    : (call.removeAttribute("href"), call.setAttribute("aria-disabled", "true"));
  $("#d-map").href = buildDirectionsUrl(p);
  $("#d-body").scrollTop = 0;
  syncDetailFav();
  bindCrowdWidget();
  bindDetailSocialEvents(p);
  bindCorrectionForm();
  document.body.classList.add("open");
  $("#sheet").setAttribute("aria-hidden", "false");
  $("#d-close").focus();
}

function bindCrowdWidget() {
  const container = $("#d-misas-container");
  if (!container || !state.current) return;

  container.onclick = (e) => {
    const p = state.current;
    if (!p) return;

    const slotBtn = e.target.closest("[data-select-slot]");
    if (slotBtn) {
      state.selectedServiceHour = slotBtn.dataset.selectSlot;
      container.innerHTML = renderMisasBlock(p, state.selectedServiceHour);
      return;
    }

    const levelBtn = e.target.closest("[data-crowd-level]");
    if (levelBtn) {
      const level = levelBtn.dataset.crowdLevel;
      const slot = state.selectedServiceHour || getDefaultServiceHour(p);
      setCrowdStatus(p.id, slot, level);
      container.innerHTML = renderMisasBlock(p, slot);
      renderList();
      const cfg = CROWD_LEVELS[level];
      toast(`Concurrencia actualizada: ${cfg.label}`);
      return;
    }

    const clearBtn = e.target.closest("#btn-clear-crowd");
    if (clearBtn) {
      const slot = state.selectedServiceHour || getDefaultServiceHour(p);
      clearCrowdStatus(p.id, slot);
      container.innerHTML = renderMisasBlock(p, slot);
      renderList();
      toast("Estado de concurrencia restablecido");
    }
  };
}

function bindCorrectionForm() {
  const btnOpen = $("#btn-open-correction");
  const btnCancel = $("#btn-cancel-correction");
  const form = $("#correction-form");
  const alertBox = $("#correction-alert");

  btnOpen.addEventListener("click", () => {
    const isOpen = form.classList.toggle("open");
    btnOpen.setAttribute("aria-expanded", String(isOpen));
    alertBox.classList.remove("show");
    if (isOpen) {
      form.scrollIntoView({ behavior: "smooth", block: "nearest" });
      $("#c-name").focus();
    }
  });

  btnCancel.addEventListener("click", () => {
    form.classList.remove("open");
    btnOpen.setAttribute("aria-expanded", "false");
    form.reset();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("#c-name").value.trim();
    const email = $("#c-email").value.trim();
    form.classList.remove("open");
    btnOpen.setAttribute("aria-expanded", "false");
    form.reset();
    $("#correction-alert-text").textContent =
      `¡Gracias${nombre ? `, ${nombre}` : ""}! El reporte fue enviado al administrador (contacto: ${email}).`;
    alertBox.classList.add("show");
    toast("Reporte enviado al administrador");
  });
}

function closeDetail() {
  document.body.classList.remove("open");
  $("#sheet").setAttribute("aria-hidden", "true");
  state.current = null;
}

/* =====================================================================
   Modo Administrador Protegido por Contraseña ("1118"): Edición y Exportación
   ===================================================================== */
function syncAdminUI() {
  document.body.classList.toggle("is-admin", state.isAdmin);
  const panel = $("#admin-panel");
  const fabAdd = $("#fab-admin-add");
  const footerLabel = $("#footer-admin-label");
  const dEdit = $("#d-edit");

  if (panel) panel.hidden = !state.isAdmin;
  if (fabAdd) fabAdd.hidden = !state.isAdmin;
  if (dEdit) dEdit.hidden = !state.isAdmin || !state.current;
  if (footerLabel) {
    footerLabel.textContent = state.isAdmin ? "Modo administrador activo" : "Acceso administrador";
  }
}

function openAdminLoginModal() {
  if (state.isAdmin) {
    $("#admin-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("El Modo Administrador ya está activo");
    return;
  }
  const modal = $("#admin-login-modal");
  const err = $("#admin-login-error");
  const input = $("#admin-pass");
  if (!modal) return;
  err.hidden = true;
  input.value = "";
  modal.hidden = false;
  setTimeout(() => input.focus(), 40);
}

function closeAdminLoginModal() {
  const modal = $("#admin-login-modal");
  if (modal) modal.hidden = true;
}

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const input = $("#admin-pass");
  const err = $("#admin-login-error");
  const pin = input.value.trim();

  if (pin === ADMIN_MASTER_PIN) {
    state.isAdmin = true;
    Store.set("admin_unlocked", true);
    closeAdminLoginModal();
    syncAdminUI();
    renderList();
    toast("Modo Administrador desbloqueado");
  } else {
    err.hidden = false;
    input.select();
  }
}

function logoutAdmin() {
  state.isAdmin = false;
  Store.set("admin_unlocked", false);
  syncAdminUI();
  renderList();
  toast("Sesión de administrador cerrada");
}

function formatMisasForTextarea(horariosMisa) {
  if (!Array.isArray(horariosMisa)) return "";
  return horariosMisa
    .map(item => `${item.dia}: ${(item.horarios || []).join(", ")}`)
    .join("\n");
}

function parseMisasFromTextarea(rawText) {
  return String(rawText || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const idx = line.indexOf(":");
      if (idx === -1) {
        return { dia: "Lunes a Domingos", horarios: line.split(/[,;]+/).map(s => s.trim()).filter(Boolean) };
      }
      const dia = line.slice(0, idx).trim();
      const horarios = line
        .slice(idx + 1)
        .split(/[,;·]+/)
        .map(s => s.trim())
        .filter(Boolean);
      return { dia, horarios };
    })
    .filter(item => item.dia && item.horarios.length > 0);
}

function openParishEditor(id = null) {
  if (!state.isAdmin) return;
  const modal = $("#admin-edit-modal");
  const title = $("#admin-edit-title");
  if (!modal) return;

  const existing = id !== null ? PARISHES.find(x => String(x.id) === String(id)) : null;

  if (existing) {
    const coords = getCoords(existing) || { lat: CABA_CENTER[0], lng: CABA_CENTER[1] };
    title.textContent = "Editar Parroquia";
    $("#e-id").value = String(existing.id);
    $("#e-nombre").value = existing.nombre || "";
    $("#e-tipo").value = existing.tipo || "Parroquia";
    if ($("#e-region")) $("#e-region").value = existing._region || inferRegion(existing);
    $("#e-barrio").value = existing.barrio || "";
    $("#e-direccion").value = existing.direccion || "";
    $("#e-lat").value = coords.lat;
    $("#e-lng").value = coords.lng;
    $("#e-misas").value = formatMisasForTextarea(existing.horariosMisa);
    $("#e-confesiones").value = existing.horariosConfesiones || "";
    $("#e-telefono").value = getPhone(existing);
    $("#e-web").value = existing.webOficial || "";
    $("#e-etiquetas").value = getTags(existing).join(", ");
  } else {
    title.textContent = "Agregar Nueva Parroquia";
    $("#e-id").value = "";
    $("#e-nombre").value = "";
    $("#e-tipo").value = "Parroquia";
    if ($("#e-region")) $("#e-region").value = state.region !== "ALL" ? state.region : "CABA";
    $("#e-barrio").value = "";
    $("#e-direccion").value = "";
    $("#e-lat").value = -34.6037;
    $("#e-lng").value = -58.3816;
    $("#e-misas").value = "Lunes a Viernes: 08:30, 19:00\nDomingos: 10:00, 11:30, 19:00";
    $("#e-confesiones").value = "Media hora antes de cada misa";
    $("#e-telefono").value = "";
    $("#e-web").value = "";
    $("#e-etiquetas").value = "Parroquia";
  }

  modal.hidden = false;
  setTimeout(() => $("#e-nombre").focus(), 40);
}

function closeParishEditor() {
  const modal = $("#admin-edit-modal");
  if (modal) modal.hidden = true;
}

function getCleanExportableParishes() {
  return PARISHES.map(p => {
    const coords = getCoords(p) || { lat: CABA_CENTER[0], lng: CABA_CENTER[1] };
    return {
      id: p.id,
      nombre: p.nombre,
      tipo: p.tipo,
      region: p._region || inferRegion(p),
      direccion: p.direccion,
      barrio: p.barrio,
      coordenadas: {
        lat: Number(coords.lat),
        lng: Number(coords.lng)
      },
      horariosMisa: Array.isArray(p.horariosMisa) ? p.horariosMisa : [],
      horariosConfesiones: p.horariosConfesiones || "Consultar en secretaría",
      telefono: getPhone(p),
      webOficial: normalizeOfficialUrl(p.webOficial),
      etiquetas: getTags(p)
    };
  });
}

function saveParishEditor(e) {
  e.preventDefault();
  if (!state.isAdmin) return;

  const rawId = $("#e-id").value.trim();
  const nombre = $("#e-nombre").value.trim();
  const tipo = $("#e-tipo").value;
  const region = $("#e-region") ? $("#e-region").value : "CABA";
  const barrio = $("#e-barrio").value.trim();
  const direccion = $("#e-direccion").value.trim();
  const lat = parseFloat($("#e-lat").value);
  const lng = parseFloat($("#e-lng").value);
  const horariosMisa = parseMisasFromTextarea($("#e-misas").value);
  const horariosConfesiones = $("#e-confesiones").value.trim() || "Consultar en secretaría";
  const telefono = $("#e-telefono").value.trim();
  const webOficial = normalizeOfficialUrl($("#e-web").value);
  const etiquetas = $("#e-etiquetas").value
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  if (rawId) {
    const idx = PARISHES.findIndex(x => String(x.id) === rawId);
    if (idx !== -1) {
      PARISHES[idx] = {
        ...PARISHES[idx],
        nombre,
        tipo,
        region,
        barrio,
        direccion,
        coordenadas: { lat, lng },
        horariosMisa,
        horariosConfesiones,
        telefono,
        webOficial,
        etiquetas: etiquetas.length ? etiquetas : [tipo]
      };
    }
  } else {
    const maxId = PARISHES.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    const newRecord = {
      id: maxId + 1,
      nombre,
      tipo,
      region,
      direccion,
      barrio,
      coordenadas: { lat, lng },
      horariosMisa,
      horariosConfesiones,
      telefono,
      webOficial,
      etiquetas: etiquetas.length ? etiquetas : [tipo]
    };
    PARISHES.push(newRecord);
  }

  PARISHES = prepareDataset(PARISHES);
  if (state.userLoc) {
    updateDistances(state.userLoc.lat, state.userLoc.lng);
  }

  const cleanList = getCleanExportableParishes();
  Store.set("parishes_admin_data", cleanList);
  Store.set("parishes_cache_v6", cleanList);

  closeParishEditor();
  renderChips();
  renderList();

  if (state.current && rawId && String(state.current.id) === rawId) {
    openDetail(rawId);
  }

  toast(rawId ? "Parroquia actualizada y guardada" : "Nueva parroquia agregada y guardada");
}

function exportUpdatedJson() {
  const cleanList = getCleanExportableParishes();
  const jsonContent = JSON.stringify(cleanList, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "parroquias.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast("Descargando parroquias.json actualizado");
}

/* =====================================================================
   ECOSISTEMA SOCIAL COMUNITARIO (Perfil Local, Feed, Amistad, Ranking y Actividades)
   ===================================================================== */
const SOCIAL_STORAGE_KEY = "social_ecosystem_v1";
const AVATAR_PRESETS = ["✝️", "🕊️", "🕯️", "⛪", "🎵", "🌿", "⭐", "🙏"];

// Seguidores base de cada parroquia para el Ranking Comunitario inicial
const BASE_PARISH_FOLLOWERS = {
  "1": 342, "2": 289, "3": 195, "4": 210, "5": 164, "6": 118,
  "7": 94,  "8": 88,  "9": 236, "10": 274, "11": 142, "12": 318,
  "13": 265, "14": 251, "15": 176, "16": 159, "17": 298, "18": 184,
  "19": 137, "20": 412, "21": 192, "22": 146, "23": 188, "24": 171
};

function getParishActivities(p) {
  const pid = String(p.id);
  const slug = norm(p.nombre)
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join("");

  if (Array.isArray(p.actividades) && p.actividades.length) {
    return p.actividades;
  }

  return [
    {
      id: `act_${pid}_oracion`,
      parishId: pid,
      parishName: p.nombre,
      categoria: "Grupo de Oración",
      nombre: "Grupo de Oración y Adoración Eucarística",
      descripcion: "Encuentro semanal de alabanza, lectio divina y adoración abierta a toda la comunidad.",
      horario: "Jueves 19:45 h",
      instagram: `@oracion.${slug || "parroquia"}`
    },
    {
      id: `act_${pid}_coro`,
      parishId: pid,
      parishName: p.nombre,
      categoria: "Coro y Música",
      nombre: "Coro Litúrgico y Ministerio de Música",
      descripcion: "Preparación de cantos para las misas dominicales y solemnidades. No requiere experiencia previa.",
      horario: "Sábados 17:30 h",
      instagram: `@coro.${slug || "parroquia"}`
    },
    {
      id: `act_${pid}_catequesis`,
      parishId: pid,
      parishName: p.nombre,
      categoria: "Catequesis",
      nombre: "Catequesis Familiar, Jóvenes y Confirmación",
      descripcion: "Espacio de formación en la fe para niños, adolescentes y adultos que se preparan para los sacramentos.",
      horario: "Sábados 10:30 h",
      instagram: `@catequesis.${slug || "parroquia"}`
    },
    {
      id: `act_${pid}_misiones`,
      parishId: pid,
      parishName: p.nombre,
      categoria: "Misiones y Caridad",
      nombre: "Grupo Misionero y Noche de la Caridad",
      descripcion: "Recorridas solidarias, visitas a enfermos y misiones barriales junto a jóvenes y familias.",
      horario: "Viernes 20:00 h",
      instagram: `@misioneros.${slug || "parroquia"}`
    }
  ];
}

function getInitialSocialDB() {
  const now = Date.now();
  return {
    currentUser: null, // username activo o null (invitado)
    users: {
      "martina.recoleta": {
        username: "martina.recoleta",
        password: "1234",
        apodo: "Martina Gómez",
        bio: "Coordinadora del coro dominical y adoradora en Recoleta. ¡Bienvenidos a cantar! 🎵",
        avatarIcon: "🎵",
        avatarUrl: "",
        instagram: "@martina.coropilar",
        twitter: "@martinarecoleta",
        followingUsers: ["padre.tomas", "lucas.coro", "sofi.misiones"],
        followedParishes: ["2", "1", "14"],
        joinedActivities: ["act_2_coro", "act_2_oracion", "act_14_misiones"]
      },
      "padre.tomas": {
        username: "padre.tomas",
        password: "1234",
        apodo: "P. Tomás Herrera",
        bio: "Sacerdote en CABA. Compartiendo avisos parroquiales, horarios de confesión y reflexiones diarias.",
        avatarIcon: "✝️",
        avatarUrl: "",
        instagram: "@padretomas.ba",
        twitter: "@padretomas_ar",
        followingUsers: ["martina.recoleta", "lucas.coro", "sofi.misiones", "juan.sanisidro"],
        followedParishes: ["1", "12", "20"],
        joinedActivities: ["act_1_oracion", "act_12_catequesis"]
      },
      "lucas.coro": {
        username: "lucas.coro",
        password: "1234",
        apodo: "Lucas Benítez",
        bio: "Guitarrista en La Redonda de Belgrano y misionero universitario en Zona Norte.",
        avatarIcon: "🕯️",
        avatarUrl: "",
        instagram: "@lucas.benitez.musica",
        twitter: "@lucascoro_ba",
        followingUsers: ["martina.recoleta", "padre.tomas", "juan.sanisidro"],
        followedParishes: ["12", "17", "6"],
        joinedActivities: ["act_12_coro", "act_17_misiones"]
      },
      "sofi.misiones": {
        username: "sofi.misiones",
        password: "1234",
        apodo: "Sofía Pereyra",
        bio: "Catequista de confirmación y voluntaria en la Noche de la Caridad en Flores y Caballito.",
        avatarIcon: "🕊️",
        avatarUrl: "",
        instagram: "@sofi.misionera",
        twitter: "@sofipereyra_ok",
        followingUsers: ["martina.recoleta", "padre.tomas"],
        followedParishes: ["10", "15", "20"],
        joinedActivities: ["act_10_misiones", "act_15_catequesis"]
      },
      "juan.sanisidro": {
        username: "juan.sanisidro",
        password: "1234",
        apodo: "Juan Ignacio Paz",
        bio: "Vecino de Zona Norte. Peregrino a Luján cada octubre y servidor en la Catedral de San Isidro.",
        avatarIcon: "⛪",
        avatarUrl: "",
        instagram: "@juani.sanisidro",
        twitter: "@juanipaz_gba",
        followingUsers: ["padre.tomas", "lucas.coro"],
        followedParishes: ["17", "20", "18"],
        joinedActivities: ["act_17_oracion", "act_20_misiones"]
      }
    },
    posts: [
      {
        id: "post_1",
        author: "padre.tomas",
        parishId: "1",
        text: "¡Buen día comunidad! Hoy después de la misa de 12:30 h en la Catedral tendremos adoración al Santísimo y confesiones disponibles.",
        createdAt: now - 22 * 60 * 1000,
        likes: ["martina.recoleta", "lucas.coro", "sofi.misiones"]
      },
      {
        id: "post_2",
        author: "martina.recoleta",
        parishId: "2",
        text: "Este sábado a las 17:30 h sumamos voces nuevas al Coro de la Basílica del Pilar. Si te gusta cantar o tocar algún instrumento, ¡escribinos!",
        createdAt: now - 75 * 60 * 1000,
        likes: ["padre.tomas", "lucas.coro"]
      },
      {
        id: "post_3",
        author: "sofi.misiones",
        parishId: "10",
        text: "Preparamos viandas calientes con el Grupo Misionero de San José de Flores para la recorrida del viernes a las 20 h. ¡Toda ayuda suma!",
        createdAt: now - 160 * 60 * 1000,
        likes: ["martina.recoleta", "padre.tomas", "juan.sanisidro"]
      },
      {
        id: "post_4",
        author: "juan.sanisidro",
        parishId: "17",
        text: "Hermosa celebración hoy en la Catedral de San Isidro. Muy tranquilo el templo a la mañana y excelente acústica del coro.",
        createdAt: now - 290 * 60 * 1000,
        likes: ["lucas.coro"]
      }
    ]
  };
}

let socialDB = Store.get(SOCIAL_STORAGE_KEY, null);
if (!socialDB || !socialDB.users || !Array.isArray(socialDB.posts)) {
  socialDB = getInitialSocialDB();
  Store.set(SOCIAL_STORAGE_KEY, socialDB);
}

function saveSocialDB() {
  Store.set(SOCIAL_STORAGE_KEY, socialDB);
}

function getCurrentUserObj() {
  if (!socialDB.currentUser) return null;
  return socialDB.users[socialDB.currentUser] || null;
}

function renderAvatarContent(user) {
  if (!user) return "👤";
  if (user.avatarUrl && /^https?:\/\//i.test(user.avatarUrl.trim())) {
    return `<img src="${user.avatarUrl.trim()}" alt="${user.apodo}" loading="lazy">`;
  }
  return user.avatarIcon || "✝️";
}

function syncHeaderUserPill() {
  const user = getCurrentUserObj();
  const avatarEl = $("#header-user-avatar");
  const labelEl = $("#header-user-label");
  const navLabel = $("#nav-profile-label");

  if (user) {
    if (avatarEl) avatarEl.innerHTML = renderAvatarContent(user);
    if (labelEl) labelEl.textContent = user.apodo.split(" ")[0];
    if (navLabel) navLabel.textContent = user.apodo.split(" ")[0];
  } else {
    if (avatarEl) avatarEl.innerHTML = "👤";
    if (labelEl) labelEl.textContent = "Ingresar";
    if (navLabel) navLabel.textContent = "Perfil / Cuenta";
  }
}

/**
 * Si un invitado intenta realizar una acción social (seguir, publicar, unirse a grupo),
 * lo dirige amablemente a la vista de Perfil / Cuenta sin bloquear el resto de la app.
 */
function requireAuth(actionDescription) {
  const user = getCurrentUserObj();
  if (user) return user;
  closeDetail();
  closePublicProfileModal();
  switchView("profile");
  toast(`Iniciá sesión o creá tu cuenta para ${actionDescription}`);
  return null;
}

/**
 * Sistema de Amistad:
 * Si Usuario A sigue a Usuario B y Usuario B sigue a Usuario A, son automáticamente "Amigos".
 */
function isFollowingUser(sourceUsername, targetUsername) {
  const u = socialDB.users[sourceUsername];
  if (!u || !Array.isArray(u.followingUsers)) return false;
  return u.followingUsers.includes(targetUsername);
}

function areFriends(usernameA, usernameB) {
  if (!usernameA || !usernameB || usernameA === usernameB) return false;
  return isFollowingUser(usernameA, usernameB) && isFollowingUser(usernameB, usernameA);
}

function getFollowersOfUser(username) {
  return Object.values(socialDB.users).filter(
    u => u.username !== username && Array.isArray(u.followingUsers) && u.followingUsers.includes(username)
  );
}

function getFriendsOfUser(username) {
  const u = socialDB.users[username];
  if (!u || !Array.isArray(u.followingUsers)) return [];
  return u.followingUsers.filter(target => areFriends(username, target));
}

function toggleFollowUser(targetUsername) {
  const me = requireAuth("seguir a otros miembros");
  if (!me || me.username === targetUsername) return;
  if (!Array.isArray(me.followingUsers)) me.followingUsers = [];

  const idx = me.followingUsers.indexOf(targetUsername);
  const targetUser = socialDB.users[targetUsername];
  const targetName = targetUser ? targetUser.apodo : `@${targetUsername}`;

  if (idx >= 0) {
    me.followingUsers.splice(idx, 1);
    toast(`Dejaste de seguir a ${targetName}`);
  } else {
    me.followingUsers.push(targetUsername);
    if (areFriends(me.username, targetUsername)) {
      toast(`¡Ahora vos y ${targetName} son Amigos! 🤝`);
    } else {
      toast(`Ahora seguís a ${targetName}`);
    }
  }
  saveSocialDB();
  if (state.view === "community") renderCommunityView();
  if (state.view === "profile") renderProfileView();
}

/* --- Seguimiento de Parroquias y Ranking Comunitario --- */
function isCurrentUserFollowingParish(parishId) {
  const me = getCurrentUserObj();
  if (!me || !Array.isArray(me.followedParishes)) return false;
  return me.followedParishes.includes(String(parishId));
}

function getParishFollowersCount(parishId) {
  const pid = String(parishId);
  const base = BASE_PARISH_FOLLOWERS[pid] || 75;
  let localCount = 0;
  Object.values(socialDB.users).forEach(u => {
    if (Array.isArray(u.followedParishes) && u.followedParishes.includes(pid)) {
      localCount++;
    }
  });
  return base + localCount;
}

function toggleFollowParish(parishId) {
  const me = requireAuth("seguir una parroquia");
  if (!me) return;
  const pid = String(parishId);
  if (!Array.isArray(me.followedParishes)) me.followedParishes = [];

  const p = PARISHES.find(x => String(x.id) === pid);
  const idx = me.followedParishes.indexOf(pid);
  if (idx >= 0) {
    me.followedParishes.splice(idx, 1);
    toast(`Dejaste de seguir a ${p ? p.nombre : "la parroquia"}`);
  } else {
    me.followedParishes.push(pid);
    toast(`¡Te sumaste a la comunidad de ${p ? p.nombre : "la parroquia"}!`);
  }
  saveSocialDB();

  // Actualiza barra de seguimiento en la ficha si está abierta
  const btn = $("#btn-follow-parish");
  const countEl = $("#d-parish-followers");
  if (btn && String(btn.dataset.followParish) === pid) {
    const nowFollowing = isCurrentUserFollowingParish(pid);
    btn.classList.toggle("is-following", nowFollowing);
    btn.innerHTML = `<span>${nowFollowing ? "Siguiendo Parroquia ✓" : "+ Seguir Parroquia"}</span>`;
  }
  if (countEl) {
    countEl.textContent = String(getParishFollowersCount(pid));
  }

  if (state.view === "community") renderCommunityView();
  if (state.view === "profile") renderProfileView();
}

/* --- Seguimiento de Actividades y Grupos Parroquiales --- */
function isCurrentUserInActivity(activityId) {
  const me = getCurrentUserObj();
  if (!me || !Array.isArray(me.joinedActivities)) return false;
  return me.joinedActivities.includes(String(activityId));
}

function findActivityById(activityId) {
  for (let i = 0; i < PARISHES.length; i++) {
    const acts = getParishActivities(PARISHES[i]);
    const match = acts.find(a => a.id === activityId);
    if (match) return match;
  }
  return null;
}

function toggleFollowActivity(activityId) {
  const me = requireAuth("sumarte a un grupo o actividad parroquial");
  if (!me) return;
  if (!Array.isArray(me.joinedActivities)) me.joinedActivities = [];

  const act = findActivityById(activityId);
  const idx = me.joinedActivities.indexOf(activityId);
  if (idx >= 0) {
    me.joinedActivities.splice(idx, 1);
    toast(`Saliste de ${act ? act.nombre : "la actividad"}`);
  } else {
    me.joinedActivities.push(activityId);
    toast(`¡Ahora participás en ${act ? act.nombre : "la actividad"}!`);
  }
  saveSocialDB();

  if (state.current && $("#d-activities-grid")) {
    $("#d-activities-grid").innerHTML = renderActivitiesCardsHtml(state.current);
  }
  if (state.view === "profile") renderProfileView();
}

function normalizeSocialHandleUrl(handleOrUrl, platform) {
  const raw = String(handleOrUrl || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const cleanHandle = raw.replace(/^@+/, "");
  if (!cleanHandle) return "";
  return platform === "twitter"
    ? `https://x.com/${encodeURIComponent(cleanHandle)}`
    : `https://instagram.com/${encodeURIComponent(cleanHandle)}`;
}

function renderActivitiesCardsHtml(p) {
  const activities = getParishActivities(p);
  return activities.map(act => {
    const joined = isCurrentUserInActivity(act.id);
    const igUrl = normalizeSocialHandleUrl(act.instagram, "instagram");
    return `
      <div class="activity-card">
        <div class="activity-top">
          <span class="activity-cat">${act.categoria}</span>
          <small style="color:var(--muted);font-weight:600">${act.horario || ""}</small>
        </div>
        <h4>${act.nombre}</h4>
        <p class="activity-desc">${act.descripcion}</p>
        <div class="activity-foot">
          ${igUrl ? `<a class="activity-ig" href="${igUrl}" target="_blank" rel="noopener noreferrer">📸 ${act.instagram}</a>` : `<span></span>`}
          <button type="button" class="btn-follow-activity ${joined ? "is-joined" : ""}" data-follow-activity="${act.id}">
            ${joined ? "Participando ✓" : "+ Seguir Actividad"}
          </button>
        </div>
      </div>`;
  }).join("");
}

function bindDetailSocialEvents(p) {
  const sheetBody = $("#d-body");
  if (!sheetBody) return;

  const followParishBtn = $("#btn-follow-parish");
  if (followParishBtn) {
    followParishBtn.onclick = () => toggleFollowParish(p.id);
  }

  // Pestañas internas en la ficha: Horarios y Misa vs Actividades / Grupos
  sheetBody.querySelectorAll("[data-sheet-sec]").forEach(tabBtn => {
    tabBtn.onclick = () => {
      const targetSec = tabBtn.dataset.sheetSec;
      sheetBody.querySelectorAll("[data-sheet-sec]").forEach(b => {
        b.classList.toggle("is-active", b.dataset.sheetSec === targetSec);
      });
      const secHorarios = $("#d-sec-horarios");
      const secAct = $("#d-sec-actividades");
      if (targetSec === "actividades" && secAct) {
        secAct.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (secHorarios) {
        secHorarios.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
  });

  const actGrid = $("#d-activities-grid");
  if (actGrid) {
    actGrid.onclick = (e) => {
      const btn = e.target.closest("[data-follow-activity]");
      if (btn) {
        toggleFollowActivity(btn.dataset.followActivity);
      }
    };
  }
}

/* --- Renderizado de la Vista Comunidad (Feed Twitter + Ranking + Personas) --- */
function renderCommunityView() {
  const container = $("#community-content");
  if (!container) return;

  $$("#community-subtabs [data-comm-tab]").forEach(btn => {
    const active = btn.dataset.commTab === state.commTab;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  if (state.commTab === "ranking") {
    container.innerHTML = renderRankingSectionHtml();
    return;
  }

  if (state.commTab === "people") {
    container.innerHTML = renderPeopleDirectoryHtml();
    return;
  }

  const me = getCurrentUserObj();
  const followersCount = me ? getFollowersOfUser(me.username).length : 0;
  const followingCount = me ? (me.followingUsers || []).length : 0;
  const friendsCount = me ? getFriendsOfUser(me.username).length : 0;

  const statsBarHtml = me ? `
    <div class="social-stats-bar" aria-label="Tus estadísticas comunitarias">
      <div class="stat-box"><strong>${followersCount}</strong><span>Seguidores</span></div>
      <div class="stat-box"><strong>${followingCount}</strong><span>Seguidos</span></div>
      <div class="stat-box"><strong>${friendsCount}</strong><span>🤝 Amigos</span></div>
    </div>` : "";

  const composerHtml = me ? `
    <form class="composer-card" id="social-post-form">
      <div class="composer-top">
        <div class="avatar-circle">${renderAvatarContent(me)}</div>
        <textarea class="composer-input" id="social-post-text" maxlength="280" required placeholder="¿Qué está pasando en tu parroquia, coro o grupo misionero?"></textarea>
      </div>
      <div class="composer-foot">
        <select class="composer-select" id="social-post-parish" aria-label="Vincular parroquia opcional">
          <option value="">📍 Vincular parroquia (opcional)</option>
          ${PARISHES.map(p => `<option value="${p.id}">${p.nombre} (${p.barrio})</option>`).join("")}
        </select>
        <button type="submit" class="btn-post">Publicar</button>
      </div>
    </form>` : `
    <div class="composer-card guest-invite">
      <p><strong>Navegación libre activa.</strong> Para publicar mensajes cortos, seguir usuarios o sumarte a actividades, iniciá sesión con tu perfil local.</p>
      <button type="button" class="btn-post" data-go-login="true">Iniciar sesión / Crear cuenta</button>
    </div>`;

  let posts = [...socialDB.posts].sort((a, b) => b.createdAt - a.createdAt);
  if (state.commTab === "following") {
    if (!me) {
      container.innerHTML = composerHtml + `
        <div class="empty">
          <strong>Iniciá sesión para ver a quiénes seguís</strong>
          En el Muro General podés leer todos los mensajes de la comunidad libremente.
        </div>`;
      return;
    }
    const allowedAuthors = new Set([me.username, ...(me.followingUsers || [])]);
    posts = posts.filter(post => allowedAuthors.has(post.author));
  }

  const postsHtml = posts.length ? posts.map(post => {
    const author = socialDB.users[post.author] || {
      username: post.author,
      apodo: post.author,
      avatarIcon: "✝️"
    };
    const parish = post.parishId ? PARISHES.find(x => String(x.id) === String(post.parishId)) : null;
    const isMe = me && me.username === author.username;
    const isMutual = me && areFriends(me.username, author.username);
    const followsMe = me && isFollowingUser(author.username, me.username) && !isMutual;
    const amFollowing = me && isFollowingUser(me.username, author.username);
    const liked = me && Array.isArray(post.likes) && post.likes.includes(me.username);
    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;

    return `
      <article class="post-card">
        <div class="post-head">
          <button type="button" class="post-author" data-open-user="${author.username}">
            <div class="avatar-circle">${renderAvatarContent(author)}</div>
            <div class="post-author-info">
              <div class="post-author-name">
                <span>${author.apodo}</span>
                ${isMutual ? `<span class="friend-badge">🤝 Amigos</span>` : ""}
                ${followsMe ? `<span class="follows-you-tag">Te sigue</span>` : ""}
              </div>
              <div class="post-author-handle">@${author.username} · ${formatRelativeMinutes(post.createdAt)}</div>
            </div>
          </button>
          ${!isMe ? `
            <button type="button" class="btn-follow-sm ${amFollowing ? "is-following" : ""}" data-follow-user="${author.username}">
              ${amFollowing ? "Siguiendo" : "+ Seguir"}
            </button>` : ""}
        </div>
        ${parish ? `
          <button type="button" class="post-parish-tag" data-open-parish="${parish.id}">
            ⛪ ${parish.nombre}
          </button>` : ""}
        <p class="post-body">${post.text}</p>
        <div class="post-foot">
          <button type="button" class="post-amen-btn ${liked ? "liked" : ""}" data-like-post="${post.id}">
            <span>🙏 Amén / Apoyar</span>
            <strong>${likesCount}</strong>
          </button>
          <button type="button" style="font-weight:600;color:var(--brand)" data-open-user="${author.username}">
            Ver perfil y grupos →
          </button>
        </div>
      </article>`;
  }).join("") : `
    <div class="empty">
      <strong>Todavía no hay mensajes en esta vista</strong>
      Seguí a más miembros en la pestaña "Personas y Amigos" o publicá el primer mensaje.
    </div>`;

  container.innerHTML = `${statsBarHtml}${composerHtml}<div class="feed-list">${postsHtml}</div>`;
}

function renderRankingSectionHtml() {
  const ranked = [...PARISHES]
    .map(p => ({
      parish: p,
      followers: getParishFollowersCount(p.id),
      groupsCount: getParishActivities(p).length
    }))
    .sort((a, b) => b.followers - a.followers);

  return `
    <div class="ranking-list">
      ${ranked.map((item, idx) => {
        const p = item.parish;
        const pos = idx + 1;
        const isFollowing = isCurrentUserFollowingParish(p.id);
        const region = p._region || inferRegion(p);
        return `
          <div class="ranking-card ${pos <= 3 ? "top-3" : ""}">
            <div class="rank-num">#${pos}</div>
            <button type="button" class="ranking-info" data-open-parish="${p.id}">
              <h3>${p.nombre}</h3>
              <div class="ranking-meta">
                <span class="ranking-followers">👥 ${item.followers} seguidores</span>
                <span>· ${p.barrio} (${region})</span>
                <span>· ${item.groupsCount} grupos activos</span>
              </div>
            </button>
            <div class="ranking-actions">
              <button type="button" class="btn-follow-sm ${isFollowing ? "is-following" : ""}" data-follow-parish-rank="${p.id}">
                ${isFollowing ? "Siguiendo ✓" : "+ Seguir"}
              </button>
            </div>
          </div>`;
      }).join("")}
    </div>`;
}

function renderPeopleDirectoryHtml() {
  const me = getCurrentUserObj();
  const usersList = Object.values(socialDB.users);

  return `
    <div class="feed-list">
      ${usersList.map(u => {
        const isMe = me && me.username === u.username;
        const isMutual = me && areFriends(me.username, u.username);
        const followsMe = me && isFollowingUser(u.username, me.username) && !isMutual;
        const amFollowing = me && isFollowingUser(me.username, u.username);
        const followersCount = getFollowersOfUser(u.username).length;
        const followingCount = (u.followingUsers || []).length;

        return `
          <div class="post-card">
            <div class="post-head">
              <button type="button" class="post-author" data-open-user="${u.username}">
                <div class="avatar-circle">${renderAvatarContent(u)}</div>
                <div class="post-author-info">
                  <div class="post-author-name">
                    <span>${u.apodo}</span>
                    ${isMe ? `<span class="follows-you-tag">Vos</span>` : ""}
                    ${isMutual ? `<span class="friend-badge">🤝 Amigos</span>` : ""}
                    ${followsMe ? `<span class="follows-you-tag">Te sigue</span>` : ""}
                  </div>
                  <div class="post-author-handle">@${u.username} · ${followersCount} seguidores · ${followingCount} seguidos</div>
                </div>
              </button>
              ${!isMe ? `
                <button type="button" class="btn-follow-sm ${amFollowing ? "is-following" : ""}" data-follow-user="${u.username}">
                  ${amFollowing ? "Siguiendo" : "+ Seguir"}
                </button>` : ""}
            </div>
            <p class="post-body" style="margin-bottom:8px">${u.bio || "Miembro de la comunidad parroquial."}</p>
            <div class="post-foot">
              <span>⛪ ${(u.followedParishes || []).length} parroquias · 🤝 ${(u.joinedActivities || []).length} grupos</span>
              <button type="button" style="font-weight:600;color:var(--brand)" data-open-user="${u.username}">
                Ver perfil completo →
              </button>
            </div>
          </div>`;
      }).join("")}
    </div>`;
}

/* --- Renderizado de Perfil Público (Modal y Vista de Mi Perfil) --- */
function renderUserPublicCardHtml(u, isOwnProfile = false) {
  const me = getCurrentUserObj();
  const isMutual = me && !isOwnProfile && areFriends(me.username, u.username);
  const followsMe = me && !isOwnProfile && isFollowingUser(u.username, me.username) && !isMutual;
  const amFollowing = me && !isOwnProfile && isFollowingUser(me.username, u.username);

  const followers = getFollowersOfUser(u.username);
  const following = u.followingUsers || [];
  const friends = getFriendsOfUser(u.username);

  const igUrl = normalizeSocialHandleUrl(u.instagram, "instagram");
  const twUrl = normalizeSocialHandleUrl(u.twitter, "twitter");

  const followedParishesObjs = (u.followedParishes || [])
    .map(pid => PARISHES.find(p => String(p.id) === String(pid)))
    .filter(Boolean);

  const joinedActivitiesObjs = (u.joinedActivities || [])
    .map(aid => findActivityById(aid))
    .filter(Boolean);

  return `
    <div class="profile-card">
      <div class="profile-hero">
        <div class="avatar-circle lg">${renderAvatarContent(u)}</div>
        <div class="profile-hero-info">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <h2>${u.apodo}</h2>
            ${isMutual ? `<span class="friend-badge">🤝 Amigos</span>` : ""}
            ${followsMe ? `<span class="follows-you-tag">Te sigue</span>` : ""}
          </div>
          <div class="profile-handle">@${u.username}</div>
        </div>
        ${!isOwnProfile ? `
          <button type="button" class="btn-follow-parish ${amFollowing ? "is-following" : ""}" data-follow-user="${u.username}">
            ${amFollowing ? "Siguiendo ✓" : "+ Seguir"}
          </button>` : ""}
      </div>

      <p class="profile-bio">${u.bio || "Sin biografía cargada todavía."}</p>

      ${(igUrl || twUrl) ? `
        <div class="social-links-row">
          ${igUrl ? `<a class="social-link-pill" href="${igUrl}" target="_blank" rel="noopener noreferrer">📸 Instagram: ${u.instagram}</a>` : ""}
          ${twUrl ? `<a class="social-link-pill" href="${twUrl}" target="_blank" rel="noopener noreferrer">🐦 Twitter/X: ${u.twitter}</a>` : ""}
        </div>` : ""}

      <div class="social-stats-bar" style="margin-bottom:6px">
        <div class="stat-box"><strong>${followers.length}</strong><span>Seguidores</span></div>
        <div class="stat-box"><strong>${following.length}</strong><span>Seguidos</span></div>
        <div class="stat-box"><strong>${friends.length}</strong><span>🤝 Amigos</span></div>
      </div>

      <div class="profile-section-title">⛪ Parroquias que sigue (${followedParishesObjs.length})</div>
      <div class="membership-list">
        ${followedParishesObjs.length
          ? followedParishesObjs.map(p => `
              <button type="button" class="membership-chip" data-open-parish="${p.id}">
                <span>⛪ <strong>${p.nombre}</strong> <small>(${p.barrio})</small></span>
              </button>`).join("")
          : `<span class="note" style="margin:0">Todavía no sigue ninguna parroquia.</span>`}
      </div>

      <div class="profile-section-title">🙌 Grupos y Actividades Parroquiales (${joinedActivitiesObjs.length})</div>
      <div class="membership-list">
        ${joinedActivitiesObjs.length
          ? joinedActivitiesObjs.map(act => `
              <button type="button" class="membership-chip" data-open-parish="${act.parishId}">
                <span>✨ <strong>${act.nombre}</strong> <small>· ${act.parishName}</small></span>
              </button>`).join("")
          : `<span class="note" style="margin:0">Todavía no participa en grupos parroquiales.</span>`}
      </div>
    </div>`;
}

function openPublicProfile(username) {
  const u = socialDB.users[username];
  if (!u) return;
  const modal = $("#public-profile-modal");
  const body = $("#public-profile-body");
  if (!modal || !body) return;

  const me = getCurrentUserObj();
  body.innerHTML = renderUserPublicCardHtml(u, Boolean(me && me.username === u.username));
  modal.hidden = false;
}

function closePublicProfileModal() {
  const modal = $("#public-profile-modal");
  if (modal) modal.hidden = true;
}

function renderProfileView() {
  const container = $("#profile-content");
  if (!container) return;

  const me = getCurrentUserObj();
  if (!me) {
    container.innerHTML = `
      <div class="profile-card">
        <h2 style="font-family:var(--serif);font-size:1.45rem;margin-bottom:6px">Ingresar o Crear Cuenta Local</h2>
        <p class="modal-sub">El uso del mapa, buscador y horarios es 100% libre. Iniciá sesión solo si querés publicar en el muro, seguir parroquias o sumarte a actividades.</p>

        <form id="user-auth-form" class="admin-edit-form">
          <div class="form-row-2">
            <div class="form-field">
              <label for="u-username">Usuario (sin espacios)</label>
              <input id="u-username" type="text" required placeholder="ej: maria.flores" autocomplete="username">
            </div>
            <div class="form-field">
              <label for="u-password">Contraseña</label>
              <input id="u-password" type="password" required placeholder="••••" autocomplete="current-password">
            </div>
          </div>
          <div class="form-field">
            <label for="u-apodo">Apodo / Nombre visible (al registrarte)</label>
            <input id="u-apodo" type="text" placeholder="Ej.: María Flores">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-sm submit">Ingresar / Registrarme</button>
          </div>
        </form>

        <div class="profile-section-title" style="margin-top:18px">Cuentas de prueba rápida (1 toque)</div>
        <div class="demo-accounts">
          <button type="button" class="demo-pill" data-demo-login="martina.recoleta">🎵 Martina (@martina.recoleta)</button>
          <button type="button" class="demo-pill" data-demo-login="padre.tomas">✝️ P. Tomás (@padre.tomas)</button>
          <button type="button" class="demo-pill" data-demo-login="lucas.coro">🕯️ Lucas (@lucas.coro)</button>
        </div>
      </div>`;
    return;
  }

  const currentIcon = me.avatarIcon || "✝️";
  container.innerHTML = `
    ${renderUserPublicCardHtml(me, true)}

    <div class="profile-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <h3 style="font-size:1.05rem;font-weight:600">Editar Mi Perfil</h3>
        <button type="button" class="admin-logout-btn" id="btn-user-logout">Cerrar sesión</button>
      </div>
      <form id="profile-edit-form" class="admin-edit-form">
        <div class="form-field">
          <label for="p-apodo">Apodo / Nombre público</label>
          <input id="p-apodo" type="text" required value="${me.apodo || ""}">
        </div>
        <div class="form-field">
          <label for="p-bio">Biografía corta</label>
          <textarea id="p-bio" rows="2" maxlength="180" placeholder="Contá a qué parroquia asistís o en qué grupo participás">${me.bio || ""}</textarea>
        </div>
        <div class="form-field">
          <label>Ícono de perfil</label>
          <input type="hidden" id="p-avatar-icon" value="${currentIcon}">
          <div class="avatar-picker" id="p-avatar-picker">
            ${AVATAR_PRESETS.map(ic => `
              <button type="button" class="avatar-opt ${ic === currentIcon ? "is-selected" : ""}" data-pick-icon="${ic}">${ic}</button>
            `).join("")}
          </div>
        </div>
        <div class="form-field">
          <label for="p-avatar-url">O URL de foto de perfil (opcional)</label>
          <input id="p-avatar-url" type="url" value="${me.avatarUrl || ""}" placeholder="https://...">
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="p-ig">Instagram</label>
            <input id="p-ig" type="text" value="${me.instagram || ""}" placeholder="@tu.usuario">
          </div>
          <div class="form-field">
            <label for="p-tw">Twitter / X</label>
            <input id="p-tw" type="text" value="${me.twitter || ""}" placeholder="@tu_usuario">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-sm submit">Guardar Perfil</button>
        </div>
      </form>
    </div>`;
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* =====================================================================
   Conexión de Eventos en el DOM (DOMContentLoaded) e Inicio Offline-First
   ===================================================================== */
let appInitialized = false;

function bindAppEvents() {
  $$("[data-target-view]").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.targetView));
  });

  $("#btn-map-fit")?.addEventListener("click", () => fitMapToBounds(filtered()));

  // Debounce ligero para que el filtrado sea instantáneo en listas de +100 registros en celulares
  let searchDebounceTimer = null;
  $("#q")?.addEventListener("input", e => {
    state.q = e.target.value;
    state.visibleLimit = PAGE_SIZE;
    renderSuggest();
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      renderList();
    }, 90);
  });
  $("#q")?.addEventListener("focus", renderSuggest);
  $("#suggest")?.addEventListener("click", e => {
    const b = e.target.closest("[data-sug]");
    if (!b) return;
    state.q = b.dataset.sug;
    $("#q").value = state.q;
    $("#suggest").classList.remove("open");
    state.visibleLimit = PAGE_SIZE;
    renderList();
  });
  document.addEventListener("click", e => { if (!e.target.closest(".field")) $("#suggest")?.classList.remove("open"); });

  // Botón flotante "Cerca de mí", botón inline "Usar GPS" y selector manual de zonas/barrios
  const btnNear = document.getElementById("btn-near");
  if (btnNear) {
    btnNear.addEventListener("click", requestGpsLocation);
  }
  const btnGpsInline = document.getElementById("btn-gps-inline");
  if (btnGpsInline) {
    btnGpsInline.addEventListener("click", requestGpsLocation);
  }
  const manualZoneSelect = document.getElementById("manual-zone");
  if (manualZoneSelect) {
    manualZoneSelect.addEventListener("change", e => applyManualZone(e.target.value));
  }
  $("#loc-banner-close")?.addEventListener("click", hideLocationBanner);

  $("#region-tabs")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-region]");
    if (!btn) return;
    const targetRegion = btn.dataset.region;
    if (state.region === targetRegion) return;
    state.region = targetRegion;
    state.barrio = null;
    state.visibleLimit = PAGE_SIZE;
    renderChips();
    renderList();
  });

  $("#chips")?.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    if ("openRanking" in b.dataset) {
      state.commTab = "ranking";
      switchView("community");
      return;
    }
    if ("now" in b.dataset) state.soloNow = !state.soloNow;
    else if ("fav" in b.dataset) state.soloFav = !state.soloFav;
    else state.barrio = state.barrio === b.dataset.barrio ? null : b.dataset.barrio;
    state.visibleLimit = PAGE_SIZE;
    renderChips();
    renderList();
  });

  // Botón superior de cuenta/perfil
  $("#header-user-btn")?.addEventListener("click", () => switchView("profile"));

  // Sub-pestañas de la vista Comunidad (Muro, Siguiendo, Ranking, Personas)
  $("#community-subtabs")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-comm-tab]");
    if (!btn) return;
    state.commTab = btn.dataset.commTab;
    renderCommunityView();
  });

  // Delegación de eventos en la vista Comunidad (publicar, apoyar, seguir usuario/parroquia, ver perfil/parroquia)
  $("#community-content")?.addEventListener("submit", e => {
    if (e.target && e.target.id === "social-post-form") {
      e.preventDefault();
      const me = requireAuth("publicar un mensaje");
      if (!me) return;
      const textEl = $("#social-post-text");
      const parishEl = $("#social-post-parish");
      const text = textEl ? textEl.value.trim() : "";
      if (!text) return;

      socialDB.posts.unshift({
        id: "post_" + Date.now(),
        author: me.username,
        parishId: parishEl ? parishEl.value : "",
        text,
        createdAt: Date.now(),
        likes: []
      });
      saveSocialDB();
      renderCommunityView();
      toast("Mensaje publicado en la comunidad");
    }
  });

  $("#community-content")?.addEventListener("click", e => {
    const goLogin = e.target.closest("[data-go-login]");
    if (goLogin) {
      switchView("profile");
      return;
    }
    const openUserBtn = e.target.closest("[data-open-user]");
    if (openUserBtn) {
      openPublicProfile(openUserBtn.dataset.openUser);
      return;
    }
    const followUserBtn = e.target.closest("[data-follow-user]");
    if (followUserBtn) {
      toggleFollowUser(followUserBtn.dataset.followUser);
      return;
    }
    const openParishBtn = e.target.closest("[data-open-parish]");
    if (openParishBtn) {
      openDetail(openParishBtn.dataset.openParish);
      return;
    }
    const followRankBtn = e.target.closest("[data-follow-parish-rank]");
    if (followRankBtn) {
      toggleFollowParish(followRankBtn.dataset.followParishRank);
      return;
    }
    const likeBtn = e.target.closest("[data-like-post]");
    if (likeBtn) {
      const me = requireAuth("apoyar una publicación");
      if (!me) return;
      const post = socialDB.posts.find(x => x.id === likeBtn.dataset.likePost);
      if (!post) return;
      if (!Array.isArray(post.likes)) post.likes = [];
      const idx = post.likes.indexOf(me.username);
      if (idx >= 0) post.likes.splice(idx, 1);
      else post.likes.push(me.username);
      saveSocialDB();
      renderCommunityView();
    }
  });

  // Delegación de eventos en la vista Perfil / Cuenta (Login, Registro, Demo, Editar Perfil)
  $("#profile-content")?.addEventListener("submit", e => {
    if (e.target && e.target.id === "user-auth-form") {
      e.preventDefault();
      const rawUser = ($("#u-username")?.value || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
      const pass = ($("#u-password")?.value || "").trim();
      const apodoInput = ($("#u-apodo")?.value || "").trim();
      if (!rawUser || !pass) return;

      const existing = socialDB.users[rawUser];
      if (existing) {
        if (existing.password && existing.password !== pass) {
          toast("Contraseña incorrecta para @" + rawUser);
          return;
        }
        socialDB.currentUser = rawUser;
        saveSocialDB();
        syncHeaderUserPill();
        renderProfileView();
        toast(`¡Hola de nuevo, ${existing.apodo}!`);
      } else {
        socialDB.users[rawUser] = {
          username: rawUser,
          password: pass,
          apodo: apodoInput || rawUser,
          bio: "Miembro de la comunidad parroquial en Buenos Aires.",
          avatarIcon: "✝️",
          avatarUrl: "",
          instagram: "",
          twitter: "",
          followingUsers: ["padre.tomas"],
          followedParishes: ["1"],
          joinedActivities: ["act_1_oracion"]
        };
        // @martina.recoleta y @padre.tomas siguen de bienvenida al nuevo usuario para que al seguirlos se forme la relación "Amigos"
        ["martina.recoleta", "padre.tomas"].forEach(seedHandle => {
          const seedU = socialDB.users[seedHandle];
          if (seedU && Array.isArray(seedU.followingUsers) && !seedU.followingUsers.includes(rawUser)) {
            seedU.followingUsers.push(rawUser);
          }
        });
        socialDB.currentUser = rawUser;
        saveSocialDB();
        syncHeaderUserPill();
        renderProfileView();
        toast(`¡Cuenta creada! Bienvenido/a, ${socialDB.users[rawUser].apodo}`);
      }
      return;
    }

    if (e.target && e.target.id === "profile-edit-form") {
      e.preventDefault();
      const me = getCurrentUserObj();
      if (!me) return;
      me.apodo = ($("#p-apodo")?.value || "").trim() || me.username;
      me.bio = ($("#p-bio")?.value || "").trim();
      me.avatarIcon = ($("#p-avatar-icon")?.value || "✝️").trim();
      me.avatarUrl = ($("#p-avatar-url")?.value || "").trim();
      me.instagram = ($("#p-ig")?.value || "").trim();
      me.twitter = ($("#p-tw")?.value || "").trim();
      saveSocialDB();
      syncHeaderUserPill();
      renderProfileView();
      toast("Perfil actualizado correctamente");
    }
  });

  $("#profile-content")?.addEventListener("click", e => {
    const demoBtn = e.target.closest("[data-demo-login]");
    if (demoBtn) {
      const handle = demoBtn.dataset.demoLogin;
      if (socialDB.users[handle]) {
        socialDB.currentUser = handle;
        saveSocialDB();
        syncHeaderUserPill();
        renderProfileView();
        toast(`Sesión iniciada como ${socialDB.users[handle].apodo}`);
      }
      return;
    }
    const logoutBtn = e.target.closest("#btn-user-logout");
    if (logoutBtn) {
      socialDB.currentUser = null;
      saveSocialDB();
      syncHeaderUserPill();
      renderProfileView();
      toast("Sesión comunitaria cerrada");
      return;
    }
    const pickIcon = e.target.closest("[data-pick-icon]");
    if (pickIcon) {
      const icon = pickIcon.dataset.pickIcon;
      const hiddenInput = $("#p-avatar-icon");
      if (hiddenInput) hiddenInput.value = icon;
      $$("#p-avatar-picker [data-pick-icon]").forEach(b => {
        b.classList.toggle("is-selected", b.dataset.pickIcon === icon);
      });
      return;
    }
    const openParishBtn = e.target.closest("[data-open-parish]");
    if (openParishBtn) {
      openDetail(openParishBtn.dataset.openParish);
    }
  });

  // Modal de Perfil Público de cualquier usuario
  $("#btn-close-pub-profile")?.addEventListener("click", closePublicProfileModal);
  $("#public-profile-body")?.addEventListener("click", e => {
    const followUserBtn = e.target.closest("[data-follow-user]");
    if (followUserBtn) {
      const targetHandle = followUserBtn.dataset.followUser;
      toggleFollowUser(targetHandle);
      openPublicProfile(targetHandle);
      return;
    }
    const openParishBtn = e.target.closest("[data-open-parish]");
    if (openParishBtn) {
      closePublicProfileModal();
      openDetail(openParishBtn.dataset.openParish);
    }
  });

  $("#btn-load-more")?.addEventListener("click", () => {
    state.visibleLimit += PAGE_SIZE;
    renderList();
  });

  if ("IntersectionObserver" in window && $("#list-sentinel")) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !$("#list-sentinel").hidden) {
          state.visibleLimit += PAGE_SIZE;
          renderList();
        }
      });
    }, { rootMargin: "220px" });
    observer.observe($("#list-sentinel"));
  }

  $("#list")?.addEventListener("click", e => {
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) return openParishEditor(editBtn.dataset.edit);
    const h = e.target.closest("[data-heart]");
    if (h) return toggleFav(h.dataset.heart);
    const c = e.target.closest("[data-id]");
    if (c) openDetail(c.dataset.id);
  });

  $("#d-fav")?.addEventListener("click", () => state.current && toggleFav(state.current.id));
  $("#d-edit")?.addEventListener("click", () => state.current && openParishEditor(state.current.id));
  $("#d-close")?.addEventListener("click", closeDetail);
  $("#scrim")?.addEventListener("click", closeDetail);

  // Eventos Modo Administrador
  $("#btn-admin-access")?.addEventListener("click", openAdminLoginModal);
  $("#btn-close-login")?.addEventListener("click", closeAdminLoginModal);
  $("#btn-cancel-login")?.addEventListener("click", closeAdminLoginModal);
  $("#admin-login-form")?.addEventListener("submit", handleAdminLoginSubmit);
  $("#btn-admin-logout")?.addEventListener("click", logoutAdmin);
  $("#btn-admin-add")?.addEventListener("click", () => openParishEditor(null));
  $("#fab-admin-add")?.addEventListener("click", () => openParishEditor(null));
  $("#btn-admin-export")?.addEventListener("click", exportUpdatedJson);
  $("#btn-close-edit")?.addEventListener("click", closeParishEditor);
  $("#btn-cancel-edit")?.addEventListener("click", closeParishEditor);
  $("#admin-edit-form")?.addEventListener("submit", saveParishEditor);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if ($("#public-profile-modal") && !$("#public-profile-modal").hidden) return closePublicProfileModal();
      if ($("#admin-edit-modal") && !$("#admin-edit-modal").hidden) return closeParishEditor();
      if ($("#admin-login-modal") && !$("#admin-login-modal").hidden) return closeAdminLoginModal();
      closeDetail();
    }
  });
}

function bootstrapApp() {
  if (appInitialized) return;
  appInitialized = true;
  bindAppEvents();
  syncAdminUI();
  syncHeaderUserPill();
  renderZoneSelector();
  renderChips();
  renderList();
  renderCommunityView();
  renderProfileView();
  loadParishes();
}

async function loadParishes() {
  const adminSaved = Store.get("parishes_admin_data", null);
  if (Array.isArray(adminSaved) && adminSaved.length > 0) {
    PARISHES = prepareDataset(adminSaved);
    if (state.userLoc) updateDistances(state.userLoc.lat, state.userLoc.lng);
    renderChips();
    renderList();
    return;
  }

  try {
    const res = await fetch(DATA_SOURCE_URL, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.parishes || []);
    if (list.length) {
      PARISHES = prepareDataset(list);
      Store.set("parishes_cache_v6", list);
      if (state.userLoc) {
        updateDistances(state.userLoc.lat, state.userLoc.lng);
      }
      renderChips();
      renderList();
    }
  } catch (err) {
    console.warn("Usando listado local de respaldo (sin conexión o error de red):", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrapApp);
if (document.readyState !== "loading") {
  bootstrapApp();
}

/* =====================================================================
   PWA: Registro y Actualización Inmediata del Service Worker
   ===================================================================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(reg => {
      reg.update();
    }).catch(err => {
      console.warn("No se pudo registrar el Service Worker:", err);
    });
  });
}
