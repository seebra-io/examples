data.filter((col("decay") == "A") & (col("decay_pct") >= 50) & (col("q_alpha_kev") > 0) & (col("half_life_s") > 0))
    # the daughter nucleus and the α particle: Z_d = Z − 2, A_d = A − 4, Q in MeV
    .with_columns(zd = (col("z") - 2).cast(Float64), ad = (col("a") - 4).cast(Float64), q_mev = col("q_alpha_kev") / 1000)
    # reduced mass (MeV/c²), nuclear radius R = 1.2 (A_d^⅓ + 4^⅓) fm, the classical turning point b = 2 Z_d e²/(4πε₀ Q) (e²/4πε₀ = 1.44 MeV fm)
    .with_columns(mu = 3727.379 * col("ad") * 931.494 / (3727.379 + col("ad") * 931.494),
                  r_fm = 1.2 * (col("ad").pow(1 / 3) + 1.587401),
                  b_fm = 2 * col("zd") * 1.439964 / col("q_mev"))
    # Sommerfeld parameter η = Z_α Z_d α / (v/c), v/c = √(2Q/μ)
    .with_columns(x = col("r_fm") / col("b_fm"), eta = 2 * col("zd") / 137.036 / (2 * col("q_mev") / col("mu")).sqrt(),
                  gn_x = col("zd") / col("q_mev").sqrt())
    .select("nuclide", "z", "n", "a", "symbol", "parity", "half_life", "unit_hl", "half_life_s", "log_t", "q_alpha_kev", "q_mev", "zd", "r_fm", "b_fm", "x", "eta", "gn_x", "link")