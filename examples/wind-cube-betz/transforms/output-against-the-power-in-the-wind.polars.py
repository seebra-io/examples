# each hour: the farm's output against the power in the wind through its 35 rotors (A = 35 × π × 77² = 651941 m²): P_wind = ½ ρ A v³
data.join(data1, on="h", how="inner")
    .with_columns(p_wind_mw = 0.5 * col("rho") * 651941 * col("v") * col("v") * col("v") / 1000000)
    .with_columns(cp = when(col("p_wind_mw") > 1).then(col("mw") / col("p_wind_mw")).otherwise(None),
                  betz_mw = (col("p_wind_mw") * 16 / 27).clip(0, 210),
                  cf = col("mw") / 210)
    .select("h", "time", "v", "rho", mw = col("mw").round(2), p_wind_mw = col("p_wind_mw").round(1), betz_mw = col("betz_mw").round(1),
            cp = col("cp").round(3), cf = col("cf").round(3), run = col("run"))
    .sort("h")