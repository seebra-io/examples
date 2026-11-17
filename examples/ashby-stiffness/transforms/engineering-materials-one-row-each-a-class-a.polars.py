data.rows("results.bindings")
    .select(item = col("x").struct.field("value"), label = col("xLabel").struct.field("value"),
            description = col("xDescription").struct.field("value"),
            e_pa = col("E").struct.field("value").cast(Float64), rho = col("rho").struct.field("value").cast(Float64))
    # Wikidata's normalized values (psn:) are SI: E in Pa, density in kg/m³, whatever unit the editor typed
    .group_by("item", "label", "description")
    .agg(e_gpa = (col("e_pa") / 1e9).median(), e_min_gpa = (col("e_pa") / 1e9).min(), e_max_gpa = (col("e_pa") / 1e9).max(),
         rho_kgm3 = col("rho").median(), n_values = len())
    .with_columns(label = when(col("label").str.starts_with("Q")).then(col("description")).otherwise(col("label")),
                  text = concat_str([col("label"), lit(" "), col("description").fill_null(lit(""))]).str.to_lowercase())
    .with_columns(class = when(col("text").str.contains("carbon fiber|glass fiber|reinforced|aramid")).then(lit("composite"))
                  .when(col("text").str.contains("wood|species of plant")).then(lit("wood"))
                  .when(col("text").str.contains("poly|thermoplastic")).then(lit("polymer"))
                  .when(col("text").str.contains("oxide|carbide|nitride|titanate|diamond|allotrope|chemical compound|glass|ceramic")).then(lit("ceramic or mineral"))
                  .when(col("text").str.contains("steel|alloy|alumin|brass|rebar|chemical element")).then(lit("metal"))
                  .otherwise(lit("ceramic or mineral")))
    # sanity: a solid lies between cork (~100 kg/m³) and osmium (22,600 kg/m³); no metal is softer than 10 GPa
    .with_columns(issue = when((col("rho_kgm3") < 100) | (col("rho_kgm3") > 25000)).then(lit("density outside 100–25,000 kg/m³ (a unit typed wrong)"))
                  .when((col("class") == "metal") & (col("e_gpa") < 10)).then(lit("a metal below 10 GPa (MPa typed for GPa?)")))
    .with_columns(plausible = col("issue").is_null(), source = lit("E measured (P5480)"), nu = lit(None).cast(Float64),
                  k_gpa = lit(None).cast(Float64), g_gpa = lit(None).cast(Float64))
    .select("item", "label", "description", "class", "source", "e_gpa", "e_min_gpa", "e_max_gpa", "k_gpa", "g_gpa", "nu", "rho_kgm3", "n_values", "plausible", "issue")
    .sort("e_gpa", descending=True)