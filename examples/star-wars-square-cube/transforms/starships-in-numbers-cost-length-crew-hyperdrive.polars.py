# starships: cost (credits), length (m), crew (the upper end of "30-165"), hyperdrive class (lower is faster) and MGLT (sublight speed)
data.with_columns(cost = col("cost_in_credits").str.replace_all(",", "").cast(Float64, strict=False),
                  length_m = col("length").str.replace_all(",", "").cast(Float64, strict=False),
                  crew_n = col("crew").str.replace_all(",", "").str.split("-").list.last().cast(Float64, strict=False),
                  hyperdrive = col("hyperdrive_rating").cast(Float64, strict=False),
                  mglt = col("MGLT").cast(Float64, strict=False),
                  films_n = col("films").list.len(), pilots_n = col("pilots").list.len())
    .with_columns(log_len = col("length_m").log(10), log_cost = col("cost").log(10), log_crew = col("crew_n").log(10),
                  cost_per_m3 = col("cost") / col("length_m").pow(3),
                  wiki = concat_str([lit("https://starwars.fandom.com/wiki/"), col("name").str.replace_all(" ", "_")]))
    .select("name", "model", "manufacturer", "starship_class", "cost", "length_m", "crew_n", "hyperdrive", "mglt", "films_n", "pilots_n",
            "log_len", "log_cost", "log_crew", "cost_per_m3", "wiki")
    .sort("length_m")