# US national influenza, week by week (CDC FluView via Delphi): wILI, the
# share of outpatient visits for influenza-like illness (weighted by state
# population, %), and percent_positive, the share of clinical-lab
# specimens positive for influenza. ILI+ = wILI × percent positive / 100
# is the standard proxy for influenza itself (Goldstein et al. 2011): it
# drops the colds and other viruses that make up the ILI baseline.
# season: a flu season runs from epiweek 40 to week 39 of the next year;
# t: weeks since the season's first week.
data.select("epiweek", "wili", "num_ili", "num_patients", "num_providers")
    .join(data1.select("epiweek", "percent_positive", "total_specimens", "total_a", "total_b"), on="epiweek")
    .with_columns(year = (col("epiweek") // 100).cast(Int64), week = (col("epiweek") % 100).cast(Int64))
    .with_columns(season_start = when(col("week") >= 40).then(col("year")).otherwise(col("year") - 1))
    .with_columns(season = concat_str([col("season_start").cast(Utf8), lit("–"), (col("season_start") + 1).cast(Utf8).str.slice(2, 2)]),
                  ili_plus = (col("wili") * col("percent_positive") / 100).round(4),
                  share_b = (col("total_b") / (col("total_a") + col("total_b"))).round(3))
    .sort("epiweek")
    .with_row_index("i")
    .with_columns(t = (col("i") - col("i").min().over("season")).cast(Int64))
    .select("season", "season_start", "epiweek", "t", "wili", "percent_positive", "ili_plus", "total_specimens", "total_a", "total_b", "share_b", "num_ili", "num_patients")