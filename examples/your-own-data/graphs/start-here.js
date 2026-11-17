// What this dashboard is, as a card: read it first.
const box = document.createElement("div");
box.style.cssText = "font:14px/1.5 system-ui,sans-serif;padding:8px 14px;max-width:760px";
box.innerHTML = `
<h3 style="margin:0 0 6px;font-size:17px">Your own data, out of the platforms and into view</h3>
<p style="margin:0 0 8px">Under the GDPR every platform must give you a copy of your data (Article 15) in a
machine-readable form (Article 20). The <b>guide</b> says where to ask, which file in the export matters and
what to look at. The two worked examples run on <b>made-up sample files</b> shaped exactly like the real ones:</p>
<ul style="margin:0 0 8px 18px;padding:0">
<li><b>Spotify</b>: <code>Streaming_History_Audio_*.json</code> → listening clock, artists by month, skips</li>
<li><b>Netflix</b>: <code>NetflixViewingHistory.csv</code> → a viewing calendar and binges</li></ul>
<p style="margin:0 0 8px"><b>To use your own:</b> drop the file on the board, then point the transformation
(<i>Plays</i> or <i>Titles</i>) at it instead of the sample. Your file stays in your browser unless you save
the dashboard.</p>
<p style="margin:0;opacity:.7">Mind: exports are a snapshot; times may be UTC; other people appear in your
data (messages, shared playlists), so keep what is theirs private.</p>`;
return box;