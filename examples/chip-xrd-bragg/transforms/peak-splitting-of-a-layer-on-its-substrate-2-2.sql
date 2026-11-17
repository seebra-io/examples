-- Two materials grown on each other (a thin film on a wafer) give two peaks per
-- reflection. Differentiating Bragg's law: Δθ ≈ −tan θ · Δd/d, so the splitting grows
-- with angle, which is why high-resolution XRD of epitaxial layers uses high-angle
-- reflections like (004). Pairs: AlAs on GaAs, Ge on Si, InP against GaAs.
SELECT p.film || ' on ' || p.substrate AS pair, f.hkl, f.n_sq, s.two_theta_deg AS substrate_2theta, f.two_theta_deg AS film_2theta,
  ROUND(f.two_theta_deg - s.two_theta_deg, 4) AS split_deg,
  ROUND((f.a_A - s.a_A) / s.a_A * 100, 3) AS mismatch_pct,
  ROUND(-2 * TAN(RADIANS(s.theta_deg)) * (f.a_A - s.a_A) / s.a_A * 180 / PI(), 4) AS predicted_split_deg,
  f.intensity_pct AS film_intensity_pct, s.intensity_pct AS substrate_intensity_pct
FROM (SELECT 'AlAs' AS film, 'GaAs' AS substrate UNION ALL SELECT 'Ge' AS film, 'Si' AS substrate UNION ALL SELECT 'InP' AS film, 'GaAs' AS substrate) AS p
JOIN data AS f ON f.material = p.film
JOIN data AS s ON s.material = p.substrate AND s.hkl = f.hkl
WHERE f.f_sq > 0 AND s.f_sq > 0
ORDER BY pair, f.n_sq