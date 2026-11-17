# is it a cube law? Least squares of ln P on ln v where the turbines are below rated power (4.5 to 10 m/s)
data.filter((col("v") >= 4.5) & (col("v") <= 10) & (col("mw") > 2))
    .with_columns(x = col("v").log(), y = col("mw").log())
    .select(hours = len(), mx = col("x").mean(), my = col("y").mean(), mxy = (col("x") * col("y")).mean(), mxx = (col("x") * col("x")).mean(),
            myy = (col("y") * col("y")).mean())
    .with_columns(exponent = (col("mxy") - col("mx") * col("my")) / (col("mxx") - col("mx") * col("mx")))
    .with_columns(r = ((col("mxy") - col("mx") * col("my")) / ((col("mxx") - col("mx") * col("mx")) * (col("myy") - col("my") * col("my"))).sqrt()).round(3),
                  doubling_wind_factor = (2 ** col("exponent")).round(2))
    .select("hours", exponent = col("exponent").round(3), r = col("r"), doubling_wind_factor = col("doubling_wind_factor"))