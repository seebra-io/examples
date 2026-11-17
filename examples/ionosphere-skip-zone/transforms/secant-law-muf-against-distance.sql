-- the secant law on a curved Earth, mirror model: a ray reflected at the F2 peak height h over a ground distance d meets the layer
-- at an angle of incidence i with tan i = sin(phi) / (1 + h/R - cos(phi)), phi = d / 2R; it returns while f <= foF2 · sec i
SELECT s.code AS code, s.name AS name, s.daylight AS daylight, s.fof2 AS fof2, s.hmf2 AS hmf2, g.d_km AS d_km,
       ROUND(s.fof2 * SQRT(1 + POWER(SIN(g.d_km / 12742.0) / (1 + s.hmf2 / 6371.0 - COS(g.d_km / 12742.0)), 2)), 3) AS muf_mhz,
       ROUND(SQRT(1 + POWER(SIN(g.d_km / 12742.0) / (1 + s.hmf2 / 6371.0 - COS(g.d_km / 12742.0)), 2)), 3) AS sec_i
FROM data AS s CROSS JOIN data1 AS g
WHERE s.hmf2 IS NOT NULL
  AND g.d_km <= 2 * 6371.0 * ACOS(6371.0 / (6371.0 + s.hmf2))
ORDER BY code, d_km