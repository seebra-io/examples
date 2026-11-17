SELECT * FROM (
  SELECT 'most unique' AS side, title, score, percentile, distinct, rarity, field, crowd,
         nearest_1, similarity_1, nearest_2, similarity_2, nearest_3, similarity_3, link, docs, summary
  FROM data ORDER BY score_raw DESC LIMIT 15) AS top
UNION ALL
SELECT * FROM (
  SELECT 'least unique' AS side, title, score, percentile, distinct, rarity, field, crowd,
         nearest_1, similarity_1, nearest_2, similarity_2, nearest_3, similarity_3, link, docs, summary
  FROM data ORDER BY score_raw ASC LIMIT 15) AS bottom