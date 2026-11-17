-- The page's vitals from this session, one row (good below: TTFB 800 ms, FCP 1,800 ms, LCP 2,500 ms, TBT 200 ms, INP 200 ms; web.dev).
-- Total blocking time sums the part over 50 ms of every long frame in the session (Lighthouse counts only those between first contentful paint and interactive);
-- the slowest interaction estimates INP (Interaction to Next Paint).
SELECT
  MAX(CASE WHEN kind = 'navigation' THEN blocking_ms END) AS time_to_first_byte_ms,
  MIN(CASE WHEN kind = 'paint' AND name = 'first-paint' THEN start_ms END) AS first_paint_ms,
  MIN(CASE WHEN kind = 'paint' AND name = 'first-contentful-paint' THEN start_ms END) AS first_contentful_paint_ms,
  MAX(CASE WHEN kind = 'lcp' THEN start_ms END) AS largest_contentful_paint_ms,
  SUM(CASE WHEN kind IN ('frame', 'task') THEN 1 ELSE 0 END) AS long_frames,
  ROUND(SUM(CASE WHEN kind IN ('frame', 'task') THEN COALESCE(blocking_ms, 0) ELSE 0 END), 0) AS total_blocking_ms,
  MAX(CASE WHEN kind = 'interaction' THEN duration_ms END) AS slowest_interaction_ms,
  SUM(CASE WHEN kind = 'resource' THEN 1 ELSE 0 END) AS resources,
  ROUND(MAX(start_ms + COALESCE(duration_ms, 0)) / 1000.0, 1) AS session_s
FROM data