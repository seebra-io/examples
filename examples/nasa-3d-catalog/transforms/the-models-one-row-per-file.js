// One row per 3D file, from the WordPress media records of science.nasa.gov
// (every input is one page of /media, or the STL list). Titles carry HTML
// entities (&#8211;) and the file's extension; the size is a string.
(() => {
const ent = s => String(s ?? "").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, "&").replace(/&quot;/g, '"');
const where = u => {
  const p = String(u).split("/content/dam/science/")[1] || "";
  if (p.startsWith("cds/3d/resources")) return "NASA 3D Resources";
  if (p.startsWith("psd/solar")) return "Solar system";
  if (p.startsWith("psd/mars")) return "Mars";
  if (p.startsWith("astro/")) return "Astrophysics";
  const m = p.match(/^missions\/([^/]+)/);
  if (m) return "Mission: " + m[1].replace(/-/g, " ");
  return "Site uploads";
};
const seen = new Set();
const pages = Array.isArray(data) && data.length && data.every(Array.isArray) ? data : [data];
return pages.flat().filter(r => r && r.source_url && !seen.has(r.id) && seen.add(r.id)).map(r => {
  const url = String(r.source_url).split("?")[0];
  const title = ent(r.title && r.title.rendered).replace(/\.(glb|gltf|stl)$/i, "").trim();
  const format = (url.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase() ?? "?";
  const bytes = +((r.media_details && r.media_details.filesize) || 0);
  return {
    id: r.id, title, format,
    family: title.replace(/\s*\((?:[A-Z]|launch|mapping|MOI|antenna|without [^)]*)\)/g, "").trim(),
    collection: where(url),
    mb: bytes ? Math.round(bytes / 1e4) / 100 : null,
    added: String(r.date || "").slice(0, 10),
    url,
  };
});
})()