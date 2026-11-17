# each workflow's part of the load: L_i = λ_i · W_i, and the parts add up to the whole L
data.group_by("name")
    .agg(runs = len(), W_min = col("duration_min").mean(), run_minutes = col("duration_min").sum(), example_run = col("html_url").first())
    .with_columns(lambda_per_hour = (col("runs").cast(Float64) / 24).round(3),
                  L_part = (col("run_minutes") / 1440).round(3),
                  share_of_runs = (col("runs").cast(Float64) / col("runs").sum().cast(Float64)).round(4),
                  share_of_L = (col("run_minutes") / col("run_minutes").sum()).round(4),
                  W_min = col("W_min").round(1), run_minutes = col("run_minutes").round(1))
    .sort("L_part", descending=True)