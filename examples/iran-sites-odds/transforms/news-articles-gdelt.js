// GDELT's English-language articles on the topic, newest first, one per
// title. GDELT allows one request every 5 seconds from an address and
// Seebra's requests share one: when it refuses (HTTP 429), rerun the query.
(() => {
const seen = new Set();
return (data && Array.isArray(data.articles) ? data.articles : []).map(a => ({
  date: String(a.seendate).replace(/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d).*/, "$1-$2-$3 $4:$5"),
  title: String(a.title || "").replace(/\s+([.,:;!?])/g, "$1").trim(), source: a.domain, country: a.sourcecountry || null, url: a.url,
})).filter(n => n.title && !seen.has(n.title.toLowerCase()) && seen.add(n.title.toLowerCase()));
})()
