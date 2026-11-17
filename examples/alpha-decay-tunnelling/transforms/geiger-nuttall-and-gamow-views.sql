SELECT 'Geiger–Nuttall: Z_d/√Q' AS panel, nuclide, z, parity, half_life, unit_hl, q_mev, log_t, gn_x AS xv, gamow_log10, link FROM data
UNION ALL
SELECT 'Gamow: tunnelling exponent 2G/ln 10' AS panel, nuclide, z, parity, half_life, unit_hl, q_mev, log_t, gamow_log10 AS xv, gamow_log10, link FROM data