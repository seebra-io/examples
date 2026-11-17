# per class of liquid: the entropy of vaporisation the readings imply, and how well one number (the boiling point) predicts the vapour pressure
data.filter(col("plausible"))
    .group_by("hbond")
    .agg(liquids = len(), ds_median = col("ds_implied").median(), ds_q25 = col("ds_implied").quantile(0.25, "linear"),
         ds_q75 = col("ds_implied").quantile(0.75, "linear"), ds_mean = col("ds_implied").mean(), ds_sd = col("ds_implied").std(),
         median_log_ratio_trouton = col("log_ratio").median(),
         within_2x_trouton = (col("log_ratio").abs() < 0.30103).cast(Float64).mean(),
         median_log_ratio_fit = col("log_ratio_fit").median(),
         within_2x_fit = (col("log_ratio_fit").abs() < 0.30103).cast(Float64).mean(),
         ds_fit = col("ds_fit").first())
    .with_columns(ds_median_over_r = (col("ds_median") / 8.314462618).round(2), ds_median = col("ds_median").round(1), ds_q25 = col("ds_q25").round(1),
                  ds_q75 = col("ds_q75").round(1), ds_mean = col("ds_mean").round(1), ds_sd = col("ds_sd").round(1),
                  median_log_ratio_trouton = col("median_log_ratio_trouton").round(3), within_2x_trouton = col("within_2x_trouton").round(3),
                  median_log_ratio_fit = col("median_log_ratio_fit").round(3), within_2x_fit = col("within_2x_fit").round(3))
    .sort("ds_median")