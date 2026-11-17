SELECT 'Δχ threshold' AS rule, COUNT(*) AS compounds, SUM(CASE WHEN stump_right THEN 1 ELSE 0 END) AS correct,
  AVG(CASE WHEN stump_right THEN 1.0 ELSE 0.0 END) AS accuracy FROM data WHERE stump_right IS NOT NULL
UNION ALL
SELECT 'Fisher line on (Δχ, n̄)' AS rule, COUNT(*) AS compounds, SUM(CASE WHEN lda_right THEN 1 ELSE 0 END) AS correct,
  AVG(CASE WHEN lda_right THEN 1.0 ELSE 0.0 END) AS accuracy FROM data WHERE lda_right IS NOT NULL
UNION ALL
SELECT 'always the majority class' AS rule, COUNT(*) AS compounds,
  GREATEST(SUM(CASE WHEN coordination = 'tetrahedral (4)' THEN 1 ELSE 0 END), SUM(CASE WHEN coordination = 'octahedral (6)' THEN 1 ELSE 0 END)) AS correct,
  CAST(GREATEST(SUM(CASE WHEN coordination = 'tetrahedral (4)' THEN 1 ELSE 0 END), SUM(CASE WHEN coordination = 'octahedral (6)' THEN 1 ELSE 0 END)) AS DOUBLE) / COUNT(*) AS accuracy
FROM data WHERE lda_right IS NOT NULL