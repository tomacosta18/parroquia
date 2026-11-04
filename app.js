/* =====================================================================
   CONFIGURACIÓN, ZONAS DE REFERENCIA Y DATOS DE RESPALDO OFFLINE
   ===================================================================== */
const DATA_SOURCE_URL = "./data/parroquias.json";
const ADMIN_MASTER_PIN = "1118";
const CABA_CENTER = [-34.5975, -58.3855];
const CABA_ZOOM = 13;
const MASS_DURATION_MIN = 45;
const NEXT_WINDOW_MIN = 60;

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

// Puntos de referencia fijos de barrios principales de CABA y GBA para selección manual
const REFERENCE_ZONES = [
  { id: "san-nicolas", nombre: "San Nicolás (Microcentro)", lat: -34.6083, lng: -58.3722 },
  { id: "recoleta", nombre: "Recoleta", lat: -34.5875, lng: -58.3931 },
  { id: "retiro", nombre: "Retiro", lat: -34.5987, lng: -58.3845 },
  { id: "palermo", nombre: "Palermo", lat: -34.5826, lng: -58.4259 },
  { id: "belgrano", nombre: "Belgrano", lat: -34.5614, lng: -58.4563 },
  { id: "coghlan", nombre: "Coghlan", lat: -34.5642, lng: -58.4751 },
  { id: "caballito", nombre: "Caballito", lat: -34.6186, lng: -58.4426 },
  { id: "flores", nombre: "Flores", lat: -34.6285, lng: -58.4641 },
  { id: "almagro", nombre: "Almagro", lat: -34.6095, lng: -58.4208 },
  { id: "san-telmo", nombre: "San Telmo", lat: -34.6212, lng: -58.3731 },
  { id: "zona-sur", nombre: "Zona Sur (Lomas)", lat: -34.7578, lng: -58.4025 }
];

// Respaldo local sincronizado con data/parroquias.json para garantizar carga inicial 100% offline
const FALLBACK_PARISHES = [
  {
    id: 1,
    nombre: "Catedral Metropolitana de Buenos Aires",
    tipo: "Catedral",
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
    nombre: "Catedral Nuestra Señora de la Paz (Lomas)",
    tipo: "Catedral",
    direccion: "Castro 941, Lomas de Zona Sur",
    barrio: "Zona Sur",
    coordenadas: { lat: -34.7578, lng: -58.4025 },
    horariosMisa: [
      { dia: "Lunes a Viernes", horarios: ["08:00", "19:00"] },
      { dia: "Domingos", horarios: ["09:00", "11:00", "20:00"] }
    ],
    horariosConfesiones: "Sábados de 10:00 a 12:00",
    telefono: "+54 11 4243-2311",
    webOficial: "",
    etiquetas: ["Catedral", "Historica"]
  },
  {
    id: 5,
    nombre: "Parroquia San Nicolás de Bari",
    tipo: "Parroquia",
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
  }
];

/* =====================================================================
   Utilidades y Normalización
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
 * Valida y limpia webOficial:
 * - Si está vacío, es inválido o apunta a un dominio genérico/inexistente de prueba, devuelve "".
 * - Si no comienza con http:// o https://, antepone https:// automáticamente.
 */
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

/**
 * Enlace directo a la ubicación exacta del templo en Google Maps Search (siempre funciona)
 */
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

// Fórmula de Haversine: distancia en kilómetros entre dos coordenadas
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

// localStorage seguro: si el navegador lo bloquea, usa memoria.
const Store = (() => {
  const mem = {};
  return {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return mem[k] ?? def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };
})();

/* =====================================================================
   Estado de la Aplicación y Persistencia Admin
   ===================================================================== */
const savedAdminParishes = Store.get("parishes_admin_data", null);
let PARISHES = Array.isArray(savedAdminParishes) && savedAdminParishes.length
  ? savedAdminParishes
  : Store.get("parishes_cache_v5", FALLBACK_PARISHES);

const state = {
  view: "list", // 'list' | 'map'
  q: "",
  barrio: null,
  soloFav: false,
  soloNow: false,
  sortByNear: false,
  userLoc: null, // { id, lat, lng, label, source: 'gps' | 'manual' }
  favs: new Set(Store.get("favs", []).map(String)),
  current: null,
  isAdmin: Boolean(Store.get("admin_unlocked", false))
};

