# How much of the plane is used: the 1,296 cells of 10° × 10°, how many
# hold at least one residue, and how few cells hold most residues (cells
# sorted by count, the cumulative share of residues). The aha in numbers:
# a few percent of the plane holds most of the residues.
data.group_by("cell_phi", "cell_psi")
    .agg(n = len(), helix = (col("ss") == "helix").sum(), strand = (col("ss") == "strand").sum(), gly = (col("res") == "GLY").sum())
    .sort("n", descending=True)
    .with_row_index("rank", offset=1)
    .with_columns(cum_share = (col("n").cum_sum() / col("n").sum()).round(4),
                  plane_share = (col("rank") / 1296).round(4),
                  total = col("n").sum())