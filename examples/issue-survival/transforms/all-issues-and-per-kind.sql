SELECT 'all issues' AS grp, number, days, closed FROM data
UNION ALL SELECT kind AS grp, number, days, closed FROM data