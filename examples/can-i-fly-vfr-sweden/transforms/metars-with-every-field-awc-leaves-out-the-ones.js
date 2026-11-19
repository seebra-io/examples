// AWC's JSON leaves a field out when no station in the box reports it:
// no gusts anywhere, no wxString. The decoding next reads both, and a
// missing column failed it ("not found: wgst"), so they're null here
data.map((r) => ({ wgst: null, wxString: null, ...r }))
