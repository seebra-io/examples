// Netflix's viewing history (NetflixViewingHistory.csv): one row per title and
// day, newest first. Title holds series, season and episode in one string;
// Date is in your account's locale (here M/D/YY).
(() => {
  const rows = Array.isArray(data) ? data : [];
  const date = (s) => {
    const m = String(s).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (!m) return String(s);
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  };
  return rows.map(r => {
    const parts = String(r.Title).split(": ");
    const series = parts.length >= 3 ? parts[0] : "";
    const d = date(r.Date);
    return {
      date: d,
      weekday: new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", {weekday: "short", timeZone: "UTC"}),
      kind: series ? "episode" : "film",
      series: series || r.Title,
      season: parts.length >= 3 ? parts[1] : "",
      episode: parts.length >= 3 ? parts.slice(2).join(": ") : "",
      title: r.Title
    };
  });
})()