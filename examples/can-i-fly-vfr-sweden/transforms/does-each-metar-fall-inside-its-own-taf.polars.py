# Forensics: does each METAR fall inside its own TAF for this hour?
# "inside the prevailing forecast", "inside a TEMPO/PROB" (the temporary
# group is happening), or "worse than the TAF allows" (a TAF amendment, AMD,
# is due; until then the METAR is the better guide). Both judged on the SERA
# VMC minima and on the category.
data.join(data1.join(data1.select(t0 = col("t").min()), how="cross").filter(col("t") == col("t0"))
               .select("icao", taf_rank = col("rank"), taf_worst = col("worst_rank"), taf_ok_prev = col("ok_prev"),
                       taf_ok_all = col("ok_all"), taf_text = col("text"), taf_temp = col("temp_text"), hour = col("hour")),
          on="icao")
    .with_columns(fit = when(col("cat_rank") >= col("taf_rank")).then(lit("inside the prevailing forecast"))
                        .when(col("cat_rank") >= col("taf_worst")).then(lit("inside a TEMPO/PROB"))
                        .otherwise(lit("worse than the TAF allows")),
                  vmc_fit = when(col("vmc") == col("taf_ok_prev")).then(lit("agrees"))
                            .when(col("vmc") == 1).then(lit("METAR better"))
                            .when(col("taf_ok_all") == 0).then(lit("METAR below, a TEMPO/PROB said it might"))
                            .otherwise(lit("METAR below, the TAF did not allow it")))
    .select("icao", "name", "role", "category", "minima", "taf_rank", "taf_worst", "fit", "vmc_fit", "raw", "taf_text", "taf_temp", "hour", "obs_z")
    .sort("fit", "icao")