/* =====================================================================
   Navegación por Pestañas (Listado vs Mapa Completo)
   ===================================================================== */
function switchView(targetView) {
  if (targetView !== "list" && targetView !== "map") return;
  state.view = targetView;
  document.body.setAttribute("data-active-view", targetView);

  const viewList = $("#view-list");
  const viewMap = $("#view-map");
  const tabList = $("#tab-list");
  const tabMap = $("#tab-map");

  const isList = targetView === "list";
  viewList.classList.toggle("is-active", isList);
  viewList.setAttribute("aria-hidden", String(!isList));

  viewMap.classList.toggle("is-active", !isList);
  viewMap.setAttribute("aria-hidden", String(isList));

  tabList.classList.toggle("is-active", isList);
  tabList.setAttribute("aria-selected", String(isList));

  tabMap.classList.toggle("is-active", !isList);
  tabMap.setAttribute("aria-selected", String(!isList));

  if (!isList) {
    initMap();
    requestAnimationFrame(() => {
      if (map) {
        map.invalidateSize();
        fitMapToBounds(filtered());
      }
    });
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
      return `${dayLabel} ${hours[0].raw} h`;
    }
  }
  return null;
}

function getMassStatus(p) {
  const now = new Date();
  const today = now.getDay();
  const cur = now.getHours() * 60 + now.getMinutes();

  const todayTimes = getMassHoursForDay(p, today);

  // 1. Misa transcurriendo en este momento (inició hace <= 45 min)
  const ongoing = todayTimes.find(t => cur >= t.mins && cur <= t.mins + MASS_DURATION_MIN);
  if (ongoing) {
    return {
      isNowOrSoon: true,
      label: `Misa ahora · inició ${ongoing.raw} h`
    };
  }

  // 2. Próxima misa hoy (destacando si inicia dentro de los próximos 60 minutos)
  const upcoming = todayTimes.filter(t => t.mins > cur);
  if (upcoming.length > 0) {
    const next = upcoming[0];
    const diff = next.mins - cur;
    if (diff <= NEXT_WINDOW_MIN) {
      return {
        isNowOrSoon: true,
        label: `Próxima misa hoy: ${next.raw} h (en ${diff} min)`
      };
    }
    return {
      isNowOrSoon: false,
      label: `Próxima misa hoy: ${next.raw} h`
    };
  }

  // 3. Si hoy hubo misas pero ya finalizaron por la hora actual, informa horarios y próxima
  const nextAvailable = findNextAvailableMass(p, today);
  if (todayTimes.length > 0) {
    const listStr = todayTimes.map(t => t.raw).join(" · ");
    return {
      isNowOrSoon: false,
      label: nextAvailable
        ? `Hoy (${listStr} h) finalizadas · Próxima: ${nextAvailable}`
        : `Misas de hoy: ${listStr} h`
    };
  }

  if (nextAvailable) {
    return {
      isNowOrSoon: false,
      label: `Próxima misa: ${nextAvailable}`
    };
  }

  return {
    isNowOrSoon: false,
    label: "Consultar horarios en la ficha"
  };
}

/* =====================================================================
   Inicialización del Mapa (CartoDB Positron + Marcadores DivIcon Jerárquicos)
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

  L.control.zoom({ position: "bottomleft" }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

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
  const major = isMajorTemple(p.tipo);
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

    const major = isMajorTemple(p.tipo);
    const status = getMassStatus(p);
    const badgeCls = getTypeBadgeClass(p.tipo);
    const distHtml = typeof p.distanceKm === "number"
      ? `<span class="dist-badge">${formatKm(p.distanceKm)}</span>`
      : "";

    const popupHtml = `
      <div class="map-popup">
        <div class="map-popup-top">
          <span class="type-badge ${badgeCls}">${p.tipo || "Templo"}</span>
          ${distHtml}
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
   Estrategia de Ubicación Híbrida (GPS + Selector Manual + Fallback)
   ===================================================================== */
