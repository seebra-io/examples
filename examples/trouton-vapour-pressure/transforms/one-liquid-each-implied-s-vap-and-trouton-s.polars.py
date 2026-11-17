# one row per substance: its normal boiling point (median of its statements) and the vapour pressure reported nearest 25 °C
data.filter(col("normal_bp") & col("p_pa").is_not_null() & col("t_k").is_not_null() & col("tb_k").is_not_null())
    .with_columns(dist = (col("t_k") - 298.15).abs())
    .sort("dist", "t_k", "p_pa")
    .group_by("qid")
    .agg(name = col("name").first(), smiles = col("smiles").first(), cid = col("cid").first(),
         p_pa = col("p_pa").first(), t_k = col("t_k").first(),
         tb_k = col("tb_k").median(), tb_spread_k = col("tb_k").max() - col("tb_k").min(), tb_values = col("tb_k").n_unique())
    # pure substances (a SMILES), liquids near room temperature boiling between -73 °C and 427 °C, at least 10 K below their boiling point
    .filter(col("smiles").is_not_null() & (col("p_pa") > 0) & (col("p_pa") < 101325) & col("t_k").is_between(250, 350)
            & col("tb_k").is_between(200, 700) & (col("tb_k") - col("t_k") >= 10))
    # reduced Clausius-Clapeyron coordinate: ln(P/P0) = -(ΔS/R) · (Tb/T - 1) when ΔH = Tb·ΔS is constant
    .with_columns(x = col("tb_k") / col("t_k") - 1, y = (col("p_pa") / 101325).log(10))
    # the entropy of vaporisation this one reading implies, ΔS = R ln(P0/P) / (Tb/T - 1), in J/(mol·K)
    .with_columns(ds_implied = 8.314462618 * (101325 / col("p_pa")).log() / col("x"),
                  # Trouton's rule, ΔS = 10.5 R ≈ 87.3 J/(mol·K): the vapour pressure from the boiling point alone
                  p_trouton_pa = 101325 * (-10.5 * col("x")).exp())
    .with_columns(log_ratio = (col("p_pa") / col("p_trouton_pa")).log(10),
                  hbond = when(col("smiles").str.contains("(^|[^=])O(\\)|$)|^O[^=0-9(]|\\[OH\\]")).then(lit("O–H donor (alcohols, acids, water)"))
                          .when(col("smiles").str.contains("(^|[^=#])N(\\)|$)|^N[^=#0-9(]|[^=#+\\[]N[A-Zc]|\\[nH\\]|\\[NH")).then(lit("N–H donor (amines, amides)"))
                          .otherwise(lit("no H-bond donor")),
                  # an implied ΔS outside 50-200 J/(mol·K) is not a liquid evaporating: a unit, qualifier or transcription error, or a solid
                  plausible = col("ds_implied").is_between(50, 200))
    # the best single constant for room-temperature readings: the median ΔS of plausible non-donors
    .with_columns(ds_fit = when((col("hbond") == "no H-bond donor") & col("plausible")).then(col("ds_implied")).median())
    .with_columns(p_fit_pa = 101325 * (-(col("ds_fit") / 8.314462618) * col("x")).exp())
    .with_columns(log_ratio_fit = (col("p_pa") / col("p_fit_pa")).log(10),
                  ds_over_r = col("ds_implied") / 8.314462618,
                  t_c = col("t_k") - 273.15, tb_c = col("tb_k") - 273.15,
                  wikidata = concat_str([lit("https://www.wikidata.org/wiki/"), col("qid")]),
                  pubchem = concat_str([lit("https://pubchem.ncbi.nlm.nih.gov/compound/"), col("cid")]))
    .with_columns(ds_implied = col("ds_implied").round(1), ds_over_r = col("ds_over_r").round(2), x = col("x").round(4), y = col("y").round(4),
                  log_ratio = col("log_ratio").round(3), log_ratio_fit = col("log_ratio_fit").round(3), p_trouton_pa = col("p_trouton_pa").round(2),
                  p_fit_pa = col("p_fit_pa").round(2), ds_fit = col("ds_fit").round(1), t_c = col("t_c").round(1), tb_c = col("tb_c").round(1), tb_k = col("tb_k").round(2))
    .sort("tb_k")