-- the data check: readings whose implied ΔS no evaporating liquid has (each one worth opening on Wikidata)
SELECT name, qid, ds_implied, p_pa, t_c, tb_c, tb_spread_k, tb_values, smiles, wikidata,
  CASE WHEN ds_implied < 50 THEN 'vapour pressure too high for this boiling point (unit? boiling point at reduced pressure? a solid?)'
       ELSE 'vapour pressure too low for this boiling point (unit? mixture? a solid subliming?)' END AS likely_problem
FROM data WHERE NOT plausible ORDER BY ds_implied