#!/usr/bin/env bash

if [ ! -d benches ]; then
  echo "Benchmark sources not found, downloading..."
  mkdir benches
  curl -L -o benches/benchmarksgame-sourcecode.zip https://salsa.debian.org/benchmarksgame-team/benchmarksgame/-/raw/3889723f05b20fe9008d7c987f832fe5d5db5bf1/public/download/benchmarksgame-sourcecode.zip
  unzip -d benches/ benches/benchmarksgame-sourcecode.zip
  echo "Downloaded benchmark sources"
fi

if [ ! -d "fengari/node_modules" ]; then
  echo "Node modules not pulled, pulling"
  npm --prefix ./fengari install
  echo "Node modules pulled"
fi

if [ ! -f "wasm/target/wasm32-unknown-emscripten/release/wasm.js" ]; then
  echo "Wasm module not built, building it..."
  cargo build --manifest-path ./wasm/Cargo.toml --release --target wasm32-unknown-emscripten
  echo "Wasm module built"
fi

bench() {
  target="$1"
  file="$2"
  args=${@:3}

  secs=""
  cpu_secs=""
  mem=""

  for _ in {1..5}; do
    output=$(/usr/bin/time -f '%U %S %e %M' node "$target/main.js" "$(cat $file)" $args 2>&1> /dev/null)
    if [ $? != 0 ]; then
      echo "Benchmark exited unexpectedly: $output"
      return 1;
    fi
    secs="${secs} $(echo "$output" | awk '{ print $1 + $2 }')"
    cpu_secs="${cpu_secs} $(echo "$output" | awk '{ print $3 }')"
    mem="${mem} $(echo "$output" | awk '{ print $4 }')"
  done

  mid_secs=$(echo "$secs" | awk '{ printf "%.3f", ($1 + $2 + $3 + $4 + $5) / 5 }')
  mid_cpu_secs=$(echo "$cpu_secs" | awk '{ printf "%.3f", ($1 + $2 + $3 + $4 + $5) / 5 }')
  mid_mem=$(echo "$mem" | awk '{ printf "%.0f", ($1 + $2 + $3 + $4 + $5) / 5 }')

  echo "$mid_secs $mid_cpu_secs $mid_mem"
}

bench_and_print() {
  name="$1"
  directory="$2"
  files="$3"
  args=${@:4}

  # "array" of <secs> <cpu secs> <mem> <target> [#num]
  bench_results=""
  for file in $files; do
    num=$(echo $file | grep -oP '(?<=lua-)\d(?=.lua)')

    for target in fengari wasm; do
      result=$(bench "$target" "$directory/$file" $args)

      if [ $? != 0 ]; then
        echo "$result"
        return 1;
      fi

      if [ -z "${num}" ]; then
        bench_results="${bench_results}\n$result $target"
      else
        bench_results="${bench_results}\n$result $target $num"
      fi
    done
  done

  bench_results=$(printf "$bench_results" | sed 1d | sort -k1 -n)
  best_bench_secs=$(printf "$bench_results" | head -1 | awk '{ print $1 }')

  echo "#### $name"
  echo "| x | source | secs | mem(kb) | cpu secs |"
  echo "| - | ------ | ---- | --- | -------- |"
  printf "$bench_results\n" | while read line; do
    secs=$(echo "$line" | awk '{ print $1 }')
    cpu_secs=$(echo "$line" | awk '{ print $2 }')
    mem=$(echo "$line" | awk '{ print $3 }')
    target=$(echo "$line" | awk '{ print $4 }')
    number=$(echo "$line" | awk '{ print $5 }')

    secs_ratio=$(echo "$secs $best_bench_secs" | awk '{ printf "%.3f\n", $1 / $2 }')

    if [ -z "$number" ]; then
      echo "| $secs_ratio | $target | $secs | $mem | $cpu_secs |"
    else
      echo "| $secs_ratio | $target #$number | $secs | $mem | $cpu_secs |"
    fi
  done

  if [ -z "${args}" ]; then
    echo "###### [$name](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/$(basename $directory)) with default arguments"
  else
    echo "###### [$name](https://benchmarksgame-team.pages.debian.net/benchmarksgame/performance/$(basename $directory)) with argument(s): $args"
  fi
}

echo "Starting benchmarks"

bench_and_print "binary-trees" benches/binarytrees "binarytrees.lua-2.lua"  # binarytrees.lua-3.lua and binarytrees.lua-4.lua are using io.popen for multiprocessing
# bench_and_print "fannkuch-redux" benches/fannkuchredux "fannkuchredux.lua"  # broken
bench_and_print "fasta" benches/fasta "fasta.lua-2.lua fasta.lua-3.lua"
# bench_and_print "knucleotide" benches/knucleotide "knucleotide.lua-2.lua"  # needs to read from stdin
bench_and_print "mandelbrot" benches/mandelbrot "mandelbrot.lua mandelbrot.lua-2.lua mandelbrot.lua-3.lua"  # mandelbrot.lua-6.lua is using io.popen for multiprocessing
bench_and_print "n-body" benches/nbody "nbody.lua nbody.lua-2.lua nbody.lua-4.lua"
# bench_and_print "nbody-inprocess" benches/nbodyinprocess ""  # has no lua implementation
# bench_and_print "pidigits" benches/pidigits "pidigits.lua pidigits.lua-5.lua pidigits.lua-7.lua"  # all need external 'c-gmp' module
# bench_and_print "regex-redux" benches/regexredux "regexredux.lua"  # needs external 'rex_pcre2' module
# bench_and_print "reverse-complement" benches/revcomp "revcomp.lua-2.lua revcomp.lua-4.lua revcomp.lua-5.lua"  # all need to read from stdin
bench_and_print "spectral-norm" benches/spectralnorm "spectralnorm.lua"

echo "Benchmarks finished"
