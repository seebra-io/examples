data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            deployment = col("metadata").struct.field("name"),
            generation = col("metadata").struct.field("generation"),
            observed = col("status").struct.field("observedGeneration"),
            desired = col("spec").struct.field("replicas"),
            current = col("status").struct.field("replicas"),
            updated = col("status").struct.field("updatedReplicas"),
            ready = col("status").struct.field("readyReplicas"),
            available = col("status").struct.field("availableReplicas"),
            strategy = col("spec").struct.field("strategy").struct.field("type"))
    .with_columns(desired = col("desired").fill_null(1), current = col("current").fill_null(0), updated = col("updated").fill_null(0),
                  ready = col("ready").fill_null(0), available = col("available").fill_null(0))
    .join(data.rows("items")
              .select(namespace = col("metadata").struct.field("namespace"), deployment = col("metadata").struct.field("name"), c = col("status").struct.field("conditions"))
              .explode("c")
              .filter(col("c").struct.field("type") == "Progressing")
              .select("namespace", "deployment", progress = col("c").struct.field("reason"), progress_message = col("c").struct.field("message")),
          on=["namespace", "deployment"], how="left")
    .with_columns(state = when(col("progress") == "ProgressDeadlineExceeded").then(lit("stuck (deadline exceeded)"))
                         .when(col("observed") < col("generation")).then(lit("waiting for the controller"))
                         .when(col("updated") < col("desired")).then(lit("rolling out"))
                         .when(col("current") > col("updated")).then(lit("old pods terminating"))
                         .when(col("available") < col("desired")).then(lit("unavailable"))
                         .otherwise(lit("complete")),
                  missing = col("desired") - col("available"))
    .sort("missing", descending=True)