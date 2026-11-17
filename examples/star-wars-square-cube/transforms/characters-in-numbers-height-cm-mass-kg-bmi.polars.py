# SWAPI keeps numbers as text ("1,358", "unknown"): strip the thousands comma and cast, so unknown becomes null
data.with_columns(height_cm = col("height").str.replace_all(",", "").cast(Float64, strict=False),
                  mass_kg = col("mass").str.replace_all(",", "").cast(Float64, strict=False),
                  species_url = col("species").list.first(),
                  films_n = col("films").list.len(),
                  starships_n = col("starships").list.len())
    .join(data1.select(species_url = col("url"), species_name = col("name"), classification = col("classification"),
                       species_avg_height = col("average_height").cast(Float64, strict=False)),
          on="species_url", how="left")
    .join(data2.select(homeworld = col("url"), homeworld_name = col("name"), climate = col("climate"),
                       gravity = col("gravity").str.split(" ").list.first().cast(Float64, strict=False)),
          on="homeworld", how="left")
    # SWAPI leaves species empty for most humans (Luke, Leia, Han ...): 32 of 82 people
    .with_columns(species = col("species_name").fill_null("Human (species not listed)"),
                  group = when(col("species_name") == "Droid").then(lit("droid"))
                          .when(col("species_name").is_null() | (col("species_name") == "Human")).then(lit("human"))
                          .otherwise(lit("alien")),
                  bmi = col("mass_kg") / (col("height_cm") / 100).pow(2),
                  log_h = col("height_cm").log(10), log_m = col("mass_kg").log(10),
                  wiki = concat_str([lit("https://starwars.fandom.com/wiki/"), col("name").str.replace_all(" ", "_")]))
    .select("name", "species", "group", "classification", "homeworld_name", "climate", "gravity", "height_cm", "mass_kg", "bmi", "log_h", "log_m",
            "species_avg_height", "films_n", "starships_n", "gender", "birth_year", "wiki", "url")