function renderZoneSelector() {
  const sel = $("#manual-zone");
  if (!sel) return;
  sel.innerHTML =
    `<option value="">Ubicación: Orden alfabético (general)</option>` +
    `<option value="__gps__" hidden>Mi ubicación actual (GPS)</option>` +
    REFERENCE_ZONES.map(z => `<option value="${z.id}">Zona: ${z.nombre}</option>`).join("");
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
    renderList();
    if (state.current) openDetail(state.current.id);
    toast("Orden alfabético general");
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
  renderList();
  if (state.current) openDetail(state.current.id);
  toast(`Ordenado por cercanía a ${zone.nombre}`);
}

function fallbackFromGeolocationError() {
  const fab = $("#btn-near");
  const fabLabel = $("#btn-near-label");
  if (fab) fab.classList.remove("loading");
  if (fabLabel) fabLabel.textContent = "Cerca de mí";

  if (state.userLoc?.source !== "manual") {
    state.sortByNear = false;
    state.userLoc = null;
    clearDistances();
  }

  syncLocationUI();
  renderList();
  showLocationBanner("No pudimos obtener tu ubicación automática. Mostrando listado general o elegí tu zona manualmente");
  if (state.view === "map") {
    toast("Ubicación no disponible. Podés elegir tu zona en Listado.");
  }
}

function requestGpsLocation() {
  const fab = $("#btn-near");
  const fabLabel = $("#btn-near-label");

  if (state.sortByNear && state.userLoc?.source === "gps") {
    state.sortByNear = false;
    state.userLoc = null;
    clearDistances();
    syncLocationUI();
    renderList();
    toast("Orden alfabético general");
    return;
  }

  if (!("geolocation" in navigator)) {
    fallbackFromGeolocationError();
    return;
  }

  if (fab) fab.classList.add("loading");
  if (fabLabel) fabLabel.textContent = "Ubicando…";

  let settled = false;
  const safetyTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    fallbackFromGeolocationError();
  }, 8500);

  try {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return;
        settled = true;
        clearTimeout(safetyTimer);

        const { latitude, longitude } = pos.coords;
        state.userLoc = {
          id: "__gps__",
          lat: latitude,
          lng: longitude,
          label: "tu ubicación",
          source: "gps"
        };
        state.sortByNear = true;
        updateDistances(latitude, longitude);
        hideLocationBanner();
        syncLocationUI();
        renderList();
        if (state.current) openDetail(state.current.id);
        toast("Ordenado por cercanía a tu ubicación");
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(safetyTimer);
        console.warn("Geolocalización no disponible (code " + (err && err.code) + "):", err && err.message);
        fallbackFromGeolocationError();
      },
      { enableHighAccuracy: false, timeout: 7500, maximumAge: 120000 }
    );
  } catch (err) {
    if (!settled) {
      settled = true;
      clearTimeout(safetyTimer);
      console.warn("Excepción al solicitar geolocalización:", err);
      fallbackFromGeolocationError();
    }
  }
}

/* =====================================================================
   Render: Chips, Listado de Tarjetas (con botón Editar en Admin) y Sugerencias
   ===================================================================== */
const ICON_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>';
const ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

function renderChips() {
  const barrios = [...new Set(PARISHES.map(p => p.barrio))].sort((a, b) => a.localeCompare(b, "es-AR"));
  $("#chips").innerHTML =
    `<button class="chip live" data-now aria-pressed="${state.soloNow}"><span class="dot" aria-hidden="true"></span>Misa ahora / Próxima hora</button>` +
    `<button class="chip fav" data-fav aria-pressed="${state.soloFav}">Favoritos</button>` +
    barrios.map(b => `<button class="chip" data-barrio="${b}" aria-pressed="${state.barrio === b}">${b}</button>`).join("");
}

function filtered() {
  const q = norm(state.q);
  const list = PARISHES.filter(p => {
    const pid = String(p.id);
    if (state.soloFav && !state.favs.has(pid)) return false;
    if (state.soloNow && !getMassStatus(p).isNowOrSoon) return false;
    if (state.barrio && p.barrio !== state.barrio) return false;
    if (!q) return true;
    const haystack = norm([p.nombre, p.tipo, p.barrio, p.direccion, ...getTags(p)].join(" "));
    return haystack.includes(q);
  });

  if (state.sortByNear && state.userLoc) {
    list.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  } else {
    list.sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"));
  }
  return list;
}

