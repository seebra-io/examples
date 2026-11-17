# one row per day of space heating for system 700 (a Vaillant aroTHERM plus); fields= asks for these columns only. Summer days have no space heating (empty)
data.select(day = (col("timestamp").cast(Int64) * 1000000).cast(Datetime).dt.strftime("%Y-%m-%d"),
            heat_kwh = col("space_heat_kwh").cast(Float64, strict=False), elec_kwh = col("space_elec_kwh").cast(Float64, strict=False),
            flow_c = col("space_flowT_mean").cast(Float64, strict=False), return_c = col("space_returnT_mean").cast(Float64, strict=False),
            outside_c = col("space_outsideT_mean").cast(Float64, strict=False), room_c = col("space_roomT_mean").cast(Float64, strict=False))
    .filter(col("heat_kwh").is_not_null() & col("elec_kwh").is_not_null() & col("flow_c").is_not_null() & col("outside_c").is_not_null())
    .filter((col("elec_kwh") >= 0.5) & (col("heat_kwh") > 0))
    .with_columns(system = lit("London (radiators)"), system_id = lit("700"))