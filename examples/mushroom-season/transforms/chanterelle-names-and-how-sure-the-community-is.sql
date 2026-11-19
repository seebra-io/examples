-- North American 'chanterelles' are many species: C. cibarius in the strict sense is European.
-- "unsure" is worked out per row first: a CASE (or a comparison) inside SUM in a GROUP BY
-- stops Polars 0.46 with a panic ("should be a list at this point"), the whole data runtime with it
SELECT name, COUNT(*) AS observations, ROUND(AVG(confidence), 2) AS mean_confidence,
       MIN(confidence) AS lowest, SUM(unsure) AS unsure, SUM(namings) AS proposed_names
FROM (SELECT name, confidence, namings, CASE WHEN confidence < 1 THEN 1 ELSE 0 END AS unsure FROM data) AS per_row
GROUP BY name ORDER BY observations DESC