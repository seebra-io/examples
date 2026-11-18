// What this board shows, and where to go next. Read it first.
const by = (...s) => data.filter(d => s.includes(d.status)).length;
const box = document.createElement("div");
box.style.cssText = "font:14px/1.5 system-ui,sans-serif;padding:8px 14px;max-width:780px";
box.innerHTML = `
<h3 style="margin:0 0 6px;font-size:17px">The road to Mars: ${data.length} missions, and how sure they are</h3>
<p style="margin:0 0 8px">${by("On the way")} on the way, ${by("Funded", "Partly funded")} funded or partly funded,
${by("Proposed", "Uncertain")} proposed or uncertain, and ${by("Cancelled")} cancelled, as of
${data[0] ? data[0].as_of : ""}. On the timeline each launch is a pale range, from the earliest to the latest year the
sources support; the dot is the current target, where there is one. Hover a mission for its status and why.</p>
<p style="margin:0 0 8px"><b>Look for:</b> launches bunch up in the windows. Earth and Mars line up for a cheap
transfer about every 26 months, so the end of 2028 is crowded, and a mission that misses a window waits two
years. And the dates slip: the second chart shows how far.</p>
<p style="margin:0 0 8px"><b>Go further:</b> who is at Mars today in <i>Missions at Mars now</i>; every landing
so far in <i>Landing on Mars</i>; upcoming launches of every kind in <i>Upcoming rocket launches</i>.</p>
<p style="margin:0;opacity:.7">Mind: a target date is a plan, not a forecast. "Proposed" (and statements by
company founders) has no money behind it yet. The earliest-latest ranges are this board's reading of the
sources, not agency figures; the table names each row's sources and what is uncertain.</p>`;
return box;