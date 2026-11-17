# median: the smallest k whose cumulative share of advisors reaches one half
data.with_columns(cum_adv = col("n").cum_sum() / col("n").sum(), cum_links_desc = col("links").cum_sum(reverse=True) / col("links").sum(),
                  adv_desc = col("n").cum_sum(reverse=True) / col("n").sum())
    .select(advisors = col("n").sum(), supervisions = col("links").sum(),
            mean_students = col("links").sum() / col("n").sum(),
            median_students = when(col("cum_adv") >= 0.5).then(col("k")).otherwise(100000).min(),
            max_students = col("k").max(),
            share_with_one = when(col("k") == 1).then(col("share")).otherwise(0.0).sum(),
            # advisors with 20+ students: their share of advisors and of all supervisions
            share_advisors_20plus = when(col("k") == 20).then(col("adv_desc")).otherwise(0.0).max(),
            share_students_20plus = when(col("k") == 20).then(col("cum_links_desc")).otherwise(0.0).max(),
            variance = ((col("k") - col("links").sum() / col("n").sum()).pow(2) * col("n")).sum() / col("n").sum())
    .with_columns(mean_students = col("mean_students").round(3), share_with_one = col("share_with_one").round(4),
                  share_advisors_20plus = col("share_advisors_20plus").round(4), share_students_20plus = col("share_students_20plus").round(4),
                  sd_students = col("variance").sqrt().round(2))
    .drop("variance")