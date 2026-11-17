data.filter((col("stage") == "main sequence") & col("mass_flame").is_not_null())
    .with_columns(mx = col("log_m").mean(), my = col("log_l").mean())
    .with_columns(b = ((col("log_m") - col("mx")) * (col("log_l") - col("my"))).sum() / (col("log_m") - col("mx")).pow(2).sum())
    .with_columns(res = col("log_l") - col("my") - col("b") * (col("log_m") - col("mx")))
    .select(main_sequence_stars = len(), alpha = col("b").first(), intercept = (col("my") - col("b") * col("mx")).first(),
            se_alpha = ((col("res").pow(2).sum() / (len() - 2)) / (col("log_m") - col("mx").first()).pow(2).sum()).sqrt(),
            scatter_dex = col("res").std(), mass_min = col("mass_flame").min(), mass_max = col("mass_flame").max())
    .with_columns(alpha = col("alpha").round(3), intercept = col("intercept").round(3), se_alpha = col("se_alpha").round(3), scatter_dex = col("scatter_dex").round(3),
                  mass_min = col("mass_min").round(2), mass_max = col("mass_max").round(2))