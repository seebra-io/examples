-- All four proteins' residues in one table.
SELECT entry, protein, chain, num, author_num, res, phi, psi, rama, ss FROM data
UNION ALL SELECT entry, protein, chain, num, author_num, res, phi, psi, rama, ss FROM data1
UNION ALL SELECT entry, protein, chain, num, author_num, res, phi, psi, rama, ss FROM data2
UNION ALL SELECT entry, protein, chain, num, author_num, res, phi, psi, rama, ss FROM data3