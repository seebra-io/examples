# the average day (local time): the duck curve of residual load, and the price that follows it
data.group_by("local_hour")
    .agg(days = len(), load_gw = col("load_gw").mean(), residual_gw = col("residual_gw").mean(), solar_gw = col("solar_gw").mean(),
         wind_gw = col("wind_gw").mean(), gas_gw = col("gas_gw").mean(), price = col("price").mean(), median_price = col("price").median(),
         negative_pct = when(col("price") < 0).then(100.0).otherwise(0.0).mean())
    .with_columns(load_gw = col("load_gw").round(2), residual_gw = col("residual_gw").round(2), solar_gw = col("solar_gw").round(2),
                  wind_gw = col("wind_gw").round(2), gas_gw = col("gas_gw").round(2), price = col("price").round(1),
                  median_price = col("median_price").round(1), negative_pct = col("negative_pct").round(1))
    .sort("local_hour")