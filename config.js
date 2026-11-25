// ─────────────────────────────────────────────────────────────
//  THE DAILY PICKS · config
//  Lo que se configura una sola vez: nombre del diario, tu firma,
//  ciudad para el clima e idioma de los textos fijos.
//
//  ⚠️ No edites este archivo con tus datos: copialo como
//  config.local.js y editá la copia. La copia nunca se sube a GitHub.
// ─────────────────────────────────────────────────────────────
window.DAILY_CONFIG = {
  // Nombre del diario (el título en letra gótica de la portada)
  paperName: "The Daily Picks",

  // Firma que aparece al pie de cada página (abajo a la derecha)
  signature: "Your Name",

  // Texto del sticker de la ilustración de portada
  sticker: { top: "Your", main: "Pick of<br>the day" },

  // Ciudad para el clima. Buscá la latitud y la longitud en Google Maps
  // (clic derecho sobre el mapa). El clima sale de Open-Meteo,
  // que es gratis y no pide cuenta ni API key.
  city: {
    name: "Buenos Aires",
    latitude: -34.61,
    longitude: -58.38,
    timezone: "America/Argentina/Buenos_Aires"
  },
  temperatureUnit: "celsius",        // "celsius" o "fahrenheit"

  // Idioma de las fechas: "en-US", "es-AR", "es-ES", "pt-BR"...
  locale: "en-US",

  // Rango horario de la agenda (las horas sin eventos quedan en blanco para escribir)
  agenda: { startHour: 8, endHour: 19 },

  // Textos fijos del diario. Traducilos si lo querés en otro idioma.
  labels: {
    firstEdition: "First edition",
    yourDay: "Your day",
    schedule: "Schedule",
    notes: "Notes",
    todaysRead: "Today’s read",
    illustration: "Illustration for today’s read. Ink on newsprint.",
    continued: "Continued on page 2",
    insideToday: "Inside today",
    readInFull: "Today’s read, in full",
    findTheWords: "Find the words",
    journal: "Journal",
    promptLabel: "Tonight’s question",
    backPage: "The back page · Puzzle & journal",
    backTeaser: "Word search & tonight’s question",
    wordsFromRead: "Words from today’s read",
    solution: "Solution",
    wordOfTheDay: "Word of the day",
    by: "By",
    page: "Page",
    eventsSummary: (n, first) => n === 0 ? "A free day" : `${n} ${n === 1 ? "event" : "events"}, first at ${first}`,
    minRead: (m) => `${m} min read`
  }
};
