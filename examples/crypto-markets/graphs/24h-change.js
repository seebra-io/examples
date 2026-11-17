// The day's move per coin (%), sorted; hover for price, size and the week
const usd = d3.format("$,.4~f");
return plot({
  marginLeft: 110,
  color: false,
  x: {label: "price change in 24 h (%)", grid: true},
  y: {label: null},
  marks: [
    Plot.ruleX([0]),
    Plot.barX(data, {y: "name", x: "change_24h", sort: {y: "-x"}, fill: d => d.change_24h >= 0 ? "#34d399" : "#f87171",
      tip: true, title: d => `${d.name} (${String(d.symbol).toUpperCase()}) ${usd(d.current_price)}\n` +
        `${d.change_24h > 0 ? "+" : ""}${d.change_24h}% in 24 h · ${d.change_7d > 0 ? "+" : ""}${d.change_7d}% in 7 days\n` +
        `market cap $${d.cap_bn} bn · traded ${d.turnover_pct}% of it in 24 h`}),
  ],
});