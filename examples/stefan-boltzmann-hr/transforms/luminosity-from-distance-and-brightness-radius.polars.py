data.filter((col("teff_gspphot") >= 3300) & (col("teff_gspphot") <= 8000) & (col("parallax") > 0))
    .with_columns(teff = col("teff_gspphot"), dist_pc = 1000 / col("parallax"), x = col("teff_gspphot") - 5772,
                  ag = col("ag_gspphot").fill_null(0))
    # inverse-square law: absolute G magnitude from the apparent one and the distance, less extinction
    .with_columns(abs_g = col("phot_g_mean_mag") + 5 * (col("parallax") / 100).log(10) - col("ag"))
    # Gaia's bolometric correction BC_G(Teff), Andrae et al. 2018 (A&A 616, A8), polynomials in Teff − 5772 K
    .with_columns(bc_g = when(col("teff") >= 4000)
        .then(0.06 + 6.731e-5 * col("x") - 6.647e-8 * col("x").pow(2) + 2.859e-11 * col("x").pow(3) - 7.197e-15 * col("x").pow(4))
        .otherwise(1.749 + 1.977e-3 * col("x") + 3.737e-7 * col("x").pow(2) - 8.966e-11 * col("x").pow(3) - 4.183e-14 * col("x").pow(4)))
    # luminosity in solar units (M_bol☉ = 4.74), then Stefan–Boltzmann: L = 4πR²σT⁴, so R/R☉ = √(L/L☉) · (5772 K / T)²
    .with_columns(lum = lit(10.0).pow(-0.4 * (col("abs_g") + col("bc_g") - 4.74)))
    .with_columns(radius_sb = col("lum").sqrt() * (5772 / col("teff")).pow(2))
    .with_columns(log_t = col("teff").log(10), log_l = col("lum").log(10), log_r_sb = col("radius_sb").log(10),
                  log_r_gsp = col("radius_gspphot").log(10), log_m = col("mass_flame").log(10),
                  stage = when(col("evolstage_flame").is_null()).then(lit("no FLAME stage"))
                          .when(col("evolstage_flame") < 360).then(lit("main sequence"))
                          .when(col("evolstage_flame") < 420).then(lit("subgiant"))
                          .otherwise(lit("giant")),
                  star = concat_str([lit("Gaia DR3 "), col("source_id").cast(String)]),
                  link = concat_str([lit("https://simbad.cds.unistra.fr/simbad/sim-id?Ident=Gaia+DR3+"), col("source_id").cast(String)]))
    .select("star", "source_id", "teff", "bp_rp", "dist_pc", "abs_g", "bc_g", "lum", "radius_sb", "radius_gspphot", "lum_flame", "mass_flame", "age_flame",
            "evolstage_flame", "stage", "log_t", "log_l", "log_r_sb", "log_r_gsp", "log_m", "link")
    .sort("teff")