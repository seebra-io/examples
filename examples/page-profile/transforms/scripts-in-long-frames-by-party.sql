-- Where the main thread's time went: every script that ran in a long animation frame (LoAF, ≥ 50 ms), grouped by where it came from.
-- party: this page's own code, a third party (analytics, consent, payments, the CDN's bot check...), or no URL (the browser, an extension, an inline handler).
SELECT s.origin, s.file, s.name, s.detail AS invoker_type,
  CASE WHEN s.origin IS NULL OR s.origin = '' THEN 'no source URL'
       -- Cloudflare injects its bot challenge under the page's own origin (/cdn-cgi/)
       WHEN s.name LIKE '%/cdn-cgi/%' THEN 'third party'
       WHEN s.origin = p.page_origin THEN 'this page (Seebra)' ELSE 'third party' END AS party,
  COUNT(*) AS runs, ROUND(SUM(s.duration_ms), 1) AS total_ms, ROUND(MAX(s.duration_ms), 1) AS longest_ms,
  ROUND(SUM(COALESCE(s.style_layout_ms, 0)), 1) AS forced_layout_ms,
  SUM(CASE WHEN s.moving THEN 1 ELSE 0 END) AS runs_while_moving
FROM data AS s
CROSS JOIN (SELECT MAX(origin) AS page_origin FROM data WHERE kind = 'navigation') AS p
WHERE s.kind = 'script'
GROUP BY s.origin, s.file, s.name, s.detail, p.page_origin
ORDER BY total_ms DESC