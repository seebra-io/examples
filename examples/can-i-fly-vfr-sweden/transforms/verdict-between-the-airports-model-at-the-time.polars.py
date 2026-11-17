# The model points in their window: where the aircraft is (along · flight
# time after ETD) ± 1 h, the worst model category and how many of those
# hours miss the VMC minima, with the lowest ceiling and visibility.
data.join(data1.filter(col("role") == "departure").select("etd", "flight_h"), how="cross")
    .with_columns(t_pass = col("etd") + col("along") * col("flight_h") * 3600)
    .filter((col("t") + 3600 > col("t_pass") - 3600) & (col("t") < col("t_pass") + 3600))
    .group_by("pt", "point", "along", "lon", "lat", "t_pass")
    .agg(hours = len(), worst_rank = col("rank").min(), hours_below = (1 - col("vmc")).sum(),
         min_ceiling_ft = col("ceiling_ft").min(), min_vis_m = col("vis_m").min(), max_gust_kt = col("gust_kt").max(),
         max_thunder_pct = col("thunder_pct").max(), max_precip_mm_h = col("precip_mm_h").max())
    .with_columns(worst = when(col("worst_rank") == 1).then(lit("LIFR")).when(col("worst_rank") == 2).then(lit("IFR")).when(col("worst_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR")),
                  pass_z = (col("t_pass").round(0) * 1000000).cast(Int64).cast(Datetime).dt.strftime("%H:%MZ"))
    .sort("pt")