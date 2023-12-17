<div align="center">
  <h1>Lua in the Browser, with Rust and WebAssembly</h1>
  <strong>This smol book describes how to use Lua in the Browser, powered by Rust WebAssembly.</strong>
  <h3><a href="https://bytedream.github.io/litbwraw/">Read the book</a></h3>
</div>

## 🛠 Building the Book

The book is made using [`mdbook`](https://github.com/rust-lang-nursery/mdBook):
```shell
$ cargo install mdbook
```
Make sure the `cargo install` directory is in your `$PATH` so that you can run
the binary.

To build it, simply run this command from this directory:
```shell
$ mdbook build
```
This will build the book and output files into the `book` directory. From
there you can navigate to the `index.html` file to view it in your browser.

You could also run the following command to automatically build the book whenever you make changes to it in the `src` directory:
```shell
$ mdbook serve
```

This book also contains a little demo/repl which is able to execute arbitrary Lua code in the browser via WebAssembly.
To build the required files, run the following command:
```shell
$ BOOK_OUTPUT_PATH="$PWD/book" cargo build --release --target wasm32-unknown-emscripten --manifest-path=lua-playground/Cargo.toml
```
Make sure to run this command _after_ you build the book.
Also, you have to re-run it everytime when the book is rebuilt.

## ⚖ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
