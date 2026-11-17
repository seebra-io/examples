// NeoWs keys its rows by date ({"2026-11-12": [...], ...}); the Rust steps read one array,
// so the days are put into one list here. Everything else is in the Polars steps.
Object.values(data.near_earth_objects).flat()