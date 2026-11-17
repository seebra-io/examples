data.group_by("band", "built")
    .agg(bridges = col("n").sum(),
         mean_rating = (col("rating") * col("n")).sum() / col("n").sum(),
         poor = (col("n") * (col("rating") <= 4).cast(Int64)).sum(),
         good = (col("n") * (col("rating") >= 7).cast(Int64)).sum())
    .with_columns(share_poor = col("poor") / col("bridges"), share_good = col("good") / col("bridges"),
                  age_mid = col("band") + 2.5)
    .with_columns(log_poor = when(col("share_poor") > 0).then(col("share_poor").log()),
                  # drill down: the poor bridges of this cohort, record by record, on the FHWA/BTS server
                  link = concat_str([lit("https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Bridge_Inventory/FeatureServer/0/query?outFields=STRUCTURE_NUMBER_008,STATE_CODE_001,FACILITY_CARRIED_007,FEATURES_DESC_006A,YEAR_BUILT_027,YEAR_RECONSTRUCTED_106,LOWEST_RATING,BRIDGE_CONDITION,ADT_029&returnGeometry=false&resultRecordCount=200&f=html&where=LOWEST_RATING%3C%3D4%20AND%20YEAR_BUILT_027%20BETWEEN%20"), (2025 - col("band") - 4).cast(String), lit("%20AND%20"), (2025 - col("band")).cast(String)]))
    .with_columns(mean_rating = col("mean_rating").round(3), share_poor = col("share_poor").round(5), share_good = col("share_good").round(4), log_poor = col("log_poor").round(4))
    .sort("band")