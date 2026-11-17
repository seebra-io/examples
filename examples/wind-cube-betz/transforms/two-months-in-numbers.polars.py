# the two months in numbers: capacity factor, mean wind, the best Cp and where it happens, and how much energy came from the windiest hours
data.select(hours = len(), mean_v = col("v").mean().round(2), mean_mw = col("mw").mean().round(1), capacity_factor = (col("mw").mean() / 210).round(3),
            energy_gwh = (col("mw").sum() / 1000).round(1), mean_rho = col("rho").mean().round(3),
            p90_cp = when((col("v") >= 5) & (col("v") <= 11)).then(col("cp")).otherwise(None).quantile(0.9).round(3),
            median_cp_7_9 = when((col("v") >= 7) & (col("v") <= 9)).then(col("cp")).otherwise(None).median().round(3),
            # P ∝ v³: the mean of v³ is larger than the cube of the mean v
            cube_of_mean_mw = (0.5 * col("rho").mean() * 651941 * col("v").mean() ** 3 / 1000000).round(1),
            mean_of_cube_mw = (0.5 * col("rho") * 651941 * col("v") ** 3 / 1000000).mean().round(1),
            hours_at_rated_pct = (when(col("mw") >= 195).then(100.0).otherwise(0.0).mean()).round(1))
    .with_columns(betz = lit(0.593))