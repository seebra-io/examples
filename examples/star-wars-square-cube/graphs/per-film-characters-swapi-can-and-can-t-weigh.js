// Awareness: how complete SWAPI is per film. Characters listed, how many have a mass, how many a species record.
// data: films_sum {title, episode, release_date, year, characters, weighed, measured, species_listed, share_weighed, trilogy, wiki}
const rows = Array.isArray(data) ? data : [];
const long = rows.flatMap(d => [
  {title: d.title, year: d.year, what: "weighed (mass known)", n: d.weighed, of: d.characters, wiki: d.wiki},
  {title: d.title, year: d.year, what: "no mass recorded", n: d.characters - d.weighed, of: d.characters, wiki: d.wiki},
]);
return plot({
  height: Math.max(300, (fit?.height ?? 340) - 40),
  marginLeft: 170,
  x: {label: "characters in SWAPI →", grid: true},
  y: {label: null, domain: rows.map(d => d.title), tickFormat: t => { const r = rows.find(d => d.title === t); return `${t} (${r.year})`; }},
  color: {domain: ["weighed (mass known)", "no mass recorded"], range: ["#3b82f6", "#d4d4d8"], legend: true},
  marks: [
    Plot.barX(long, {y: "title", x: "n", fill: "what", href: "wiki", target: "_blank", tip: true, channels: {"of characters": "of", year: "year"}}),
    Plot.dot(rows, {y: "title", x: "species_listed", symbol: "diamond", fill: "currentColor", r: 4, tip: true, channels: {"with a species record": "species_listed", film: "title"}}),
    Plot.ruleX([0]),
  ],
  caption: "The prequels list twice the characters of the original trilogy but weigh a smaller share (68–85% against 85–100%): many are CGI or briefly seen, and nobody recorded a mass. "
    + "Diamonds: characters with a species record (the originals are mostly humans, whom SWAPI leaves without one). SWAPI stops at Revenge of the Sith: no sequels, no series.",
});