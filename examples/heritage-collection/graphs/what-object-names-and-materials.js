// What: the 20 commonest object names (the museum's own word for a thing) and
// materials, over the whole set. Words are as the museum wrote them, in
// Swedish ("ben" is bone, "kärl" a vessel, "mynt" coins); a record with two
// materials counts under both. Hover a bar for its count and share of all
// the institution's records.
const fmt = (n) => n.toLocaleString("sv-SE");
const order = (kind) => data.filter((d) => d.kind === kind).sort((a, b) => b.records - a.records).map((d) => d.value);
const panel = (kind, color) => plot({
  height: Math.max(300, (fit?.height ?? 460) - 30),
  width: Math.floor((fit?.width ?? 900) / 2) - 8,
  marginLeft: 120,
  x: {label: "records", grid: true, tickFormat: "~s"},
  y: {label: null, domain: order(kind)},
  color: false,
  marks: [
    Plot.barX(data.filter((d) => d.kind === kind), {y: "value", x: "records", fill: color,
      channels: {[kind]: "value", records: (d) => fmt(d.records), "share of all records": (d) => `${d.share}%`, rank: "rank"},
      tip: {format: {x: false, y: false}}}),
    Plot.ruleX([0]),
    Plot.text([kind === "material" ? "Materials" : "Object names"], {frameAnchor: "top-right", fill: "currentColor", fontWeight: 600}),
  ],
});
const root = document.createElement("div");
root.style.display = "flex";
root.style.gap = "16px";
root.append(panel("object name", "#38bdf8"), panel("material", "#a78bfa"));
return root;
