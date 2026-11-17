data.filter(col("mw").is_not_null())
    .group_by("time")
    .agg(nuclear = when(col("source") == "Nuclear").then(col("mw")).otherwise(lit(None)).max(),
         hydro = when(col("source") == "Hydro water reservoir").then(col("mw")).otherwise(lit(None)).max(),
         wind = when(col("source") == "Wind onshore").then(col("mw")).otherwise(lit(None)).max(),
         solar = when(col("source") == "Solar").then(col("mw")).otherwise(lit(None)).max(),
         load = when(col("source") == "Load").then(col("mw")).otherwise(lit(None)).max(),
         trade = when(col("source") == "Cross border electricity trading").then(col("mw")).otherwise(lit(None)).max())
    .with_columns(net_export = -col("trade"))
    .drop("trade")
    .sort("time")