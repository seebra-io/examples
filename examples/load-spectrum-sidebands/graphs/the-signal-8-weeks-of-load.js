// The signal: 8 weeks of hourly load, weekends shaded.
const rows = Array.isArray(data) ? data : [];
const days = d3.groups(rows.filter(r => r.weekend), r => Math.floor(r.k / 24)).map(([d, rs]) => ({x1: d, x2: d + 1, weekday: rs[0].weekday}));
const link = "https://www.energy-charts.info/charts/power/chart.htm?l=en&c=DE&interval=week";
return plot({
  height: fit?.height ?? 300,
  x: {label: "days since Monday 24 Aug 2026 →", ticks: d3.range(0, 57, 7)},
  y: {label: "↑ load (GW)", grid: true},
  marks: [
    Plot.rectY(days, {x1: "x1", x2: "x2", y1: 30, y2: 75, fill: "#a1a1aa", fillOpacity: 0.15}),
    Plot.lineY(rows, {x: "day", y: "load_gw", stroke: "#2563eb", strokeWidth: 1}),
    Plot.tip(rows, Plot.pointerX({x: "day", y: "load_gw", href: () => link, target: "_blank",
      channels: {hour: "time", "load (GW)": "load_gw", "local hour": "local_hour", weekday: d => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d.weekday]}})),
  ],
  caption: "A daily cycle (the carrier) whose height changes with the day of the week (the modulation): five tall weekdays, a lower Saturday, a lowest Sunday (shaded). "
    + "In signal terms the load is roughly a daily waveform multiplied by a weekly envelope, and multiplying signals in time convolves their spectra.",
});