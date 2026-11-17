SELECT b.org, b.country, b.kind, b.part, p.system, b.role, b.source, b.wikidata, b.country_inferred
FROM data b LEFT JOIN data1 p ON p.part = b.part
ORDER BY b.org, p.system, b.part