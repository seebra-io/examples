# The point of the dashboard, over every TAF in the box: per hour ahead,
# the share of airports below the VMC minima in the prevailing forecast and
# in everything the TAF allows (TEMPO, PROB, BECMG changes). The gap
# between the two lines is what a glance at the base forecast, or at the
# METAR, misses.
data.join(data.select(t0 = col("t").min()), how="cross")
    .with_columns(h = ((col("t") - col("t0")) / 3600).round(0).cast(Int64))
    .group_by("h", "t", "hour")
    .agg(airports = len(), below_prev = (1 - col("ok_prev")).sum(), below_all = (1 - col("ok_all")).sum(),
         with_temp = col("n_temp").is_not_null().sum())
    .with_columns(share_prev = (col("below_prev") / col("airports")).round(3),
                  share_all = (col("below_all") / col("airports")).round(3))
    .sort("h")