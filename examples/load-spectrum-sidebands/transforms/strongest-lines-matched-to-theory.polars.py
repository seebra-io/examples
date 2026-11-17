# the strongest lines of the Hann spectrum (local maxima), each matched to the theory line it falls on
data.filter(col("variant") == "B: 8 weeks, Hann window")
    .sort("f_cpd")
    .with_columns(prev = col("amplitude_gw").shift(1), next = col("amplitude_gw").shift(-1), bin = (col("f_cpd") * 112).round(0).cast(Int64))
    .filter((col("amplitude_gw") > col("prev")) & (col("amplitude_gw") > col("next")) & (col("amplitude_gw") > 0.3))
    .join(data1.select("bin", "label", "role", "period_hours"), on="bin", how="left")
    .select("amplitude_gw", "amplitude_db", "label", "role", "period_hours", f_cpd = col("f_cpd").round(4))
    .sort("amplitude_gw", descending=True)