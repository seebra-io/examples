-- Eurostat's life tables (demo_mlifetable): the death rate m(x), deaths per
-- person-year lived at age x, by sex and country, for 2003 and 2023.
SELECT geo, sex, CAST(TIME_PERIOD AS INTEGER) AS year, age AS age_code, CAST(OBS_VALUE AS DOUBLE) AS mx FROM data
UNION ALL
SELECT geo, sex, CAST(TIME_PERIOD AS INTEGER) AS year, age AS age_code, CAST(OBS_VALUE AS DOUBLE) AS mx FROM data1