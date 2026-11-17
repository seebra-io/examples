# How far each estimated flyby is from JPL's own (integrated) approach: the
# estimate's closest distance and its hour against CAD's nominal distance.
# Off by more than a quarter, or slower than 2 km/s (Earth's own pull, which
# the two-body estimate leaves out, bends a slow flyby): don't trust its path.
data.filter(col("r_ld") == col("r_ld").min().over("name"))
    .select("name", "date", jpl_ld = col("jpl_ld"), estimate_ld = col("r_ld").round(2), hour_of_closest = col("hours"),
            off_pct = ((col("r_ld") - col("jpl_ld")) / col("jpl_ld") * 100).round(1), v_rel_kms = col("v_rel_kms"), size_m = col("size_m"))
    .with_columns(trust = when((col("off_pct") > 25) | (col("off_pct") < -25) | (col("v_rel_kms") < 2)).then(lit("no: Earth's pull dominates or the orbit is off")).otherwise(lit("yes")))
    .sort("jpl_ld")
