// ─────────────────────────────────────────────────────────────
//  THE DAILY PICKS · render
//  Arma el diario a partir de config.js + edition.js.
//  No hace falta tocar este archivo para usar el template.
// ─────────────────────────────────────────────────────────────
(function () {
  const C = window.DAILY_CONFIG, E = window.DAILY_EDITION, L = C.labels;

  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- fecha ----------
  const today = () => {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: C.city.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    return p; // AAAA-MM-DD
  };
  const iso = E.date || today();
  const d = new Date(iso + "T12:00:00");
  const fmt = (o) => new Intl.DateTimeFormat(C.locale, o).format(d);
  const longDate = fmt({ weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const shortDate = fmt({ weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const footDate = fmt({ year: "numeric", month: "long", day: "numeric" });

  // ---------- clima ----------
  const ICONS = {
    sun: '<circle cx="20" cy="16" r="7"/><path d="M20 3v4M20 25v4M7 16h4M29 16h4M11 7l3 3M29 7l-3 3M11 25l3-3M29 25l-3-3"/>',
    partly: '<circle cx="14" cy="12" r="6"/><path d="M14 2v3M4 12h3M7 5l2 2M21 5l-2 2"/><path d="M15 28h17a6 6 0 0 0 0-12 8 8 0 0 0-15 2 5 5 0 0 0-2 10z" fill="#ecebe6"/>',
    cloud: '<path d="M10 26h20a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-3 12z" fill="#ecebe6"/>',
    rain: '<path d="M10 20h20a6 6 0 0 0 0-12 8 8 0 0 0-15 2 5 5 0 0 0-5 10z" fill="#ecebe6"/><path d="M13 24l-2 5M20 24l-2 5M27 24l-2 5"/>',
    storm: '<path d="M10 19h20a6 6 0 0 0 0-12 8 8 0 0 0-15 2 5 5 0 0 0-5 10z" fill="#ecebe6"/><path d="M21 20l-4 6h5l-3 5" />',
    snow: '<path d="M10 19h20a6 6 0 0 0 0-12 8 8 0 0 0-15 2 5 5 0 0 0-5 10z" fill="#ecebe6"/><path d="M13 25h.1M20 28h.1M27 25h.1" stroke-width="3.4"/>',
    fog: '<path d="M6 12h28M9 18h24M6 24h28" />'
  };
  const fromCode = (c) =>
    c === 0 ? ["sun", "Clear skies"] :
    c <= 2 ? ["partly", "Partly sunny"] :
    c === 3 ? ["cloud", "Overcast"] :
    c <= 48 ? ["fog", "Foggy"] :
    c <= 67 || (c >= 80 && c <= 82) ? ["rain", "Rain"] :
    c <= 77 || c === 85 || c === 86 ? ["snow", "Snow"] :
    ["storm", "Thunderstorms"];

  async function getWeather() {
    if (E.weather) return E.weather;
    const u = new URL("https://api.open-meteo.com/v1/forecast");
    u.search = new URLSearchParams({
      latitude: C.city.latitude, longitude: C.city.longitude, timezone: C.city.timezone,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
      temperature_unit: C.temperatureUnit, start_date: iso, end_date: iso
    });
    try {
      const ctl = new AbortController(); setTimeout(() => ctl.abort(), 5000);
      const j = await (await fetch(u, { signal: ctl.signal })).json();
      const [icon, summary] = fromCode(j.daily.weather_code[0]);
      const rain = j.daily.precipitation_probability_max[0];
      return { high: Math.round(j.daily.temperature_2m_max[0]), low: Math.round(j.daily.temperature_2m_min[0]),
               summary: rain != null ? `${summary}, ${rain}% rain` : summary, icon };
    } catch (e) { return null; }
  }

  // ---------- agenda ----------
  function agenda() {
    const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); };
    const evs = (E.schedule || []).slice().sort((a, b) => toMin(a.time) - toMin(b.time));
    const taken = new Set(evs.map((e) => Math.floor(toMin(e.time) / 60)));
    const rows = evs.map((e) => ({ m: toMin(e.time), html: `<li class="ev"><time>${esc(e.time)}</time><span>${esc(e.title)}</span><em>${esc(e.duration || "")}</em></li>` }));
    for (let h = C.agenda.startHour; h <= C.agenda.endHour; h++)
      if (!taken.has(h)) rows.push({ m: h * 60, html: `<li><time>${h}:00</time><span></span><em></em></li>` });
    rows.sort((a, b) => a.m - b.m);
    return { html: rows.map((r) => r.html).join(""), count: evs.length, first: evs[0]?.time };
  }

  // ---------- sopa de letras ----------
  function rng(seed) { let x = 0; for (const c of seed) x = (x * 31 + c.charCodeAt(0)) >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function wordSearch(list, size = 13) {
    const r = rng(iso + list.join());
    const norm = (w) => w.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
    const words = list.map(norm).filter((w) => w.length >= 3 && w.length <= size).slice(0, 12).sort((a, b) => b.length - a.length);
    const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0]];
    let best;
    for (let attempt = 0; attempt < 50; attempt++) {
      const g = Array.from({ length: size }, () => Array(size).fill(null)), on = new Set(); let placed = [];
      for (const w of words) {
        let ok = false;
        for (let t = 0; t < 400 && !ok; t++) {
          const [dr, dc] = dirs[Math.floor(r() * dirs.length)], row = Math.floor(r() * size), col = Math.floor(r() * size);
          const cells = [...w].map((_, i) => [row + dr * i, col + dc * i]);
          if (cells.every(([a, b], i) => a >= 0 && b >= 0 && a < size && b < size && (g[a][b] === null || g[a][b] === w[i]))) {
            cells.forEach(([a, b], i) => { g[a][b] = w[i]; on.add(a * size + b); }); ok = true;
          }
        }
        if (ok) placed.push(w);
      }
      if (!best || placed.length > best.placed.length) best = { g, on, placed };
      if (placed.length === words.length) break;
    }
    const A = "ABCDEFGHIJKLMNOPRSTUVY";
    const letters = best.g.flat().map((c) => c || A[Math.floor(r() * A.length)]);
    const placedSet = new Set(best.placed);
    return {
      grid: letters.map((c) => `<span>${c}</span>`).join(""),
      solution: letters.map((c, i) => `<span class="${best.on.has(i) ? "on" : ""}">${c}</span>`).join(""),
      words: list.filter((w) => placedSet.has(norm(w)))
    };
  }

  // ---------- armado ----------
  window.renderDaily = async function () {
    const a = E.article, ag = agenda(), ws = wordSearch(E.words || []), wx = await getWeather();
    document.title = `${C.paperName} · ${footDate}`;

    // pie de página de cada hoja
    const st = document.createElement("style");
    st.textContent = `@page{size:A4;margin:12mm 13mm 15mm;background:#ecebe6;
      @bottom-left{content:counter(page) "   ${C.paperName.replace(/"/g, "")}  |  ${footDate}";font:600 7pt "Source Serif 4",Georgia,serif;letter-spacing:.14em;text-transform:uppercase;color:#1d1b1a;white-space:pre}
      @bottom-right{content:"${C.signature.replace(/"/g, "")}";font:600 7pt "Source Serif 4",Georgia,serif;letter-spacing:.14em;text-transform:uppercase;color:#1d1b1a}}`;
    document.head.appendChild(st);

    const wxHtml = wx
      ? `<svg viewBox="0 0 40 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[wx.icon] || ICONS.partly}</svg><div><span class="sc">${esc(C.city.name)}</span><b>${wx.high}° <i>/ ${wx.low}°</i></b><span class="wxt">${esc(wx.summary || "")}</span></div>`
      : `<span></span><div><span class="sc">${esc(C.city.name)}</span><b>—°</b></div>`;

    const front = `
<section class="front">
<div class="sky">
<div><svg viewBox="0 0 60 42" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h36v28H6z"/><path d="M6 16h36" /><path d="M14 4v8M34 4v8"/><path d="M12 22h6M22 22h6M32 22h6M12 29h6M22 29h6"/><circle cx="48" cy="30" r="9" fill="#ecebe6"/><path d="M48 25v5l3 2"/></svg><div><span class="tag">${L.yourDay} · ${L.page} 1</span><b>${esc(L.eventsSummary(ag.count, ag.first))}</b></div></div>
<div><svg viewBox="0 0 60 42" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h32v34H8z"/><path d="M8 15h32M8 26h32M19 4v34M30 4v34"/><path d="M10 6l7 7M21 17l7 7M32 28l6 8" stroke-width="3.4"/><path d="M44 30l10-10 4 4-10 10-5 1z" fill="#1d1b1a"/></svg><div><span class="tag">${L.backPage.split("·")[0].trim()} · ${L.page} <span class="pg-back">4</span></span><b>${esc(L.backTeaser)}</b></div></div>
</div>
<div class="mastrow">
<div class="ear sc">${L.firstEdition}<br>${esc(shortDate)}</div>
<p class="mast">${esc(C.paperName)}</p>
<div class="ear wx">${wxHtml}</div>
</div>
<div class="dateline sc"><span>${esc(E.volume || "")}</span><span>${esc(longDate)}</span><span>${esc(E.tagline || "")}</span></div>
<div class="grid">
<aside>
<p class="colhead">${L.yourDay}</p>
<span class="tag">${L.schedule}</span>
<ul class="agenda">${ag.html}</ul>
${E.scheduleNote ? `<p class="sample">${esc(E.scheduleNote)}</p>` : ""}
<div class="notes"><span class="tag">${L.notes}</span><i></i><i></i><i></i><i></i></div>
</aside>
<div class="center">
<span class="tag" style="text-align:center;margin-bottom:1.5mm">${L.todaysRead}</span>
<h1>${esc(a.headline || a.title)}</h1>
<p class="dek">${esc(a.title)}</p>
<p class="byl sc">${L.by} ${esc(a.author)} · ${esc(a.publication)}</p>
<div class="artwrap"><svg class="art" viewBox="0 0 480 340" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Ink drawing of a reading corner: a black lamp, a stack of striped and black books with an open book and a steaming mug on top, a framed water-lily painting and a potted plant">
<defs>
<filter id="ink" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6"/></filter>
<pattern id="stripe" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#ecebe6"/><path d="M0 1.5h6" stroke="#1d1b1a" stroke-width="2.2"/></pattern>
<pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 2.5h5" stroke="#1d1b1a" stroke-width="1.2"/></pattern>
</defs>
<g filter="url(#ink)" stroke="#1d1b1a" fill="none">
<path d="M10 330H470" stroke-width="4"/>
<path d="M150 334H420l-10 6H160z" fill="url(#hatch)" stroke="none"/>
<!-- painting -->
<rect x="236" y="22" width="208" height="150" fill="#ecebe6" stroke-width="11"/>
<path d="M252 62q16-7 32 0t32 0 32 0 32 0 32 0 18-2M252 98q16-7 32 0t32 0 32 0 32 0 32 0 18-2M252 134q16-7 32 0t32 0 32 0 32 0 32 0 18-2" stroke-width="2.4"/>
<path d="M276 80c-14 0-19 8-9 12 10 3 26 1 28-5-6 2-12 1-12-4z" fill="#1d1b1a" stroke-width="2"/>
<path d="M360 116c-16 0-21 9-10 13 11 4 29 1 31-6-7 2-14 1-14-4z" fill="#1d1b1a" stroke-width="2"/>
<path d="M404 70c-11 0-14 6-6 9 8 3 20 1 21-4-5 1-9 1-9-3z" fill="#1d1b1a" stroke-width="2"/>
<path d="M300 150c-12 0-16 7-7 10 8 3 21 1 23-4-5 1-10 1-10-3z" fill="#1d1b1a" stroke-width="2"/>
<path d="M284 78l4-10 4 10M370 114l4-11 4 11" stroke-width="2.2"/>
<!-- lamp -->
<path d="M44 26H104L118 82H30Z" fill="#1d1b1a" stroke-width="3"/>
<path d="M74 82V318" stroke-width="5"/><path d="M48 326c0-10 52-10 52 0z" fill="#1d1b1a" stroke-width="3"/>
<path d="M58 88l-8 10M90 88l8 10M74 90v12" stroke-width="2"/>
<!-- books -->
<rect x="140" y="290" width="246" height="40" fill="#ecebe6" stroke-width="4"/><rect x="140" y="290" width="26" height="40" fill="#1d1b1a" stroke-width="4"/><rect x="360" y="290" width="26" height="40" fill="#1d1b1a" stroke-width="4"/><path d="M200 304h120M220 316h80" stroke-width="3"/>
<rect x="156" y="256" width="214" height="34" fill="#1d1b1a" stroke-width="4"/><path d="M196 273h70" stroke="#ecebe6" stroke-width="3"/><circle cx="300" cy="273" r="4" fill="#ecebe6" stroke="none"/><circle cx="316" cy="273" r="4" fill="#ecebe6" stroke="none"/><circle cx="332" cy="273" r="4" fill="#ecebe6" stroke="none"/>
<rect x="146" y="226" width="232" height="30" fill="url(#stripe)" stroke-width="4"/><rect x="214" y="232" width="96" height="18" fill="#ecebe6" stroke-width="3"/><path d="M228 241h68" stroke-width="2.4"/>
<rect x="164" y="198" width="198" height="28" fill="#ecebe6" stroke-width="4"/><path d="M186 198v28M340 198v28M206 212h50" stroke-width="3"/>
<path d="M170 198c26-16 60-16 88 0 28-16 62-16 88 0" fill="#ecebe6" stroke-width="4"/><path d="M258 198v-8"/><path d="M186 186c18-7 38-7 56 0M186 178c18-7 38-7 56 0M274 186c18-7 38-7 56 0M274 178c18-7 38-7 56 0" stroke-width="2"/>
<!-- mug -->
<path d="M332 128h44v50c0 6-4 9-9 9h-26c-5 0-9-3-9-9z" fill="#1d1b1a" stroke-width="3"/>
<path d="M376 140c18 0 18 28 0 28" stroke-width="6"/><path d="M342 144v26" stroke="#ecebe6" stroke-width="3"/>
<path d="M344 118c-8-10 8-14 0-26M362 118c-8-10 8-14 0-26" stroke-width="3"/>
<!-- plant -->
<path d="M420 214c-26-26-22-62 6-78 14 26 12 56-2 78z" fill="#1d1b1a" stroke-width="3"/>
<path d="M432 222c8-36 30-54 42-54-2 34-18 52-38 58z" fill="#ecebe6" stroke-width="4"/><path d="M438 220c10-16 20-28 30-40" stroke-width="2"/>
<path d="M414 228c-24-10-36-26-38-40 22 0 36 16 42 34z" fill="#ecebe6" stroke-width="4"/><path d="M412 224c-10-10-20-20-28-30" stroke-width="2"/>
<path d="M398 228h64l-8 98h-48z" fill="#1d1b1a" stroke-width="4"/><path d="M402 252h56M404 276h52M406 300h48" stroke="#ecebe6" stroke-width="3"/>
</g>
</svg><div class="badge"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M98.00 50.00 L92.63 55.61 L96.36 62.42 L89.73 66.46 L91.57 74.00 L84.11 76.18 L83.94 83.94 L76.18 84.11 L74.00 91.57 L66.46 89.73 L62.42 96.36 L55.61 92.63 L50.00 98.00 L44.39 92.63 L37.58 96.36 L33.54 89.73 L26.00 91.57 L23.82 84.11 L16.06 83.94 L15.89 76.18 L8.43 74.00 L10.27 66.46 L3.64 62.42 L7.37 55.61 L2.00 50.00 L7.37 44.39 L3.64 37.58 L10.27 33.54 L8.43 26.00 L15.89 23.82 L16.06 16.06 L23.82 15.89 L26.00 8.43 L33.54 10.27 L37.58 3.64 L44.39 7.37 L50.00 2.00 L55.61 7.37 L62.42 3.64 L66.46 10.27 L74.00 8.43 L76.18 15.89 L83.94 16.06 L84.11 23.82 L91.57 26.00 L89.73 33.54 L96.36 37.58 L92.63 44.39Z" fill="#ecebe6" stroke="#1d1b1a" stroke-width="1.6"/><circle cx="50" cy="50" r="37" fill="none" stroke="#1d1b1a" stroke-width=".7"/></svg><div><small>${C.sticker.top}</small><strong>${C.sticker.main}</strong><small>${esc(L.minRead(a.readMinutes))}</small></div></div></div>
<p class="cap">${L.illustration}</p>
<div class="lead">${(a.summary || []).map((p) => `<p>${esc(p)}</p>`).join("")}</div>
<p class="cont">${L.continued}</p>
<div class="index"><p class="tag">${L.insideToday}</p><ul><li><span>${L.readInFull}</span><b>2</b></li><li><span>${L.findTheWords}</span><b class="pg-back">4</b></li><li><span>${L.journal}: ${L.promptLabel}</span><b class="pg-back">4</b></li></ul></div>
</div>
<aside class="right">
<p class="big">“${esc(E.quote?.text)}”<span>${esc(E.quote?.attribution)}</span></p>
${(E.highlights || []).map((h) => `<div class="small"><span class="tag">${esc(h.label)}</span><b>${esc(h.bold)}</b> ${esc(h.text)}</div>`).join("")}
${E.wordOfTheDay ? `<div class="small wod"><span class="tag">${L.wordOfTheDay}</span><b>${esc(E.wordOfTheDay.word)}</b> <i>${esc(E.wordOfTheDay.type || "")}</i><br>${esc(E.wordOfTheDay.definition)}</div>` : ""}
<div class="toq"><span class="tag">${L.promptLabel}</span><p>${esc(E.promptShort || E.prompt)}</p><span class="tag" style="display:block;margin-top:2mm">${L.page} <span class="pg-back">4</span></span></div>
</aside>
</div>
</section>`;

    const story = `
<article class="story">
<div class="s-top"><span class="sc">${L.todaysRead} · ${esc(a.publication)}</span><span class="mini">${esc(C.paperName)}</span></div>
<h2>${esc(a.title)}</h2>
<p class="dek">${esc(a.dek || "")}</p>
<p class="byl sc">${L.by} ${esc(a.author)} · ${esc(a.published || "")} · ${esc(L.minRead(a.readMinutes))}</p>
<div class="cols">
${a.image ? `<figure><img src="${esc(a.image.src)}" alt="${esc(a.image.caption || "")}"><figcaption>${esc(a.image.caption || "")}</figcaption></figure>` : ""}
${a.body || ""}
</div>
</article>`;

    const back = `
<section class="back">
<div class="b-title sc">${esc(L.backPage)}</div>
<p class="b-head">${L.findTheWords}</p>
<div class="b-grid">
<div><div class="ws">${ws.grid}</div></div>
<div><span class="tag">${L.wordsFromRead}</span><ul class="words">${ws.words.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
<div class="solution"><div class="ws">${ws.solution}</div><p class="tag" style="margin-top:1mm">${L.solution}</p></div></div>
</div>
<div class="journal">
<div><p class="colhead">${L.journal}</p><span class="tag">${L.promptLabel}</span><p class="prompt">${esc(E.prompt)}</p></div>
<div class="lines"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
</section>`;

    document.getElementById("daily").innerHTML = front + story + back;
    await document.fonts.ready;
  };

  // Después de paginar: pone el número real de la contratapa
  window.fixPageRefs = function () {
    const pages = [...document.querySelectorAll(".pagedjs_page")];
    const n = pages.findIndex((p) => p.querySelector(".back")) + 1;
    if (n > 0) document.querySelectorAll(".pg-back").forEach((el) => (el.textContent = n));
  };
})();
