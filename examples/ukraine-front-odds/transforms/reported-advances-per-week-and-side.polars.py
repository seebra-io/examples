# Reported advances per week and side: a count of places DeepState names in
# its updates, not of area or of every change. A rough "who is moving"
# signal; the map and the area step say how much.
# (the week as text, so the chart and the table read it the same way)
data.with_columns(week = col("date").str.to_date("%Y-%m-%d").dt.truncate("1w").dt.strftime("%Y-%m-%d"))
    .group_by("week", "side").agg(places = len())
    .sort("week", "side")
