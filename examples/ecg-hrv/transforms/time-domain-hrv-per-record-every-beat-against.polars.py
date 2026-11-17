# HRV standards (Task Force of the ESC/NASPE, 1996): SDNN = sd of NN intervals, RMSSD = rms of successive NN differences,
# pNN50 = share of successive differences over 50 ms. Poincaré: SD1 = sd((RRₙ₊₁ − RRₙ)/√2) (beat-to-beat), SD2 = sd((RRₙ₊₁ + RRₙ)/√2) (slow).
data.with_columns(rr_nn = when(col("nn")).then(col("rr_ms")),
                  x_nn = when(col("poincare_nn")).then(col("rr_ms")), y_nn = when(col("poincare_nn")).then(col("rr_next")))
    .group_by("record", "label", "db", "link")
    .agg(beats = len(), nn_intervals = col("nn").cast(Int64).sum(),
         ectopic_beats = (col("a") != "N").cast(Int64).sum(),
         v_beats = (col("a") == "V").cast(Int64).sum(), a_beats = col("a").is_in(["A", "a", "S", "J"]).cast(Int64).sum(),
         mean_rr_all = col("rr_ms").mean(), sdnn_all = col("rr_ms").std(),
         rmssd_all = col("d_all").pow(2).mean().sqrt(),
         pnn50_all = (col("abs_d_all") > 50).cast(Float64).mean(),
         mean_rr_nn = col("rr_nn").mean(), sdnn_nn = col("rr_nn").std(),
         rmssd_nn = col("d_nn").pow(2).mean().sqrt(),
         pnn50_nn = (col("abs_d_nn") > 50).cast(Float64).mean(),
         sd1 = ((col("y_nn") - col("x_nn")) / 1.4142135623730951).std(),
         sd2 = ((col("y_nn") + col("x_nn")) / 1.4142135623730951).std(),
         successive_nn = col("d_nn").is_not_null().cast(Int64).sum())
    .with_columns(mean_hr_nn = 60000.0 / col("mean_rr_nn"), mean_hr_all = 60000.0 / col("mean_rr_all"),
                  rmssd_inflation = col("rmssd_all") / col("rmssd_nn"),
                  sd1_sd2 = col("sd1") / col("sd2"),
                  # the identity SD1² = RMSSD²/2 (up to the mean of the differences): SD1·√2 should equal RMSSD
                  sd1_times_sqrt2 = col("sd1") * 1.4142135623730951)
    .with_columns(mean_rr_all = col("mean_rr_all").round(1), sdnn_all = col("sdnn_all").round(1), rmssd_all = col("rmssd_all").round(1), pnn50_all = col("pnn50_all").round(3),
                  mean_rr_nn = col("mean_rr_nn").round(1), sdnn_nn = col("sdnn_nn").round(1), rmssd_nn = col("rmssd_nn").round(1), pnn50_nn = col("pnn50_nn").round(3),
                  sd1 = col("sd1").round(1), sd2 = col("sd2").round(1), sd1_sd2 = col("sd1_sd2").round(3), sd1_times_sqrt2 = col("sd1_times_sqrt2").round(1),
                  mean_hr_nn = col("mean_hr_nn").round(1), mean_hr_all = col("mean_hr_all").round(1), rmssd_inflation = col("rmssd_inflation").round(1))
    .sort("record")