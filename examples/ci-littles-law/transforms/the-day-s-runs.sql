-- the day's workflow runs, five pages of 100
SELECT id, name, event, status, conclusion, created_at, run_started_at, updated_at, run_attempt, html_url, head_branch FROM data
UNION ALL
SELECT id, name, event, status, conclusion, created_at, run_started_at, updated_at, run_attempt, html_url, head_branch FROM data1
UNION ALL
SELECT id, name, event, status, conclusion, created_at, run_started_at, updated_at, run_attempt, html_url, head_branch FROM data2
UNION ALL
SELECT id, name, event, status, conclusion, created_at, run_started_at, updated_at, run_attempt, html_url, head_branch FROM data3
UNION ALL
SELECT id, name, event, status, conclusion, created_at, run_started_at, updated_at, run_attempt, html_url, head_branch FROM data4