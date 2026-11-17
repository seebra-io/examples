// Manifold's open markets on the topic (play money, so a second opinion,
// not a price): the probability, when it closes, and how many traders.
(() => (Array.isArray(data) ? data : []).filter(m => m.outcomeType === "BINARY" && !m.isResolved && m.probability != null).map(m => ({
  question: m.question, yes: +m.probability.toFixed(3),
  closes: m.closeTime ? new Date(m.closeTime).toISOString().slice(0, 10) : null,
  traders: m.uniqueBettorCount ?? null, volume_mana: Math.round(m.volume || 0),
  url: m.url, source: "Manifold (play money)",
})).sort((a, b) => (b.traders || 0) - (a.traders || 0)))()
