data.rows("items")
    .select(rover = lit("Curiosity"),
            camera = col("instrument"),
            sol = col("sol"),
            taken_utc = col("date_taken"),
            received_utc = col("date_received"),
            title = col("title"),
            link = col("url"))