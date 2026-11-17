-- The three models on a grid of die areas 5–900 mm², per defect density
-- (the chips table is the input only so the curves redraw with it).
SELECT a.area_mm2, d.d0,
  EXP(-a.area_mm2 / 100 * d.d0) AS poisson,
  POWER((1 - EXP(-a.area_mm2 / 100 * d.d0)) / (a.area_mm2 / 100 * d.d0), 2) AS murphy,
  POWER(1 + a.area_mm2 / 100 * d.d0 / 3, -3) AS negbin
FROM UNNEST([5, 10, 20, 30, 40, 50, 60, 80, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 858, 900]) AS a(area_mm2)
CROSS JOIN (VALUES (0.05), (0.1), (0.2), (0.5)) AS d(d0)
ORDER BY d.d0, a.area_mm2