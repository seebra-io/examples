// Volatility (spread of hourly log returns) against the week's log return
return plot({
  height: (fit?.height ?? 400) - 36,
  x: {label: "volatility: sd of hourly log returns, scaled to a day (%)", grid: true},
  y: {label: "7-day log return (%)", grid: true},
  marks: [
    Plot.ruleY([0]),
    Plot.dot(data, {x: "vol_daily_pct", y: "return_7d_pct", r: 5, fill: d => d.vol_daily_pct < 0.2 ? "#71717a" : "#38bdf8",
      tip: true, title: d => `${d.name} (${d.symbol.toUpperCase()})\nvolatility ${d.vol_daily_pct.toFixed(2)}% a day · 7-day log return ${d.return_7d_pct.toFixed(1)}%\n${d.hours} hourly returns`}),
    Plot.text(data, {x: "vol_daily_pct", y: "return_7d_pct", text: d => d.symbol.toUpperCase(), dx: 8, textAnchor: "start", fontSize: 10}),
  ],
  caption: "Log returns add up over time, so the week is the sum of the hours; the daily volatility is the hourly sd × √24, which assumes independent hours. Grey: stablecoins pegged to $1, whose moves are noise.",
});