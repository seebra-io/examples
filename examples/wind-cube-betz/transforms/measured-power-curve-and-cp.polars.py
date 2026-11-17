# the measured power curve: 0.5 m/s bins of wind speed, the median output, and the power coefficient Cp = P / P_wind
data.with_columns(v_bin = (col("v") * 2).floor() / 2 + 0.25)
    .group_by("v_bin")
    .agg(hours = len(), median_mw = col("mw").median(), p25_mw = col("mw").quantile(0.25), p75_mw = col("mw").quantile(0.75),
         mean_mw = col("mw").mean(), p_wind_mw = col("p_wind_mw").mean(), median_cp = col("cp").median(), rho = col("rho").mean())
    .filter(col("hours") >= 3)
    .with_columns(betz_limit_mw = (0.5 * col("rho") * 651941 * col("v_bin") ** 3 / 1000000 * 16 / 27).round(1),
                  median_mw = col("median_mw").round(1), p25_mw = col("p25_mw").round(1), p75_mw = col("p75_mw").round(1),
                  mean_mw = col("mean_mw").round(1), p_wind_mw = col("p_wind_mw").round(1), median_cp = col("median_cp").round(3),
                  energy_mwh = (col("mean_mw") * col("hours")).round(0))
    .with_columns(energy_share_pct = (col("energy_mwh") / col("energy_mwh").sum() * 100).round(2),
                  hours_share_pct = (col("hours").cast(Float64) / col("hours").sum() * 100).round(2))
    .sort("v_bin")