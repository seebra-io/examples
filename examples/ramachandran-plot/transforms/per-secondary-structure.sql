-- Per secondary structure: residues, the median φ and ψ, and where they fall;
-- and the share of the plane they use (10° cells occupied of 1,296).
SELECT ss, COUNT(*) AS residues,
       ROUND(MEDIAN(phi), 1) AS median_phi, ROUND(MEDIAN(psi), 1) AS median_psi,
       ROUND(AVG(CASE WHEN region LIKE 'α_R%' THEN 1.0 ELSE 0.0 END), 3) AS share_alpha_R,
       ROUND(AVG(CASE WHEN region LIKE 'β%' THEN 1.0 ELSE 0.0 END), 3) AS share_beta,
       ROUND(AVG(CASE WHEN region LIKE 'PPII%' THEN 1.0 ELSE 0.0 END), 3) AS share_ppii,
       ROUND(AVG(CASE WHEN phi > 0 THEN 1.0 ELSE 0.0 END), 3) AS share_positive_phi,
       ROUND(AVG(CASE WHEN rama = 'Favored' THEN 1.0 ELSE 0.0 END), 3) AS share_favored,
       COUNT(DISTINCT CONCAT(CAST(cell_phi AS VARCHAR), ':', CAST(cell_psi AS VARCHAR))) AS cells_used,
       ROUND(COUNT(DISTINCT CONCAT(CAST(cell_phi AS VARCHAR), ':', CAST(cell_psi AS VARCHAR))) / 1296.0, 3) AS plane_share
FROM data GROUP BY ss ORDER BY residues DESC