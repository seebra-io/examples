// Frequency of frequencies: how many species have 1, 2, 3, ... records. Chao1 reads only the first two bars.
const rows = Array.isArray(data) ? data : [];
const provinces = ["Skåne", "Gotland", "Norrbotten"];
return plot({
  height: Math.max(320, (fit?.height ?? 400) - 40),
  color: {domain: provinces, range: ["#f97316", "#38bdf8", "#a3e635"], legend: true},
  x: {type: "log", label: "records of the species (log scale) →", grid: true},
  y: {type: "log", label: "↑ number of species (log scale)", grid: true},
  marks: [
    Plot.line(rows, {x: "records", y: "species", stroke: "province", strokeOpacity: 0.4}),
    Plot.dot(rows, {x: "records", y: "species", fill: "province", r: 2.5, tip: true,
      title: d => `${d.province}: ${d.species} species with ${d.records} record${d.records === 1 ? "" : "s"}`}),
  ],
  caption: "Many species are singletons (seen once): the long tail of rare species is why the curves keep rising. "
    + "Good–Turing: the chance that the next record is a species not yet seen is about singletons / records. Species are GBIF keys at species rank; records not identified to species are left out.",
});