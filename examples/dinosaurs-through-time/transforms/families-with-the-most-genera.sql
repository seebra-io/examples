SELECT clade, family, count(*) AS genera, max(first_ma) AS oldest_ma, min(last_ma) AS youngest_ma, sum(finds) AS finds
FROM data
WHERE NOT trace_fossil AND family <> ''
GROUP BY clade, family
ORDER BY genera DESC
LIMIT 40