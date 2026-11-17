-- Months are circular (December is next to January), so the season's centre is
-- a mean direction: each month is an angle on the year's clock, weighted by its share.
-- R (0..1) is how concentrated the season is; the circular SD sqrt(-2 ln R) is its spread.
-- The effort-corrected direction weights by enrichment instead (share / all fungi's share).
SELECT species, latin, taxon_key, SUM(records) AS records,
  MOD(DEGREES(ATAN2(SUM(share * SIN(2 * PI() * (month - 0.5) / 12)), SUM(share * COS(2 * PI() * (month - 0.5) / 12)))) + 360, 360) / 30 AS mean_pos,
  SQRT(SUM(share * SIN(2 * PI() * (month - 0.5) / 12)) * SUM(share * SIN(2 * PI() * (month - 0.5) / 12)) + SUM(share * COS(2 * PI() * (month - 0.5) / 12)) * SUM(share * COS(2 * PI() * (month - 0.5) / 12))) AS r,
  MOD(DEGREES(ATAN2(SUM(enrichment * SIN(2 * PI() * (month - 0.5) / 12)), SUM(enrichment * COS(2 * PI() * (month - 0.5) / 12)))) + 360, 360) / 30 AS corrected_pos,
  SQRT(SUM(enrichment * SIN(2 * PI() * (month - 0.5) / 12)) * SUM(enrichment * SIN(2 * PI() * (month - 0.5) / 12)) + SUM(enrichment * COS(2 * PI() * (month - 0.5) / 12)) * SUM(enrichment * COS(2 * PI() * (month - 0.5) / 12))) / SUM(enrichment) AS corrected_r,
  concat('https://www.gbif.org/species/', taxon_key) AS link,
  concat('https://www.gbif.org/occurrence/map?country=SE&year=2000,2025&taxon_key=', taxon_key) AS map
FROM data
GROUP BY species, latin, taxon_key