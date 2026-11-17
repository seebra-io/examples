# H1: APIs in an energy or markets category are less distinct than the rest (Welch's t on distinct);
# H2: for them, removing place names makes them look more alike than for the rest (place_effect)
data.with_columns(group = when(col("categories").str.contains("energy|markets")).then(lit("energy & markets")).otherwise(lit("all other APIs")))
    .group_by("group")
    .agg(apis = len(), mean_distinct = col("distinct").mean(), sd_distinct = col("distinct").std(),
         mean_score = col("score_raw").mean(), mean_rarity = col("rarity").mean(),
         mean_place_effect = col("place_effect").mean(), sd_place_effect = col("place_effect").std(),
         share_nearest_same_kind = (col("similarity_1") > 0.5).cast(Float64).mean())
    .with_columns(se2 = col("sd_distinct").pow(2) / col("apis"), pe_se2 = col("sd_place_effect").pow(2) / col("apis"))
    .with_columns(welch_t_distinct = ((col("mean_distinct") - col("mean_distinct").mean()) * 2 / (col("se2").sum()).sqrt()).round(2),
                  welch_t_place_effect = ((col("mean_place_effect") - col("mean_place_effect").mean()) * 2 / (col("pe_se2").sum()).sqrt()).round(2))
    .select("group", "apis", "welch_t_distinct", "welch_t_place_effect",
            mean_distinct = col("mean_distinct").round(3), sd_distinct = col("sd_distinct").round(3),
            mean_score = col("mean_score").round(1), mean_rarity = col("mean_rarity").round(3),
            mean_place_effect = col("mean_place_effect").round(4), sd_place_effect = col("sd_place_effect").round(4),
            share_nearest_above_half = col("share_nearest_same_kind").round(3))
    .sort("group", descending=True)