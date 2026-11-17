// The tide as measured every hour, and what a gauge read once a day (or every 25 hours) shows.
const [samples] = data;
const rows = (samples || []).map(d => ({...d, time: new Date(d.t.replace(" ", "T") + ":00Z")}));
const truth = rows.filter(d => d.scheme === "every 1 h");
const show = ["every 24 h", "every 25 h", "daily mean (filtered)"];
const picked = rows.filter(d => show.includes(d.scheme));
const link = "https://tidesandcurrents.noaa.gov/waterlevels.html?id=9414290";
return plot({
  height: fit?.height ?? 420,
  x: {type: "utc", label: "date (UTC) →"},
  y: {label: "↑ water level above MLLW (m)", grid: true},
  color: {legend: true, domain: ["every 1 h", ...show], range: ["#d4d4d8", "#ea580c", "#9333ea", "#16a34a"], label: "how the gauge is read"},
  marks: [
    Plot.lineY(truth, {x: "time", y: "level_m", stroke: "scheme", strokeWidth: 0.7}),
    Plot.lineY(picked, {x: "time", y: "level_m", stroke: "scheme", strokeWidth: 1.6}),
    Plot.dot(picked, {x: "time", y: "level_m", fill: "scheme", r: 2.2, tip: true, href: () => link, target: "_blank",
      channels: {"read at (UTC)": "t", "level (m)": "level_m", scheme: "scheme"}}),
  ],
  caption: "Grey: the real tide at San Francisco, twice a day up and down. Orange: the same gauge read once a day at midnight UTC. "
    + "It shows a smooth wave with a period of about two weeks that is not in the water: each day the 12.42-hour lunar tide has moved on by 48 minutes, so a daily reading walks slowly along the tide curve. "
    + "Read every 25 hours (purple) it is slower and messier: M2 folds to about 81 days (longer than this record resolves) and the diurnal K1 to 23 days. Green: daily means, i.e. low-pass filtered before sampling: the tide averages out and no false wave appears. "
    + "That is Nyquist–Shannon: a sampler can only see frequencies below half its rate; anything faster is folded down, not lost, unless it is filtered out first.",
});