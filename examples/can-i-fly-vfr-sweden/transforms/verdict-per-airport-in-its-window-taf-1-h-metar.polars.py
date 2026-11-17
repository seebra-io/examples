# The verdict per airport on the route: in its window (t_use ± 1 h; the
# hours of the grid that overlap it), the worst prevailing forecast, the
# worst the TAF allows, and the group that decides; with its METAR now.
# verdict: "VMC" when the prevailing forecast and every TEMPO/PROB group
# meet the SERA minima in the whole window; "VMC, but TEMPO/PROB below"
# when only a temporary group fails (plan for it: delay, divert, or a
# destination alternate); "below VMC minima" when the prevailing forecast
# fails; "no TAF" when the airport issues none (many small fields don't).
data.join(data1.select("icao", "t", "rank", "worst_rank", "ok_prev", "ok_all", "decides", "text", "temp_text"), on="icao", how="left")
    .filter(col("t").is_null() | ((col("t") + 3600 > col("win_from")) & (col("t") < col("win_to"))))
    .with_columns(dec = when(col("decides").is_not_null()).then(col("decides")).otherwise(col("text")),
                  sev = col("ok_prev").fill_null(1) * 2 + col("ok_all").fill_null(1))
    .sort("order", "sev", "worst_rank", "t")
    .group_by("order", "icao", "role", "name", "use_z", "t_use", "win_from", "win_to", "along", "off_km")
    .agg(taf_hours = col("t").count(), prev_rank = col("rank").min(), worst_rank = col("worst_rank").min(),
         ok_prev = col("ok_prev").min(), ok_all = col("ok_all").min(), decides = col("dec").first(),
         decides_hour = col("t").first())
    .join(data2.select("icao", metar = col("category"), metar_minima = col("minima"), metar_vmc = col("vmc"),
                       metar_z = col("obs_z"), obs = col("obs"), metar_raw = col("raw")), on="icao", how="left")
    .with_columns(verdict = when(col("taf_hours") == 0).then(lit("no TAF"))
                            .when(col("ok_prev") == 0).then(lit("below VMC minima"))
                            .when(col("ok_all") == 0).then(lit("VMC, but TEMPO/PROB below"))
                            .otherwise(lit("VMC")),
                  prevailing = when(col("prev_rank").is_null()).then(lit(None)).otherwise(when(col("prev_rank") == 1).then(lit("LIFR")).when(col("prev_rank") == 2).then(lit("IFR")).when(col("prev_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR"))),
                  worst = when(col("worst_rank").is_null()).then(lit(None)).otherwise(when(col("worst_rank") == 1).then(lit("LIFR")).when(col("worst_rank") == 2).then(lit("IFR")).when(col("worst_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR"))),
                  decides_z = (col("decides_hour") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%H:00Z"))
    .select("order", "icao", "role", "name", "use_z", "verdict", "prevailing", "worst", "decides", "decides_z",
            "metar", "metar_minima", "metar_z", "metar_raw", "taf_hours", "ok_prev", "ok_all", "metar_vmc",
            "t_use", "win_from", "win_to", "obs", "along", "off_km")
    .sort("order")