SELECT label, class, source, link, e_gpa, rho_kgm3, 'tie (E/ρ)' AS design, 1 AS step, tie AS idx, mass_vs_steel_tie AS mass_vs_steel FROM data
UNION ALL SELECT label, class, source, link, e_gpa, rho_kgm3, 'beam (E^½/ρ)' AS design, 2 AS step, beam AS idx, mass_vs_steel_beam AS mass_vs_steel FROM data
UNION ALL SELECT label, class, source, link, e_gpa, rho_kgm3, 'panel (E^⅓/ρ)' AS design, 3 AS step, panel AS idx, mass_vs_steel_panel AS mass_vs_steel FROM data
ORDER BY label, step