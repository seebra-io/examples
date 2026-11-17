data.filter(col("in_fit"))
    .group_by("region")
    .agg(countries = len(), median_fert_kg_ha = col("fert_kg_ha").median().round(0), median_yield_kg_ha = col("yield_kg_ha").median().round(0),
         median_mp = col("mp").median().round(1), median_grain_per_kg = col("grain_per_kg_fert").median().round(1),
         share_flat = (col("mp") < 3).cast(Float64).mean().round(2), mean_resid_pct = col("resid_pct").mean().round(1))
    .sort("median_fert_kg_ha")