# How far DFT-PBE's lattice constants are from the measured ones (COD), %.
data.join(data1, on="material").with_columns(error_pct = ((col("a_A") - col("a_measured_A")) / col("a_measured_A") * 100).round(2))
    .select("material", "a_measured_A", "error_pct", "file", "cod_link", a_pbe_A = col("a_A"))