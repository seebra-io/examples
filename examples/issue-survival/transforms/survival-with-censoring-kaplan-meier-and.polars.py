data.group_by("grp", "days")
    .agg(closed = col("closed").cast(Int64).sum(), left = len().cast(Int64))
    .with_columns(censored = col("left") - col("closed"))
    .sort("grp", "days")
    # at risk: issues still open (and still followed) just before this time
    .with_columns(at_risk = col("left").sum().over("grp") - col("left").cum_sum().over("grp") + col("left"))
    .with_columns(q = col("closed").cast(Float64) / col("at_risk").cast(Float64))
    # Kaplan–Meier: S(t) is the product of (1 - closed / at risk) over the times up to t, done as a sum of logs
    .with_columns(survival = (1 - col("q")).log().cum_sum().over("grp").exp(),
                  greenwood = when(col("at_risk") > col("closed"))
                      .then(col("closed").cast(Float64) / (col("at_risk") * (col("at_risk") - col("closed"))).cast(Float64))
                      .otherwise(0.0).cum_sum().over("grp"))
    .with_columns(se = col("survival") * col("greenwood").sqrt())
    .with_columns(lo = (col("survival") - 1.96 * col("se")).clip(0, 1).round(3), hi = (col("survival") + 1.96 * col("se")).clip(0, 1).round(3),
                  survival = col("survival").round(3))
    .select("grp", "days", "at_risk", "closed", "censored", "survival", "lo", "hi")