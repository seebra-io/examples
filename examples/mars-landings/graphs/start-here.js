// What this board shows, and where to go next. Read it first.
const box = document.createElement("div");
box.style.cssText = "font:14px/1.5 system-ui,sans-serif;padding:8px 14px;max-width:780px";
box.innerHTML = `
<h3 style="margin:0 0 6px;font-size:17px">Landing on Mars: 16 attempts, 10 that worked</h3>
<p style="margin:0 0 8px">Every spacecraft that tried to land on Mars, from the Soviet Mars 2 in 1971 to
China's Zhurong in 2021, on NASA's map and on a timeline. Hover a site for what happened there.
The positions are from each mission's Wikipedia article (linked in the table).</p>
<p style="margin:0 0 8px"><b>Look for:</b> most landings are within 30° of the equator and in low plains
and craters. Low ground means more air to slow down in, and near the equator the sun is strongest for solar
panels. Phoenix went far north on purpose, to dig for ice.</p>
<p style="margin:0 0 8px"><b>Go further:</b> the rovers to scale and what each one carries are in
<i>Mars rovers up close</i>; the newest photos from Perseverance and Curiosity in <i>Mars rovers: the latest
raw images</i>; NASA's 3D models in <i>Mars in 3D</i>.</p>
<p style="margin:0;opacity:.7">Mind: Mars 2's crash site is an estimate and Mars Polar Lander's is its
target. Not counted: Mars 7's lander (missed the planet), the Deep Space 2 probes, and missions that never
left Earth orbit. Coordinates are planetocentric, east longitudes.</p>`;
return box;