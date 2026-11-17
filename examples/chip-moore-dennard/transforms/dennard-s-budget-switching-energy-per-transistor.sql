-- Dynamic power is P ≈ N · C · V² · f (N transistors switching, capacitance C, supply V, clock f).
-- Per era, in doublings per year: the rate at which N·f grew minus the rate at which
-- P grew is the rate at which the energy per transistor switch (C·V²) had to fall.
-- Before the break, shrinking C and V paid for faster clocks and more transistors at
-- roughly constant power density (Dennard scaling). After it, V could no longer drop
-- (leakage, threshold voltage), so the clock froze and power stayed at the cooling limit.
SELECT era,
  MAX(CASE WHEN series = 'transistors' THEN slope END) AS transistors_per_year,
  MAX(CASE WHEN series = 'frequency' THEN slope END) AS clock_per_year,
  MAX(CASE WHEN series = 'power' THEN slope END) AS power_per_year,
  MAX(CASE WHEN series = 'transistors' THEN slope END) + MAX(CASE WHEN series = 'frequency' THEN slope END) AS switches_per_year,
  MAX(CASE WHEN series = 'transistors' THEN slope END) + MAX(CASE WHEN series = 'frequency' THEN slope END)
    - MAX(CASE WHEN series = 'power' THEN slope END) AS energy_per_switch_halvings_per_year,
  1.0 / (MAX(CASE WHEN series = 'transistors' THEN slope END) + MAX(CASE WHEN series = 'frequency' THEN slope END)
    - MAX(CASE WHEN series = 'power' THEN slope END)) AS energy_halving_years
FROM data GROUP BY era ORDER BY era DESC