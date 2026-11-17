-- North American 'chanterelles' are many species: C. cibarius in the strict sense is European.
SELECT name, COUNT(*) AS observations, ROUND(AVG(confidence), 2) AS mean_confidence,
       MIN(confidence) AS lowest, SUM(CASE WHEN confidence < 1 THEN 1 ELSE 0 END) AS unsure, SUM(namings) AS proposed_names
FROM data GROUP BY name ORDER BY observations DESC