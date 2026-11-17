# One row per material: the ground-state structure (on the convex hull) of an
# element or binary compound, with Alexandria's PBE band gaps in eV:
#   gap_ev:        the fundamental gap, from the top of the valence band to the
#                  bottom of the conduction band, wherever in k-space they are;
#   gap_direct_ev: the smallest vertical gap (same k), the one a photon can
#                  cross without a phonon.
# margin_ev = gap_direct - gap: 0 for a direct-gap material; how much the
# electron must lose to a lattice vibration first in an indirect one.
data.rows("data").unnest("attributes")
    .select("id", "nsites", "elements", "elements_ratios",
            formula = col("chemical_formula_reduced"), sg = col("_alexandria_space_group"),
            gap_ev = col("_alexandria_band_gap"), gap_direct_ev = col("_alexandria_band_gap_direct"))
    .with_columns(margin_ev = (col("gap_direct_ev") - col("gap_ev")).round(4),
                  link = concat_str([lit("https://alexandria.icams.rub.de/pbe/v1/structures/"), col("id")]))
    .with_columns(gap_type = when(col("margin_ev") <= 0.005).then(lit("direct")).otherwise(lit("indirect")))