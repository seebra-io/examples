# Vegard's law: an alloy's lattice constant is the composition-weighted mean of
# its end points, a(x) = (1 - x) a_0 + x a_1. The band gap usually bends below
# that line: E(x) = (1 - x) E_0 + x E_1 - b x(1 - x), b the bowing parameter.
# Least squares for b through the alloys: b = Σ(linear - value)·u / Σ u², u = x(1 - x).
data.with_columns(a0 = when(col("x") == 0).then(col("a_A")).otherwise(None).max().over("system"),
                  a1 = when(col("x") == 1).then(col("a_A")).otherwise(None).max().over("system"),
                  e0 = when(col("x") == 0).then(col("gap_ev")).otherwise(None).max().over("system"),
                  e1 = when(col("x") == 1).then(col("gap_ev")).otherwise(None).max().over("system"))
    .with_columns(a_vegard = col("a0") + col("x") * (col("a1") - col("a0")),
                  e_linear = col("e0") + col("x") * (col("e1") - col("e0")),
                  u = col("x") * (1 - col("x")))
    .with_columns(da_A = col("a_A") - col("a_vegard"), de_ev = col("gap_ev") - col("e_linear"))
    .with_columns(bow_a_A = ((-col("da_A") * col("u")).sum() / col("u").pow(2).sum()).over("system"),
                  bow_gap_ev = ((-col("de_ev") * col("u")).sum() / col("u").pow(2).sum()).over("system"),
                  max_dev_pct = (col("da_A").abs() / col("a_vegard")).max().over("system") * 100)
    .select("system", "kind", "formula", "sg", "x", "a_A", "gap_ev", "hull_ev", "link", a_vegard = col("a_vegard").round(4), da_A = col("da_A").round(4),
            e_linear = col("e_linear").round(3), de_ev = col("de_ev").round(3),
            bow_a_A = col("bow_a_A").round(4), bow_gap_ev = col("bow_gap_ev").round(3), max_dev_pct = col("max_dev_pct").round(3))
    .sort("system", "x")