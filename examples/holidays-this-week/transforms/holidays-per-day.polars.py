data.group_by("date")
    .agg(holidays = len(), nationwide = col("nationwide").sum(), countries = col("code").n_unique())
    .sort("date")