data.sort("n", descending=True).head(1)
    # maximum curvature: the most populated bin, plus 0.2 (Woessner & Wiemer 2005)
    .select(mc_maxc = col("m"), mc = (col("m") + 0.2).round(1), quakes_in_mode = col("n"))