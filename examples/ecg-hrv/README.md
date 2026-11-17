# Heart-rate variability from ECG beats

Beat annotations of three Holter ECGs from PhysioNet (a healthy heart, MIT-BIH 100 and 119) turned into RR intervals and time-domain HRV (SDNN, RMSSD, pNN50) and Poincaré SD1/SD2. Ectopic beats and noise gaps fake variability: in record 119, 197 premature ventricular beats make RMSSD 437 ms from every beat against 36 ms from normal-to-normal intervals, and the PVCs show a full compensatory pause. Caveats: three people, 15-minute windows, no spectral HRV.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-ecg-hrv) · [open the example](https://www.seebra.io/?example=ecg-hrv) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fecg-hrv) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Health

## Sources

- PhysioNet LightWAVE (WFDB records, ODC-By 1.0): <https://physionet.org/lightwave>

## Steps

Queries:

- [NSR 16265: beat annotations, first 15 min (128 Hz)](.seebra/query/e706f87a-71ae-5e3c-a302-f7f4b8f18597.json)
- [MIT-BIH 100: all beat annotations (360 Hz)](.seebra/query/828259a0-7199-585a-bf2b-2f6c8f56efd9.json)
- [MIT-BIH 119: all beat annotations (360 Hz)](.seebra/query/781f1aff-4f86-5871-8e6c-339802b8a3cd.json)
- [MIT-BIH 119: 12 s of lead MLII with its beats (from 3:05)](.seebra/query/fd751130-0445-5ddb-846a-03f1d18688f4.json)

Transformations:

- [RR intervals: NSR 16265](transforms/rr-intervals-nsr-16265.polars.py) (polars)
- [RR intervals: MIT-BIH 100](transforms/rr-intervals-mit-bih-100.polars.py) (polars)
- [RR intervals: MIT-BIH 119](transforms/rr-intervals-mit-bih-119.polars.py) (polars)
- [RR intervals of the three records (first 15 min each)](transforms/rr-intervals-of-the-three-records-first-15-min.sql) (sql)
- [Time-domain HRV per record: every beat against normal-to-normal only](transforms/time-domain-hrv-per-record-every-beat-against.polars.py) (polars)
- [HRV metrics, every beat against NN only (long form)](transforms/hrv-metrics-every-beat-against-nn-only-long-form.sql) (sql)
- [Premature ventricular beats: coupling interval and compensatory pause](transforms/premature-ventricular-beats-coupling-interval.polars.py) (polars)
- [Compensatory pause per record](transforms/compensatory-pause-per-record.polars.py) (polars)
- [ECG samples in mV (12 s of record 119, lead MLII)](transforms/ecg-samples-in-mv-12-s-of-record-119-lead-mlii.polars.py) (polars)
- [The beats in the trace, at their R peaks, with RR intervals](transforms/the-beats-in-the-trace-at-their-r-peaks-with-rr.polars.py) (polars)
- [RR intervals between the beats in the trace](transforms/rr-intervals-between-the-beats-in-the-trace.polars.py) (polars)

Graphs:

- [Where an RR interval comes from: 12 s of ECG (record 119)](graphs/where-an-rr-interval-comes-from-12-s-of-ecg.js)
- [RR tachograms: three hearts, 15 minutes each](graphs/rr-tachograms-three-hearts-15-minutes-each.js)
- [Poincaré plots: SD1 (beat-to-beat) and SD2 (slow)](graphs/poincare-plots-sd1-beat-to-beat-and-sd2-slow.js)
- [Ectopic beats fake HRV unless intervals are normal-to-normal](graphs/ectopic-beats-fake-hrv-unless-intervals-are.js)
- [Premature ventricular beats and the compensatory pause](graphs/premature-ventricular-beats-and-the-compensatory.js)

Tables:

- HRV per record (every beat against NN only)
- Compensatory pause per record

Studies:

- [Do ectopic beats fake heart-rate variability?](.seebra/study/41e2dfcc-019b-5bfe-879d-8c428980c7cf.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/ecg-hrv`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
