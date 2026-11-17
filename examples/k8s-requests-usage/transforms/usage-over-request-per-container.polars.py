data.join(data1, on=["namespace", "pod", "container"])
    .with_columns(cpu_ratio = when(col("cpu_req") > 0).then(col("cpu_used") / col("cpu_req")),
                  mem_ratio = when(col("mem_req_mib") > 0).then(col("mem_used_mib") / col("mem_req_mib")))
    .sort("cpu_ratio")