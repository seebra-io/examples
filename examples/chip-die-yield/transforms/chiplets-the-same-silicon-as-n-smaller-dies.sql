-- Split each large die (over 150 mm²) into n equal chiplets, each 10% larger than
-- A/n for its die-to-die interface (an assumption), test them before packaging
-- (known-good die) and count the silicon for one working chip:
--   wafer share = n / (DPW(A_n) · Y(A_n)), A_n = 1.1 A / n, Poisson yield.
-- saving: 1 − (chiplets / monolithic). Packaging and test costs are not counted.
WITH s AS (
  SELECT c.name, c.kind, c.area_mm2, c.link, d.d0, n.n,
    CASE WHEN n.n = 1 THEN c.area_mm2 ELSE 1.1 * c.area_mm2 / n.n END AS die_mm2
  FROM data AS c CROSS JOIN (VALUES (0.1), (0.2), (0.5)) AS d(d0) CROSS JOIN (VALUES (1), (2), (4), (8)) AS n(n)
  WHERE c.area_mm2 > 150
), w AS (
  SELECT *, n / (FLOOR(PI() * 150 * 150 / die_mm2 - PI() * 300 / SQRT(2 * die_mm2)) * EXP(-die_mm2 / 100 * d0)) AS wafer_share,
         EXP(-die_mm2 / 100 * d0) AS die_yield
  FROM s
)
SELECT name, kind, area_mm2, link, d0, n, ROUND(die_mm2, 1) AS die_mm2, ROUND(die_yield, 4) AS die_yield,
  wafer_share, ROUND(1 - wafer_share / MAX(CASE WHEN n = 1 THEN wafer_share END) OVER (PARTITION BY name, area_mm2, d0), 4) AS saving
FROM w ORDER BY d0, area_mm2, n