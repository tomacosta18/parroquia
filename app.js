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

// Íconos SVG de personas para el Indicador de Concurrencia (1 verde = vacío, 2 amarillas = medio, 3 rojas = lleno)
const SVG_PEOPLE_1 = `<svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><circle cx="9" cy="5.2" r="3"/><path d="M3.8 15.5c0-2.9 2.3-4.8 5.2-4.8s5.2 1.9 5.2 4.8v.7H3.8v-.7z"/></svg>`;
const SVG_PEOPLE_2 = `<svg viewBox="0 0 28 18" fill="currentColor" aria-hidden="true"><circle cx="9.2" cy="5.2" r="2.9"/><path d="M4.2 15.5c0-2.7 2.2-4.6 5-4.6s5 1.9 5 4.6v.7H4.2v-.7z"/><circle cx="19" cy="5.2" r="2.9"/><path d="M14 15.5c0-2.7 2.2-4.6 5-4.6s5 1.9 5 4.6v.7H14v-.7z"/></svg>`;
const SVG_PEOPLE_3 = `<svg viewBox="0 0 36 18" fill="currentColor" aria-hidden="true"><circle cx="7.5" cy="5.5" r="2.6"/><path d="M3 15.6c0-2.4 2-4.2 4.5-4.2s4.5 1.8 4.5 4.2v.6H3v-.6z"/><circle cx="18" cy="4.8" r="2.9"/><path d="M13 15.6c0-2.8 2.2-4.7 5-4.7s5 1.9 5 4.7v.6H13v-.6z"/><circle cx="28.5" cy="5.5" r="2.6"/><path d="M24 15.6c0-2.4 2-4.2 4.5-4.2s4.5 1.8 4.5 4.2v.6h-9v-.6z"/></svg>`;

