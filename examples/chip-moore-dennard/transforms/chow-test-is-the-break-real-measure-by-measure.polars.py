# Chow test of a structural break at the clock's break year, for each measure:
#   F = ((SSE_one_line - SSE_two_lines) / 2) / (SSE_two_lines / (n - 4))
# with 2 and n - 4 degrees of freedom (two extra parameters: a second slope
# and intercept). Caveat: the break year was chosen on the clock data, so for
# frequency the p-value is optimistic (a sup-F test would be fairer).
data.group_by("series")
    .agg(sse_two = col("sse").sum(), brk = col("brk").first(),
         slope_before = when(col("era").str.starts_with("before")).then(col("slope")).otherwise(None).max(),
         slope_after = when(col("era").str.ends_with(" on")).then(col("slope")).otherwise(None).max(),
         doubling_before = when(col("era").str.starts_with("before")).then(col("doubling_years")).otherwise(None).max(),
         doubling_after = when(col("era").str.ends_with(" on")).then(col("doubling_years")).otherwise(None).max())
    .join(data1, on="series")
    .with_columns(F = ((col("sse_all") - col("sse_two")) / 2) / (col("sse_two") / (col("n") - 4)))
    .with_columns(p_value = 1 - f_cdf(col("F"), 2, col("n") - 4),
                  slowdown = col("slope_after") / col("slope_before"))
    .select("series", "brk", "n", "slope_before", "slope_after", "doubling_before", "doubling_after",
            slowdown = col("slowdown").round(3), F = col("F").round(1), p_value = col("p_value").round(6))
    .sort("series")