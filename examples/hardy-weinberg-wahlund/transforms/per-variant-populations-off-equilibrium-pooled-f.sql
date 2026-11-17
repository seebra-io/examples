-- Per variant: how many of the 26 populations depart from Hardy–Weinberg at
-- p < 0.05 (about 1.3 expected by chance alone), against the pooled ALL
-- sample, its F and the F_ST the populations predict.
SELECT h.rsid, h.gene, h.trait,
       SUM(CASE WHEN h.level = 'population' AND h.p_value < 0.05 THEN 1 ELSE 0 END) AS pops_off_hwe,
       SUM(CASE WHEN h.level = 'population' AND h.p_value IS NOT NULL THEN 1 ELSE 0 END) AS pops_tested,
       ROUND(MEDIAN(CASE WHEN h.level = 'population' THEN h.F END), 3) AS median_population_F,
       MAX(CASE WHEN h.pop = 'ALL' THEN h.F END) AS all_F,
       MAX(CASE WHEN h.pop = 'ALL' THEN h.p_value END) AS all_p_value,
       MAX(w.fst) AS all_fst
FROM data h JOIN (SELECT rsid, fst FROM data1 WHERE pooled = 'ALL') w ON w.rsid = h.rsid
GROUP BY h.rsid, h.gene, h.trait ORDER BY all_F DESC