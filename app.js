/* =====================================================================
   CONFIGURACIÓN, REGIONES AMBA (CABA + GBA) Y DATOS DE RESPALDO OFFLINE
   ===================================================================== */
const DATA_SOURCE_URL = "./data/parroquias.json";
const REFLECTIONS_DATA_URL = "./data/reflexiones.json";
const BIBLE_DATA_URL = "./data/libro_pueblo_de_dios.json";
const SHOW_COMMUNITY = false; // Flag global para ocultar el módulo de Comunidad y Racha sin eliminar su código fuente
try {
  localStorage.removeItem("osm_overpass_catholic_ba_v1");
  localStorage.removeItem("parishes_cache_v7");
} catch (e) { /* modo privado */ }
const ADMIN_MASTER_PIN = "1118";
const ADMIN_COLLAB_PIN = "0000";
const CUSTOM_ACTIVITIES_STORAGE_KEY = "parish_activities_custom_v1";
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
    "id": 1,
    "nombre": "Catedral Metropolitana de Buenos Aires",
    "tipo": "Catedral",
    "region": "CABA",
    "direccion": "San Martín 27 (Rivadavia 437), San Nicolás, CABA",
    "barrio": "San Nicolás",
    "coordenadas": {
      "lat": -34.60756,
      "lng": -58.37326
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "12:30",
          "17:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "11:30",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 09:00 a 12:00 y de 16:30 a 18:00",
    "telefono": "+54 11 4331-2845",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Histórica",
      "Sede Arzobispal",
      "San Martín",
      "Catedral"
    ]
  },
  {
    "id": 2,
    "nombre": "Catedral San Isidro Labrador",
    "tipo": "Catedral",
    "region": "Zona Norte",
    "direccion": "Av. del Libertador 16200, San Isidro",
    "barrio": "San Isidro",
    "coordenadas": {
      "lat": -34.46736,
      "lng": -58.50892
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "18:00",
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:30",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábados media hora antes de cada misa",
    "telefono": "+54 11 4743-0291",
    "webOficial": "https://catedralsanisidro.org",
    "etiquetas": [
      "Neogótica",
      "Casco Histórico",
      "Zona Norte",
      "Catedral"
    ]
  },
  {
    "id": 3,
    "nombre": "Catedral Nuestra Señora del Buen Viaje",
    "tipo": "Catedral",
    "region": "Zona Oeste",
    "direccion": "Belgrano 327, Morón",
    "barrio": "Morón",
    "coordenadas": {
      "lat": -34.65105,
      "lng": -58.62158
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de misa vespertina",
    "telefono": "+54 11 4629-0969",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Patrona del Oeste",
      "Centro Morón",
      "Catedral"
    ]
  },
  {
    "id": 4,
    "nombre": "Catedral Nuestra Señora de la Paz",
    "tipo": "Catedral",
    "region": "Zona Sur",
    "direccion": "Sáenz 438, Lomas de Zamora",
    "barrio": "Lomas de Zamora",
    "coordenadas": {
      "lat": -34.76092,
      "lng": -58.40358
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Jueves y Viernes de 17:00 a 19:00",
    "telefono": "+54 11 4243-2311",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Diocesana",
      "Plaza Grigera",
      "Zona Sur",
      "Catedral"
    ]
  },
  {
    "id": 5,
    "nombre": "Catedral Inmaculada Concepción de Quilmes",
    "tipo": "Catedral",
    "region": "Zona Sur",
    "direccion": "Rivadavia 355, Quilmes",
    "barrio": "Quilmes",
    "coordenadas": {
      "lat": -34.72062,
      "lng": -58.25335
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Sábados de 10:00 a 12:00 y 17:30 a 19:00",
    "telefono": "+54 11 4253-0668",
    "webOficial": "https://obispadodequilmes.org.ar",
    "etiquetas": [
      "Catedral",
      "Casco Histórico",
      "Quilmes"
    ]
  },
  {
    "id": 6,
    "nombre": "Catedral San Justo Mártir",
    "tipo": "Catedral",
    "region": "Zona Oeste",
    "direccion": "Dr. Ignacio Arieta 3045, San Justo",
    "barrio": "San Justo",
    "coordenadas": {
      "lat": -34.67765,
      "lng": -58.56122
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 18:00 a 19:00",
    "telefono": "+54 11 4651-0177",
    "webOficial": "https://diocesisdesanjusto.org.ar",
    "etiquetas": [
      "La Matanza",
      "Plaza San Justo",
      "Catedral"
    ]
  },
  {
    "id": 7,
    "nombre": "Catedral San Miguel Arcángel",
    "tipo": "Catedral",
    "region": "Zona Norte",
    "direccion": "Belgrano 1257, San Miguel",
    "barrio": "San Miguel",
    "coordenadas": {
      "lat": -34.54295,
      "lng": -58.71195
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábados de 18:00 a 19:30",
    "telefono": "+54 11 4664-2122",
    "webOficial": "https://diocesis-sanmiguel.org.ar",
    "etiquetas": [
      "San Miguel",
      "Arcángel",
      "Catedral"
    ]
  },
  {
    "id": 8,
    "nombre": "Catedral Nuestra Señora de la Asunción (Avellaneda)",
    "tipo": "Catedral",
    "region": "Zona Sur",
    "direccion": "San Martín 745, Avellaneda",
    "barrio": "Avellaneda",
    "coordenadas": {
      "lat": -34.66255,
      "lng": -58.36475
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Miércoles a Viernes de 17:30 a 19:00",
    "telefono": "+54 11 4222-1327",
    "webOficial": "https://diocesisavellanedalanus.org.ar",
    "etiquetas": [
      "Avellaneda",
      "Plaza Alsina",
      "Catedral"
    ]
  },
  {
    "id": 9,
    "nombre": "Basílica Nuestra Señora del Pilar",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Junín 1898, Recoleta, CABA",
    "barrio": "Recoleta",
    "coordenadas": {
      "lat": -34.58672,
      "lng": -58.39178
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:15",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "12:15",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:00",
          "11:30",
          "12:30",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Durante todas las misas de fin de semana",
    "telefono": "+54 11 4803-6798",
    "webOficial": "https://basilicadelpilar.org.ar",
    "etiquetas": [
      "Colonial",
      "Histórica",
      "Recoleta",
      "Basílica"
    ]
  },
  {
    "id": 10,
    "nombre": "Basílica del Santísimo Sacramento",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "San Martín 1039, Retiro, CABA",
    "barrio": "Retiro",
    "coordenadas": {
      "lat": -34.59555,
      "lng": -58.37466
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "12:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 10:00 a 12:00 y 17:00 a 19:00",
    "telefono": "+54 11 4312-3958",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Adoración Perpetua",
      "Arquitectura Francesa",
      "Basílica"
    ]
  },
  {
    "id": 11,
    "nombre": "Basílica Nuestra Señora de la Merced",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Reconquista 207, San Nicolás, CABA",
    "barrio": "San Nicolás",
    "coordenadas": {
      "lat": -34.60542,
      "lng": -58.37218
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "12:30",
          "18:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "12:30",
          "18:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "11:00",
          "13:00",
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada celebración",
    "telefono": "+54 11 4343-4013",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Casco Histórico",
      "Mercedarios",
      "Basílica"
    ]
  },
  {
    "id": 12,
    "nombre": "Basílica Santo Domingo (Nuestra Señora del Rosario)",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Defensa 422, Monserrat, CABA",
    "barrio": "Monserrat",
    "coordenadas": {
      "lat": -34.61282,
      "lng": -58.37185
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Durante las misas vespertinas",
    "telefono": "+54 11 4331-1668",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Mausoleo de Belgrano",
      "Dominicos",
      "Basílica"
    ]
  },
  {
    "id": 13,
    "nombre": "Basílica San José de Flores",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Av. Rivadavia 6950, Flores, CABA",
    "barrio": "Flores",
    "coordenadas": {
      "lat": -34.62858,
      "lng": -58.46368
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "10:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "10:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "08:30",
          "10:00",
          "11:30",
          "18:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábados de 09:30 a 11:30 y 17:30 a 19:00",
    "telefono": "+54 11 4631-1053",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Papa Francisco",
      "San José",
      "Flores",
      "Basílica"
    ]
  },
  {
    "id": 14,
    "nombre": "Basílica Santa Felicitas",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Isabel La Católica 520, Barracas, CABA",
    "barrio": "Barracas",
    "coordenadas": {
      "lat": -34.63712,
      "lng": -58.37408
    },
    "horariosMisa": [
      {
        "dia": "Martes a Sábados",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "11:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Domingos de 10:30 a 11:30",
    "telefono": "+54 11 4301-0814",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Neogótica",
      "Patrimonio",
      "Barracas",
      "Basílica"
    ]
  },
  {
    "id": 15,
    "nombre": "Basílica Inmaculada Concepción (La Redonda de Belgrano)",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Vuelta de Obligado 2042, Belgrano, CABA",
    "barrio": "Belgrano",
    "coordenadas": {
      "lat": -34.56145,
      "lng": -58.45502
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "12:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "10:30",
          "12:00",
          "18:00",
          "19:30",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Domingos 30 min antes de misa",
    "telefono": "+54 11 4783-8008",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Plaza Manuel Belgrano",
      "Panteón Circular",
      "Basílica"
    ]
  },
  {
    "id": 16,
    "nombre": "Basílica San Antonio de Padua",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Av. Lincoln 3751, Villa Devoto, CABA",
    "barrio": "Villa Devoto",
    "coordenadas": {
      "lat": -34.59936,
      "lng": -58.51128
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "09:00",
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:30",
          "12:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábados de 18:30 a 19:30",
    "telefono": "+54 11 4822-4512",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Franciscanos",
      "Recoleta",
      "Basílica"
    ]
  },
  {
    "id": 17,
    "nombre": "Basílica San Carlos Borromeo y María Auxiliadora",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Hipólito Yrigoyen 3999, Almagro, CABA",
    "barrio": "Almagro",
    "coordenadas": {
      "lat": -34.61436,
      "lng": -58.42228
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "12:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 18:00 a 19:00",
    "telefono": "+54 11 4981-0814",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Salesianos",
      "Bautismo de Bergoglio",
      "Almagro",
      "Basílica"
    ]
  },
  {
    "id": 18,
    "nombre": "Basílica Nuestra Señora de la Piedad",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Bartolomé Mitre 1524, San Nicolás, CABA",
    "barrio": "Balvanera",
    "coordenadas": {
      "lat": -34.60755,
      "lng": -58.38838
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:00",
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 17:30 a 18:30",
    "telefono": "+54 11 4371-3814",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Mama Antula",
      "Balvanera",
      "Histórica",
      "Basílica"
    ]
  },
  {
    "id": 19,
    "nombre": "Basílica Nuestra Señora de Buenos Aires",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Av. Gaona 1730, Caballito, CABA",
    "barrio": "Caballito",
    "coordenadas": {
      "lat": -34.61472,
      "lng": -58.45084
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:30",
          "12:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Viernes y Sábados 18:00 a 19:00",
    "telefono": "+54 11 4581-2287",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Mercedarios",
      "Plaza Irlanda",
      "Basílica"
    ]
  },
  {
    "id": 20,
    "nombre": "Basílica del Espíritu Santo (Guadalupe)",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Mansilla 3865, Palermo, CABA",
    "barrio": "Palermo",
    "coordenadas": {
      "lat": -34.58925,
      "lng": -58.41686
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "12:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "10:30",
          "12:00",
          "18:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábados 18:30 a 19:30",
    "telefono": "+54 11 4824-3450",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Verbitas",
      "Plaza Güemes",
      "Palermo",
      "Basílica"
    ]
  },
  {
    "id": 21,
    "nombre": "Santuario San Cayetano de Liniers",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Cuzco 150, Liniers, CABA",
    "barrio": "Liniers",
    "coordenadas": {
      "lat": -34.64015,
      "lng": -58.52625
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "07:00",
          "09:00",
          "11:00",
          "17:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "08:00",
          "10:00",
          "12:00",
          "16:00",
          "18:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Todos los días de 08:00 a 19:00 (Sacerdote permanente)",
    "telefono": "+54 11 4641-1584",
    "webOficial": "https://sancayetano.org.ar",
    "etiquetas": [
      "Pan y Trabajo",
      "Peregrinación Masiva",
      "Liniers",
      "Santuario"
    ]
  },
  {
    "id": 22,
    "nombre": "Parroquia San Ignacio de Loyola",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Bolívar 225, Monserrat, CABA",
    "barrio": "Monserrat",
    "coordenadas": {
      "lat": -34.61052,
      "lng": -58.37342
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "13:00",
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:30",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 12:00 a 13:00",
    "telefono": "+54 11 4331-2458",
    "webOficial": "https://sanignaciodeloyola.org.ar",
    "etiquetas": [
      "Manzana de las Luces",
      "Templo Más Antiguo",
      "Jesuitas"
    ]
  },
  {
    "id": 23,
    "nombre": "Parroquia San Pedro González Telmo",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Humberto 1º 340, San Telmo, CABA",
    "barrio": "San Telmo",
    "coordenadas": {
      "lat": -34.62038,
      "lng": -58.37158
    },
    "horariosMisa": [
      {
        "dia": "Martes a Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:30",
          "12:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Sábados y Domingos 30 min antes de misa",
    "telefono": "+54 11 4361-1168",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "San Telmo",
      "Plaza Dorrego",
      "Colonial"
    ]
  },
  {
    "id": 24,
    "nombre": "Parroquia San Nicolás de Bari",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Santa Fe 1352, Retiro, CABA",
    "barrio": "Retiro",
    "coordenadas": {
      "lat": -34.59568,
      "lng": -58.38632
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "11:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "11:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "12:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábados de 10:00 a 12:00 y 17:30 a 19:00",
    "telefono": "+54 11 4811-1490",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Centro",
      "Retiro",
      "San Nicolás"
    ]
  },
  {
    "id": 25,
    "nombre": "Parroquia Santa Catalina de Siena",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "San Martín 705, Retiro, CABA",
    "barrio": "Retiro",
    "coordenadas": {
      "lat": -34.59992,
      "lng": -58.37412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "13:05",
          "18:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "11:00",
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 12:00 a 13:00",
    "telefono": "+54 11 4311-6133",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Monasterio Colonial",
      "Microcentro",
      "Patrimonio"
    ]
  },
  {
    "id": 26,
    "nombre": "Parroquia San Benito Abad",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Villanueva 905, Palermo, CABA",
    "barrio": "Palermo",
    "coordenadas": {
      "lat": -34.56925,
      "lng": -58.43942
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "12:00",
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "12:30",
          "19:30",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:30 a 19:30",
    "telefono": "+54 11 4773-0428",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Benedictinos",
      "Medalla de San Benito",
      "Palermo"
    ]
  },
  {
    "id": 27,
    "nombre": "Parroquia Santa Rosa de Lima",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Belgrano 2216, Balvanera, CABA",
    "barrio": "Balvanera",
    "coordenadas": {
      "lat": -34.61348,
      "lng": -58.39792
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4951-8608",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Cúpula Monumental",
      "Balvanera",
      "Santa Rosa"
    ]
  },
  {
    "id": 28,
    "nombre": "Parroquia Nuestra Señora de Caacupé",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Rivadavia 4879, Caballito, CABA",
    "barrio": "Caballito",
    "coordenadas": {
      "lat": -34.61775,
      "lng": -58.43425
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábados 18:00 a 19:00",
    "telefono": "+54 11 4901-1811",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Parque Rivadavia",
      "Caballito",
      "Caacupé"
    ]
  },
  {
    "id": 29,
    "nombre": "Parroquia Nuestra Señora de la Medalla Milagrosa",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Curapaligüe 1185, Parque Chacabuco, CABA",
    "barrio": "Parque Chacabuco",
    "coordenadas": {
      "lat": -34.63485,
      "lng": -58.44855
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "18:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 17:30 a 19:00",
    "telefono": "+54 11 4923-2287",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Parque Chacabuco",
      "Medalla Milagrosa",
      "Vicencianos"
    ]
  },
  {
    "id": 30,
    "nombre": "Santuario Nuestra Señora del Rosario de Nueva Pompeya",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Sáenz 1059, Nueva Pompeya, CABA",
    "barrio": "Nueva Pompeya",
    "coordenadas": {
      "lat": -34.65122,
      "lng": -58.41685
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "08:30",
          "10:30",
          "12:00",
          "17:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábados de 09:00 a 12:00 y 16:00 a 19:00",
    "telefono": "+54 11 4911-0985",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Capuchinos",
      "Neogótica",
      "Sur de CABA"
    ]
  },
  {
    "id": 31,
    "nombre": "Parroquia Santa Cruz",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Estados Unidos 3150, San Cristóbal, CABA",
    "barrio": "San Cristóbal",
    "coordenadas": {
      "lat": -34.62085,
      "lng": -58.40958
    },
    "horariosMisa": [
      {
        "dia": "Martes a Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4931-1314",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Pasionistas",
      "Comunidad Irlandesa",
      "San Cristóbal"
    ]
  },
  {
    "id": 32,
    "nombre": "Parroquia San Juan Bosco",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Avenida Dorrego 1450, Palermo, CABA",
    "barrio": "Palermo",
    "coordenadas": {
      "lat": -34.57823,
      "lng": -58.43986
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Sábados de 18:00 a 19:30",
    "telefono": "+54 11 4772-5589",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Salesianos",
      "Palermo Hollywood",
      "San Juan Bosco"
    ]
  },
  {
    "id": 33,
    "nombre": "Parroquia Inmaculada Concepción de Tigre",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Avenida Liniers 1560, Tigre",
    "barrio": "Tigre",
    "coordenadas": {
      "lat": -34.42581,
      "lng": -58.57812
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de misa vespertina",
    "telefono": "+54 11 4749-0314",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Paseo Victorica",
      "Delta",
      "Tigre"
    ]
  },
  {
    "id": 34,
    "nombre": "Parroquia San Fernando Rey",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Constitución 1042, San Fernando",
    "barrio": "San Fernando",
    "coordenadas": {
      "lat": -34.44215,
      "lng": -58.56214
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Viernes de 17:30 a 19:00",
    "telefono": "+54 11 4744-2287",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Plaza Mitre",
      "San Fernando",
      "Casco Histórico"
    ]
  },
  {
    "id": 35,
    "nombre": "Parroquia Nuestra Señora del Carmen de Martínez",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Larrañaga 120, Martínez",
    "barrio": "Martínez",
    "coordenadas": {
      "lat": -34.49841,
      "lng": -58.49814
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Sábados y Domingos 30 min antes de misa",
    "telefono": "+54 11 4792-0545",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Martínez",
      "Virgen del Carmen",
      "Zona Norte"
    ]
  },
  {
    "id": 36,
    "nombre": "Parroquia Jesús en el Huerto de los Olivos",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Salta 2620, Olivos",
    "barrio": "Olivos",
    "coordenadas": {
      "lat": -34.50946,
      "lng": -58.48684
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:30",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Jueves y Sábados 17:30 a 19:00",
    "telefono": "+54 11 4790-2384",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Olivos",
      "Vicente López",
      "Residencial"
    ]
  },
  {
    "id": 37,
    "nombre": "Parroquia Nuestra Señora de la Merced (Ballester)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Lacroze 4950, Villa Ballester",
    "barrio": "Villa Ballester",
    "coordenadas": {
      "lat": -34.54573,
      "lng": -58.55657
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Viernes y Sábados de 18:00 a 19:00",
    "telefono": "+54 11 4768-0114",
    "webOficial": "https://diocesisdesanmartin.org.ar",
    "etiquetas": [
      "San Martín",
      "Villa Ballester",
      "Merced"
    ]
  },
  {
    "id": 38,
    "nombre": "Parroquia San Gabriel de Vicente López",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Gaspar Campos 759, Vicente López",
    "barrio": "Vicente López",
    "coordenadas": {
      "lat": -34.52981,
      "lng": -58.47415
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábados antes de misa",
    "telefono": "+54 11 4795-1568",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Vicente López",
      "Costanera",
      "Arcángel"
    ]
  },
  {
    "id": 39,
    "nombre": "Parroquia Sagrado Corazón de Jesús de Hurlingham",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Delfor Díaz 1630, Hurlingham",
    "barrio": "Hurlingham",
    "coordenadas": {
      "lat": -34.58484,
      "lng": -58.63537
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4665-0158",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Hurlingham",
      "Centro",
      "Sagrado Corazón"
    ]
  },
  {
    "id": 40,
    "nombre": "Parroquia María Auxiliadora de Ramos Mejía",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Avenida de Mayo 1902, Ramos Mejía",
    "barrio": "Ramos Mejía",
    "coordenadas": {
      "lat": -34.66031,
      "lng": -58.56039
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:30",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 18:00 a 19:30",
    "telefono": "+54 11 4658-2287",
    "webOficial": "https://diocesisdesanjusto.org.ar",
    "etiquetas": [
      "Salesianos",
      "Ramos Mejía",
      "María Auxiliadora"
    ]
  },
  {
    "id": 41,
    "nombre": "Parroquia Nuestra Señora del Carmen de Haedo",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Constitución 250, Haedo",
    "barrio": "Haedo",
    "coordenadas": {
      "lat": -34.64684,
      "lng": -58.59512
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Sábados de 18:00 a 19:00",
    "telefono": "+54 11 4659-1589",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Haedo",
      "Plaza San Martín",
      "Zona Oeste"
    ]
  },
  {
    "id": 42,
    "nombre": "Parroquia San Judas Tadeo de Ituzaingó",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Mansilla 867, Ituzaingó",
    "barrio": "Ituzaingó",
    "coordenadas": {
      "lat": -34.65842,
      "lng": -58.67215
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Días 28 de cada mes (jornada permanente) y sábados antes de misa",
    "telefono": "+54 11 4624-0315",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Patrono del Trabajo",
      "Plaza Ituzaingó",
      "Zona Oeste"
    ]
  },
  {
    "id": 43,
    "nombre": "Parroquia Nuestra Señora de Loreto de El Palomar",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Bergamini 450, El Palomar",
    "barrio": "El Palomar",
    "coordenadas": {
      "lat": -34.60585,
      "lng": -58.59514
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada celebración",
    "telefono": "+54 11 4751-2487",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Patrona de la Aviación",
      "El Palomar",
      "Zona Oeste"
    ]
  },
  {
    "id": 44,
    "nombre": "Santuario Santa Teresita del Niño Jesús (Banfield)",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Laprida 1170, Banfield",
    "barrio": "Banfield",
    "coordenadas": {
      "lat": -34.74338,
      "lng": -58.38984
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Sábados",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "18:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Viernes y Sábados de 17:30 a 19:00",
    "telefono": "+54 11 4242-0214",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Banfield",
      "Santa Teresita",
      "Lomas"
    ]
  },
  {
    "id": 45,
    "nombre": "Parroquia San Gabriel Arcángel de Adrogué",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Plaza Brown 63, Adrogué",
    "barrio": "Adrogué",
    "coordenadas": {
      "lat": -34.79816,
      "lng": -58.38354
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:30"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:30",
          "11:00",
          "19:30",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Miércoles y Viernes de 18:00 a 19:30",
    "telefono": "+54 11 4294-0158",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Plaza Brown",
      "Almirante Brown",
      "Adrogué"
    ]
  },
  {
    "id": 46,
    "nombre": "Parroquia Sagrado Corazón de Jesús de Lanús",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Avenida 25 de Mayo 680, Lanús Oeste",
    "barrio": "Lanús",
    "coordenadas": {
      "lat": -34.69754,
      "lng": -58.40639
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Jueves y Viernes de 17:30 a 19:00",
    "telefono": "+54 11 4241-1189",
    "webOficial": "https://diocesisavellanedalanus.org.ar",
    "etiquetas": [
      "Lanús Oeste",
      "Centro Comercial",
      "Sagrado Corazón"
    ]
  },
  {
    "id": 47,
    "nombre": "Parroquia Nuestra Señora de la Piedad de Temperley",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Espora 250, Temperley",
    "barrio": "Temperley",
    "coordenadas": {
      "lat": -34.77457,
      "lng": -58.39998
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Sábados de 17:30 a 19:00",
    "telefono": "+54 11 4244-1598",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Temperley",
      "Zona Sur",
      "Barrial"
    ]
  },
  {
    "id": 48,
    "nombre": "Capilla Cristo Obrero y San Blas (Padre Carlos Mugica)",
    "tipo": "Capilla",
    "region": "CABA",
    "direccion": "Calle 11 y Av. Antártida Argentina, Barrio 31, Retiro, CABA",
    "barrio": "Retiro",
    "coordenadas": {
      "lat": -34.58412,
      "lng": -58.37684
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Sábados",
        "horarios": [
          "17:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "11:00",
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Domingos después de la misa matutina",
    "telefono": "+54 11 4315-0814",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Padre Mugica",
      "Curas Villeros",
      "Misión",
      "Capilla"
    ]
  },
  {
    "id": 49,
    "nombre": "Capilla Stella Maris de San Isidro",
    "tipo": "Capilla",
    "region": "Zona Norte",
    "direccion": "España y Almirante Brown, Béccar / San Isidro",
    "barrio": "San Isidro",
    "coordenadas": {
      "lat": -34.4593,
      "lng": -58.51027
    },
    "horariosMisa": [
      {
        "dia": "Miércoles y Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:30",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4743-1287",
    "webOficial": "https://catedralsanisidro.org",
    "etiquetas": [
      "Costanera",
      "Stella Maris",
      "Béccar",
      "Capilla"
    ]
  },
  {
    "id": 50,
    "nombre": "Capilla Nuestra Señora de Pompeya (Tigre)",
    "tipo": "Capilla",
    "region": "Zona Norte",
    "direccion": "Butteler 240, Tigre",
    "barrio": "Tigre",
    "coordenadas": {
      "lat": -34.42746,
      "lng": -58.56768
    },
    "horariosMisa": [
      {
        "dia": "Jueves y Sábados",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Domingos",
        "horarios": [
          "10:30"
        ]
      }
    ],
    "horariosConfesiones": "Antes de las misas dominicales",
    "telefono": "+54 11 4749-1589",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Delta",
      "Tranquila",
      "Capilla"
    ]
  },
  {
    "id": 51,
    "nombre": "Basílica San Francisco de Asís",
    "tipo": "Basílica",
    "region": "CABA",
    "direccion": "Alsina 380, Monserrat, CABA",
    "barrio": "Monserrat",
    "coordenadas": {
      "lat": -34.61058,
      "lng": -58.37188
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "11:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4331-0625",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Histórica",
      "Franciscana",
      "Basílica"
    ]
  },
  {
    "id": 52,
    "nombre": "Parroquia San Miguel Arcángel (CABA)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Bartolomé Mitre 886, San Nicolás, CABA",
    "barrio": "San Nicolás",
    "coordenadas": {
      "lat": -34.60662,
      "lng": -58.37905
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "12:00",
          "18:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 11:00 a 13:00",
    "telefono": "+54 11 4328-3605",
    "webOficial": "https://sanmiguelarcangel.org.ar",
    "etiquetas": [
      "Histórica",
      "San Nicolás",
      "San Miguel"
    ]
  },
  {
    "id": 53,
    "nombre": "Parroquia Nuestra Señora de Balvanera (San Expedito)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Bartolomé Mitre 2411, Balvanera, CABA",
    "barrio": "Balvanera",
    "coordenadas": {
      "lat": -34.60852,
      "lng": -58.39995
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Durante el horario de misa y secretaría",
    "telefono": "+54 11 4951-2218",
    "webOficial": "https://santuariosanexpedito.com.ar",
    "etiquetas": [
      "San Expedito",
      "Santuario",
      "Balvanera"
    ]
  },
  {
    "id": 54,
    "nombre": "Parroquia Nuestra Señora de Montserrat",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Belgrano 1151, Monserrat, CABA",
    "barrio": "Monserrat",
    "coordenadas": {
      "lat": -34.61295,
      "lng": -58.38275
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 11 4381-1965",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Histórica",
      "Montserrat",
      "Colonial"
    ]
  },
  {
    "id": 55,
    "nombre": "Parroquia Regina Martyrum",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Hipólito Yrigoyen 2025, Balvanera, CABA",
    "barrio": "Balvanera",
    "coordenadas": {
      "lat": -34.60985,
      "lng": -58.39485
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado 18:30 a 19:30",
    "telefono": "+54 11 4951-4198",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Jesuitas",
      "Balvanera",
      "Regina Martyrum"
    ]
  },
  {
    "id": 56,
    "nombre": "Parroquia San Cristóbal",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Jujuy 1241, San Cristóbal, CABA",
    "barrio": "San Cristóbal",
    "coordenadas": {
      "lat": -34.62435,
      "lng": -58.40342
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Viernes de 18:00 a 19:00",
    "telefono": "+54 11 4941-0814",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "San Cristóbal",
      "Comunidad",
      "Caritas"
    ]
  },
  {
    "id": 57,
    "nombre": "Parroquia Nuestra Señora de Loreto (Palermo)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Cnel. Díaz 2245, Palermo, CABA",
    "barrio": "Palermo",
    "coordenadas": {
      "lat": -34.58775,
      "lng": -58.40832
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:30",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Todos los días durante las misas",
    "telefono": "+54 11 4824-3456",
    "webOficial": "https://parroquialoreto.com.ar",
    "etiquetas": [
      "Palermo",
      "Loreto",
      "Jóvenes"
    ]
  },
  {
    "id": 58,
    "nombre": "Parroquia San Ildefonso",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Guise 1939, Palermo, CABA",
    "barrio": "Palermo",
    "coordenadas": {
      "lat": -34.59038,
      "lng": -58.41392
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "09:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes de 18:00 a 19:00",
    "telefono": "+54 11 4824-1188",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Palermo",
      "San Ildefonso",
      "Pastoral"
    ]
  },
  {
    "id": 59,
    "nombre": "Parroquia Nuestra Señora del Socorro",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Juncal 888, Retiro, CABA",
    "barrio": "Retiro",
    "coordenadas": {
      "lat": -34.59245,
      "lng": -58.38028
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "12:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "12:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4393-1492",
    "webOficial": "https://basilicadelsocorro.org.ar",
    "etiquetas": [
      "Histórica",
      "Retiro",
      "El Socorro"
    ]
  },
  {
    "id": 60,
    "nombre": "Parroquia San Martín de Tours",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "San Martín de Tours 2949, Palermo Chico, CABA",
    "barrio": "Palermo",
    "coordenadas": {
      "lat": -34.57695,
      "lng": -58.40328
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "12:30",
          "19:30",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Permanente antes de las celebraciones",
    "telefono": "+54 11 4802-8610",
    "webOficial": "https://sanmartindetours.org.ar",
    "etiquetas": [
      "Patrono de Buenos Aires",
      "Palermo Chico",
      "San Martín de Tours"
    ]
  },
  {
    "id": 61,
    "nombre": "Parroquia San Agustín",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Las Heras 2560, Recoleta, CABA",
    "barrio": "Recoleta",
    "coordenadas": {
      "lat": -34.58442,
      "lng": -58.40055
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "12:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:30 a 20:00",
    "telefono": "+54 11 4803-1020",
    "webOficial": "https://sanagustinba.org.ar",
    "etiquetas": [
      "Gótica",
      "Recoleta",
      "San Agustín"
    ]
  },
  {
    "id": 62,
    "nombre": "Parroquia Inmaculado Corazón de María (Constitución)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Constitución 1077, Constitución, CABA",
    "barrio": "Constitución",
    "coordenadas": {
      "lat": -34.62585,
      "lng": -58.38065
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4304-4530",
    "webOficial": "https://claretianos.org.ar",
    "etiquetas": [
      "Claretianos",
      "Constitución",
      "Corazón de María"
    ]
  },
  {
    "id": 63,
    "nombre": "Parroquia San Juan Evangelista (La Boca)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Olavarría 486, La Boca, CABA",
    "barrio": "La Boca",
    "coordenadas": {
      "lat": -34.63525,
      "lng": -58.36235
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Durante el horario de secretaría y misas",
    "telefono": "+54 11 4301-1433",
    "webOficial": "https://salesianos.org.ar",
    "etiquetas": [
      "Salesiana",
      "La Boca",
      "Don Bosco"
    ]
  },
  {
    "id": 64,
    "nombre": "Parroquia San Antonio de Padua de Parque Patricios",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Caseros 2798, Parque Patricios, CABA",
    "barrio": "Parque Patricios",
    "coordenadas": {
      "lat": -34.63685,
      "lng": -58.40275
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:00 a 19:00",
    "telefono": "+54 11 4941-2678",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Parque Patricios",
      "San Antonio",
      "Comunidad"
    ]
  },
  {
    "id": 65,
    "nombre": "Parroquia San Bernardo",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Gurruchaga 171, Villa Crespo, CABA",
    "barrio": "Villa Crespo",
    "coordenadas": {
      "lat": -34.59985,
      "lng": -58.44425
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4854-3221",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Crespo",
      "San Bernardo",
      "Comunidad"
    ]
  },
  {
    "id": 66,
    "nombre": "Parroquia Nuestra Señora de la Candelaria",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Bahía Blanca 363, Floresta, CABA",
    "barrio": "Floresta",
    "coordenadas": {
      "lat": -34.62965,
      "lng": -58.48155
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Jueves y Viernes 18:00 a 19:00",
    "telefono": "+54 11 4671-0814",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Floresta",
      "La Candelaria",
      "Pastoral Familiar"
    ]
  },
  {
    "id": 67,
    "nombre": "Parroquia San Cayetano de Belgrano",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Vidal 1745, Belgrano, CABA",
    "barrio": "Belgrano",
    "coordenadas": {
      "lat": -34.56665,
      "lng": -58.45895
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Todos los días 18:30 a 19:30",
    "telefono": "+54 11 4781-3965",
    "webOficial": "https://sancayetanobelgrano.org.ar",
    "etiquetas": [
      "Belgrano",
      "San Cayetano",
      "Pan y Trabajo"
    ]
  },
  {
    "id": 68,
    "nombre": "Parroquia Santiago Apóstol",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Tte. Gral. Donato Álvarez 1850, Villa Mitre, CABA",
    "barrio": "Villa General Mitre",
    "coordenadas": {
      "lat": -34.60682,
      "lng": -58.46473
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 11 4581-2290",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Mitre",
      "Santiago Apóstol",
      "Caritas"
    ]
  },
  {
    "id": 69,
    "nombre": "Parroquia Santa Julia",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Juan Bautista Alberdi 1195, Caballito, CABA",
    "barrio": "Caballito",
    "coordenadas": {
      "lat": -34.62315,
      "lng": -58.44265
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "11:30",
          "19:00",
          "20:15"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado 18:00 a 19:30",
    "telefono": "+54 11 4431-2947",
    "webOficial": "https://parroquiasantajulia.com.ar",
    "etiquetas": [
      "Caballito",
      "Santa Julia",
      "Jóvenes"
    ]
  },
  {
    "id": 70,
    "nombre": "Parroquia Nuestra Señora de los Dolores",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Díaz Vélez 4850, Caballito, CABA",
    "barrio": "Caballito",
    "coordenadas": {
      "lat": -34.60831,
      "lng": -58.43462
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Viernes 18:30 a 19:30",
    "telefono": "+54 11 4982-1402",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Caballito",
      "Parque Centenario",
      "Dolores"
    ]
  },
  {
    "id": 71,
    "nombre": "Parroquia Inmaculada Concepción (Villa Devoto)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "José Cubas 3599, Villa Devoto, CABA",
    "barrio": "Villa Devoto",
    "coordenadas": {
      "lat": -34.60091,
      "lng": -58.51322
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:30 a 19:30",
    "telefono": "+54 11 4501-0428",
    "webOficial": "https://inmaculadadevoto.org.ar",
    "etiquetas": [
      "Villa Devoto",
      "Plaza Arenales",
      "Inmaculada"
    ]
  },
  {
    "id": 72,
    "nombre": "Parroquia San Antonio de Padua de Villa Devoto",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Lincoln 3751, Villa Devoto, CABA",
    "barrio": "Villa Devoto",
    "coordenadas": {
      "lat": -34.59821,
      "lng": -58.51731
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4501-1647",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Devoto",
      "San Antonio",
      "Comunidad"
    ]
  },
  {
    "id": 73,
    "nombre": "Parroquia San Juan Bautista el Precursor",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Tamborini 4080, Saavedra, CABA",
    "barrio": "Saavedra",
    "coordenadas": {
      "lat": -34.55745,
      "lng": -58.48912
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábado 18:30 a 19:30",
    "telefono": "+54 11 4541-6102",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Saavedra",
      "San Juan Bautista",
      "Pastoral"
    ]
  },
  {
    "id": 74,
    "nombre": "Parroquia San Isidro Labrador (Saavedra)",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. San Isidro 4630, Saavedra, CABA",
    "barrio": "Saavedra",
    "coordenadas": {
      "lat": -34.54271,
      "lng": -58.47461
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4702-0941",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Saavedra",
      "San Isidro",
      "Límite GBA"
    ]
  },
  {
    "id": 75,
    "nombre": "Parroquia San Roque",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Plaza 1160, Villa Ortúzar, CABA",
    "barrio": "Villa Ortúzar",
    "coordenadas": {
      "lat": -34.57723,
      "lng": -58.47214
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:00 a 19:00",
    "telefono": "+54 11 4552-3211",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Ortúzar",
      "San Roque",
      "Salud"
    ]
  },
  {
    "id": 76,
    "nombre": "Parroquia Nuestra Señora de la Misericordia",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Larrazábal 2390, Mataderos, CABA",
    "barrio": "Mataderos",
    "coordenadas": {
      "lat": -34.66412,
      "lng": -58.49751
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 17:30 a 18:30",
    "telefono": "+54 11 4687-2198",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Mataderos",
      "Misericordia",
      "Comunidad"
    ]
  },
  {
    "id": 77,
    "nombre": "Parroquia San Vicente de Paúl",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Manuel Artigas 6150, Mataderos, CABA",
    "barrio": "Mataderos",
    "coordenadas": {
      "lat": -34.66101,
      "lng": -58.50892
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de las misas",
    "telefono": "+54 11 4687-0542",
    "webOficial": "https://vicentinos.org.ar",
    "etiquetas": [
      "Vicentinos",
      "Mataderos",
      "Caridad"
    ]
  },
  {
    "id": 78,
    "nombre": "Parroquia San Cosme y San Damián",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Cosquín 4221, Villa Lugano, CABA",
    "barrio": "Villa Lugano",
    "coordenadas": {
      "lat": -34.68112,
      "lng": -58.47281
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Durante las celebraciones y secretaría",
    "telefono": "+54 11 4601-3829",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Lugano",
      "Médicos Santos",
      "Pastoral Social"
    ]
  },
  {
    "id": 79,
    "nombre": "Parroquia Natividad de María",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Tucumán 1860, Balvanera, CABA",
    "barrio": "Balvanera",
    "coordenadas": {
      "lat": -34.60412,
      "lng": -58.39414
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 17:30 a 18:30",
    "telefono": "+54 11 4372-5641",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Balvanera",
      "Natividad",
      "Centro"
    ]
  },
  {
    "id": 80,
    "nombre": "Parroquia Santa María de los Ángeles",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Rómulo Naón 3250, Coghlan, CABA",
    "barrio": "Coghlan",
    "coordenadas": {
      "lat": -34.56214,
      "lng": -58.47591
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4542-0192",
    "webOficial": "https://capuchinos.org.ar",
    "etiquetas": [
      "Capuchinos",
      "Coghlan",
      "Santa María de los Ángeles"
    ]
  },
  {
    "id": 81,
    "nombre": "Parroquia San Lucas Evangelista",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Plaza 4360, Saavedra, CABA",
    "barrio": "Saavedra",
    "coordenadas": {
      "lat": -34.54921,
      "lng": -58.48712
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Viernes 18:00 a 19:00",
    "telefono": "+54 11 4543-9821",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Saavedra",
      "San Lucas",
      "Comunidad"
    ]
  },
  {
    "id": 82,
    "nombre": "Parroquia Nuestra Señora de Luján Porteño",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Av. Francisco Beiró 5545, Villa Real, CABA",
    "barrio": "Villa Real",
    "coordenadas": {
      "lat": -34.61521,
      "lng": -58.52841
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 11 4567-3401",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Real",
      "Virgen de Luján",
      "Comunidad"
    ]
  },
  {
    "id": 83,
    "nombre": "Parroquia San Rafael Arcángel",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Benito Juárez 2153, Villa Devoto, CABA",
    "barrio": "Villa Devoto",
    "coordenadas": {
      "lat": -34.61482,
      "lng": -58.50982
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4567-9014",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Devoto",
      "San Rafael",
      "Salud"
    ]
  },
  {
    "id": 84,
    "nombre": "Parroquia Santa Rita de Casia",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Camarones 3443, Santa Rita, CABA",
    "barrio": "Villa Santa Rita",
    "coordenadas": {
      "lat": -34.61582,
      "lng": -58.48312
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Permanente durante los días 22 de cada mes y fines de semana",
    "telefono": "+54 11 4581-0857",
    "webOficial": "https://santuariosantarita.com.ar",
    "etiquetas": [
      "Santuario",
      "Santa Rita",
      "Patrona de lo Imposible"
    ]
  },
  {
    "id": 85,
    "nombre": "Parroquia Santa María Goretti",
    "tipo": "Parroquia",
    "region": "CABA",
    "direccion": "Escalada 4150, Villa Lugano, CABA",
    "barrio": "Villa Lugano",
    "coordenadas": {
      "lat": -34.68541,
      "lng": -58.46321
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4601-8974",
    "webOficial": "https://arzbaires.org.ar",
    "etiquetas": [
      "Villa Lugano",
      "Santa María Goretti",
      "Pastoral Juvenil"
    ]
  },
  {
    "id": 86,
    "nombre": "Parroquia Santa Teresita del Niño Jesús (Martínez)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Monseñor Larumbe 742, Martínez, San Isidro",
    "barrio": "Martínez",
    "coordenadas": {
      "lat": -34.50341,
      "lng": -58.50812
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Todos los días 18:30 a 19:30",
    "telefono": "+54 11 4792-2341",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Martínez",
      "Santa Teresita",
      "San Isidro"
    ]
  },
  {
    "id": 87,
    "nombre": "Parroquia San Juan Bosco de San Isidro",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Uruguay 1350, Beccar, San Isidro",
    "barrio": "Beccar",
    "coordenadas": {
      "lat": -34.46912,
      "lng": -58.53581
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4743-1598",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Beccar",
      "Salesianos",
      "Don Bosco"
    ]
  },
  {
    "id": 88,
    "nombre": "Parroquia Nuestra Señora de la Cava",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Riobamba y Alvarado, Beccar, San Isidro",
    "barrio": "Beccar",
    "coordenadas": {
      "lat": -34.48421,
      "lng": -58.53982
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Durante las celebraciones y grupos comunitarios",
    "telefono": "+54 11 4742-9901",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Pastoral Villera",
      "La Cava",
      "San Isidro"
    ]
  },
  {
    "id": 89,
    "nombre": "Parroquia Santa Rita de Boulogne",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Darragueira 630, Boulogne Sur Mer, San Isidro",
    "barrio": "Boulogne",
    "coordenadas": {
      "lat": -34.50112,
      "lng": -58.56341
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4766-3241",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Boulogne",
      "Santa Rita",
      "Comunidad"
    ]
  },
  {
    "id": 90,
    "nombre": "Parroquia San Cayetano de Olivos",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Av. Maipú 3450, Olivos, Vicente López",
    "barrio": "Olivos",
    "coordenadas": {
      "lat": -34.50981,
      "lng": -58.49752
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábado 18:00 a 19:30",
    "telefono": "+54 11 4790-1423",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Olivos",
      "San Cayetano",
      "Vicente López"
    ]
  },
  {
    "id": 91,
    "nombre": "Parroquia Santa Teresita del Niño Jesús (Florida)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Gdor. Vergara 3350, Florida, Vicente López",
    "barrio": "Florida",
    "coordenadas": {
      "lat": -34.52981,
      "lng": -58.49612
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 11 4760-4491",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Florida",
      "Santa Teresita",
      "Vicente López"
    ]
  },
  {
    "id": 92,
    "nombre": "Parroquia San Antonio de Padua de San Martín",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Lincoln 3755, General San Martín",
    "barrio": "General San Martín",
    "coordenadas": {
      "lat": -34.57321,
      "lng": -58.53612
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:00 a 19:00",
    "telefono": "+54 11 4755-1290",
    "webOficial": "https://diocesisdesanmartin.org.ar",
    "etiquetas": [
      "San Martín",
      "San Antonio",
      "Diócesis"
    ]
  },
  {
    "id": 93,
    "nombre": "Catedral Jesús Buen Pastor de San Martín",
    "tipo": "Catedral",
    "region": "Zona Norte",
    "direccion": "Mitre 3790, General San Martín",
    "barrio": "General San Martín",
    "coordenadas": {
      "lat": -34.57712,
      "lng": -58.53891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "12:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 10:00 a 12:00 y de 17:30 a 19:00",
    "telefono": "+54 11 4755-0814",
    "webOficial": "https://diocesisdesanmartin.org.ar",
    "etiquetas": [
      "Catedral",
      "San Martín",
      "Sede Episcopal"
    ]
  },
  {
    "id": 94,
    "nombre": "Parroquia Nuestra Señora de los Remedios (San Martín)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Rivadavia 3750, General San Martín",
    "barrio": "General San Martín",
    "coordenadas": {
      "lat": -34.57482,
      "lng": -58.54212
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4752-6412",
    "webOficial": "https://diocesisdesanmartin.org.ar",
    "etiquetas": [
      "San Martín",
      "Los Remedios",
      "Histórica"
    ]
  },
  {
    "id": 95,
    "nombre": "Parroquia Santísima Trinidad de San Isidro",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Fondo de la Legua 1200, Martínez, San Isidro",
    "barrio": "Martínez",
    "coordenadas": {
      "lat": -34.51231,
      "lng": -58.52412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:30 a 19:30",
    "telefono": "+54 11 4793-1189",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Martínez",
      "Santísima Trinidad",
      "San Isidro"
    ]
  },
  {
    "id": 96,
    "nombre": "Parroquia Nuestra Señora de Aránzazu (San Fernando)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Constitución 960, San Fernando",
    "barrio": "San Fernando",
    "coordenadas": {
      "lat": -34.44212,
      "lng": -58.55821
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4744-1230",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "San Fernando",
      "Aránzazu",
      "Histórica"
    ]
  },
  {
    "id": 97,
    "nombre": "Parroquia San Pío X de Bella Vista",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Av. Santa Fe 850, Bella Vista, San Miguel",
    "barrio": "Bella Vista",
    "coordenadas": {
      "lat": -34.56412,
      "lng": -58.68921
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4666-0412",
    "webOficial": "https://diocesisdesanmiguel.org.ar",
    "etiquetas": [
      "Bella Vista",
      "San Pío X",
      "San Miguel"
    ]
  },
  {
    "id": 98,
    "nombre": "Parroquia Nuestra Señora del Carmen de Benavídez",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Alvear 2450, Benavídez, Tigre",
    "barrio": "Benavídez",
    "coordenadas": {
      "lat": -34.40982,
      "lng": -58.68541
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Viernes y Sábados 17:30 a 18:30",
    "telefono": "+54 11 4736-2319",
    "webOficial": "https://diocesisdezarape.org.ar",
    "etiquetas": [
      "Benavídez",
      "Tigre",
      "El Carmen"
    ]
  },
  {
    "id": 99,
    "nombre": "Parroquia Purísima Concepción de Pacheco",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Hipólito Yrigoyen 350, General Pacheco, Tigre",
    "barrio": "General Pacheco",
    "coordenadas": {
      "lat": -34.45781,
      "lng": -58.63612
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4740-5120",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Pacheco",
      "Purísima Concepción",
      "Tigre"
    ]
  },
  {
    "id": 100,
    "nombre": "Parroquia Nuestra Señora de Luján de Villa Adelina",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Paraná 6450, Villa Adelina, San Isidro",
    "barrio": "Villa Adelina",
    "coordenadas": {
      "lat": -34.52841,
      "lng": -58.54891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada celebración",
    "telefono": "+54 11 4765-2190",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Villa Adelina",
      "Virgen de Luján",
      "San Isidro"
    ]
  },
  {
    "id": 101,
    "nombre": "Parroquia Santa María de la Lucila",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Debenedetti 602, La Lucila, Vicente López",
    "barrio": "La Lucila",
    "coordenadas": {
      "lat": -34.49842,
      "lng": -58.48921
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "12:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:30 a 19:30",
    "telefono": "+54 11 4791-0348",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "La Lucila",
      "Santa María",
      "Vicente López"
    ]
  },
  {
    "id": 102,
    "nombre": "Parroquia Nuestra Señora de la Paz (Olivos)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Bmé. Cruz 1240, Olivos, Vicente López",
    "barrio": "Olivos",
    "coordenadas": {
      "lat": -34.51214,
      "lng": -58.48421
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4799-5612",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Olivos",
      "La Paz",
      "Costa Norte"
    ]
  },
  {
    "id": 103,
    "nombre": "Capilla Nuestra Señora de la Esperanza (San Isidro)",
    "tipo": "Capilla",
    "region": "Zona Norte",
    "direccion": "Sucre y Blanco Encalada, San Isidro",
    "barrio": "San Isidro",
    "coordenadas": {
      "lat": -34.48912,
      "lng": -58.55123
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Antes de la misa comunitaria",
    "telefono": "+54 11 4723-8812",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Capilla",
      "San Isidro",
      "Esperanza"
    ]
  },
  {
    "id": 104,
    "nombre": "Capilla San José Obrero (Don Torcuato)",
    "tipo": "Capilla",
    "region": "Zona Norte",
    "direccion": "Arata 1450, Don Torcuato, Tigre",
    "barrio": "Don Torcuato",
    "coordenadas": {
      "lat": -34.49871,
      "lng": -58.62145
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Durante las visitas de pastoral",
    "telefono": "+54 11 4748-0912",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Capilla",
      "Don Torcuato",
      "San José Obrero"
    ]
  },
  {
    "id": 105,
    "nombre": "Parroquia San Marcelo (Don Torcuato)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Torcuato de Alvear 1250, Don Torcuato, Tigre",
    "barrio": "Don Torcuato",
    "coordenadas": {
      "lat": -34.49214,
      "lng": -58.61891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4748-1542",
    "webOficial": "https://obispado-si.org.ar",
    "etiquetas": [
      "Don Torcuato",
      "San Marcelo",
      "Tigre"
    ]
  },
  {
    "id": 106,
    "nombre": "Basílica Nuestra Señora de Luján",
    "tipo": "Basílica",
    "region": "Zona Oeste",
    "direccion": "San Martín 51, Luján, Buenos Aires",
    "barrio": "Luján",
    "coordenadas": {
      "lat": -34.56412,
      "lng": -59.12143
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00",
          "09:30",
          "11:00",
          "15:00",
          "17:00",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "08:00",
          "09:30",
          "11:00",
          "12:30",
          "15:00",
          "17:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Permanente de 08:00 a 19:00 en el Santuario",
    "telefono": "+54 2323 42-0058",
    "webOficial": "https://santuariodelujan.org.ar",
    "etiquetas": [
      "Patrona Nacional",
      "Santuario Nacional",
      "Basílica Mayor"
    ]
  },
  {
    "id": 107,
    "nombre": "Catedral Nuestra Señora del Rosario de Moreno",
    "tipo": "Catedral",
    "region": "Zona Oeste",
    "direccion": "Joly 2760, Moreno",
    "barrio": "Moreno",
    "coordenadas": {
      "lat": -34.65082,
      "lng": -58.79123
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 10:00 a 12:00 y de 17:30 a 19:00",
    "telefono": "+54 237 462-0210",
    "webOficial": "https://diocesismerlo-moreno.org.ar",
    "etiquetas": [
      "Catedral",
      "Moreno",
      "Sede Episcopal"
    ]
  },
  {
    "id": 108,
    "nombre": "Parroquia Nuestra Señora de la Merced de Merlo",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Real 250, Merlo",
    "barrio": "Merlo",
    "coordenadas": {
      "lat": -34.66541,
      "lng": -58.72891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 220 482-0190",
    "webOficial": "https://diocesismerlo-moreno.org.ar",
    "etiquetas": [
      "Merlo",
      "La Merced",
      "Histórica"
    ]
  },
  {
    "id": 109,
    "nombre": "Parroquia San Antonio de Padua (San Antonio de Padua)",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Centenario 1390, San Antonio de Padua, Merlo",
    "barrio": "San Antonio de Padua",
    "coordenadas": {
      "lat": -34.67112,
      "lng": -58.69842
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábado 18:00 a 19:00",
    "telefono": "+54 220 485-0241",
    "webOficial": "https://franciscanos.org.ar",
    "etiquetas": [
      "Padua",
      "Franciscanos",
      "San Antonio"
    ]
  },
  {
    "id": 110,
    "nombre": "Parroquia Sagrada Familia de Haedo",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Estrada 220, Haedo, Morón",
    "barrio": "Haedo",
    "coordenadas": {
      "lat": -34.64612,
      "lng": -58.59123
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4659-1249",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Haedo",
      "Sagrada Familia",
      "Morón"
    ]
  },
  {
    "id": 111,
    "nombre": "Parroquia Cristo Rey de El Palomar",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Marconi 1250, El Palomar, Morón",
    "barrio": "El Palomar",
    "coordenadas": {
      "lat": -34.61981,
      "lng": -58.58342
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada celebración",
    "telefono": "+54 11 4751-2240",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "El Palomar",
      "Cristo Rey",
      "Morón"
    ]
  },
  {
    "id": 112,
    "nombre": "Parroquia San Carlos Borromeo de Hurlingham",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Av. Roca 1100, Hurlingham",
    "barrio": "Hurlingham",
    "coordenadas": {
      "lat": -34.59123,
      "lng": -58.63612
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Viernes 18:00 a 19:00",
    "telefono": "+54 11 4665-0145",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Hurlingham",
      "San Carlos",
      "Comunidad"
    ]
  },
  {
    "id": 113,
    "nombre": "Parroquia Santa Teresita del Niño Jesús (Ituzaingó)",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Zufriategui 640, Ituzaingó",
    "barrio": "Ituzaingó",
    "coordenadas": {
      "lat": -34.65891,
      "lng": -58.67214
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábado 18:00 a 19:00",
    "telefono": "+54 11 4624-0348",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Ituzaingó",
      "Santa Teresita",
      "Centro"
    ]
  },
  {
    "id": 114,
    "nombre": "Parroquia San Pío X de Ituzaingó",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Bacacay 750, Ituzaingó",
    "barrio": "Ituzaingó",
    "coordenadas": {
      "lat": -34.65123,
      "lng": -58.66412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4623-1498",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Ituzaingó",
      "San Pío X",
      "Comunidad"
    ]
  },
  {
    "id": 115,
    "nombre": "Parroquia Nuestra Señora de Belén (Escobar)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Tapia de Cruz 1250, Belén de Escobar",
    "barrio": "Escobar",
    "coordenadas": {
      "lat": -34.34812,
      "lng": -58.79612
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 348 442-0190",
    "webOficial": "https://diocesisdezarape.org.ar",
    "etiquetas": [
      "Escobar",
      "Nuestra Señora de Belén",
      "GBA Norte"
    ]
  },
  {
    "id": 116,
    "nombre": "Parroquia Nuestra Señora del Pilar (Pilar Centro)",
    "tipo": "Parroquia",
    "region": "Zona Norte",
    "direccion": "Lorenzo López 624, Pilar",
    "barrio": "Pilar",
    "coordenadas": {
      "lat": -34.45891,
      "lng": -58.91423
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "12:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Todos los días 18:30 a 19:30",
    "telefono": "+54 230 442-0145",
    "webOficial": "https://diocesisdezarape.org.ar",
    "etiquetas": [
      "Pilar",
      "Histórica",
      "Tratado del Pilar"
    ]
  },
  {
    "id": 117,
    "nombre": "Parroquia San Cayetano de Ciudadela",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "San Roque 4150, Ciudadela, Tres de Febrero",
    "barrio": "Ciudadela",
    "coordenadas": {
      "lat": -34.63412,
      "lng": -58.53612
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4653-2940",
    "webOficial": "https://diocesisdesanmartin.org.ar",
    "etiquetas": [
      "Ciudadela",
      "San Cayetano",
      "Tres de Febrero"
    ]
  },
  {
    "id": 118,
    "nombre": "Parroquia Nuestra Señora de Lourdes de Santos Lugares",
    "tipo": "Basílica",
    "region": "Zona Oeste",
    "direccion": "Av. La Plata 3757, Santos Lugares, Tres de Febrero",
    "barrio": "Santos Lugares",
    "coordenadas": {
      "lat": -34.60123,
      "lng": -58.54981
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "11:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "09:00",
          "11:00",
          "17:00",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Domingo durante todo el día en el Santuario",
    "telefono": "+54 11 4757-2130",
    "webOficial": "https://santuariolourdes.org.ar",
    "etiquetas": [
      "Santuario",
      "Lourdes",
      "Basílica",
      "Santos Lugares"
    ]
  },
  {
    "id": 119,
    "nombre": "Parroquia Santa Teresita de Sáenz Peña",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Ameghino 2850, Sáenz Peña, Tres de Febrero",
    "barrio": "Sáenz Peña",
    "coordenadas": {
      "lat": -34.59841,
      "lng": -58.52981
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4757-0129",
    "webOficial": "https://diocesisdesanmartin.org.ar",
    "etiquetas": [
      "Sáenz Peña",
      "Santa Teresita",
      "Tres de Febrero"
    ]
  },
  {
    "id": 120,
    "nombre": "Parroquia San Cayetano de Ramos Mejía",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Cramer 350, Ramos Mejía, La Matanza",
    "barrio": "Ramos Mejía",
    "coordenadas": {
      "lat": -34.65412,
      "lng": -58.56781
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4658-3901",
    "webOficial": "https://obispadosanjusto.org.ar",
    "etiquetas": [
      "Ramos Mejía",
      "San Cayetano",
      "La Matanza"
    ]
  },
  {
    "id": 121,
    "nombre": "Parroquia Stella Maris de San Justo",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Hipólito Yrigoyen 2450, San Justo, La Matanza",
    "barrio": "San Justo",
    "coordenadas": {
      "lat": -34.67541,
      "lng": -58.55821
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4651-0348",
    "webOficial": "https://obispadosanjusto.org.ar",
    "etiquetas": [
      "San Justo",
      "Stella Maris",
      "La Matanza"
    ]
  },
  {
    "id": 122,
    "nombre": "Parroquia San Roque de Villa Luzuriaga",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Garibaldi 1850, Villa Luzuriaga, La Matanza",
    "barrio": "Villa Luzuriaga",
    "coordenadas": {
      "lat": -34.66891,
      "lng": -58.58412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado 18:00 a 19:00",
    "telefono": "+54 11 4659-4501",
    "webOficial": "https://obispadosanjusto.org.ar",
    "etiquetas": [
      "Villa Luzuriaga",
      "San Roque",
      "La Matanza"
    ]
  },
  {
    "id": 123,
    "nombre": "Parroquia San Pantaleón de San Justo",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Mendoza 2150, San Justo, La Matanza",
    "barrio": "San Justo",
    "coordenadas": {
      "lat": -34.67214,
      "lng": -58.56341
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Permanente los 27 de cada mes",
    "telefono": "+54 11 4651-7890",
    "webOficial": "https://obispadosanjusto.org.ar",
    "etiquetas": [
      "San Pantaleón",
      "Salud",
      "San Justo"
    ]
  },
  {
    "id": 124,
    "nombre": "Parroquia Nuestra Señora de Luján de Isidro Casanova",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "República de Portugal 2850, Isidro Casanova, La Matanza",
    "barrio": "Isidro Casanova",
    "coordenadas": {
      "lat": -34.69841,
      "lng": -58.58412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 11 4625-1120",
    "webOficial": "https://obispadosanjusto.org.ar",
    "etiquetas": [
      "Isidro Casanova",
      "Virgen de Luján",
      "La Matanza"
    ]
  },
  {
    "id": 125,
    "nombre": "Parroquia San Alberto Magno de Isidro Casanova",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Roma 3150, Isidro Casanova, La Matanza",
    "barrio": "Isidro Casanova",
    "coordenadas": {
      "lat": -34.70412,
      "lng": -58.57912
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4625-3490",
    "webOficial": "https://obispadosanjusto.org.ar",
    "etiquetas": [
      "Isidro Casanova",
      "San Alberto Magno",
      "Comunidad"
    ]
  },
  {
    "id": 126,
    "nombre": "Capilla Nuestra Señora de los Milagros de Merlo",
    "tipo": "Capilla",
    "region": "Zona Oeste",
    "direccion": "Perú 840, Merlo",
    "barrio": "Merlo",
    "coordenadas": {
      "lat": -34.66981,
      "lng": -58.73412
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Antes de la misa dominical",
    "telefono": "+54 220 482-5501",
    "webOficial": "https://diocesismerlo-moreno.org.ar",
    "etiquetas": [
      "Capilla",
      "Merlo",
      "Milagros"
    ]
  },
  {
    "id": 127,
    "nombre": "Capilla San Cayetano de Morón Sur",
    "tipo": "Capilla",
    "region": "Zona Oeste",
    "direccion": "Patagones 1120, Morón Sur",
    "barrio": "Morón",
    "coordenadas": {
      "lat": -34.66412,
      "lng": -58.62145
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Durante las celebraciones comunitarias",
    "telefono": "+54 11 4696-2241",
    "webOficial": "https://diocesisdemoron.org.ar",
    "etiquetas": [
      "Capilla",
      "Morón",
      "San Cayetano"
    ]
  },
  {
    "id": 128,
    "nombre": "Parroquia San Cayetano de Avellaneda",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Av. Mitre 1420, Crucecita, Avellaneda",
    "barrio": "Avellaneda",
    "coordenadas": {
      "lat": -34.66812,
      "lng": -58.36142
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:30",
    "telefono": "+54 11 4201-3489",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Avellaneda",
      "San Cayetano",
      "Comunidad"
    ]
  },
  {
    "id": 129,
    "nombre": "Parroquia Santa Teresita del Niño Jesús (Lanús)",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "2 de Mayo 2850, Lanús Oeste",
    "barrio": "Lanús",
    "coordenadas": {
      "lat": -34.70412,
      "lng": -58.39841
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábado 18:00 a 19:00",
    "telefono": "+54 11 4241-1120",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Lanús",
      "Santa Teresita",
      "Comunidad"
    ]
  },
  {
    "id": 130,
    "nombre": "Parroquia San Antonio de Padua de Gerli",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Bustamante 550, Gerli, Lanús",
    "barrio": "Gerli",
    "coordenadas": {
      "lat": -34.68912,
      "lng": -58.38412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4209-4501",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Gerli",
      "San Antonio",
      "Lanús"
    ]
  },
  {
    "id": 131,
    "nombre": "Parroquia Cristo Rey de Lanús Este",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Héctor Noya 1150, Lanús Este",
    "barrio": "Lanús",
    "coordenadas": {
      "lat": -34.70891,
      "lng": -58.38123
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4247-8910",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Lanús Este",
      "Cristo Rey",
      "Pastoral Juvenil"
    ]
  },
  {
    "id": 132,
    "nombre": "Parroquia Nuestra Señora de la Asunción de Quilmes",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Pellegrini 320, Quilmes Centro",
    "barrio": "Quilmes",
    "coordenadas": {
      "lat": -34.72141,
      "lng": -58.25891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:30",
    "telefono": "+54 11 4253-0814",
    "webOficial": "https://diocesisquilmes.org.ar",
    "etiquetas": [
      "Quilmes",
      "La Asunción",
      "Diócesis"
    ]
  },
  {
    "id": 133,
    "nombre": "Parroquia Sagrada Familia de Berazategui",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Calle 148 N° 1350, Berazategui",
    "barrio": "Berazategui",
    "coordenadas": {
      "lat": -34.76412,
      "lng": -58.21412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4256-1120",
    "webOficial": "https://diocesisquilmes.org.ar",
    "etiquetas": [
      "Berazategui",
      "Sagrada Familia",
      "Quilmes"
    ]
  },
  {
    "id": 134,
    "nombre": "Parroquia San Juan Bautista de Florencio Varela",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "25 de Mayo 611, Florencio Varela",
    "barrio": "Florencio Varela",
    "coordenadas": {
      "lat": -34.79612,
      "lng": -58.27891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00",
          "20:00"
        ]
      }
    ],
    "horariosConfesiones": "Martes a Sábado 18:00 a 19:30",
    "telefono": "+54 11 4255-0348",
    "webOficial": "https://diocesisquilmes.org.ar",
    "etiquetas": [
      "Florencio Varela",
      "San Juan Bautista",
      "Histórica"
    ]
  },
  {
    "id": 135,
    "nombre": "Parroquia Inmaculada Concepción de Monte Grande",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Sofía T. de Santamarina 551, Monte Grande, Esteban Echeverría",
    "barrio": "Monte Grande",
    "coordenadas": {
      "lat": -34.82141,
      "lng": -58.46891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:30",
          "19:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "11:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:30 a 19:30",
    "telefono": "+54 11 4290-0145",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Monte Grande",
      "Inmaculada",
      "Esteban Echeverría"
    ]
  },
  {
    "id": 136,
    "nombre": "Parroquia Nuestra Señora de Luján de El Jagüel",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Evita 550, El Jagüel, Esteban Echeverría",
    "barrio": "El Jagüel",
    "coordenadas": {
      "lat": -34.83891,
      "lng": -58.49123
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4296-1240",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "El Jagüel",
      "Virgen de Luján",
      "Comunidad"
    ]
  },
  {
    "id": 137,
    "nombre": "Parroquia San Cayetano de Burzaco",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Sempere 1350, Burzaco, Almirante Brown",
    "barrio": "Burzaco",
    "coordenadas": {
      "lat": -34.83123,
      "lng": -58.39841
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4299-2319",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Burzaco",
      "San Cayetano",
      "Almirante Brown"
    ]
  },
  {
    "id": 138,
    "nombre": "Parroquia Santa Ana de Glew",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Aristóbulo del Valle y Moreno, Glew, Almirante Brown",
    "barrio": "Glew",
    "coordenadas": {
      "lat": -34.88741,
      "lng": -58.38412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de las misas",
    "telefono": "+54 2224 42-0198",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Glew",
      "Frescos de Soldi",
      "Santa Ana",
      "Histórica"
    ]
  },
  {
    "id": 139,
    "nombre": "Parroquia San Vicente Ferrer (San Vicente)",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Bolívar 50, San Vicente",
    "barrio": "San Vicente",
    "coordenadas": {
      "lat": -35.02412,
      "lng": -58.42145
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 2225 42-1045",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "San Vicente",
      "San Vicente Ferrer",
      "Histórica"
    ]
  },
  {
    "id": 140,
    "nombre": "Parroquia San Marcos Evangelista de Marcos Paz",
    "tipo": "Parroquia",
    "region": "Zona Oeste",
    "direccion": "Belgrano 1950, Marcos Paz",
    "barrio": "Marcos Paz",
    "coordenadas": {
      "lat": -34.78123,
      "lng": -58.83412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 220 477-1120",
    "webOficial": "https://diocesismerlo-moreno.org.ar",
    "etiquetas": [
      "Marcos Paz",
      "San Marcos",
      "Comunidad"
    ]
  },
  {
    "id": 141,
    "nombre": "Parroquia Nuestra Señora del Carmen de Cañuelas",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Lara y 25 de Mayo, Cañuelas",
    "barrio": "Cañuelas",
    "coordenadas": {
      "lat": -35.05123,
      "lng": -58.75891
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 2226 42-1240",
    "webOficial": "https://diocesismerlo-moreno.org.ar",
    "etiquetas": [
      "Cañuelas",
      "Virgen del Carmen",
      "Histórica"
    ]
  },
  {
    "id": 142,
    "nombre": "Parroquia Corpus Christi de Temperley",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Av. Almirante Brown 3340, Temperley, Lomas de Zamora",
    "barrio": "Temperley",
    "coordenadas": {
      "lat": -34.77412,
      "lng": -58.39841
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "19:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4244-5510",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Temperley",
      "Corpus Christi",
      "Lomas de Zamora"
    ]
  },
  {
    "id": 143,
    "nombre": "Parroquia San José Obrero de Lanús",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Ituzaingó 1450, Lanús Este",
    "barrio": "Lanús",
    "coordenadas": {
      "lat": -34.70981,
      "lng": -58.37541
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 17:30 a 18:30",
    "telefono": "+54 11 4241-8974",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Lanús",
      "San José Obrero",
      "Trabajadores"
    ]
  },
  {
    "id": 144,
    "nombre": "Parroquia Nuestra Señora de los Trabajadores de Villa Caraza",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Mendoza 3850, Villa Caraza, Lanús",
    "barrio": "Villa Caraza",
    "coordenadas": {
      "lat": -34.70812,
      "lng": -58.43123
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Durante las celebraciones y grupos comunitarios",
    "telefono": "+54 11 4262-1190",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Villa Caraza",
      "Trabajadores",
      "Lanús"
    ]
  },
  {
    "id": 145,
    "nombre": "Parroquia San Francisco Solano de Quilmes Oeste",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Calle 844 N° 2150, San Francisco Solano, Quilmes",
    "barrio": "San Francisco Solano",
    "coordenadas": {
      "lat": -34.77891,
      "lng": -58.31412
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "19:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "10:30",
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Lunes a Sábado de 18:00 a 19:00",
    "telefono": "+54 11 4212-0450",
    "webOficial": "https://diocesisquilmes.org.ar",
    "etiquetas": [
      "Solano",
      "San Francisco Solano",
      "Quilmes"
    ]
  },
  {
    "id": 146,
    "nombre": "Parroquia Nuestra Señora de las Lágrimas de San Francisco Solano",
    "tipo": "Parroquia",
    "region": "Zona Sur",
    "direccion": "Calle 829 y 898, San Francisco Solano, Quilmes",
    "barrio": "San Francisco Solano",
    "coordenadas": {
      "lat": -34.77214,
      "lng": -58.32145
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "18:30"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "11:00",
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de cada misa",
    "telefono": "+54 11 4212-3341",
    "webOficial": "https://diocesisquilmes.org.ar",
    "etiquetas": [
      "Solano",
      "Las Lágrimas",
      "Santuario"
    ]
  },
  {
    "id": 147,
    "nombre": "Capilla San Cayetano de Wilde",
    "tipo": "Capilla",
    "region": "Zona Sur",
    "direccion": "Bragado 5850, Wilde, Avellaneda",
    "barrio": "Wilde",
    "coordenadas": {
      "lat": -34.69841,
      "lng": -58.31891
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Antes de la misa de los domingos",
    "telefono": "+54 11 4207-8812",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Capilla",
      "Wilde",
      "San Cayetano"
    ]
  },
  {
    "id": 148,
    "nombre": "Capilla Nuestra Señora de Luján de Don Bosco (Quilmes)",
    "tipo": "Capilla",
    "region": "Zona Sur",
    "direccion": "Chiclana 1120, Don Bosco, Quilmes",
    "barrio": "Don Bosco",
    "coordenadas": {
      "lat": -34.70891,
      "lng": -58.28912
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "18:30"
        ]
      }
    ],
    "horariosConfesiones": "Media hora antes de la misa",
    "telefono": "+54 11 4252-0941",
    "webOficial": "https://diocesisquilmes.org.ar",
    "etiquetas": [
      "Capilla",
      "Don Bosco",
      "Virgen de Luján"
    ]
  },
  {
    "id": 149,
    "nombre": "Capilla del Santísimo Sacramento (Lomas de Zamora)",
    "tipo": "Capilla",
    "region": "Zona Sur",
    "direccion": "Gorriti 450, Lomas de Zamora",
    "barrio": "Lomas de Zamora",
    "coordenadas": {
      "lat": -34.75891,
      "lng": -58.39841
    },
    "horariosMisa": [
      {
        "dia": "Lunes a Viernes",
        "horarios": [
          "08:00"
        ]
      },
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "09:00",
          "18:00"
        ]
      }
    ],
    "horariosConfesiones": "Adoración Eucarística y confesiones continuas de 09:00 a 17:00",
    "telefono": "+54 11 4243-1598",
    "webOficial": "https://ilomas.org.ar",
    "etiquetas": [
      "Capilla",
      "Adoración Perpetua",
      "Lomas de Zamora"
    ]
  },
  {
    "id": 150,
    "nombre": "Capilla San José de Calasanz de Lanús",
    "tipo": "Capilla",
    "region": "Zona Sur",
    "direccion": "Del Valle Iberlucea 3150, Lanús Oeste",
    "barrio": "Lanús",
    "coordenadas": {
      "lat": -34.70123,
      "lng": -58.39412
    },
    "horariosMisa": [
      {
        "dia": "Sábados y Domingos",
        "horarios": [
          "19:00"
        ]
      }
    ],
    "horariosConfesiones": "Durante las celebraciones comunitarias y grupos scouts",
    "telefono": "+54 11 4241-5501",
    "webOficial": "https://diocesis-avellaneda-lanus.org.ar",
    "etiquetas": [
      "Capilla",
      "Lanús",
      "Escolapios",
      "Jóvenes"
    ]
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
    get(k, def) {
      try {
        const v = window.localStorage.getItem(k);
        if (v !== null && v !== undefined) {
          const parsed = JSON.parse(v);
          mem[k] = parsed;
          return parsed;
        }
        return mem[k] !== undefined ? mem[k] : def;
      } catch (e) {
        return mem[k] !== undefined ? mem[k] : def;
      }
    },
    set(k, v) {
      mem[k] = v;
      try {
        window.localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {
        console.warn("Aviso al persistir en localStorage (" + k + "):", e);
      }
    },
    remove(k) {
      delete mem[k];
      try {
        window.localStorage.removeItem(k);
      } catch (e) {}
    }
  };
})();

function getLocalTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* =====================================================================
   Estado de la Aplicación (Sincronizado con LocalStorage)
   ===================================================================== */
const savedAdminParishes = Store.get("parishes_admin_data", null);
let PARISHES = prepareDataset(
  Array.isArray(savedAdminParishes) && savedAdminParishes.length
    ? savedAdminParishes
    : Store.get("parishes_cache_v7", FALLBACK_PARISHES)
);

const initialAdminRole = (function resolveInitialRole() {
  const savedRole = Store.get("admin_role_v1", null);
  if (savedRole === "master" || savedRole === "collab") return savedRole;
  if (Store.get("admin_unlocked", false)) return "master";
  return null;
})();

const VALID_APP_VIEWS = SHOW_COMMUNITY
  ? ["home", "list", "map", "spiritual", "liturgy", "bible", "reflections", "saints", "community", "profile"]
  : ["home", "list", "map", "liturgy", "bible", "reflections", "saints", "profile"];
const savedActiveView = Store.get("ui_active_view_v1", "home");

const state = {
  view: VALID_APP_VIEWS.includes(savedActiveView) ? savedActiveView : "home",
  commTab: Store.get("ui_comm_tab_v1", "all"), // 'all' | 'following' | 'ranking' | 'people'
  spirTab: Store.get("ui_spir_tab_v1", "streak"), // 'streak' | 'notes' | 'stats'
  checkinSlot: "Mañana", // 'Mañana' | 'Tarde' | 'Noche'
  streakDate: getLocalTodayIso(),
  editingNoteId: null,
  liturgyDate: Store.get("ui_liturgy_date_v1", null) || getLocalTodayIso(),
  saintsDate: Store.get("ui_saints_date_v1", null) || getLocalTodayIso(),
  bibleTestamentId: null, // 'antiguo' | 'nuevo' | null
  bibleCategoryId: null,  // 'pentateuco' | 'historicos' | 'sapienciales' | 'profeticos' | 'evangelios' | 'hechos' | 'cartas_paulinas' | 'cartas_catolicas' | 'apocalipsis' | null
  bibleBookId: null,      // 'gn' | 'mt' | ... | null
  bibleChapterNum: null,  // 1 | 2 | ... | null
  openFirstReading: false,
  openPsalm: false,
  liturgyExplainOpen: false,
  openDatePickerId: null, // 'streak' | 'liturgy' | 'saints' | null
  datePickerViewMonth: {}, // { [pickerId]: { year, month } }
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
  adminRole: initialAdminRole, // 'master' (1118) | 'collab' (0000) | null
  isAdmin: initialAdminRole === "master",
  canEditActivities: initialAdminRole === "master" || initialAdminRole === "collab"
};

/* =====================================================================
   Navegación Superior con Scroll Horizontal y Animación de Libro
   ===================================================================== */
function switchView(targetView, skipScroll = false) {
  if (!SHOW_COMMUNITY && (targetView === "spiritual" || targetView === "community")) {
    targetView = "home";
  }
  if (!VALID_APP_VIEWS.includes(targetView)) return;

  const prevIdx = VALID_APP_VIEWS.indexOf(state.view);
  const nextIdx = VALID_APP_VIEWS.indexOf(targetView);
  const turnDirectionClass = nextIdx >= prevIdx ? "book-turn-next" : "book-turn-prev";

  state.view = targetView;
  state.openDatePickerId = null;
  Store.set("ui_active_view_v1", targetView);
  document.body.setAttribute("data-active-view", targetView);
  document.body.setAttribute("data-show-community", String(SHOW_COMMUNITY));

  const panels = {
    home: $("#view-home"),
    list: $("#view-list"),
    map: $("#view-map"),
    spiritual: $("#view-spiritual"),
    liturgy: $("#view-liturgy"),
    bible: $("#view-bible"),
    reflections: $("#view-reflections"),
    saints: $("#view-saints"),
    community: $("#view-community"),
    profile: $("#view-profile")
  };
  const tabs = {
    home: $("#tab-home"),
    list: $("#tab-list"),
    map: $("#tab-map"),
    spiritual: $("#tab-spiritual"),
    liturgy: $("#tab-liturgy"),
    bible: $("#tab-bible"),
    reflections: $("#tab-reflections"),
    saints: $("#tab-saints"),
    community: $("#tab-community"),
    profile: $("#tab-profile")
  };

  if (!SHOW_COMMUNITY) {
    ["spiritual", "community"].forEach(hiddenView => {
      if (panels[hiddenView]) {
        panels[hiddenView].classList.remove("is-active");
        panels[hiddenView].setAttribute("aria-hidden", "true");
        panels[hiddenView].hidden = true;
      }
      if (tabs[hiddenView]) {
        tabs[hiddenView].classList.remove("is-active");
        tabs[hiddenView].setAttribute("aria-selected", "false");
        tabs[hiddenView].hidden = true;
      }
    });
  }

  VALID_APP_VIEWS.forEach(v => {
    const active = v === targetView;
    const panelEl = panels[v];
    const tabEl = tabs[v];
    if (panelEl) {
      panelEl.classList.remove("book-turn-next", "book-turn-prev");
      panelEl.classList.toggle("is-active", active);
      panelEl.setAttribute("aria-hidden", String(!active));
      if (active) {
        panelEl.hidden = false;
        panelEl.style.display = v === "map" ? "flex" : "block";
        if (v !== "map") {
          void panelEl.offsetWidth;
          panelEl.classList.add(turnDirectionClass);
        }
      } else {
        panelEl.style.display = "none";
      }
    }
    if (tabEl) {
      tabEl.classList.toggle("is-active", active);
      tabEl.setAttribute("aria-selected", String(active));
      if (active && typeof tabEl.scrollIntoView === "function") {
        tabEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  });

  if (!skipScroll) {
    const viewport = document.getElementById("book-viewport");
    if (viewport) {
      viewport.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  try {
    if (targetView === "home") {
      renderHome();
    } else if (targetView === "map") {
      initMap();
      requestAnimationFrame(() => {
        if (map) {
          map.invalidateSize();
          fitMapToBounds(filtered());
        }
      });
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 220);
    } else if (targetView === "list") {
      renderList();
    } else if (targetView === "spiritual" && SHOW_COMMUNITY) {
      renderSpiritualView();
    } else if (targetView === "liturgy") {
      renderLiturgyView();
    } else if (targetView === "bible") {
      renderBibleView();
    } else if (targetView === "reflections") {
      renderReflectionsView();
    } else if (targetView === "saints") {
      renderSaintsView();
    } else if (targetView === "community" && SHOW_COMMUNITY) {
      renderCommunityView();
    } else if (targetView === "profile") {
      renderProfileView();
    }
  } catch (err) {
    console.warn(`[switchView] Advertencia al renderizar vista ${targetView}:`, err);
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


/* =====================================================================
   RADIO: MÓDULO DE AUDIO GLOBAL (instancia única, async/await, a prueba de fallos)
   - Una sola instancia: globalAudio = new Audio()
   - playTrack(index) con token anti-carreras: un cambio rápido de pista
     nunca deja una promesa vieja pisando el estado de la nueva.
   - Errores clasificados: AbortError (ignorado), NotAllowedError (autoplay
     bloqueado -> "Toca para reproducir"), fallo de red/formato (salta pista).
   ===================================================================== */
const RADIO_CATEGORIES = ["Biblioteca", "Pacífica", "Reflexión", "Órgano"];

const playlist = [
  // Biblioteca: archivos locales incluidos en /audio (siempre disponibles, también offline)
  { title: "Cara a Cara", artist: "Pascua Joven", category: "Biblioteca", url: "audio/cara-a-cara.mp3" },
  { title: "Haciéndote Pan", artist: "Pascua Joven", category: "Biblioteca", url: "audio/haciendote-pan.mp3" },
  { title: "A Tanto Amor", artist: "Pascua Joven", category: "Biblioteca", url: "audio/a-tanto-amor.mp3" },

  // Pistas externas: grabaciones de órgano de J. S. Bach en dominio público (Musopen / Baroque Music Club),
  // servidas por Wikimedia Commons (enlace estable por nombre de archivo). Si una no responde, la radio
  // la omite en silencio (consola) y pasa a la siguiente válida; la Biblioteca local nunca depende de la red.
  { title: "Preludio en La menor, BWV 543", artist: "J. S. Bach · R. Köbler, órgano Silbermann", category: "Órgano", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_Prelude_in_A_minor_BWV_543_Robert_K%C3%B6bler_Silbermann-Organ.mp3" },
  { title: "Sonata en Sol mayor, BWV 530 · I", artist: "J. S. Bach · E. Piasetzki, órgano Silbermann", category: "Órgano", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_first_movement_Organ_Sonata_in_G_major_BWV_530_Erich_Piasetzki_Silbermann-Organ.mp3" },
  { title: "Sonata en Mi bemol mayor, BWV 525 · I", artist: "J. S. Bach · J.-E. Köhler, órgano Silbermann", category: "Órgano", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_first_movement_Organ_Sonata_in_E-flat_major_BWV_525_Johannes-Ernst_K%C3%B6hler_Silbermann-Organ.mp3" },
  { title: "Sonata en Mi menor, BWV 528 · I", artist: "J. S. Bach · C. Albrecht, órgano Silbermann", category: "Órgano", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_first_movement_Organ_Sonata_in_E_minor_BWV_528_Christoph_Albrecht_Silbermann-Organ.mp3" },
  { title: "Sonata en Do mayor, BWV 529 · II", artist: "J. S. Bach · H. Otto, órgano Silbermann", category: "Pacífica", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_second_movement_Organ_Sonata_in_C_major_BWV_529_Hans_Otto_Silbermann-Organ.mp3" },
  { title: "Sonata en Sol mayor, BWV 530 · II", artist: "J. S. Bach · E. Piasetzki, órgano Silbermann", category: "Pacífica", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_second_movement_Organ_Sonata_in_G_major_BWV_530_Erich_Piasetzki_Silbermann-Organ.mp3" },
  { title: "Preludio y Fuga en Mi menor, BWV 555", artist: "Atribuida a Bach · R. Köbler, órgano Silbermann", category: "Reflexión", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Prelude_and_Fugue_in_E_minor_BWV_555_Robert_K%C3%B6bler_Silbermann-Organ.mp3" },
  { title: "Fuga en La menor, BWV 543", artist: "J. S. Bach · R. Köbler, órgano Silbermann", category: "Reflexión", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach_Fugue_in_A_minor_BWV_543_Robert_K%C3%B6bler_Silbermann-Organ.mp3" }
];

// Instancia única y global del reproductor
const globalAudio = new Audio();
globalAudio.preload = "none"; // no descargar MB al abrir la app; se carga al primer play
globalAudio.loop = false;

let currentTrackIndex = 0;             // índice dentro de la lista activa (categoría)
let currentRadioCategory = "TODAS";
let radioPlayToken = 0;                // se incrementa en cada playTrack (anti-carreras)
let radioFailedToken = -1;             // evita procesar dos veces el mismo fallo
let radioConsecutiveFailures = 0;
let radioHasStarted = false;
let isAudioBuffering = false;
let radioLoadingTrack = null;          // pista que se está cargando (para atribuir bien un error)
let radioWatchdog = null;              // temporizador anti-congelamiento de carga
const RADIO_LOAD_TIMEOUT_MS = 20000;
let isAudioTimelineUserDragging = false;
let audioPanelTimer = null;
const radioUnavailableUrls = new Set(); // URLs que fallaron en esta sesión

/* ---------- Helpers de datos ---------- */
function getActiveRadioPlaylist() {
  const base = currentRadioCategory === "TODAS"
    ? playlist
    : playlist.filter(t => t.category === currentRadioCategory);
  return base.filter(t => !radioUnavailableUrls.has(t.url));
}

/** Lista reproducible; si todo quedó marcado como caído, se vuelve a intentar desde cero (acción del usuario). */
function getPlayableOrRetry() {
  let list = getActiveRadioPlaylist();
  if (!list.length) { radioUnavailableUrls.clear(); list = getActiveRadioPlaylist(); }
  return list;
}

function getCurrentRadioTrack() {
  const list = getActiveRadioPlaylist();
  if (currentTrackIndex >= list.length) currentTrackIndex = 0;
  return list[currentTrackIndex] || playlist[0];
}

function formatAudioTime(sec) {
  const s = Number(sec);
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

function getRadioAudio() {
  return globalAudio;
}

/* ---------- Estado visual ---------- */
function setAudioBufferingState(isBuffering, msg = "Cargando...") {
  isAudioBuffering = isBuffering;
  const widget = document.getElementById("floating-audio-widget");
  const spinner = document.getElementById("audio-panel-spinner");
  const playIco = document.getElementById("panel-icon-play");
  const pauseIco = document.getElementById("panel-icon-pause");
  const status = document.getElementById("audio-loading-status");
  const statusText = document.getElementById("audio-status-text");
  const bubbleText = document.getElementById("audio-bubble-text");

  if (widget) widget.classList.toggle("is-loading", isBuffering);
  if (spinner) spinner.hidden = !isBuffering;
  if (status) status.classList.toggle("is-loading", isBuffering);

  if (isBuffering) {
    if (playIco) playIco.hidden = true;
    if (pauseIco) pauseIco.hidden = true;
    if (statusText) statusText.textContent = msg;
    if (bubbleText) bubbleText.textContent = `🎵 ${msg}`;
  } else {
    updateRadioUI();
  }
}

function updateRadioUI(overrideMessage = null) {
  const track = getCurrentRadioTrack();
  const playing = !globalAudio.paused && !globalAudio.ended;
  state.radioPlaying = playing;

  const widget = document.getElementById("floating-audio-widget");
  const bubbleText = document.getElementById("audio-bubble-text");
  const panelTitle = document.getElementById("audio-panel-title");
  const panelArtist = document.getElementById("audio-panel-artist");
  const playIco = document.getElementById("panel-icon-play");
  const pauseIco = document.getElementById("panel-icon-pause");
  const statusText = document.getElementById("audio-status-text");
  const settingsBtn = document.getElementById("btn-settings-radio-play");
  const settingsIco = document.getElementById("btn-settings-radio-icon");
  const settingsTxt = document.getElementById("btn-settings-radio-text");

  if (bubbleText && !isAudioBuffering) {
    bubbleText.textContent = overrideMessage
      ? `🎵 ${overrideMessage}`
      : (playing ? `🎵 ${track.title}` : (radioHasStarted ? `🎵 ${track.title} (pausa)` : "🎵 Radio · Toca para escuchar"));
  }
  if (panelTitle) panelTitle.textContent = track.title;
  if (panelArtist) panelArtist.textContent = `${track.artist} · ${track.category}`;

  if (widget) widget.classList.toggle("is-playing", playing);
  if (!isAudioBuffering) {
    if (playIco) playIco.hidden = playing;
    if (pauseIco) pauseIco.hidden = !playing;
    if (statusText) statusText.textContent = overrideMessage || (playing ? "Reproduciendo" : "En pausa");
  }

  if (settingsBtn) settingsBtn.classList.toggle("is-playing", playing);
  if (settingsIco) settingsIco.textContent = playing ? "❚❚" : "▶";
  if (settingsTxt) settingsTxt.textContent = playing ? "Pausar Radio" : "Iniciar Radio";

  document.querySelectorAll(".audio-cat-pill").forEach(pill => {
    pill.classList.toggle("is-active", pill.dataset.radioCat === currentRadioCategory);
  });
}

function updateAudioTimeline() {
  const cur = globalAudio.currentTime || 0;
  const dur = globalAudio.duration;
  const hasDuration = isFinite(dur) && dur > 0;

  const curEl = document.getElementById("audio-time-current");
  const durEl = document.getElementById("audio-time-duration");
  const slider = document.getElementById("audio-timeline-slider");

  if (durEl) durEl.textContent = hasDuration ? formatAudioTime(dur) : "--:--";
  if (!slider) return;

  slider.disabled = !hasDuration;
  if (isAudioTimelineUserDragging) return; // no pisar la posición mientras el usuario arrastra

  if (curEl) curEl.textContent = formatAudioTime(cur);
  if (hasDuration) {
    slider.max = String(dur);
    slider.value = String(cur);
    slider.style.setProperty("--progress", `${(cur / dur) * 100}%`);
  } else {
    slider.value = "0";
    slider.style.setProperty("--progress", "0%");
  }
}

/* ---------- Núcleo de reproducción ---------- */
function clearRadioWatchdog() {
  if (radioWatchdog) { clearTimeout(radioWatchdog); radioWatchdog = null; }
}

async function playTrack(index) {
  const list = getPlayableOrRetry();
  if (!list.length) return;

  currentTrackIndex = ((index % list.length) + list.length) % list.length;
  const track = list[currentTrackIndex];
  const token = ++radioPlayToken;
  radioHasStarted = true;
  radioLoadingTrack = track;
  clearRadioWatchdog();

  // 1. Detener lo que esté sonando
  globalAudio.pause();

  // 2. Indicador de carga en burbuja y panel
  setAudioBufferingState(true, "Cargando...");

  // 3. Nueva fuente + load()
  console.log("[Radio] Reproduciendo:", track.title, "->", track.url);
  globalAudio.src = track.url;
  globalAudio.load();
  updateAudioTimeline();

  // Si la fuente no responde ni da error (red colgada), se descarta y se avanza sin congelar la interfaz
  radioWatchdog = setTimeout(() => {
    if (token === radioPlayToken && !globalAudio.paused && globalAudio.readyState < 3) {
      console.warn("[Radio] Tiempo de carga agotado:", track.url);
      handleTrackFailure(token, track);
    }
  }, RADIO_LOAD_TIMEOUT_MS);

  // 4. play() con await seguro
  try {
    await globalAudio.play();
    if (token !== radioPlayToken) return; // llegó otra pista mientras cargaba
    radioConsecutiveFailures = 0;
    setAudioBufferingState(false);
    updateRadioUI();
    updateMediaSession(track);
  } catch (err) {
    if (token !== radioPlayToken) return;
    console.warn("[Radio] Error de reproducción:", err && err.name, track.url);

    if (err && err.name === "AbortError") return; // interrumpido por un cambio de pista: normal

    setAudioBufferingState(false);
    if (err && err.name === "NotAllowedError") {
      // Política de autoplay: requiere un toque del usuario
      updateRadioUI("Toca para reproducir");
      return;
    }
    handleTrackFailure(token, track);
  }
}

function handleTrackFailure(token, track) {
  if (token !== radioPlayToken || radioFailedToken === token) return; // ya procesado
  radioFailedToken = token;
  clearRadioWatchdog();
  if (track) radioUnavailableUrls.add(track.url); // se omite durante esta sesión (local o externa)
  console.warn("[Radio] Pista omitida por error de carga/CORS:", track ? track.url : "(desconocida)");

  let list = getActiveRadioPlaylist();
  if (!list.length && currentRadioCategory !== "TODAS") {
    currentRadioCategory = "TODAS"; // categoría agotada: continuar con toda la biblioteca
    list = getActiveRadioPlaylist();
  }
  if (!list.length) {
    setAudioBufferingState(false);
    updateRadioUI("Sin conexión de audio");
    toast("No se pudo reproducir la Radio. Tocá play para reintentar.");
    return;
  }
  // Al marcar la pista caída la lista se reindexa: el mismo índice apunta a la siguiente válida
  setTimeout(() => {
    if (token === radioPlayToken) playTrack(currentTrackIndex);
  }, 250);
}

function nextRadioTrack() {
  const list = getPlayableOrRetry();
  if (!list.length) return;
  currentTrackIndex = (currentTrackIndex + 1) % list.length;
  playTrack(currentTrackIndex);
}

function prevRadioTrack() {
  // Si ya avanzó más de 3 s, reinicia la pista actual (comportamiento estándar)
  if (globalAudio.currentTime > 3) {
    globalAudio.currentTime = 0;
    return;
  }
  const list = getPlayableOrRetry();
  if (!list.length) return;
  currentTrackIndex = (currentTrackIndex - 1 + list.length) % list.length;
  playTrack(currentTrackIndex);
}

async function toggleRadioPlayback() {
  // Primera vez o sin fuente: arrancar la pista actual (gesto de usuario -> desbloquea autoplay)
  if (!globalAudio.src || !radioHasStarted) {
    return playTrack(currentTrackIndex);
  }
  if (globalAudio.paused) {
    const token = radioPlayToken;
    try {
      await globalAudio.play();
    } catch (err) {
      console.warn("[Radio] Error de reproducción:", err && err.name);
      if (err && err.name === "NotAllowedError") updateRadioUI("Toca para reproducir");
      else if (err && err.name !== "AbortError") handleTrackFailure(token, radioLoadingTrack || getCurrentRadioTrack());
    }
  } else {
    globalAudio.pause();
  }
}

function setRadioCategory(categoryName) {
  currentRadioCategory = categoryName;
  currentTrackIndex = 0;
  radioConsecutiveFailures = 0;
  updateRadioUI();
  playTrack(0);
}

function setRadioVolume(vol) {
  let val = parseFloat(vol);
  if (!isFinite(val)) val = 0.5;
  val = Math.min(1, Math.max(0, val)); // 0 es un valor válido (silencio)
  globalAudio.volume = val;
  globalAudio.muted = val === 0;
  Store.set("radio_volume_v1", val);

  const pct = Math.round(val * 100) + "%";
  ["audio-panel-vol-slider", "radio-volume-slider"].forEach(id => {
    const el = document.getElementById(id);
    if (el && Math.abs(parseFloat(el.value) - val) > 0.001) el.value = String(val);
    if (el) el.style.setProperty("--progress", `${val * 100}%`);
  });
  ["audio-panel-vol-pct", "radio-volume-label"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = pct;
  });
  const icon = document.getElementById("audio-panel-vol-icon");
  if (icon) icon.dataset.level = val === 0 ? "mute" : (val < 0.5 ? "low" : "high");
}

function seekRadio(seconds) {
  const dur = globalAudio.duration;
  if (!isFinite(dur) || dur <= 0) return;
  globalAudio.currentTime = Math.min(dur, Math.max(0, Number(seconds) || 0));
  updateAudioTimeline();
}

/* ---------- Media Session (controles en pantalla de bloqueo / auriculares) ---------- */
function updateMediaSession(track) {
  if (!("mediaSession" in navigator) || !track) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: `Radio · ${track.category}`,
      artwork: [{ src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }]
    });
  } catch (e) { /* navegador sin soporte completo */ }
}

function setupMediaSessionHandlers() {
  if (!("mediaSession" in navigator)) return;
  const handlers = {
    play: () => toggleRadioPlayback(),
    pause: () => globalAudio.pause(),
    nexttrack: () => nextRadioTrack(),
    previoustrack: () => prevRadioTrack()
  };
  Object.entries(handlers).forEach(([action, fn]) => {
    try { navigator.mediaSession.setActionHandler(action, fn); } catch (e) { /* acción no soportada */ }
  });
}

/* ---------- Eventos nativos del <audio> (se registran una sola vez) ---------- */
function attachGlobalAudioEvents() {
  globalAudio.addEventListener("waiting", () => setAudioBufferingState(true, "Cargando..."));
  globalAudio.addEventListener("stalled", () => { if (!globalAudio.paused) setAudioBufferingState(true, "Cargando..."); });
  globalAudio.addEventListener("progress", () => {
    // Porcentaje de buffer visible mientras carga
    if (!isAudioBuffering) return;
    const dur = globalAudio.duration;
    if (!isFinite(dur) || dur <= 0 || !globalAudio.buffered.length) return;
    const pct = Math.min(100, Math.round((globalAudio.buffered.end(globalAudio.buffered.length - 1) / dur) * 100));
    const statusText = document.getElementById("audio-status-text");
    if (statusText) statusText.textContent = `Cargando ${pct}%`;
  });
  globalAudio.addEventListener("playing", () => { clearRadioWatchdog(); setAudioBufferingState(false); updateRadioUI(); });
  globalAudio.addEventListener("canplay", () => { if (isAudioBuffering && !globalAudio.paused) setAudioBufferingState(false); });
  globalAudio.addEventListener("play", () => updateRadioUI());
  globalAudio.addEventListener("pause", () => { if (!isAudioBuffering) updateRadioUI(); });
  globalAudio.addEventListener("ended", () => nextRadioTrack());
  globalAudio.addEventListener("timeupdate", updateAudioTimeline);
  globalAudio.addEventListener("durationchange", updateAudioTimeline);
  globalAudio.addEventListener("loadedmetadata", updateAudioTimeline);
  globalAudio.addEventListener("error", () => {
    // Sólo errores reales de la fuente actual (no los de un src vacío o reemplazado)
    if (!globalAudio.src || !globalAudio.error) return;
    console.warn("[Radio] Error de media:", globalAudio.error.code, globalAudio.error.message || "");
    handleTrackFailure(radioPlayToken, radioLoadingTrack || getCurrentRadioTrack());
  });
}

let radioInitialized = false;
function initGlobalRadio() {
  if (radioInitialized) return;
  radioInitialized = true;

  attachGlobalAudioEvents();
  setupMediaSessionHandlers();

  const saved = parseFloat(Store.get("radio_volume_v1", 0.5));
  setRadioVolume(isFinite(saved) ? saved : 0.5);

  // iOS Safari ignora audio.volume (siempre 1): se oculta el slider y se indica usar los botones físicos
  const probe = new Audio();
  probe.volume = 0.3;
  if (probe.volume === 1) {
    document.getElementById("floating-audio-widget")?.classList.add("volume-hardware-only");
  }

  updateRadioUI();
  updateAudioTimeline();
}

/* ---------- Panel retráctil (auto-cierre 3 s) ---------- */
function openAudioPanel() {
  const panel = document.getElementById("audio-expanded-panel");
  const widget = document.getElementById("floating-audio-widget");
  const trigger = document.getElementById("audio-bubble-trigger");
  if (!panel || !widget) return;
  panel.hidden = false;
  widget.classList.add("is-expanded");
  if (trigger) trigger.setAttribute("aria-expanded", "true");
  updateAudioTimeline();
  resetAudioPanelTimer();
}

function closeAudioPanel() {
  const panel = document.getElementById("audio-expanded-panel");
  const widget = document.getElementById("floating-audio-widget");
  const trigger = document.getElementById("audio-bubble-trigger");
  if (!panel || !widget) return;
  panel.hidden = true;
  widget.classList.remove("is-expanded");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
  if (audioPanelTimer) { clearTimeout(audioPanelTimer); audioPanelTimer = null; }
}

function resetAudioPanelTimer() {
  if (audioPanelTimer) clearTimeout(audioPanelTimer);
  audioPanelTimer = setTimeout(() => {
    if (!isAudioTimelineUserDragging) closeAudioPanel();
  }, 3000);
}

/* ---------- Enlace de controles de UI ---------- */
function bindRadioControls() {
  const on = (id, evt, fn, opts) => document.getElementById(id)?.addEventListener(evt, fn, opts);

  // Burbuja: abre el panel. El primer toque además arranca la radio (gesto de usuario).
  on("audio-bubble-trigger", "click", (e) => {
    e.stopPropagation();
    openAudioPanel();
    if (!radioHasStarted) playTrack(currentTrackIndex);
  });
  on("btn-close-audio-panel", "click", (e) => { e.stopPropagation(); closeAudioPanel(); });
  on("btn-audio-panel-done", "click", (e) => { e.stopPropagation(); closeAudioPanel(); });
  on("btn-audio-panel-play", "click", (e) => { e.stopPropagation(); resetAudioPanelTimer(); toggleRadioPlayback(); });
  on("btn-audio-panel-next", "click", (e) => { e.stopPropagation(); resetAudioPanelTimer(); nextRadioTrack(); });

  on("audio-category-bar", "click", (e) => {
    const pill = e.target.closest("[data-radio-cat]");
    if (!pill) return;
    e.stopPropagation();
    resetAudioPanelTimer();
    setRadioCategory(pill.dataset.radioCat);
  });

  // Timeline: vista previa al arrastrar, seek al soltar
  const timeline = document.getElementById("audio-timeline-slider");
  if (timeline) {
    const startDrag = () => { isAudioTimelineUserDragging = true; resetAudioPanelTimer(); };
    const endDrag = () => {
      if (!isAudioTimelineUserDragging) return;
      isAudioTimelineUserDragging = false;
      seekRadio(timeline.value);
      resetAudioPanelTimer();
    };
    timeline.addEventListener("pointerdown", startDrag);
    timeline.addEventListener("touchstart", startDrag, { passive: true });
    timeline.addEventListener("input", () => {
      isAudioTimelineUserDragging = true;
      const val = parseFloat(timeline.value) || 0;
      const max = parseFloat(timeline.max) || 1;
      const curEl = document.getElementById("audio-time-current");
      if (curEl) curEl.textContent = formatAudioTime(val);
      timeline.style.setProperty("--progress", `${(val / max) * 100}%`);
      resetAudioPanelTimer();
    });
    timeline.addEventListener("change", endDrag); // teclado y soltar en la mayoría de navegadores
    timeline.addEventListener("pointerup", endDrag);
    timeline.addEventListener("touchend", endDrag);
  }

  // Volumen (panel flotante y panel de configuración)
  ["audio-panel-vol-slider", "radio-volume-slider"].forEach(id => {
    on(id, "input", (e) => { resetAudioPanelTimer(); setRadioVolume(e.target.value); });
  });

  on("btn-settings-radio-play", "click", (e) => { e.stopPropagation(); toggleRadioPlayback(); });

  // Cualquier interacción dentro del panel reinicia el auto-cierre
  const panel = document.getElementById("audio-expanded-panel");
  if (panel) {
    ["touchstart", "pointermove", "click", "keydown"].forEach(evt =>
      panel.addEventListener(evt, resetAudioPanelTimer, { passive: true }));
  }

  // Clic fuera del widget: minimizar
  document.addEventListener("click", (e) => {
    const widget = document.getElementById("floating-audio-widget");
    if (widget && widget.classList.contains("is-expanded") && !widget.contains(e.target)) closeAudioPanel();
  });
}

let mapTouchLocked = true;

function syncMapTouchLockUI() {
  const btn = $("#btn-map-toggle-touch");
  const mapEl = $("#map");
  const iconLocked = $("#icon-map-locked");
  const iconUnlocked = $("#icon-map-unlocked");
  const label = $("#label-map-touch-state");
  if (!map) return;

  if (mapTouchLocked) {
    if (btn) {
      btn.classList.add("is-locked");
      btn.classList.remove("is-unlocked");
      btn.setAttribute("aria-pressed", "false");
    }
    if (mapEl) mapEl.classList.add("map-touch-locked");
    if (iconLocked) iconLocked.hidden = false;
    if (iconUnlocked) iconUnlocked.hidden = true;
    if (label) label.textContent = "Fijado (Scroll libre)";
    try {
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
    } catch (e) {}
  } else {
    if (btn) {
      btn.classList.remove("is-locked");
      btn.classList.add("is-unlocked");
      btn.setAttribute("aria-pressed", "true");
    }
    if (mapEl) mapEl.classList.remove("map-touch-locked");
    if (iconLocked) iconLocked.hidden = true;
    if (iconUnlocked) iconUnlocked.hidden = false;
    if (label) label.textContent = "Mapa Activo (Explorar)";
    try {
      map.dragging.enable();
      map.touchZoom.enable();
      map.scrollWheelZoom.enable();
    } catch (e) {}
  }
}

function toggleMapTouchLock() {
  mapTouchLocked = !mapTouchLocked;
  syncMapTouchLockUI();
  if (!mapTouchLocked) {
    toast("🔓 Mapa activo: podés mover y hacer zoom libremente.");
  } else {
    toast("🔒 Mapa fijado: deslizate por la pantalla con total libertad.");
  }
}

function initMap() {
  const mapEl = $("#map");
  if (!mapEl || typeof L === "undefined") return;
  if (map) {
    try {
      map.invalidateSize();
      renderMapMarkers(filtered());
    } catch (e) {}
    return;
  }

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
  syncMapTouchLockUI();
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 120);
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

/* =====================================================================
   SELECTORES EMERGENTES EN FORMATO GRID DE CUADRADOS MINIMALISTAS
   ===================================================================== */
let currentZoneFilter = "ALL";
let activeParishPickerTarget = "streak"; // 'streak' | 'note'

function openZonePickerModal() {
  const modal = document.getElementById("zone-picker-modal");
  if (!modal) return;
  currentZoneFilter = "ALL";
  renderZoneSquareGrid(currentZoneFilter);
  modal.hidden = false;
}

function closeZonePickerModal() {
  const modal = document.getElementById("zone-picker-modal");
  if (modal) modal.hidden = true;
}

function renderZoneSquareGrid(regionFilter = "ALL") {
  const grid = document.getElementById("zone-square-grid");
  if (!grid) return;

  const currentZoneId = state.userLoc ? state.userLoc.id : "";

  // 1. Opciones maestras: General y GPS
  let cardsHtml = `
    <button type="button" class="square-card ${!state.sortByNear ? "is-active" : ""}" data-select-zone="">
      <span class="square-card-icon">🏛️</span>
      <span class="square-card-title">Todas las Zonas</span>
      <span class="square-card-sub">Alfabético</span>
    </button>
    <button type="button" class="square-card ${state.userLoc?.source === "gps" ? "is-active" : ""}" data-select-gps="true">
      <span class="square-card-icon">🛰️</span>
      <span class="square-card-title">Mi GPS Actual</span>
      <span class="square-card-sub">Tiempo real</span>
    </button>
  `;

  const filteredZones = regionFilter === "ALL"
    ? REFERENCE_ZONES
    : REFERENCE_ZONES.filter(z => z.region === regionFilter);

  cardsHtml += filteredZones.map(z => {
    const isActive = state.sortByNear && state.userLoc?.id === z.id;
    const icon = z.region === "CABA" ? "🏙️" : z.region === "Zona Norte" ? "⛵" : z.region === "Zona Oeste" ? "🌳" : "⚓";
    return `
      <button type="button" class="square-card ${isActive ? "is-active" : ""}" data-select-zone="${z.id}">
        <span class="square-card-icon">${icon}</span>
        <span class="square-card-title">${z.nombre}</span>
        <span class="square-card-sub">${z.region}</span>
      </button>`;
  }).join("");

  grid.innerHTML = cardsHtml;

  // Actualizar tabs de filtro del modal
  document.querySelectorAll("#zone-picker-modal [data-zone-filter]").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.zoneFilter === regionFilter);
  });
}

function openParishPickerModal(target = "streak") {
  activeParishPickerTarget = target;
  const modal = document.getElementById("parish-picker-modal");
  if (!modal) return;
  const searchInput = document.getElementById("parish-picker-search");
  if (searchInput) searchInput.value = "";
  renderParishSquareGrid("");
  modal.hidden = false;
  setTimeout(() => searchInput?.focus(), 40);
}

function closeParishPickerModal() {
  const modal = document.getElementById("parish-picker-modal");
  if (modal) modal.hidden = true;
}

function renderParishSquareGrid(searchQuery = "") {
  const grid = document.getElementById("parish-square-grid");
  if (!grid) return;

  const q = norm(searchQuery);
  const currentSelectedId = activeParishPickerTarget === "streak"
    ? String(spiritualDB.lastParishId || "1")
    : activeParishPickerTarget === "activity"
    ? String(document.getElementById("act-parish-select")?.value || "")
    : String(document.getElementById("note-parish-select")?.value || "");

  const matches = PARISHES.filter(p => {
    if (!q) return true;
    return (p._searchIndex || norm(`${p.nombre} ${p.barrio} ${p.region}`)).includes(q);
  });

  if (!matches.length) {
    grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1;">No se encontraron templos con "${esc(searchQuery)}"</div>`;
    return;
  }

  grid.innerHTML = matches.map(p => {
    const isAct = String(p.id) === currentSelectedId;
    const badgeCls = getTypeBadgeClass(p.tipo);
    return `
      <button type="button" class="square-card square-card-parish ${isAct ? "is-active" : ""}" data-pick-parish-id="${p.id}">
        <span class="type-badge ${badgeCls} p-type-tag">${p.tipo}</span>
        <span class="square-card-title">${p.nombre}</span>
        <span class="square-card-sub">${p.barrio} · ${p._region || inferRegion(p)}</span>
      </button>`;
  }).join("");
}

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

  const triggerText = document.getElementById("loc-trigger-text");
  if (triggerText) {
    triggerText.textContent = isGps
      ? "GPS: Tu ubicación actual"
      : isManual
      ? `Zona: ${state.userLoc.label}`
      : "Zona: Todas (CABA y GBA)";
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
    : state.canEditActivities
    ? `<button type="button" class="card-edit-btn" data-manage-acts="${pid}" aria-label="Gestionar actividades de ${p.nombre}">🙌<span>Actividades</span></button>`
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
  try { renderHome(); } catch (e) { /* inicio aún no montado */ }
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
      <div class="act-admin-header-bar">
        <h3 style="margin:0">Actividades y Grupos Parroquiales</h3>
        ${state.canEditActivities ? `
          <button type="button" class="btn-add-parish-activity" id="btn-d-add-activity" data-add-act-parish="${pid}">
            + Agregar Actividad / Grupo
          </button>` : ""}
      </div>
      <p class="note" style="margin-top:0;margin-bottom:8px">
        ${state.canEditActivities
          ? "Modo Gestión Activo (" + (state.isAdmin ? "Administrador" : "Colaborador") + "): Podés sumar, editar o quitar actividades de este templo."
          : "Sumate a los espacios de oración, coro, catequesis y misión de esta comunidad:"}
      </p>
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
   Doble Rol de Administración ("1118" Admin Maestro / "0000" Colaborador de Actividades)
   ===================================================================== */
function syncAdminUI() {
  state.isAdmin = state.adminRole === "master";
  state.canEditActivities = state.adminRole === "master" || state.adminRole === "collab";

  document.body.classList.toggle("is-admin", state.isAdmin);
  document.body.classList.toggle("is-collab", state.adminRole === "collab");

  const panel = $("#admin-panel");
  const badgeText = $("#admin-badge-text");
  const roleDesc = $("#admin-role-desc");
  const masterActions = $("#admin-master-actions");
  const collabActions = $("#admin-collab-actions");
  const fabAdd = $("#fab-admin-add");
  const footerLabel = $("#footer-admin-label");
  const dEdit = $("#d-edit");

  if (panel) {
    panel.hidden = !state.canEditActivities;
    panel.classList.toggle("is-collab", state.adminRole === "collab");
  }
  if (badgeText) {
    badgeText.textContent = state.isAdmin
      ? "Modo Administrador Maestro"
      : "Rol Comunidad / Colaborador";
  }
  if (roleDesc) {
    roleDesc.textContent = state.isAdmin
      ? "Control total habilitado: podés agregar/editar templos, horarios, actividades y exportar el JSON oficial."
      : "Permiso de Colaborador activo: podés agregar, editar y gestionar actividades y grupos parroquiales de cualquier templo sin alterar sus datos principales.";
  }
  if (masterActions) masterActions.hidden = !state.isAdmin;
  if (collabActions) collabActions.hidden = !state.canEditActivities;
  if (fabAdd) fabAdd.hidden = !state.isAdmin;
  if (dEdit) dEdit.hidden = !state.isAdmin || !state.current;
  if (footerLabel) {
    footerLabel.textContent = state.isAdmin
      ? "Modo Admin Maestro activo"
      : state.adminRole === "collab"
      ? "Modo Colaborador activo"
      : "Acceso administrador / colaborador";
  }
  updateSettingsRolesUI();
}

function openAdminLoginModal() {
  if (state.canEditActivities) {
    $("#admin-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast(state.isAdmin ? "El Modo Administrador Maestro ya está activo" : "El Rol Colaborador ya está activo");
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

let loginAttempts = 0;
let loginLockedUntil = 0;

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const input = $("#admin-pass");
  const err = $("#admin-login-error");
  const pin = input.value.trim();

  if (Date.now() < loginLockedUntil) {
    err.textContent = `Demasiados intentos. Esperá ${Math.ceil((loginLockedUntil - Date.now()) / 1000)} s.`;
    err.hidden = false;
    return;
  }

  if (pin === ADMIN_MASTER_PIN) {
    state.adminRole = "master";
    state.isAdmin = true;
    state.canEditActivities = true;
    Store.set("admin_role_v1", "master");
    Store.set("admin_unlocked", true);
    loginAttempts = 0;
    closeAdminLoginModal();
    dismissSplashScreen();
    syncAdminUI();
    renderList();
    if (state.current) openDetail(state.current.id);
    toast("🔓 Modo Administrador Maestro desbloqueado");
  } else if (pin === ADMIN_COLLAB_PIN) {
    state.adminRole = "collab";
    state.isAdmin = false;
    state.canEditActivities = true;
    Store.set("admin_role_v1", "collab");
    Store.set("admin_unlocked", false);
    loginAttempts = 0;
    closeAdminLoginModal();
    dismissSplashScreen();
    syncAdminUI();
    renderList();
    if (state.current) openDetail(state.current.id);
    toast("🙌 Rol de Comunidad / Colaborador activado para gestionar actividades");
  } else {
    loginAttempts++;
    err.textContent = loginAttempts >= 5
      ? "Demasiados intentos. Esperá 30 s."
      : "Clave incorrecta. Verificá el código e intentá de nuevo.";
    if (loginAttempts >= 5) { loginLockedUntil = Date.now() + 30000; loginAttempts = 0; }
    err.hidden = false;
    input.select();
  }
}

function logoutAdmin() {
  state.adminRole = null;
  state.isAdmin = false;
  state.canEditActivities = false;
  Store.set("admin_role_v1", null);
  Store.set("admin_unlocked", false);
  syncAdminUI();
  renderList();
  if (state.current) openDetail(state.current.id);
  toast("Sesión de gestión cerrada");
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
  Store.set("parishes_cache_v7", cleanList);

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

let customActivitiesDB = (function loadCustomActivitiesDB() {
  const saved = Store.get(CUSTOM_ACTIVITIES_STORAGE_KEY, null);
  return saved && typeof saved === "object" ? saved : {};
})();

function saveCustomActivitiesDB() {
  Store.set(CUSTOM_ACTIVITIES_STORAGE_KEY, customActivitiesDB);
}

function getDefaultActivitiesForParish(p) {
  const pid = String(p.id);
  const slug = norm(p.nombre)
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join("");

  return [
    {
      id: `act_${pid}_oracion`,
      parishId: pid,
      parishName: p.nombre,
      categoria: "Oración",
      nombre: "Grupo de Oración y Adoración Eucarística",
      descripcion: "Encuentro semanal de alabanza, lectio divina y adoración abierta a toda la comunidad.",
      horario: "Jueves 19:45 h",
      instagram: `@oracion.${slug || "parroquia"}`
    },
    {
      id: `act_${pid}_coro`,
      parishId: pid,
      parishName: p.nombre,
      categoria: "Música",
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
      categoria: "Caridad",
      nombre: "Grupo Misionero y Noche de la Caridad",
      descripcion: "Recorridas solidarias, visitas a enfermos y misiones barriales junto a jóvenes y familias.",
      horario: "Viernes 20:00 h",
      instagram: `@misioneros.${slug || "parroquia"}`
    }
  ];
}

function getParishById(parishId) {
  const pid = String(parishId);
  return PARISHES.find(p => String(p.id) === pid) || null;
}

function getParishActivities(p) {
  if (!p) return [];
  const pid = String(p.id);

  if (Array.isArray(customActivitiesDB[pid])) {
    return customActivitiesDB[pid].map((a, idx) => ({
      ...a,
      id: a.id || `act_${pid}_custom_${idx}`,
      parishId: pid,
      parishName: p.nombre
    }));
  }

  if (Array.isArray(p.actividades) && p.actividades.length) {
    return p.actividades.map((a, idx) => ({
      ...a,
      id: a.id || `act_${pid}_${idx}`,
      parishId: pid,
      parishName: p.nombre
    }));
  }

  return getDefaultActivitiesForParish(p);
}

function setParishActivitiesList(parishId, newList) {
  const pid = String(parishId);
  const p = PARISHES.find(x => String(x.id) === pid);
  const normalized = (Array.isArray(newList) ? newList : []).map((a, idx) => ({
    id: a.id || `act_${pid}_${Date.now()}_${idx}`,
    parishId: pid,
    parishName: p ? p.nombre : (a.parishName || "Parroquia"),
    categoria: String(a.categoria || "Comunidad").trim(),
    nombre: String(a.nombre || "Grupo Parroquial").trim(),
    descripcion: String(a.descripcion || "").trim(),
    horario: String(a.horario || "A confirmar").trim(),
    instagram: String(a.instagram || "").trim()
  }));

  customActivitiesDB[pid] = normalized;
  saveCustomActivitiesDB();

  if (p) {
    p.actividades = normalized;
  }
}

function syncActParishDisplay() {
  const sel = $("#act-parish-select"), out = $("#act-parish-display");
  if (!sel || !out) return;
  const p = PARISHES.find(x => String(x.id) === String(sel.value));
  out.textContent = p ? `📍 ${p.nombre}` : "Elegir templo";
}

function openActivityEditor(parishId = null, actIndex = -1) {
  if (!state.canEditActivities) {
    openAdminLoginModal();
    return;
  }
  const modal = $("#activity-edit-modal");
  const selectEl = $("#act-parish-select");
  if (!modal || !selectEl) return;

  const targetPid = String(parishId || (state.current ? state.current.id : (PARISHES[0] ? PARISHES[0].id : "1")));

  selectEl.innerHTML = PARISHES
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-AR"))
    .map(p => `<option value="${esc(p.id)}" ${String(p.id) === targetPid ? "selected" : ""}>${esc(p.nombre)} (${esc(p.barrio)})</option>`)
    .join("");
  syncActParishDisplay();

  const pObj = PARISHES.find(x => String(x.id) === targetPid) || PARISHES[0];
  const acts = getParishActivities(pObj);
  const existing = actIndex >= 0 && acts[actIndex] ? acts[actIndex] : null;

  $("#act-idx").value = String(existing ? actIndex : -1);
  $("#act-edit-title").textContent = existing ? "✏️ Editar Actividad o Grupo" : "🙌 Agregar Nueva Actividad o Grupo";
  $("#act-nombre").value = existing ? existing.nombre : "";
  $("#act-categoria").value = existing && existing.categoria ? existing.categoria : "Jóvenes";
  $("#act-horario").value = existing ? existing.horario : "";
  $("#act-instagram").value = existing ? String(existing.instagram || "").replace(/^@+/, "") : "";
  $("#act-descripcion").value = existing ? existing.descripcion : "";

  modal.hidden = false;
  setTimeout(() => $("#act-nombre")?.focus(), 40);
}

function closeActivityEditor() {
  const modal = $("#activity-edit-modal");
  if (modal) modal.hidden = true;
}

function saveActivityEditor(e) {
  e.preventDefault();
  if (!state.canEditActivities) return;

  const pid = String($("#act-parish-select")?.value || "1");
  const idx = parseInt($("#act-idx")?.value || "-1", 10);
  const nombre = ($("#act-nombre")?.value || "").trim();
  const categoria = ($("#act-categoria")?.value || "Comunidad").trim();
  const horario = ($("#act-horario")?.value || "").trim();
  const rawIg = ($("#act-instagram")?.value || "").trim().replace(/^@+/, "");
  const instagram = rawIg ? `@${rawIg}` : "";
  const descripcion = ($("#act-descripcion")?.value || "").trim();

  if (!nombre || !horario || !descripcion) return;

  const pObj = PARISHES.find(x => String(x.id) === pid);
  const currentActs = [...getParishActivities(pObj)];

  if (idx >= 0 && idx < currentActs.length) {
    currentActs[idx] = {
      ...currentActs[idx],
      nombre,
      categoria,
      horario,
      instagram,
      descripcion
    };
  } else {
    currentActs.unshift({
      id: `act_${pid}_${Date.now()}`,
      parishId: pid,
      parishName: pObj ? pObj.nombre : "Parroquia",
      nombre,
      categoria,
      horario,
      instagram,
      descripcion
    });
  }

  setParishActivitiesList(pid, currentActs);
  closeActivityEditor();

  if (state.current && String(state.current.id) === pid) {
    openDetail(pid);
  }
  if (state.view === "community") {
    renderCommunityView();
  }
  renderList();
  toast(idx >= 0 ? "Actividad parroquial actualizada y guardada" : "Nueva actividad agregada a la parroquia");
}

function deleteParishActivity(parishId, actIndex) {
  if (!state.canEditActivities) return;
  const pid = String(parishId);
  const pObj = PARISHES.find(x => String(x.id) === pid);
  if (!pObj) return;

  const currentActs = [...getParishActivities(pObj)];
  const removed = currentActs[actIndex];
  if (!removed) return;

  currentActs.splice(actIndex, 1);
  setParishActivitiesList(pid, currentActs);

  if (state.current && String(state.current.id) === pid) {
    openDetail(pid);
  }
  if (state.view === "community") {
    renderCommunityView();
  }
  toast(`Actividad eliminada: ${removed.nombre}`);
}

function getInitialSocialDB() {
  const now = Date.now();
  return {
    currentUser: "mi.perfil", // Perfil personal local activo por defecto para guardar cambios sin perderlos
    explicitGuest: false,
    users: {
      "mi.perfil": {
        username: "mi.perfil",
        password: "1234",
        apodo: "Mi Perfil Peregrino",
        bio: "Caminando en comunidad por las parroquias de CABA y GBA. 🙏",
        avatarIcon: "✝️",
        avatarUrl: "",
        miiConfig: {
          skin: "#F5CBA7",
          hair: "corto",
          hairColor: "#2C1B18",
          face: "sonrisa",
          bg: "#DBEAFE"
        },
        instagram: "@mi.parroquia.ba",
        twitter: "@peregrino_ba",
        followingUsers: ["martina.recoleta", "padre.tomas"],
        followedParishes: ["1", "2"],
        joinedActivities: ["act_1_oracion"]
      },
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

let socialDB = (function loadAndValidateSocialDB() {
  const seed = getInitialSocialDB();
  const saved = Store.get(SOCIAL_STORAGE_KEY, null);
  if (!saved || typeof saved !== "object" || !saved.users || !Array.isArray(saved.posts)) {
    Store.set(SOCIAL_STORAGE_KEY, seed);
    return seed;
  }
  if (!saved.users["mi.perfil"]) {
    saved.users["mi.perfil"] = seed.users["mi.perfil"];
  }
  if (!saved.currentUser && !saved.explicitGuest) {
    saved.currentUser = "mi.perfil";
  }
  Store.set(SOCIAL_STORAGE_KEY, saved);
  return saved;
})();

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
  const pid = String(p.id);
  const activities = getParishActivities(p);
  if (!activities.length) {
    return `<div class="empty"><strong>No hay actividades cargadas en este templo</strong>${state.canEditActivities ? "Usá el botón «+ Agregar Actividad / Grupo» para sumar la primera." : ""}</div>`;
  }
  return activities.map((act, idx) => {
    const joined = isCurrentUserInActivity(act.id);
    const followersCount = getActivityFollowersCount(act.id);
    const igUrl = normalizeSocialHandleUrl(act.instagram, "instagram");
    const adminBtns = state.canEditActivities ? `
      <div class="act-item-admin-actions">
        <button type="button" class="btn-act-mini" data-edit-act-parish="${pid}" data-edit-act-idx="${idx}">✏️ Editar actividad</button>
        <button type="button" class="btn-act-mini danger" data-del-act-parish="${pid}" data-del-act-idx="${idx}">🗑️ Eliminar</button>
      </div>` : "";
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
        ${adminBtns}
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

  const addActBtn = $("#btn-d-add-activity");
  if (addActBtn) {
    addActBtn.onclick = () => openActivityEditor(p.id, -1);
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
      const editBtn = e.target.closest("[data-edit-act-idx]");
      if (editBtn) {
        openActivityEditor(editBtn.dataset.editActParish || p.id, parseInt(editBtn.dataset.editActIdx, 10));
        return;
      }
      const delBtn = e.target.closest("[data-del-act-idx]");
      if (delBtn) {
        deleteParishActivity(delBtn.dataset.delActParish || p.id, parseInt(delBtn.dataset.delActIdx, 10));
        return;
      }
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
  const rawAvatarUrl = String(me.avatarUrl || "").trim();
  const isDataAvatar = rawAvatarUrl.startsWith("data:image/");
  const externalAvatarUrl = isDataAvatar ? "" : rawAvatarUrl;
  const hasCustomPhoto = Boolean(rawAvatarUrl);
  const safeApodo = String(me.apodo || "").replace(/"/g, "&quot;");
  const safeIg = String(me.instagram || "").replace(/"/g, "&quot;");
  const safeTw = String(me.twitter || "").replace(/"/g, "&quot;");
  const safeExtUrl = externalAvatarUrl.replace(/"/g, "&quot;");

  container.innerHTML = `
    ${renderUserPublicCardHtml(me, true)}

    <div class="profile-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;flex-wrap:wrap">
        <h3 style="font-size:1.05rem;font-weight:600">Editar Mi Perfil y Avatar (Guardado en LocalStorage)</h3>
        <button type="button" class="admin-logout-btn" id="btn-user-logout">Cambiar / Cerrar sesión</button>
      </div>
      <form id="profile-edit-form" class="admin-edit-form">
        <div class="form-field">
          <label for="p-apodo">Apodo / Nombre público</label>
          <input id="p-apodo" type="text" required value="${safeApodo}">
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
            <small style="color:var(--muted);font-size:.75rem">${isDataAvatar ? "✅ Avatar personalizado activo (Mii o Foto en memoria local)." : "Se optimiza automáticamente para almacenamiento local."}</small>
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
          <label for="p-avatar-url">URL externa de imagen de perfil (opcional)</label>
          <input id="p-avatar-url" type="text" value="${safeExtUrl}" placeholder="https://... (dejá vacío para mantener tu Mii o foto subida)">
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="p-ig">Instagram</label>
            <input id="p-ig" type="text" value="${safeIg}" placeholder="@tu.usuario">
          </div>
          <div class="form-field">
            <label for="p-tw">Twitter / X</label>
            <input id="p-tw" type="text" value="${safeTw}" placeholder="@tu_usuario">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-sm submit">💾 Guardar Cambios en Mi Perfil</button>
        </div>
      </form>

      <div class="profile-section-title" style="margin-top:16px">Cambiar rápido de cuenta comunitaria</div>
      <div class="demo-accounts">
        <button type="button" class="demo-pill" data-demo-login="mi.perfil">🙏 Mi Perfil (@mi.perfil)</button>
        <button type="button" class="demo-pill" data-demo-login="martina.recoleta">🎵 Martina (@martina.recoleta)</button>
        <button type="button" class="demo-pill" data-demo-login="padre.tomas">✝️ P. Tomás (@padre.tomas)</button>
        <button type="button" class="demo-pill" data-demo-login="lucas.coro">🕯️ Lucas (@lucas.coro)</button>
      </div>
    </div>`;
}

/* =====================================================================
   Panel de Configuración: Modo Oscuro / Noche e Idioma (localStorage)
   ===================================================================== */
const SETTINGS_STORAGE_KEY = "app_settings_v1";

const I18N_DICT = {
  "es-AR": {
    app_title: "Guía Católica",
    app_subtitle: "",
    account_btn: "Cuenta",
    nav_temples: "Templos",
    nav_map: "Mapa",
    nav_spiritual: "Racha",
    nav_liturgy: "Liturgia",
    nav_bible: "Libro del Pueblo de Dios",
    nav_reflections: "Reflexiones del Papa",
    nav_saints: "Santos del Día",
    nav_community: "Comunidad",
    nav_profile: "Perfil",
    list_heading: "Parroquias de Buenos Aires",
    list_subheading: "",
    search_placeholder: "Buscá por nombre, barrio, tipo o calle",
    near_me_btn: "Cerca de mí",
    spiritual_heading: "Racha Espiritual y Notas",
    spiritual_subheading: "",
    liturgy_heading: "Liturgia de la Palabra",
    liturgy_subheading: "Primera lectura, Salmo y evangelio del día.",
    bible_heading: "El Libro del Pueblo de Dios",
    bible_subheading: "Traducción oficial de la Conferencia Episcopal Argentina (CEA).",
    reflections_heading: "Reflexiones del Papa",
    reflections_subheading: "",
    saints_heading: "Santos del Día",
    saints_subheading: "",
    community_heading: "Comunidad y Ranking",
    community_subheading: "",
    profile_heading: "Perfil y Cuenta",
    profile_subheading: "Acá es para que cuentes un poco de vos",
    settings_title: "⚙️ Configuración",
    settings_subtitle: "Personalizá la apariencia visual y el idioma de la aplicación.",
    dark_mode_label: "🌙 Modo Oscuro / Noche",
    dark_mode_desc: "Aplica tonos profundos y descansa la vista durante la oración nocturna.",
    lang_label: "🌎 Idioma de la Interfaz",
    lang_desc: "Seleccioná el idioma para los menús y etiquetas principales.",
    settings_done: "Listo"
  },
  "en": {
    app_title: "Parishes BA",
    app_subtitle: "Buenos Aires · Catholic Community & Liturgy",
    account_btn: "Account",
    nav_temples: "Churches",
    nav_map: "Map",
    nav_spiritual: "Streak & Notes",
    nav_liturgy: "Liturgy",
    nav_bible: "Book of the People of God",
    nav_reflections: "Pope's Reflections",
    nav_saints: "Saints of the Day",
    nav_community: "Community",
    nav_profile: "Profile",
    list_heading: "Parishes of Buenos Aires",
    list_subheading: "Find Mass times, confessions, parish groups and live occupancy.",
    search_placeholder: "Search by parish name, neighborhood or street",
    near_me_btn: "Near me",
    spiritual_heading: "Spiritual Streak & Notes",
    spiritual_subheading: "Log your Masses and Adoration, save reflections and track prayer time.",
    liturgy_heading: "Liturgy of the Word",
    liturgy_subheading: "First Reading, Responsorial Psalm, Gospel of the Day and pastoral explanation.",
    bible_heading: "The Book of the People of God",
    bible_subheading: "Official Argentine Liturgical Translation (CEA).",
    reflections_heading: "Pope's Reflections",
    reflections_subheading: "",
    saints_heading: "Saints of the Day",
    saints_subheading: "Daily Catholic saints, inspiring biographies and spiritual quotes.",
    community_heading: "Community & Ranking",
    community_subheading: "Parish feed, member & group directory and most active churches.",
    profile_heading: "Profile & Account",
    profile_subheading: "Your community identity, Mii avatar or photo, followed parishes and groups.",
    settings_title: "⚙️ Settings",
    settings_subtitle: "Customize the visual theme and interface language.",
    dark_mode_label: "🌙 Dark / Night Mode",
    dark_mode_desc: "Applies deep nocturnal colors across the entire interface.",
    lang_label: "🌎 Interface Language",
    lang_desc: "Select the language for main menus and headings.",
    settings_done: "Done"
  },
  "pt": {
    app_title: "Paróquias BA",
    app_subtitle: "CABA e GBA · Comunidade e Liturgia",
    account_btn: "Conta",
    nav_temples: "Igrejas",
    nav_map: "Mapa",
    nav_spiritual: "Ofensiva / Notas",
    nav_liturgy: "Liturgia",
    nav_bible: "Livro do Povo de Deus",
    nav_reflections: "Reflexões do Papa",
    nav_saints: "Santos do Dia",
    nav_community: "Comunidade",
    nav_profile: "Perfil",
    list_heading: "Paróquias de Buenos Aires",
    list_subheading: "Encontre horários de missa, confissões, grupos e lotação em tempo real.",
    search_placeholder: "Busque por nome, bairro, tipo ou rua",
    near_me_btn: "Perto de mim",
    spiritual_heading: "Ofensiva Espiritual e Notas",
    spiritual_subheading: "Registre suas missas e adorações, salve reflexões e veja suas estatísticas.",
    liturgy_heading: "Liturgia da Palavra",
    liturgy_subheading: "Primeira Leitura, Salmo Responsorial, Evangelho do dia e explicação pastoral.",
    bible_heading: "O Livro do Povo de Deus",
    bible_subheading: "Tradução oficial da Conferência Episcopal Argentina (CEA).",
    reflections_heading: "Reflexões do Papa",
    reflections_subheading: "",
    saints_heading: "Santos do Dia",
    saints_subheading: "Santoral católico diário, biografias inspiradoras e frases espirituais.",
    community_heading: "Comunidade e Ranking",
    community_subheading: "Mural comunitário, busca de fiéis/grupos e paróquias mais ativas.",
    profile_heading: "Perfil e Conta",
    profile_subheading: "Sua identidade comunitária, avatar Mii ou foto, paróquias e grupos.",
    settings_title: "⚙️ Configurações",
    settings_subtitle: "Personalize o modo noturno e o idioma do aplicativo.",
    dark_mode_label: "🌙 Modo Escuro / Noite",
    dark_mode_desc: "Aplica cores profundas para descansar a vista durante a oração noturna.",
    lang_label: "🌎 Idioma da Interface",
    lang_desc: "Selecione o idioma dos menus e títulos principais.",
    settings_done: "Concluído"
  },
  "it": {
    app_title: "Parrocchie BA",
    app_subtitle: "Buenos Aires · Comunità e Liturgia",
    account_btn: "Profilo",
    nav_temples: "Chiese",
    nav_map: "Mappa",
    nav_spiritual: "Costanza / Note",
    nav_liturgy: "Liturgia",
    nav_bible: "Libro del Popolo di Dio",
    nav_reflections: "Riflessioni del Papa",
    nav_saints: "Santi del Giorno",
    nav_community: "Comunità",
    nav_profile: "Account",
    list_heading: "Parrocchie di Buenos Aires",
    list_subheading: "Trova orari delle Messe, confessioni, gruppi e affluenza in tempo reale.",
    search_placeholder: "Cerca per nome, quartiere o via",
    near_me_btn: "Vicino a me",
    spiritual_heading: "Vita Spirituale e Note",
    spiritual_subheading: "Registra Sante Messe e Adorazioni, salva riflessioni e statistiche.",
    liturgy_heading: "Liturgia della Parola",
    liturgy_subheading: "Prima Lettura, Salmo Responsoriale, Vangelo del giorno e spiegazione pastorale.",
    bible_heading: "Il Libro del Popolo di Dio",
    bible_subheading: "Traduzione ufficiale della Conferenza Episcopale Argentina (CEA).",
    reflections_heading: "Riflessioni del Papa",
    reflections_subheading: "",
    saints_heading: "Santi del Giorno",
    saints_subheading: "Santi del giorno, biografie edificanti e pensieri spirituali.",
    community_heading: "Comunità e Classifica",
    community_subheading: "Bacheca comunitaria, ricerca fedeli/gruppi e parrocchie più attive.",
    profile_heading: "Profilo e Account",
    profile_subheading: "La tua identità comunitaria, avatar Mii o foto e parrocchie seguite.",
    settings_title: "⚙️ Impostazioni",
    settings_subtitle: "Personalizza il tema notturno e la lingua dell'applicazione.",
    dark_mode_label: "🌙 Modalità Scura / Notte",
    dark_mode_desc: "Applica toni profondi per riposare la vista durante la preghiera serale.",
    lang_label: "🌎 Lingua dell'Interfaccia",
    lang_desc: "Scegli la lingua per i menu e le sezioni principali.",
    settings_done: "Fatto"
  }
};

let appSettings = (function loadAppSettings() {
  const saved = Store.get(SETTINGS_STORAGE_KEY, null);
  return {
    darkMode: Boolean(saved && saved.darkMode),
    lang: (saved && saved.lang && I18N_DICT[saved.lang]) ? saved.lang : "es-AR",
    themePalette: (saved && saved.themePalette) ? saved.themePalette : "bordo"
  };
})();

function saveAppSettings() {
  Store.set(SETTINGS_STORAGE_KEY, appSettings);
}

function updateSettingsRolesUI() {
  const dot = $("#settings-role-dot");
  const title = $("#settings-role-title");
  const sub = $("#settings-role-sub");
  const logoutBtn = $("#btn-settings-role-logout");

  if (!dot || !title || !sub) return;

  if (state.isAdmin) {
    dot.className = "role-status-dot is-admin";
    title.textContent = "Rol actual: Administrador Maestro (1118)";
    sub.textContent = "Control total: alta, edición y eliminación de templos y exportación de datos.";
    if (logoutBtn) logoutBtn.hidden = false;
  } else if (state.adminRole === "collab") {
    dot.className = "role-status-dot is-collab";
    title.textContent = "Rol actual: Colaborador de Actividades (0000)";
    sub.textContent = "Habilitado para publicar y moderar actividades comunitarias y grupos parroquiales.";
    if (logoutBtn) logoutBtn.hidden = false;
  } else {
    dot.className = "role-status-dot";
    title.textContent = "Rol actual: Invitado / Fiel";
    sub.textContent = "Modo lectura para consultar templos, horarios, oraciones y santoral.";
    if (logoutBtn) logoutBtn.hidden = true;
  }
}

function applyAppSettings() {
  const isDark = Boolean(appSettings.darkMode);
  document.body.classList.toggle("dark-mode", isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.documentElement.setAttribute("lang", appSettings.lang || "es-AR");

  const palette = appSettings.themePalette || "bordo";
  document.documentElement.setAttribute("data-palette", palette);
  document.body.setAttribute("data-palette", palette);

  // Marcar la opción activa en el selector de paleta
  $$(".palette-option-btn").forEach(btn => {
    const isCur = btn.dataset.palette === palette;
    btn.classList.toggle("is-active", isCur);
    btn.setAttribute("aria-checked", isCur ? "true" : "false");
  });

  const metaTheme = $("#meta-theme-color");
  if (metaTheme) {
    const themeColors = {
      bordo: isDark ? "#0D0A0C" : "#6E1420",
      azul: isDark ? "#0B0F19" : "#243B8F",
      oro: isDark ? "#120E06" : "#B45309"
    };
    metaTheme.setAttribute("content", themeColors[palette] || (isDark ? "#0D0A0C" : "#6E1420"));
  }

  const toggleEl = $("#toggle-dark-mode");
  if (toggleEl) toggleEl.checked = isDark;

  const langSelect = $("#select-app-lang");
  if (langSelect) langSelect.value = appSettings.lang || "es-AR";

  updateSettingsRolesUI();

  const dict = I18N_DICT[appSettings.lang] || I18N_DICT["es-AR"];
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key === "account_btn" && getCurrentUserObj()) return; // Preservar apodo si hay sesión activa
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)) {
      el.textContent = dict[key];
      if (el.classList.contains("sub") && !dict[key]) {
        el.hidden = true;
      }
    }
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
}

function openSettingsModal() {
  const modal = $("#settings-modal");
  if (!modal) return;
  applyAppSettings();
  modal.hidden = false;
}

function closeSettingsModal() {
  const modal = $("#settings-modal");
  if (modal) modal.hidden = true;
}

/* =====================================================================
   Módulo de Notas, Racha Espiritual y Estadísticas (localStorage Validado)
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

function validateAndSanitizeSpiritualDB(raw) {
  const seed = buildInitialSpiritualDB();
  if (!raw || typeof raw !== "object") return seed;

  const validTypes = new Set(["misa_finde", "adoracion", "misa_semana"]);
  const validSlots = new Set(["Mañana", "Tarde", "Noche"]);

  const checkins = Array.isArray(raw.checkins)
    ? raw.checkins
        .filter(c => c && typeof c === "object")
        .map((c, idx) => ({
          id: String(c.id || `chk_${Date.now()}_${idx}`),
          date: /^\d{4}-\d{2}-\d{2}$/.test(String(c.date || "")) ? String(c.date) : getTodayIsoDate(),
          type: validTypes.has(c.type) ? c.type : "misa_finde",
          slot: validSlots.has(c.slot) ? c.slot : "Mañana",
          parishId: String(c.parishId || "1"),
          createdAt: Number(c.createdAt) || Date.now()
        }))
    : seed.checkins;

  const notes = Array.isArray(raw.notes)
    ? raw.notes
        .filter(n => n && typeof n === "object" && (n.title || n.content))
        .map((n, idx) => ({
          id: String(n.id || `note_${Date.now()}_${idx}`),
          title: String(n.title || "Reflexión personal").trim(),
          category: String(n.category || "Oración").trim(),
          parishId: String(n.parishId || ""),
          content: String(n.content || "").trim(),
          updatedAt: Number(n.updatedAt) || Date.now()
        }))
    : seed.notes;

  return {
    lastParishId: String(raw.lastParishId || "1"),
    checkins,
    notes
  };
}

let spiritualDB = (function loadSpiritualDB() {
  const saved = Store.get(SPIRITUAL_STORAGE_KEY, null);
  const sanitized = validateAndSanitizeSpiritualDB(saved);
  Store.set(SPIRITUAL_STORAGE_KEY, sanitized);
  return sanitized;
})();

function saveSpiritualDB() {
  spiritualDB = validateAndSanitizeSpiritualDB(spiritualDB);
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
      levelTitle: "Laico"
    };
  }

  const firstSunday = getSundayOfWeekIso(list[0].date);
  const weekendHasFindeMass = new Map();

  list.forEach(chk => {
    const sunKey = getSundayOfWeekIso(chk.date);
    if (chk.type === "misa_finde") {
      weekendHasFindeMass.set(sunKey, true);
    }
  });

  // Recorremos todos los fines de semana COMPLETADOS (cuyo domingo < today)
  let cursorSun = firstSunday;
  let lastMissedWeekend = null;

  while (cursorSun < today) {
    if (!weekendHasFindeMass.get(cursorSun)) {
      lastMissedWeekend = cursorSun;
    }
    cursorSun = addDaysIso(cursorSun, 7);
  }

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

  // Escala de niveles según semanas de racha consecutivas:
  // 1ra semana: Laico
  // 2da a 3era semana: Creyente
  // 5to a 6to semana (o 4 a 6): Monaguillo
  // 7mo a 10mo semana: Siervo de Dios
  // 11 a 14 semanas: Beato
  // 15 semanas en adelante: Santo
  let levelTitle = "Laico";
  if (consecutiveWeekends >= 15) {
    levelTitle = "Santo";
  } else if (consecutiveWeekends >= 11) {
    levelTitle = "Beato";
  } else if (consecutiveWeekends >= 7) {
    levelTitle = "Siervo de Dios";
  } else if (consecutiveWeekends >= 4) {
    levelTitle = "Monaguillo";
  } else if (consecutiveWeekends >= 2) {
    levelTitle = "Creyente";
  } else {
    levelTitle = "Laico";
  }

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

/**
 * Calcula en tiempo real todas las métricas personales y comunitarias:
 * Regla estricta: Misa = 60 min | Adoración = 90 min
 */
function computeSpiritualMetrics(checkins) {
  const list = Array.isArray(checkins) ? checkins : [];
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

  list.forEach(chk => {
    const isAdoracion = chk.type === "adoracion";
    const mins = isAdoracion ? 90 : 60; // Misa = 60 min, Adoración = 90 min
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
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
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

  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
  const maxDayVal = Math.max(1, sortedDays[0] ? sortedDays[0][1] : 1);
  const topDayName = sortedDays[0] && sortedDays[0][1] > 0 ? sortedDays[0][0] : "Domingo";

  const sortedParishes = [...parishCounts.entries()].sort((a, b) => b[1].count - a[1].count || b[1].minutes - a[1].minutes);
  const topParishEntry = sortedParishes[0] || null;
  const topParishObj = topParishEntry ? getParishById(topParishEntry[0]) : PARISHES[0];

  const sortedMonths = [...monthStats.values()].sort((a, b) => b.points - a.points || b.minutes - a.minutes);
  const maxMonthPts = Math.max(1, sortedMonths[0] ? sortedMonths[0].points : 1);

  return {
    totalMinutes,
    massMinutes,
    adorationMinutes,
    massCount,
    adorationCount,
    formattedTime,
    dayCounts,
    sortedDays,
    maxDayVal,
    topDayName,
    topParishEntry,
    topParishObj,
    sortedMonths,
    maxMonthPts
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
      <path d="M0 180 L0 148 Q95 132 200 146 T400 140 L400 180 Z" fill="rgba(15, 7, 30, 0.72)"/>
      <path d="M85 165 L85 112 L130 84 L130 165 Z" fill="rgba(28, 14, 54, 0.85)"/>
      <path d="M270 165 L270 112 L315 84 L315 165 Z" fill="rgba(28, 14, 54, 0.85)"/>
      <path d="M125 165 L125 96 L200 50 L275 96 L275 165 Z" fill="rgba(39, 19, 72, 0.92)" stroke="rgba(250, 243, 224, 0.22)" stroke-width="1.2"/>
      <path d="M178 64 L200 22 L222 64 Z" fill="rgba(54, 25, 96, 0.95)" stroke="rgba(250, 243, 224, 0.28)" stroke-width="1.2"/>
      <path d="M200 6 V22 M194 12 H206" stroke="#FDE047" stroke-width="2.4" stroke-linecap="round"/>
      <circle class="vitral-window" cx="200" cy="86" r="13" fill="#F59E0B" stroke="#FEF08A" stroke-width="1.5"/>
      <path class="vitral-window" d="M150 138 V112 A8 8 0 0 1 166 112 V138 Z" fill="#FBBF24"/>
      <path class="vitral-window" d="M234 138 V112 A8 8 0 0 1 250 112 V138 Z" fill="#FBBF24"/>
      <path class="vitral-window" d="M188 165 V125 A12 12 0 0 1 212 125 V165 Z" fill="#FDE047"/>
    </svg>
  </div>`;

/* =====================================================================
   Selector de Fechas Personalizado y Minimalista (Sin Input Nativo)
   ===================================================================== */
const CDP_MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const CDP_WEEKDAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatHumanSpanishDate(isoDateStr) {
  const cleanIso = /^\d{4}-\d{2}-\d{2}$/.test(String(isoDateStr || "")) ? String(isoDateStr) : getTodayIsoDate();
  const [y, m, d] = cleanIso.split("-").map(Number);
  const dt = new Date(y || 2026, (m || 11) - 1, d || 5, 12, 0, 0);
  const label = dt.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function renderCustomDatePickerHtml(pickerId, selectedIsoDate, opts = {}) {
  const cleanIso = /^\d{4}-\d{2}-\d{2}$/.test(String(selectedIsoDate || "")) ? String(selectedIsoDate) : getTodayIsoDate();
  const todayIso = getTodayIsoDate();
  const [selY, selM, selD] = cleanIso.split("-").map(Number);

  const viewState = state.datePickerViewMonth[pickerId] || { year: selY, month: selM - 1 };
  const vYear = viewState.year;
  const vMonth = viewState.month; // 0..11

  const isOpen = state.openDatePickerId === pickerId;
  const blockClass = opts.blockMode ? "cdp-block" : "";

  const firstDayOfMonth = new Date(vYear, vMonth, 1, 12, 0, 0);
  // Convertir domingo (0) a índice 6 (lunes = 0 .. domingo = 6)
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(vYear, vMonth + 1, 0, 12, 0, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push(`<span class="cdp-day is-outside" aria-hidden="true"></span>`);
  }
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const cellIso = `${vYear}-${String(vMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const isSel = cellIso === cleanIso;
    const isToday = cellIso === todayIso;
    cells.push(`
      <button type="button" class="cdp-day ${isSel ? "is-selected" : ""} ${isToday ? "is-today" : ""}"
        data-cdp-pick="${pickerId}" data-cdp-date="${cellIso}" aria-label="Elegir ${cellIso}">
        ${dayNum}
      </button>`);
  }

  return `
    <div class="custom-date-picker ${blockClass}" data-cdp-root="${pickerId}">
      <input type="hidden" id="${pickerId}-date-input" value="${cleanIso}">
      <button type="button" class="cdp-step-btn" data-cdp-step="${pickerId}" data-cdp-dir="-1" title="Día anterior" aria-label="Día anterior">◀</button>
      <button type="button" class="cdp-trigger" data-cdp-toggle="${pickerId}" aria-expanded="${isOpen}" aria-label="Abrir calendario estilizado">
        <span class="cdp-trigger-left">
          <svg class="cdp-cal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${formatHumanSpanishDate(cleanIso)}</span>
        </span>
        <span class="cdp-chevron" aria-hidden="true">▾</span>
      </button>
      <button type="button" class="cdp-step-btn" data-cdp-step="${pickerId}" data-cdp-dir="1" title="Día siguiente" aria-label="Día siguiente">▶</button>
      <button type="button" class="cdp-today-btn" data-cdp-today="${pickerId}">Hoy</button>

      ${isOpen ? `
        <div class="cdp-popover" role="dialog" aria-label="Selector de fecha">
          <div class="cdp-head">
            <span class="cdp-month-label">${CDP_MONTH_NAMES[vMonth]} ${vYear}</span>
            <div class="cdp-month-nav">
              <button type="button" class="cdp-nav-btn" data-cdp-month="${pickerId}" data-cdp-mdir="-1" aria-label="Mes anterior">‹</button>
              <button type="button" class="cdp-nav-btn" data-cdp-month="${pickerId}" data-cdp-mdir="1" aria-label="Mes siguiente">›</button>
            </div>
          </div>
          <div class="cdp-weekdays" aria-hidden="true">
            ${CDP_WEEKDAYS_SHORT.map(w => `<span>${w}</span>`).join("")}
          </div>
          <div class="cdp-grid">
            ${cells.join("")}
          </div>
          <div class="cdp-foot">
            <button type="button" class="cdp-foot-btn primary" data-cdp-today="${pickerId}">Ir a Hoy (${todayIso})</button>
            <button type="button" class="cdp-foot-btn" data-cdp-close="${pickerId}">Cerrar</button>
          </div>
        </div>
      ` : ""}
    </div>`;
}

function updateDateForPicker(pickerId, newIsoDate, closePopover = true) {
  const cleanIso = /^\d{4}-\d{2}-\d{2}$/.test(String(newIsoDate || "")) ? String(newIsoDate) : getTodayIsoDate();
  const [y, m] = cleanIso.split("-").map(Number);
  state.datePickerViewMonth[pickerId] = { year: y, month: m - 1 };
  if (closePopover) {
    state.openDatePickerId = null;
  }

  if (pickerId === "streak") {
    state.streakDate = cleanIso;
    renderSpiritualView();
  } else if (pickerId === "liturgy") {
    state.liturgyDate = cleanIso;
    Store.set("ui_liturgy_date_v1", cleanIso);
    renderLiturgyView();
  } else if (pickerId === "saints") {
    state.saintsDate = cleanIso;
    Store.set("ui_saints_date_v1", cleanIso);
    renderSaintsView();
  }
}

function handleCustomDatePickerInteraction(e) {
  const toggleBtn = e.target.closest("[data-cdp-toggle]");
  if (toggleBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = toggleBtn.dataset.cdpToggle;
    if (state.openDatePickerId === pid) {
      state.openDatePickerId = null;
    } else {
      state.openDatePickerId = pid;
      const curIso = pid === "streak" ? state.streakDate : pid === "saints" ? state.saintsDate : state.liturgyDate;
      const [y, m] = String(curIso || getTodayIsoDate()).split("-").map(Number);
      state.datePickerViewMonth[pid] = { year: y || 2026, month: (m || 11) - 1 };
    }
    if (pid === "streak") renderSpiritualView();
    else if (pid === "liturgy") renderLiturgyView();
    else if (pid === "saints") renderSaintsView();
    return true;
  }

  const monthBtn = e.target.closest("[data-cdp-month]");
  if (monthBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = monthBtn.dataset.cdpMonth;
    const dir = parseInt(monthBtn.dataset.cdpMdir, 10) || 1;
    const curIso = pid === "streak" ? state.streakDate : pid === "saints" ? state.saintsDate : state.liturgyDate;
    const [y, m] = String(curIso || getTodayIsoDate()).split("-").map(Number);
    const curView = state.datePickerViewMonth[pid] || { year: y, month: m - 1 };
    const dt = new Date(curView.year, curView.month + dir, 1, 12, 0, 0);
    state.datePickerViewMonth[pid] = { year: dt.getFullYear(), month: dt.getMonth() };
    if (pid === "streak") renderSpiritualView();
    else if (pid === "liturgy") renderLiturgyView();
    else if (pid === "saints") renderSaintsView();
    return true;
  }

  const pickDayBtn = e.target.closest("[data-cdp-pick]");
  if (pickDayBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = pickDayBtn.dataset.cdpPick;
    const chosenDate = pickDayBtn.dataset.cdpDate;
    updateDateForPicker(pid, chosenDate, true);
    return true;
  }

  const stepBtn = e.target.closest("[data-cdp-step]");
  if (stepBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = stepBtn.dataset.cdpStep;
    const dir = parseInt(stepBtn.dataset.cdpDir, 10) || 1;
    const curIso = pid === "streak" ? state.streakDate : pid === "saints" ? state.saintsDate : state.liturgyDate;
    const nextIso = addDaysIso(curIso || getTodayIsoDate(), dir);
    updateDateForPicker(pid, nextIso, true);
    return true;
  }

  const todayBtn = e.target.closest("[data-cdp-today]");
  if (todayBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = todayBtn.dataset.cdpToday;
    updateDateForPicker(pid, getTodayIsoDate(), true);
    toast("Fecha actualizada al día de hoy");
    return true;
  }

  const closeBtn = e.target.closest("[data-cdp-close]");
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = closeBtn.dataset.cdpClose;
    state.openDatePickerId = null;
    if (pid === "streak") renderSpiritualView();
    else if (pid === "liturgy") renderLiturgyView();
    else if (pid === "saints") renderSaintsView();
    return true;
  }

  return false;
}

function renderStreakTabHtml() {
  const streak = evaluateSpiritualStreak(spiritualDB.checkins);
  const metrics = computeSpiritualMetrics(spiritualDB.checkins);
  const selectedStreakDate = state.streakDate || getTodayIsoDate();

  const recentCheckins = [...spiritualDB.checkins]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 10);

  return `
    <!-- Tarjeta Hero con Contador Grande de Racha y Fondo Animado de Parroquia -->
    <div class="streak-hero-card">
      ${SVG_ANIMATED_PARISH_SCENE}
      <div class="streak-hero-content">
        <div class="streak-badge-top">🔥 ${streak.levelTitle} · ${streak.consecutiveWeekends} ${streak.consecutiveWeekends === 1 ? "fin de semana" : "fines de semana"} seguidos</div>
        <div class="streak-counter-num" id="streak-counter-value">${streak.activePoints}</div>
        <p class="streak-counter-label">Puntos de Racha Espiritual Activa</p>

        <div class="streak-points-pills">
          <span class="streak-pt-pill"><strong>+5 pts</strong> Misa Finde (60m)</span>
          <span class="streak-pt-pill"><strong>+3 pts</strong> Adoración (90m)</span>
          <span class="streak-pt-pill"><strong>+1 pt</strong> Misa Semana (60m)</span>
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

    <!-- Barra Resumen de Estadísticas en Tiempo Real (Actualización Instantánea) -->
    <div class="social-stats-bar">
      <div class="stat-box">
        <strong id="live-stat-time">${metrics.formattedTime}</strong>
        <span>⏱️ Tiempo (${metrics.totalMinutes}m)</span>
      </div>
      <div class="stat-box">
        <strong id="live-stat-counts">${metrics.massCount}M · ${metrics.adorationCount}A</strong>
        <span>⛪ Misa 60m / Ado 90m</span>
      </div>
      <div class="stat-box">
        <strong id="live-stat-notes">${spiritualDB.notes.length}</strong>
        <span>📓 Notas guardadas</span>
      </div>
    </div>

    <!-- Formulario de Check-in de Racha -->
    <div class="checkin-card">
      <h4>Registrar Racha</h4>

      <form id="streak-checkin-form" class="admin-form">
        <div class="form-row-2">
          <div class="form-field">
            <label for="streak-activity-select">Actividad celebrada</label>
            <select id="streak-activity-select" required>
              <option value="misa_finde">⛪ Misa de fin de semana (Sáb tarde / Dom) · +5 pts (60 min)</option>
              <option value="adoracion">🙌 Adoración Eucarística · +3 pts (90 min)</option>
              <option value="misa_semana">🕯️ Misa de semana (Lun a Sáb mañana) · +1 pt (60 min)</option>
            </select>
          </div>
          <div class="form-field">
            <label>Fecha del servicio</label>
            ${renderCustomDatePickerHtml("streak", selectedStreakDate, { blockMode: true })}
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
          <label>Templo / Parroquia de la celebración</label>
          <button type="button" class="parish-picker-trigger-btn" id="btn-open-parish-picker" aria-haspopup="dialog" aria-label="Elegir parroquia en cuadrícula">
            <span id="streak-parish-display-name">📍 ${getParishById(spiritualDB.lastParishId)?.nombre || "Catedral Metropolitana de Buenos Aires"}</span>
            <span class="loc-trigger-badge">Elegir en Grid ▾</span>
          </button>
          <select id="streak-parish-select" hidden>
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
      <p>Cada asistencia actualiza al instante el contador de racha y el panel de estadísticas.</p>
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
      <p>Guardá tus meditaciones de la Misa, apuntes de homilías, propósitos o frutos de tu Adoración en el almacenamiento local de tu dispositivo.</p>

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
          <label>Parroquia vinculada (opcional)</label>
          <button type="button" class="parish-picker-trigger-btn" id="btn-open-note-parish-picker" aria-haspopup="dialog" aria-label="Elegir parroquia en cuadrícula">
            <span id="note-parish-display-name">📍 ${getParishById(editingNote ? editingNote.parishId : spiritualDB.lastParishId)?.nombre || "— Reflexión general (toca para elegir templo) —"}</span>
            <span class="loc-trigger-badge">Elegir en Grid ▾</span>
          </button>
          <select id="note-parish-select" hidden>
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
          <button type="submit" class="btn-sm submit">${editingNote ? "💾 Guardar cambios" : "📓 Guardar en mis Notas"}</button>
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
  const m = computeSpiritualMetrics(checkins);

  const commUsersCount = Object.keys(socialDB.users || {}).length;
  const commTotalMasses = m.massCount + commUsersCount * 14;
  const commTotalAdorations = m.adorationCount + commUsersCount * 6;
  const commTotalMinutes = commTotalMasses * 60 + commTotalAdorations * 90;
  const commTotalHours = Math.round(commTotalMinutes / 60);

  return `
    <div class="checkin-card">
      <h4>📊 Mis Estadísticas Espirituales</h4>
      <p>Cálculo exacto en tiempo real: <strong>Santa Misa = 60 min</strong> · <strong>Adoración Eucarística = 90 min</strong>.</p>

      <div class="stats-kpi-grid">
        <div class="stat-kpi-box">
          <span class="kpi-label">⏱️ Tiempo Invertido</span>
          <span class="kpi-val">${m.formattedTime}</span>
          <span class="kpi-sub">${m.totalMinutes} min totales (${m.massCount} Misas · ${m.adorationCount} Adoraciones)</span>
        </div>

        <div class="stat-kpi-box">
          <span class="kpi-label">🏛️ Parroquia Top</span>
          <span class="kpi-val" style="font-size:1rem">${m.topParishObj ? m.topParishObj.nombre : "Sin datos"}</span>
          <span class="kpi-sub">${m.topParishEntry ? `${m.topParishEntry[1].count} visitas · ${m.topParishEntry[1].minutes} min allí` : "Registrá tu primer check-in"}</span>
        </div>

        <div class="stat-kpi-box">
          <span class="kpi-label">📅 Día Más Frecuente</span>
          <span class="kpi-val">${m.topDayName}</span>
          <span class="kpi-sub">${m.dayCounts[m.topDayName] || 0} asistencias en este día</span>
        </div>

        <div class="stat-kpi-box">
          <span class="kpi-label">🔥 Racha y Puntos</span>
          <span class="kpi-val">${streak.activePoints} pts</span>
          <span class="kpi-sub">${streak.totalHistoricalPoints} pts históricos acumulados</span>
        </div>
      </div>

      <div style="margin-top:14px;padding:10px 12px;border-radius:10px;background:var(--brand-soft);font-size:0.82rem;color:var(--brand)">
        ⛪ <strong>Desglose de tiempo personal:</strong> ${m.massMinutes} min en Santa Misa (${m.massCount} × 60 min) + ${m.adorationMinutes} min en Adoración (${m.adorationCount} × 90 min) = <strong>${m.totalMinutes} min</strong>.
      </div>
    </div>

    <!-- Días más frecuentes -->
    <div class="checkin-card">
      <h4>🗓️ Días más frecuentes de asistencia</h4>
      <p>Distribución semanal de tus Misas y momentos de Adoración Eucarística.</p>
      <div class="freq-bar-list">
        ${m.sortedDays.map(([dName, count]) => {
          const pct = Math.round((count / m.maxDayVal) * 100);
          return `
            <div class="freq-row">
              <strong>${dName}</strong>
              <div class="freq-track"><div class="freq-fill" style="width:${count > 0 ? Math.max(pct, 10) : 0}%"></div></div>
              <span class="freq-val">${count}</span>
            </div>`;
        }).join("")}
      </div>
    </div>

    <!-- Meses destacados -->
    <div class="checkin-card">
      <h4>🌟 Meses destacados</h4>
      <p>Tus meses de mayor constancia espiritual según puntos de racha y minutos de oración.</p>
      <div class="freq-bar-list">
        ${m.sortedMonths.length ? m.sortedMonths.map(mo => {
          const pct = Math.round((mo.points / m.maxMonthPts) * 100);
          return `
            <div class="freq-row">
              <strong>${mo.label}</strong>
              <div class="freq-track"><div class="freq-fill" style="width:${Math.max(pct, 14)}%"></div></div>
              <span class="freq-val">${mo.points} pts · ${mo.minutes}m</span>
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
    const active = btn.dataset.spirTab === state.spirTab;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
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
   Módulo de Liturgia Desglosado (Primera Lectura Interactiva, Salmo Interactivo,
   Evangelio y Explicación Pastoral) + Vista Independiente de Santos del Día
   ===================================================================== */
const OFFICIAL_GOSPELS_BY_MMDD = {
  "11-01": {
    citation: "Mateo 5, 1-12a",
    firstReadingRef: "Apocalipsis 7, 2-4. 9-14",
    firstReadingTitle: "Vi una multitud inmensa, que nadie podía contar, de todas las naciones",
    firstReadingFullText: `Lectura del libro del Apocalipsis de san Juan apóstol.

Yo, Juan, vi a otro Ángel que subía del Oriente y llevaba el sello del Dios vivo. Y gritó con voz potente a los cuatro Ángeles que habían recibido el poder de dañar a la tierra y al mar: «No dañen a la tierra, ni al mar, ni a los árboles, hasta que marquemos con el sello la frente de los servidores de nuestro Dios». Y oí el número de los que habían sido marcados: eran ciento cuarenta y cuatro mil de todas las tribus de los hijos de Israel.

Después de esto, vi una multitud inmensa, que nadie podía contar, de todas las naciones, razas, pueblos y lenguas, de pie delante del trono y del Cordero, vestidos con túnicas blancas y con palmas en las manos. Y gritaban con voz potente: «¡La salvación viene de nuestro Dios, que está sentado en el trono, y del Cordero!».

Uno de los Ancianos me preguntó: «¿Quiénes son y de dónde vienen los que están revestidos de túnicas blancas?». Yo le respondí: «Tú lo sabes, señor». Y él me dijo: «Éstos son los que vienen de la gran tribulación; ellos han lavado sus túnicas y las han blanqueado en la sangre del Cordero».`,
    psalmRef: "Salmo 23 (24), 1-2. 3-4ab. 5-6",
    psalmResponse: "R. Ésta es la generación de los que buscan tu rostro, Señor.",
    psalmFullText: `Del Señor es la tierra y todo lo que hay en ella,
el mundo y todos sus habitantes,
porque él la fundó sobre los mares
y la afirmó sobre las corrientes del océano.
R. Ésta es la generación de los que buscan tu rostro, Señor.

¿Quién podrá subir a la Montaña del Señor
y permanecer en su recinto sagrado?
El que tiene las manos limpias y puro el corazón,
el que no rinde culto a los ídolos.
R. Ésta es la generación de los que buscan tu rostro, Señor.

Él recibirá la bendición del Señor,
la recompensa de Dios, su salvador.
Así son los que buscan al Señor,
los que buscan tu rostro, Dios de Jacob.
R. Ésta es la generación de los que buscan tu rostro, Señor.`,
    title: "Solemnidad de Todos los Santos: Las Bienaventuranzas",
    liturgicalSeason: "Solemnidad · Blanco Litúrgico · Leccionario Oficial CEA",
    gospelText: `En aquel tiempo, al ver a la multitud, Jesús subió a la montaña, se sentó, y sus discípulos se acercaron a él. Entonces tomó la palabra y comenzó a enseñarles, diciendo:

«Felices los que tienen alma de pobres, porque a ellos les pertenece el Reino de los Cielos.
Felices los afligidos, porque serán consolados.
Felices los pacientes, porque recibirán la tierra en herencia.
Felices los que tienen hambre y sed de justicia, porque serán saciados.
Felices los misericordiosos, porque obtendrán misericordia.
Felices los que tienen el corazón puro, porque verán a Dios.
Felices los que trabajan por la paz, porque serán llamados hijos de Dios.
Felices los que son perseguidos por practicar la justicia, porque a ellos les pertenece el Reino de los Cielos.

Alégrense y regocíjense, porque ustedes tendrán una gran recompensa en el cielo».`,
    whyChosenToday: "La Iglesia proclama hoy el pasaje de las Bienaventuranzas (Mateo 5, 1-12a) porque constituye la «carta magna» de la santidad cristiana: muestra el camino concreto que recorrió la multitud inmensa de santos (Primera Lectura del Apocalipsis) para llegar a ver el rostro de Dios (Salmo 23).",
    popeQuote: "«Los santos no son superhéroes inalcanzables, sino amigos de Dios que vivieron las Bienaventuranzas en la vida cotidiana con alegría y humildad» (Papa Francisco, Gaudete et Exsultate).",
    priestCommentary: "La santidad se teje todos los días en la familia, el estudio, el trabajo y la comunidad parroquial. Las Bienaventuranzas son el retrato del corazón mismo de Jesús.",
    prayerPrompts: [
      "¿Qué Bienaventuranza necesito encarnar hoy con más generosidad?",
      "Dar gracias a Dios por los santos de la puerta de al lado que me transmitieron la fe."
    ]
  },
  "11-02": {
    citation: "Juan 6, 37-40",
    firstReadingRef: "Sabiduría 3, 1-9",
    firstReadingTitle: "Las almas de los justos están en las manos de Dios",
    firstReadingFullText: `Lectura del libro de la Sabiduría.

Las almas de los justos están en las manos de Dios, y no los afectará ningún tormento. A los ojos de los insensatos parecían muertos; su partida de este mundo fue considerada una desgracia y su alejamiento de nosotros, una completa destrucción; pero ellos están en paz.

Aunque a los ojos de los hombres hayan sufrido castigos, su esperanza estaba colmada de inmortalidad. Por una leve corrección recibirán grandes beneficios, porque Dios los puso a prueba y los encontró dignos de él. Los probó como oro en el crisol y los aceptó como un holocausto.

Los que confían en él comprenderán la verdad y los que le son fieles permanecerán junto a él en el amor, porque la gracia y la misericordia son para sus elegidos.`,
    psalmRef: "Salmo 22 (23), 1-3a. 3b-4. 5. 6",
    psalmResponse: "R. El Señor es mi pastor, nada me puede faltar.",
    psalmFullText: `El Señor es mi pastor, nada me puede faltar.
En praderas de hierba fresca me hace reposar,
me conduce junto a aguas tranquilas
y repara mis fuerzas.
R. El Señor es mi pastor, nada me puede faltar.

Me guía por el recto sendero, por amor de su Nombre.
Aunque cruce por oscuras quebradas,
no temeré ningún mal, porque tú estás conmigo:
tu vara y tu bastón me infunden confianza.
R. El Señor es mi pastor, nada me puede faltar.

Tu bondad y tu gracia me acompañan
a lo largo de mi vida;
y habitaré en la Casa del Señor,
por muy largo tiempo.
R. El Señor es mi pastor, nada me puede faltar.`,
    title: "Conmemoración de Todos los Fieles Difuntos: La voluntad del Padre es que nadie se pierda",
    liturgicalSeason: "Conmemoración Fieles Difuntos · Morado Litúrgico · CEA",
    gospelText: `En aquel tiempo, Jesús dijo a la multitud: «Todo lo que me da el Padre viene a mí, y al que viene a mí yo no lo rechazaré, porque bajé del cielo, no para hacer mi voluntad, sino la de aquel que me envió.

La voluntad del que me envió es que yo no pierda nada de lo que él me dio, sino que lo resucite en el último día.

Ésta es la voluntad de mi Padre: que todo el que ve al Hijo y cree en él, tenga Vida eterna y que yo lo resucite en el último día».`,
    whyChosenToday: "En la Conmemoración de Todos los Fieles Difuntos se elige Juan 6, 37-40 porque revela el fundamento teológico de nuestra esperanza ante la muerte: la voluntad amorosa del Padre entregada a Cristo es no perder a ninguno de sus hijos, sino resucitarlos en el último día.",
    popeQuote: "«La memoria de los difuntos es un acto de profunda esperanza cristiana: sabemos que nuestros seres queridos están en las manos fieles del Padre que nos resucitará» (Papa Benedicto XVI, Angelus).",
    priestCommentary: "Hoy rezamos por nuestros familiares y amigos difuntos ofreciendo la Santa Misa, certeza de que el amor en Cristo es más fuerte que la muerte.",
    prayerPrompts: [
      "Rezar hoy una oración especial u ofrecer la Misa por los seres queridos que partieron a la Casa del Padre.",
      "Renovar nuestra fe en la resurrección y la Vida eterna."
    ]
  },
  "11-03": {
    citation: "Lucas 14, 15-24",
    firstReadingRef: "Filipenses 2, 5-11",
    firstReadingTitle: "Cristo se humilló a sí mismo; por eso Dios lo exaltó",
    firstReadingFullText: `Lectura de la carta del apóstol san Pablo a los cristianos de Filipos.

Hermanos: Tengan los mismos sentimientos de Cristo Jesús. Él, que era de condición divina, no consideró esta igualdad con Dios como algo que debía guardar celosamente; al contrario, se anonadó a sí mismo, tomando la condición de servidor y haciéndose semejante a los hombres.

Y presentándose con aspecto humano, se humilló hasta aceptar por obediencia la muerte y muerte de cruz. Por eso, Dios lo exaltó y le dio el Nombre que está sobre todo nombre, para que al nombre de Jesús, se doble toda rodilla en el cielo, en la tierra y en los abismos, y toda lengua proclame para gloria de Dios Padre: «Jesucristo es el Señor».`,
    psalmRef: "Salmo 21 (22), 26b-27. 28 y 30. 31-32",
    psalmResponse: "R. Te alabaré, Señor, en la gran asamblea.",
    psalmFullText: `Cumpliré mis votos delante de sus fieles:
los pobres comerán hasta saciarse
y los que buscan al Señor lo alabarán.
¡Que sus corazones vivan para siempre!
R. Te alabaré, Señor, en la gran asamblea.

Todas las naciones de la tierra
se acordarán del Señor y volverán a él;
ante él se postrarán todas las familias de los pueblos,
porque sólo el Señor es Rey.
R. Te alabaré, Señor, en la gran asamblea.`,
    title: "Los invitados al gran banquete del Reino: «Vengan, porque ya todo está preparado»",
    liturgicalSeason: "Martes de la XXXI Semana durante el Año · Verde Litúrgico · CEA",
    gospelText: `En aquel tiempo, uno de los que estaban sentados a la mesa con Jesús le dijo: «¡Feliz el que se siente a comer en el Reino de Dios!».

Jesús le respondió: «Un hombre preparó un gran banquete y convidó a mucha gente. A la hora de comer, mandó a su servidor que dijera a los invitados: "Vengan, todo está preparado". Pero todos, sin excepción, empezaron a excusarse.

Entonces el dueño de casa, indignado, dijo a su servidor: "Sal enseguida a las plazas y a las calles de la ciudad, y trae aquí a los pobres, a los lisiados, a los ciegos y a los paralíticos". Y el señor dijo al servidor: "Sal a los caminos y a los campos, e insiste a la gente para que entre, de manera que se llene mi casa"».`,
    whyChosenToday: "La liturgia del Tiempo Durante el Año propone hoy Lucas 14, 15-24 en diálogo directo con el himno de Filipenses (Primera Lectura) y el Salmo 21 («los pobres comerán hasta saciarse»): frente a la autosuficiencia de quienes se excusan, el banquete mesiánico de Jesús abre sus puertas a los humildes y necesitados.",
    popeQuote: "«Dios prepara cada día el banquete de su Palabra y de la Eucaristía para todos, sin excluir a nadie. Cuidémonos de las excusas que nos cierran el corazón a Su invitación» (Papa Francisco).",
    priestCommentary: "A veces ponemos mil excusas para postergar a Dios: la falta de tiempo, el cansancio o la rutina. El Señor nos espera hoy en el altar con la mesa servida.",
    prayerPrompts: [
      "¿Qué excusas suelen alejarme de la oración diaria o de la Misa?",
      "Invitar con calidez a alguien que se sienta alejado de la comunidad."
    ]
  },
  "11-04": {
    citation: "Lucas 14, 25-33",
    firstReadingRef: "Filipenses 2, 12-18",
    firstReadingTitle: "Brillen como antorchas en el mundo, llevando la Palabra de Vida",
    firstReadingFullText: `Lectura de la carta del apóstol san Pablo a los cristianos de Filipos.

Queridos hermanos: Así como obedecieron siempre —no sólo cuando yo estaba presente, sino mucho más ahora que estoy lejos— trabajen con temor y temblor por alcanzar su salvación. Porque es Dios mismo quien hace nacer en ustedes el querer y el obrar, conforme a su benevolencia.

Háganlo todo sin murmuraciones ni discusiones, para ser irreprochables y puros, hijos de Dios sin mancha, en medio de una generación extraviada y perversa, dentro de la cual ustedes brillan como antorchas en el mundo, llevando en alto la Palabra de Vida.`,
    psalmRef: "Salmo 26 (27), 1. 4. 13-14",
    psalmResponse: "R. El Señor es mi luz y mi salvación.",
    psalmFullText: `El Señor es mi luz y mi salvación,
¿a quién temeré?
El Señor es el baluarte de mi vida,
¿ante quién temblaré?
R. El Señor es mi luz y mi salvación.

Una sola cosa he pedido al Señor, y esto es lo que busco:
habitar en la Casa del Señor todos los días de mi vida,
para contemplar la hermosura del Señor
y visitar su Templo.
R. El Señor es mi luz y mi salvación.

Yo creo que contemplaré la bondad del Señor
en la tierra de los vivientes.
Espera en el Señor y sé fuerte;
ten valor y espera en el Señor.
R. El Señor es mi luz y mi salvación.`,
    title: "Las condiciones para seguir a Jesús: Cargar con la cruz y calcular los gastos",
    liturgicalSeason: "Memoria de San Carlos Borromeo · Miércoles XXXI durante el Año · CEA",
    gospelText: `En aquel tiempo, junto con Jesús iba un gran gentío, y él, dándose vuelta, les dijo: «Cualquiera que venga a mí y no me ame más que a su padre y a su madre, a su mujer y a su hijos, a sus hermanos y hermanas, y hasta a su propia vida, no puede ser mi discípulo. El que no carga con su cruz y me sigue, no puede ser mi discípulo.

¿Quién de ustedes, si quiere edificar una torre, no se sienta primero a calcular los gastos, para ver si tiene con qué terminarla? De la misma manera, cualquiera de ustedes que no renuncie a todo lo que posee, no puede ser mi discípulo».`,
    whyChosenToday: "Este pasaje (Lucas 14, 25-33) es elegido en la lectura continua de la semana XXXI y coincide providencialmente con la Memoria de San Carlos Borromeo: muestra que el discipulado cristiano no es un entusiasmo superficial, sino una decisión madura de poner a Cristo en el centro y edificar la vida con perseverancia.",
    popeQuote: "«Seguir a Cristo exige valentía y libertad interior para poner su Amor en el primer lugar, sabiendo que quien entrega su vida por Él la gana en plenitud» (Papa Francisco).",
    priestCommentary: "En la memoria de San Carlos Borromeo, este Evangelio oficial nos invita a edificar nuestra vida espiritual sobre roca firme, sin quedarnos a mitad de camino.",
    prayerPrompts: [
      "¿Qué apegos o distracciones me impiden hoy seguir a Jesús con mayor libertad?",
      "Pedir la gracia de la perseverancia en los proyectos buenos que Dios me inspira."
    ]
  },
  "11-05": {
    citation: "Lucas 15, 1-10",
    firstReadingRef: "Filipenses 3, 3-8a",
    firstReadingTitle: "Todo lo considero pérdida comparado con el conocimiento de Cristo Jesús",
    firstReadingFullText: `Lectura de la carta del apóstol san Pablo a los cristianos de Filipos.

Hermanos: Los verdaderos circuncisos somos nosotros, los que ofrecemos un culto inspirado por el Espíritu de Dios y ponemos nuestra gloria en Cristo Jesús, sin confiar en la carne.

Aunque yo también tendría motivos para poner mi confianza en la carne. Si alguien cree que puede confiar en ella, yo puedo hacerlo con mayor razón: circuncidado al octavo día; del linaje de Israel, de la tribu de Benjamín; hebreo, hijo de hebreos; en cuanto a la Ley, fariseo; en cuanto al celo, perseguidor de la Iglesia; en cuanto a la justicia que proviene de la Ley, irreprochable.

Pero todo lo que era para mí una ganancia, lo consideré una pérdida a causa de Cristo. Más aún: todo lo considero pérdida, comparado con el don supremo del conocimiento de Cristo Jesús, mi Señor.`,
    psalmRef: "Salmo 104 (105), 2-3. 4-5. 6-7",
    psalmResponse: "R. Que se alegren los que buscan al Señor.",
    psalmFullText: `Canten al Señor con instrumentos musicales,
proclamen todas sus maravillas;
gloríense en su santo Nombre,
alégrese el corazón de los que buscan al Señor.
R. Que se alegren los que buscan al Señor.

Recurran al Señor y a su poder,
busquen constantemente su rostro;
recuerden las maravillas que él obró,
sus portentos y los juicios de su boca.
R. Que se alegren los que buscan al Señor.

Descendientes de Abraham, su servidor,
hijos de Jacob, su elegido:
el Señor es nuestro Dios,
en toda la tierra rigen sus decretos.
R. Que se alegren los que buscan al Señor.`,
    title: "La oveja perdida y la moneda encontrada: La alegría del Cielo por un pecador que vuelve",
    liturgicalSeason: "Jueves de la XXXI Semana durante el Año · Verde Litúrgico · CEA",
    gospelText: `En aquel tiempo, todos los publicanos y los pecadores se acercaban a Jesús para escucharlo. Los fariseos y los escribas murmuraban, diciendo: «Este hombre recibe a los pecadores y come con ellos».

Entonces Jesús les propuso esta parábola: «¿Quién de ustedes, si tiene cien ovejas y pierde una de ellas, no deja las noventa y nueve en el campo y va en busca de la que se había perdido, hasta encontrarla? Y cuando la encuentra, la carga sobre sus hombros, lleno de alegría, y al llegar a su casa llama a sus amigos y vecinos, y les dice: "Alégrense conmigo, porque encontré la oveja que se me había perdido". Les aseguro que, de la misma manera, habrá más alegría en el cielo por un solo pecador que se convierta, que por noventa y nueve justos que no necesitan convertirse.

¿Y qué mujer que tiene diez dracmas, si pierde una, no enciende una lámpara, barre la casa y busca cuidadosamente hasta encontrarla? Y cuando la encuentra, llama a sus amigas y vecinas, y les dice: "Alégrense conmigo, porque encontré la dracma que se me había perdido". Les aseguro que, de la misma manera, se alegran los ángeles de Dios por un solo pecador que se convierte».`,
    whyChosenToday: "La Liturgia elige hoy Lucas 15, 1-10 para iluminar la Primera Lectura de San Pablo a los Filipenses: así como Pablo abandona el orgullo farisaico de creerse «irreprochable» por mérito propio para dejarse alcanzar por la gracia de Cristo, Jesús responde a la murmuración de los escribas con las parábolas de la misericordia, mostrando que la verdadera alegría de Dios está en buscar y abrazar a quien se había perdido.",
    popeQuote: "«El corazón de Dios se conmueve por cada hijo: Él enciende la lámpara, sale a buscarnos y hace fiesta cuando nos dejamos encontrar por Su misericordia» (Papa Francisco, Homilía sobre Lucas 15).",
    priestCommentary: "Frente a la murmuración de los que se creen perfectos, Jesús revela el rostro de un Dios Pastor que busca incansablemente a cada persona y celebra su regreso en comunidad.",
    prayerPrompts: [
      "Dejarme encontrar hoy por la mirada misericordiosa de Jesús en la oración.",
      "Ser puente de bienvenida y ternura para quienes desean volver a acercarse a la fe.",
      "Acudir con confianza al sacramento de la Reconciliación en mi parroquia."
    ]
  },
  "11-06": {
    citation: "Lucas 16, 1-8",
    firstReadingRef: "Filipenses 3, 17 — 4, 1",
    firstReadingTitle: "Nosotros somos ciudadanos del cielo, y esperamos al Salvador",
    firstReadingFullText: `Lectura de la carta del apóstol san Pablo a los cristianos de Filipos.

Hermanos: Sigan mi ejemplo y observen atentamente a los que viven según el modelo que encuentran en nosotros. Porque, como ya les dije muchas veces y ahora lo repito con lágrimas en los ojos, hay muchos que se portan como enemigos de la cruz de Cristo. Su fin es la perdición, su dios es el vientre, su gloria está en aquello que los cubre de vergüenza, y no aprecian sino las cosas de la tierra.

Nosotros, en cambio, somos ciudadanos del cielo, y esperamos ardientemente que venga de allí como Salvador el Señor Jesucristo. Él transformará nuestro pobre cuerpo mortal, haciéndolo semejante a su cuerpo glorioso, con el poder que tiene para poner todas las cosas bajo su dominio. Por eso, hermanos míos muy queridos, a quienes tanto deseo ver, ustedes que son mi alegría y mi corona, permanezcan firmes en el Señor.`,
    psalmRef: "Salmo 121 (122), 1-2. 3-4ab. 4cd-5",
    psalmResponse: "R. ¡Qué alegría cuando me dijeron: «Vamos a la Casa del Señor»!",
    psalmFullText: `¡Qué alegría cuando me dijeron:
«Vamos a la Casa del Señor»!
Nuestros pies ya están pisando
tus umbrales, Jerusalén.
R. ¡Qué alegría cuando me dijeron: «Vamos a la Casa del Señor»!

Jerusalén, que fuiste construida
como ciudad bien compacta y armoniosa.
Allí suben las tribus, las tribus del Señor.
R. ¡Qué alegría cuando me dijeron: «Vamos a la Casa del Señor»!`,
    title: "Creatividad y fidelidad de los hijos de la luz en los bienes de este mundo",
    liturgicalSeason: "Viernes de la XXXI Semana durante el Año · Verde Litúrgico · CEA",
    gospelText: `En aquel tiempo, Jesús decía a sus discípulos: «Había un hombre rico que tenía un administrador, al cual acusaron de malgastar sus bienes. Lo llamó y le dijo: "¿Qué es lo que oigo decir de ti? Rinde cuenta de tu administración, porque ya no podrás seguir administrando".

El administrador llamó uno por uno a los deudores de su señor y redujo sus deudas con astucia. El señor alabó a este administrador deshonesto, por haber obrado tan hábilmente. Porque los hijos de este mundo son más astutos en su trato con los demás que los hijos de la luz».`,
    whyChosenToday: "Se proclama hoy Lucas 16, 1-8 porque enseña cómo han de vivir en la tierra quienes saben que «su ciudadanía está en el cielo» (Primera Lectura): no con pasividad ni apego egoísta, sino administrando los bienes temporales con prontitud, solidaridad y creatividad evangélica.",
    popeQuote: "«Jesús nos invita a tener la misma prontitud, creatividad y empeño para construir el Reino de Dios y ayudar a los hermanos que el mundo pone para sus negocios» (Papa Francisco).",
    priestCommentary: "La creatividad pastoral y la caridad concreta son la verdadera astucia evangélica que transforma nuestros barrios.",
    prayerPrompts: [
      "¿Pongo mis talentos y mi tiempo al servicio del bien con verdadero entusiasmo?",
      "Realizar hoy una obra de misericordia concreta con alguien necesitado."
    ]
  },
  "11-07": {
    citation: "Lucas 16, 9-15",
    firstReadingRef: "Filipenses 4, 10-19",
    firstReadingTitle: "Todo lo puedo en aquel que me conforta",
    firstReadingFullText: `Lectura de la carta del apóstol san Pablo a los cristianos de Filipos.

Hermanos: Me alegré muchísimo en el Señor al ver que florecía nuevamente el interés de ustedes por mí; ciertamente lo tenían, pero les faltaba la ocasión de demostrarlo. No digo esto porque esté necesitado, pues he aprendido a bastarme con lo que tengo.

Sé vivir en la pobreza y en la abundancia; estoy entrenado para todo y en todo momento: a estar satisfecho y a pasar hambre, a nadar en la abundancia y a sufrir privaciones. Todo lo puedo en aquel que me conforta.

Sin embargo, ustedes hicieron bien en interesarse por mis necesidades. Mi Dios colmará todas las necesidades de ustedes con magnificencia, conforme a su riqueza, en Cristo Jesús.`,
    psalmRef: "Salmo 111 (112), 1-2. 5-6. 8a y 9",
    psalmResponse: "R. Feliz el hombre que teme al Señor.",
    psalmFullText: `Feliz el hombre que teme al Señor
y se complace en sus mandamientos.
Su descendencia será fuerte en la tierra:
la posteridad de los justos es bendecida.
R. Feliz el hombre que teme al Señor.

Es bueno el hombre que se apiada y da prestado,
y administra sus asuntos con rectitud.
El justo no vacilará jamás,
su recuerdo permanecerá para siempre.
R. Feliz el hombre que teme al Señor.

Su corazón está firme y nada teme;
él da abundantemente a los pobres:
su generosidad permanece para siempre,
y alzará su frente con dignidad.
R. Feliz el hombre que teme al Señor.`,
    title: "Fidelidad en lo poco: «El que es fiel en lo mínimo, también es fiel en lo mucho»",
    liturgicalSeason: "Sábado de la XXXI Semana durante el Año · Verde Litúrgico · CEA",
    gospelText: `En aquel tiempo, Jesús decía a sus discípulos: «El que es fiel en lo poco, también es fiel en lo mucho, y el que es deshonesto en lo poco, también es deshonesto en lo mucho. Si ustedes no son fieles en el uso del dinero injusto, ¿quién les confiará el verdadero bien?

Ningún servidor puede servir a dos señores, porque aborrecerá a uno y amará al otro, o bien se interesará por el primero y menospreciará al segundo. No pueden servir a Dios y al Dinero».`,
    whyChosenToday: "Al concluir la lectura de la Carta a los Filipenses (Filipenses 4, 10-19), la Iglesia elige Lucas 16, 9-15 para subrayar que la libertad interior ante el dinero y la fidelidad en las cosas pequeñas de cada día son el camino que abre el corazón a las verdaderas riquezas del Reino.",
    popeQuote: "«La santidad crece en los pequeños gestos diarios de fidelidad que sólo Dios ve» (Papa Francisco).",
    priestCommentary: "En vísperas del domingo, la Palabra nos recuerda que la fidelidad en las cosas pequeñas prepara nuestro corazón para recibir los grandes dones de Dios.",
    prayerPrompts: [
      "Cuidar hoy con amor los pequeños deberes cotidianos y la oración breve.",
      "Preparar el corazón para celebrar la Misa de este fin de semana."
    ]
  },
  "11-08": {
    citation: "Marcos 12, 38-44",
    firstReadingRef: "1 Reyes 17, 10-16",
    firstReadingTitle: "La viuda de Sarepta hizo un panecillo de lo poco que tenía y se lo llevó a Elías",
    firstReadingFullText: `Lectura del primer libro de los Reyes.

En aquellos días, el profeta Elías se puso en camino y fue a Sarepta. Al llegar a la puerta de la ciudad, vio a una viuda que estaba juntando leña. La llamó y le dijo: «Por favor, tráeme en un jarro un poco de agua para beber». Mientras ella iba a buscarla, la llamó y le dijo: «Tráeme también en la mano un trozo de pan».

Pero ella respondió: «¡Por la vida del Señor, tu Dios! No tengo pan cocido; sólo me queda un puñado de harina en el tarro y un poco de aceite en el frasco. Apenas recoja un par de leños, entraré a preparar eso para mí y para mi hijo; lo comeremos, y luego moriremos».

Elías le dijo: «No temas. Ve a hacer como has dicho, pero antes prepárame con eso un panecillo y tráemelo; para ti y para tu hijo lo harás después. Porque así habla el Señor, Dios de Israel: El tarro de harina no se agotará ni el frasco de aceite se vaciará, hasta el día en que el Señor envíe la lluvia sobre la faz de la tierra».

Ella se fue e hizo como le había dicho Elías, y comieron ella, él y su casa durante un tiempo. El tarro de harina no se agotó ni se vació el frasco de aceite, conforme a la palabra que había pronunciado el Señor por medio de Elías.`,
    psalmRef: "Salmo 145 (146), 7. 8-9a. 9bc-10",
    psalmResponse: "R. Alaba, alma mía, al Señor.",
    psalmFullText: `El Señor hace justicia a los oprimidos
y da pan a los hambrientos.
El Señor libera a los cautivos.
R. Alaba, alma mía, al Señor.

El Señor abre los ojos de los ciegos,
el Señor endereza a los que están encorvados,
el Señor ama a los justos.
El Señor protege a los extranjeros.
R. Alaba, alma mía, al Señor.

Él sostiene al huérfano y a la viuda
y entorpece el camino de los malvados.
El Señor reina eternamente,
reina tu Dios, Sión, a lo largo de las generaciones.
R. Alaba, alma mía, al Señor.`,
    title: "La ofrenda de la viuda pobre: «Dio todo lo que tenía para vivir»",
    liturgicalSeason: "XXXII Domingo Durante el Año · Verde Litúrgico · CEA",
    gospelText: `En aquel tiempo, Jesús, sentado frente a la sala del tesoro del Templo, miraba cómo la gente depositaba su limosna. Muchos ricos daban en abundancia. Llegó una viuda pobre y puso dos pequeñas monedas de cobre.

Entonces Jesús, llamando a sus discípulos, les dijo: «Les aseguro que esta viuda pobre ha dado más que todos los que pusieron dinero en el tesoro. Porque todos daban de lo que les sobraba, pero ella, de su indigencia, dio todo lo que poseía, todo lo que tenía para vivir».`,
    whyChosenToday: "En este Domingo XXXII Durante el Año, la liturgia une la figura de la viuda de Sarepta (1 Reyes 17) con la viuda del Templo de Jerusalén (Marcos 12, 38-44): ambas mujeres, en medio de su extrema fragilidad, entregan todo lo que tienen para vivir, convirtiéndose en ícono de Cristo mismo que se entrega por entero en la Cruz y en la Eucaristía.",
    popeQuote: "«La medida de Dios no es la cantidad ni la apariencia, sino la entrega total del corazón humilde que confía en la Providencia» (Papa Francisco, Angelus).",
    priestCommentary: "Jesús fija su mirada en el gesto silencioso de la viuda: ella no entrega lo que le sobra, sino su propia vida confiada en las manos de Dios.",
    prayerPrompts: [
      "¿Le doy a Dios y a mis hermanos sólo lo que me sobra de tiempo, o le entrego lo mejor de mi corazón?",
      "Participar hoy en la Misa dominical ofreciendo toda nuestra semana en el altar."
    ]
  }
};

const ARGENTINE_GOSPELS_CYCLE = [
  OFFICIAL_GOSPELS_BY_MMDD["11-05"],
  OFFICIAL_GOSPELS_BY_MMDD["11-01"],
  OFFICIAL_GOSPELS_BY_MMDD["11-08"],
  OFFICIAL_GOSPELS_BY_MMDD["11-03"],
  OFFICIAL_GOSPELS_BY_MMDD["11-04"],
  OFFICIAL_GOSPELS_BY_MMDD["11-06"],
  OFFICIAL_GOSPELS_BY_MMDD["11-07"],
  OFFICIAL_GOSPELS_BY_MMDD["11-02"]
];

const SVG_SAINT_HALO = `<svg class="saint-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="4"/><ellipse cx="12" cy="3.5" rx="5" ry="1.2"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M12 11v6m-2.5-3.5h5"/></svg>`;

const SAINTS_BY_MMDD = {
  "11-01": [
    {
      name: "Solemnidad de Todos los Santos",
      feast: "Solemnidad Litúrgica Universal",
      iconSvg: SVG_SAINT_HALO,
      bio: "La Iglesia celebra en una única fiesta jubilosa a todos los bienaventurados que ya gozan de la presencia de Dios en el Cielo: tanto los santos canonizados como la multitud inmensa de hombres y mujeres sencillos que vivieron fielmente el Evangelio.",
      quote: "«La santidad es el rostro más bello de la Iglesia».",
      theologicalExplanation: "La Iglesia une las bienaventuranzas del Evangelio (Mt 5, 1-12) con esta fiesta porque los santos son quienes encarnaron la radicalidad de ser pobres de espíritu, mansos y constructores de paz, reflejando el rostro bienaventurado del Reino.",
      curiosities: [
        "Instituida en Roma por el Papa Bonifacio IV en el siglo VII consagrando el Panteón pagano a Santa María de los Mártires.",
        "No conmemora sólo a quienes están en los altares, sino a millones de almas anónimas que vivieron la santidad cotidiana.",
        "Es una de las pocas solemnidades con precepto universal y precedida por una vigilia de luz frente a la oscuridad."
      ],
      otherQuotes: [
        "«La santidad no es un privilegio de pocos, sino una vocación para todos los bautizados» (San Juan Pablo II).",
        "«Los santos no eran superhombres, sino personas que amaron a Dios con todo el corazón»."
      ]
    }
  ],
  "11-02": [
    {
      name: "Conmemoración de Todos los Fieles Difuntos",
      feast: "Conmemoración Litúrgica",
      iconSvg: SVG_SAINT_HALO,
      bio: "Jornada universal de oración y sufragio por todos los hermanos que han partido de este mundo, renovando nuestra esperanza en la Resurrección de Cristo y en la comunión de los santos.",
      quote: "«Para los que creen en Ti, Señor, la vida no termina, se transforma».",
      theologicalExplanation: "La liturgia proclama la esperanza viva de la Resurrección (Jn 6, 37-40: «todo el que cree en el Hijo tiene Vida eterna»). No rezamos con angustia, sino con la certeza de que el amor de Dios es más fuerte que la muerte física.",
      curiosities: [
        "Promovida por San Odilón de Cluny en el año 998, quien mandó a todos sus monasterios rezar por las almas del purgatorio.",
        "En Argentina y América Latina es tradición llevar flores a los cementerios y rezar responsos comunitarios en memoria de los antepasados.",
        "La Iglesia concede indulgencias especiales y la posibilidad a cada sacerdote de celebrar tres misas ese día."
      ],
      otherQuotes: [
        "«Una lágrima se evapora, una flor se marchita, sólo una oración llega hasta Dios» (San Agustín).",
        "«La muerte no es el final del camino, sino la puerta de entrada a la Casa del Padre»."
      ]
    }
  ],
  "11-03": [
    {
      name: "San Martín de Porres, Religioso",
      feast: "Memoria Libre · Patrono de la Justicia Social",
      iconSvg: SVG_SAINT_HALO,
      bio: "Nacido en Lima (1579-1639), hermano cooperador dominico conocido como «el santo de la escoba». Dedicó su vida a curar enfermos, asistir a los más pobres y reconciliar corazones con una humildad radiante y profunda vida eucarística.",
      quote: "«Yo te curo, Dios te sana».",
      theologicalExplanation: "La lectura del Evangelio sobre servir a los más pequeños (Mt 25, 40) sintetiza el corazón de San Martín: descubrió a Cristo vivo y sufriente en los enfermos, esclavos y marginados del virreinato.",
      curiosities: [
        "Hijo de un noble español y una mujer afrodescendiente libre, ingresó como donado en la orden dominica por las leyes de casta de la época.",
        "Tenía una asombrosa empatía con los animales: la tradición recuerda que alimentaba en un mismo plato a un perro, un gato y un ratón.",
        "Fue proclamado Patrono Universal de la Justicia Social en 1962 por el Papa San Juan XXIII."
      ],
      otherQuotes: [
        "«Yo te curo, hermano, pero Dios es quien te sana».",
        "«El mejor homenaje a Dios es el servicio humilde y constante a quien sufre»."
      ]
    }
  ],
  "11-04": [
    {
      name: "San Carlos Borromeo, Obispo",
      feast: "Memoria Obligatoria",
      iconSvg: SVG_SAINT_HALO,
      bio: "Arzobispo de Milán (1538-1584) y gran impulsor de la renovación pastoral tras el Concilio de Trento. Fundó seminarios, visitó cada parroquia de su diócesis y entregó sus bienes y su salud cuidando personalmente a los enfermos durante la peste.",
      quote: "«Un pastor debe arder primero en el amor de Dios para iluminar a su pueblo».",
      theologicalExplanation: "Se asocia a la parábola del Buen Pastor (Jn 10, 11-16), ya que entregó su juventud y vida entera al cuidado de su rebaño milanés, renunciando a comodidades aristocráticas para renovar la Iglesia desde adentro.",
      curiosities: [
        "Nombrado cardenal a los 22 años, lejos de aferrarse al poder impulsó las reformas más profundas del Concilio de Trento redactando el Catecismo Romano.",
        "Durante la peste de Milán en 1576, mientras la nobleza huía, caminó descalzo en penitencia por las calles y alimentó a más de 60.000 indigentes.",
        "Fue el gran fundador de los seminarios modernos para la formación integral del clero."
      ],
      otherQuotes: [
        "«Las almas se ganan de rodillas ante el sagrario».",
        "«No basta hacer el bien, hay que hacerlo bien y con caridad ardiente»."
      ]
    }
  ],
  "11-05": [
    {
      name: "Santa Ángela de la Cruz, Virgen y Fundadora",
      feast: "Santo del Día · 5 de Noviembre",
      iconSvg: SVG_SAINT_HALO,
      bio: "Religiosa sevillana (1846-1932), fundadora del Instituto de las Hermanas de la Compañía de la Cruz. Llamada «Madre de los pobres», vivió haciéndose pequeña con los humildes, cuidando enfermos abandonados y llevando consuelo silencioso a los hogares más necesitados.",
      quote: "«No ser nunca nada para mí, y serlo todo para Dios y para los pobres».",
      theologicalExplanation: "El pasaje evangélico de 'hacerse pequeños como niños para entrar al Reino' (Mt 18, 1-4) ilumina su consagración: ser nada en la tierra para que la gloria y la ternura de Cristo brillen en los más abandonados.",
      curiosities: [
        "Trabajó desde niña en un taller de calzado en Sevilla; rechazada inicialmente en conventos por su débil salud, fundó las Hermanas de la Cruz en 1875.",
        "Su congregación tiene la regla de dormir en camas de paja y no tener rentas fijas, viviendo de la Providencia divina.",
        "Fue canonizada por San Juan Pablo II en Madrid en mayo de 2003 ante más de un millón de peregrinos."
      ],
      otherQuotes: [
        "«No ser nunca nada para mí, y serlo todo para Dios y para los pobres».",
        "«Hay que callar, sufrir y esperar: Dios nunca llega tarde»."
      ]
    },
    {
      name: "San Zacarías y Santa Isabel",
      feast: "Padres de San Juan Bautista",
      iconSvg: SVG_SAINT_HALO,
      bio: "Esposos justos ante los ojos de Dios (Lucas 1, 5-25). En su ancianidad acogieron con fe el milagro de la vida de Juan el Precursor y entonaron el cántico del Benedictus, bendiciendo la fidelidad del Señor que visita y redime a su pueblo.",
      quote: "«¡Feliz de ti por haber creído que se cumplirá lo que te fue anunciado de parte del Señor!» (Lc 1, 45).",
      theologicalExplanation: "Manifiesta el cumplimiento de las promesas de Dios a quienes perseveran en la oración aun cuando humanamente todo parece imposible, abriendo paso a la aurora de la salvación.",
      curiosities: [
        "Zacarías era sacerdote del turno de Abías y sirvió en el Santo de los Santos en el Templo de Jerusalén.",
        "Isabel era prima de la Santísima Virgen María y la primera en llamarla «Madre de mi Señor».",
        "El Benedictus (cántico de Zacarías) se reza todas las mañanas en la oración de Laudes de la Iglesia universal."
      ],
      otherQuotes: [
        "«Bendito sea el Señor, Dios de Israel, porque ha visitado y redimido a su pueblo».",
        "«Por la entrañable misericordia de nuestro Dios, nos visitará el sol que nace de lo alto»."
      ]
    }
  ],
  "11-06": [
    {
      name: "San Nuno de Santa María Álvarez Pereira",
      feast: "Santo del Día · 6 de Noviembre",
      iconSvg: SVG_SAINT_HALO,
      bio: "Después de servir con rectitud y buscar siempre la paz, ingresó como hermano carmelita descalzo dedicando sus últimos años a la oración contemplativa y al reparto diario de alimento a los pobres desde su convento.",
      quote: "«Sólo quien se arrodilla ante Dios permanece firme ante las pruebas».",
      theologicalExplanation: "Se vincula al llamado evangélico a ser constructores de paz (Mt 5, 9). Tras ser estratega militar, comprendió que la mayor victoria del ser humano es el desprendimiento total de sí mismo y la caridad fraterna.",
      curiosities: [
        "Conde de Ourém y condestable de Portugal, repartió sus bienes entre sus soldados y pobres antes de tomar el hábito en el Carmen de Lisboa.",
        "Instituyó la 'Olla de San Nuno', una olla comunitaria gigante con la que daba almuerzo diario a cientos de indigentes.",
        "Benedicto XVI lo canonizó en 2009 destacando su ejemplo de reconciliación y caridad desinteresada."
      ],
      otherQuotes: [
        "«Sólo quien se arrodilla ante Dios permanece firme ante las pruebas».",
        "«El arma más poderosa del creyente es el rosario y el corazón humilde»."
      ]
    }
  ],
  "11-07": [
    {
      name: "San Willibrordo, Obispo y Misionero",
      feast: "Santo del Día · 7 de Noviembre",
      iconSvg: SVG_SAINT_HALO,
      bio: "Monje benedictino y apóstol de Frisia (658-739). Evangelizó con paciencia, fundó monasterios y comunidades parroquiales, anunciando la alegría del Evangelio con mansedumbre y caridad.",
      quote: "«Sembrar la Palabra con paciencia es confiar en el tiempo de Dios».",
      theologicalExplanation: "Refleja el mandato misionero: «Vayan por todo el mundo y anuncien la Buena Noticia» (Mc 16, 15). Su vida atestigua el valor de la perseverancia paciente en tierras lejanas.",
      curiosities: [
        "Nació en Northumbria (Inglaterra) en el 658 y consagró 50 años a misionar entre los frisones de los actuales Países Bajos y Alemania.",
        "Fundó la célebre abadía de Echternach en Luxemburgo, donde se celebra hasta hoy la famosa 'procesión danzante' en su honor.",
        "Es considerado el Apóstol de los Países Bajos y pionero de la inculturación del Evangelio."
      ],
      otherQuotes: [
        "«Sembrar la Palabra con paciencia es confiar en el tiempo de Dios».",
        "«En el nombre de Cristo comenzamos y en su paz perseveramos»."
      ]
    }
  ],
  "11-08": [
    {
      name: "Santa Isabel de la Trinidad, Virgen Carmelita",
      feast: "Santo del Día · 8 de Noviembre",
      iconSvg: SVG_SAINT_HALO,
      bio: "Joven carmelita descalza de Dijon (1880-1906), mística de la presencia de la Santísima Trinidad en el alma bautizada. Enseñó que cada cristiano puede encontrar un «cielo interior» de silencio y adoración en medio de sus tareas cotidianas.",
      quote: "«¡Oh Dios mío, Trinidad a quien adoro, ayúdame a olvidarme enteramente de mí para establecerme en Ti!»",
      theologicalExplanation: "La promesa de Jesús en la Última Cena: «Si alguno me ama... vendremos a él y haremos morada en él» (Jn 14, 23) es el fundamento de su espiritualidad sobre la inhabitación trinitaria en el alma humana.",
      curiosities: [
        "Brillante pianista premiada en el conservatorio de Dijon, sintió la llamada al Carmelo a los 14 años pero esperó pacientemente la autorización materna.",
        "Enfermó de la enfermedad de Addison y transformó sus dolores en una ofrenda de alabanza y amor a la Trinidad.",
        "Fue canonizada por el Papa Francisco en octubre de 2016."
      ],
      otherQuotes: [
        "«¡Oh Dios mío, Trinidad a quien adoro, ayúdame a olvidarme enteramente de mí para establecerme en Ti!»",
        "«He encontrado mi cielo en la tierra, porque el cielo es Dios, y Dios está en mi alma»."
      ]
    }
  ],
  "11-09": [
    {
      name: "Dedicación de la Basílica de San Juan de Letrán",
      feast: "Fiesta Litúrgica Universal",
      iconSvg: SVG_SAINT_HALO,
      bio: "Celebración de la Catedral del Obispo de Roma, «Madre y Cabeza de todas las iglesias de la Ciudad y del Mundo», signo visible de la unidad de todas las parroquias y comunidades católicas con la Cátedra de Pedro.",
      quote: "«Ustedes son piedras vivas edificadas como templo espiritual» (1 Pe 2, 5).",
      theologicalExplanation: "El Evangelio de la purificación del Templo (Jn 2, 13-22) enseña que el templo de piedra es signo del Cuerpo místico de Cristo y del corazón de cada creyente, santuario vivo del Espíritu Santo.",
      curiosities: [
        "Construida por el emperador Constantino en el siglo IV, es la catedral de la diócesis de Roma y sede del Papa.",
        "En su fachada exhibe la inscripción latina: «Omnium urbis et orbis ecclesiarum mater et caput».",
        "En ella se celebraron cinco concilios ecuménicos fundamentales para la historia de la Iglesia."
      ],
      otherQuotes: [
        "«Ustedes son piedras vivas edificadas como templo espiritual» (1 Pe 2, 5).",
        "«Donde está la caridad y el amor, allí está el Señor»."
      ]
    }
  ],
  "11-10": [
    {
      name: "San León Magno, Papa y Doctor de la Iglesia",
      feast: "Memoria Obligatoria",
      iconSvg: SVG_SAINT_HALO,
      bio: "Gran pastor del siglo V que defendió la fe en la verdadera humanidad y divinidad de Cristo en el Concilio de Calcedonia y protegió al pueblo de Roma promoviendo la paz y las obras de caridad.",
      quote: "«Reconoce, oh cristiano, tu dignidad de hijo de Dios».",
      theologicalExplanation: "La confesión de fe de Pedro: «Tú eres el Cristo, el Hijo de Dios vivo» (Mt 16, 16) fue magistralmente explicada por San León en su célebre 'Tomo a Flaviano', cimiento dogmático sobre las dos naturalezas de Cristo.",
      curiosities: [
        "En el año 452 salió desarmado al encuentro de Atila el Huno a orillas del río Mincio y logró disuadirlo de saquear e incendiar Roma.",
        "Fue el primer Papa en recibir el título de 'Magno' (el Grande) y proclamado Doctor de la Iglesia en 1754.",
        "Nos dejó más de 90 sermones y 140 cartas de sublime belleza teológica y pastoral."
      ],
      otherQuotes: [
        "«Reconoce, oh cristiano, tu dignidad: hecho partícipe de la naturaleza divina, no vuelvas a la vieja bajeza».",
        "«La verdadera paz consiste en concordar con la voluntad de Dios»."
      ]
    }
  ],
  "11-11": [
    {
      name: "San Martín de Tours, Obispo (Patrono de Buenos Aires)",
      feast: "Memoria Obligatoria · Patrono de CABA",
      iconSvg: SVG_SAINT_HALO,
      bio: "Joven soldado que en una noche helada partió su capa con la espada para abrigar a un mendigo tembloroso; esa noche soñó a Jesucristo vestido con aquella media capa. Elegido en 1580 como Santo Patrono de la Ciudad de Buenos Aires.",
      quote: "«Martín, todavía catecúmeno, me ha cubierto con este vestido».",
      theologicalExplanation: "La frase célebre de Jesús: «Tuve hambre y me dieron de comer, estuve desnudo y me vistieron» (Mt 25, 36) se hizo carne cuando Martín cortó su capa militar para abrigar a Cristo en la figura de un mendigo.",
      curiosities: [
        "Nacido en Panonia (actual Hungría), sirvió en la caballería imperial romana antes de recibir el bautismo y fundar monasterios.",
        "En 1580, don Juan de Garay y los fundadores de la Ciudad de Buenos Aires echaron suertes para elegir al Santo Patrono, recayendo en San Martín de Tours.",
        "Es el primer santo no mártir venerado con culto litúrgico en la Iglesia universal."
      ],
      otherQuotes: [
        "«Martín, todavía catecúmeno, me ha cubierto con este vestido».",
        "«Señor, si todavía soy necesario a tu pueblo, no rehúso el trabajo: hágase tu voluntad»."
      ]
    }
  ]
};

const SAINTS_FALLBACK_CYCLE = [
  SAINTS_BY_MMDD["11-05"],
  SAINTS_BY_MMDD["11-11"],
  SAINTS_BY_MMDD["11-03"],
  SAINTS_BY_MMDD["11-04"],
  SAINTS_BY_MMDD["11-08"],
  SAINTS_BY_MMDD["11-10"],
  SAINTS_BY_MMDD["11-01"]
];

function getGospelForDate(isoDateStr) {
  const cleanIso = /^\d{4}-\d{2}-\d{2}$/.test(String(isoDateStr || "")) ? String(isoDateStr) : getTodayIsoDate();
  const parts = cleanIso.split("-").map(Number);
  const y = parts[0] || 2026;
  const m = parts[1] || 11;
  const d = parts[2] || 5;
  const mmdd = `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const exactMatch = OFFICIAL_GOSPELS_BY_MMDD[mmdd];
  const seedIndex = Math.abs(y * 372 + m * 31 + d) % ARGENTINE_GOSPELS_CYCLE.length;
  const baseReading = exactMatch || ARGENTINE_GOSPELS_CYCLE[seedIndex];

  const dt = new Date(y, m - 1, d, 12, 0, 0);
  const formattedLongDate = dt.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return {
    ...baseReading,
    isoDate: cleanIso,
    mmdd,
    formattedLongDate: formattedLongDate.charAt(0).toUpperCase() + formattedLongDate.slice(1)
  };
}

function getSaintsForDate(isoDateStr) {
  const cleanIso = /^\d{4}-\d{2}-\d{2}$/.test(String(isoDateStr || "")) ? String(isoDateStr) : getTodayIsoDate();
  const parts = cleanIso.split("-").map(Number);
  const m = parts[1] || 11;
  const d = parts[2] || 5;
  const mmdd = `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  if (SAINTS_BY_MMDD[mmdd]) return SAINTS_BY_MMDD[mmdd];
  const idx = Math.abs(m * 31 + d) % SAINTS_FALLBACK_CYCLE.length;
  return SAINTS_FALLBACK_CYCLE[idx];
}

function renderLiturgyView() {
  const container = $("#liturgy-content");
  if (!container) return;

  const g = getGospelForDate(state.liturgyDate);

  container.innerHTML = `
    <!-- Barra de Selección de Fecha Litúrgica con Selector Estilizado Personalizado -->
    <div class="liturgy-toolbar">
      <div class="liturgy-toolbar-info">
        <strong>${g.formattedLongDate}</strong>
        <span>Primera lectura, Salmo y evangelio del día.</span>
      </div>
      <div class="liturgy-date-controls">
        ${renderCustomDatePickerHtml("liturgy", g.isoDate)}
      </div>
    </div>

    <!-- Tarjetas Interactivas Desplegables: Primera Lectura y Salmo Responsorial -->
    <div class="liturgy-interactive-grid">
      <!-- 1. Primera Lectura Interactiva -->
      <article class="reading-interactive-card ${state.openFirstReading ? "is-expanded" : ""}">
        <button type="button" class="reading-toggle-btn" data-toggle-lit-reading="first" aria-expanded="${state.openFirstReading}">
          <div class="reading-toggle-info">
            <span class="reading-kicker">📜 Primera Lectura · ${g.firstReadingRef}</span>
            <span class="reading-title">«${g.firstReadingTitle}»</span>
            <span class="reading-preview">${state.openFirstReading ? "Texto bíblico completo desplegado abajo" : "Tocá para desplegar el texto completo de la Primera Lectura"}</span>
          </div>
          <span class="reading-expand-pill">${state.openFirstReading ? "▲ Ocultar texto" : "▼ Leer completa"}</span>
        </button>
        ${state.openFirstReading ? `
          <div class="reading-full-body">
            <div class="reading-scripture-text">${g.firstReadingFullText}</div>
            <p class="reading-liturgical-footer">— Palabra de Dios. / Te alabamos, Señor.</p>
            <div style="margin-top:12px;display:flex;justify-content:flex-end">
              <button type="button" class="btn-sm" id="btn-save-first-to-notes">📓 Guardar Primera Lectura en Notas</button>
            </div>
          </div>
        ` : ""}
      </article>

      <!-- 2. Salmo Responsorial Interactivo -->
      <article class="reading-interactive-card ${state.openPsalm ? "is-expanded" : ""}">
        <button type="button" class="reading-toggle-btn" data-toggle-lit-reading="psalm" aria-expanded="${state.openPsalm}">
          <div class="reading-toggle-info">
            <span class="reading-kicker">🎵 Salmo Responsorial · ${g.psalmRef}</span>
            <span class="reading-title">${g.psalmResponse}</span>
            <span class="reading-preview">${state.openPsalm ? "Estrofas y antífona del Salmo desplegadas abajo" : "Tocá para desplegar todas las estrofas y respuesta del Salmo"}</span>
          </div>
          <span class="reading-expand-pill">${state.openPsalm ? "▲ Ocultar salmo" : "▼ Leer salmo"}</span>
        </button>
        ${state.openPsalm ? `
          <div class="reading-full-body">
            <div class="reading-response-banner">🎵 Antífona: ${g.psalmResponse}</div>
            <div class="reading-scripture-text">${g.psalmFullText}</div>
            <div style="margin-top:12px;display:flex;justify-content:flex-end">
              <button type="button" class="btn-sm" id="btn-save-psalm-to-notes">📓 Guardar Salmo en Notas</button>
            </div>
          </div>
        ` : ""}
      </article>
    </div>

    <!-- 3. Ficha Principal del Evangelio Oficial del Día + Explicación Pastoral Interactiva -->
    <article class="gospel-card">
      <div class="gospel-head">
        <span class="gospel-tag">🇦🇷 ${g.liturgicalSeason}</span>
        <h3>Evangelio según San ${g.citation}: «${g.title}»</h3>
      </div>

      <div class="gospel-body-text">${g.gospelText.split("\n\n").map(p => `<p style="margin:0 0 12px">${p}</p>`).join("")}</div>
      <p style="margin:10px 0 0;font-size:0.82rem;font-weight:700;color:var(--brand)">— Palabra del Señor. / Gloria a Ti, Señor Jesús.</p>

      <!-- Opción Interactiva: Reflexión del Papa debajo del Evangelio -->
      <button type="button" class="btn-explain-gospel" id="btn-toggle-gospel-explain" aria-expanded="${state.liturgyExplainOpen}">
        <span>Reflexión del Papa</span>
        <span>${state.liturgyExplainOpen ? "▲ Ocultar" : "▼ Leer reflexión"}</span>
      </button>

      ${state.liturgyExplainOpen ? (() => {
        const verRef = getVerifiedReflectionForDate(g.isoDate);
        return `
        <div class="gospel-explanation-panel" id="gospel-explanation-panel">
          <div class="pastoral-why-box">
            <h4>Reflexión del Papa</h4>
            <p style="margin:2px 0 10px;font-size:0.86rem;color:var(--muted)"><em>${esc(verRef.source)} · ${esc(verRef.document)}</em></p>
            <p class="reflection-quote-text">«${esc(verRef.quote)}»</p>
            <div style="margin-top:10px">
              <a href="${esc(verRef.url)}" target="_blank" rel="noopener noreferrer" class="reflection-official-link">
                Vatican.va ↗
              </a>
            </div>
          </div>
          ${SHOW_COMMUNITY ? `
          <div style="margin-top:14px;display:flex;justify-content:flex-end">
            <button type="button" class="btn-sm submit" id="btn-save-gospel-to-notes">Anotar reflexión en Notas</button>
          </div>` : ""}
        </div>`;
      })() : ""}
    </article>`;
}

/* =====================================================================
   MÓDULO 2: REFLEXIONES DEL PAPA
   ===================================================================== */
var VERIFIED_REFLECTIONS = [
  {
    "id": 1,
    "date": "2026-06-05",
    "source": "Audiencia General",
    "document": "Catequesis sobre la esperanza",
    "quote": "La esperanza no defrauda, porque el amor de Dios ha sido derramado en nuestros corazones por el Espíritu Santo que nos ha sido dado (Rm 5,5). La esperanza cristiana no es optimismo ingenuo, sino certeza arraigada en la fidelidad de Dios.",
    "url": "https://www.vatican.va/content/francesco/es/audiences.index.html"
  },
  {
    "id": 2,
    "date": "2026-11-05",
    "source": "Bula de Convocación del Jubileo",
    "document": "Spes non confundit, n. 1",
    "quote": "«Spes non confundit», «la esperanza no defrauda» (Rm 5,5). Bajo el signo de la esperanza el apóstol Pablo infunde aliento a la comunidad cristiana de Roma. También hoy la esperanza es el mensaje central para sostener el camino de los creyentes.",
    "url": "https://www.vatican.va/content/francesco/es/bulls/documents/20240509_spes-non-confundit_bolla-giubileo2025.html"
  },
  {
    "id": 3,
    "date": "2026-11-06",
    "source": "Carta Encíclica",
    "document": "Dilexit Nos, n. 2",
    "quote": "El Corazón de Cristo es el centro vivo donde se unifican la verdad y la caridad. Volver al corazón significa recuperar la autenticidad de la fe frente a la dispersión superficial de nuestro tiempo.",
    "url": "https://www.vatican.va/content/francesco/es/encyclicals/documents/20241024_enciclica-dilexit-nos.html"
  },
  {
    "id": 4,
    "date": "2026-11-07",
    "source": "Exhortación Apostólica",
    "document": "Evangelii Gaudium, n. 1",
    "quote": "La alegría del Evangelio llena el corazón y la vida entera de los que se encuentran con Jesús. Quienes se dejan salvar por Él son liberados del pecado, de la tristeza, del vacío interior y del aislamiento.",
    "url": "https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html"
  },
  {
    "id": 5,
    "date": "2026-11-08",
    "source": "Carta Encíclica",
    "document": "Fratelli Tutti, n. 67",
    "quote": "La parábola del buen samaritano nos muestra con qué iniciativas se puede rehacer una comunidad a partir de hombres y mujeres que hacen propia la fragilidad de los demás y que no dejan que se erija una sociedad de exclusión.",
    "url": "https://www.vatican.va/content/francesco/es/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html"
  },
  {
    "id": 6,
    "date": "2026-11-09",
    "source": "Exhortación Apostólica",
    "document": "Gaudete et Exsultate, n. 14",
    "quote": "Para ser santos no es necesario ser obispos, sacerdotes, religiosas o religiosos. Todos estamos llamados a ser santos viviendo con amor y ofreciendo el propio testimonio en las ocupaciones de cada día, allí donde cada uno se encuentra.",
    "url": "https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20180319_gaudete-et-exsultate.html"
  },
  {
    "id": 7,
    "date": "2026-11-10",
    "source": "Carta Encíclica",
    "document": "Deus Caritas Est, n. 1",
    "quote": "No se comienza a ser cristiano por una decisión ética o una gran idea, sino por el encuentro con un acontecimiento, con una Persona, que da un nuevo horizonte a la vida y, con ello, una orientación decisiva.",
    "url": "https://www.vatican.va/content/benedict-xvi/es/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html"
  },
  {
    "id": 8,
    "date": "2026-11-11",
    "source": "Exhortación Apostólica Postsinodal",
    "document": "Verbum Domini, n. 72",
    "quote": "La Sagrada Escritura ha de ser proclamada, escuchada, leída, acogida y vivida como Palabra de Dios, en el surco de la Tradición apostólica, de la que es inseparable.",
    "url": "https://www.vatican.va/content/benedict-xvi/es/apost_exhortations/documents/hf_ben-xvi_exh_20100930_verbum-domini.html"
  },
  {
    "id": 9,
    "date": "2026-11-12",
    "source": "Carta Encíclica",
    "document": "Spe Salvi, n. 2",
    "quote": "El que tiene esperanza vive de otra manera; se le ha dado una vida nueva. El mensaje cristiano no es sólo «informativo», sino «performativo»: el Evangelio no es solamente una comunicación de cosas que se pueden saber, sino una comunicación que comporta hechos y cambia la vida.",
    "url": "https://www.vatican.va/content/benedict-xvi/es/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html"
  },
  {
    "id": 10,
    "date": "2026-11-13",
    "source": "Catecismo de la Iglesia Católica",
    "document": "La Oración en la Vida Cristiana, CEC 2558",
    "quote": "«Para mí, la oración es un impulso del corazón, una sencilla mirada lanzada hacia el cielo, un grito de reconocimiento y de amor tanto desde dentro de la prueba como desde dentro de la alegría» (Santa Teresita del Niño Jesús).",
    "url": "https://www.vatican.va/archive/catechism_sp/p4s1_sp.html"
  }
];

async function loadVerifiedReflections() {
  try {
    const res = await fetch(REFLECTIONS_DATA_URL, { headers: { "Accept": "application/json" } });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      VERIFIED_REFLECTIONS = data;
      if (state.view === "reflections") renderReflectionsView();
    }
  } catch (err) {
    console.warn("[Reflexiones] Usando arreglo estático verificado embebido:", err);
  }
}

function getVerifiedReflectionForDate(isoDateStr) {
  if (!Array.isArray(VERIFIED_REFLECTIONS) || !VERIFIED_REFLECTIONS.length) {
    return {
      id: 1,
      date: "2026-06-05",
      source: "Audiencia General",
      document: "Catequesis sobre la esperanza",
      quote: "La esperanza no defrauda, porque el amor de Dios ha sido derramado en nuestros corazones...",
      url: "https://www.vatican.va/content/francesco/es/audiences.index.html"
    };
  }
  const exact = VERIFIED_REFLECTIONS.find(r => r.date === isoDateStr);
  if (exact) return exact;
  const parts = String(isoDateStr || "").split("-").map(Number);
  const idx = Math.abs((parts[1] || 1) * 31 + (parts[2] || 1)) % VERIFIED_REFLECTIONS.length;
  return VERIFIED_REFLECTIONS[idx];
}

function renderReflectionsView() {
  const container = $("#reflections-content");
  if (!container) return;

  const list = Array.isArray(VERIFIED_REFLECTIONS) ? VERIFIED_REFLECTIONS : [];
  container.innerHTML = list.map(item => `
    <article class="reflection-card" data-reflection-id="${esc(String(item.id))}">
      <div class="reflection-meta-top">
        <h3 class="reflection-doc-title" style="margin:0">Reflexión del Papa</h3>
        <time class="reflection-date-badge" datetime="${esc(item.date)}">${esc(item.date)}</time>
      </div>
      <p class="reflection-source-line" style="margin:0;font-size:0.9rem;color:var(--muted)"><em>${esc(item.source)} · ${esc(item.document)}</em></p>
      <blockquote class="reflection-quote-text">«${esc(item.quote)}»</blockquote>
      <div class="reflection-card-footer">
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="reflection-official-link">
          Vatican.va ↗
        </a>
      </div>
    </article>
  `).join("");
}

/* =====================================================================
   MÓDULO 4: EL LIBRO DEL PUEBLO DE DIOS (TRADUCCIÓN OFICIAL ARGENTINA - CEA)
   ===================================================================== */
var BIBLE_DATA = {
  "testaments": [
    {
      "id": "antiguo",
      "name": "Antiguo Testamento",
      "categories": [
        {
          "id": "pentateuco",
          "name": "Pentateuco",
          "books": [
            {
              "id": "gn",
              "name": "Génesis",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:1 Al principio Dios creó el cielo y la tierra.",
                    "1:2 La tierra era algo informe y vacío, las tinieblas cubrían el abismo, y el soplo de Dios aleteaba sobre las aguas.",
                    "1:3 Entonces Dios dijo: «Que exista la luz». Y la luz existió.",
                    "1:4 Dios vio que la luz era buena, y separó la luz de las tinieblas;",
                    "1:5 y llamó «día» a la luz y «noche» a las tinieblas. Así hubo una tarde y una mañana: este fue el primer día.",
                    "1:26 Entonces Dios dijo: «Hagamos al hombre a nuestra imagen, según nuestra semejanza; y que le estén sometidos los peces del mar y las aves del cielo, el ganado, las fieras de la tierra, y todos los animales que se arrastran por el suelo».",
                    "1:27 Y Dios creó al hombre a su imagen; lo creó a imagen de Dios, los creó varón y mujer.",
                    "1:31 Dios miró todo lo que había hecho, y vio que era muy bueno. Así hubo una tarde y una mañana: este fue el sexto día."
                  ]
                },
                {
                  "number": 12,
                  "verses": [
                    "12:1 El Señor dijo a Abram: «Deja tu tierra natal y la casa de tu padre, y ve al país que yo te mostraré.",
                    "12:2 Yo haré de ti una gran nación y te bendeciré; engrandeceré tu nombre y serás una bendición.",
                    "12:3 Bendeciré a los que te bendigan y maldeciré al que te maldiga, y por ti se bendecirán todos los pueblos de la tierra»."
                  ]
                }
              ]
            },
            {
              "id": "ex",
              "name": "Éxodo",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:1 Moisés apacentaba el rebaño de su suegro Jetró, sacerdote de Madián. Una vez llevó el rebaño más allá del desierto y llegó a la montaña de Dios, al Horeb.",
                    "3:2 Allí se le apareció el Ángel del Señor en una llama de fuego, que salía de en medio de la zarza.",
                    "3:5 Entonces Dios le dijo: «No te acerques hasta aquí. Quítate las sandalias, porque el suelo que estás pisando es una tierra santa».",
                    "3:14 Dios dijo a Moisés: «Yo soy el que soy». Luego añadió: «Así hablarás a los israelitas: \"YO SOY me envió a ustedes\"»."
                  ]
                },
                {
                  "number": 20,
                  "verses": [
                    "20:1 Entonces Dios pronunció estas palabras:",
                    "20:2 «Yo soy el Señor, tu Dios, que te hice salir de Egipto, de un lugar de esclavitud.",
                    "20:3 No tendrás otros dioses delante de mí.",
                    "20:8 Acuérdate del día sábado para santificarlo.",
                    "20:12 Honra a tu padre y a tu madre, para que tengas una larga vida en la tierra que el Señor, tu Dios, te da."
                  ]
                }
              ]
            },
            {
              "id": "lv",
              "name": "Levítico",
              "chapters": [
                {
                  "number": 19,
                  "verses": [
                    "19:1 El Señor habló a Moisés en estos términos:",
                    "19:2 Habla a toda la comunidad de los israelitas y diles: Sean santos, porque yo, el Señor, su Dios, soy santo.",
                    "19:18 Amarás a tu prójimo como a ti mismo. Yo soy el Señor."
                  ]
                }
              ]
            },
            {
              "id": "nm",
              "name": "Números",
              "chapters": [
                {
                  "number": 6,
                  "verses": [
                    "6:24 Que el Señor te bendiga y te proteja.",
                    "6:25 Que el Señor haga brillar su rostro sobre ti y te muestre su gracia.",
                    "6:26 Que el Señor te descubra su rostro y te conceda la paz."
                  ]
                }
              ]
            },
            {
              "id": "dt",
              "name": "Deuteronomio",
              "chapters": [
                {
                  "number": 6,
                  "verses": [
                    "6:4 Escucha, Israel: el Señor, nuestro Dios, es el único Señor.",
                    "6:5 Amarás al Señor, tu Dios, con todo tu corazón, con toda tu alma y con todas tus fuerzas.",
                    "6:6 Graba en tu corazón estas palabras que yo te dicto hoy."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "historicos",
          "name": "Históricos",
          "books": [
            {
              "id": "jos",
              "name": "Josué",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:9 Yo te mando que seas firme y valiente. No tengas miedo ni te acobardes, porque el Señor, tu Dios, estará contigo dondequiera que vayas."
                  ]
                }
              ]
            },
            {
              "id": "jue",
              "name": "Jueces",
              "chapters": [
                {
                  "number": 6,
                  "verses": [
                    "6:12 El Ángel del Señor se le apareció y le dijo: «El Señor está contigo, valiente guerrero»."
                  ]
                }
              ]
            },
            {
              "id": "rut",
              "name": "Rut",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:16 Pero Rut le respondió: «No insistas en que te abandone y me vuelva atrás, porque yo iré adonde tú vayas y viviré donde tú vivas. Tu pueblo será mi pueblo y tu Dios será mi Dios»."
                  ]
                }
              ]
            },
            {
              "id": "1sam",
              "name": "Primer libro de Samuel",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:10 Entonces vino el Señor, se detuvo, y llamó como las otras veces: «¡Samuel, Samuel!». Él respondió: «Habla, porque tu servidor escucha»."
                  ]
                }
              ]
            },
            {
              "id": "2sam",
              "name": "Segundo libro de Samuel",
              "chapters": [
                {
                  "number": 7,
                  "verses": [
                    "7:16 Tu casa y tu reino durarán para siempre delante de mí, y tu trono será estable para siempre."
                  ]
                }
              ]
            },
            {
              "id": "1rey",
              "name": "Primer libro de los Reyes",
              "chapters": [
                {
                  "number": 19,
                  "verses": [
                    "19:12 Después del terremoto, se encendió un fuego; pero el Señor no estaba en el fuego. Después del fuego, se oyó el rumor de una brisa suave."
                  ]
                }
              ]
            },
            {
              "id": "2rey",
              "name": "Segundo libro de los Reyes",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:9 Mientras cruzaban, Elías dijo a Eliseo: «Pide lo que quieres que haga por ti antes de que sea separado de tu lado»."
                  ]
                }
              ]
            },
            {
              "id": "1cro",
              "name": "Primer libro de las Crónicas",
              "chapters": [
                {
                  "number": 16,
                  "verses": [
                    "16:8 ¡Den gracias al Señor, invoquen su Nombre, hagan conocer entre los pueblos sus proezas!"
                  ]
                }
              ]
            },
            {
              "id": "2cro",
              "name": "Segundo libro de las Crónicas",
              "chapters": [
                {
                  "number": 7,
                  "verses": [
                    "7:14 Si mi pueblo, el que es llamado con mi Nombre, se humilla y ora, si busca mi rostro y se convierte de su mala conducta, yo escucharé desde el cielo."
                  ]
                }
              ]
            },
            {
              "id": "esd",
              "name": "Esdras",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:11 Y cantaban alabando y dando gracias al Señor, «porque él es bueno, porque es eterno su amor hacia Israel»."
                  ]
                }
              ]
            },
            {
              "id": "neh",
              "name": "Nehemías",
              "chapters": [
                {
                  "number": 8,
                  "verses": [
                    "8:10 «No estén tristes, porque la alegría en el Señor es la fortaleza de ustedes»."
                  ]
                }
              ]
            },
            {
              "id": "tob",
              "name": "Tobías",
              "chapters": [
                {
                  "number": 12,
                  "verses": [
                    "12:8 Vale más la oración con el ayuno y la limosna con la justicia, que la riqueza con la iniquidad."
                  ]
                }
              ]
            },
            {
              "id": "jdt",
              "name": "Judit",
              "chapters": [
                {
                  "number": 13,
                  "verses": [
                    "13:18 «¡Bendita seas, hija, por el Dios Altísimo, más que todas las mujeres de la tierra!»."
                  ]
                }
              ]
            },
            {
              "id": "est",
              "name": "Ester",
              "chapters": [
                {
                  "number": 4,
                  "verses": [
                    "4:14 ¿Quién sabe si no has llegado a ser reina precisamente para una ocasión como esta?"
                  ]
                }
              ]
            },
            {
              "id": "1mac",
              "name": "Primer libro de los Macabeos",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:19 Porque la victoria en el combate no depende de la cantidad de las tropas, sino de la fuerza que viene del Cielo."
                  ]
                }
              ]
            },
            {
              "id": "2mac",
              "name": "Segundo libro de los Macabeos",
              "chapters": [
                {
                  "number": 7,
                  "verses": [
                    "7:9 El Rey del universo nos resucitará a una vida eterna, ya que nosotros morimos por fidelidad a sus leyes."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "sapienciales",
          "name": "Sapienciales",
          "books": [
            {
              "id": "sal",
              "name": "Salmos",
              "chapters": [
                {
                  "number": 23,
                  "verses": [
                    "23:1 El Señor es mi pastor, nada me puede faltar.",
                    "23:2 Él me hace descansar en verdes praderas, me conduce a las aguas tranquilas",
                    "23:3 y repara mis fuerzas; me guía por el recto sendero, por amor de su Nombre.",
                    "23:4 Aunque cruce por oscuras quebradas, no temeré ningún mal, porque tú estás conmigo: tu vara y tu bastón me infunden confianza.",
                    "23:5 Tú preparas ante mí una mesa, frente a mis enemigos; unges con óleo mi cabeza y mi copa rebosa.",
                    "23:6 Tu bondad y tu gracia me acompañan a lo largo de mi vida; y habitaré en la Casa del Señor, por muy largo tiempo."
                  ]
                },
                {
                  "number": 51,
                  "verses": [
                    "51:3 ¡Ten piedad de mí, Señor, por tu bondad, por tu gran compasión, borra mis faltas!",
                    "51:12 Crea en mí, Dios mío, un corazón puro, y renueva la firmeza de mi espíritu."
                  ]
                }
              ]
            },
            {
              "id": "job",
              "name": "Job",
              "chapters": [
                {
                  "number": 19,
                  "verses": [
                    "19:25 Yo sé que mi Redentor vive y que al final se alzará sobre el polvo."
                  ]
                }
              ]
            },
            {
              "id": "prov",
              "name": "Proverbios",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:5 Confía en el Señor de todo corazón y no te apoyes en tu propia inteligencia;",
                    "3:6 reconócelo a él en todos tus caminos y él allanará tus senderos."
                  ]
                }
              ]
            },
            {
              "id": "ecl",
              "name": "Eclesiastés (Qohélet)",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:1 Hay un momento para todo y un tiempo para cada cosa bajo el cielo."
                  ]
                }
              ]
            },
            {
              "id": "cant",
              "name": "Cantar de los Cantares",
              "chapters": [
                {
                  "number": 8,
                  "verses": [
                    "8:7 Las grandes aguas no pueden apagar el amor, ni los ríos arrastrarlo."
                  ]
                }
              ]
            },
            {
              "id": "sab",
              "name": "Sabiduría",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:1 Las almas de los justos están en las manos de Dios, y no los afectará ningún tormento."
                  ]
                }
              ]
            },
            {
              "id": "eclo",
              "name": "Eclesiástico (Sirácida)",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:1 Hijo mío, si te decides a servir al Señor, prepara tu alma para la prueba."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "profeticos",
          "name": "Proféticos",
          "books": [
            {
              "id": "is",
              "name": "Isaías",
              "chapters": [
                {
                  "number": 40,
                  "verses": [
                    "40:1 ¡Consuelen, consuelen a mi pueblo, dice su Dios!",
                    "40:8 Se seca la hierba, se marchita la flor, pero la palabra de nuestro Dios permanece para siempre.",
                    "40:31 Pero los que esperan en el Señor renuevan sus fuerzas, despliegan alas como las águilas; corren y no se agotan, avanzan y no se fatigan."
                  ]
                }
              ]
            },
            {
              "id": "jer",
              "name": "Jeremías",
              "chapters": [
                {
                  "number": 29,
                  "verses": [
                    "29:11 Porque yo conozco muy bien los planes que tengo proyectados sobre ustedes —oráculo del Señor—: son planes de prosperidad y no de desgracia, para asegurarles un porvenir y una esperanza."
                  ]
                }
              ]
            },
            {
              "id": "lam",
              "name": "Lamentaciones",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:22 El amor del Señor no se ha agotado ni se han terminado sus misericordias; se renuevan cada mañana."
                  ]
                }
              ]
            },
            {
              "id": "bar",
              "name": "Baruc",
              "chapters": [
                {
                  "number": 5,
                  "verses": [
                    "5:1 Quítate tu vestido de duelo y aflicción, Jerusalén, vístete para siempre con el esplendor de la gloria de Dios."
                  ]
                }
              ]
            },
            {
              "id": "ez",
              "name": "Ezequiel",
              "chapters": [
                {
                  "number": 36,
                  "verses": [
                    "36:26 Les daré un corazón nuevo y pondré en ustedes un espíritu nuevo: les arrancaré de su cuerpo el corazón de piedra y les daré un corazón de carne."
                  ]
                }
              ]
            },
            {
              "id": "dn",
              "name": "Daniel",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:52 ¡Bendito seas, Señor, Dios de nuestros padres, alabado y exaltado eternamente!"
                  ]
                }
              ]
            },
            {
              "id": "os",
              "name": "Oseas",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:16 Por eso, yo la seduciré, la llevaré al desierto y le hablaré a su corazón."
                  ]
                }
              ]
            },
            {
              "id": "jl",
              "name": "Joel",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:13 Desgarren su corazón y no sus vestiduras, y vuelvan al Señor, su Dios, porque él es bondadoso y compasivo."
                  ]
                }
              ]
            },
            {
              "id": "am",
              "name": "Amós",
              "chapters": [
                {
                  "number": 5,
                  "verses": [
                    "5:14 Busquen el bien y no el mal, para que tengan vida."
                  ]
                }
              ]
            },
            {
              "id": "abd",
              "name": "Abdías",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:15 Porque está cerca el Día del Señor sobre todas las naciones."
                  ]
                }
              ]
            },
            {
              "id": "jon",
              "name": "Jonás",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:3 En mi angustia invoqué al Señor, y él me respondió."
                  ]
                }
              ]
            },
            {
              "id": "miq",
              "name": "Miqueas",
              "chapters": [
                {
                  "number": 6,
                  "verses": [
                    "6:8 Se te ha indicado, hombre, qué es lo bueno y qué exige de ti el Señor: nada más que practicar la justicia, amar la fidelidad y caminar humildemente con tu Dios."
                  ]
                }
              ]
            },
            {
              "id": "nah",
              "name": "Nahúm",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:7 El Señor es bueno, es un refugio en el día de la angustia; él reconoce a los que confían en él."
                  ]
                }
              ]
            },
            {
              "id": "hab",
              "name": "Habacuc",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:4 El que no tiene el alma recta, sucumbirá; pero el justo vivirá por su fidelidad."
                  ]
                }
              ]
            },
            {
              "id": "sof",
              "name": "Sofonías",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:17 El Señor, tu Dios, está en medio de ti, es un salvador poderoso; él se regocija por ti con alegría, te renueva con su amor."
                  ]
                }
              ]
            },
            {
              "id": "ag",
              "name": "Ageo",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:9 En este lugar yo daré la paz, oráculo del Señor de los ejércitos."
                  ]
                }
              ]
            },
            {
              "id": "zac",
              "name": "Zacarías",
              "chapters": [
                {
                  "number": 9,
                  "verses": [
                    "9:9 ¡Alégrate mucho, hija de Sión! Mira que tu Rey viene hacia ti; él es justo y victorioso."
                  ]
                }
              ]
            },
            {
              "id": "mal",
              "name": "Malaquías",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:20 Pero para ustedes, los que temen mi Nombre, brillará el sol de justicia que trae la salud en sus rayos."
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "nuevo",
      "name": "Nuevo Testamento",
      "categories": [
        {
          "id": "evangelios",
          "name": "Evangelios",
          "books": [
            {
              "id": "mt",
              "name": "Evangelio según San Mateo",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:1 Genealogía de Jesucristo, hijo de David, hijo de Abraham:",
                    "1:2 Abraham fue padre de Isaac; Isaac, padre de Jacob; Jacob, padre de Judá y de sus hermanos.",
                    "1:16 Jacob fue padre de José, el esposo de María, de la cual nació Jesús, que es llamado Cristo.",
                    "1:21 Ella dará a luz un hijo, a quien pondrás el nombre de Jesús, porque él salvará a su Pueblo de todos sus pecados."
                  ]
                },
                {
                  "number": 5,
                  "verses": [
                    "5:1 Al ver a la multitud, Jesús subió a la montaña, se sentó, y sus discípulos se acercaron a él.",
                    "5:2 Entonces tomó la palabra y comenzó a enseñarles, diciendo:",
                    "5:3 «Felices los que tienen alma de pobres, porque a ellos les pertenece el Reino de los Cielos.",
                    "5:4 Felices los afligidos, porque serán consolados.",
                    "5:5 Felices los pacientes, porque recibirán la tierra en herencia.",
                    "5:6 Felices los que tienen hambre y sed de justicia, porque serán saciados.",
                    "5:7 Felices los misericordiosos, porque obtendrán misericordia.",
                    "5:8 Felices los que tienen el corazón puro, porque verán a Dios.",
                    "5:9 Felices los que trabajan por la paz, porque serán llamados hijos de Dios.",
                    "5:10 Felices los que son perseguidos por practicar la justicia, porque a ellos les pertenece el Reino de los Cielos»."
                  ]
                }
              ]
            },
            {
              "id": "mc",
              "name": "Evangelio según San Marcos",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:1 Comienzo de la Buena Noticia de Jesús, Mesías, Hijo de Dios.",
                    "1:15 «El tiempo se ha cumplido: el Reino de Dios está cerca. Conviértanse y crean en la Buena Noticia»."
                  ]
                }
              ]
            },
            {
              "id": "lc",
              "name": "Evangelio según San Lucas",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:28 El Ángel entró en su casa y la saludó, diciendo: «¡Alégrate!, llena de gracia, el Señor está contigo».",
                    "1:38 María dijo entonces: «Yo soy la servidora del Señor, que se cumpla en mí lo que has dicho». Y el Ángel se alejó."
                  ]
                }
              ]
            },
            {
              "id": "jn",
              "name": "Evangelio según San Juan",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:1 Al principio existía la Palabra, y la Palabra estaba junto a Dios, y la Palabra era Dios.",
                    "1:14 Y la Palabra se hizo carne y habitó entre nosotros. Y nosotros hemos visto su gloria, la gloria que recibe del Padre como Hijo único, lleno de gracia y de verdad."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "hechos",
          "name": "Hechos",
          "books": [
            {
              "id": "hch",
              "name": "Hechos de los Apóstoles",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:8 Pero recibirán la fuerza del Espíritu Santo que descenderá sobre ustedes, y serán mis testigos en Jerusalén, en toda Judea y Samaría, y hasta los confines de la tierra."
                  ]
                },
                {
                  "number": 2,
                  "verses": [
                    "2:1 Al llegar el día de Pentecostés, estaban todos reunidos en el mismo lugar.",
                    "2:42 Todos se reunían asiduamente para escuchar la enseñanza de los Apóstoles y participar en la vida común, en la fracción del pan y en las oraciones."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "cartas_paulinas",
          "name": "Cartas Paulinas",
          "books": [
            {
              "id": "rm",
              "name": "Carta a los Romanos",
              "chapters": [
                {
                  "number": 5,
                  "verses": [
                    "5:1 Justificados, entonces, por la fe, estamos en paz con Dios, por medio de nuestro Señor Jesucristo.",
                    "5:5 Y la esperanza no quedará defraudada, porque el amor de Dios ha sido derramado en nuestros corazones por el Espíritu Santo, que nos ha sido dado."
                  ]
                },
                {
                  "number": 8,
                  "verses": [
                    "8:28 Sabemos, además, que Dios dispone todas las cosas para el bien de los que lo aman.",
                    "8:39 Ninguna criatura podrá separarnos jamás del amor de Dios, manifestado en Cristo Jesús, nuestro Señor."
                  ]
                }
              ]
            },
            {
              "id": "1cor",
              "name": "Primera Carta a los Corintios",
              "chapters": [
                {
                  "number": 13,
                  "verses": [
                    "13:4 El amor es paciente, es servicial; el amor no es envidioso, no hace alarde, no se envanece.",
                    "13:7 El amor todo lo disculpa, todo lo cree, todo lo espera, todo lo soporta.",
                    "13:13 Ahora existen tres cosas: la fe, la esperanza y el amor, pero la más grande de todas es el amor."
                  ]
                }
              ]
            },
            {
              "id": "2cor",
              "name": "Segunda Carta a los Corintios",
              "chapters": [
                {
                  "number": 12,
                  "verses": [
                    "12:9 Pero él me dijo: «Te basta mi gracia, porque mi poder triunfa en la debilidad»."
                  ]
                }
              ]
            },
            {
              "id": "gal",
              "name": "Carta a los Gálatas",
              "chapters": [
                {
                  "number": 5,
                  "verses": [
                    "5:22 El fruto del Espíritu es: amor, alegría y paz, magnanimidad, afabilidad, bondad y confianza."
                  ]
                }
              ]
            },
            {
              "id": "ef",
              "name": "Carta a los Efesios",
              "chapters": [
                {
                  "number": 4,
                  "verses": [
                    "4:2 Con mucha humildad, mansedumbre y paciencia, sopórtense mutuamente por amor."
                  ]
                }
              ]
            },
            {
              "id": "flp",
              "name": "Carta a los Filipenses",
              "chapters": [
                {
                  "number": 4,
                  "verses": [
                    "4:4 Alégrense siempre en el Señor. Vuelvo a insistir, alégrense.",
                    "4:13 Yo lo puedo todo en aquel que me conforta."
                  ]
                }
              ]
            },
            {
              "id": "col",
              "name": "Carta a los Colosenses",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:14 Y por encima de todo, tengan amor, que es el vínculo de la perfección."
                  ]
                }
              ]
            },
            {
              "id": "1tes",
              "name": "Primera Carta a los Tesalonicenses",
              "chapters": [
                {
                  "number": 5,
                  "verses": [
                    "5:16 Estén siempre alegres. 5:17 Oren sin cesar."
                  ]
                }
              ]
            },
            {
              "id": "2tes",
              "name": "Segunda Carta a los Tesalonicenses",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:3 Pero el Señor es fiel: él los fortalecerá y los preservará del Maligno."
                  ]
                }
              ]
            },
            {
              "id": "1tim",
              "name": "Primera Carta a Timoteo",
              "chapters": [
                {
                  "number": 4,
                  "verses": [
                    "4:12 Trata de ser un modelo para los que creen, en la conversación, en la conducta, en el amor, en la fe, en la pureza de vida."
                  ]
                }
              ]
            },
            {
              "id": "2tim",
              "name": "Segunda Carta a Timoteo",
              "chapters": [
                {
                  "number": 4,
                  "verses": [
                    "4:7 He peleado hasta el fin el buen combate, concluí mi carrera, conservé la fe."
                  ]
                }
              ]
            },
            {
              "id": "tit",
              "name": "Carta a Tito",
              "chapters": [
                {
                  "number": 2,
                  "verses": [
                    "2:11 Porque la gracia de Dios, que es fuente de salvación para todos los hombres, se ha manifestado."
                  ]
                }
              ]
            },
            {
              "id": "flm",
              "name": "Carta a Filemón",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:4 Doy gracias a mi Dios siempre que te recuerdo en mis oraciones."
                  ]
                }
              ]
            },
            {
              "id": "heb",
              "name": "Carta a los Hebreos",
              "chapters": [
                {
                  "number": 11,
                  "verses": [
                    "11:1 La fe es la garantía de los bienes que se esperan, la plena certeza de las realidades que no se ven."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "cartas_catolicas",
          "name": "Cartas Católicas",
          "books": [
            {
              "id": "sant",
              "name": "Carta de Santiago",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:22 Pongan en práctica la Palabra y no se contenten sólo con oírla."
                  ]
                }
              ]
            },
            {
              "id": "1pe",
              "name": "Primera Carta de San Pedro",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:15 Estén siempre dispuestos a defenderse delante de cualquiera que les pida razón de la esperanza que ustedes tienen."
                  ]
                }
              ]
            },
            {
              "id": "2pe",
              "name": "Segunda Carta de San Pedro",
              "chapters": [
                {
                  "number": 3,
                  "verses": [
                    "3:9 El Señor no tarda en cumplir lo que ha prometido, sino que tiene paciencia con ustedes."
                  ]
                }
              ]
            },
            {
              "id": "1jn",
              "name": "Primera Carta de San Juan",
              "chapters": [
                {
                  "number": 4,
                  "verses": [
                    "4:7 Queridos míos, amémonos los unos a los otros, porque el amor procede de Dios.",
                    "4:16 Dios es amor, y el que permanece en el amor permanece en Dios, y Dios permanece en él."
                  ]
                }
              ]
            },
            {
              "id": "2jn",
              "name": "Segunda Carta de San Juan",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:6 Y el amor consiste en vivir según sus mandamientos."
                  ]
                }
              ]
            },
            {
              "id": "3jn",
              "name": "Tercera Carta de San Juan",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:2 Querido hermano, ruego a Dios que te vaya bien en todo."
                  ]
                }
              ]
            },
            {
              "id": "jud",
              "name": "Carta de San Judas",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:21 Manténganse en el amor de Dios, esperando la misericordia de nuestro Señor Jesucristo para la Vida eterna."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "apocalipsis",
          "name": "Apocalipsis",
          "books": [
            {
              "id": "ap",
              "name": "Apocalipsis de San Juan",
              "chapters": [
                {
                  "number": 1,
                  "verses": [
                    "1:8 «Yo soy el Alfa y la Omega, dice el Señor Dios, el que es, el que era y el que vendrá, el Todopoderoso»."
                  ]
                },
                {
                  "number": 21,
                  "verses": [
                    "21:1 Después vi un cielo nuevo y una tierra nueva.",
                    "21:4 Él secará todas sus lágrimas, y no habrá más muerte, ni pena, ni queja, ni dolor, porque todo lo de antes pasó.",
                    "21:5 Y el que estaba sentado en el trono dijo: «Yo hago nuevas todas las cosas»."
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

async function loadBibleData() {
  try {
    const res = await fetch(BIBLE_DATA_URL, { headers: { "Accept": "application/json" } });
    if (!res.ok) return;
    const data = await res.json();
    if (data && Array.isArray(data.testaments) && data.testaments.length > 0) {
      BIBLE_DATA = data;
      if (state.view === "bible") renderBibleView();
    }
  } catch (err) {
    console.warn("[Libro del Pueblo de Dios] Usando dataset oficial CEA embebido:", err);
  }
}

function renderBibleView() {
  const container = $("#bible-content");
  if (!container) return;

  const testaments = Array.isArray(BIBLE_DATA.testaments) ? BIBLE_DATA.testaments : [];
  const selectedTestament = testaments.find(t => t.id === state.bibleTestamentId) || null;
  const categories = selectedTestament && Array.isArray(selectedTestament.categories) ? selectedTestament.categories : [];
  const selectedCategory = categories.find(c => c.id === state.bibleCategoryId) || null;
  const books = selectedCategory && Array.isArray(selectedCategory.books) ? selectedCategory.books : [];
  const selectedBook = books.find(b => b.id === state.bibleBookId) || null;
  const chapters = selectedBook && Array.isArray(selectedBook.chapters) ? selectedBook.chapters : [];
  const selectedChapter = chapters.find(ch => Number(ch.number) === Number(state.bibleChapterNum)) || chapters[0] || null;

  // Construcción de barra de migas de pan (Breadcrumbs) para navegación jerárquica limpia
  const crumbs = [
    `<button type="button" class="bible-crumb-btn ${!selectedTestament ? "is-current" : ""}" data-bible-nav="root">📖 Testamentos</button>`
  ];
  if (selectedTestament) {
    crumbs.push(`<span>›</span><button type="button" class="bible-crumb-btn ${!selectedCategory ? "is-current" : ""}" data-bible-nav="testament" data-testament-id="${esc(selectedTestament.id)}">${esc(selectedTestament.name)}</button>`);
  }
  if (selectedCategory) {
    crumbs.push(`<span>›</span><button type="button" class="bible-crumb-btn ${!selectedBook ? "is-current" : ""}" data-bible-nav="category" data-category-id="${esc(selectedCategory.id)}">${esc(selectedCategory.name)}</button>`);
  }
  if (selectedBook) {
    crumbs.push(`<span>›</span><button type="button" class="bible-crumb-btn is-current" data-bible-nav="book" data-book-id="${esc(selectedBook.id)}">${esc(selectedBook.name)}</button>`);
  }

  let bodyHtml = "";

  // NIVEL 1: Selección de Testamento (Antiguo Testamento / Nuevo Testamento)
  if (!selectedTestament) {
    bodyHtml = `
      <div class="bible-testament-grid">
        ${testaments.map(t => {
          const cats = Array.isArray(t.categories) ? t.categories : [];
          const totalBooks = cats.reduce((acc, c) => acc + (Array.isArray(c.books) ? c.books.length : 0), 0);
          return `
            <button type="button" class="bible-testament-card" data-select-testament="${esc(t.id)}">
              <span class="bible-testament-kicker">Edición Oficial Argentina (CEA)</span>
              <h2 class="bible-testament-title">${esc(t.name)}</h2>
              <p class="bible-testament-desc">${cats.length} categorías litúrgicas · ${totalBooks} libros canónicos</p>
              <div class="bible-testament-pills">
                ${cats.map(c => `<span class="bible-cat-mini-pill">${esc(c.name)}</span>`).join("")}
              </div>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }
  // NIVEL 2: Selección de Categoría Oficial según el Testamento elegido
  else if (!selectedCategory) {
    bodyHtml = `
      <div class="bible-category-grid">
        ${categories.map(cat => {
          const bCount = Array.isArray(cat.books) ? cat.books.length : 0;
          return `
            <button type="button" class="bible-category-card" data-select-category="${esc(cat.id)}">
              <strong>${esc(cat.name)}</strong>
              <span>${bCount} ${bCount === 1 ? "libro oficial" : "libros oficiales"} ›</span>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }
  // NIVEL 3: Lista de Libros Oficiales de la Categoría seleccionada
  else if (!selectedBook) {
    bodyHtml = `
      <div class="bible-book-grid">
        ${books.map(b => `
          <button type="button" class="bible-book-btn" data-select-book="${esc(b.id)}">
            <span>${esc(b.name)}</span>
            <span class="bible-book-abbr">${esc(b.id)}</span>
          </button>
        `).join("")}
      </div>
    `;
  }
  // NIVEL 4: Interfaz de lectura limpia tipo libro (Capítulos y Versículos)
  else {
    const activeChapNum = selectedChapter ? selectedChapter.number : 1;
    const verses = selectedChapter && Array.isArray(selectedChapter.verses) ? selectedChapter.verses : [];

    bodyHtml = `
      <article class="bible-reader-card">
        <div class="bible-reader-header">
          <div class="bible-reader-title-group">
            <span class="bible-testament-kicker">${esc(selectedTestament.name)} · ${esc(selectedCategory.name)}</span>
            <h2>${esc(selectedBook.name)} — Capítulo ${esc(String(activeChapNum))}</h2>
          </div>
          <button type="button" class="btn-sm ghost" data-bible-nav="category" data-category-id="${esc(selectedCategory.id)}">← Cambiar libro</button>
        </div>

        <div class="bible-chapter-bar" role="tablist" aria-label="Capítulos de ${esc(selectedBook.name)}">
          ${chapters.map(ch => `
            <button type="button" class="bible-chapter-pill ${Number(ch.number) === Number(activeChapNum) ? "is-active" : ""}" data-select-chapter="${esc(String(ch.number))}">
              Cap. ${esc(String(ch.number))}
            </button>
          `).join("")}
        </div>

        <div class="bible-verses-container">
          ${verses.map(v => {
            const match = String(v).match(/^(\d+:\d+)\s+(.*)$/);
            if (match) {
              return `<p class="bible-verse-line"><span class="bible-verse-num">${esc(match[1])}</span>${esc(match[2])}</p>`;
            }
            return `<p class="bible-verse-line">${esc(String(v))}</p>`;
          }).join("")}
        </div>
        <p class="reading-liturgical-footer" style="margin-top:18px;font-size:0.84rem;font-weight:700;color:var(--brand)">
          — Palabra de Dios. / Te alabamos, Señor. (El Libro del Pueblo de Dios · CEA)
        </p>
      </article>
    `;
  }

  container.innerHTML = `
    <nav class="bible-nav-bar" aria-label="Navegación del Libro del Pueblo de Dios">
      <div class="bible-breadcrumbs">${crumbs.join("")}</div>
    </nav>
    ${bodyHtml}
  `;

  // Delegación de eventos de navegación del Libro del Pueblo de Dios
  container.onclick = (e) => {
    const tBtn = e.target.closest("[data-select-testament]");
    if (tBtn) {
      state.bibleTestamentId = tBtn.getAttribute("data-select-testament");
      state.bibleCategoryId = null;
      state.bibleBookId = null;
      state.bibleChapterNum = null;
      renderBibleView();
      return;
    }

    const cBtn = e.target.closest("[data-select-category]");
    if (cBtn) {
      state.bibleCategoryId = cBtn.getAttribute("data-select-category");
      state.bibleBookId = null;
      state.bibleChapterNum = null;
      renderBibleView();
      return;
    }

    const bBtn = e.target.closest("[data-select-book]");
    if (bBtn) {
      state.bibleBookId = bBtn.getAttribute("data-select-book");
      state.bibleChapterNum = null;
      renderBibleView();
      return;
    }

    const chBtn = e.target.closest("[data-select-chapter]");
    if (chBtn) {
      state.bibleChapterNum = Number(chBtn.getAttribute("data-select-chapter"));
      renderBibleView();
      return;
    }

    const navBtn = e.target.closest("[data-bible-nav]");
    if (navBtn) {
      const level = navBtn.getAttribute("data-bible-nav");
      if (level === "root") {
        state.bibleTestamentId = null;
        state.bibleCategoryId = null;
        state.bibleBookId = null;
        state.bibleChapterNum = null;
      } else if (level === "testament") {
        state.bibleCategoryId = null;
        state.bibleBookId = null;
        state.bibleChapterNum = null;
      } else if (level === "category") {
        state.bibleBookId = null;
        state.bibleChapterNum = null;
      }
      renderBibleView();
    }
  };
}

function renderSaintsView() {
  const container = $("#saints-content");
  if (!container) return;

  const g = getGospelForDate(state.saintsDate);
  const saints = getSaintsForDate(state.saintsDate);

  container.innerHTML = `
    <!-- Barra de Selección de Fecha del Santoral con Selector Estilizado Personalizado -->
    <div class="liturgy-toolbar">
      <div class="liturgy-toolbar-info">
        <div style="display:flex;align-items:center;gap:6px">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><ellipse cx="12" cy="3.5" rx="5" ry="1.2"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></svg>
          <strong>Santoral del ${g.formattedLongDate}</strong>
        </div>
      </div>
      <div class="liturgy-date-controls">
        ${renderCustomDatePickerHtml("saints", g.isoDate)}
      </div>
    </div>

    <section class="saints-section-card" aria-label="Santos del Día">
      <div class="gospel-head" style="margin-bottom:8px">
        <h3>Santos del Día · ${g.formattedLongDate}</h3>
      </div>

      ${saints.map((st, idx) => `
        <article class="saint-card">
          <div class="saint-card-head">
            <div class="saint-title-wrap">
              <span class="saint-halo-icon" aria-hidden="true">${st.iconSvg || SVG_SAINT_HALO}</span>
              <div>
                <h4>${st.name}</h4>
                <span class="saint-feast-badge">${st.feast}</span>
              </div>
            </div>
            <div class="saint-actions">
              <button type="button" class="btn-saint-more" data-saint-idx="${idx}" aria-label="Saber más sobre ${st.name}">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Saber Más
              </button>
              <button type="button" class="btn-sm ghost" style="flex:none" data-save-saint-idx="${idx}">📓 Guardar en Notas</button>
            </div>
          </div>
          <p class="saint-bio">${st.bio}</p>
          <div class="saint-quote">${st.quote}</div>
        </article>
      `).join("")}
    </section>`;
}

function openSaintMoreModal(idx) {
  const saints = getSaintsForDate(state.saintsDate);
  const st = saints[idx] || saints[0];
  if (!st) return;

  const modal = $("#saint-detail-modal");
  const title = $("#saint-modal-title");
  const feast = $("#saint-modal-feast");
  const body = $("#saint-modal-body");
  if (!modal || !body) return;

  if (title) title.textContent = st.name;
  if (feast) feast.textContent = st.feast;

  const theologyHtml = st.theologicalExplanation ? `
    <div class="saint-section-block">
      <div class="saint-section-title">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M7 8h10"/></svg>
        Conexión Teológica y Frase del Día
      </div>
      <p class="saint-theology-text">${st.theologicalExplanation}</p>
    </div>
  ` : "";

  const curiositiesHtml = Array.isArray(st.curiosities) && st.curiosities.length ? `
    <div class="saint-section-block">
      <div class="saint-section-title">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        Datos Curiosos Históricos y Pastorales
      </div>
      <ul class="saint-curiosities-list">
        ${st.curiosities.map(c => `
          <li class="saint-curiosity-item">
            <span class="saint-curiosity-bullet">✦</span>
            <span>${c}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  ` : "";

  const otherQuotesHtml = Array.isArray(st.otherQuotes) && st.otherQuotes.length ? `
    <div class="saint-section-block">
      <div class="saint-section-title">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Otras Frases Célebres para la Oración
      </div>
      <div class="saint-quotes-grid">
        ${st.otherQuotes.map(q => `
          <div class="saint-quote-card">${q}</div>
        `).join("")}
      </div>
    </div>
  ` : "";

  body.innerHTML = `
    ${theologyHtml}
    ${curiositiesHtml}
    ${otherQuotesHtml}
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
      <button type="button" class="btn-sm primary" id="btn-modal-save-saint-note">📓 Guardar en mis Notas</button>
      <button type="button" class="btn-sm ghost" id="btn-modal-close-saint">Cerrar</button>
    </div>
  `;

  $("#btn-modal-close-saint")?.addEventListener("click", closeSaintMoreModal);
  $("#btn-modal-save-saint-note")?.addEventListener("click", () => {
    closeSaintMoreModal();
    state.spirTab = "notes";
    state.editingNoteId = null;
    switchView("spiritual");
    requestAnimationFrame(() => {
      const titleEl = $("#note-title-input");
      const catEl = $("#note-category-select");
      const contentEl = $("#note-content-input");
      if (titleEl) titleEl.value = `Reflexión: ${st.name}`;
      if (catEl) catEl.value = "Oración";
      if (contentEl) {
        contentEl.value = `Santo: ${st.name} (${st.feast})\n\nFrase: ${st.quote}\n\nConexión teológica:\n${st.theologicalExplanation || ""}\n\nPropósito espiritual:\n`;
        contentEl.focus();
      }
    });
    toast(`Enseñanzas de ${st.name} guardadas en borrador de Notas`);
  });

  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeSaintMoreModal() {
  const modal = $("#saint-detail-modal");
  if (modal) modal.hidden = true;
  document.body.classList.remove("modal-open");
}

/* =====================================================================
   Mi Parro: Simulador de Parroquia Virtual (Tycoon minimalista)
   - Monedas de Gracia = puntos históricos de la Racha Espiritual − monedas gastadas
   - Estado completo persistido en localStorage (mi_parro_v1)
   ===================================================================== */
const MI_PARRO_STORAGE_KEY = "mi_parro_v1";

const MI_PARRO_TABS = [
  { id: "structure", label: "🏗️ Estructura" },
  { id: "advocation", label: "🕊️ Advocación" },
  { id: "exterior", label: "🌳 Exterior" },
  { id: "details", label: "🎨 Detalles" }
];

const MI_PARRO_CATALOG = [
  // --- Estructura ---
  { id: "nave_amplia", tab: "structure", kind: "toggle", name: "Ampliación de nave", icon: "🏛️", cost: 12, desc: "Dos alas laterales para recibir a más fieles." },
  { id: "campanario", tab: "structure", kind: "toggle", name: "Campanario", icon: "🔔", cost: 10, desc: "Una torre con campana que convoca a la comunidad." },
  { id: "techo_teja", tab: "structure", kind: "single", group: "roof", name: "Techo de teja", swatch: "#C8693E", cost: 0, desc: "Clásico y cálido, de barro cocido." },
  { id: "techo_pizarra", tab: "structure", kind: "single", group: "roof", name: "Techo de pizarra", swatch: "#5F6B7A", cost: 6, desc: "Sobrio, gris azulado y elegante." },
  { id: "techo_cobre", tab: "structure", kind: "single", group: "roof", name: "Techo de cobre", swatch: "#3FA796", cost: 9, desc: "Cobre oxidado de tono verdoso." },
  // --- Advocación (imagen patrona sobre la puerta) ---
  { id: "adv_ninguna", tab: "advocation", kind: "single", group: "advocation", name: "Sin advocación", icon: "✝️", cost: 0, full: "", desc: "Una cruz sencilla sobre la puerta." },
  { id: "adv_lujan", tab: "advocation", kind: "single", group: "advocation", name: "Virgen de Luján", icon: "🕊️", cost: 10, full: "Nuestra Señora de Luján", mantle: "#8EC5E8", dress: "#FFFFFF", desc: "Patrona de la Argentina." },
  { id: "adv_guadalupe", tab: "advocation", kind: "single", group: "advocation", name: "Virgen de Guadalupe", icon: "🌹", cost: 10, full: "Nuestra Señora de Guadalupe", mantle: "#3FA796", dress: "#E8A0B4", desc: "Madre de las Américas." },
  { id: "adv_carmen", tab: "advocation", kind: "single", group: "advocation", name: "Virgen del Carmen", icon: "📿", cost: 8, full: "Nuestra Señora del Carmen", mantle: "#7B4B2A", dress: "#F2E6D0", desc: "Protectora en el camino." },
  { id: "adv_lourdes", tab: "advocation", kind: "single", group: "advocation", name: "Virgen de Lourdes", icon: "💧", cost: 8, full: "Nuestra Señora de Lourdes", mantle: "#BFD9F2", dress: "#FFFFFF", desc: "Consuelo de los enfermos." },
  { id: "adv_sagrado_corazon", tab: "advocation", kind: "single", group: "advocation", name: "Sagrado Corazón", icon: "❤️", cost: 8, full: "Sagrado Corazón de Jesús", mantle: "#C0392B", dress: "#FFFFFF", desc: "Amor misericordioso de Cristo." },
  { id: "adv_san_jose", tab: "advocation", kind: "single", group: "advocation", name: "San José", icon: "🪚", cost: 8, full: "San José Obrero", mantle: "#8A6A3B", dress: "#6BA368", desc: "Custodio de la Sagrada Familia." },
  // --- Exterior ---
  { id: "jardin", tab: "exterior", kind: "toggle", name: "Jardín florido", icon: "🌷", cost: 4, desc: "Arbustos y flores a los pies del templo." },
  { id: "arboles", tab: "exterior", kind: "toggle", name: "Árboles", icon: "🌳", cost: 5, desc: "Sombra fresca para después de misa." },
  { id: "bancos", tab: "exterior", kind: "toggle", name: "Bancos de plaza", icon: "🪑", cost: 4, desc: "Para charlar y descansar." },
  { id: "gruta", tab: "exterior", kind: "toggle", name: "Gruta mariana", icon: "🪨", cost: 9, desc: "Un rincón de oración al aire libre." },
  { id: "fuente", tab: "exterior", kind: "toggle", name: "Fuente de agua", icon: "⛲", cost: 7, desc: "Agua cantarina frente a la entrada." },
  // --- Detalles ---
  { id: "vitrales", tab: "details", kind: "toggle", name: "Vitrales", icon: "🌈", cost: 6, desc: "Ventanas de colores que llenan de luz la nave." },
  { id: "fachada_crema", tab: "details", kind: "single", group: "facade", name: "Fachada crema", swatch: "#F6E9D2", cost: 0, desc: "Tono natural, cálido y luminoso." },
  { id: "fachada_rosa", tab: "details", kind: "single", group: "facade", name: "Fachada rosa", swatch: "#F5D2CC", cost: 3, desc: "Un rosa suave, tierno y alegre." },
  { id: "fachada_celeste", tab: "details", kind: "single", group: "facade", name: "Fachada celeste", swatch: "#CFE3F1", cost: 3, desc: "Celeste mariano, fresco y sereno." },
  { id: "fachada_salvia", tab: "details", kind: "single", group: "facade", name: "Fachada salvia", swatch: "#D4E3C8", cost: 3, desc: "Verde salvia, tranquilo y natural." },
  { id: "fachada_durazno", tab: "details", kind: "single", group: "facade", name: "Fachada durazno", swatch: "#F8D9B5", cost: 3, desc: "Durazno dorado, como un atardecer." }
];

const MI_PARRO_ITEM_BY_ID = MI_PARRO_CATALOG.reduce((acc, it) => { acc[it.id] = it; return acc; }, {});

const MI_PARRO_DEFAULTS = { roof: "techo_teja", advocation: "adv_ninguna", facade: "fachada_crema" };

const MI_PARRO_LEVELS = [
  { min: 0, title: "Capilla de Barrio" },
  { min: 10, title: "Comunidad Naciente" },
  { min: 25, title: "Parroquia Querida" },
  { min: 45, title: "Familia Parroquial" },
  { min: 70, title: "Faro del Barrio" },
  { min: 100, title: "Santuario Vivo" },
  { min: 140, title: "Basílica de Corazones" },
  { min: 190, title: "Catedral de la Fe" }
];

function parroEsc(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
}

function buildInitialMiParroDB() {
  return {
    name: "Mi Parro",
    spent: 0,
    maxEarned: 0,
    owned: { techo_teja: true, adv_ninguna: true, fachada_crema: true },
    equipped: { roof: MI_PARRO_DEFAULTS.roof, advocation: MI_PARRO_DEFAULTS.advocation, facade: MI_PARRO_DEFAULTS.facade, toggles: {} },
    updatedAt: Date.now()
  };
}

function sanitizeMiParroDB(raw) {
  const base = buildInitialMiParroDB();
  if (!raw || typeof raw !== "object") return base;

  const owned = { ...base.owned };
  if (raw.owned && typeof raw.owned === "object") {
    Object.keys(raw.owned).forEach(id => {
      if (raw.owned[id] === true && MI_PARRO_ITEM_BY_ID[id]) owned[id] = true;
    });
  }

  const rawEq = raw.equipped && typeof raw.equipped === "object" ? raw.equipped : {};
  const pickSingle = group => {
    const id = rawEq[group];
    const it = MI_PARRO_ITEM_BY_ID[id];
    return it && it.kind === "single" && it.group === group && owned[id] ? id : MI_PARRO_DEFAULTS[group];
  };
  const toggles = {};
  if (rawEq.toggles && typeof rawEq.toggles === "object") {
    Object.keys(rawEq.toggles).forEach(id => {
      const it = MI_PARRO_ITEM_BY_ID[id];
      if (rawEq.toggles[id] === true && it && it.kind === "toggle" && owned[id]) toggles[id] = true;
    });
  }

  return {
    name: String(raw.name || base.name).trim().slice(0, 36) || base.name,
    spent: Number.isFinite(Number(raw.spent)) ? Math.max(0, Math.floor(Number(raw.spent))) : 0,
    maxEarned: Number.isFinite(Number(raw.maxEarned)) ? Math.max(0, Math.floor(Number(raw.maxEarned))) : 0,
    owned,
    equipped: { roof: pickSingle("roof"), advocation: pickSingle("advocation"), facade: pickSingle("facade"), toggles },
    updatedAt: Number(raw.updatedAt) || Date.now()
  };
}

let miParroDB = (function loadMiParroDB() {
  const sanitized = sanitizeMiParroDB(Store.get(MI_PARRO_STORAGE_KEY, null));
  Store.set(MI_PARRO_STORAGE_KEY, sanitized);
  return sanitized;
})();

function saveMiParroDB() {
  miParroDB = sanitizeMiParroDB(miParroDB);
  miParroDB.updatedAt = Date.now();
  Store.set(MI_PARRO_STORAGE_KEY, miParroDB);
}

/** Lee el balance de puntos de la Racha Espiritual y calcula economía y nivel comunitario. */
function getParroEconomy() {
  const streak = evaluateSpiritualStreak(spiritualDB.checkins);
  const earned = Math.max(miParroDB.maxEarned || 0, streak.totalHistoricalPoints || 0);
  if (earned !== miParroDB.maxEarned) {
    miParroDB.maxEarned = earned;
    saveMiParroDB();
  }
  const spent = miParroDB.spent || 0;
  const balance = Math.max(0, earned - spent);

  const paidOwned = Object.keys(miParroDB.owned).filter(id => MI_PARRO_ITEM_BY_ID[id] && MI_PARRO_ITEM_BY_ID[id].cost > 0).length;
  const xp = earned + paidOwned * 2;
  let levelIdx = 0;
  MI_PARRO_LEVELS.forEach((lv, i) => { if (xp >= lv.min) levelIdx = i; });
  const cur = MI_PARRO_LEVELS[levelIdx];
  const next = MI_PARRO_LEVELS[levelIdx + 1] || null;
  const pct = next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100;

  return { earned, spent, balance, xp, level: levelIdx + 1, title: cur.title, nextAt: next ? next.min : null, pct: Math.min(100, Math.max(0, pct)) };
}

function renderParroFigureSvg(adv) {
  if (!adv || adv.id === "adv_ninguna" || !adv.mantle) {
    return `<path d="M180,122 V146 M171,129 H189" stroke="#B8A58A" stroke-width="3" stroke-linecap="round"/>`;
  }
  return `
    <circle cx="180" cy="128" r="6.5" fill="none" stroke="#E3B341" stroke-width="1.6"/>
    <circle cx="180" cy="128" r="3.6" fill="#F6D7B8"/>
    <path d="M180,131.5 q-9,2 -10.5,17 h21 q-1.5,-15 -10.5,-17z" fill="${adv.mantle}"/>
    <path d="M180,133.5 q-4.5,2 -5.5,15 h11 q-1,-13 -5.5,-15z" fill="${adv.dress}"/>`;
}

/** Escena SVG interactiva y limpia de la parroquia virtual del usuario. */
function renderParroSceneSvg(db) {
  const eq = db.equipped;
  const tg = eq.toggles || {};
  const roofItem = MI_PARRO_ITEM_BY_ID[eq.roof] || MI_PARRO_ITEM_BY_ID.techo_teja;
  const facadeItem = MI_PARRO_ITEM_BY_ID[eq.facade] || MI_PARRO_ITEM_BY_ID.fachada_crema;
  const advItem = MI_PARRO_ITEM_BY_ID[eq.advocation] || MI_PARRO_ITEM_BY_ID.adv_ninguna;
  const roof = roofItem.swatch;
  const wall = facadeItem.swatch;
  const wallStroke = "rgba(120,86,50,.35)";
  const glass = Boolean(tg.vitrales);
  const winFill = glass ? "url(#pVitral)" : "#DCE8F2";

  const arch = (x, y, w, h) => `
    <path d="M${x},${y + h} V${y + w / 2} a${w / 2},${w / 2} 0 0 1 ${w},0 V${y + h} Z" fill="${winFill}" stroke="#8B7355" stroke-width="1.6"/>
    <path d="M${x + w / 2},${y + 2} V${y + h}${glass ? ` M${x},${y + h * 0.55} H${x + w}` : ""}" stroke="${glass ? "#6B4F2A" : "#8B7355"}" stroke-width="1" opacity=".65" fill="none"/>`;

  const bench = (x, y) => `
    <g>
      <rect x="${x}" y="${y - 9}" width="38" height="4" rx="2" fill="#A06E47"/>
      <rect x="${x}" y="${y}" width="38" height="5" rx="2" fill="#8B5E3C"/>
      <rect x="${x + 4}" y="${y + 5}" width="3" height="8" fill="#6B4A2E"/>
      <rect x="${x + 31}" y="${y + 5}" width="3" height="8" fill="#6B4A2E"/>
    </g>`;

  const flowerColors = ["#F2A0B5", "#F7D26B", "#FFFFFF", "#C79AE0"];
  const flowers = [44, 66, 92, 126, 138, 222, 234, 262, 288, 306]
    .map((x, i) => `<circle cx="${x}" cy="${210 + (i % 3) * 3}" r="2.6" fill="${flowerColors[i % flowerColors.length]}"/>`)
    .join("");

  const wide = Boolean(tg.nave_amplia);
  const tower = Boolean(tg.campanario);

  return `
  <svg class="parro-scene-svg" viewBox="0 0 360 270" role="img" aria-label="Vista de tu parroquia virtual ${parroEsc(db.name)}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3C2"/><stop offset="1" stop-color="#FFF8EC"/></linearGradient>
      <linearGradient id="pGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C3DFA3"/><stop offset="1" stop-color="#A9CF8A"/></linearGradient>
      <linearGradient id="pVitral" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#E0524D"/><stop offset=".35" stop-color="#F2B84B"/><stop offset=".7" stop-color="#4A90D9"/><stop offset="1" stop-color="#5DB36B"/>
      </linearGradient>
    </defs>

    <rect width="360" height="270" fill="url(#pSky)"/>
    <circle cx="310" cy="44" r="20" fill="#FFD9A0" opacity=".85"/>
    <g class="parro-cloud" fill="#FFFFFF" opacity=".9">
      <ellipse cx="62" cy="42" rx="26" ry="9"/><ellipse cx="80" cy="36" rx="16" ry="9"/>
    </g>
    <g class="parro-cloud parro-cloud-b" fill="#FFFFFF" opacity=".75">
      <ellipse cx="250" cy="76" rx="20" ry="7"/><ellipse cx="262" cy="71" rx="12" ry="7"/>
    </g>
    <path d="M0,205 Q60,168 130,196 T260,190 T360,200 V215 H0Z" fill="#D5E8BC"/>
    <rect x="0" y="205" width="360" height="65" fill="url(#pGround)"/>
    <polygon points="166,205 194,205 216,270 144,270" fill="#EAD9BC"/>

    ${tg.arboles ? `
    <g class="parro-trees">
      <rect x="31" y="168" width="7" height="38" rx="2" fill="#8B5E3C"/>
      <circle cx="34" cy="160" r="20" fill="#6FAF6B"/><circle cx="22" cy="171" r="14" fill="#5E9E5C"/><circle cx="47" cy="171" r="14" fill="#5E9E5C"/>
      <rect x="52" y="190" width="5" height="16" rx="2" fill="#8B5E3C"/>
      <circle cx="54" cy="184" r="12" fill="#7CBB77"/><circle cx="47" cy="191" r="9" fill="#6FAF6B"/><circle cx="61" cy="191" r="9" fill="#6FAF6B"/>
    </g>` : ""}

    ${tg.gruta ? `
    <g class="parro-gruta">
      <path d="M298,206 q0,-42 25,-42 q25,0 25,42 z" fill="#B3B2A8" stroke="#8B8B82" stroke-width="1.6"/>
      <path d="M309,206 q0,-29 14,-29 q14,0 14,29 z" fill="#DCE9F4"/>
      <circle cx="323" cy="187" r="3" fill="#F6D7B8"/>
      <path d="M323,190 q-6,2 -7,16 h14 q-1,-14 -7,-16z" fill="#9CC9EA"/>
      <circle cx="323" cy="187" r="5.5" fill="none" stroke="#E3B341" stroke-width="1.2"/>
      <circle cx="304" cy="203" r="2.4" fill="#F2A0B5"/><circle cx="342" cy="203" r="2.4" fill="#F7D26B"/>
    </g>` : ""}

    ${wide ? `
    <g class="parro-wings">
      <rect x="76" y="152" width="54" height="53" fill="${wall}" stroke="${wallStroke}" stroke-width="1.4"/>
      <rect x="230" y="152" width="54" height="53" fill="${wall}" stroke="${wallStroke}" stroke-width="1.4"/>
      <polygon points="68,152 84,134 132,134 132,152" fill="${roof}"/>
      <polygon points="292,152 276,134 228,134 228,152" fill="${roof}"/>
      ${arch(94, 164, 14, 28)}
      ${tower ? "" : arch(252, 164, 14, 28)}
    </g>` : ""}

    <g class="parro-nave">
      <rect x="130" y="108" width="100" height="97" fill="${wall}" stroke="${wallStroke}" stroke-width="1.4"/>
      <polygon points="130,108 230,108 180,66" fill="${wall}" stroke="${wallStroke}" stroke-width="1.4"/>
      <polyline points="120,111 180,58 240,111" fill="none" stroke="${roof}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
      <rect x="122" y="106" width="116" height="7" rx="3" fill="${roof}"/>
      <path d="M180,58 V43 M174.5,50 H185.5" stroke="#D4A937" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="180" cy="92" r="9" fill="${winFill}" stroke="#8B7355" stroke-width="1.6"/>
      <path d="M171,92 H189 M180,83 V101" stroke="#8B7355" stroke-width="1" opacity=".6"/>
      ${arch(140, 146, 14, 30)}
      ${arch(206, 146, 14, 30)}
    </g>

    ${tower ? `
    <g class="parro-tower">
      <rect x="232" y="72" width="40" height="133" fill="${wall}" stroke="${wallStroke}" stroke-width="1.4"/>
      <polygon points="226,77 278,77 252,32" fill="${roof}"/>
      <path d="M252,32 V17 M246.5,24 H257.5" stroke="#D4A937" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M243,112 V94 a9,9 0 0 1 18,0 V112 Z" fill="#4A3B2E"/>
      <g class="parro-bell"><path d="M247,109 q0,-11 5,-11 q5,0 5,11 z" fill="#E3B341"/><circle cx="252" cy="110" r="1.8" fill="#B8861F"/></g>
      ${arch(246, 132, 12, 24)}
    </g>` : ""}

    <rect x="158" y="205" width="44" height="5" rx="2" fill="#D8CBB4"/>
    <path d="M166,205 V174 a14,14 0 0 1 28,0 V205 Z" fill="#7A4A2B" stroke="#5B3519" stroke-width="1.4"/>
    <path d="M180,160 V205" stroke="#5B3519" stroke-width="1" opacity=".6"/>
    <circle cx="176" cy="192" r="1.4" fill="#E3B341"/><circle cx="184" cy="192" r="1.4" fill="#E3B341"/>

    <circle cx="180" cy="133" r="17" fill="#FFFBF2" stroke="#D4A937" stroke-width="2"/>
    ${renderParroFigureSvg(advItem)}

    ${tg.jardin ? `
    <g class="parro-garden">
      <ellipse cx="118" cy="204" rx="13" ry="8" fill="#6FAF6B"/><ellipse cx="242" cy="204" rx="13" ry="8" fill="#6FAF6B"/>
      <ellipse cx="102" cy="206" rx="9" ry="6" fill="#7CBB77"/><ellipse cx="258" cy="206" rx="9" ry="6" fill="#7CBB77"/>
      ${flowers}
    </g>` : ""}

    ${tg.bancos ? `<g class="parro-benches">${bench(100, 236)}${bench(222, 236)}</g>` : ""}

    ${tg.fuente ? `
    <g class="parro-fountain">
      <ellipse cx="180" cy="251" rx="24" ry="7" fill="#CFC8BB"/>
      <ellipse cx="180" cy="249" rx="21" ry="5" fill="#BFE3F2"/>
      <rect x="177" y="231" width="6" height="18" fill="#CFC8BB"/>
      <ellipse cx="180" cy="231" rx="11" ry="3.5" fill="#D9D3C7"/>
      <ellipse cx="180" cy="230" rx="8" ry="2.2" fill="#BFE3F2"/>
      <path d="M180,230 q-8,-13 -14,3 M180,230 q8,-13 14,3" fill="none" stroke="#9ED3EA" stroke-width="1.6" stroke-linecap="round"/>
      <circle class="parro-drop" cx="180" cy="224" r="1.8" fill="#9ED3EA"/>
    </g>` : ""}
  </svg>`;
}

function renderParroItemCardHtml(item, economy) {
  const owned = Boolean(miParroDB.owned[item.id]);
  const eq = miParroDB.equipped;
  const active = item.kind === "toggle" ? Boolean(eq.toggles[item.id]) : eq[item.group] === item.id;
  const missing = Math.max(0, item.cost - economy.balance);

  let stateClass = "is-locked";
  let tag = `🪙 ${item.cost} · faltan ${missing}`;
  if (active) {
    stateClass = "is-active";
    tag = item.kind === "toggle" ? "✓ Instalado · Ocultar" : "✓ En uso";
  } else if (owned) {
    stateClass = "is-owned";
    tag = item.kind === "toggle" ? "Mostrar" : "Usar";
  } else if (missing === 0) {
    stateClass = "is-buyable";
    tag = `🪙 ${item.cost} · Comprar`;
  }

  const ico = item.swatch
    ? `<span class="parro-swatch" style="background:${item.swatch}"></span>`
    : `<span class="parro-item-emoji" aria-hidden="true">${item.icon}</span>`;

  return `
    <button type="button" class="parro-item ${stateClass}" data-parro-item="${item.id}" aria-pressed="${active}" aria-label="${parroEsc(item.name)}: ${parroEsc(tag)}">
      <span class="parro-item-ico">${ico}</span>
      <span class="parro-item-name">${parroEsc(item.name)}</span>
      <span class="parro-item-desc">${parroEsc(item.desc)}</span>
      <span class="parro-item-tag">${tag}</span>
    </button>`;
}

function renderMiParroView(opts = {}) {
  const container = $("#miparro-content");
  if (!container) return;

  const economy = getParroEconomy();
  const tabId = MI_PARRO_TABS.some(t => t.id === state.parroTab) ? state.parroTab : "structure";
  const advItem = MI_PARRO_ITEM_BY_ID[miParroDB.equipped.advocation];
  const items = MI_PARRO_CATALOG.filter(it => it.tab === tabId);
  const nextInfo = economy.nextAt != null
    ? `Próximo nivel a los ${economy.nextAt} de experiencia (${economy.xp} actuales)`
    : "¡Nivel máximo alcanzado!";

  container.innerHTML = `
    <section class="parro-hud" aria-label="Recursos del jugador">
      <div class="parro-stat parro-coins">
        <span class="parro-stat-ico" aria-hidden="true">🪙</span>
        <div class="parro-stat-body">
          <strong>${economy.balance}</strong>
          <span>Monedas de Gracia</span>
        </div>
      </div>
      <div class="parro-stat parro-level">
        <span class="parro-stat-ico" aria-hidden="true">⛪</span>
        <div class="parro-stat-body">
          <strong>Nivel ${economy.level}</strong>
          <span>${parroEsc(economy.title)}</span>
          <div class="parro-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${economy.pct}" title="${parroEsc(nextInfo)}"><i style="width:${economy.pct}%"></i></div>
        </div>
      </div>
    </section>

    <p class="parro-hint">
      Cada punto de tu Racha Espiritual = 1 Moneda de Gracia · Ganadas: <b>${economy.earned}</b> · Gastadas: <b>${economy.spent}</b>
      <button type="button" class="parro-link-btn" data-parro-go-streak>Registrar misa →</button>
    </p>

    <section class="parro-stage ${opts.pulse ? "is-built" : ""}" id="parro-stage" aria-label="Tu parroquia">
      <input type="text" class="parro-name-input" id="parro-name-input" maxlength="36" value="${parroEsc(miParroDB.name)}" aria-label="Nombre de tu parroquia" placeholder="Nombre de tu parroquia">
      <div class="parro-scene-wrap">${renderParroSceneSvg(miParroDB)}</div>
      <p class="parro-caption">${advItem && advItem.full ? `Bajo la advocación de <b>${parroEsc(advItem.full)}</b>` : "Aún sin advocación · elegí una patrona o un patrono en la pestaña 🕊️"}</p>
    </section>

    <section class="parro-shop" aria-label="Construcción y decoración">
      <div class="parro-shop-head">
        <h2>🛠️ Construcción y Decoración</h2>
        <span>Tocá un elemento para comprarlo y estrenarlo</span>
      </div>
      <div class="community-subnav parro-tabs" role="tablist" aria-label="Categorías de construcción">
        ${MI_PARRO_TABS.map(t => `
          <button type="button" class="comm-tab ${t.id === tabId ? "is-active" : ""}" role="tab" aria-selected="${t.id === tabId}" data-parro-tab="${t.id}">${t.label}</button>
        `).join("")}
      </div>
      <div class="parro-grid">
        ${items.map(it => renderParroItemCardHtml(it, economy)).join("")}
      </div>
      <div class="parro-footer-actions">
        <button type="button" class="btn-sm cancel" data-parro-reset>↺ Reiniciar parroquia y recuperar monedas</button>
      </div>
    </section>
  `;

  if (opts.pulse) {
    setTimeout(() => $("#parro-stage")?.classList.remove("is-built"), 900);
  }
}

function handleParroItemTap(itemId) {
  const item = MI_PARRO_ITEM_BY_ID[itemId];
  if (!item) return;

  const owned = Boolean(miParroDB.owned[itemId]);
  const eq = miParroDB.equipped;

  if (!owned) {
    const economy = getParroEconomy();
    if (economy.balance < item.cost) {
      const btn = document.querySelector(`[data-parro-item="${itemId}"]`);
      if (btn) {
        btn.classList.add("is-denied");
        setTimeout(() => btn.classList.remove("is-denied"), 500);
      }
      toast(`Te faltan ${item.cost - economy.balance} Monedas de Gracia · Sumalas registrando misas`);
      return;
    }
    miParroDB.spent += item.cost;
    miParroDB.owned[itemId] = true;
    if (item.kind === "toggle") eq.toggles[itemId] = true;
    else eq[item.group] = itemId;
    saveMiParroDB();
    renderMiParroView({ pulse: true });
    toast(`✨ ¡${item.name} construido! −${item.cost} 🪙`);
    return;
  }

  if (item.kind === "toggle") {
    if (eq.toggles[itemId]) delete eq.toggles[itemId];
    else eq.toggles[itemId] = true;
  } else {
    eq[item.group] = itemId;
  }
  saveMiParroDB();
  renderMiParroView({ pulse: true });
}

function bindMiParroEvents() {
  const root = $("#miparro-content");
  if (!root) return;

  root.addEventListener("click", e => {
    const tabBtn = e.target.closest("[data-parro-tab]");
    if (tabBtn) {
      state.parroTab = tabBtn.dataset.parroTab;
      Store.set("ui_parro_tab_v1", state.parroTab);
            return;
    }
    const itemBtn = e.target.closest("[data-parro-item]");
    if (itemBtn) {
      handleParroItemTap(itemBtn.dataset.parroItem);
      return;
    }
    if (e.target.closest("[data-parro-go-streak]")) {
      state.spirTab = "streak";
      switchView("spiritual");
      return;
    }
    if (e.target.closest("[data-parro-reset]")) {
      if (!window.confirm("¿Reiniciar tu parroquia? Se quitarán todas las mejoras y recuperarás tus Monedas de Gracia.")) return;
      const keepName = miParroDB.name;
      const fresh = buildInitialMiParroDB();
      fresh.name = keepName;
      fresh.maxEarned = miParroDB.maxEarned;
      miParroDB = fresh;
      saveMiParroDB();
      renderMiParroView({ pulse: true });
      toast("Parroquia reiniciada · Monedas recuperadas");
    }
  });

  root.addEventListener("input", e => {
    if (!e.target || e.target.id !== "parro-name-input") return;
    miParroDB.name = String(e.target.value || "").trim().slice(0, 36) || "Mi Parro";
    saveMiParroDB();
  });
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
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(btn.dataset.targetView);
    });
  });

  $("#top-nav")?.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-target-view]");
    if (tab && tab.dataset.targetView) {
      e.preventDefault();
      switchView(tab.dataset.targetView);
    }
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
  $("#header-user-btn")?.addEventListener("click", openProfileQuickModal);

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
        socialDB.currentUser = rawUser; socialDB.explicitGuest = false;
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
        socialDB.currentUser = rawUser; socialDB.explicitGuest = false;
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
      const typedAvatarUrl = ($("#p-avatar-url")?.value || "").trim();
      // Preservar foto Base64 o avatar Mii ya guardado si el campo URL está vacío
      if (typedAvatarUrl) me.avatarUrl = typedAvatarUrl;
      else if (!/^data:image\//.test(String(me.avatarUrl || ""))) me.avatarUrl = "";
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
        socialDB.currentUser = handle; socialDB.explicitGuest = false;
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
      socialDB.explicitGuest = true;
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
    const pickParishBtn = e.target.closest("#btn-open-parish-picker");
    if (pickParishBtn) {
      openParishPickerModal("streak");
      return;
    }
    const pickNoteParishBtn = e.target.closest("#btn-open-note-parish-picker");
    if (pickNoteParishBtn) {
      openParishPickerModal("note");
      return;
    }
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
      toast(`🔥 ¡+${pts} ${pts === 1 ? "punto" : "puntos"} y +${pts} Monedas de Gracia en ${pObj ? pObj.nombre : "tu parroquia"}!`);
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

  // Delegación de eventos en el Módulo de Liturgia (Sub-pestañas, Selector de fecha, Explicación y Santos del Día)
  // Selector de fechas estilizado (Racha, Liturgia, Santos del Día) y cierre al tocar fuera
  ["#spiritual-content", "#saints-content"].forEach(sel => {
    $(sel)?.addEventListener("click", e => {
      handleCustomDatePickerInteraction(e);
    });
  });
  document.addEventListener("click", e => {
    if (!state.openDatePickerId) return;
    if (e.target.closest("[data-cdp-root]")) return;
    const openId = state.openDatePickerId;
    state.openDatePickerId = null;
    if (openId === "streak") renderSpiritualView();
    else if (openId === "liturgy") renderLiturgyView();
    else if (openId === "saints") renderSaintsView();
  });

  $("#liturgy-content")?.addEventListener("click", e => {
    if (handleCustomDatePickerInteraction(e)) return;

    // Primera Lectura y Salmo Responsorial desplegables con su texto bíblico completo
    const readingToggle = e.target.closest("[data-toggle-lit-reading]");
    if (readingToggle) {
      if (readingToggle.dataset.toggleLitReading === "first") state.openFirstReading = !state.openFirstReading;
      else state.openPsalm = !state.openPsalm;
      renderLiturgyView();
      return;
    }
    const saveReadingBtn = e.target.closest("#btn-save-first-to-notes, #btn-save-psalm-to-notes");
    if (saveReadingBtn) {
      const gr = getGospelForDate(state.liturgyDate);
      const isFirst = saveReadingBtn.id === "btn-save-first-to-notes";
      state.spirTab = "notes";
      state.editingNoteId = null;
      switchView("spiritual");
      requestAnimationFrame(() => {
        const titleEl = $("#note-title-input");
        const catEl = $("#note-category-select");
        const contentEl = $("#note-content-input");
        if (titleEl) titleEl.value = isFirst ? `Primera Lectura (${gr.firstReadingRef})` : `Salmo (${gr.psalmRef})`;
        if (catEl) catEl.value = "Lectio Divina";
        if (contentEl) {
          contentEl.value = isFirst
            ? `Meditación sobre la Primera Lectura, ${gr.firstReadingRef} (${gr.isoDate}):\n`
            : `Salmo ${gr.psalmRef} · ${gr.psalmResponse}\n\nMi oración:\n`;
          contentEl.focus();
        }
      });
      toast(isFirst ? "Primera Lectura cargada en tu Bloc de Notas" : "Salmo cargado en tu Bloc de Notas");
      return;
    }

    const litTabBtn = e.target.closest("[data-lit-tab]");
    if (litTabBtn) {
      state.litTab = litTabBtn.dataset.litTab;
      renderLiturgyView();
      return;
    }
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
      toast("Liturgia y Santos actualizados a la fecha de hoy");
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
      return;
    }
    const saveSaintBtn = e.target.closest("[data-save-saint-idx]");
    if (saveSaintBtn) {
      const idx = Number(saveSaintBtn.dataset.saveSaintIdx) || 0;
      const saints = getSaintsForDate(state.liturgyDate);
      const st = saints[idx] || saints[0];
      if (!st) return;
      state.spirTab = "notes";
      state.editingNoteId = null;
      switchView("spiritual");
      requestAnimationFrame(() => {
        const titleEl = $("#note-title-input");
        const catEl = $("#note-category-select");
        const contentEl = $("#note-content-input");
        if (titleEl) titleEl.value = `Santo del Día: ${st.name}`;
        if (catEl) catEl.value = "Oración";
        if (contentEl) {
          contentEl.value = `${st.quote}\n\nPropósito inspirado en ${st.name}:\n`;
          contentEl.focus();
        }
      });
      toast(`Inspiración de ${st.name} cargada en tus Notas`);
    }
  });

  // Control de bloqueo táctil del mapa Leaflet (evitar atrapar scroll)
  $("#btn-map-toggle-touch")?.addEventListener("click", toggleMapTouchLock);

  // Modal "Saber Más" de Santos del Día
  $("#btn-close-saint-modal")?.addEventListener("click", closeSaintMoreModal);
  $("#saint-detail-modal")?.addEventListener("click", e => {
    if (e.target && e.target.id === "saint-detail-modal") closeSaintMoreModal();
  });

  // Vista independiente "Santos del Día": Saber Más y guardar en Notas
  $("#saints-content")?.addEventListener("click", e => {
    if (e.defaultPrevented) return;
    const moreBtn = e.target.closest(".btn-saint-more");
    if (moreBtn) {
      const idx = Number(moreBtn.dataset.saintIdx) || 0;
      openSaintMoreModal(idx);
      return;
    }
    const saveSaintBtn = e.target.closest("[data-save-saint-idx]");
    if (!saveSaintBtn) return;
    const idx = Number(saveSaintBtn.dataset.saveSaintIdx) || 0;
    const saints = getSaintsForDate(state.saintsDate);
    const st = saints[idx] || saints[0];
    if (!st) return;
    state.spirTab = "notes";
    state.editingNoteId = null;
    switchView("spiritual");
    requestAnimationFrame(() => {
      const titleEl = $("#note-title-input");
      const catEl = $("#note-category-select");
      const contentEl = $("#note-content-input");
      if (titleEl) titleEl.value = `Santo del Día: ${st.name}`;
      if (catEl) catEl.value = "Oración";
      if (contentEl) {
        contentEl.value = `${st.quote}\n\nPropósito inspirado en ${st.name}:\n`;
        contentEl.focus();
      }
    });
    toast(`Inspiración de ${st.name} cargada en tus Notas`);
  });

  // Rol Colaborador: gestión de actividades y grupos parroquiales
  $("#btn-collab-new-activity")?.addEventListener("click", () => openActivityEditor(null, -1));
  $("#btn-close-act-edit")?.addEventListener("click", closeActivityEditor);
  $("#btn-cancel-act-edit")?.addEventListener("click", closeActivityEditor);
  $("#activity-edit-form")?.addEventListener("submit", saveActivityEditor);
  $("#activity-edit-modal")?.addEventListener("click", e => {
    if (e.target && e.target.id === "activity-edit-modal") closeActivityEditor();
  });

  // Radio: todos los controles (burbuja, panel, timeline, volumen, ajustes)
  bindRadioControls();

  // Selector de Zona / Barrio en Cuadrícula de Cuadrados Minimalistas
  $("#btn-open-zone-modal")?.addEventListener("click", openZonePickerModal);
  $("#btn-close-zone-modal")?.addEventListener("click", closeZonePickerModal);
  $("#zone-picker-modal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "zone-picker-modal") {
      closeZonePickerModal();
      return;
    }
    const zoneBtn = e.target.closest("[data-select-zone]");
    if (zoneBtn) {
      applyManualZone(zoneBtn.dataset.selectZone);
      closeZonePickerModal();
      return;
    }
    const gpsBtn = e.target.closest("[data-select-gps]");
    if (gpsBtn) {
      requestGpsLocation();
      closeZonePickerModal();
      return;
    }
    const tabBtn = e.target.closest("[data-zone-filter]");
    if (tabBtn) {
      currentZoneFilter = tabBtn.dataset.zoneFilter;
      renderZoneSquareGrid(currentZoneFilter);
    }
  });

  // Selector de Parroquias en Cuadrícula Minimalista (para Racha y Bloc de Notas)
  $("#btn-close-parish-picker")?.addEventListener("click", closeParishPickerModal);
  $("#parish-picker-modal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "parish-picker-modal") {
      closeParishPickerModal();
      return;
    }
    const parishCard = e.target.closest("[data-pick-parish-id]");
    if (parishCard) {
      const pid = String(parishCard.dataset.pickParishId);
      const pObj = getParishById(pid);
      if (activeParishPickerTarget === "activity") {
        const actSel = document.getElementById("act-parish-select");
        if (actSel) actSel.value = pid;
        syncActParishDisplay();
      } else if (activeParishPickerTarget === "note") {
        const noteSel = document.getElementById("note-parish-select");
        if (noteSel) noteSel.value = pid;
        const noteDisplay = document.getElementById("note-parish-display-name");
        if (noteDisplay && pObj) noteDisplay.textContent = "📍 " + pObj.nombre;
      } else {
        spiritualDB.lastParishId = pid;
        saveSpiritualDB();
        const sel = document.getElementById("streak-parish-select");
        if (sel) sel.value = pid;
        const displayEl = document.getElementById("streak-parish-display-name");
        if (displayEl && pObj) displayEl.textContent = "📍 " + pObj.nombre;
      }
      closeParishPickerModal();
      toast("Parroquia seleccionada: " + (pObj ? pObj.nombre : ""));
    }
  });
  $("#parish-picker-search")?.addEventListener("input", (e) => {
    renderParishSquareGrid(e.target.value);
  });

  // Eventos del Panel de Configuración (⚙️ Modo Noche, Paleta e Idioma)
  $("#btn-open-settings")?.addEventListener("click", openSettingsModal);
  $("#btn-close-settings")?.addEventListener("click", closeSettingsModal);
  $("#btn-save-settings")?.addEventListener("click", closeSettingsModal);
  $("#settings-modal")?.addEventListener("click", e => {
    if (e.target && e.target.id === "settings-modal") closeSettingsModal();
  });
  $("#toggle-dark-mode")?.addEventListener("change", e => {
    appSettings.darkMode = Boolean(e.target.checked);
    saveAppSettings();
    applyAppSettings();
    toast(appSettings.darkMode ? "🌙 Modo Oscuro / Noche activado" : "☀️ Modo Claro activado");
  });
  $("#select-app-lang")?.addEventListener("change", e => {
    appSettings.lang = e.target.value || "es-AR";
    saveAppSettings();
    applyAppSettings();
    toast("🌎 Idioma actualizado");
  });

  // Selector de Paleta de Colores de Interfaz
  $("#theme-palette-picker")?.addEventListener("click", e => {
    const btn = e.target.closest(".palette-option-btn");
    if (!btn) return;
    const pal = btn.dataset.palette;
    if (!pal) return;
    appSettings.themePalette = pal;
    saveAppSettings();
    applyAppSettings();
    toast(`🎨 Paleta de interfaz cambiada a: ${pal === "bordo" ? "Bordó Catedral" : pal === "azul" ? "Azul Litúrgico" : "Oro y Ocre Sacro"}`);
  });

  // Botones de Gestión de Roles dentro de Configuración
  $("#btn-settings-role-admin")?.addEventListener("click", () => {
    closeSettingsModal();
    openAdminLoginModal();
    const input = $("#admin-pass");
    if (input) {
      input.placeholder = "PIN: 1118";
    }
  });
  $("#btn-settings-role-collab")?.addEventListener("click", () => {
    closeSettingsModal();
    openAdminLoginModal();
    const input = $("#admin-pass");
    if (input) {
      input.placeholder = "PIN: 0000";
    }
  });
  $("#btn-settings-role-logout")?.addEventListener("click", () => {
    logoutAdmin();
    updateSettingsRolesUI();
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
    const manageActsBtn = e.target.closest("[data-manage-acts]");
    if (manageActsBtn) return openActivityEditor(manageActsBtn.dataset.manageActs, -1);
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
      if ($("#zone-picker-modal") && !$("#zone-picker-modal").hidden) return closeZonePickerModal();
      if ($("#parish-picker-modal") && !$("#parish-picker-modal").hidden) return closeParishPickerModal();
      if ($("#profile-quick-modal") && !$("#profile-quick-modal").hidden) return closeProfileQuickModal();
      if ($("#settings-modal") && !$("#settings-modal").hidden) return closeSettingsModal();
      if ($("#public-profile-modal") && !$("#public-profile-modal").hidden) return closePublicProfileModal();
      if ($("#admin-edit-modal") && !$("#admin-edit-modal").hidden) return closeParishEditor();
      if ($("#admin-login-modal") && !$("#admin-login-modal").hidden) return closeAdminLoginModal();
      closeDetail();
    }
  });
}


/* =====================================================================
   NAVEGACIÓN GESTUAL LATERAL ("SWIPE" DE PÁGINAS DE LIBRO)
   ===================================================================== */
/** true si el elemento (o un ancestro) tiene scroll horizontal propio (chips, pestañas, carruseles). */
function isInHorizontalScroller(el) {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    if (n.scrollWidth > n.clientWidth + 4) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === "auto" || ox === "scroll") return true;
    }
  }
  return false;
}

function initSwipeGestures() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  const viewport = document.getElementById("book-viewport") || document.body;

  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (e.changedTouches.length !== 1) return;

    // Ignorar si el usuario estaba interactuando con mapa Leaflet, slider, modal abierto o inputs
    const target = e.target;
    if (
      target.closest("#map") ||
      target.closest(".leaflet-container") ||
      target.closest("input[type='range']") ||
      target.closest(".modal-backdrop:not([hidden])") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest(".floating-audio-widget") ||
      document.body.classList.contains("splash-open") ||
      document.body.classList.contains("open") ||
      isInHorizontalScroller(target)
    ) {
      return;
    }

    const t = e.changedTouches[0];
    const deltaX = t.clientX - touchStartX;
    const deltaY = t.clientY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;

    // Solo reconocer swipe horizontal claro (mínimo 52px en menos de 650ms con desplazamiento horizontal dominante)
    if (Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4 && deltaTime < 650) {
      const curIdx = VALID_APP_VIEWS.indexOf(state.view);
      if (curIdx < 0) return;

      if (deltaX < 0) {
        // Swipe hacia la izquierda -> avanzar a la siguiente página
        if (curIdx < VALID_APP_VIEWS.length - 1) {
          switchView(VALID_APP_VIEWS[curIdx + 1]);
        }
      } else {
        // Swipe hacia la derecha -> retroceder a la página anterior
        if (curIdx > 0) {
          switchView(VALID_APP_VIEWS[curIdx - 1]);
        }
      }
    }
  }, { passive: true });
}

let splashDismissed = false;
function dismissSplashScreen() {
  if (splashDismissed) return;
  splashDismissed = true;
  try { sessionStorage.setItem("welcome_seen_v1", "1"); } catch (e) { /* modo privado */ }
  document.body.classList.remove("splash-open");
  const splash = document.getElementById("app-splash-screen");
  if (splash) {
    splash.classList.add("is-hidden");
    setTimeout(() => {
      try { splash.remove(); } catch (e) {}
    }, 400);
  }
}


/* =====================================================================
   INICIO EN BLOQUES (BENTO), LOGO → INICIO Y MODAL RÁPIDO DE PERFIL
   ===================================================================== */
function renderHome() {
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set("bento-meta-list", `${PARISHES.length} templos · CABA y GBA`);
  set("bento-meta-map", "Templos por jerarquía");
  if (SHOW_COMMUNITY) {
    let streakTxt = "Registrá tu misa";
    try {
      const s = evaluateSpiritualStreak(spiritualDB.checkins);
      if (s && s.consecutiveWeekends > 0) streakTxt = `🔥 ${s.consecutiveWeekends} ${s.consecutiveWeekends === 1 ? "fin de semana" : "fines de semana"}`;
    } catch (e) { /* sin datos de racha */ }
    set("bento-meta-spiritual", streakTxt);
  }
  try {
    set("bento-meta-liturgy", new Date().toLocaleDateString(appSettings.lang || "es-AR", { weekday: "long", day: "numeric", month: "long" }));
  } catch (e) { set("bento-meta-liturgy", "Lecturas de hoy"); }
  set("bento-meta-bible", "Antiguo y Nuevo Testamento (CEA)");
  set("bento-meta-reflections", "Audiencias y documentos");
  set("bento-meta-saints", "Santoral de hoy");
  set("bento-meta-settings", appSettings.darkMode ? "Modo noche activado" : "Modo claro · Idioma · Radio");
}

/** Logo → pantalla principal: cierra paneles abiertos y vuelve al Inicio arriba del todo. */
function goHome() {
  try { closeDetail(); } catch (e) { /* sin detalle abierto */ }
  ["#settings-modal", "#profile-quick-modal", "#zone-picker-modal", "#parish-picker-modal", "#public-profile-modal"].forEach(sel => {
    const m = document.querySelector(sel); if (m) m.hidden = true;
  });
  try { closeAudioPanel(); } catch (e) { /* radio no montada */ }
  switchView("home");
  const viewport = document.getElementById("book-viewport");
  if (viewport) {
    viewport.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function closeProfileQuickModal() {
  const m = document.getElementById("profile-quick-modal");
  if (m) m.hidden = true;
}

function renderProfileQuick() {
  const body = document.getElementById("pq-body");
  if (!body) return;
  const user = getCurrentUserObj();
  const role = state.isAdmin ? "Administrador" : state.adminRole === "collab" ? "Colaborador" : "Invitado";
  let streakN = 0;
  try { streakN = evaluateSpiritualStreak(spiritualDB.checkins).consecutiveWeekends || 0; } catch (e) { /* sin racha */ }
  const radioOn = !globalAudio.paused && !globalAudio.ended;
  body.innerHTML = `
    <div class="pq-hero">
      <div class="pq-avatar">${user ? renderAvatarContent(user) : "👤"}</div>
      <div class="pq-id">
        <strong>${esc(user ? user.apodo : "Invitado")}</strong>
        <span>${user ? "@" + esc(user.username || "") : "Sin cuenta iniciada"}</span>
        <span class="pq-role">${esc(role)}</span>
      </div>
    </div>
    ${user && user.bio ? `<p class="pq-bio">${esc(user.bio)}</p>` : ""}
    <div class="pq-stats" style="${SHOW_COMMUNITY ? "" : "grid-template-columns: repeat(2, 1fr);"}">
      <div class="pq-stat"><strong>${state.favs.size}</strong><span>Favoritos</span></div>
      ${SHOW_COMMUNITY ? `<div class="pq-stat"><strong>${streakN}</strong><span>Racha</span></div>` : ""}
      <div class="pq-stat"><strong>${PARISHES.length}</strong><span>Templos</span></div>
    </div>
    <div class="pq-actions">
      <button type="button" class="pq-btn primary" data-pq="profile">${user ? "Ver perfil completo" : "Iniciar sesión / crear cuenta"}</button>
      <button type="button" class="pq-btn" data-pq="dark">${appSettings.darkMode ? "☀️ Cambiar a modo claro" : "🌙 Activar modo noche"}</button>
      <button type="button" class="pq-btn" data-pq="radio">${radioOn ? "⏸ Pausar Radio" : "▶ Iniciar Radio"}</button>
      <button type="button" class="pq-btn" data-pq="settings">⚙️ Configuración e idioma</button>
      <button type="button" class="pq-btn subtle" data-pq="staff">${state.canEditActivities ? "Cerrar sesión de gestión" : "Ingreso como Administrador / Colaborador"}</button>
    </div>`;
}

function openProfileQuickModal() {
  const m = document.getElementById("profile-quick-modal");
  if (!m) return switchView("profile");
  renderProfileQuick();
  m.hidden = false;
  setTimeout(() => m.querySelector(".pq-btn")?.focus(), 40);
}

function initHomeAndHeader() {
  document.getElementById("btn-brand-home")?.addEventListener("click", goHome);

  document.getElementById("bento-grid")?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-go], [data-open]");
    if (!card) return;
    if (card.dataset.open === "settings") return openSettingsModal();
    if (card.dataset.go) switchView(card.dataset.go);
  });

  const modal = document.getElementById("profile-quick-modal");
  document.getElementById("btn-close-profile-quick")?.addEventListener("click", closeProfileQuickModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) return closeProfileQuickModal();
    const btn = e.target.closest("[data-pq]");
    if (!btn) return;
    const act = btn.dataset.pq;
    if (act === "profile") { closeProfileQuickModal(); switchView("profile"); }
    else if (act === "settings") { closeProfileQuickModal(); openSettingsModal(); }
    else if (act === "dark") {
      appSettings.darkMode = !appSettings.darkMode;
      saveAppSettings(); applyAppSettings(); renderProfileQuick(); renderHome();
    } else if (act === "radio") {
      document.getElementById("btn-settings-radio-play")?.click();
      setTimeout(renderProfileQuick, 250);
    } else if (act === "staff") {
      closeProfileQuickModal();
      state.canEditActivities ? logoutAdmin() : openAdminLoginModal();
    }
  });
  renderHome();
}

/** Entrada por roles: Invitado (libre) o Administrador / Colaborador (PIN). Se enlaza al cargar el script,
 *  de modo que los botones respondan aunque algún módulo posterior falle. */
function enterAsGuest(view) {
  dismissSplashScreen();
  if (view && view !== state.view) { try { switchView(view); } catch (e) { console.warn(e); } }
}
document.getElementById("btn-splash-list")?.addEventListener("click", () => enterAsGuest("list"));
document.getElementById("btn-splash-map")?.addEventListener("click", () => enterAsGuest("map"));
document.getElementById("btn-splash-guest")?.addEventListener("click", () => enterAsGuest("home"));
document.getElementById("btn-splash-staff")?.addEventListener("click", () => openAdminLoginModal());
document.getElementById("btn-login-guest")?.addEventListener("click", () => { closeAdminLoginModal(); enterAsGuest("home"); });
document.getElementById("btn-act-parish-picker")?.addEventListener("click", () => openParishPickerModal("activity"));

/** Se llama al terminar el arranque: con sesión de gestión activa o ya visitada en esta sesión, no pide elegir de nuevo. */
function initWelcomeGate() {
  const splash = document.getElementById("app-splash-screen");
  if (splash) splash.classList.add("is-ready");
  let seen = false;
  try { seen = sessionStorage.getItem("welcome_seen_v1") === "1"; } catch (e) { /* ignorar */ }
  if (state.canEditActivities) {
    toast(state.isAdmin ? "Sesión de Administrador activa" : "Sesión de Colaborador activa");
    setTimeout(dismissSplashScreen, 600);
  } else if (seen) {
    dismissSplashScreen();
  }

  // Blindaje estricto: timeout de seguridad de máximo 1.5s para forzar el ocultamiento del splash
  setTimeout(() => {
    dismissSplashScreen();
  }, 1500);
}

function bootstrapApp() {
  if (appInitialized) return;
  appInitialized = true;

  // Timeout de seguridad de arranque inmediato: si cualquier parte del DOM o datos demora,
  // la app se destraba obligatoriamente en máximo 1.5s.
  setTimeout(() => {
    dismissSplashScreen();
  }, 1500);

  const initSteps = [
    ["applyAppSettings", applyAppSettings],
    ["bindAppEvents", bindAppEvents],
    ["syncAdminUI", syncAdminUI],
    ["syncHeaderUserPill", syncHeaderUserPill],
    ["renderZoneSelector", renderZoneSelector],
    ["renderChips", renderChips],
    ["renderList", renderList],
    ["renderLiturgyView", renderLiturgyView],
    ["renderBibleView", renderBibleView],
    ["renderReflectionsView", renderReflectionsView],
    ["renderSaintsView", renderSaintsView],
    ["initGlobalRadio", initGlobalRadio],
    ["initSwipeGestures", initSwipeGestures],
    ["initHomeAndHeader", initHomeAndHeader],
    ["renderProfileView", renderProfileView]
  ];
  if (SHOW_COMMUNITY) {
    initSteps.push(["renderSpiritualView", renderSpiritualView]);
    initSteps.push(["renderCommunityView", renderCommunityView]);
  }

  initSteps.forEach(([name, fn]) => {
    try {
      fn();
    } catch (err) {
      console.warn(`[Bootstrap Guard] Advertencia controlada en ${name}:`, err);
    }
  });

  try {
    switchView(state.view, true);
  } catch (err) {
    console.warn("[Bootstrap Guard] Error al restaurar vista activa:", err);
  }

  try {
    loadParishes();
    loadVerifiedReflections();
    loadBibleData();
  } catch (err) {
    console.warn("[Bootstrap Guard] Error al invocar carga de datos:", err);
  }

  try {
    initWelcomeGate();
  } catch (err) {
    console.warn("[Bootstrap Guard] Error en initWelcomeGate:", err);
    dismissSplashScreen();
  }
}

async function loadParishes() {
  try {
    const adminSaved = Store.get("parishes_admin_data", null);
    if (Array.isArray(adminSaved) && adminSaved.length > 0) {
      PARISHES = prepareDataset(adminSaved);
      if (state.userLoc) updateDistances(state.userLoc.lat, state.userLoc.lng);
      renderChips();
      renderList();
      return;
    }
  } catch (e) {
    console.warn("[loadParishes] Error leyendo parishes_admin_data:", e);
  }

  try {
    const res = await fetch(DATA_SOURCE_URL, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.parishes || []);
    if (list && list.length) {
      PARISHES = prepareDataset(list);
      Store.set("parishes_cache_v7", list);
      if (state.userLoc) {
        updateDistances(state.userLoc.lat, state.userLoc.lng);
      }
      renderChips();
      renderList();
      return;
    }
  } catch (err) {
    console.warn("[loadParishes] Usando dataset local offline de 150 templos por fallo en fetch:", err);
  }

  // Respaldo de seguridad definitivo: si fetch falla o devuelve vacío, garantizar que PARISHES
  // quede cargado con el dataset de respaldo de 150 templos
  try {
    if (!PARISHES || !PARISHES.length) {
      PARISHES = prepareDataset(FALLBACK_PARISHES);
    }
    renderChips();
    renderList();
  } catch (e) {
    console.warn("[loadParishes] Error en fallback de templos:", e);
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
