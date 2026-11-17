# one row per field visit: the measured discharge and the gage height read during it
data.rows("features")
    .select(visit = col("properties").struct.field("field_visit_id"), kind = col("properties").struct.field("reading_type"), value_text = col("properties").struct.field("value"), time = col("properties").struct.field("time"), rated = col("properties").struct.field("measurement_rated"))
    .filter(col("kind") == "Discharge")
    .select("visit", "time", "rated", discharge_cfs = col("value_text").cast(Float64, strict=False))
    .join(data.rows("features")
              .select(visit = col("properties").struct.field("field_visit_id"), kind = col("properties").struct.field("reading_type"), value_text = col("properties").struct.field("value"))
              .filter(col("kind") == "MeanGageHeight")
              .select("visit", stage_ft = col("value_text").cast(Float64, strict=False))
              .unique(subset=["visit"]),
          on="visit")
    .filter((col("discharge_cfs") > 0) & col("stage_ft").is_not_null())
    .with_columns(date = col("time").str.slice(0, 10), year = col("time").str.slice(0, 4).cast(Int64))
    .with_columns(decade = (col("year") // 10) * 10,
                  flow_class = when(col("discharge_cfs") < 60000).then(lit("low (< 60,000 ft³/s)"))
                               .when(col("discharge_cfs") < 150000).then(lit("medium"))
                               .otherwise(lit("flood (≥ 150,000 ft³/s)")),
                  link = lit("https://waterdata.usgs.gov/monitoring-location/USGS-06934500/"))
    .select("visit", "date", "year", "decade", "stage_ft", "discharge_cfs", "rated", "flow_class", "link")
    .sort("date")