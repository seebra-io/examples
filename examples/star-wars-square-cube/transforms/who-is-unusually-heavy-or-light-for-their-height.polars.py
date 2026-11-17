# each character against the law fitted on everyone but Jabba: how many times heavier than a Star Wars body of that height
data.filter(col("mass_kg").is_not_null() & col("height_cm").is_not_null())
    .join(data1.filter(col("grp") == "all but Jabba").select("slope", "intercept"), how="cross")
    .with_columns(expected_kg = lit(10.0).pow(col("intercept") + col("slope") * col("log_h")))
    .with_columns(heavier_by = col("mass_kg") / col("expected_kg"),
                  log_resid = col("log_m") - col("intercept") - col("slope") * col("log_h"),
                  vs_species_height = col("height_cm") / col("species_avg_height"),
                  # a scaled human: Luke (172 cm, 77 kg) blown up or shrunk with mass ∝ height³
                  cube_kg = 77 * (col("height_cm") / 172).pow(3))
    .select("name", "species", "group", "homeworld_name", "height_cm", "mass_kg",
            bmi = col("bmi").round(1), expected_kg = col("expected_kg").round(1), heavier_by = col("heavier_by").round(2),
            log_resid = col("log_resid").round(3), cube_kg = col("cube_kg").round(1),
            species_avg_height = col("species_avg_height"), vs_species_height = col("vs_species_height").round(2),
            films_n = col("films_n"), wiki = col("wiki"))
    .sort("log_resid", descending=True)