function renderList() {
  const items = filtered();
  const refNote = state.sortByNear && state.userLoc
    ? ` · desde ${state.userLoc.label}`
    : "";
  $("#count").textContent = items.length
    ? `${items.length} ${items.length === 1 ? "resultado" : "resultados"}${refNote}`
    : "";

  $("#list").innerHTML = items.length ? items.map(p => {
    const pid = String(p.id);
    const status = getMassStatus(p);
    const major = isMajorTemple(p.tipo);
    const badgeCls = getTypeBadgeClass(p.tipo);
    const tags = getTags(p);
    const distTag = typeof p.distanceKm === "number"
      ? `<span class="dist-badge" aria-label="Distancia aproximada">${formatKm(p.distanceKm)}</span>`
      : "";
    const adminEditBtn = state.isAdmin
      ? `<button type="button" class="card-edit-btn" data-edit="${pid}" aria-label="Editar ${p.nombre}">${ICON_EDIT}<span>Editar</span></button>`
      : "";

    return `
    <div class="card-wrap" style="position:relative">
      <button class="card ${major ? "card-major" : ""}" data-id="${pid}">
        <div class="card-head">
          <span class="type-badge ${badgeCls}">${p.tipo || "Templo"}</span>
          ${distTag}
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
  }).join("")
  : `<div class="empty"><strong>No encontramos parroquias</strong>Probá con otro nombre o quitá algún filtro.</div>`;

  renderMapMarkers(items);
}

function renderSuggest() {
  const box = $("#suggest"), q = norm(state.q);
  if (!q) { box.classList.remove("open"); return; }
  const hits = PARISHES
    .filter(p => norm([p.nombre, p.tipo, p.barrio, p.direccion].join(" ")).includes(q))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"))
    .slice(0, 5);
  box.innerHTML = hits.map(p => `<button role="option" data-sug="${p.nombre}"><span>${p.nombre}</span><small>${p.barrio}</small></button>`).join("");
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
   Vista de Detalle, Manejo Inteligente de Enlaces Externos y Correcciones
   ===================================================================== */
function renderMisasBlock(p) {
  const rows = Array.isArray(p.horariosMisa)
    ? p.horariosMisa.map(s => `<div class="row"><span class="d">${s.dia}</span><span class="h">${(s.horarios || []).join(" · ")}</span></div>`).join("")
    : "";
  return `<div class="block"><h3>Horarios de Misa</h3>${rows}</div>`;
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

  const badgeCls = getTypeBadgeClass(p.tipo);
  const tags = getTags(p);
  const tel = getPhone(p);
  const validWebUrl = normalizeOfficialUrl(p.webOficial);
  const mapsPlaceUrl = buildGoogleMapsPlaceUrl(p);
  const distInfo = typeof p.distanceKm === "number" ? ` · A ${formatKm(p.distanceKm)}` : "";

  $("#d-body").innerHTML = `
    <div class="sheet-type-row">
      <span class="type-badge ${badgeCls}">${p.tipo || "Templo"}</span>
    </div>
    <h2 id="d-name">${p.nombre}</h2>
    <p class="sub">${p.direccion}${distInfo}</p>
    <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    ${renderMisasBlock(p)}
    ${renderConfesionesBlock(p)}
    <div class="block"><h3>Contacto y Ubicación</h3>
      <div class="row"><span class="d">Teléfono</span><span class="h">${tel || "No disponible"}</span></div>
      <div class="row"><span class="d">Barrio</span><span class="h">${p.barrio}</span></div>
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

  // Si webOficial es válida se muestra; si está vacía o apunta a dominio de prueba inexistente se oculta automáticamente
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

  // Botón Editar dentro de la hoja si está activo el Modo Admin
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
  bindCorrectionForm();
  document.body.classList.add("open");
  $("#sheet").setAttribute("aria-hidden", "false");
  $("#d-close").focus();
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

  if ( rawId ) {
    const idx = PARISHES.findIndex(x => String(x.id) === rawId);
    if (idx !== -1) {
      PARISHES[idx] = {
        ...PARISHES[idx],
        nombre,
        tipo,
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

  if (state.userLoc) {
    updateDistances(state.userLoc.lat, state.userLoc.lng);
  }

  const cleanList = getCleanExportableParishes();
  Store.set("parishes_admin_data", cleanList);
  Store.set("parishes_cache_v5", cleanList);

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

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* =====================================================================
   Eventos de Interfaz
   ===================================================================== */
$$("[data-target-view]").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.targetView));
});

$("#btn-map-fit").addEventListener("click", () => fitMapToBounds(filtered()));

$("#q").addEventListener("input", e => { state.q = e.target.value; renderSuggest(); renderList(); });
$("#q").addEventListener("focus", renderSuggest);
$("#suggest").addEventListener("click", e => {
  const b = e.target.closest("[data-sug]");
  if (!b) return;
  state.q = b.dataset.sug;
  $("#q").value = state.q;
  $("#suggest").classList.remove("open");
  renderList();
});
document.addEventListener("click", e => { if (!e.target.closest(".field")) $("#suggest").classList.remove("open"); });

$("#manual-zone").addEventListener("change", e => applyManualZone(e.target.value));
$("#btn-gps-inline").addEventListener("click", requestGpsLocation);
$("#btn-near").addEventListener("click", requestGpsLocation);
$("#loc-banner-close").addEventListener("click", hideLocationBanner);

$("#chips").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  if ("now" in b.dataset) state.soloNow = !state.soloNow;
  else if ("fav" in b.dataset) state.soloFav = !state.soloFav;
  else state.barrio = state.barrio === b.dataset.barrio ? null : b.dataset.barrio;
  renderChips();
  renderList();
});

