data.rows("results.bindings")
    .select(item = col("x").struct.field("value"), label = col("xLabel").struct.field("value"),
            description = col("xDescription").struct.field("value"), symbol = col("symbol").struct.field("value"),
            k = col("K").struct.field("value").cast(Float64) / 1e9, g = col("G").struct.field("value").cast(Float64) / 1e9,
            rho = col("rho").struct.field("value").cast(Float64))
    .group_by("item", "label", "description")
    .agg(k_gpa = col("k").median(), g_gpa = col("g").median(), rho_kgm3 = col("rho").max(), rho_min = col("rho").min(),
         n_values = len(), symbol = col("symbol").first())
    # isotropic elasticity: two moduli fix the others. E = 9KG/(3K+G), Poisson's ratio ν = (3K−2G)/(2(3K+G))
    .with_columns(e_gpa = 9 * col("k_gpa") * col("g_gpa") / (3 * col("k_gpa") + col("g_gpa")),
                  nu = (3 * col("k_gpa") - 2 * col("g_gpa")) / (2 * (3 * col("k_gpa") + col("g_gpa"))),
                  class = when(col("symbol").is_not_null()).then(lit("element")).otherwise(lit("ceramic or mineral")))
    .with_columns(issue = when((col("rho_kgm3") < 100) | (col("rho_kgm3") > 25000)).then(lit("density outside 100–25,000 kg/m³"))
                  .when((col("k_gpa") <= 0) | (col("g_gpa") <= 0)).then(lit("a modulus ≤ 0")),
                  e_min_gpa = col("e_gpa"), e_max_gpa = col("e_gpa"), source = lit("E from K and G (P5668, P5673)"))
    .with_columns(plausible = col("issue").is_null())
    .select("item", "label", "description", "class", "source", "e_gpa", "e_min_gpa", "e_max_gpa", "k_gpa", "g_gpa", "nu", "rho_kgm3", "n_values", "plausible", "issue")
    .sort("e_gpa", descending=True)