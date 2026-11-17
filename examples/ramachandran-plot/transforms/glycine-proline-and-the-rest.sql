-- Glycine, proline and the rest: how often each sits at positive φ (the
-- left half of the plane, sterically blocked for an L-amino acid with a
-- side chain), and the spread of φ (proline's ring fixes it).
SELECT kind, COUNT(*) AS residues,
       ROUND(AVG(CASE WHEN phi > 0 THEN 1.0 ELSE 0.0 END), 3) AS share_positive_phi,
       ROUND(MEDIAN(phi), 1) AS median_phi, ROUND(STDDEV(phi), 1) AS sd_phi,
       ROUND(AVG(CASE WHEN rama = 'Favored' THEN 1.0 ELSE 0.0 END), 3) AS share_favored,
       SUM(CASE WHEN rama = 'OUTLIER' THEN 1 ELSE 0 END) AS outliers
FROM data GROUP BY kind ORDER BY residues DESC