// Every landing attempt on NASA's colour map of Mars (Viking mosaic, east
// longitudes, 180°W to 180°E). Hover a site for what happened there.
// data: [landings, the map image]
const [rows, tex] = data;
const OUT = ["Worked", "Landed, then went silent", "Lost on the way down"];
const COL = ["#4ade80", "#facc15", "#f87171"];
const mL = 40, mR = 16, mT = 24, mB = 34;
const W = fit.width, H = Math.round((W - mL - mR) / 2) + mT + mB;   // 1° east = 1° north
// Labels sit beside the dot, on the side with room (close neighbours split).
const side = {"Opportunity": "left", "Schiaparelli": "below", "InSight": "above", "Curiosity": "below",
              "Viking 2": "above", "Viking 1": "left", "Spirit": "below", "Mars 2": "right", "Mars 3": "right"};
const pos = d => side[d.name] || "above";
const lab = (where, o) => Plot.text(rows.filter(d => pos(d) === where), {x: "lon", y: "lat", text: "name",
  fill: "white", stroke: "black", strokeWidth: 3, paintOrder: "stroke", fontSize: 11, ...o});
return plot({
  width: W, height: H, marginLeft: mL, marginRight: mR, marginTop: mT, marginBottom: mB,
  x: {domain: [-180, 180], ticks: d3.range(-180, 181, 60), label: "Longitude (°E)", tickFormat: d => d + "°"},
  y: {domain: [-90, 90], ticks: d3.range(-90, 91, 30), label: "Latitude", tickFormat: d => d + "°"},
  color: {legend: true, domain: OUT, range: COL},
  marks: [
    // the map, stretched over the whole frame (only when the image loaded)
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
    // crashes are a cross (a black halo under it so it reads on the map), the rest a dot
    Plot.dot(rows.filter(d => d.outcome === "Lost on the way down"), {x: "lon", y: "lat", symbol: "times", r: 7, stroke: "black", strokeWidth: 5}),
    Plot.dot(rows.filter(d => d.outcome === "Lost on the way down"), {x: "lon", y: "lat", symbol: "times", r: 7, stroke: "outcome", strokeWidth: 2.5}),
    Plot.dot(rows.filter(d => d.outcome !== "Lost on the way down"), {x: "lon", y: "lat", fill: "outcome", stroke: "black", strokeWidth: 1.5, r: 6}),
    Plot.dot(rows, {x: "lon", y: "lat", r: 9, fill: "white", fillOpacity: 0,
      tip: true, channels: {Mission: "mission", Agency: "agency", Landed: "landed", Site: "site",
        "Landing system": "landing_system", Rover: "rover", "What happened": "what_happened"}}),
    lab("above", {dy: -12}), lab("below", {dy: 13}),
    lab("left", {dx: -9, textAnchor: "end"}), lab("right", {dx: 9, textAnchor: "start"})
  ]
});