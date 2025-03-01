# Benchmarks

To get an overview how the performance of WebAssembly compares to other implementations, some benchmarks were done.
The used benchmark code is from the [Computer Language Benchmarks Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/index.html).

Note that these are only micro-benchmarks. They test one very specific implementation of something, whereas a real program would use multiple or complete other things that aren't tested here.

The benchmark sources can be found [here](https://github.com/bytedream/litbwraw/tree/main/lua-playground).

### Environment

Every benchmark runs 5 times and the final benchmark results are calculated from the average result of each run.
All benchmarks are using NodeJS to execute them. NodeJS itself always has a performance/memory overhead as it needs to spin up a new V8 engine every time, which is the explanation why the base memory is so high.

Host & OS:
- Raspberry Pi 4, 2GB RAM
- Raspberry Pi OS Lite, 64 bit, 2024-11-19

Software:
- Rust v1.85.0
- NodeJS v23.7.0
- Emscripten v4.0.4

Tested Software:
- WebAssembly (wasm); mlua v0.10.3
- Fengari (fengari); fengari v0.1.4

### Results

#### binary-trees
| x | source | secs | mem(kb) | cpu secs |
| - | ------ | ---- | --- | -------- |
| 1.000 | wasm #2 | 0.394 | 63523 | 0.250 |
| 1.944 | fengari #2 | 0.766 | 76401 | 0.516 |
###### [binary-trees](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/binarytrees) with default arguments
#### fasta
| x | source | secs | mem(kb) | cpu secs |
| - | ------ | ---- | --- | -------- |
| 1.000 | wasm #3 | 0.418 | 65840 | 0.290 |
| 1.000 | wasm #2 | 0.418 | 66004 | 0.290 |
| 3.464 | fengari #2 | 1.448 | 92410 | 0.830 |
| 3.474 | fengari #3 | 1.452 | 88531 | 0.816 |
###### [fasta](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/fasta) with default arguments
#### mandelbrot
| x | source | secs | mem(kb) | cpu secs |
| - | ------ | ---- | --- | -------- |
| 1.000 | wasm #3 | 0.366 | 59729 | 0.282 |
| 1.000 | wasm | 0.366 | 59794 | 0.282 |
| 1.011 | wasm #2 | 0.370 | 59656 | 0.290 |
| 3.208 | fengari | 1.174 | 73571 | 0.910 |
| 3.410 | fengari #3 | 1.248 | 73195 | 0.986 |
| 3.552 | fengari #2 | 1.300 | 72489 | 1.016 |
###### [mandelbrot](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/mandelbrot) with default arguments
#### n-body
| x | source | secs | mem(kb) | cpu secs |
| - | ------ | ---- | --- | -------- |
| 1.000 | wasm | 0.380 | 61705 | 0.270 |
| 1.011 | wasm #4 | 0.384 | 62563 | 0.284 |
| 1.016 | wasm #2 | 0.386 | 62552 | 0.276 |
| 2.832 | fengari #2 | 1.076 | 74635 | 0.626 |
| 2.842 | fengari | 1.080 | 75442 | 0.650 |
| 2.863 | fengari #4 | 1.088 | 74627 | 0.626 |
###### [n-body](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/nbody) with default arguments
#### spectral-norm
| x | source | secs | mem(kb) | cpu secs |
| - | ------ | ---- | --- | -------- |
| 1.000 | wasm | 0.554 | 59567 | 0.450 |
| 4.801 | fengari | 2.660 | 75651 | 2.324 |
###### [spectral-norm](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/spectralnorm) with default arguments
