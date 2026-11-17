# The prevailing forecast per airport and hour: of the base, FM and
# BECMG groups valid in that hour, the one that started last. During a
# BECMG's change period (t_from to t_bec) the conditions before it still
# apply part of the time: before_rank and before_vmc are the previous
# group's category and minima check, and the next step counts them as
# possible.
data.filter(col("kind") == "prevailing")
    .sort("icao", "t_from", "p")
    .with_columns(before_rank = col("own_rank").shift(1).over("icao"), before_vmc = col("own_vmc").shift(1).over("icao"))
    .join(data1, how="cross")
    .filter((col("t") >= col("t_from")) & (col("t") < col("t_to")))
    .sort("icao", "t", "t_from", "p")
    .group_by("icao", "t")
    .agg(hour = col("hour").last(), p = col("p").last(), group = col("group").last(), text = col("text").last(),
         vis_sm = col("vis_sm").last(), ceiling_ft = col("ceiling_ft").last(), rank = col("own_rank").last(),
         t_bec = col("t_bec").last(), before_rank = col("before_rank").last(), before_vmc = col("before_vmc").last())
    .with_columns(in_change = (col("t_bec").is_not_null() & (col("t") < col("t_bec"))).cast(Int64))
    .with_columns(vmc = ((col("ceiling_ft").fill_null(99999) >= 1500) & (col("vis_sm").fill_null(99) * 1609.34 >= 5000)).cast(Int64))
    .sort("icao", "t")