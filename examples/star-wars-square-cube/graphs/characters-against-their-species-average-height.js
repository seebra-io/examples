// Each species' characters against the species' average height from SWAPI's species records: is the hero typical?
// data: species_sum {species, characters, mean_height_cm, min_height_cm, max_height_cm, species_avg_height, mean_bmi, classification, group, height_vs_average, wiki}
const rows = (Array.isArray(data) ? data : []).filter(d => d.mean_height_cm != null);
const order = d3.sort(rows, d => -(d.species_avg_height ?? d.mean_height_cm)).map(d => d.species);
return plot({
  height: Math.max(460, 15 * rows.length + 60),
  marginLeft: 190,
  x: {label: "height (cm) →", grid: true},
  y: {label: null, domain: order},
  color: {domain: ["human", "alien", "droid"], range: ["#3b82f6", "#f97316", "#71717a"], legend: true, label: "who"},
  marks: [
    Plot.tickX(rows.filter(d => d.species_avg_height != null), {y: "species", x: "species_avg_height", stroke: "currentColor", strokeWidth: 2, tip: true,
      channels: {"species average (cm)": "species_avg_height", classification: "classification"}}),
    Plot.ruleY(rows, {y: "species", x1: "min_height_cm", x2: "max_height_cm", stroke: "group", strokeOpacity: 0.5, strokeWidth: 3}),
    Plot.dot(rows, {y: "species", x: "mean_height_cm", fill: "group", r: d => 2 + 1.5 * Math.sqrt(d.characters), href: "wiki", target: "_blank", tip: true,
      channels: {characters: "characters", "mean height (cm)": "mean_height_cm", "range (cm)": d => `${d.min_height_cm}–${d.max_height_cm}`,
        "species average (cm)": "species_avg_height", "÷ average": "height_vs_average", "mean BMI": "mean_bmi", e: "names"}}),
  ],
  caption: "Black tick: the species' average height in SWAPI; dot: the mean of its characters (size = how many). Most named characters are within 15% of their species, "
    + "so the outliers in the mass chart are not just unusually tall individuals: Jabba is 58% of the Hutt average yet 19× too heavy, Grievous (a cyborg) 27% taller than a Kaleesh. "
    + "'Human (species not listed)' is SWAPI leaving the field empty: 32 people, nearly all human. Click a species for Wookieepedia.",
});