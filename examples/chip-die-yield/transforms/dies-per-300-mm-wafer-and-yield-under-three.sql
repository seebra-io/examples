-- For each die and each defect density D0 (defects per cm²; 0.1 is about what a
-- mature leading-edge process reaches, 0.5 a young one: scenarios, not data):
--   gross dies per wafer  DPW = π (d/2)² / A − π d / √(2A), d = 300 mm
--   Poisson yield          Y = exp(−A·D0)        (defects independent)
--   Murphy yield           Y = ((1 − exp(−A·D0)) / (A·D0))²
--   negative binomial      Y = (1 + A·D0/α)^−α, α = 3 (clustered defects)
-- A in cm² in the yield models. wafers_per_1000_good: wafers needed for 1000
-- working dies; cost_index: silicon cost per good mm² relative to a die that
-- is perfect and wastes nothing at the wafer edge (1 = ideal), Poisson model.
SELECT c.qid, c.name, c.kind, c.area_mm2, c.node, c.maker, c.released, c.link, d.d0,
  FLOOR(PI() * 150 * 150 / c.area_mm2 - PI() * 300 / SQRT(2 * c.area_mm2)) AS dies_per_wafer,
  EXP(-c.area_mm2 / 100 * d.d0) AS y_poisson,
  POWER((1 - EXP(-c.area_mm2 / 100 * d.d0)) / (c.area_mm2 / 100 * d.d0), 2) AS y_murphy,
  POWER(1 + c.area_mm2 / 100 * d.d0 / 3, -3) AS y_negbin,
  1000 / (FLOOR(PI() * 150 * 150 / c.area_mm2 - PI() * 300 / SQRT(2 * c.area_mm2)) * EXP(-c.area_mm2 / 100 * d.d0)) AS wafers_per_1000_good,
  (PI() * 150 * 150 / c.area_mm2) / (FLOOR(PI() * 150 * 150 / c.area_mm2 - PI() * 300 / SQRT(2 * c.area_mm2)) * EXP(-c.area_mm2 / 100 * d.d0)) AS cost_index
FROM data AS c CROSS JOIN (VALUES (0.05), (0.1), (0.2), (0.5)) AS d(d0)
ORDER BY d.d0, c.area_mm2