// When you listen: plays per hour of the day and day of the week (local time).
// Darker is more. Weekday mornings and evenings are usually commutes.
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
return plot({
  marginLeft: 40, padding: 0.05,
  x: {label: "Hour of the day", domain: [...Array(24).keys()], tickFormat: h => h % 3 ? "" : h},
  y: {label: null, domain: days},
  color: {scheme: "blues", legend: true, label: "Hours listened"},
  marks: [
    Plot.cell(data, Plot.group({fill: (ds) => Math.round(ds.reduce((s, d) => s + d.minutes, 0) / 6) / 10,
                                title: (ds) => `${ds[0].weekday} ${ds[0].hour}:00 · ${ds.length} plays, ${Math.round(ds.reduce((s, d) => s + d.minutes, 0))} minutes\n` +
                                               `most played: ${Object.entries(ds.reduce((m, d) => (m[d.artist] = (m[d.artist] || 0) + 1, m), {})).sort((a, b) => b[1] - a[1])[0][0]}`},
                               {x: "hour", y: "weekday", inset: 0.5}))
  ]
});