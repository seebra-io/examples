# hourly means (four quarter-hours each) in GW; local time is CEST (UTC+2) in May and June
data.with_columns(h = col("t") // 3600)
    .group_by("h")
    .agg(n = len(), price = col("price").mean(), load_gw = col("load_mw").mean() / 1000, residual_gw = col("residual_mw").mean() / 1000,
         solar_gw = col("solar_mw").mean() / 1000, wind_gw = (col("wind_on_mw") + col("wind_off_mw")).mean() / 1000,
         gas_gw = col("gas_mw").mean() / 1000, coal_gw = col("coal_mw").mean() / 1000, lignite_gw = col("lignite_mw").mean() / 1000,
         imports_gw = col("imports_mw").mean() / 1000, pump_gw = col("pump_gen_mw").mean() / 1000, biomass_gw = col("biomass_mw").mean() / 1000)
    .filter(col("n") == 4)
    .with_columns(time = (col("h") * 3600 * 1000000).cast(Datetime).dt.strftime("%Y-%m-%d %H:00 UTC"),
                  day = (col("h") * 3600 * 1000000).cast(Datetime).dt.strftime("%Y-%m-%d"),
                  local_hour = (col("h") + 2) % 24,
                  renewables_gw = col("solar_gw") + col("wind_gw"))
    .with_columns(price = col("price").round(2), load_gw = col("load_gw").round(2), residual_gw = col("residual_gw").round(2),
                  solar_gw = col("solar_gw").round(2), wind_gw = col("wind_gw").round(2), gas_gw = col("gas_gw").round(2),
                  coal_gw = col("coal_gw").round(2), lignite_gw = col("lignite_gw").round(2), imports_gw = col("imports_gw").round(2),
                  pump_gw = col("pump_gw").round(2), biomass_gw = col("biomass_gw").round(2), renewables_gw = col("renewables_gw").round(2),
                  renewable_share_pct = (col("renewables_gw") / col("load_gw") * 100).round(1))
    .drop("n")
    .sort("h")