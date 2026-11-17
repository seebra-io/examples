# the long-to-short ratio SA(3 s)/SA(0.3 s) against distance: least squares of its log on distance
data.select(stations = len(), mx = col("distance_km").mean(), my = col("ln_long_short").mean(),
            mxy = (col("distance_km") * col("ln_long_short")).mean(), mxx = (col("distance_km") * col("distance_km")).mean(),
            myy = (col("ln_long_short") * col("ln_long_short")).mean())
    .with_columns(slope = (col("mxy") - col("mx") * col("my")) / (col("mxx") - col("mx") * col("mx")))
    .with_columns(per_100km_factor = (col("slope") * 100).exp().round(3),
                  r = ((col("mxy") - col("mx") * col("my")) / ((col("mxx") - col("mx") * col("mx")) * (col("myy") - col("my") * col("my"))).sqrt()).round(3),
                  ratio_at_25km = (col("my") + col("slope") * (25 - col("mx"))).exp().round(3),
                  ratio_at_400km = (col("my") + col("slope") * (400 - col("mx"))).exp().round(3))
    .select("stations", "per_100km_factor", "r", "ratio_at_25km", "ratio_at_400km")