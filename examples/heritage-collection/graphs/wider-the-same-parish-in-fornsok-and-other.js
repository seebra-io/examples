// Wider: one parish (the parish parameter) beyond this collection. Left, its
// ancient monuments and sites in RAÄ's register (Fornsök), with this
// institution's records from the parish on top; click a monument for its
// page in Fornsök. Right, every institution in K-samsök with records from the
// parish; click a bar to open this same board for that institution. Pick
// another parish from the map (click a dot: it names the parish).
const [sites = [], orgs = [], places = []] = data;
const fmt = (n) => n.toLocaleString("sv-SE");
const parish = (sites.find((d) => d.parish) || {}).parish || "the parish";
const own = places.filter((d) => d.parish && d.parish.toLowerCase() === parish.toLowerCase());
const w = fit?.width ?? 900, h = Math.max(320, (fit?.height ?? 480) - 20);
const map = plot({
  width: Math.floor(w * 0.55), height: h,
  projection: sites.length ? {type: "mercator", domain: {type: "MultiPoint", coordinates: sites.concat(own).map((d) => [d.lon, d.lat])}, inset: 20} : undefined,
  color: false,
  marks: [
    Plot.frame({stroke: "#3f3f46"}),
    Plot.dot(sites, {x: "lon", y: "lat", r: 4, fill: "#22c55e", fillOpacity: 0.75, href: "record", target: "_blank",
      channels: {monument: "label", parish: "parish", municipality: "municipality"}, tip: {format: {x: false, y: false}}}),
    Plot.dot(own, {x: "lon", y: "lat", r: 6, symbol: "star", fill: "#f59e0b", href: "record", target: "_blank",
      channels: {record: "label", dated: "dated", type: "type"}, tip: {format: {x: false, y: false}}}),
    Plot.text([`${parish}: ${sites.length} monuments from Fornsök (green, click for Fornsök)` + (own.length ? `, ${own.length} of this board's records (stars)` : "")],
      {frameAnchor: "top-left", dx: 6, dy: 6, fill: "currentColor", fontSize: 11}),
  ],
});
const bars = plot({
  width: Math.floor(w * 0.42), height: Math.max(180, 40 + 26 * orgs.length), marginLeft: 150,
  x: {label: `records from ${parish}`, grid: true, type: "log", tickFormat: "~s"},
  y: {label: null, domain: orgs.slice().sort((a, b) => b.records - a.records).map((d) => d.institution)},
  color: false,
  marks: [
    Plot.barX(orgs, {y: "institution", x1: 0.8, x2: "records", fill: "#38bdf8", href: "board", target: "_blank",
      channels: {institution: "institution", code: "org", records: (d) => fmt(d.records)}, tip: {format: {x1: false, x2: false, y: false}}}),
    Plot.text(["Who holds records from it (click: this board for them)"], {frameAnchor: "top-left", dx: -146, dy: -14, fill: "currentColor", fontSize: 11}),
  ],
});
const root = document.createElement("div");
root.style.display = "flex";
root.style.gap = "16px";
root.style.alignItems = "flex-start";
root.append(map, bars);
return root;
