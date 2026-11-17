# the main tidal constituents (speeds from the IHO/NOAA harmonic tables, in cycles per day), and where each lands when sampled at fs
data.head(5).with_row_index("k")
    .select(constituent = when(col("k") == 0).then(lit("M2")).when(col("k") == 1).then(lit("S2")).when(col("k") == 2).then(lit("N2"))
                          .when(col("k") == 3).then(lit("K1")).otherwise(lit("O1")),
            f_cpd = when(col("k") == 0).then(1.9322736).when(col("k") == 1).then(2.0).when(col("k") == 2).then(1.8959820)
                          .when(col("k") == 3).then(1.0027379).otherwise(0.9295357),
            what = when(col("k") == 0).then(lit("principal lunar semidiurnal, 12.42 h")).when(col("k") == 1).then(lit("principal solar semidiurnal, 12.00 h"))
                          .when(col("k") == 2).then(lit("larger lunar elliptic, 12.66 h")).when(col("k") == 3).then(lit("luni-solar diurnal, 23.93 h"))
                          .otherwise(lit("lunar diurnal, 25.82 h")))
    .join(data1.select("scheme", "step_h", "fs_cpd", "nyquist_cpd"), how="cross")
    .with_columns(alias_cpd = (col("f_cpd") - col("fs_cpd") * (col("f_cpd") / col("fs_cpd")).round(0)).abs())
    .with_columns(apparent_period_days = (1 / col("alias_cpd")).round(2),
                  true_period_hours = (24 / col("f_cpd")).round(2),
                  aliased = col("f_cpd") > col("nyquist_cpd"),
                  alias_cpd = col("alias_cpd").round(5))
    .sort("scheme", "f_cpd")