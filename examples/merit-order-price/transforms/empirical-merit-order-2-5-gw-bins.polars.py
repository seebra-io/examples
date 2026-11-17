# the empirical merit order: hours binned by residual load (2.5 GW bins); price spread and who generates in each bin
data.with_columns(bin_gw = (col("residual_gw") / 2.5).floor() * 2.5 + 1.25)
    .group_by("bin_gw")
    .agg(hours = len(), median_price = col("price").median(), p10_price = col("price").quantile(0.1), p90_price = col("price").quantile(0.9),
         mean_price = col("price").mean(), negative_pct = when(col("price") < 0).then(100.0).otherwise(0.0).mean(),
         gas_gw = col("gas_gw").mean(), coal_gw = col("coal_gw").mean(), lignite_gw = col("lignite_gw").mean(),
         imports_gw = col("imports_gw").mean(), pump_gw = col("pump_gw").mean(), solar_gw = col("solar_gw").mean(), wind_gw = col("wind_gw").mean())
    .filter(col("hours") >= 5)
    .with_columns(median_price = col("median_price").round(1), p10_price = col("p10_price").round(1), p90_price = col("p90_price").round(1),
                  mean_price = col("mean_price").round(1), negative_pct = col("negative_pct").round(1),
                  gas_gw = col("gas_gw").round(2), coal_gw = col("coal_gw").round(2), lignite_gw = col("lignite_gw").round(2),
                  imports_gw = col("imports_gw").round(2), pump_gw = col("pump_gw").round(2), solar_gw = col("solar_gw").round(2), wind_gw = col("wind_gw").round(2))
    .sort("bin_gw")