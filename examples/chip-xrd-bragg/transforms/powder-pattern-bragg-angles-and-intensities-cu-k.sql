-- Bragg's law, nλ = 2d sin θ, for every reflection of every material:
--   d = a / √(h² + k² + l²) (cubic), λ = 1.5406 Å (Cu Kα1), θ = asin(λ / 2d).
-- Intensity ∝ m · |F|² · LP, with the Lorentz-polarisation factor
-- LP = (1 + cos² 2θ) / (sin² θ cos θ), and each atom's scattering factor taken as
-- its atomic number Z (its value at θ = 0; real f falls with angle, and thermal
-- motion is ignored). intensity_pct: per material, the strongest peak is 100.
WITH x AS (
  SELECT c.material, c.structure, c.a_A, c.link, h.hkl, h.h, h.k, h.l, h.n_sq, h.multiplicity, h.class,
         CAST(ea.Z AS DOUBLE) AS fa, CAST(eb.Z AS DOUBLE) AS fb,
         c.a_A / SQRT(CAST(h.n_sq AS DOUBLE)) AS d_A
  FROM data AS c CROSS JOIN data1 AS h
  JOIN data2 AS ea ON ea.symbol = c.atom_a JOIN data2 AS eb ON eb.symbol = c.atom_b
), y AS (
  SELECT *, 1.5406 / (2 * d_A) AS s,
    CASE class WHEN 'all odd' THEN 16 * (fa*fa + fb*fb) WHEN 'even, h+k+l = 4n' THEN 16 * (fa + fb) * (fa + fb)
               WHEN 'even, h+k+l = 4n+2' THEN 16 * (fa - fb) * (fa - fb) ELSE 0 END AS f_sq
  FROM x
), z AS (
  SELECT *, DEGREES(ASIN(s)) AS theta_deg, 2 * DEGREES(ASIN(s)) AS two_theta_deg,
    multiplicity * f_sq * (1 + COS(2 * ASIN(s)) * COS(2 * ASIN(s))) / (SIN(ASIN(s)) * SIN(ASIN(s)) * COS(ASIN(s))) AS intensity
  FROM y WHERE s < 1
)
SELECT material, structure, hkl, h, k, l, n_sq, multiplicity, class, ROUND(a_A, 5) AS a_A, ROUND(d_A, 4) AS d_A,
  ROUND(theta_deg, 3) AS theta_deg, ROUND(two_theta_deg, 3) AS two_theta_deg, f_sq,
  ROUND(100 * intensity / MAX(intensity) OVER (PARTITION BY material), 2) AS intensity_pct, link
FROM z ORDER BY material, two_theta_deg