// Polymarket's open markets on the topic, one row per yes/no market: the
// price of Yes (0-1, read as the market's probability), the deadline it
// resolves by, and how much trading backs it. A "by ...?" event has one
// market per deadline: together they price the outcome over time.
(() => {
const events = Array.isArray(data) ? data : (data && data.events) || [];
// the ontology's outcome types, from the wording (first match wins)
const TOPICS = [["ceasefire", /ceasefire|truce/i], ["peace deal", /peace|agreement|deal|accord/i], ["territory", /territor|cede|sovereignty|control/i],
  ["leadership", /\bout\b|leader|\blead\b|president|regime|coup|election|resign|pahlavi|appearance/i], ["nuclear", /nuclear|enrich|uranium|iaea/i],
  ["escalation", /strike|attack|invade|war\b|clash|military|target|troops|mobiliz|blockade|closed|closure/i],
  ["diplomacy", /meet|talk|visit|summit|diplomat|recogni/i], ["alliances & guarantees", /nato|guarantee|security|alliance|withdraw/i], ["shipping & energy", /hormuz|strait|oil|shipping|traffic/i]];
const topicOf = t => (TOPICS.find(([, re]) => re.test(t)) || ["other"])[0];
const parse = s => { try { return typeof s === "string" ? JSON.parse(s) : s || []; } catch { return []; } };
const out = [];
for (const e of events) for (const m of e.markets || []) {
  const outcomes = parse(m.outcomes), prices = parse(m.outcomePrices).map(Number);
  if (m.closed || !m.active || outcomes[0] !== "Yes" || !isFinite(prices[0])) continue;
  out.push({
    event: e.title.trim(), question: m.question.trim(), topic: topicOf(e.title + " " + m.question),
    deadline: String(m.endDate || m.endDateIso || "").slice(0, 10),
    yes: +prices[0].toFixed(3),
    bid: m.bestBid ?? null, ask: m.bestAsk ?? null,
    spread: m.bestBid != null && m.bestAsk != null ? +(m.bestAsk - m.bestBid).toFixed(3) : null,
    change_1d: m.oneDayPriceChange ?? null,
    volume_usd: Math.round(+m.volumeNum || +m.volume || 0),
    liquidity_usd: Math.round(+m.liquidityNum || +m.liquidity || 0),
    // "X by date" should only rise with a later deadline; "X continues through date" only fall
    shape: /continu|through|remain|still/i.test(e.title) ? "survival" : /\bby\b|before/i.test(e.title + " " + m.question) ? "cumulative" : "single",
    url: "https://polymarket.com/event/" + e.slug, source: "Polymarket",
  });
}
return out.sort((a, b) => a.event.localeCompare(b.event) || a.deadline.localeCompare(b.deadline));
})()
