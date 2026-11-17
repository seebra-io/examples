# The whole route hour by hour: how many of its airports meet the VMC
# minima in the prevailing forecast and in everything the TAF allows. The
# verdict reads "VFR until" and "VFR again from" off this.
data.join(data1.select("icao", "role", "order"), on="icao")
    .sort("t", "ok_all", "worst_rank", "order")
    .group_by("t", "hour")
    .agg(airports = len(), ok_prev = col("ok_prev").sum(), ok_all = col("ok_all").sum(),
         worst_rank = col("worst_rank").min(), worst_icao = col("icao").first(), worst_text = col("decides").first())
    .with_columns(all_prev = (col("ok_prev") == col("airports")).cast(Int64),
                  all_ok = (col("ok_all") == col("airports")).cast(Int64),
                  worst = when(col("worst_rank") == 1).then(lit("LIFR")).when(col("worst_rank") == 2).then(lit("IFR")).when(col("worst_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR")))
    .sort("t")