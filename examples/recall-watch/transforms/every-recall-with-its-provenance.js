// Every record in openFDA's three recall feeds, one row each, with where it
// came from: the record's own query (record_url), the feed, when openFDA last
// updated it and when this board read it. openFDA publishes weekly, so "new"
// here means in the feed's latest report; a source watch (Source watch →
// Discover) says what is new since its last check, with a SHA-256 and a
// Wayback Machine copy. Inputs: 0 drug enforcement, 1 food enforcement,
// 2 device recalls.
(() => {
const [drug, food, device] = Array.isArray(data) ? data : [data];
const day = s => { s = String(s ?? ""); return /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : s.slice(0, 10); };
const cut = (s, n) => { s = String(s ?? "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const roman = {"1": "Class I", "2": "Class II", "3": "Class III"};
const api = "https://api.fda.gov";
const feeds = [
  {feed: "drug", path: "/drug/enforcement.json", answer: drug, key: "recall_number", date: "report_date", cls: r => r.classification, status: r => r.status},
  {feed: "food", path: "/food/enforcement.json", answer: food, key: "recall_number", date: "report_date", cls: r => r.classification, status: r => r.status},
  {feed: "device", path: "/device/recall.json", answer: device, key: "product_res_number", date: "event_date_posted", cls: r => roman[String(r.openfda?.device_class ?? "")], status: r => r.recall_status},
];
const checked = new Date().toISOString().slice(0, 16) + "Z";
const out = [];
for (const f of feeds) {
  const rows = Array.isArray(f.answer?.results) ? f.answer.results : [];
  const latest = rows.map(r => day(r[f.date])).filter(Boolean).sort().at(-1);
  for (const r of rows) {
    const key = r[f.key];
    if (!key) continue;
    const reported = day(r[f.date]);
    out.push({
      feed: f.feed, key, reported,
      in_latest_report: reported === latest ? 1 : 0,
      days_before_latest: latest && reported ? Math.round((Date.parse(latest) - Date.parse(reported)) / 864e5) : null,
      class: f.cls(r) || "unclassified", status: f.status(r) || "",
      firm: cut(r.recalling_firm, 60), product: cut(r.product_description, 140), reason: cut(r.reason_for_recall, 160),
      record_url: `${api}${f.path}?search=${f.key}:%22${encodeURIComponent(key)}%22`,
      feed_url: `${api}${f.path}`, feed_updated: f.answer?.meta?.last_updated ?? null, read_at: checked,
    });
  }
}
return out;
})()
