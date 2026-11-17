data.sort("country", "year")
    .group_by("country", maintain_order=True)
    .agg(first_year = col("year").first(), last_year = col("year").last(),
         fert_first = col("fert_kg_ha").first().round(0), fert_last = col("fert_kg_ha").last().round(0), fert_peak = col("fert_kg_ha").max().round(0),
         yield_first = col("yield_kg_ha").first().round(0), yield_last = col("yield_kg_ha").last().round(0),
         grain_per_kg_first = col("grain_per_kg_fert").first(), grain_per_kg_last = col("grain_per_kg_fert").last())
    .with_columns(fert_change_pct = (100 * (col("fert_last") / col("fert_first") - 1)).round(0),
                  yield_change_pct = (100 * (col("yield_last") / col("yield_first") - 1)).round(0))
    .sort("fert_last", descending=True)