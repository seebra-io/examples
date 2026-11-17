-- Daily minimum temperature (TMIN, tenths of °C) at Uppsala, one row per day, without the days GHCN-D's quality checks flagged (Q_FLAG).
-- Seasons are meteorological; December counts toward the next year's winter (season_year), so a winter is Dec + Jan + Feb.
SELECT year, month, day, tmin_c,
  CASE WHEN month IN (12, 1, 2) THEN '1 winter (DJF)' WHEN month IN (3, 4, 5) THEN '2 spring (MAM)'
       WHEN month IN (6, 7, 8) THEN '3 summer (JJA)' ELSE '4 autumn (SON)' END AS season,
  CASE WHEN month = 12 THEN year + 1 ELSE year END AS season_year,
  -- day of the year (non-leap calendar; within a day)
  CASE month WHEN 1 THEN 0 WHEN 2 THEN 31 WHEN 3 THEN 59 WHEN 4 THEN 90 WHEN 5 THEN 120 WHEN 6 THEN 151
             WHEN 7 THEN 181 WHEN 8 THEN 212 WHEN 9 THEN 243 WHEN 10 THEN 273 WHEN 11 THEN 304 ELSE 334 END + day AS doy
FROM (
  SELECT CAST(FLOOR(DATE / 10000) AS INT) AS year,
         CAST(FLOOR(DATE / 100) - FLOOR(DATE / 10000) * 100 AS INT) AS month,
         CAST(DATE - FLOOR(DATE / 100) * 100 AS INT) AS day,
         DATA_VALUE / 10.0 AS tmin_c
  FROM data
  WHERE ELEMENT = 'TMIN' AND Q_FLAG IS NULL
) AS t