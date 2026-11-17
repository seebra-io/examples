# From growth rate to reproduction number (Wallinga & Lipsitch 2007). With
# a generation interval (infection to infection) of mean Tg = 3.0 days and
# sd 1.5 days (gamma, shape k = 4: influenza's, e.g. Cowling et al.
# 2009), R = (1 + r·Tg/k)^k; the SIR model's exponential interval gives
# R = 1 + r·Tg. doubling: ln 2 / r. Then the SIR model's three
# consequences of R: the herd-immunity threshold 1 − 1/R, the final size z
# (share ever infected) solving z = 1 − e^(−R z) (Newton's method, 8 steps
# from z = 1), and the peak prevalence 1 − (1 + ln R)/R. R here is the
# effective R at the season's start (some people are immune from earlier
# seasons and vaccination), not R0 in a naive population.
data.with_columns(r_day = col("r_week") / 7)
    .with_columns(doubling_days = (0.6931471805599453 / col("r_day")).round(1),
                  R = (1 + col("r_day") * 3.0 / 4).pow(4),
                  R_sir = 1 + col("r_day") * 3.0)
    .with_columns(hit = 1 - 1 / col("R"), z = lit(1.0))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(z = col("z") - (col("z") - 1 + (-col("R") * col("z")).exp()) / (1 - col("R") * (-col("R") * col("z")).exp()))
    .with_columns(peak_prevalence = 1 - (1 + col("R").log()) / col("R"))
    .with_columns(r_week = col("r_week").round(3), r_day = col("r_day").round(4), R = col("R").round(2), R_sir = col("R_sir").round(2),
                  hit = col("hit").round(3), final_size = col("z").round(3), peak_prevalence = col("peak_prevalence").round(4), peak = col("peak").round(3),
                  link = concat_str([lit("https://gis.cdc.gov/grasp/fluview/fluportaldashboard.html#"), col("season")]))
    .select("season", "season_start", "peak", "peak_t", "weeks", "t0", "t1", "r_week", "r_day", "doubling_days", "fit_r2", "R", "R_sir", "hit", "final_size", "peak_prevalence", "intercept", "link")