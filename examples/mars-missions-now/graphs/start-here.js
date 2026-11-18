// What this board shows, and where to go next. Read it first.
const working = data.filter(d => d.status === "Working");
const box = document.createElement("div");
box.style.cssText = "font:14px/1.5 system-ui,sans-serif;padding:8px 14px;max-width:780px";
box.innerHTML = `
<h3 style="margin:0 0 6px;font-size:17px">Missions at Mars now: ${working.length} spacecraft at work</h3>
<p style="margin:0 0 8px">${working.filter(d => d.where === "On the ground").length} on the ground and
${working.filter(d => d.where === "In orbit").length} in orbit, from
${new Set(working.map(d => d.agency.split(" ")[0])).size} space agencies, as of ${data[0] ? data[0].as_of : ""}.
Below: how long each has been there, where the surface missions are, how high the orbiters fly, and a table
with what each one carries and a source for its status.</p>
<p style="margin:0 0 8px"><b>Look for:</b> the fleet is old. Mars Odyssey has orbited since 2001 and Mars Express
since 2003, and most of what the rovers send home is relayed by orbiters built for other jobs. The
fleet shrinks too: MAVEN went silent in December 2025, and Odyssey is nearly out of fuel. Two new missions,
ESCAPADE and MMX, are on their way for 2027.</p>
<p style="margin:0 0 8px"><b>Go further:</b> how they got there in <i>Landing on Mars</i>; what the rovers carry,
part by part, in <i>Mars rovers up close</i>; their newest photos in <i>Mars rovers: the latest raw images</i>;
who is going next in <i>The road to Mars</i>.</p>
<p style="margin:0;opacity:.7">Mind: "working" is the last status a source states (see status_as_of in the
table); a spacecraft can fall silent between updates. Orbits are the science orbits' altitudes above the
surface, rounded; they change as missions adjust them.</p>`;
return box;