-- the same law fitted on overlapping groups: everyone, everyone but Jabba (1,358 kg), humans, aliens
SELECT 'all 59 weighed' AS grp, name, log_h AS x, log_m AS y FROM data WHERE mass_kg IS NOT NULL AND height_cm IS NOT NULL
UNION ALL
SELECT 'all but Jabba' AS grp, name, log_h AS x, log_m AS y FROM data WHERE mass_kg IS NOT NULL AND height_cm IS NOT NULL AND name NOT LIKE 'Jabba%'
UNION ALL
SELECT 'humans' AS grp, name, log_h AS x, log_m AS y FROM data WHERE mass_kg IS NOT NULL AND height_cm IS NOT NULL AND "group" = 'human'
UNION ALL
SELECT 'aliens but Jabba' AS grp, name, log_h AS x, log_m AS y FROM data WHERE mass_kg IS NOT NULL AND height_cm IS NOT NULL AND "group" = 'alien' AND name NOT LIKE 'Jabba%'