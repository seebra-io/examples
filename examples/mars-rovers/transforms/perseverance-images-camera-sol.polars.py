data.rows("images")
    .select(rover = lit("Perseverance"),
            camera = col("camera").struct.field("instrument"),
            sol = col("sol"),
            taken_utc = col("date_taken_utc"),
            received_utc = col("date_received"),
            title = col("title"),
            link = col("link"))