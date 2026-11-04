/* =====================================================================
   CONFIGURACIÓN, ZONAS DE REFERENCIA Y DATOS DE RESPALDO OFFLINE
   ===================================================================== */
const DATA_SOURCE_URL = "./data/parroquias.json";
const CABA_CENTER = [-34.5975, -58.3855];
const CABA_ZOOM = 13;
const MASS_DURATION_MIN = 45;
const NEXT_WINDOW_MIN = 60;

// Puntos de referencia fijos de barrios principales de CABA para selección manual
const REFERENCE_ZONES = [
  { id: "san-nicolas", nombre: "San Nicolás (Microcentro)", lat: -34.6083, lng: -58.3722 },
  { id: "recoleta", nombre: "Recoleta", lat: -34.5875, lng: -58.3931 },
  { id: "retiro", nombre: "Retiro", lat: -34.5987, lng: -58.3845 },
  { id: "palermo", nombre: "Palermo", lat: -34.5826, lng: -58.4259 },
  { id: "belgrano", nombre: "Belgrano", lat: -34.5614, lng: -58.4563 },
  { id: "caballito", nombre: "Caballito", lat: -34.6186, lng: -58.4426 },
  { id: "flores", nombre: "Flores", lat: -34.6285, lng: -58.4641 },
  { id: "almagro", nombre: "Almagro", lat: -34.6095, lng: -58.4208 },
  { id: "san-telmo", nombre: "San Telmo", lat: -34.6212, lng: -58.3731 },
  { id: "balvanera", nombre: "Balvanera (Once)", lat: -34.6096, lng: -58.4060 }
];

// Respaldo local idéntico a data/parroquias.json para garantizar carga inicial 100% offline
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
    imagen: "catedral_metropolitana.jpg",
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
    imagen: "pilar.jpg",
    etiquetas: ["Historica", "Adoracion Perpetua", "Basilica"]
  },
  {
    id: 3,
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
    imagen: "victorias.jpg",
    etiquetas: ["Centro", "Parroquia"]
  },
  {
    id: 4,
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
    imagen: "clinicas.jpg",
    etiquetas: ["Capilla", "Hospitalario"]
  }
];

/* =====================================================================
   Utilidades y Normalización
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const toMinutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

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
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
  };
})();

/* =====================================================================
   Estado de la Aplicación
   ===================================================================== */
let PARISHES = Store.get("parishes_cache_v2", FALLBACK_PARISHES);

const state = {
  view: "list", // 'list' | 'map'
  q: "",
  barrio: null,
  soloFav: false,
  soloNow: false,
  sortByNear: false,
  userLoc: null, // { id, lat, lng, label, source: 'gps' | 'manual' }
  favs: new Set(Store.get("favs", []).map(String)),
  current: null
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
      if (mapInstance) {
        mapInstance.invalidateSize();
        fitMapToBounds(filtered());
      }
    });
  }
}

/* =====================================================================
   Evaluación Inteligente de Horarios ("Misa ahora / Próxima hora")
   ===================================================================== */
function matchesDayGroup(diaLabel, dayIndex) {
  const d = norm(diaLabel);
  if (d.includes("lunes a viernes") || d.includes("lun a vie")) {
    return dayIndex >= 1 && dayIndex <= 5;
  }
  if (d.includes("lunes a sabado")) {
    return dayIndex >= 1 && dayIndex <= 6;
  }
  if (d.includes("todos los dias") || d.includes("diario")) {
    return true;
  }
  let match = false;
  if (d.includes("domingo") && dayIndex === 0) match = true;
  if (d.includes("lunes") && !d.includes("lunes a") && dayIndex === 1) match = true;
  if (d.includes("martes") && dayIndex === 2) match = true;
  if (d.includes("miercoles") && dayIndex === 3) match = true;
  if (d.includes("jueves") && dayIndex === 4) match = true;
  if (d.includes("viernes") && !d.includes("a viernes") && dayIndex === 5) match = true;
  if (d.includes("sabado") && dayIndex === 6) match = true;
  return match;
}

