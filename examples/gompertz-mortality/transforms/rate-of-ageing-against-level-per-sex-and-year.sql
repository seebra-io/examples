-- Per sex and year: the spread of the rate of ageing across the eight
-- countries against the spread of the level, and the hump: how far above the
-- line the death rate at ages 18–25 is, at most.
SELECT f.sex, f.year, COUNT(*) AS countries,
       ROUND(MIN(f.mrdt), 2) AS min_mrdt, ROUND(MEDIAN(f.mrdt), 2) AS median_mrdt, ROUND(MAX(f.mrdt), 2) AS max_mrdt,
       ROUND(MIN(f.m60), 5) AS min_m60, ROUND(MAX(f.m60), 5) AS max_m60, ROUND(MAX(f.m60) / MIN(f.m60), 1) AS m60_fold,
       ROUND(MIN(f.r2), 3) AS min_r2,
       ROUND(MAX(h.hump), 2) AS max_hump_ratio
FROM data f JOIN (SELECT geo, sex, year, MAX(ratio) AS hump FROM data1 WHERE age BETWEEN 18 AND 25 GROUP BY geo, sex, year) h
  ON f.geo = h.geo AND f.sex = h.sex AND f.year = h.year
GROUP BY f.sex, f.year ORDER BY f.year, f.sex