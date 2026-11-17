// The places the dashboard follows, with coordinates and a one-line
// description from their Wikipedia articles (each links back): Iran's main
// nuclear sites, Parchin, the oil terminal on Kharg Island, the port of
// Bandar Abbas and the Strait of Hormuz. A site without coordinates on
// Wikipedia (Isfahan's nuclear centre) isn't on the map.
(() => {
const KIND = {"Natanz Nuclear Facility": "nuclear: enrichment", "Fordow Uranium Enrichment Plant": "nuclear: enrichment",
  "Bushehr Nuclear Power Plant": "nuclear: power", "IR-40": "nuclear: heavy-water reactor", "Darkhovin Nuclear Power Plant": "nuclear: power (planned)",
  "Parchin": "military", "Kharg Island": "oil terminal", "Bandar Abbas": "port", "Strait of Hormuz": "chokepoint"};
const pages = (data && data.query && data.query.pages) || [];
return pages.filter(p => p.coordinates && p.coordinates.length).map(p => ({
  name: p.title, kind: KIND[p.title] || "site", lat: p.coordinates[0].lat, lon: p.coordinates[0].lon,
  description: p.description || "", url: p.fullurl || "https://en.wikipedia.org/wiki/" + encodeURIComponent(p.title.replace(/ /g, "_")),
}));
})()