function getTodayMassHours(p, todayIndex) {
  if (Array.isArray(p.horariosMisa)) {
    return p.horariosMisa
      .filter(m => matchesDayGroup(m.dia, todayIndex))
      .flatMap(m => m.horarios || []);
  }
  if (Array.isArray(p.misas)) {
    return p.misas
      .filter(m => Array.isArray(m.d) && m.d.includes(todayIndex))
      .flatMap(m => m.h || []);
  }
  return [];
}

function getMassStatus(p) {
  const now = new Date();
  const today = now.getDay();
  const cur = now.getHours() * 60 + now.getMinutes();

  const todayTimes = getTodayMassHours(p, today)
    .map(h => ({ raw: h, mins: toMinutes(h) }))
    .sort((a, b) => a.mins - b.mins);

  // 1. Misa transcurriendo en este momento (inició hace <= 45 min)
  const ongoing = todayTimes.find(t => cur >= t.mins && cur <= t.mins + MASS_DURATION_MIN);
  if (ongoing) {
    return {
      isNowOrSoon: true,
      label: `Misa ahora · inició ${ongoing.raw} h`
    };
  }

  // 2. Próxima misa dentro de los próximos 60 minutos
  const upcoming = todayTimes.filter(t => t.mins > cur);
  if (upcoming.length) {
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

  return {
    isNowOrSoon: false,
    label: "Hoy no hay más misas"
  };
}

/* =====================================================================
   Mapa Interactivo Completo con OpenStreetMap y Marcadores Jerárquicos
   ===================================================================== */
let mapInstance = null;
let markersLayer = null;
let userMarker = null;
const markerById = new Map();

// SVG para Catedral / Basílica (Cruz monumental con corona/halo)
const SVG_PIN_MAJOR = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v18M7.5 8h9"/>
    <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
  </svg>`;

// SVG para Parroquia / Capilla (Cruz compacta)
const SVG_PIN_MINOR = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
    <path d="M12 4v16M7 9h10"/>
  </svg>`;

function initMap() {
  const mapEl = $("#map");
  if (!mapEl || typeof L === "undefined" || mapInstance) return;

  mapInstance = L.map(mapEl, {
    center: CABA_CENTER,
    zoom: CABA_ZOOM,
    zoomControl: true,
    attributionControl: true
  });

  // Exclusivamente OpenStreetMap (sin marcas de agua ni errores de API key)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);

  // Delegación de clic en el botón del popup para abrir la ficha completa
  mapEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-popup-id]");
    if (btn) {
      openDetail(btn.dataset.popupId);
    }
  });

  renderMapMarkers(filtered());
}

function createHierarchyIcon(p) {
  const major = isMajorTemple(p.tipo);
  const isCapilla = norm(p.tipo) === "capilla";
  const size = major ? 40 : 30;
  const cls = major ? "pin-wrap major" : `pin-wrap minor${isCapilla ? " capilla" : ""}`;
  const svg = major ? SVG_PIN_MAJOR : SVG_PIN_MINOR;

  return L.divIcon({
    className: "custom-pin-icon",
    html: `<div class="${cls}" title="${p.tipo}: ${p.nombre}">${svg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)]
  });
}

function fitMapToBounds(items) {
  if (!mapInstance) return;
  const bounds = [];
  if (state.userLoc) bounds.push([state.userLoc.lat, state.userLoc.lng]);

  items.forEach(p => {
    const coords = getCoords(p);
    if (coords) bounds.push([coords.lat, coords.lng]);
  });

  if (bounds.length > 1) {
    mapInstance.fitBounds(bounds, { padding: [52, 42], maxZoom: 15 });
  } else if (bounds.length === 1) {
    mapInstance.setView(bounds[0], 15);
  } else {
    mapInstance.setView(CABA_CENTER, CABA_ZOOM);
  }
}

function renderMapMarkers(items) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();
  markerById.clear();

  // Si hay ubicación de referencia activa (GPS o Zona Manual), dibuja el punto azul
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
   Render: Chips, Listado de Tarjetas y Sugerencias
   ===================================================================== */
const ICON_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>';

function renderChips() {
  const barrios = [...new Set(PARISHES.map(p => p.barrio))].sort((a, b) => a.localeCompare(b, "es-AR"));
  $("#chips").innerHTML =
    `<button class="chip live" data-now aria-pressed="${state.soloNow}"><span class="dot" aria-hidden="true"></span>Misa ahora / Próxima hora</button>` +
    `<button class="chip fav" data-fav aria-pressed="${state.soloFav}">Favoritos</button>` +
    barrios.map(b => `<button class="chip" data-barrio="${b}" aria-pressed="${state.barrio === b}">${b}</button>`).join("");
}

function filtered() {
  const q = norm(state.q.trim());
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
    </div>`;
  }).join("")
  : `<div class="empty"><strong>No encontramos parroquias</strong>Probá con otro nombre o quitá algún filtro.</div>`;

  renderMapMarkers(items);
}

