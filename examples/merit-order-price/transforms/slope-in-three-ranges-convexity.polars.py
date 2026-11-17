# the merit order is convex: the slope of price against residual load in three ranges (least squares in each)
data.with_columns(segment = when(col("residual_gw") < 20).then(lit("1: residual below 20 GW"))
                            .when(col("residual_gw") < 35).then(lit("2: 20 to 35 GW"))
                            .otherwise(lit("3: above 35 GW")))
    .group_by("segment")
    .agg(hours = len(), mx = col("residual_gw").mean(), my = col("price").mean(),
         mxy = (col("residual_gw") * col("price")).mean(), mxx = (col("residual_gw") * col("residual_gw")).mean(),
         min_price = col("price").min(), max_price = col("price").max(), gas_gw = col("gas_gw").mean())
    .with_columns(slope_eur_per_gwh = ((col("mxy") - col("mx") * col("my")) / (col("mxx") - col("mx") * col("mx"))).round(2),
                  mean_residual_gw = col("mx").round(1), mean_price = col("my").round(1), gas_gw = col("gas_gw").round(2))
    .select("segment", "hours", "mean_residual_gw", "mean_price", "slope_eur_per_gwh", "min_price", "max_price", "gas_gw")
    .sort("segment")