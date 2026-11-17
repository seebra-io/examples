# Each material's elements looked up in the periodic table, then its family
# from the valences of its two elements in a 1:1 compound (GaAs: 3 and 5, so
# III-V; ZnSe: II-VI; SiC: IV-IV), or a group IV element (C, Si, Ge, Sn).
# II-VI and I-VII are split by the metal: a full-d-shell metal (Zn, Cd, Hg; Cu,
# Ag) or an alkaline-earth/alkali metal, since they crystallise differently.
# Everything else (other ratios, transition metals, halides of alkali metals
# beyond I-VII, ...) is 'other'.
data.select("id", "elements", "elements_ratios").explode("elements", "elements_ratios")
    .join(data1.select(elements = col("symbol"), valence = col("valence"), chi = col("chi"), block = col("block")), on="elements", how="left")
    .group_by("id")
    .agg(n_el = len(), v_min = col("valence").min(), v_max = col("valence").max(),
         v_missing = col("valence").is_null().sum(), ratio_max = col("elements_ratios").max(),
         delta_chi = col("chi").max() - col("chi").min(),
         d_metal = (col("block") == "Transition metal").sum())
    .join(data.drop("elements", "elements_ratios"), on="id")
    .with_columns(family = when(col("v_missing") > 0).then(lit("other"))
        .when(col("n_el") == 1).then(when(col("v_min") == 4).then(lit("IV element")).otherwise(lit("other")))
        .when(col("ratio_max") > 0.5).then(lit("other"))
        .when((col("v_min") == 4) & (col("v_max") == 4)).then(lit("IV-IV"))
        .when((col("v_min") == 3) & (col("v_max") == 5)).then(lit("III-V"))
        .when((col("v_min") == 2) & (col("v_max") == 6)).then(when(col("d_metal") > 0).then(lit("II-VI (Zn, Cd, Hg)")).otherwise(lit("II-VI (Be to Ba)")))
        .when((col("v_min") == 1) & (col("v_max") == 7)).then(when(col("d_metal") > 0).then(lit("I-VII (Cu, Ag)")).otherwise(lit("I-VII (alkali)")))
        .when((col("v_min") == 4) & (col("v_max") == 6)).then(lit("IV-VI"))
        .otherwise(lit("other")),
        photon_nm = (1239.84 / col("gap_ev")).round(0),
        delta_chi = col("delta_chi").round(2))
    .select("id", "formula", "family", "gap_type", "gap_ev", "gap_direct_ev", "margin_ev", "photon_nm", "delta_chi", "sg", "nsites", "link")
    .sort("family", "gap_ev")