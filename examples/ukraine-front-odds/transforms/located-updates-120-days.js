// DeepState's update log, one row per place it names: the text links each
// place to the map (#zoom/lat/lon), so every update is a located event. Side
// from the wording: "the enemy advanced / occupied" is a Russian advance,
// "liberated / regained / Ukrainian forces advanced" a Ukrainian one. The
// last 120 days. These are reports of change, not every change: a quiet
// sector is unreported, not unchanged.
(() => {
const DAYS = 120, since = Date.now() / 1000 - DAYS * 86400;
const strip = s => String(s ?? "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const side = t => /\benemy\b.*\b(advanc|occup|captur|entered)|ворог/i.test(t) ? "Russian advance"
  : /liberat|regain|recaptur|(ukrain|defen[cs]e forces|zsu|afu).*advanc|звільн/i.test(t) ? "Ukrainian advance" : "other";
const out = [];
for (const e of (Array.isArray(data) ? data : []).filter(e => e.id >= since)) {
  const text = strip(e.descriptionEn) || strip(e.description);
  const links = [...String(e.descriptionEn || e.description).matchAll(/<a[^>]*href="[^"]*#(\d+)\/(-?[\d.]+)\/(-?[\d.]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  for (const [, zoom, lat, lon, place] of links)
    out.push({time: new Date(e.id * 1000).toISOString().slice(0, 16).replace("T", " "), date: new Date(e.id * 1000).toISOString().slice(0, 10),
              side: side(text), place: strip(place), lat: +lat, lon: +lon, text,
              url: `https://deepstatemap.live/#${zoom}/${lat}/${lon}`});
}
return out.sort((a, b) => b.time.localeCompare(a.time));
})()
