// Where dinosaurs are dug up today, and where those places were when the
// animals lived (PBDB's GPlates palaeo-positions). The switch above the map
// changes the view; colour is the period. Today's coastlines are only drawn
// on today's map: in the Mesozoic the continents were elsewhere.
const BUTTON_H = 30;
const W = fit.width, H = Math.max(160, fit.height - BUTTON_H);
const rows = data.filter(d => d.lat != null && d.paleolat != null);
const views = {
  today: {label: "Where found today", x: "lng", y: "lat"},
  lived: {label: "Where they lived", x: "paleolng", y: "paleolat"}
};

const box = document.createElement("div");
const bar = document.createElement("div");
bar.style.cssText = `display:flex;gap:6px;align-items:center;height:${BUTTON_H}px;font:12px sans-serif`;
const holder = document.createElement("div");
box.append(bar, holder);

function draw(key) {
  const v = views[key];
  for (const b of bar.querySelectorAll("button")) b.style.opacity = b.dataset.key === key ? "1" : "0.55";
  holder.replaceChildren(plot({
    width: W, height: H,
    projection: {type: "equal-earth"},
    color: {legend: true, domain: ["Triassic", "Jurassic", "Cretaceous"]},
    marks: [
      Plot.sphere({strokeOpacity: 0.4}),
      Plot.graticule({strokeOpacity: 0.12}),
      key === "today" ? Plot.geo(atlas.land, {fill: "currentColor", fillOpacity: 0.12}) : null,
      Plot.dot(rows, {x: v.x, y: v.y, r: 2, fill: "period", fillOpacity: 0.65,
        channels: {Genus: "genus", Group: "clade", Interval: "interval", Age: d => `${d.max_ma}–${d.min_ma} Ma`},
        tip: true})
    ]
  }));
}
for (const [key, v] of Object.entries(views)) {
  const b = document.createElement("button");
  b.textContent = v.label;
  b.dataset.key = key;
  b.style.cssText = "padding:3px 10px;border:1px solid currentColor;border-radius:4px;background:transparent;color:inherit;cursor:pointer";
  b.onclick = () => draw(key);
  bar.append(b);
}
const note = document.createElement("span");
note.textContent = `${rows.length.toLocaleString()} finds · hover a dot for the genus`;
note.style.opacity = "0.6";
bar.append(note);
draw("today");
return box;