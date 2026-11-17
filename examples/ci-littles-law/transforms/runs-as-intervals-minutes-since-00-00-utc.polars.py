# each run as an interval: arrives when it starts, leaves at its last update; minutes from 00:00 UTC of the day
data.with_columns(created_s = (col("created_at").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400 + col("created_at").str.slice(11, 2).cast(Int64) * 3600 + col("created_at").str.slice(14, 2).cast(Int64) * 60 + col("created_at").str.slice(17, 2).cast(Int64)), start_s = (col("run_started_at").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400 + col("run_started_at").str.slice(11, 2).cast(Int64) * 3600 + col("run_started_at").str.slice(14, 2).cast(Int64) * 60 + col("run_started_at").str.slice(17, 2).cast(Int64)), end_s = (col("updated_at").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400 + col("updated_at").str.slice(11, 2).cast(Int64) * 3600 + col("updated_at").str.slice(14, 2).cast(Int64) * 60 + col("updated_at").str.slice(17, 2).cast(Int64)))
    .with_columns(t0 = (col("created_s").min() // 86400) * 86400)
    .with_columns(arrive_min = (col("start_s") - col("t0")).cast(Float64) / 60,
                  depart_min = (col("end_s") - col("t0")).cast(Float64) / 60,
                  wait_s = col("start_s") - col("created_s"))
    .with_columns(duration_min = col("depart_min") - col("arrive_min"),
                  # re-runs reuse the run (its start moves), and a run updated hours after its jobs ended is not a duration
                  rerun = col("run_attempt") > 1)
    .with_columns(suspect = col("rerun") | (col("duration_min") > 360) | (col("status") != "completed"))
    .select("id", "name", "event", "conclusion", "created_at", "updated_at", "run_attempt", "html_url", "wait_s", "rerun", "suspect",
            arrive_min = col("arrive_min").round(2), depart_min = col("depart_min").round(2), duration_min = col("duration_min").round(2))
    .sort("arrive_min")