const CROWD_LEVELS = {
  tranquilo: {
    id: "tranquilo",
    label: "Vacío / Tranquilo",
    short: "Vacío",
    svg: SVG_PEOPLE_1,
    color: "#10B981"
  },
  moderado: {
    id: "moderado",
    label: "Medio / Moderado",
    short: "Medio",
    svg: SVG_PEOPLE_2,
    color: "#D97706"
  },
  lleno: {
    id: "lleno",
    label: "Lleno",
    short: "Lleno",
    svg: SVG_PEOPLE_3,
    color: "#EF4444"
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
  const t = norm(tipo);
  if (t === "catedral") return "catedral";
  if (t === "basilica") return "basilica";
  if (t === "capilla") return "capilla";
  return "parroquia";
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
  view: "list", // 'list' | 'map' | 'spiritual' | 'liturgy' | 'community' | 'profile'
  commTab: "all", // 'all' | 'following' | 'ranking' | 'people'
  spirTab: "streak", // 'streak' | 'notes' | 'stats'
  checkinSlot: "Mañana", // 'Mañana' | 'Tarde' | 'Noche'
  editingNoteId: null,
  liturgyDate: new Date().toISOString().slice(0, 10),
  liturgyExplainOpen: false,
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
   Navegación por Pestañas (Templos, Mapa, Racha/Notas, Liturgia, Comunidad y Perfil)
   ===================================================================== */
function switchView(targetView) {
  const validViews = ["list", "map", "spiritual", "liturgy", "community", "profile"];
  if (!validViews.includes(targetView)) return;
  state.view = targetView;
  document.body.setAttribute("data-active-view", targetView);

  const panels = {
    list: $("#view-list"),
    map: $("#view-map"),
    spiritual: $("#view-spiritual"),
    liturgy: $("#view-liturgy"),
    community: $("#view-community"),
    profile: $("#view-profile")
  };
  const tabs = {
    list: $("#tab-list"),
    map: $("#tab-map"),
    spiritual: $("#tab-spiritual"),
    liturgy: $("#tab-liturgy"),
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
  } else if (targetView === "spiritual") {
    renderSpiritualView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (targetView === "liturgy") {
    renderLiturgyView();
    window.scrollTo({ top: 0, behavior: "smooth" });
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

function getDefaultBaseVotes(parishId, serviceHour) {
  const seed = (Number(parishId) || 1) * 7 + (toMinutes(serviceHour) || 540);
  const mins = toMinutes(serviceHour) || 600;
  // Misas centrales de la mañana/tarde suelen tener más concurrencia inicial simulada
  if (mins >= 630 && mins <= 760) {
    return { tranquilo: 2 + (seed % 3), moderado: 5 + (seed % 4), lleno: 3 + (seed % 3) };
  }
  if (mins >= 1110 && mins <= 1200) {
    return { tranquilo: 3 + (seed % 2), moderado: 6 + (seed % 4), lleno: 2 + (seed % 3) };
  }
  return { tranquilo: 5 + (seed % 4), moderado: 3 + (seed % 3), lleno: 1 + (seed % 2) };
}

function getCrowdStatus(parishId, serviceHour) {
  const crowdMap = loadCrowdMap();
  const key = buildCrowdKey(parishId, serviceHour);
  if (crowdMap[key] && CROWD_LEVELS[crowdMap[key].level]) {
    return crowdMap[key];
  }
  return null;
}

function getCrowdVotesBreakdown(parishId, serviceHour) {
  const slot = String(serviceHour || "general").trim();
  const base = getDefaultBaseVotes(parishId, slot);
  const record = getCrowdStatus(parishId, slot);
  const votes = record && record.votes
    ? {
        tranquilo: Number(record.votes.tranquilo) || 0,
        moderado: Number(record.votes.moderado) || 0,
        lleno: Number(record.votes.lleno) || 0
      }
    : { ...base };

  const total = Math.max(1, votes.tranquilo + votes.moderado + votes.lleno);
  const pct = {
    tranquilo: Math.round((votes.tranquilo / total) * 100),
    moderado: Math.round((votes.moderado / total) * 100),
    lleno: Math.round((votes.lleno / total) * 100)
  };
  return { votes, total, pct, hasUserReport: Boolean(record) };
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
  const existing = crowdMap[key];
  const base = getDefaultBaseVotes(parishId, slot);

  const votes = existing && existing.votes
    ? { ...existing.votes }
    : { ...base };

  // Si el usuario ya había votado en esta sesión, ajusta el voto anterior antes de sumar el nuevo
  if (existing && existing.lastUserVote && votes[existing.lastUserVote] > 0) {
    votes[existing.lastUserVote] = Math.max(0, votes[existing.lastUserVote] - 1);
  }
  votes[level] = (votes[level] || 0) + 1;

  const record = {
    parishId: String(parishId),
    serviceHour: slot,
    dateKey: getTodayDateKey(),
    level,
    lastUserVote: level,
    votes,
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
  return `<span class="crowd-badge ${cfg.id}" title="Concurrencia comunitaria reportada">${cfg.svg}<span>${cfg.short}${slotNote}</span></span>`;
}

/* =====================================================================
   Inicialización del Mapa (100% OpenStreetMap Libre + Marcadores Jerárquicos)
   ===================================================================== */
let map = null;
let markersLayer = null;
let userMarker = null;
const markerById = new Map();

// 1. Capilla: Cruz minimalista fina
const SVG_PIN_CAPILLA = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 6v12M8.5 10.2h7"/>
  </svg>`;

// 2. Parroquia: Cruz parroquial clásica con base
const SVG_PIN_PARROQUIA = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 4.5v14M7.8 9.2h8.4M9.5 18.5h5"/>
  </svg>`;

// 3. Basílica: Cruz central ornamentada con corona de laureles a izquierda y derecha
const SVG_PIN_BASILICA = `
  <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 8.5v16M13.5 13.5h9" stroke-width="2.3"/>
    <path d="M14.5 27.5c-4.8-1.8-7.5-6.2-7.5-11.2 0-3.8 1.8-7.2 4.6-9.2" stroke-width="1.6"/>
    <path d="M21.5 27.5c4.8-1.8 7.5-6.2 7.5-11.2 0-3.8-1.8-7.2-4.6-9.2" stroke-width="1.6"/>
    <path d="M7.2 17.5l2.3-1.2M7.8 13.5l2.4-.7M9.6 10l2.2-.2M8.8 21.5l2.4-1.5" stroke-width="1.5"/>
    <path d="M28.8 17.5l-2.3-1.2M28.2 13.5l-2.4-.7M26.4 10l-2.2-.2M27.2 21.5l-2.4-1.5" stroke-width="1.5"/>
    <path d="M15.5 27.8h5" stroke-width="1.8"/>
  </svg>`;

// 4. Catedral: Paleta elegante bordo (#6E1420) y crema (#FAF3E0) con silueta minimalista y estilizada de mitra/solideo episcopal
const SVG_PIN_CATEDRAL = `
  <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <!-- Casquete / solideo y mitra episcopal estilizada en crema -->
    <path d="M18 4.8L9.6 14.8C9.6 18.2 12.4 20.8 18 20.8C23.6 20.8 26.4 18.2 26.4 14.8L18 4.8Z" fill="#FAF3E0" stroke="#FAF3E0" stroke-width="1.3" stroke-linejoin="round"/>
    <!-- Galón horizontal (circulus) y vertical (titulus) en bordo -->
    <path d="M10.4 17.6H25.6" stroke="#6E1420" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M18 6.8V20.4" stroke="#6E1420" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Cruz episcopal minimalista en el centro -->
    <path d="M15.4 12.8H20.6" stroke="#6E1420" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Ínfulas estilizadas (cintas posteriores de la mitra) -->
    <path d="M13.6 20.8L11.8 29.2L14.5 27.6L16.1 29.4L16.7 20.8" fill="#FAF3E0"/>
    <path d="M22.4 20.8L24.2 29.2L21.5 27.6L19.9 29.4L19.3 20.8" fill="#FAF3E0"/>
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
  const t = norm(p.tipo);
  let size = 36;
  let cls = "pin-wrap parroquia";
  let innerHtml = SVG_PIN_PARROQUIA;

  if (t === "catedral") {
    size = 46;
    cls = "pin-wrap catedral";
    innerHtml = SVG_PIN_CATEDRAL;
  } else if (t === "basilica") {
    size = 44;
    cls = "pin-wrap basilica";
    innerHtml = SVG_PIN_BASILICA;
  } else if (t === "capilla") {
    size = 30;
    cls = "pin-wrap capilla";
    innerHtml = SVG_PIN_CAPILLA;
  }

  return L.divIcon({
    className: "custom-pin-icon",
    html: `<div class="${cls}" title="${p.tipo}: ${p.nombre}">${innerHtml}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)]
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
            ? `<span class="h-dot" style="color:${CROWD_LEVELS[crowd.level].color}" aria-hidden="true">${CROWD_LEVELS[crowd.level].svg}</span>`
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
  const breakdown = getCrowdVotesBreakdown(p.id, activeSlot);

  let metaText = "Tocá una opción para votar cómo está el templo en este horario.";
  if (currentCrowd && CROWD_LEVELS[currentLevel]) {
    const authorNote = currentCrowd.byAdmin ? " · Verificado por Admin" : " · Tu voto fue registrado";
    metaText = `Estado actual: ${CROWD_LEVELS[currentLevel].label} (${formatRelativeMinutes(currentCrowd.updatedAt)}${authorNote})`;
  }

  return `
    <div class="block" id="misas-block">
      <h3>Horarios de Misa</h3>
      ${rows}
      <div class="crowd-widget" id="crowd-widget" aria-label="Indicador de concurrencia comunitario">
        <div class="crowd-head">
          <span class="crowd-title">Concurrencia por horario</span>
          <span class="crowd-slot-badge" id="crowd-slot-badge">${slotLabel}</span>
        </div>
        <p class="crowd-sub">Seleccioná un horario arriba y votá con un toque el nivel de ocupación actual:</p>
        <div class="crowd-buttons" role="group" aria-label="Votar nivel de concurrencia">
          <button type="button" class="crowd-btn tranquilo" data-crowd-level="tranquilo" aria-pressed="${currentLevel === "tranquilo"}">
            <span class="crowd-btn-top">
              <span class="crowd-people-icon">${SVG_PEOPLE_1}</span>
              <span>Vacío</span>
            </span>
            <small style="font-size:.7rem;opacity:.85">Tranquilo (${breakdown.votes.tranquilo})</small>
          </button>
          <button type="button" class="crowd-btn moderado" data-crowd-level="moderado" aria-pressed="${currentLevel === "moderado"}">
            <span class="crowd-btn-top">
              <span class="crowd-people-icon">${SVG_PEOPLE_2}</span>
              <span>Medio</span>
            </span>
            <small style="font-size:.7rem;opacity:.85">Moderado (${breakdown.votes.moderado})</small>
          </button>
          <button type="button" class="crowd-btn lleno" data-crowd-level="lleno" aria-pressed="${currentLevel === "lleno"}">
            <span class="crowd-btn-top">
              <span class="crowd-people-icon">${SVG_PEOPLE_3}</span>
              <span>Lleno</span>
            </span>
            <small style="font-size:.7rem;opacity:.85">Colmado (${breakdown.votes.lleno})</small>
          </button>
        </div>

        <div class="crowd-breakdown" aria-label="Desglose de votos de usuarios para ${slotLabel}">
          <div class="crowd-breakdown-head">
            <span>Desglose de votos · <strong>${slotLabel}</strong></span>
            <span>${breakdown.total} ${breakdown.total === 1 ? "voto" : "votos"}</span>
          </div>
          <div class="crowd-bar-row">
            <span class="crowd-bar-label" style="color:#065F46">${SVG_PEOPLE_1}<span>1 pers. (Vacío)</span></span>
            <div class="crowd-bar-track"><div class="crowd-bar-fill tranquilo" style="width:${breakdown.pct.tranquilo}%"></div></div>
            <span class="crowd-bar-count">${breakdown.votes.tranquilo} (${breakdown.pct.tranquilo}%)</span>
          </div>
          <div class="crowd-bar-row">
            <span class="crowd-bar-label" style="color:#854D0E">${SVG_PEOPLE_2}<span>2 pers. (Medio)</span></span>
            <div class="crowd-bar-track"><div class="crowd-bar-fill moderado" style="width:${breakdown.pct.moderado}%"></div></div>
            <span class="crowd-bar-count">${breakdown.votes.moderado} (${breakdown.pct.moderado}%)</span>
          </div>
          <div class="crowd-bar-row">
            <span class="crowd-bar-label" style="color:#991B1B">${SVG_PEOPLE_3}<span>3 pers. (Lleno)</span></span>
            <div class="crowd-bar-track"><div class="crowd-bar-fill lleno" style="width:${breakdown.pct.lleno}%"></div></div>
            <span class="crowd-bar-count">${breakdown.votes.lleno} (${breakdown.pct.lleno}%)</span>
          </div>
        </div>

        <div class="crowd-meta">
          <span id="crowd-meta-text">${metaText}</span>
          ${currentCrowd ? `<button type="button" class="crowd-clear-btn" id="btn-clear-crowd">Restablecer mi voto</button>` : ""}
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

/* --- Sistema de Avatares: Subida Base64 desde Dispositivo y Creador Estilo Mii (SVG) --- */
const MII_SKINS = [
  { id: "#FDE2C8", label: "Clara" },
  { id: "#F5CBA7", label: "Trigueña" },
  { id: "#E0AC69", label: "Bronceada" },
  { id: "#C68642", label: "Morena" },
  { id: "#8D5524", label: "Oscura" }
];

const MII_HAIR_COLORS = [
  { id: "#2C1B18", label: "Negro" },
  { id: "#6E473B", label: "Castaño" },
  { id: "#D4AF37", label: "Rubio" },
  { id: "#A93226", label: "Cobrizo" },
  { id: "#7F8C8D", label: "Canoso" }
];

const MII_BG_COLORS = [
  { id: "#DBEAFE", shirt: "#2563EB", label: "Azul" },
  { id: "#F3E8FF", shirt: "#8E44AD", label: "Morado" },
  { id: "#DCFCE7", shirt: "#16A34A", label: "Verde" },
  { id: "#FEF3C7", shirt: "#D97706", label: "Dorado" },
  { id: "#FFE4E6", shirt: "#E11D48", label: "Coral" }
];

const MII_HAIRS = [
  { id: "corto", label: "Corto" },
  { id: "raya", label: "Con raya" },
  { id: "rulos", label: "Rulos" },
  { id: "largo", label: "Largo" },
  { id: "solideo", label: "Solideo" }
];

const MII_FACES = [
  { id: "sonrisa", label: "Sonrisa" },
  { id: "alegre", label: "Alegre" },
  { id: "sereno", label: "Sereno" },
  { id: "lentes", label: "Con lentes" },
  { id: "guino", label: "Guiño" }
];

const DEFAULT_MII_CONFIG = {
  skin: "#F5CBA7",
  hair: "corto",
  hairColor: "#2C1B18",
  face: "sonrisa",
  bg: "#DBEAFE"
};

function generateMiiSvgDataUrl(rawCfg) {
  const cfg = { ...DEFAULT_MII_CONFIG, ...(rawCfg || {}) };
  const bgObj = MII_BG_COLORS.find(b => b.id === cfg.bg) || MII_BG_COLORS[0];
  const shirtColor = bgObj.shirt;

  let hairBack = "";
  let hairFront = "";
  if (cfg.hair === "largo") {
    hairBack = `<path d="M26 46c-3 12-3 28 2 38h44c5-10 5-26 2-38z" fill="${cfg.hairColor}"/>`;
    hairFront = `<path d="M27 42c0-15 10-24 23-24s23 9 23 24c-4-6-12-10-23-10s-19 4-23 10z" fill="${cfg.hairColor}"/>`;
  } else if (cfg.hair === "rulos") {
    hairFront = `
      <circle cx="32" cy="30" r="9" fill="${cfg.hairColor}"/>
      <circle cx="43" cy="24" r="10" fill="${cfg.hairColor}"/>
      <circle cx="57" cy="24" r="10" fill="${cfg.hairColor}"/>
      <circle cx="68" cy="30" r="9" fill="${cfg.hairColor}"/>
      <circle cx="28" cy="40" r="7" fill="${cfg.hairColor}"/>
      <circle cx="72" cy="40" r="7" fill="${cfg.hairColor}"/>`;
  } else if (cfg.hair === "raya") {
    hairFront = `<path d="M27 44c0-16 10-25 23-25s23 9 23 25c-3-8-14-12-28-9-7 1-14 5-18 9z" fill="${cfg.hairColor}"/>`;
  } else if (cfg.hair === "solideo") {
    hairFront = `
      <path d="M28 41c0-13 10-21 22-21s22 8 22 21c-4-5-12-8-22-8s-18 3-22 8z" fill="${cfg.hairColor}"/>
      <path d="M33 27c3-7 9-10 17-10s14 3 17 10H33z" fill="#8E44AD" stroke="#FFFFFF" stroke-width="1.5"/>`;
  } else {
    // corto
    hairFront = `<path d="M28 42c0-15 10-23 22-23s22 8 22 23c-5-6-13-9-22-9s-17 3-22 9z" fill="${cfg.hairColor}"/>`;
  }

  let eyesAndMouth = "";
  if (cfg.face === "alegre") {
    eyesAndMouth = `
      <circle cx="41" cy="48" r="2.6" fill="#1F2937"/>
      <circle cx="59" cy="48" r="2.6" fill="#1F2937"/>
      <path d="M38 42c2-2 5-2 7 0M55 42c2-2 5-2 7 0" stroke="#1F2937" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <path d="M41 57c3 5 15 5 18 0z" fill="#E11D48"/>`;
  } else if (cfg.face === "sereno") {
    eyesAndMouth = `
      <path d="M38 48c2 2 5 2 7 0M55 48c2 2 5 2 7 0" stroke="#1F2937" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M44 58c4 2 8 2 12 0" stroke="#1F2937" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  } else if (cfg.face === "lentes") {
    eyesAndMouth = `
      <rect x="34" y="44" width="12" height="9" rx="3" fill="none" stroke="#1F2937" stroke-width="2"/>
      <rect x="54" y="44" width="12" height="9" rx="3" fill="none" stroke="#1F2937" stroke-width="2"/>
      <path d="M46 48h8" stroke="#1F2937" stroke-width="2"/>
      <circle cx="40" cy="48.5" r="2" fill="#1F2937"/>
      <circle cx="60" cy="48.5" r="2" fill="#1F2937"/>
      <path d="M43 58c4 3 10 3 14 0" stroke="#1F2937" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  } else if (cfg.face === "guino") {
    eyesAndMouth = `
      <path d="M38 48c2-2 5-2 7 0" stroke="#1F2937" stroke-width="2.3" stroke-linecap="round" fill="none"/>
      <circle cx="59" cy="48" r="2.6" fill="#1F2937"/>
      <path d="M42 57c4 4 12 4 16 0" stroke="#1F2937" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
  } else {
    // sonrisa
    eyesAndMouth = `
      <circle cx="41" cy="48" r="2.5" fill="#1F2937"/>
      <circle cx="59" cy="48" r="2.5" fill="#1F2937"/>
      <path d="M42 57c4 4 12 4 16 0" stroke="#1F2937" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="50" fill="${cfg.bg}"/>
    ${hairBack}
    <path d="M22 96c3-16 14-24 28-24s25 8 28 24H22z" fill="${shirtColor}"/>
    <path d="M43 66h14v10H43z" fill="${cfg.skin}"/>
    <circle cx="28" cy="50" r="4.5" fill="${cfg.skin}"/>
    <circle cx="72" cy="50" r="4.5" fill="${cfg.skin}"/>
    <ellipse cx="50" cy="48" rx="21" ry="22" fill="${cfg.skin}"/>
    ${hairFront}
    ${eyesAndMouth}
  </svg>`;

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function resizeImageFileToBase64(file, maxSize = 160) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Archivo de imagen inválido"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo procesar la imagen"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxSize) {
            h = Math.round((h * maxSize) / w);
            w = maxSize;
          }
        } else if (h > maxSize) {
          w = Math.round((w * maxSize) / h);
          h = maxSize;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderAvatarContent(user) {
  if (!user) return "👤";
  const url = (user.avatarUrl || "").trim();
  if (url && (/^https?:\/\//i.test(url) || url.startsWith("data:image/"))) {
    return `<img src="${url}" alt="${user.apodo || user.username}" loading="lazy">`;
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

/* --- Seguimiento de Actividades y Grupos Parroquiales con Contador de Seguidores --- */
function isCurrentUserInActivity(activityId) {
  const me = getCurrentUserObj();
  if (!me || !Array.isArray(me.joinedActivities)) return false;
  return me.joinedActivities.includes(String(activityId));
}

function getActivityFollowersCount(activityId) {
  const aid = String(activityId || "");
  let hash = 0;
  for (let i = 0; i < aid.length; i++) {
    hash = (hash * 31 + aid.charCodeAt(i)) % 97;
  }
  const baseCount = 18 + (hash % 42);
  let membersCount = 0;
  Object.values(socialDB.users).forEach(u => {
    if (Array.isArray(u.joinedActivities) && u.joinedActivities.includes(aid)) {
      membersCount++;
    }
  });
  return baseCount + membersCount;
}

function findActivityById(activityId) {
  for (let i = 0; i < PARISHES.length; i++) {
    const acts = getParishActivities(PARISHES[i]);
    const match = acts.find(a => a.id === activityId);
    if (match) return match;
  }
  return null;
}

function getAllParishActivitiesFlat() {
  const list = [];
  PARISHES.forEach(p => {
    const acts = getParishActivities(p);
    acts.forEach(a => {
      list.push({
        ...a,
        parishId: String(p.id),
        parishName: p.nombre,
        barrio: p.barrio,
        region: p._region || inferRegion(p)
      });
    });
  });
  return list;
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
  if (state.view === "community" && state.commTab === "people") {
    const dirResults = $("#comm-dir-results");
    if (dirResults) dirResults.innerHTML = renderPeopleDirectoryResultsHtml();
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
    const followersCount = getActivityFollowersCount(act.id);
    const igUrl = normalizeSocialHandleUrl(act.instagram, "instagram");
    return `
      <div class="activity-card">
        <div class="activity-top">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span class="activity-cat">${act.categoria}</span>
            <span class="activity-followers-pill" title="Seguidores de este grupo parroquial">👥 ${followersCount} seguidores</span>
          </div>
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

/* --- Renderizado de la Vista Comunidad (Feed Twitter + Ranking + Buscador de Usuarios y Grupos) --- */
let commSearchQuery = "";
let commSearchScope = "all"; // 'all' | 'users' | 'groups' | 'friends'

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
      Seguí a más miembros en la pestaña "Buscar Usuarios y Grupos" o publicá el primer mensaje.
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

function renderPeopleDirectoryResultsHtml() {
  const me = getCurrentUserObj();
  const q = norm(commSearchQuery);
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  const showUsers = commSearchScope === "all" || commSearchScope === "users" || commSearchScope === "friends";
  const showGroups = commSearchScope === "all" || commSearchScope === "groups";

  let usersList = Object.values(socialDB.users);
  if (commSearchScope === "friends") {
    usersList = me ? usersList.filter(u => areFriends(me.username, u.username)) : [];
  }
  if (tokens.length) {
    usersList = usersList.filter(u => {
      const hay = norm(`${u.apodo} ${u.username} ${u.bio || ""} ${u.instagram || ""}`);
      return tokens.every(t => hay.includes(t));
    });
  }

  let groupsList = [];
  if (showGroups) {
    const allGroups = getAllParishActivitiesFlat();
    groupsList = tokens.length
      ? allGroups.filter(g => {
          const hay = norm(`${g.nombre} ${g.categoria} ${g.parishName} ${g.barrio} ${g.region} ${g.instagram || ""}`);
          return tokens.every(t => hay.includes(t));
        })
      : allGroups.slice(0, 12); // Muestra los 12 grupos destacados por defecto o todos al buscar
  }

  const usersHtml = showUsers && usersList.length
    ? `
      <div class="comm-dir-heading">👤 Usuarios de la Comunidad (${usersList.length})</div>
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
      }).join("")}`
    : "";

  const groupsHtml = showGroups && groupsList.length
    ? `
      <div class="comm-dir-heading">🙌 Grupos y Actividades Parroquiales (${groupsList.length})</div>
      ${groupsList.map(act => {
        const joined = isCurrentUserInActivity(act.id);
        const followersCount = getActivityFollowersCount(act.id);
        const igUrl = normalizeSocialHandleUrl(act.instagram, "instagram");
        return `
          <div class="activity-card" style="background:var(--surface)">
            <div class="activity-top">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                <span class="activity-cat">${act.categoria}</span>
                <span class="activity-followers-pill">👥 ${followersCount} seguidores</span>
              </div>
              <small style="color:var(--muted);font-weight:600">${act.horario || ""}</small>
            </div>
            <h4>${act.nombre}</h4>
            <p class="activity-desc" style="margin-bottom:6px">${act.descripcion}</p>
            <button type="button" class="post-parish-tag" data-open-parish="${act.parishId}" style="margin-bottom:8px">
              ⛪ ${act.parishName} (${act.barrio})
            </button>
            <div class="activity-foot">
              ${igUrl ? `<a class="activity-ig" href="${igUrl}" target="_blank" rel="noopener noreferrer">📸 ${act.instagram}</a>` : `<span></span>`}
              <button type="button" class="btn-follow-activity ${joined ? "is-joined" : ""}" data-follow-activity="${act.id}">
                ${joined ? "Participando ✓" : "+ Seguir Actividad"}
              </button>
            </div>
          </div>`;
      }).join("")}`
    : "";

  if (!usersHtml && !groupsHtml) {
    return `
      <div class="empty">
        <strong>Sin resultados para tu búsqueda</strong>
        Probá buscando por apodo, @usuario, coro, oración, catequesis, misiones o nombre de parroquia.
      </div>`;
  }

  return `<div class="feed-list">${usersHtml}${groupsHtml}</div>`;
}

function renderPeopleDirectoryHtml() {
  return `
    <div class="comm-search-wrap">
      <div class="comm-search-input-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
        </svg>
        <input type="search" id="comm-search-input" class="comm-search-input"
          value="${commSearchQuery.replace(/"/g, "&quot;")}"
          placeholder="Buscar usuarios (@apodo) o grupos (coro, oración, misiones…)"
          autocomplete="off">
      </div>
      <div class="comm-filter-pills" role="group" aria-label="Filtrar directorio comunitario">
        <button type="button" class="comm-filter-pill ${commSearchScope === "all" ? "is-active" : ""}" data-comm-scope="all">Todos</button>
        <button type="button" class="comm-filter-pill ${commSearchScope === "users" ? "is-active" : ""}" data-comm-scope="users">👤 Usuarios</button>
        <button type="button" class="comm-filter-pill ${commSearchScope === "groups" ? "is-active" : ""}" data-comm-scope="groups">🙌 Grupos Parroquiales</button>
        <button type="button" class="comm-filter-pill ${commSearchScope === "friends" ? "is-active" : ""}" data-comm-scope="friends">🤝 Mis Amigos</button>
      </div>
    </div>
    <div id="comm-dir-results">
      ${renderPeopleDirectoryResultsHtml()}
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

let draftMiiConfig = { ...DEFAULT_MII_CONFIG };

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

  draftMiiConfig = { ...DEFAULT_MII_CONFIG, ...(me.miiConfig || {}) };
  const miiPreviewUrl = generateMiiSvgDataUrl(draftMiiConfig);
  const currentIcon = me.avatarIcon || "✝️";
  const hasCustomPhoto = Boolean(me.avatarUrl && me.avatarUrl.trim());

  container.innerHTML = `
    ${renderUserPublicCardHtml(me, true)}

    <div class="profile-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <h3 style="font-size:1.05rem;font-weight:600">Editar Mi Perfil y Avatar</h3>
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

        <!-- 1. Subida de Foto desde el Dispositivo (Base64) -->
        <div class="form-field">
          <label>Subir foto desde tu dispositivo (guardada en Base64 local)</label>
          <div class="avatar-upload-box">
            <label for="p-avatar-file" class="btn-upload-file">
              📷 Elegir foto del dispositivo
            </label>
            <input id="p-avatar-file" type="file" accept="image/*" hidden>
            ${hasCustomPhoto ? `<button type="button" class="btn-clear-photo" id="btn-clear-avatar-photo">Quitar foto / Usar ícono</button>` : ""}
            <small style="color:var(--muted);font-size:.75rem">Se optimiza automáticamente para almacenamiento local.</small>
          </div>
        </div>

        <!-- 2. Creador de Avatares Estilo Mii Interactivo -->
        <div class="form-field">
          <label>Creador de Avatar Estilo Mii</label>
          <div class="mii-creator-box" id="mii-creator-box">
            <div class="mii-creator-top">
              <div class="mii-stage" id="mii-stage">
                <img id="mii-stage-img" src="${miiPreviewUrl}" alt="Vista previa de tu Avatar Mii">
              </div>
              <div class="mii-creator-info">
                <h4>Diseñá tu personaje Mii</h4>
                <p>Combiná peinados, expresiones, tono de piel y colores. Al terminar, aplicalo a tu perfil con un toque.</p>
                <button type="button" class="btn-apply-mii" id="btn-apply-mii">✨ Usar este Mii como foto de perfil</button>
              </div>
            </div>

            <div class="mii-controls">
              <div class="mii-row">
                <span class="mii-row-label">Peinado</span>
                <div class="mii-options">
                  ${MII_HAIRS.map(h => `
                    <button type="button" class="mii-chip ${draftMiiConfig.hair === h.id ? "is-selected" : ""}" data-mii-prop="hair" data-mii-val="${h.id}">${h.label}</button>
                  `).join("")}
                </div>
              </div>
              <div class="mii-row">
                <span class="mii-row-label">Rostro</span>
                <div class="mii-options">
                  ${MII_FACES.map(f => `
                    <button type="button" class="mii-chip ${draftMiiConfig.face === f.id ? "is-selected" : ""}" data-mii-prop="face" data-mii-val="${f.id}">${f.label}</button>
                  `).join("")}
                </div>
              </div>
              <div class="mii-row">
                <span class="mii-row-label">Tono de piel</span>
                <div class="mii-options">
                  ${MII_SKINS.map(s => `
                    <button type="button" class="mii-swatch ${draftMiiConfig.skin === s.id ? "is-selected" : ""}" style="background:${s.id}" data-mii-prop="skin" data-mii-val="${s.id}" title="Piel: ${s.label}" aria-label="Piel ${s.label}"></button>
                  `).join("")}
                </div>
              </div>
              <div class="mii-row">
                <span class="mii-row-label">Color pelo</span>
                <div class="mii-options">
                  ${MII_HAIR_COLORS.map(c => `
                    <button type="button" class="mii-swatch ${draftMiiConfig.hairColor === c.id ? "is-selected" : ""}" style="background:${c.id}" data-mii-prop="hairColor" data-mii-val="${c.id}" title="Pelo: ${c.label}" aria-label="Pelo ${c.label}"></button>
                  `).join("")}
                </div>
              </div>
              <div class="mii-row">
                <span class="mii-row-label">Fondo y ropa</span>
                <div class="mii-options">
                  ${MII_BG_COLORS.map(b => `
                    <button type="button" class="mii-swatch ${draftMiiConfig.bg === b.id ? "is-selected" : ""}" style="background:${b.shirt}" data-mii-prop="bg" data-mii-val="${b.id}" title="Color: ${b.label}" aria-label="Color ${b.label}"></button>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Selector de Ícono o URL externa -->
        <div class="form-field">
          <label>O elegí un ícono rápido</label>
          <input type="hidden" id="p-avatar-icon" value="${currentIcon}">
          <div class="avatar-picker" id="p-avatar-picker">
            ${AVATAR_PRESETS.map(ic => `
              <button type="button" class="avatar-opt ${ic === currentIcon ? "is-selected" : ""}" data-pick-icon="${ic}">${ic}</button>
            `).join("")}
          </div>
        </div>
        <div class="form-field">
          <label for="p-avatar-url">URL o Datos de imagen activa (opcional)</label>
          <input id="p-avatar-url" type="text" value="${me.avatarUrl || ""}" placeholder="https://... o Base64 / Mii generado">
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

/* =====================================================================
   Módulo de Notas, Racha Espiritual y Estadísticas (localStorage)
   ===================================================================== */
const SPIRITUAL_STORAGE_KEY = "spiritual_module_v1";

const ACTIVITY_POINTS = {
  misa_finde: 5,  // +5 pts por Misa de fin de semana (sábado tarde/noche o domingo)
  adoracion: 3,   // +3 pts por Adoración Eucarística
  misa_semana: 1  // +1 pt por Misa de semana
};

const ACTIVITY_MINUTES = {
  misa_finde: 60,  // Misa = 60 min
  misa_semana: 60, // Misa = 60 min
  adoracion: 90    // Adoración = 90 min
};

const ACTIVITY_LABELS = {
  misa_finde: "Misa de fin de semana (Sáb tarde / Dom)",
  adoracion: "Adoración Eucarística",
  misa_semana: "Misa de semana"
};

function getTodayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysIso(isoDateStr, deltaDays) {
  const parts = String(isoDateStr).split("-").map(Number);
  const dt = new Date(parts[0] || 2026, (parts[1] || 1) - 1, parts[2] || 1, 12, 0, 0);
  dt.setDate(dt.getDate() + deltaDays);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Devuelve la fecha ISO (YYYY-MM-DD) del domingo correspondiente a la semana de una fecha dada (Lunes a Domingo)
function getSundayOfWeekIso(isoDateStr) {
  const parts = String(isoDateStr).split("-").map(Number);
  const dt = new Date(parts[0] || 2026, (parts[1] || 1) - 1, parts[2] || 1, 12, 0, 0);
  const day = dt.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const diffToSunday = day === 0 ? 0 : 7 - day;
  dt.setDate(dt.getDate() + diffToSunday);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildInitialSpiritualDB() {
  const today = getTodayIsoDate();
  const currentSunday = getSundayOfWeekIso(today);
  const prevSun1 = addDaysIso(currentSunday, -7);
  const prevSat1 = addDaysIso(prevSun1, -1);
  const prevThu1 = addDaysIso(prevSun1, -3);
  const prevSun2 = addDaysIso(currentSunday, -14);
  const prevWed2 = addDaysIso(prevSun2, -4);
  const prevSun3 = addDaysIso(currentSunday, -21);
  const thisWeekTue = addDaysIso(currentSunday, -5);
  const thisWeekThu = addDaysIso(currentSunday, -3);

  return {
    lastParishId: "1",
    checkins: [
      {
        id: "chk_seed_1",
        date: prevSun3,
        type: "misa_finde",
        slot: "Mañana",
        parishId: "1",
        createdAt: Date.now() - 86400000 * 21
      },
      {
        id: "chk_seed_2",
        date: prevWed2,
        type: "misa_semana",
        slot: "Tarde",
        parishId: "2",
        createdAt: Date.now() - 86400000 * 18
      },
      {
        id: "chk_seed_3",
        date: prevSun2,
        type: "misa_finde",
        slot: "Tarde",
        parishId: "2",
        createdAt: Date.now() - 86400000 * 14
      },
      {
        id: "chk_seed_4",
        date: prevThu1,
        type: "adoracion",
        slot: "Noche",
        parishId: "1",
        createdAt: Date.now() - 86400000 * 10
      },
      {
        id: "chk_seed_5",
        date: prevSat1,
        type: "misa_finde",
        slot: "Tarde",
        parishId: "1",
        createdAt: Date.now() - 86400000 * 8
      },
      {
        id: "chk_seed_6",
        date: thisWeekTue <= today ? thisWeekTue : prevThu1,
        type: "misa_semana",
        slot: "Mañana",
        parishId: "1",
        createdAt: Date.now() - 86400000 * 3
      },
      {
        id: "chk_seed_7",
        date: thisWeekThu <= today ? thisWeekThu : today,
        type: "adoracion",
        slot: "Tarde",
        parishId: "2",
        createdAt: Date.now() - 86400000 * 1
      }
    ],
    notes: [
      {
        id: "note_seed_1",
        title: "Meditación frente al Santísimo",
        category: "Oración",
        parishId: "1",
        content: "«No se inquieten: crean en Dios y crean también en mí». Hoy en la Adoración pedí especialmente por la paz de mi familia y por sostener la fidelidad en las cosas pequeñas de cada día.",
        updatedAt: Date.now() - 86400000 * 2
      },
      {
        id: "note_seed_2",
        title: "Apuntes de la Homilía Dominical",
        category: "Homilía",
        parishId: "2",
        content: "El sacerdote recordó que la comunidad parroquial no es una oficina de servicios, sino una familia que camina junta y sale al encuentro del que está solo. Propósito: sumarme a las visitas de Cáritas este mes.",
        updatedAt: Date.now() - 86400000 * 6
      }
    ]
  };
}

let spiritualDB = (function loadSpiritualDB() {
  const saved = Store.get(SPIRITUAL_STORAGE_KEY, null);
  const seed = buildInitialSpiritualDB();
  if (!saved || typeof saved !== "object") {
    Store.set(SPIRITUAL_STORAGE_KEY, seed);
    return seed;
  }
  if (!Array.isArray(saved.checkins)) saved.checkins = seed.checkins;
  if (!Array.isArray(saved.notes)) saved.notes = seed.notes;
  if (!saved.lastParishId) saved.lastParishId = "1";
  return saved;
})();

function saveSpiritualDB() {
  Store.set(SPIRITUAL_STORAGE_KEY, spiritualDB);
}

/**
 * Evalúa la Racha Espiritual según las reglas estrictas:
 * - +5 pts por Misa de fin de semana (sábado tarde/domingo: type === 'misa_finde')
 * - +3 pts por Adoración (type === 'adoracion')
 * - +1 pt por Misa de semana (type === 'misa_semana')
 * - La racha se resetea ÚNICAMENTE si transcurre un fin de semana completo sin registrar Misa de fin de semana.
 */
function evaluateSpiritualStreak(checkins) {
  const list = Array.isArray(checkins)
    ? [...checkins].sort((a, b) => String(a.date).localeCompare(String(b.date)))
    : [];

  const today = getTodayIsoDate();
  const currentWeekendSunday = getSundayOfWeekIso(today);

  if (!list.length) {
    return {
      activePoints: 0,
      totalHistoricalPoints: 0,
      activeCheckins: [],
      consecutiveWeekends: 0,
      currentWeekendDone: false,
      wasReset: false,
      lastMissedWeekend: null,
      levelTitle: "Semilla de Oración 🌱"
    };
  }

  // Agrupamos por fin de semana (identificado por el domingo YYYY-MM-DD de esa semana)
  const firstSunday = getSundayOfWeekIso(list[0].date);
  const weekendHasFindeMass = new Map();

  list.forEach(chk => {
    const sunKey = getSundayOfWeekIso(chk.date);
    if (chk.type === "misa_finde") {
      weekendHasFindeMass.set(sunKey, true);
    }
  });

  // Recorremos todos los fines de semana COMPLETADOS (cuyo domingo < today) desde el primero hasta hoy
  let cursorSun = firstSunday;
  let lastMissedWeekend = null;

  while (cursorSun < today) {
    if (!weekendHasFindeMass.get(cursorSun)) {
      lastMissedWeekend = cursorSun;
    }
    cursorSun = addDaysIso(cursorSun, 7);
  }

  // Si hubo un fin de semana completado sin Misa de fin de semana, la racha se reseteó al terminar ese domingo
  const activeCheckins = lastMissedWeekend
    ? list.filter(chk => chk.date > lastMissedWeekend)
    : list;

  const calcPoints = arr => arr.reduce((sum, chk) => sum + (ACTIVITY_POINTS[chk.type] || 1), 0);
  const activePoints = calcPoints(activeCheckins);
  const totalHistoricalPoints = calcPoints(list);

  const activeWeekendSet = new Set(
    activeCheckins.filter(c => c.type === "misa_finde").map(c => getSundayOfWeekIso(c.date))
  );
  const consecutiveWeekends = activeWeekendSet.size;
  const currentWeekendDone = weekendHasFindeMass.get(currentWeekendSunday) === true;

  let levelTitle = "Peregrino en Camino 🕯️";
  if (activePoints >= 35) levelTitle = "Columna del Altar 👑";
  else if (activePoints >= 20) levelTitle = "Centinela Eucarístico 🔥";
  else if (activePoints >= 10) levelTitle = "Discípulo Constante ✨";

  return {
    activePoints,
    totalHistoricalPoints,
    activeCheckins,
    consecutiveWeekends,
    currentWeekendDone,
    wasReset: Boolean(lastMissedWeekend),
    lastMissedWeekend,
    levelTitle
  };
}

function getPrioritizedParishOptions(selectedParishId) {
  const me = getCurrentUserObj();
  const followedSet = new Set([
    ...(me && Array.isArray(me.followedParishes) ? me.followedParishes.map(String) : []),
    ...Array.from(state.favs).map(String)
  ]);

  const followedList = [];
  const otherList = [];

  PARISHES.forEach(p => {
    const pid = String(p.id);
    if (followedSet.has(pid)) followedList.push(p);
    else otherList.push(p);
  });

  followedList.sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"));
  otherList.sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"));

  const targetId = String(
    selectedParishId ||
    spiritualDB.lastParishId ||
    (followedList[0] ? followedList[0].id : (PARISHES[0] ? PARISHES[0].id : "1"))
  );

  let html = "";
  if (followedList.length) {
    html += `<optgroup label="⭐ Tus Parroquias Seguidas y Favoritas">`;
    html += followedList.map(p =>
      `<option value="${p.id}" ${String(p.id) === targetId ? "selected" : ""}>★ ${p.nombre} (${p.barrio})</option>`
    ).join("");
    html += `</optgroup>`;
  }
  html += `<optgroup label="⛪ Todas las Parroquias y Templos">`;
  html += otherList.map(p =>
    `<option value="${p.id}" ${String(p.id) === targetId ? "selected" : ""}>${p.nombre} (${p.barrio})</option>`
  ).join("");
  html += `</optgroup>`;
  return html;
}

const SVG_ANIMATED_PARISH_SCENE = `
  <div class="streak-parish-scene" aria-hidden="true">
    <span class="streak-spark s1"></span>
    <span class="streak-spark s2"></span>
    <span class="streak-spark s3"></span>
    <span class="streak-spark s4"></span>
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMax slice">
      <!-- Colinas nocturnas suaves -->
      <path d="M0 180 L0 148 Q95 132 200 146 T400 140 L400 180 Z" fill="rgba(15, 7, 30, 0.72)"/>
      <!-- Silueta arquitectónica de Parroquia / Basílica con campanario -->
      <path d="M85 165 L85 112 L130 84 L130 165 Z" fill="rgba(28, 14, 54, 0.85)"/>
      <path d="M270 165 L270 112 L315 84 L315 165 Z" fill="rgba(28, 14, 54, 0.85)"/>
      <!-- Nave central y torre campanario -->
      <path d="M125 165 L125 96 L200 50 L275 96 L275 165 Z" fill="rgba(39, 19, 72, 0.92)" stroke="rgba(250, 243, 224, 0.22)" stroke-width="1.2"/>
      <path d="M178 64 L200 22 L222 64 Z" fill="rgba(54, 25, 96, 0.95)" stroke="rgba(250, 243, 224, 0.28)" stroke-width="1.2"/>
      <!-- Cruz luminosa en la cúspide -->
      <path d="M200 6 V22 M194 12 H206" stroke="#FDE047" stroke-width="2.4" stroke-linecap="round"/>
      <!-- Rosetón central y vitrales iluminados con animación -->
      <circle class="vitral-window" cx="200" cy="86" r="13" fill="#F59E0B" stroke="#FEF08A" stroke-width="1.5"/>
      <path class="vitral-window" d="M150 138 V112 A8 8 0 0 1 166 112 V138 Z" fill="#FBBF24"/>
      <path class="vitral-window" d="M234 138 V112 A8 8 0 0 1 250 112 V138 Z" fill="#FBBF24"/>
      <path class="vitral-window" d="M188 165 V125 A12 12 0 0 1 212 125 V165 Z" fill="#FDE047"/>
    </svg>
  </div>`;

function renderStreakTabHtml() {
  const streak = evaluateSpiritualStreak(spiritualDB.checkins);
  const today = getTodayIsoDate();

  const recentCheckins = [...spiritualDB.checkins]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 8);

  return `
    <!-- Tarjeta Hero con Contador Grande de Racha y Fondo Animado de Parroquia -->
    <div class="streak-hero-card">
      ${SVG_ANIMATED_PARISH_SCENE}
      <div class="streak-hero-content">
        <div class="streak-badge-top">🔥 ${streak.levelTitle} · ${streak.consecutiveWeekends} ${streak.consecutiveWeekends === 1 ? "fin de semana" : "fines de semana"} seguidos</div>
        <div class="streak-counter-num" id="streak-counter-value">${streak.activePoints}</div>
        <p class="streak-counter-label">Puntos de Racha Espiritual Activa</p>

        <div class="streak-points-pills">
          <span class="streak-pt-pill"><strong>+5 pts</strong> Misa Finde</span>
          <span class="streak-pt-pill"><strong>+3 pts</strong> Adoración</span>
          <span class="streak-pt-pill"><strong>+1 pt</strong> Misa Semana</span>
        </div>

        <div class="streak-rule-banner">
          ${streak.currentWeekendDone
            ? `✅ <strong>¡Misa de este fin de semana registrada!</strong> Tu racha está protegida. Seguí sumando con Adoración (+3) o Misa de semana (+1).`
            : `🛡️ <strong>Regla de oro:</strong> La racha se resetea <em>únicamente</em> si termina el fin de semana sin registrar Misa de sábado a la tarde o domingo (+5 pts).`
          }
          ${streak.wasReset && streak.lastMissedWeekend
            ? `<div style="margin-top:4px;color:#FDE047">⚠️ Último reseteo tras el fin de semana del ${streak.lastMissedWeekend} sin misa dominical.</div>`
            : ""
          }
        </div>
      </div>
    </div>

    <!-- Formulario de Check-in de Racha -->
    <div class="checkin-card">
      <h4>✨ Registrar Check-in Espiritual</h4>
      <p>Sumá puntos a tu racha eligiendo tu actividad, franja horaria y templo (tus parroquias seguidas aparecen primero y recordamos tu última elección).</p>

      <form id="streak-checkin-form" class="admin-form">
        <div class="form-row-2">
          <div class="form-field">
            <label for="streak-activity-select">Actividad</label>
            <select id="streak-activity-select" required>
              <option value="misa_finde">⛪ Misa de fin de semana (Sáb tarde / Dom) · +5 pts</option>
              <option value="adoracion">🙌 Adoración Eucarística · +3 pts</option>
              <option value="misa_semana">🕯️ Misa de semana (Lun a Sáb mañana) · +1 pt</option>
            </select>
          </div>
          <div class="form-field">
            <label for="streak-date-input">Fecha</label>
            <input type="date" id="streak-date-input" value="${today}" max="${today}" required>
          </div>
        </div>

        <div class="form-field">
          <label>Franja horaria</label>
          <input type="hidden" id="streak-slot-input" value="${state.checkinSlot}">
          <div class="slot-pills" role="group" aria-label="Seleccionar franja horaria">
            <button type="button" class="slot-pill ${state.checkinSlot === "Mañana" ? "is-active" : ""}" data-checkin-slot="Mañana">🌅 Mañana</button>
            <button type="button" class="slot-pill ${state.checkinSlot === "Tarde" ? "is-active" : ""}" data-checkin-slot="Tarde">🌤️ Tarde</button>
            <button type="button" class="slot-pill ${state.checkinSlot === "Noche" ? "is-active" : ""}" data-checkin-slot="Noche">🌙 Noche</button>
          </div>
        </div>

        <div class="form-field">
          <label for="streak-parish-select">Parroquia (seguidas precargadas arriba · recuerda tu última elección)</label>
          <select id="streak-parish-select" required>
            ${getPrioritizedParishOptions(spiritualDB.lastParishId)}
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-sm submit">🔥 Registrar en mi Racha</button>
        </div>
      </form>
    </div>

    <!-- Historial reciente de Check-ins -->
    <div class="checkin-card">
      <h4>📅 Tus últimos registros (${spiritualDB.checkins.length})</h4>
      <p>Cada asistencia suma tiempo de gracia y fortalece la presencia comunitaria de tu parroquia.</p>
      <div class="checkin-history-list">
        ${recentCheckins.length ? recentCheckins.map(chk => {
          const p = getParishById(chk.parishId);
          const pts = ACTIVITY_POINTS[chk.type] || 1;
          const mins = ACTIVITY_MINUTES[chk.type] || 60;
          return `
            <div class="checkin-item">
              <div class="checkin-item-info">
                <strong>${ACTIVITY_LABELS[chk.type] || "Misa"}</strong>
                <span>📍 ${p ? p.nombre : "Parroquia local"} · ${chk.date} · Turno ${chk.slot || "Mañana"} (${mins} min)</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <span class="checkin-pts-badge">+${pts} ${pts === 1 ? "pt" : "pts"}</span>
                <button type="button" class="btn-sm" data-del-checkin="${chk.id}" title="Eliminar registro" aria-label="Eliminar registro">✕</button>
              </div>
            </div>`;
        }).join("") : `<div class="empty">Todavía no registraste actividades en tu racha. ¡Hacé tu primer check-in arriba!</div>`}
      </div>
    </div>`;
}

function renderNotesTabHtml() {
  const editingNote = state.editingNoteId
    ? spiritualDB.notes.find(n => n.id === state.editingNoteId)
    : null;

  const notesSorted = [...spiritualDB.notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return `
    <div class="checkin-card">
      <h4>${editingNote ? "✏️ Editar Reflexión Personal" : "📓 Bloc de Notas Espiritual"}</h4>
      <p>Guardá tus meditaciones de la Misa, apuntes de homilías, propósitos de confesión o frutos de tu Adoración. Todo queda guardado de forma privada en tu dispositivo.</p>

      <form id="spiritual-note-form" class="admin-form">
        <div class="form-row-2">
          <div class="form-field">
            <label for="note-title-input">Título de la nota</label>
            <input type="text" id="note-title-input" required placeholder="Ej: Fruto de la Adoración del jueves" value="${editingNote ? editingNote.title.replace(/"/g, "&quot;") : ""}">
          </div>
          <div class="form-field">
            <label for="note-category-select">Categoría</label>
            <select id="note-category-select">
              ${["Oración", "Homilía", "Lectio Divina", "Gratitud", "Confesión / Propósito"].map(cat =>
                `<option value="${cat}" ${editingNote && editingNote.category === cat ? "selected" : ""}>${cat}</option>`
              ).join("")}
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="note-parish-select">Parroquia vinculada (opcional)</label>
          <select id="note-parish-select">
            <option value="">— Reflexión personal general —</option>
            ${getPrioritizedParishOptions(editingNote ? editingNote.parishId : spiritualDB.lastParishId)}
          </select>
        </div>

        <div class="form-field">
          <label for="note-content-input">Tu reflexión</label>
          <textarea id="note-content-input" rows="4" required placeholder="Escribí aquí lo que Dios puso hoy en tu corazón...">${editingNote ? editingNote.content : ""}</textarea>
        </div>

        <div class="form-actions">
          ${editingNote ? `<button type="button" class="btn-sm" id="btn-cancel-note-edit">Cancelar edición</button>` : ""}
          <button type="submit" class="btn-sm submit">${editingNote ? "Guardar cambios" : "📓 Guardar en mis Notas"}</button>
        </div>
      </form>
    </div>

    <div class="notes-grid">
      ${notesSorted.length ? notesSorted.map(n => {
        const p = n.parishId ? getParishById(n.parishId) : null;
        const dateFormatted = new Date(n.updatedAt || Date.now()).toLocaleDateString("es-AR", {
          day: "2-digit", month: "short", year: "numeric"
        });
        return `
          <article class="note-card">
            <div class="note-card-head">
              <div>
                <h4>${n.title}</h4>
                <div class="note-card-date">🏷️ ${n.category || "Oración"} · 📅 ${dateFormatted}${p ? ` · 📍 ${p.nombre}` : ""}</div>
              </div>
              <div style="display:flex;gap:6px">
                <button type="button" class="btn-sm" data-edit-note="${n.id}">Editar</button>
                <button type="button" class="btn-sm" data-del-note="${n.id}">Borrar</button>
              </div>
            </div>
            <p>${n.content}</p>
          </article>`;
      }).join("") : `<div class="empty"><strong>Tu bloc de notas está vacío</strong>Escribí tu primera reflexión personal en el formulario superior.</div>`}
    </div>`;
}

function renderStatsTabHtml() {
  const checkins = spiritualDB.checkins || [];
  const streak = evaluateSpiritualStreak(checkins);

  // 1. Cálculo estricto de Tiempo Invertido: Misa = 60 min | Adoración = 90 min
  let totalMinutes = 0;
  let massMinutes = 0;
  let adorationMinutes = 0;
  let massCount = 0;
  let adorationCount = 0;

  const dayCounts = {
    "Domingo": 0,
    "Lunes": 0,
    "Martes": 0,
    "Miércoles": 0,
    "Jueves": 0,
    "Viernes": 0,
    "Sábado": 0
  };
  const FULL_DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const parishCounts = new Map();
  const monthStats = new Map();

  checkins.forEach(chk => {
    const isAdoracion = chk.type === "adoracion";
    const mins = isAdoracion ? 90 : 60; // Regla estricta: Misa = 60 min, Adoración = 90 min
    const pts = ACTIVITY_POINTS[chk.type] || 1;

    totalMinutes += mins;
    if (isAdoracion) {
      adorationMinutes += mins;
      adorationCount += 1;
    } else {
      massMinutes += mins;
      massCount += 1;
    }

    const parts = String(chk.date).split("-").map(Number);
    if (parts.length === 3) {
      const dt = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      const dayName = FULL_DAYS[dt.getDay()] || "Domingo";
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;

      const monthKey = `${parts[0]}-${String(parts[1]).padStart(2, "0")}`;
      const monthLabel = `${MONTH_NAMES[(parts[1] - 1) % 12]} ${parts[0]}`;
      const prevM = monthStats.get(monthKey) || { label: monthLabel, count: 0, points: 0, minutes: 0 };
      prevM.count += 1;
      prevM.points += pts;
      prevM.minutes += mins;
      monthStats.set(monthKey, prevM);
    }

    if (chk.parishId) {
      const pid = String(chk.parishId);
      const prevP = parishCounts.get(pid) || { count: 0, minutes: 0, points: 0 };
      prevP.count += 1;
      prevP.minutes += mins;
      prevP.points += pts;
      parishCounts.set(pid, prevP);
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const remMins = totalMinutes % 60;
  const formattedTime = hours > 0
    ? `${hours} h ${remMins > 0 ? `${remMins} min` : ""}`.trim()
    : `${totalMinutes} min`;

  // Días más frecuentes ordenados de mayor a menor
  const sortedDays = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1]);
  const maxDayVal = Math.max(1, sortedDays[0] ? sortedDays[0][1] : 1);
  const topDayName = sortedDays[0] && sortedDays[0][1] > 0 ? sortedDays[0][0] : "Domingo";

  // Parroquia Top
  const sortedParishes = [...parishCounts.entries()].sort((a, b) => b[1].count - a[1].count || b[1].minutes - a[1].minutes);
  const topParishEntry = sortedParishes[0] || null;
  const topParishObj = topParishEntry ? getParishById(topParishEntry[0]) : PARISHES[0];

  // Meses destacados
  const sortedMonths = [...monthStats.values()].sort((a, b) => b.points - a.points || b.minutes - a.minutes);
  const maxMonthPts = Math.max(1, sortedMonths[0] ? sortedMonths[0].points : 1);

  // Métricas Comunitarias Globales (combinando la actividad local + comunidad parroquial)
  const commUsersCount = Object.keys(socialDB.users || {}).length;
  const commTotalMasses = massCount + commUsersCount * 14;
  const commTotalAdorations = adorationCount + commUsersCount * 6;
  const commTotalMinutes = commTotalMasses * 60 + commTotalAdorations * 90;
  const commTotalHours = Math.round(commTotalMinutes / 60);

  return `
    <div class="checkin-card">
      <h4>📊 Mis Estadísticas Espirituales</h4>
      <p>Cálculo exacto de dedicación: <strong>Santa Misa = 60 min</strong> · <strong>Adoración Eucarística = 90 min</strong>.</p>

      <div class="stats-kpi-grid">
        <div class="stat-kpi-box">
          <span class="kpi-label">⏱️ Tiempo Invertido</span>
          <span class="kpi-val">${formattedTime}</span>
          <span class="kpi-sub">${totalMinutes} min totales (${massCount} Misas · ${adorationCount} Adoraciones)</span>
        </div>

        <div class="stat-kpi-box">
          <span class="kpi-label">🏛️ Parroquia Top</span>
          <span class="kpi-val" style="font-size:1rem">${topParishObj ? topParishObj.nombre : "Sin datos"}</span>
          <span class="kpi-sub">${topParishEntry ? `${topParishEntry[1].count} visitas · ${topParishEntry[1].minutes} min allí` : "Registrá tu primer check-in"}</span>
        </div>

        <div class="stat-kpi-box">
          <span class="kpi-label">📅 Día Más Frecuente</span>
          <span class="kpi-val">${topDayName}</span>
          <span class="kpi-sub">${dayCounts[topDayName] || 0} asistencias en este día</span>
        </div>

        <div class="stat-kpi-box">
          <span class="kpi-label">🔥 Racha y Puntos</span>
          <span class="kpi-val">${streak.activePoints} pts</span>
          <span class="kpi-sub">${streak.totalHistoricalPoints} pts históricos acumulados</span>
        </div>
      </div>

      <div style="margin-top:14px;padding:10px 12px;border-radius:10px;background:var(--accent-soft);font-size:0.8rem;color:var(--accent)">
        ⛪ <strong>Desglose de tiempo personal:</strong> ${massMinutes} min en Santa Misa (${massCount} × 60 min) + ${adorationMinutes} min en Adoración (${adorationCount} × 90 min).
      </div>
    </div>

    <!-- Días más frecuentes -->
    <div class="checkin-card">
      <h4>🗓️ Días más frecuentes de asistencia</h4>
      <p>Distribución semanal de tus Misas y momentos de Adoración Eucarística.</p>
      <div class="freq-bar-list">
        ${sortedDays.map(([dName, count]) => {
          const pct = Math.round((count / maxDayVal) * 100);
          return `
            <div class="freq-row">
              <strong>${dName}</strong>
              <div class="freq-track"><div class="freq-fill" style="width:${count > 0 ? Math.max(pct, 10) : 0}%"></div></div>
              <span class="freq-val">${count}</span>
            </div>`;
        }).join("")}
      </div>
    </div>

    <!-- Meses destacados y Parroquias más visitadas -->
    <div class="checkin-card">
      <h4>🌟 Meses destacados</h4>
      <p>Tus meses de mayor constancia espiritual según puntos de racha y minutos de oración.</p>
      <div class="freq-bar-list">
        ${sortedMonths.length ? sortedMonths.map(m => {
          const pct = Math.round((m.points / maxMonthPts) * 100);
          return `
            <div class="freq-row">
              <strong>${m.label}</strong>
              <div class="freq-track"><div class="freq-fill" style="width:${Math.max(pct, 14)}%"></div></div>
              <span class="freq-val">${m.points} pts · ${m.minutes}m</span>
            </div>`;
        }).join("") : `<div class="empty">Aún no hay meses registrados.</div>`}
      </div>
    </div>

    <!-- Panel de Estadísticas Comunitarias -->
    <div class="checkin-card">
      <h4>🤝 Pulso Comunitario (CABA y GBA)</h4>
      <p>Impacto colectivo de todos los fieles y grupos parroquiales activos en la plataforma.</p>
      <div class="stats-kpi-grid">
        <div class="stat-kpi-box">
          <span class="kpi-label">🙏 Tiempo Comunitario</span>
          <span class="kpi-val">${commTotalHours} h</span>
          <span class="kpi-sub">${commTotalMinutes.toLocaleString("es-AR")} min sumados entre Misas (60m) y Adoración (90m)</span>
        </div>
        <div class="stat-kpi-box">
          <span class="kpi-label">👥 Comunidad Activa</span>
          <span class="kpi-val">${commUsersCount} fieles</span>
          <span class="kpi-sub">${commTotalMasses} Misas y ${commTotalAdorations} Adoraciones celebradas</span>
        </div>
      </div>
    </div>`;
}

function renderSpiritualView() {
  const container = $("#spiritual-content");
  if (!container) return;

  $$("#spiritual-subtabs [data-spir-tab]").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.spirTab === state.spirTab);
  });

  if (state.spirTab === "notes") {
    container.innerHTML = renderNotesTabHtml();
  } else if (state.spirTab === "stats") {
    container.innerHTML = renderStatsTabHtml();
  } else {
    container.innerHTML = renderStreakTabHtml();
  }
}

/* =====================================================================
   Módulo de Liturgia: Evangelio del Día (Traducción Argentina CEA - Libro del Pueblo de Dios)
   + Reflexión Pastoral Estructurada (Papas / Sacerdotes)
   ===================================================================== */
const ARGENTINE_GOSPELS_CYCLE = [
  {
    citation: "Lucas 15, 1-10",
    title: "La alegría de Dios por encontrar lo que estaba perdido",
    liturgicalSeason: "Tiempo Durante el Año · Liturgia en Español de Argentina (CEA)",
    psalm: "Salmo 102 — «El Señor es bondadoso y compasivo»",
    gospelText: `En aquel tiempo, todos los publicanos y los pecadores se acercaban a Jesús para escucharlo. Los fariseos y los escribas murmuraban, diciendo: «Este hombre recibe a los pecadores y come con ellos».

Entonces Jesús les propuso esta parábola: «¿Quién de ustedes, si tiene cien ovejas y pierde una de ellas, no deja las noventa y nueve en el campo y va en busca de la que se había perdido, hasta encontrarla? Y cuando la encuentra, la carga sobre sus hombros, lleno de alegría, y al llegar a su casa llama a sus amigos y vecinos, y les dice: "Alégrense conmigo, porque encontré la oveja que se me había perdido".

Les aseguro que, de la misma manera, habrá más alegría en el cielo por un solo pecador que se convierta, que por noventa y nueve justos que no necesitan convertirse».`,
    popeQuote: "«El Dios de Jesús no es un juez frío que espera que nos equivoquemos, sino un Padre que sale a buscar a cada hijo por las calles de nuestra ciudad. Nunca se cansa de perdonarnos cuando volvemos a Él con el corazón humilde» (Papa Francisco, Reflexión sobre las parábolas de la misericordia).",
    priestCommentary: "En nuestras parroquias de Buenos Aires vemos todos los días cómo una palabra de bienvenida en el atrio o un confesionario abierto le devuelven la paz a quien se sentía lejos. Jesús nos habla en plural —«¿quién de ustedes?»— invitándonos a que cada comunidad parroquial sea una casa de puertas abiertas donde nadie se sienta juzgado.",
    prayerPrompts: [
      "¿Hay alguien en mi familia o trabajo que hoy necesite un gesto concreto de cercanía y escucha sin prejuicios?",
      "Agradecer al Señor las veces que Él me cargó sobre sus hombros cuando me sentía desorientado.",
      "Acercarme esta semana unos minutos al Sagrario o al sacramento de la Reconciliación."
    ]
  },
  {
    citation: "Mateo 5, 1-12a",
    title: "Las Bienaventuranzas: El camino de la verdadera felicidad",
    liturgicalSeason: "Tiempo Litúrgico · Traducción Oficial Conferencia Episcopal Argentina",
    psalm: "Salmo 23 — «Ésta es la generación de los que buscan tu rostro, Señor»",
    gospelText: `Al ver a la multitud, Jesús subió a la montaña, se sentó, y sus discípulos se acercaron a él. Entonces tomó la palabra y comenzó a enseñarles, diciendo:

«Felices los que tienen alma de pobres, porque a ellos les pertenece el Reino de los Cielos.
Felices los afligidos, porque serán consolados.
Felices los pacientes, porque recibirán la tierra en herencia.
Felices los que tienen hambre y sed de justicia, porque serán saciados.
Felices los misericordiosos, porque obtendrán misericordia.
Felices los que tienen el corazón puro, porque verán a Dios.
Felices los que trabajan por la paz, porque serán llamados hijos de Dios.
Felices los que son perseguidos por practicar la justicia, porque a ellos les pertenece el Reino de los Cielos.

Alégrense y regocíjense, porque ustedes tendrán una gran recompensa en el cielo».`,
    popeQuote: "«La traducción argentina dice 'Felices': las Bienaventuranzas son el documento de identidad del cristiano. Vivirlas en lo cotidiano es ir contracorriente frente a la indiferencia, eligiendo la mansedumbre, la misericordia y el trabajo silencioso por la paz» (Papa Francisco, Gaudete et Exsultate).",
    priestCommentary: "Cuando rezamos este Evangelio con el Libro del Pueblo de Dios, resuena con fuerza esa primera palabra: «Felices». Jesús no promete una vida sin dificultades, sino una felicidad honda que el mundo no puede quitar. Ser constructores de paz empieza en nuestra propia casa, en el barrio y en el modo en que tratamos al prójimo en la calle.",
    prayerPrompts: [
      "¿Cuál de las ocho Bienaventuranzas me invita hoy Jesús a practicar con más fuerza en mi casa o trabajo?",
      "Pedir un corazón manso y paciente ante las demoras o tensiones del día.",
      "Ofrecer mi próxima Misa por quienes hoy están afligidos o pasando soledad."
    ]
  },
  {
    citation: "Marcos 4, 35-41",
    title: "Jesús calma la tempestad: «¿Por qué tienen miedo?»",
    liturgicalSeason: "Tiempo Durante el Año · Libro del Pueblo de Dios (Argentina)",
    psalm: "Salmo 106 — «Den gracias al Señor, porque es bueno»",
    gospelText: `Al atardecer de ese mismo día, Jesús dijo a sus discípulos: «Crucemos a la otra orilla». Ellos, dejando a la multitud, lo llevaron en la barca, así como estaba. Había otras barcas junto a la suya.

Entonces se desató un fuerte vendaval, y las olas entraban en la barca, de manera que se llenaba de agua. Jesús estaba en la popa, durmiendo sobre el cabezal.

Lo despertaron y le dijeron: «¡Maestro! ¿No te importa que nos ahoguemos?». Él se despertó, increpó al viento y dijo al mar: «¡Silencio! ¡Cállate!». El viento se aplacó y sobrevino una gran calma. Después les dijo: «¿Por qué tienen miedo? ¿Cómo no tienen fe?».`,
    popeQuote: "«En esta barca estamos todos nosotros. A veces pensamos que Jesús duerme frente a nuestras tormentas, pero Él está presente en la popa de nuestra vida. Despertarlo con la oración confiada es dejar que Su paz gobierne nuestro corazón» (Papa Francisco, Bendición Urbi et Orbi).",
    priestCommentary: "Cuántas veces vamos apurados por las avenidas de nuestra ciudad sintiendo que las preocupaciones nos superan como olas en la barca. La pregunta de Jesús en nuestra traducción litúrgica argentina nos interpela directo al corazón: «¿Por qué tienen miedo?». Entrar cinco minutos a una parroquia abierta o hacer silencio ante el Sagrario es dejar que Él diga «¡Calma!» a nuestro interior.",
    prayerPrompts: [
      "¿Qué preocupación o tormenta interior necesito entregarle hoy a Jesús en la barca?",
      "Repetir como jaculatoria durante el día: «Jesús, en Vos confío».",
      "Dedicar hoy un rato de silencio en mi parroquia más cercana."
    ]
  },
  {
    citation: "Juan 15, 9-17",
    title: "Permanezcan en mi amor para que den fruto abundante",
    liturgicalSeason: "Tiempo Litúrgico · Conferencia Episcopal Argentina (CEA)",
    psalm: "Salmo 97 — «El Señor reveló su salvación a las naciones»",
    gospelText: `En aquel tiempo, Jesús dijo a sus discípulos: «Como el Padre me amó, también yo los he amado a ustedes. Permanezcan en mi amor. Si cumplen mis mandamientos, permanecerán en mi amor, como yo cumplí los mandamientos de mi Padre y permanezco en su amor.

Les he dicho esto para que mi gozo sea el de ustedes, y ese gozo sea perfecto. Éste es mi mandamiento: Ámense los unos a los otros, como yo los he amado. No hay amor más grande que dar la vida por los amigos. Ustedes son mis amigos si hacen lo que yo les mando.

Ya no los llamo servidores, porque el servidor no sabe lo que hace su señor; yo los llamo amigos, porque les he dado a conocer todo lo que oí de mi Padre. No son ustedes los que me eligieron a mí, sino yo el que los elegí a ustedes, y los destiné para que vayan y den fruto, y ese fruto sea duradero».`,
    popeQuote: "«Cristo nos llama amigos y nos invita a permanecer en Su amor. Permanecer no es quedarse quietos: es tener raíces profundas en la Eucaristía y la oración para salir con alegría a servir a los hermanos» (San Juan Pablo II / Magisterio Pontificio).",
    priestCommentary: "La palabra clave que Jesús repite a sus discípulos es «Permanezcan». En una cultura de lo pasajero, la fidelidad a la Misa dominical, la Adoración y la vida en comunidad nos arraigan en la amistad con Cristo. No caminamos solos: somos elegidos para dar fruto allí donde vivimos y estudiamos o trabajamos.",
    prayerPrompts: [
      "¿Cómo cuido mi amistad diaria con Jesús a través de la oración y la Eucaristía?",
      "Tener hoy un gesto concreto de servicio desinteresado con un amigo o compañero.",
      "Dar gracias por la comunidad parroquial en la que crezco en la fe."
    ]
  },
  {
    citation: "Lucas 10, 38-42",
    title: "Marta y María: Elegir la mejor parte que no será quitada",
    liturgicalSeason: "Tiempo Durante el Año · Libro del Pueblo de Dios (Argentina)",
    psalm: "Salmo 14 — «Señor, ¿quién habitará en tu Casa?»",
    gospelText: `Mientras iban caminando, Jesús entró en un pueblo, y una mujer que se llamaba Marta lo recibió en su casa. Tenía una hermana llamada María, que sentada a los pies del Señor, escuchaba su Palabra.

Marta, que estaba muy ocupada con los quehaceres de la casa, se acercó a Jesús y le dijo: «Señor, ¿no te importa que mi hermana me deje sola con todo el trabajo? Dile que me ayude».

Pero el Señor le respondió: «Marta, Marta, te inquietas y te agitas por muchas cosas, y sin embargo, pocas cosas son necesarias, o más bien, una sola. María eligió la mejor parte, que no le será quitada».`,
    popeQuote: "«Jesús no contrapone la vida activa a la contemplativa, sino que nos recuerda que todo servicio nace de sentarse primero a escuchar Su Palabra. Sin oración, el activismo nos agota y nos quita la alegría» (Papa Benedicto XVI / Papa Francisco, Angelus).",
    priestCommentary: "A todos nos pasa lo de Marta: corremos de una obligación a otra y hasta en las tareas pastorales podemos agitarnos. El Evangelio de hoy nos regala una invitación luminosa: sentarnos a los pies de Jesús como María, escuchar su Palabra y dejar que Él ordene nuestras prioridades.",
    prayerPrompts: [
      "¿En qué cosas me estoy agitando hoy sin necesidad, perdiendo la paz interior?",
      "Separar hoy quince minutos de escucha silenciosa de la Palabra o Adoración.",
      "Unir el trabajo de mis manos con la escucha amorosa de Dios."
    ]
  },
  {
    citation: "Lucas 24, 13-35",
    title: "Los discípulos de Emaús: «¡Quédate con nosotros, porque ya es tarde!»",
    liturgicalSeason: "Liturgia Dominical · Español de Argentina (CEA)",
    psalm: "Salmo 15 — «Muéstranos, Señor, el camino de la vida»",
    gospelText: `Aquel mismo día, dos de los discípulos iban a un pequeño pueblo llamado Emaús, situado a unos once kilómetros de Jerusalén. En el camino hablaban sobre lo que había ocurrido. Mientras conversaban y discutían, el mismo Jesús se acercó y siguió caminando con ellos, pero algo impedía que sus ojos lo reconocieran.

Cuando llegaron cerca del pueblo adonde iban, Jesús hizo ademán de seguir adelante. Pero ellos le insistieron: «Quédate con nosotros, porque ya es tarde y el día se acaba». Él entró y se quedó con ellos.

Y estando a la mesa, tomó el pan y pronunció la bendición; luego lo partió y se lo dio. Entonces los ojos de los discípulos se abrieron y lo reconocieron, pero él había desaparecido de su vista. Y se decían el uno al otro: «¿No ardía acaso nuestro corazón, mientras nos hablaba en el camino y nos explicaba las Escrituras?».`,
    popeQuote: "«El camino de Emaús es el símbolo de cada Misa: Jesús sale a nuestro encuentro, nos explica las Escrituras para encender nuestro corazón y se deja reconocer al partir el Pan Eucarístico» (Papa Francisco, Catequesis sobre la Eucaristía).",
    priestCommentary: "Cada vez que participamos de la Santa Misa en nuestra parroquia, vivimos exactamente lo mismo que los peregrinos de Emaús: llegamos con nuestras preguntas y cansancios de la semana, escuchamos la Palabra y, en el altar, reconocemos a Jesús vivo que nos devuelve el entusiasmo para volver a casa anunciando Su presencia.",
    prayerPrompts: [
      "Rezar hoy con los discípulos de Emaús: «Quédate con nosotros, Señor».",
      "Recordar qué pasaje del Evangelio o qué Misa hizo arder especialmente mi corazón.",
      "Invitar a algún amigo o familiar a compartir la Misa de este fin de semana."
    ]
  }
];

function getGospelForDate(isoDateStr) {
  const parts = String(isoDateStr || getTodayIsoDate()).split("-").map(Number);
  const y = parts[0] || 2026;
  const m = parts[1] || 11;
  const d = parts[2] || 5;
  const seedIndex = Math.abs(y * 372 + m * 31 + d) % ARGENTINE_GOSPELS_CYCLE.length;
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  const formattedLongDate = dt.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return {
    ...ARGENTINE_GOSPELS_CYCLE[seedIndex],
    isoDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    formattedLongDate: formattedLongDate.charAt(0).toUpperCase() + formattedLongDate.slice(1)
  };
}

function renderLiturgyView() {
  const container = $("#liturgy-content");
  if (!container) return;

  const g = getGospelForDate(state.liturgyDate);

  container.innerHTML = `
    <!-- Barra de Selección de Fecha Litúrgica -->
    <div class="liturgy-toolbar">
      <div class="liturgy-toolbar-info">
        <strong>📅 Selector de Fecha Litúrgica</strong>
        <span>${g.formattedLongDate} · Leccionario Argentino (Libro del Pueblo de Dios)</span>
      </div>
      <div class="liturgy-date-controls">
        <button type="button" class="btn-sm" id="btn-liturgy-prev" title="Día anterior">◀ Ant.</button>
        <input type="date" id="liturgy-date-input" value="${g.isoDate}" aria-label="Seleccionar fecha del Evangelio">
        <button type="button" class="btn-sm" id="btn-liturgy-today">Hoy</button>
        <button type="button" class="btn-sm" id="btn-liturgy-next" title="Día siguiente">Sig. ▶</button>
      </div>
    </div>

    <!-- Ficha Principal del Evangelio del Día -->
    <article class="gospel-card">
      <div class="gospel-head">
        <span class="gospel-tag">🇦🇷 ${g.liturgicalSeason}</span>
        <h3>Evangelio según San ${g.citation}: «${g.title}»</h3>
        <p class="gospel-ref">🎵 ${g.psalm}</p>
      </div>

      <div class="gospel-body-text">${g.gospelText.split("\n\n").map(p => `<p style="margin:0 0 12px">${p}</p>`).join("")}</div>
      <p style="margin:10px 0 0;font-size:0.82rem;font-weight:700;color:var(--accent)">— Palabra del Señor. / Gloria a Ti, Señor Jesús.</p>

      <!-- Botón de Explicación del Evangelio (Papas / Sacerdotes) -->
      <button type="button" class="btn-explain-gospel" id="btn-toggle-gospel-explain" aria-expanded="${state.liturgyExplainOpen}">
        <span>📖 Explicación del Evangelio (Papas / Sacerdotes)</span>
        <span>${state.liturgyExplainOpen ? "▲ Ocultar reflexión" : "▼ Ver comentario homilético"}</span>
      </button>

      ${state.liturgyExplainOpen ? `
        <div class="gospel-explanation-panel" id="gospel-explanation-panel">
          <h4>🏛️ 1. Magisterio de los Papas</h4>
          <p>${g.popeQuote}</p>

          <h4>⛪ 2. Reflexión Homilética Sacerdotal</h4>
          <p>${g.priestCommentary}</p>

          <h4>🕯️ 3. Puntos para tu Oración Personal Hoy</h4>
          <ul>
            ${g.prayerPrompts.map(pr => `<li>${pr}</li>`).join("")}
          </ul>

          <div style="margin-top:14px;display:flex;justify-content:flex-end">
            <button type="button" class="btn-sm submit" id="btn-save-gospel-to-notes">📓 Anotar reflexión sobre este Evangelio</button>
          </div>
        </div>
      ` : ""}
    </article>`;
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

  $("#community-content")?.addEventListener("input", e => {
    if (e.target && e.target.id === "comm-search-input") {
      commSearchQuery = e.target.value;
      const resultsBox = $("#comm-dir-results");
      if (resultsBox) {
        resultsBox.innerHTML = renderPeopleDirectoryResultsHtml();
      }
    }
  });

  $("#community-content")?.addEventListener("click", e => {
    const scopeBtn = e.target.closest("[data-comm-scope]");
    if (scopeBtn) {
      commSearchScope = scopeBtn.dataset.commScope;
      $$("#community-content [data-comm-scope]").forEach(b => {
        b.classList.toggle("is-active", b.dataset.commScope === commSearchScope);
      });
      const resultsBox = $("#comm-dir-results");
      if (resultsBox) {
        resultsBox.innerHTML = renderPeopleDirectoryResultsHtml();
      }
      return;
    }
    const followActBtn = e.target.closest("[data-follow-activity]");
    if (followActBtn) {
      toggleFollowActivity(followActBtn.dataset.followActivity);
      return;
    }
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

  // Delegación de eventos en la vista Perfil / Cuenta (Login, Registro, Demo, Subida Base64, Creador Mii y Editar Perfil)
  $("#profile-content")?.addEventListener("change", async e => {
    if (e.target && e.target.id === "p-avatar-file") {
      const file = e.target.files && e.target.files[0];
      const me = getCurrentUserObj();
      if (!file || !me) return;
      try {
        const base64DataUrl = await resizeImageFileToBase64(file, 160);
        me.avatarUrl = base64DataUrl;
        saveSocialDB();
        syncHeaderUserPill();
        renderProfileView();
        toast("Foto de perfil cargada y guardada en Base64");
      } catch (err) {
        console.warn("Error al procesar foto de perfil:", err);
        toast("No se pudo cargar la imagen seleccionada");
      }
    }
  });

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
          miiConfig: { ...DEFAULT_MII_CONFIG },
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
      me.miiConfig = { ...draftMiiConfig };
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
    const clearPhotoBtn = e.target.closest("#btn-clear-avatar-photo");
    if (clearPhotoBtn) {
      const me = getCurrentUserObj();
      if (me) {
        me.avatarUrl = "";
        saveSocialDB();
        syncHeaderUserPill();
        renderProfileView();
        toast("Foto quitada · Usando ícono de perfil");
      }
      return;
    }
    const miiOptBtn = e.target.closest("[data-mii-prop]");
    if (miiOptBtn) {
      const prop = miiOptBtn.dataset.miiProp;
      const val = miiOptBtn.dataset.miiVal;
      draftMiiConfig[prop] = val;
      $$(`#mii-creator-box [data-mii-prop="${prop}"]`).forEach(b => {
        b.classList.toggle("is-selected", b.dataset.miiVal === val);
      });
      const previewImg = $("#mii-stage-img");
      if (previewImg) {
        previewImg.src = generateMiiSvgDataUrl(draftMiiConfig);
      }
      return;
    }
    const applyMiiBtn = e.target.closest("#btn-apply-mii");
    if (applyMiiBtn) {
      const me = getCurrentUserObj();
      if (!me) return;
      me.miiConfig = { ...draftMiiConfig };
      me.avatarUrl = generateMiiSvgDataUrl(draftMiiConfig);
      saveSocialDB();
      syncHeaderUserPill();
      renderProfileView();
      toast("¡Avatar Mii aplicado a tu perfil!");
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

  // Sub-pestañas del Módulo Racha / Notas / Estadísticas
  $("#spiritual-subtabs")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-spir-tab]");
    if (!btn) return;
    state.spirTab = btn.dataset.spirTab;
    renderSpiritualView();
  });

  // Delegación de eventos en el Módulo Racha, Notas y Estadísticas
  $("#spiritual-content")?.addEventListener("click", e => {
    const slotBtn = e.target.closest("[data-checkin-slot]");
    if (slotBtn) {
      state.checkinSlot = slotBtn.dataset.checkinSlot;
      const hiddenSlot = $("#streak-slot-input");
      if (hiddenSlot) hiddenSlot.value = state.checkinSlot;
      $$("#spiritual-content [data-checkin-slot]").forEach(b => {
        b.classList.toggle("is-active", b.dataset.checkinSlot === state.checkinSlot);
      });
      return;
    }

    const delCheckinBtn = e.target.closest("[data-del-checkin]");
    if (delCheckinBtn) {
      const cid = delCheckinBtn.dataset.delCheckin;
      spiritualDB.checkins = spiritualDB.checkins.filter(c => c.id !== cid);
      saveSpiritualDB();
      renderSpiritualView();
      toast("Registro eliminado de tu historial");
      return;
    }

    const editNoteBtn = e.target.closest("[data-edit-note]");
    if (editNoteBtn) {
      state.editingNoteId = editNoteBtn.dataset.editNote;
      renderSpiritualView();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cancelNoteEditBtn = e.target.closest("#btn-cancel-note-edit");
    if (cancelNoteEditBtn) {
      state.editingNoteId = null;
      renderSpiritualView();
      return;
    }

    const delNoteBtn = e.target.closest("[data-del-note]");
    if (delNoteBtn) {
      const nid = delNoteBtn.dataset.delNote;
      spiritualDB.notes = spiritualDB.notes.filter(n => n.id !== nid);
      if (state.editingNoteId === nid) state.editingNoteId = null;
      saveSpiritualDB();
      renderSpiritualView();
      toast("Nota eliminada del bloc personal");
      return;
    }
  });

  $("#spiritual-content")?.addEventListener("change", e => {
    if (e.target && e.target.id === "streak-parish-select") {
      spiritualDB.lastParishId = String(e.target.value);
      saveSpiritualDB();
    }
  });

  $("#spiritual-content")?.addEventListener("submit", e => {
    if (e.target && e.target.id === "streak-checkin-form") {
      e.preventDefault();
      const type = $("#streak-activity-select")?.value || "misa_finde";
      const date = $("#streak-date-input")?.value || getTodayIsoDate();
      const slot = $("#streak-slot-input")?.value || state.checkinSlot || "Mañana";
      const parishId = String($("#streak-parish-select")?.value || spiritualDB.lastParishId || "1");

      spiritualDB.lastParishId = parishId;
      spiritualDB.checkins.push({
        id: "chk_" + Date.now(),
        date,
        type,
        slot,
        parishId,
        createdAt: Date.now()
      });
      saveSpiritualDB();
      renderSpiritualView();

      const pts = ACTIVITY_POINTS[type] || 1;
      const pObj = getParishById(parishId);
      toast(`🔥 ¡+${pts} ${pts === 1 ? "punto sumado" : "puntos sumados"} en ${pObj ? pObj.nombre : "tu parroquia"}!`);
      return;
    }

    if (e.target && e.target.id === "spiritual-note-form") {
      e.preventDefault();
      const title = ($("#note-title-input")?.value || "").trim();
      const category = $("#note-category-select")?.value || "Oración";
      const parishId = $("#note-parish-select")?.value || "";
      const content = ($("#note-content-input")?.value || "").trim();
      if (!title || !content) return;

      if (parishId) spiritualDB.lastParishId = String(parishId);

      if (state.editingNoteId) {
        const existing = spiritualDB.notes.find(n => n.id === state.editingNoteId);
        if (existing) {
          existing.title = title;
          existing.category = category;
          existing.parishId = parishId;
          existing.content = content;
          existing.updatedAt = Date.now();
        }
        state.editingNoteId = null;
        toast("Reflexión actualizada en tus Notas");
      } else {
        spiritualDB.notes.unshift({
          id: "note_" + Date.now(),
          title,
          category,
          parishId,
          content,
          updatedAt: Date.now()
        });
        toast("📓 Reflexión guardada en tu Bloc de Notas");
      }
      saveSpiritualDB();
      renderSpiritualView();
    }
  });

  // Delegación de eventos en el Módulo de Liturgia (Selector de fecha y Explicación de Papas / Sacerdotes)
  $("#liturgy-content")?.addEventListener("change", e => {
    if (e.target && e.target.id === "liturgy-date-input" && e.target.value) {
      state.liturgyDate = e.target.value;
      renderLiturgyView();
    }
  });

  $("#liturgy-content")?.addEventListener("click", e => {
    if (e.target.closest("#btn-liturgy-prev")) {
      state.liturgyDate = addDaysIso(state.liturgyDate, -1);
      renderLiturgyView();
      return;
    }
    if (e.target.closest("#btn-liturgy-next")) {
      state.liturgyDate = addDaysIso(state.liturgyDate, 1);
      renderLiturgyView();
      return;
    }
    if (e.target.closest("#btn-liturgy-today")) {
      state.liturgyDate = getTodayIsoDate();
      renderLiturgyView();
      toast("Evangelio actualizado a la fecha de hoy");
      return;
    }
    if (e.target.closest("#btn-toggle-gospel-explain")) {
      state.liturgyExplainOpen = !state.liturgyExplainOpen;
      renderLiturgyView();
      return;
    }
    if (e.target.closest("#btn-save-gospel-to-notes")) {
      const g = getGospelForDate(state.liturgyDate);
      state.spirTab = "notes";
      state.editingNoteId = null;
      switchView("spiritual");
      requestAnimationFrame(() => {
        const titleEl = $("#note-title-input");
        const catEl = $("#note-category-select");
        const contentEl = $("#note-content-input");
        if (titleEl) titleEl.value = `Evangelio (${g.citation}): ${g.title}`;
        if (catEl) catEl.value = "Lectio Divina";
        if (contentEl) {
          contentEl.value = `Meditación sobre ${g.citation} (${g.isoDate}):\n`;
          contentEl.focus();
        }
      });
      toast("Cita del Evangelio cargada en tu Bloc de Notas");
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
  renderSpiritualView();
  renderLiturgyView();
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
