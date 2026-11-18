// The surface missions on NASA's colour map of Mars (Viking mosaic, east
// longitudes, -180 to 180). Hover a site for the mission, its status and where it is now.
// Ingenuity rests a few km from Perseverance's landing site; its final site has no sourced coordinates.
// data: [missions, the map image]
const [all, tex] = data;
const ST = ["Working", "Silent", "Ended", "On the way"];
const SC = ["#4ade80", "#facc15", "#94a3b8", "#60a5fa"];
const rows = all.filter(d => d.where === "On the ground" && d.lat != null);
const mL = 40, mR = 16, mT = 24, mB = 34;
const W = fit.width, H = Math.round((W - mL - mR) / 2) + mT + mB;
const side = {"Ingenuity": "below", "Perseverance": "above", "Curiosity": "below", "InSight": "above", "Zhurong": "above"};
const pos = d => side[d.name] || "above";
const lab = (where, o) => Plot.text(rows.filter(d => pos(d) === where), {x: "lon", y: "lat", text: "name",
  fill: "white", stroke: "black", strokeWidth: 3, paintOrder: "stroke", fontSize: 11, ...o});
return plot({
  width: W, height: H, marginLeft: mL, marginRight: mR, marginTop: mT, marginBottom: mB,
  x: {domain: [-180, 180], ticks: d3.range(-180, 181, 60), label: "Longitude (°E)", tickFormat: d => d + "°"},
  y: {domain: [-90, 90], ticks: d3.range(-90, 91, 30), label: "Latitude", tickFormat: d => d + "°"},
  caption: "Circle: rover. Square: lander. Positions are the landing sites; the rovers have driven on from there (hover for where they are now).",
  color: {legend: true, domain: ST.filter(s => rows.some(d => d.status === s)), range: ST.map((s, i) => SC[i]).filter((c, i) => rows.some(d => d.status === ST[i]))},
  marks: [
    (index, {x, y}) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      if (tex && tex.data) {
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", tex.data);
        img.setAttribute("x", x(-180)); img.setAttribute("y", y(90));
        img.setAttribute("width", x(180) - x(-180)); img.setAttribute("height", y(-90) - y(90));
        img.setAttribute("preserveAspectRatio", "none");
        g.appendChild(img);
      }
      return g;
    },
    Plot.gridX({stroke: "white", strokeOpacity: 0.15}),
    Plot.gridY({stroke: "white", strokeOpacity: 0.15}),
    Plot.dot(rows, {x: "lon", y: "lat", fill: "status", stroke: "black", strokeWidth: 1.5, r: 7,
      symbol: d => d.kind === "Rover" ? "circle" : d.kind === "Helicopter" ? "triangle" : "square"}),
    Plot.dot(rows, {x: "lon", y: "lat", r: 10, fill: "white", fillOpacity: 0,
      tip: true, channels: {Mission: "name", Agency: "agency", Kind: "kind", Landed: "arrived", Site: "site",
        "Now": "now_at", Status: "status_note"}}),
    lab("above", {dy: -13}), lab("below", {dy: 14})
  ]
});