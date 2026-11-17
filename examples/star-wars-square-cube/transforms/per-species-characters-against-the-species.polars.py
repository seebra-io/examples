# per species: the characters SWAPI has, against the species' own average height
data.group_by("species")
    .agg(characters = len(), weighed = col("mass_kg").is_not_null().sum(),
         mean_height_cm = col("height_cm").mean(), min_height_cm = col("height_cm").min(), max_height_cm = col("height_cm").max(),
         mean_mass_kg = col("mass_kg").mean(), mean_bmi = col("bmi").mean(),
         species_avg_height = col("species_avg_height").first(), classification = col("classification").first(),
         group = col("group").first(), names = col("name").first())
    .with_columns(mean_height_cm = col("mean_height_cm").round(0), mean_mass_kg = col("mean_mass_kg").round(1), mean_bmi = col("mean_bmi").round(1),
                  height_vs_average = (col("mean_height_cm") / col("species_avg_height")).round(2),
                  wiki = concat_str([lit("https://starwars.fandom.com/wiki/"), col("species").str.replace_all(" ", "_")]))
    .sort("mean_height_cm", descending=True)