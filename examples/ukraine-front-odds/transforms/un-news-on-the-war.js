// UN News: the region's feed, kept to the topic, newest first. (GDELT's
// articles are their own step: GDELT often refuses, and a step waits for
// all its inputs.)
(() => {
const TOPIC = /ukrain|russia|kyiv|kremlin|zelensk|putin/i; // what counts as on topic in the feed
const unesc = s => String(s ?? "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
const tag = (x, t) => (x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) || [])[1];
return String(data ?? "").split("<item>").slice(1).map(x => ({
  date: new Date(unesc(tag(x, "pubDate"))).toISOString().slice(0, 16).replace("T", " "),
  title: unesc(tag(x, "title")), summary: unesc(tag(x, "description")).slice(0, 300),
  source: "UN News", url: unesc(tag(x, "link")),
})).filter(n => TOPIC.test(n.title + " " + n.summary)).sort((a, b) => b.date.localeCompare(a.date));
})()
