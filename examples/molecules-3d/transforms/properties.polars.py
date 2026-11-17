data.rows("PropertyTable.Properties")
    .with_columns(MolecularWeight = col("MolecularWeight").cast(Float64))