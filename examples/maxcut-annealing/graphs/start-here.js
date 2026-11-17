// What this board shows, and where to go next. Read it first.
const g = data[0];
const box = document.createElement("div");
box.style.cssText = "font:14px/1.5 system-ui,sans-serif;padding:8px 14px;max-width:800px";
box.innerHTML = `
<h3 style="margin:0 0 6px;font-size:17px">Max-cut three ways: try them all, anneal, or ask a quantum annealer</h3>
<p style="margin:0 0 8px"><b>The problem:</b> split the nodes of a graph into two groups so that as many links as
possible run between the groups. It sounds simple, but no known method solves every case fast: the work grows
exponentially with the size. It stands for many real problems (splitting a circuit across two chips, assigning
two frequencies so that neighbours differ, finding two camps in a network).</p>
<p style="margin:0 0 8px"><b>Here, on ${g.name.toLowerCase()} (${g.n} nodes, ${g.m} links):</b>
<b>1. Try them all.</b> ${(2 ** (g.n - 1)).toLocaleString()} splits, exact, and still quick at this size.
<b>2. Simulated annealing.</b> Start anywhere, move one node at a time, accept worse moves less and less often as
the "temperature" falls. Fast, but it can get stuck: the study asks whether a slower schedule helps.
<b>3. A quantum annealer.</b> D-Wave's QPU finds low-energy states of an Ising model, E = Σ J<sub>ij</sub> s<sub>i</sub> s<sub>j</sub>
with spins s = ±1. Set J = +1 on every link and E = (links uncut − links cut), so the lowest energy <i>is</i> the
maximum cut. The machine anneals too, but with quantum fluctuations instead of heat.</p>
<p style="margin:0 0 8px"><b>Look for:</b> how rare the best cut is among all splits (the landscape), and how the
share of annealing runs that find it rises with the schedule.</p>
<p style="margin:0 0 8px"><b>Change it:</b> pick another graph in the <i>Graph</i> step (the Petersen graph, 22
random nodes, or a grid, where the best split must cut every link).
<b>Next:</b> a board that sends this same graph to D-Wave's QPU with your own Leap token.</p>
<p style="margin:0;opacity:.7">Mind: at this size a laptop is exact, so nothing here needs a quantum computer; the
point is to see the landscape and the method. Whether quantum annealing beats the best classical methods on
large problems is an open research question, not a settled fact.</p>`;
return box;