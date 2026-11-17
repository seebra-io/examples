data.rows("features")
    .with_columns(lon = col("geometry").struct.field("coordinates").list.get(0),
                  lat = col("geometry").struct.field("coordinates").list.get(1),
                  depth_km = col("geometry").struct.field("coordinates").list.get(2))
    .select("properties", "lon", "lat", "depth_km")
    .unnest("properties")
    .select("place", "mag", "magType", "lon", "lat", "depth_km", "tsunami", "sig", "alert", "url",
            time = (col("time") * 1000).cast(Datetime).dt.strftime("%Y-%m-%dT%H:%M:%SZ"))
    .sort("mag", descending=True)