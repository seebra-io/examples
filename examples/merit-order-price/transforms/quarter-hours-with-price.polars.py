# one row per quarter-hour: load, what wind and sun cover, what the fossil plants and neighbours supply, and the price
data.filter(col("mw").is_not_null())
    .group_by("t")
    .agg(load_mw = when(col("source") == "Load").then(col("mw")).otherwise(lit(None)).max(),
         residual_mw = when(col("source") == "Residual load").then(col("mw")).otherwise(lit(None)).max(),
         solar_mw = when(col("source") == "Solar").then(col("mw")).otherwise(lit(None)).max(),
         wind_on_mw = when(col("source") == "Wind onshore").then(col("mw")).otherwise(lit(None)).max(),
         wind_off_mw = when(col("source") == "Wind offshore").then(col("mw")).otherwise(lit(None)).max(),
         gas_mw = when(col("source") == "Fossil gas").then(col("mw")).otherwise(lit(None)).max(),
         coal_mw = when(col("source") == "Fossil hard coal").then(col("mw")).otherwise(lit(None)).max(),
         lignite_mw = when(col("source") == "Fossil brown coal / lignite").then(col("mw")).otherwise(lit(None)).max(),
         imports_mw = when(col("source") == "Cross border electricity trading").then(col("mw")).otherwise(lit(None)).max(),
         pump_gen_mw = when(col("source") == "Hydro pumped storage").then(col("mw")).otherwise(lit(None)).max(),
         biomass_mw = when(col("source") == "Biomass").then(col("mw")).otherwise(lit(None)).max())
    .join(data1, on="t", how="inner")
    .sort("t")