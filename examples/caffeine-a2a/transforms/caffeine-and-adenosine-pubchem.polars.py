# Caffeine and adenosine side by side (PubChem, computed properties): the
# ribose adds the hydrogen-bond donors and the polar surface.
data.rows("PropertyTable.Properties")
    .with_columns(MolecularWeight = col("MolecularWeight").cast(Float64),
                  link = concat_str([lit("https://pubchem.ncbi.nlm.nih.gov/compound/"), col("CID").cast(Utf8)]))
    .select("Title", "CID", "MolecularFormula", "MolecularWeight", "XLogP", "HBondDonorCount", "HBondAcceptorCount", "TPSA",
            "RotatableBondCount", "HeavyAtomCount", "link")