-- Every season-year against its season's pre-industrial climate: the anomaly in °C and in units of that season's year-to-year spread (z = anomaly / σ).
SELECT s.year, s.season, s.era, s.mean_tmin_c, s.days,
  ROUND(s.mean_tmin_c - b.base_mean_c, 2) AS anomaly_c,
  ROUND((s.mean_tmin_c - b.base_mean_c) / b.base_sd_c, 2) AS z,
  b.base_mean_c, b.base_sd_c, b.base_warmest_c,
  CASE WHEN s.mean_tmin_c > b.base_warmest_c THEN 'warmer than any 1850–1900 year' ELSE '' END AS outside
FROM data AS s JOIN data1 AS b ON s.season = b.season
ORDER BY s.season, s.year