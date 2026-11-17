# ERA5 reanalysis at the farm (53.75 °N, 0.25 °E, the grid point next to it): wind at 100 m (the hub is at about 102 m),
# air temperature and surface pressure for the air density ρ = p / (R T), R = 287.05 J/(kg K)
data.rows("hourly.time").rename({"value": "time"}).with_row_index("i")
    .join(data.rows("hourly.wind_speed_100m").rename({"value": "v"}).with_row_index("i"), on="i")
    .join(data.rows("hourly.temperature_2m").rename({"value": "t_c"}).with_row_index("i"), on="i")
    .join(data.rows("hourly.surface_pressure").rename({"value": "p_hpa"}).with_row_index("i"), on="i")
    .filter(col("v").is_not_null() & col("t_c").is_not_null() & col("p_hpa").is_not_null())
    .with_columns(h = col("time").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 24 + col("time").str.slice(11, 2).cast(Int64),
                  rho = col("p_hpa") * 100 / (287.05 * (col("t_c") + 273.15)))
    .select("h", "time", "v", "t_c", "p_hpa", rho = col("rho").round(4))