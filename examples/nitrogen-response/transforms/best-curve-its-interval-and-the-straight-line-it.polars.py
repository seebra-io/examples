data.with_columns(c_lo = when(col("in_ci")).then(col("c")).min(), c_hi = when(col("in_ci")).then(col("c")).max())
    .sort("sse").head(1)
    .join(data1.filter(col("in_fit")).with_columns(mf = col("fert_kg_ha").mean(), my = col("yield_kg_ha").mean())
              .select(sfy = ((col("fert_kg_ha") - col("mf")) * (col("yield_kg_ha") - col("my"))).sum(),
                      sff = (col("fert_kg_ha") - col("mf")).pow(2).sum(), syy = (col("yield_kg_ha") - col("my")).pow(2).sum(),
                      mf = col("mf").first(), my_ = col("my").first()), how="cross")
    # the straight line every extra kg is worth the same: what the curve is compared with
    .with_columns(slope_lin = col("sfy") / col("sff"))
    .with_columns(intercept_lin = col("my_") - col("slope_lin") * col("mf"), r2_lin = col("sfy").pow(2) / (col("sff") * col("syy")))
    .with_columns(y_max = col("Y0") + col("A"),
                  mp_at_0 = col("A") * col("c"),
                  # grain bought by the first 50 kg/ha of fertiliser, and by the next 200 (50 to 250 kg/ha)
                  gain_first_50 = col("A") * (1 - (-50 * col("c")).exp()),
                  gain_50_to_250 = col("A") * ((-50 * col("c")).exp() - (-250 * col("c")).exp()),
                  # fertiliser rate where one more kg returns 5 kg, and 1 kg, of grain: dY/dN = A c e^(-c N)
                  n_at_mp5 = (col("A") * col("c") / 5).log() / col("c"),
                  n_at_mp1 = (col("A") * col("c") / 1).log() / col("c"),
                  half_n_lo = 0.6931471805599453 / col("c_hi"), half_n_hi = 0.6931471805599453 / col("c_lo"))
    .with_columns(per_kg_first_50 = (col("gain_first_50") / 50).round(1), per_kg_50_to_250 = (col("gain_50_to_250") / 200).round(1))
    .select(countries = col("n"), c = col("c"), c_lo = col("c_lo"), c_hi = col("c_hi"),
            half_response_kg_ha = col("half_n"), half_lo = col("half_n_lo").round(1), half_hi = col("half_n_hi").round(1),
            Y0_kg_ha = col("Y0"), A_kg_ha = col("A"), y_max_kg_ha = col("y_max").round(0), r2 = col("r2"),
            slope_lin = col("slope_lin").round(2), intercept_lin = col("intercept_lin").round(0), r2_lin = col("r2_lin").round(4),
            mp_at_0 = col("mp_at_0").round(1), gain_first_50 = col("gain_first_50").round(0), per_kg_first_50 = col("per_kg_first_50"),
            gain_50_to_250 = col("gain_50_to_250").round(0), per_kg_50_to_250 = col("per_kg_50_to_250"),
            n_at_mp5 = col("n_at_mp5").round(0), n_at_mp1 = col("n_at_mp1").round(0))