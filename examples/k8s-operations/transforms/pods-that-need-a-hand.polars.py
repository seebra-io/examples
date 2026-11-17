data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            pod = col("metadata").struct.field("name"),
            owner_kind = col("metadata").struct.field("ownerReferences").list.first().struct.field("kind"),
            owner = col("metadata").struct.field("ownerReferences").list.first().struct.field("name"),
            node = col("spec").struct.field("nodeName"),
            phase = col("status").struct.field("phase"),
            created = col("metadata").struct.field("creationTimestamp"),
            c = col("status").struct.field("containerStatuses"))
    .explode("c")
    .with_columns(restarts = col("c").struct.field("restartCount").fill_null(0),
                  ready = col("c").struct.field("ready").fill_null(False))
    .group_by("namespace", "pod", "owner_kind", "owner", "node", "phase", "created")
    .agg(containers = len(), restarts = col("restarts").sum(), not_ready = (~col("ready")).sum())
    .filter(((col("phase") != "Running") & (col("phase") != "Succeeded")) | (col("restarts") >= 5) | (col("not_ready") > 0))
    .with_columns(why = when(col("phase") == "Failed").then(lit("failed"))
                       .when(col("phase") == "Pending").then(lit("pending"))
                       .when(col("phase") == "Unknown").then(lit("node unreachable"))
                       .when(col("restarts") >= 5).then(lit("restarting"))
                       .otherwise(lit("not ready")),
                  parameters = concat_str([lit("namespace = "), col("namespace"), lit(", pod = "), col("pod")]),
                  recreated = col("owner_kind").is_not_null())
    .sort("restarts", descending=True)