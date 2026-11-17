# what the cycles ask for: EPA's city cycle averages 31.5 km/h with 23 stops in 12 km, the highway cycle 77.7 km/h with none.
# Aerodynamic drag per km goes with v², so the highway cycle's drag per km is (77.7 / 31.5)² ≈ 6 times the city's;
# the kinetic energy of the stops (½ m v² per stop) is lost in a friction brake but largely recovered by regenerative braking
data.head(2).with_row_index("i")
    .select(cycle = when(col("i") == 0).then(lit("city (UDDS)")).otherwise(lit("highway (HWFET)")),
            mean_kmh = when(col("i") == 0).then(31.5).otherwise(77.7),
            km = when(col("i") == 0).then(12.07).otherwise(16.45),
            stops = when(col("i") == 0).then(23).otherwise(0))
    .with_columns(drag_per_km_vs_city = ((col("mean_kmh") / 31.5) ** 2).round(2), stops_per_km = (col("stops") / col("km")).round(2))