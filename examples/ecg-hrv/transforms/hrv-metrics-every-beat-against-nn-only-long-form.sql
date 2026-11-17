SELECT record, label, link, 'SDNN (ms)' AS metric, 'every beat' AS series, sdnn_all AS value, beats AS n FROM data
UNION ALL SELECT record, label, link, 'SDNN (ms)' AS metric, 'normal-to-normal only' AS series, sdnn_nn AS value, nn_intervals AS n FROM data
UNION ALL SELECT record, label, link, 'RMSSD (ms)' AS metric, 'every beat' AS series, rmssd_all AS value, beats AS n FROM data
UNION ALL SELECT record, label, link, 'RMSSD (ms)' AS metric, 'normal-to-normal only' AS series, rmssd_nn AS value, successive_nn AS n FROM data
UNION ALL SELECT record, label, link, 'pNN50 (%)' AS metric, 'every beat' AS series, 100 * pnn50_all AS value, beats AS n FROM data
UNION ALL SELECT record, label, link, 'pNN50 (%)' AS metric, 'normal-to-normal only' AS series, 100 * pnn50_nn AS value, successive_nn AS n FROM data
ORDER BY metric, record, series