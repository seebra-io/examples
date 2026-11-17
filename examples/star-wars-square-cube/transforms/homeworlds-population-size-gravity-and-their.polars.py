# homeworlds: population, size, climate and gravity, with how heavy their characters are against the law (odd's log_resid)
data.with_columns(population = col("population").cast(Float64, strict=False), diameter_km = col("diameter").cast(Float64, strict=False),
                  gravity_g = col("gravity").str.split(" ").list.first().cast(Float64, strict=False),
                  water_pct = col("surface_water").cast(Float64, strict=False),
                  climate_main = col("climate").str.split(",").list.first(), residents_n = col("residents").list.len(), films_n = col("films").list.len())
    .join(data1.group_by("homeworld_name").agg(weighed = len(), mean_heavier_by = col("heavier_by").mean(), who = col("name").first()),
          left_on="name", right_on="homeworld_name", how="left")
    .filter(col("name") != "unknown")
    .with_columns(density_per_km2 = when(col("diameter_km") > 0).then(col("population") / (3.14159 * col("diameter_km").pow(2))).otherwise(None),
                  mean_heavier_by = col("mean_heavier_by").round(2),
                  wiki = concat_str([lit("https://starwars.fandom.com/wiki/"), col("name").str.replace_all(" ", "_")]))
    .select("name", "climate", "climate_main", "terrain", "population", "diameter_km", "density_per_km2", "gravity_g", "water_pct",
            "residents_n", "films_n", "weighed", "mean_heavier_by", "who", "wiki")
    .sort("population", descending=True)