data.rows("parts")
    .with_columns(mass_kg = col("mass_kg").cast(Float64), power_w = col("power_w").cast(Float64))