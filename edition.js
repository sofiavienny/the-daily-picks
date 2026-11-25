// ─────────────────────────────────────────────────────────────
//  THE DAILY PICKS · la edición del día
//  Es el único archivo que cambia todos los días.
//  Todo lo que hay acá es de EJEMPLO: reemplazalo por lo tuyo
//  (a mano o pidiéndole a una IA que lo complete; ver prompts/).
//
//  ⚠️ Tus datos reales (tu agenda, tus artículos) van en una copia
//  llamada edition.local.js. Esa copia nunca se sube a GitHub.
// ─────────────────────────────────────────────────────────────
window.DAILY_EDITION = {
  // Fecha de la edición (AAAA-MM-DD). Dejala en null para usar la de hoy.
  date: null,
  volume: "Vol. I · No. 1",
  tagline: "Read · Write · Play",

  // Opcional: si no querés el clima automático, completalo a mano acá.
  // weather: { high: 25, low: 16, summary: "Partly sunny", icon: "partly" },
  weather: null,

  // Tu día. Las horas sin evento quedan en blanco para escribir a mano.
  schedule: [
    { time: "9:30",  title: "Team stand-up",      duration: "30 min" },
    { time: "11:00", title: "Project review",     duration: "1 h" },
    { time: "13:00", title: "Lunch" },
    { time: "15:00", title: "Workshop prep",      duration: "1 h" },
    { time: "17:30", title: "Call with a friend", duration: "30 min" }
  ],
  scheduleNote: "Sample events. Replace them with your own.",

  // El artículo del día
  article: {
    headline: "The case for a slower morning",            // título corto para la portada
    title: "Why a Paper Edition Still Works in a Feed-Shaped World", // título completo para la página de adentro
    dek: "On reading one thing, on paper, before the day starts reading you.",
    author: "Jane Doe",
    publication: "The Example Letter",
    published: "Dec 1, 2026",
    readMinutes: 5,
    // Resumen para la portada (2 párrafos cortos)
    summary: [
      "Jane Doe argues that the problem with the morning feed is not the content but the shape: an endless column with no last page. A printed edition has edges, and edges let you finish something before breakfast.",
      "She walks through a month of reading one article a day on paper, what she kept, what she dropped, and a small exercise to try tomorrow morning."
    ],
    // Artículo completo (HTML). Usá <p>, <h4>, <blockquote>, <ol>, <ul>.
    body: `
<p class="lede">Every morning for years, the first thing I read was whatever the phone decided to show me. Not because I chose it, but because it was there, glowing, before I had made a single decision of my own.</p>
<p>Last month I tried something small. I printed one article the night before and left it next to the kettle. That was the whole experiment: one thing, on paper, before anything else.</p>
<blockquote>“A feed has no last page. A newspaper does, and that is its best feature.”</blockquote>
<h4>The shape of the problem</h4>
<p>We tend to blame the content. Too much news, too many opinions, too many people we don’t know telling us what they had for lunch. But the content was never the real issue. The shape was.</p>
<p>A feed is a column with no bottom. It is designed so that stopping is always your job, never the page’s. A printed page is the opposite: it ends, and when it ends you are done, and being done feels surprisingly good.</p>
<p>The first week, I kept reaching for the phone out of habit. By the second week, I noticed I was reading more slowly, underlining things, writing small notes in the margin like a student who actually cares.</p>
<h4>What changed</h4>
<p>I remembered what I read. That sounds obvious, but it was the biggest difference. When I read on a screen, the article dissolves into the next one. On paper, it stays in the room with you.</p>
<p>I also started to have opinions again. Not hot takes, just thoughts that were mine, that had time to form because nothing was interrupting them.</p>
<p>And the puzzle at the back became a ritual. Five minutes with a pen, hunting for words, before opening a single app.</p>
<h4>What didn’t work</h4>
<p>Printing every day is a habit, and habits need a setup. The first few nights I forgot, and the morning went straight back to the feed. What fixed it was making the printing automatic, so the paper was simply there.</p>
<p>Some articles were also too long for breakfast. I learned to pick shorter reads for weekdays and save the long ones for Sunday.</p>
<h4>Try it yourself</h4>
<p>Tonight, pick one article you saved and never read. Print it, or copy it into a notebook if you don’t have a printer. Leave it where you will see it first thing.</p>
<p>Tomorrow, read it before you unlock your phone. Then write one sentence about it: what you agree with, what bothered you, what you want to remember.</p>
<h4>Takeaways</h4>
<ol>
<li>The feed is not the enemy, its endlessness is. Give your morning an edge.</li>
<li>Reading on paper makes ideas stick. Underline, scribble, argue with the margin.</li>
<li>Make it automatic. A ritual that depends on remembering will not survive a busy week.</li>
</ol>
<p><i>Thanks for reading. See you tomorrow, on paper.</i></p>`,
    // Foto opcional para la página de adentro (usá una imagen que puedas usar)
    image: null // { src: "img/photo.jpg", caption: "Photo by ..." }
  },

  // Columna derecha de la portada
  quote: {
    text: "A feed has no last page. A newspaper does.",
    attribution: "Jane Doe, in today’s read"
  },
  highlights: [
    { label: "The idea", bold: "Give your morning an edge.", text: "One article, on paper, before the phone." },
    { label: "Try it",   bold: "Print one saved article tonight", text: "and read it before unlocking your phone." }
  ],
  wordOfTheDay: {
    word: "Ritual",
    type: "(n.)",
    definition: "A small act repeated on purpose, so that it carries more meaning than the act itself."
  },

  // Sopa de letras: hasta 12 palabras, de 13 letras como máximo
  words: ["Paper", "Morning", "Ritual", "Edition", "Feed", "Reading", "Margin", "Habit", "Kettle", "Pencil", "Notes", "Puzzle"],

  // Journal
  prompt: "What would you read tomorrow morning if nothing was choosing for you?",
  promptShort: "What would you read if nothing chose for you?"
};
