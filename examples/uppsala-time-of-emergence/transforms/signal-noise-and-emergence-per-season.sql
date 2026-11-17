-- Per season: the pre-industrial mean and its year-to-year spread (σ, 1850-1900, the IPCC AR6 baseline), the last 30 years' mean,
-- the warming (signal) and signal-to-noise S/N = warming / σ. A season whose S/N is above ~2 has 'emerged': a typical year now lies outside the old climate's normal range.
SELECT b.season, b.n_base, ROUND(b.base_mean, 2) AS base_mean_c, ROUND(b.base_sd, 2) AS base_sd_c, ROUND(b.base_max, 2) AS base_warmest_c,
  r.n_recent, ROUND(r.recent_mean, 2) AS recent_mean_c,
  ROUND(r.recent_mean - b.base_mean, 2) AS warming_c,
  ROUND((r.recent_mean - b.base_mean) / b.base_sd, 2) AS signal_to_noise,
  r.above_base_max AS recent_warmer_than_any_base,
  ROUND(100.0 * r.above_base_max / r.n_recent, 0) AS recent_warmer_than_any_base_pct
FROM (
  SELECT season, COUNT(*) AS n_base, AVG(mean_tmin_c) AS base_mean, STDDEV(mean_tmin_c) AS base_sd, MAX(mean_tmin_c) AS base_max
  FROM data WHERE year BETWEEN 1850 AND 1900 GROUP BY season
) AS b
JOIN (
  SELECT d.season, COUNT(*) AS n_recent, AVG(d.mean_tmin_c) AS recent_mean,
    SUM(CASE WHEN d.mean_tmin_c > m.base_max THEN 1 ELSE 0 END) AS above_base_max
  FROM data AS d
  JOIN (SELECT season, MAX(mean_tmin_c) AS base_max FROM data WHERE year BETWEEN 1850 AND 1900 GROUP BY season) AS m ON d.season = m.season
  WHERE d.year BETWEEN 1996 AND 2025 GROUP BY d.season
) AS r ON b.season = r.season
ORDER BY b.season