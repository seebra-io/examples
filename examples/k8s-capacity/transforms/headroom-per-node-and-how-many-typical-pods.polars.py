data.join(data1, on="node", how="left")
    .with_columns(cpu_req = col("cpu_req").fill_null(0), mem_req_gib = col("mem_req_gib").fill_null(0), pods_used = col("pods_used").fill_null(0))
    .with_columns(cpu_share = col("cpu_req") / col("cpu_alloc"),
                  mem_share = col("mem_req_gib") / col("mem_alloc_gib"),
                  cpu_free = col("cpu_alloc") - col("cpu_req"),
                  mem_free_gib = col("mem_alloc_gib") - col("mem_req_gib"),
                  slots_free = (col("pods") - col("pods_used")).cast(Float64),
                  k = lit(1))
    .join(data2.filter((col("node") != "(not scheduled)") & (col("cpu_req") > 0) & (col("mem_req_gib") > 0))
              .with_columns(k = lit(1))
              .group_by("k")
              .agg(typical_cpu = col("cpu_req").median(), typical_mem_gib = col("mem_req_gib").median()),
          on="k", how="left")
    .with_columns(fit_cpu = (col("cpu_free") / col("typical_cpu")).floor(),
                  fit_mem = (col("mem_free_gib") / col("typical_mem_gib")).floor())
    .with_columns(fit = when((col("fit_cpu") <= col("fit_mem")) & (col("fit_cpu") <= col("slots_free"))).then(col("fit_cpu"))
                        .when(col("fit_mem") <= col("slots_free")).then(col("fit_mem"))
                        .otherwise(col("slots_free")),
                  limited_by = when((col("fit_cpu") <= col("fit_mem")) & (col("fit_cpu") <= col("slots_free"))).then(lit("CPU"))
                        .when(col("fit_mem") <= col("slots_free")).then(lit("memory"))
                        .otherwise(lit("pod slots")))
    .with_columns(fit = when(col("fit") < 0).then(lit(0.0)).otherwise(col("fit")))
    .drop("k")
    .sort("node")