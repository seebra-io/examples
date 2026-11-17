// Spotify's extended streaming history, one row per play. Times are UTC in the
// file (ts); here they are local time in Stockholm (change the zone below).
// Drop your own Streaming_History_Audio_*.json in place of the sample.
(() => {
  const ZONE = "Europe/Stockholm";
  const parts = new Intl.DateTimeFormat("en-GB", {timeZone: ZONE, year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", weekday: "short", hour12: false});
  const rows = Array.isArray(data) ? data : [];
  return rows
    .filter(r => r.master_metadata_track_name)   // podcasts and audiobooks have no track
    .map(r => {
      const p = Object.fromEntries(parts.formatToParts(new Date(r.ts)).map(x => [x.type, x.value]));
      return {
        played_at: r.ts,
        date: `${p.year}-${p.month}-${p.day}`,
        month: `${p.year}-${p.month}`,
        weekday: p.weekday,
        hour: +p.hour % 24,
        artist: r.master_metadata_album_artist_name,
        track: r.master_metadata_track_name,
        album: r.master_metadata_album_album_name,
        minutes: Math.round(r.ms_played / 600) / 100,
        skipped: !!r.skipped || r.ms_played < 30000,
        shuffle: !!r.shuffle,
        platform: r.platform
      };
    });
})()