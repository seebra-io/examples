// Every holiday of the coming week: a column per day, a row per country.
// Filled: nationwide; outlined: regional only. Hover for the local name and the regions.
const flag = (code) => String(code).toUpperCase().replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
const days = [...new Set(data.map((d) => d.date))].sort();
const label = (d) => `${flag(d.code)} ${d.country ?? d.code}`;
return plot({
  marginLeft: 150, marginTop: 30,
  x: {domain: days, axis: "top", label: null, tickFormat: (d) => d3.utcFormat("%a %e %b")(new Date(d))},
  y: {domain: [...new Set(data.map(label))], label: null},
  color: {domain: ["nationwide", "regional"], range: ["#2563eb", "#71717a"], label: "where"},
  marks: [
    Plot.cell(data, {x: "date", y: label, fill: (d) => d.nationwide ? "nationwide" : "regional", inset: 1.5, rx: 4,
      channels: {holiday: "holiday", "local name": "local_name", regions: "regions", types: "types"}, tip: true}),
    Plot.text(data, {x: "date", y: label, text: (d) => d.holiday.length > 18 ? d.holiday.slice(0, 17) + "…" : d.holiday, fill: "white", fontSize: 9}),
  ],
});