-- One row per Mesozoic bin with a reliable subsampled estimate: the
-- study's points. myr: million years after the start of the Triassic
-- (251.902 Ma), so a positive slope is diversity growing toward the present.
SELECT s.bin, s.mid_ma, ROUND(251.902 - s.mid_ma, 2) AS myr,
       b.genera, b.species, s.sqs_genera, s.coverage_u,
       LN(b.genera) AS ln_genera,
       LN(s.sqs_genera) AS ln_sqs_genera
FROM data AS s
JOIN data1 AS b ON s.bin = b.bin
WHERE s.mesozoic AND s.reliable AND s.sqs_genera IS NOT NULL
ORDER BY s.mid_ma DESC