# attenuation per period: with 1/r geometric spreading taken out, ln(SA · r) = a − κ r (for body waves κ = π f / (Q β));
# fitted by least squares over 50–500 km. A larger κ means the motion at that period dies faster with distance
data.filter((col("distance_km") >= 50) & (col("distance_km") <= 500))
    .with_columns(y = (col("sa_g") * col("distance_km")).log(), r = col("distance_km"))
    .group_by("period_s")
    .agg(stations = len(), mr = col("r").mean(), my = col("y").mean(), mry = (col("r") * col("y")).mean(), mrr = (col("r") * col("r")).mean(),
         myy = (col("y") * col("y")).mean())
    .with_columns(slope = (col("mry") - col("mr") * col("my")) / (col("mrr") - col("mr") * col("mr")))
    .with_columns(kappa_per_km = (-col("slope")).round(5),
                  r2 = (((col("mry") - col("mr") * col("my")) * (col("mry") - col("mr") * col("my"))) / ((col("mrr") - col("mr") * col("mr")) * (col("myy") - col("my") * col("my")))).round(3),
                  f_hz = when(col("period_s") == 0).then(lit(None)).otherwise(1 / col("period_s")),
                  halving_km = (0.6931 / (-col("slope"))).round(0))
    .select("period_s", "stations", "kappa_per_km", "halving_km", "r2")
    .sort("period_s")