SELECT class, source, COUNT(*) AS materials, MEDIAN(e_gpa) AS median_e_gpa, MEDIAN(rho_kgm3) AS median_rho_kgm3,
  MEDIAN(tie) AS median_tie, MAX(tie) AS best_tie, MEDIAN(panel) AS median_panel, MAX(panel) AS best_panel,
  MIN(rank_panel) AS best_rank_panel
FROM data GROUP BY class, source ORDER BY median_panel DESC