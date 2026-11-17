-- Vegard's law solved for the substrate: x* = (a_substrate − a_0) / (a_1 − a_0).
-- In(x)Ga(1−x)As on InP, with PBE lattice constants and with measured ones (COD).
-- PBE overestimates every lattice constant by 1–2%, but not by the same amount,
-- so the matched composition moves. mismatch_*: (a_film − a_substrate)/a_substrate
-- of the end points, the strain a film of pure GaAs or InAs would carry.
WITH p AS (SELECT MAX(CASE WHEN material = 'GaAs' THEN a_A END) AS gaas, MAX(CASE WHEN material = 'InAs' THEN a_A END) AS inas,
                  MAX(CASE WHEN material = 'InP' THEN a_A END) AS inp, MAX(CASE WHEN material = 'AlAs' THEN a_A END) AS alas FROM data),
     m AS (SELECT MAX(CASE WHEN material = 'GaAs' THEN a_measured_A END) AS gaas, MAX(CASE WHEN material = 'InAs' THEN a_measured_A END) AS inas,
                  MAX(CASE WHEN material = 'InP' THEN a_measured_A END) AS inp, MAX(CASE WHEN material = 'AlAs' THEN a_measured_A END) AS alas FROM data1)
SELECT 'PBE (Alexandria)' AS source, p.gaas AS a_gaas, p.inas AS a_inas, p.inp AS a_inp, p.alas AS a_alas,
  ROUND((p.inp - p.gaas) / (p.inas - p.gaas), 4) AS x_ingaas_on_inp,
  ROUND((p.gaas - p.inp) / p.inp * 100, 3) AS mismatch_gaas_on_inp_pct, ROUND((p.inas - p.inp) / p.inp * 100, 3) AS mismatch_inas_on_inp_pct,
  ROUND((p.alas - p.gaas) / p.gaas * 100, 3) AS mismatch_alas_on_gaas_pct FROM p
UNION ALL
SELECT 'measured (COD)' AS source, m.gaas AS a_gaas, m.inas AS a_inas, m.inp AS a_inp, m.alas AS a_alas,
  ROUND((m.inp - m.gaas) / (m.inas - m.gaas), 4) AS x_ingaas_on_inp,
  ROUND((m.gaas - m.inp) / m.inp * 100, 3) AS mismatch_gaas_on_inp_pct, ROUND((m.inas - m.inp) / m.inp * 100, 3) AS mismatch_inas_on_inp_pct,
  ROUND((m.alas - m.gaas) / m.gaas * 100, 3) AS mismatch_alas_on_gaas_pct FROM m