# Per defect density: the logic dies' yield and cost index at the extremes and
# the median, and how much more a good mm² of the largest die costs than one of
# the smallest (cost_ratio).
data.filter(col("kind") == "logic chip")
    .group_by("d0")
    .agg(chips = len(), smallest_mm2 = col("area_mm2").min(), largest_mm2 = col("area_mm2").max(),
         yield_smallest = col("y_poisson").max(), yield_largest = col("y_poisson").min(),
         cost_smallest = col("cost_index").min(), cost_largest = col("cost_index").max(),
         median_yield = col("y_poisson").median())
    .with_columns(cost_ratio = col("cost_largest") / col("cost_smallest"))
    .select("d0", "chips", "smallest_mm2", "largest_mm2", yield_smallest = col("yield_smallest").round(3), yield_largest = col("yield_largest").round(3),
            median_yield = col("median_yield").round(3), cost_smallest = col("cost_smallest").round(3), cost_largest = col("cost_largest").round(3), cost_ratio = col("cost_ratio").round(2))
    .sort("d0")