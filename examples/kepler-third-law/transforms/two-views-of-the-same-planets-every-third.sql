SELECT 'raw: P against a' AS panel, i, pl_name, hostname, discoverymethod, star_msun, a_au, period_days, m_kepler, link,
       log_a AS x, log_p AS y FROM data WHERE i % 3 = 0
UNION ALL
SELECT 'Kepler: P² against a³/M★' AS panel, i, pl_name, hostname, discoverymethod, star_msun, a_au, period_days, m_kepler, link,
       log_a3_m AS x, log_p2 AS y FROM data WHERE i % 3 = 0