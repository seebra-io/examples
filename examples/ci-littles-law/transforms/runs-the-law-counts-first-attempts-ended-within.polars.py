# what the law is applied to: first attempts that finished within 6 hours
data.filter(~col("suspect")).with_row_index("order")