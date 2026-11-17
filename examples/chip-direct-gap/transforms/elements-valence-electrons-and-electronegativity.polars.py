# PubChem's periodic table: one row per element, its cells by column position
# (Table.Columns: AtomicNumber, Symbol, Name, AtomicWeight, CPKHexColor,
# ElectronConfiguration, Electronegativity, AtomicRadius, ..., GroupBlock).
# valence: the outer s and p electrons, which for main-group elements is the
# group in the old numbering (Ga [Ar]4s2 3d10 4p1: 3, As: 5). Zn, Cd, Hg and Cu,
# Ag, Au have full d shells and act as groups II and I; other transition metals,
# lanthanides and actinides get no valence (their d/f electrons take part).
data.rows("Table.Row")
    .select(Z = col("Cell").list.get(0).cast(Int64), symbol = col("Cell").list.get(1), element = col("Cell").list.get(2),
            config = col("Cell").list.get(5), chi = col("Cell").list.get(6).cast(Float64, strict=False),
            radius_pm = col("Cell").list.get(7).cast(Float64, strict=False), block = col("Cell").list.get(15))
    .with_columns(s = col("config").str.replace(r"^.*?\d+s(\d+).*$", "$1").cast(Int64, strict=False),
                  p = when(col("config").str.contains(r"\dp\d")).then(col("config").str.replace(r"^.*\dp(\d+).*$", "$1").cast(Int64, strict=False)).otherwise(0),
                  period = col("config").str.replace(r"^.*?(\d+)s\d+.*$", "$1").cast(Int64, strict=False))
    .with_columns(valence = when(col("block").is_in(["Lanthanide", "Actinide"])).then(None)
                  .when(col("block") == "Transition metal").then(when(col("config").str.contains("d10", literal=True)).then(col("s")).otherwise(None))
                  .otherwise(col("s") + col("p")))
    .select("Z", "symbol", "element", "config", "block", "valence", "period", "chi", "radius_pm")
    .sort("Z")