function renderSuggest() {
  const box = $("#suggest"), q = norm(state.q.trim());
  if (!q) { box.classList.remove("open"); return; }
  const hits = PARISHES
    .filter(p => norm([p.nombre, p.tipo, p.barrio, p.direccion].join(" ")).includes(q))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"))
    .slice(0, 4);
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
   Vista de Detalle y Formulario de Corrección de Horarios
   ===================================================================== */
function renderMisasBlock(p) {
  const rows = Array.isArray(p.horariosMisa)
    ? p.horariosMisa.map(s => `<div class="row"><span class="d">${s.dia}</span><span class="h">${(s.horarios || []).join(" · ")}</span></div>`).join("")
    : "";
  return `<div class="block"><h3>Horarios de Misa</h3>${rows}</div>`;
}

function renderConfesionesBlock(p) {
  const conf = p.horariosConfesiones;
  const content = typeof conf === "string"
    ? `<div class="row"><span class="d">Atención</span><span class="h">${conf}</span></div>`
    : `<div class="row"><span class="d">Atención</span><span class="h">Consultar en secretaría</span></div>`;
  return `<div class="block"><h3>Confesiones</h3>${content}</div>`;
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

function openDetail(id) {
  const pid = String(id);
  const p = PARISHES.find(x => String(x.id) === pid);
  if (!p) return;
  state.current = p;

  const badgeCls = getTypeBadgeClass(p.tipo);
  const tags = getTags(p);
  const tel = getPhone(p);
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
          <label for="c-error">Error detectado</label>
          <input id="c-error" name="error" type="text" required placeholder="Ej.: Misa de domingo 11:30 h cambió">
        </div>
        <div class="form-field">
          <label for="c-schedule">Nuevo horario propuesto</label>
          <textarea id="c-schedule" name="horario" required placeholder="Ej.: Domingos 12:00 y 18:30 h"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-sm cancel" id="btn-cancel-correction">Cancelar</button>
          <button type="submit" class="btn-sm submit">Enviar sugerencia</button>
        </div>
      </form>

      <div class="correction-alert" id="correction-alert" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        <span id="correction-alert-text">¡Gracias! Recibimos tu sugerencia para revisar los horarios.</span>
      </div>
    </div>`;

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
    form.classList.remove("open");
    btnOpen.setAttribute("aria-expanded", "false");
    form.reset();
    $("#correction-alert-text").textContent =
      `¡Gracias${nombre ? `, ${nombre}` : ""}! Recibimos tu sugerencia para verificar este horario.`;
    alertBox.classList.add("show");
    toast("Sugerencia enviada correctamente");
  });
}

function closeDetail() {
  document.body.classList.remove("open");
  $("#sheet").setAttribute("aria-hidden", "true");
  state.current = null;
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
  const h = e.target.closest("[data-heart]");
  if (h) return toggleFav(h.dataset.heart);
  const c = e.target.closest("[data-id]");
  if (c) openDetail(c.dataset.id);
});
$("#d-fav").addEventListener("click", () => state.current && toggleFav(state.current.id));
$("#d-close").addEventListener("click", closeDetail);
$("#scrim").addEventListener("click", closeDetail);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDetail(); });

/* =====================================================================
   Inicio Inmediato (Offline-First) + Actualización Asíncrona por Fetch
   ===================================================================== */
function bootstrapApp() {
  renderZoneSelector();
  renderChips();
  renderList();
  loadParishes();
}

async function loadParishes() {
  try {
    const res = await fetch(DATA_SOURCE_URL, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.parishes || []);
    if (list.length) {
      PARISHES = list;
      Store.set("parishes_cache_v2", list);
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
   PWA: Registro de Service Worker
   ===================================================================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.warn("No se pudo registrar el Service Worker:", err);
    });
  });
}