$("#list").addEventListener("click", e => {
  const editBtn = e.target.closest("[data-edit]");
  if (editBtn) return openParishEditor(editBtn.dataset.edit);
  const h = e.target.closest("[data-heart]");
  if (h) return toggleFav(h.dataset.heart);
  const c = e.target.closest("[data-id]");
  if (c) openDetail(c.dataset.id);
});

$("#d-fav").addEventListener("click", () => state.current && toggleFav(state.current.id));
$("#d-edit").addEventListener("click", () => state.current && openParishEditor(state.current.id));
$("#d-close").addEventListener("click", closeDetail);
$("#scrim").addEventListener("click", closeDetail);

// Eventos Modo Administrador
$("#btn-admin-access").addEventListener("click", openAdminLoginModal);
$("#btn-close-login").addEventListener("click", closeAdminLoginModal);
$("#btn-cancel-login").addEventListener("click", closeAdminLoginModal);
$("#admin-login-form").addEventListener("submit", handleAdminLoginSubmit);
$("#btn-admin-logout").addEventListener("click", logoutAdmin);
$("#btn-admin-add").addEventListener("click", () => openParishEditor(null));
$("#fab-admin-add").addEventListener("click", () => openParishEditor(null));
$("#btn-admin-export").addEventListener("click", exportUpdatedJson);
$("#btn-close-edit").addEventListener("click", closeParishEditor);
$("#btn-cancel-edit").addEventListener("click", closeParishEditor);
$("#admin-edit-form").addEventListener("submit", saveParishEditor);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!$("#admin-edit-modal").hidden) return closeParishEditor();
    if (!$("#admin-login-modal").hidden) return closeAdminLoginModal();
    closeDetail();
  }
});

/* =====================================================================
   Inicio Inmediato (Offline-First) + Actualización Asíncrona por Fetch
   ===================================================================== */
function bootstrapApp() {
  syncAdminUI();
  renderZoneSelector();
  renderChips();
  renderList();
  loadParishes();
}

async function loadParishes() {
  // Si el administrador ya guardó modificaciones en localStorage, se respetan para que persistan al recargar
  const adminSaved = Store.get("parishes_admin_data", null);
  if (Array.isArray(adminSaved) && adminSaved.length > 0) {
    PARISHES = adminSaved;
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
      PARISHES = list;
      Store.set("parishes_cache_v5", list);
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

bootstrapApp();

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
