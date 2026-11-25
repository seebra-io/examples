// The institution's records in K-samsök at a glance: how many, and how many
// of them a visitor can find on a map, on a time line and in a picture, and
// may reuse (a licence). Counted over the whole set by K-samsök (facets), so
// no sampling here. Hover a tile for the counts and what it means; the list
// below says what each slide shows and how much of it is a sample.
const width = fit?.width ?? 900;
const [types = [], samples = [], objects = []] = data;
const sum = (k) => types.reduce((s, t) => s + (t[k] || 0), 0);
const total = sum("records");
const fmt = (n) => (n == null ? "?" : n.toLocaleString("sv-SE"));
const pct = (k, n) => (n ? (100 * k) / n : 0);
const name = (objects.find((o) => o.set !== "parish" && o.institution && o.institution !== o.org) || {}).institution
  || (objects.find((o) => o.set !== "parish") || {}).org || "This institution";

const GOOD = "#22c55e", MID = "#f59e0b", BAD = "#ef4444";
const tone = (p) => (p >= 80 ? GOOD : p >= 40 ? MID : BAD);
const tiles = [
  {label: "have coordinates", have: total - sum("no_coordinates"), of: total,
   about: "Records with a point or outline (geoDataExists). Without one, a record is on no map built from K-samsök, this one included."},
  {label: "are dated", have: total - sum("no_dating"), of: total,
   about: "Records with a time (timeInfoExists): a year, a range or a period. Without one, a record is on no time line."},
  {label: "have a picture", have: total - sum("no_image"), of: total,
   about: "Records whose K-samsök entry carries a thumbnail (thumbnailExists). A museum may hold photographs as separate media records: then the object itself counts as without one here, because that is what a K-samsök search shows."},
  {label: "pictures with a licence", have: sum("with_image") - sum("image_no_licence"), of: sum("with_image"),
   about: "Of the records with a picture, those whose picture states a licence (mediaLicense). A picture without one cannot be reused safely."},
  {label: "records with a licence", have: total - sum("no_licence"), of: total,
   about: "Records whose metadata states a licence (itemLicense), usually CC0."},
];

const root = d3.create("div").style("width", width + "px").style("font", "13px system-ui, sans-serif").style("color", "currentColor");
root.append("div").style("font-size", "20px").style("font-weight", "600").text(`${name}: ${fmt(total)} records in K-samsök`);
root.append("div").style("opacity", 0.7).style("margin", "2px 0 14px")
  .text("Share of all its records, counted by K-samsök over the whole set. Hover a tile for the counts.");

const row = root.append("div").style("display", "grid").style("gap", "10px")
  .style("grid-template-columns", `repeat(auto-fit, minmax(${Math.max(150, Math.floor(width / 5) - 12)}px, 1fr))`);
for (const t of tiles) {
  const p = pct(t.have, t.of);
  const tile = row.append("div").style("border", "1px solid #3f3f46").style("border-radius", "8px").style("padding", "10px 12px")
    .style("cursor", "default");
  tile.append("div").style("font-size", "26px").style("font-weight", "700").style("color", tone(p))
    .text(t.of ? `${p < 1 && p > 0 ? p.toFixed(1) : Math.round(p)}%` : "–");
  tile.append("div").style("opacity", 0.85).text(t.label);
  const bar = tile.append("div").style("height", "6px").style("background", "#3f3f46").style("border-radius", "3px").style("margin-top", "8px");
  bar.append("div").style("height", "6px").style("width", `${p}%`).style("background", tone(p)).style("border-radius", "3px");
  tile.on("pointermove", (event) => seebra.tooltip.show(
    `<b>${fmt(t.have)} of ${fmt(t.of)}</b> records ${t.label}<br>${fmt(Math.max(0, t.of - t.have))} without<br><br>${t.about}<br><br><i>By record type: the Gaps slide.</i>`, event))
    .on("pointerleave", () => seebra.tooltip.hide());
}

// what is on the board, and how much of it is a sample
const s = Object.fromEntries(samples.map((x) => [x.set, x]));
const lines = [
  ["Where", s["place sample"] ? `a map of ${fmt(s["place sample"].shown)} of the ${fmt(s["place sample"].of)} records that have coordinates (one page, in K-samsök's order: a sample, not the whole set)` : "a map of the records that have coordinates"],
  ["When", "records per century of dating, over the whole set (a record dated over several centuries counts in each)"],
  ["What", "the 20 commonest object names and materials, over the whole set"],
  ["Pictures", s["image sample"] ? `${fmt(s["image sample"].shown)} of ${fmt(s["image sample"].of)} pictures, each with its licence, credit and a link to the record` : "pictures with licence and record"],
  ["Gaps", "what is missing (coordinates, dating, picture, licence) by record type and by the 25 commonest object names, over the whole set: for public-access reporting"],
  ["Wider", "the parish parameter's ancient monuments in Fornsök, and which other institutions hold records from it"],
];
const list = root.append("div").style("margin-top", "16px").style("display", "grid").style("grid-template-columns", "max-content 1fr")
  .style("gap", "4px 12px");
for (const [k, v] of lines) {
  list.append("div").style("font-weight", "600").text(k);
  list.append("div").style("opacity", 0.85).text(v);
}
root.append("div").style("margin-top", "14px").style("opacity", 0.6).style("font-size", "12px")
  .html(`Source: <a href="https://www.raa.se/hitta-information/k-samsok/" target="_blank" style="color:inherit">K-samsök</a>, Riksantikvarieämbetet, live. ` +
        `What K-samsök shows can lag the museum's own system by its last harvest. ` +
        `Another institution: set <b>org</b> in Parameters (K-samsök's serviceOrganization code: shm, nomu, jlm, upmu, …).`);
return root.node();
