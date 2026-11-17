SELECT province, species_key, records, concat('https://www.gbif.org/species/', species_key) AS link FROM data
UNION ALL SELECT province, species_key, records, concat('https://www.gbif.org/species/', species_key) AS link FROM data1
UNION ALL SELECT province, species_key, records, concat('https://www.gbif.org/species/', species_key) AS link FROM data2