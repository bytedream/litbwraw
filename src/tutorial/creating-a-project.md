# Creating a project

## Create the project package

First, you need to create a normal Rust package which can either be a binary or library crate.
A binary crate has a main function that will be executed when initializing the main function, a library crate needs a few more additional compiler flags to compile successfully.

As binary:
```shell
cargo init --bin my-package .
```

As library:
```shell
cargo init --lib my-package .
```

## Configure files

Before you can start writing actual code you have to set up some files in the newly created library directory.

### `Cargo.toml`

The `mlua` dependency is the actual lua library which we'll use.
At least version `0.9.3` is required, as this is the first version which supports wasm.
The features `lua51`, `lua52`, `lua53`, `lua54` and `luau` are wasm compatible lua version.
The `vendored` feature is always required for wasm.
```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
mlua = { version = ">=0.9.3", features = ["lua51", "vendored"] }
```

> If your crate is a library, you have to additionally add this:
> ```toml
> [lib]
> crate-type = ["cdylib"]
> ```
> This must be done because the emscripten compiler expects the package to behave like a normal C shared library.


### `build.rs`

You need to set some additional compiler flags to be able to call your wasm code from Javascript:
- `-sEXPORTED_RUNTIME_METHODS=['cwrap','ccall']`: this exports the `cwrap` and `ccall` Javascript functions which allows us to call our library methods
- `-sEXPORT_ES6=1`: this makes the created js glue ES6 compatible. It is not mandatory in general but needed as this tutorial/examples utilizes ES6 imports
- `-sERROR_ON_UNDEFINED_SYMBOLS=0` (_optional for binary crates_): this ignores undefined symbols. Typically undefined symbols are not really undefined but the linker just can't find them, which is always the case if your crate is a library

> If your package is a library, you have to add some additional options:
> - `--no-entry`: this defines that the compiled wasm has no main function
> - `-o<library name>.js`: by default, only a `.wasm` file is created, but some js glue is needed to call the built wasm file (and the wasm file needs some functions of the glue too). This creates the glue `<library name>.js` file and changes the name of the wasm output file to `<library name>.wasm`. This must be removed when running tests because it changes the output filename and the Rust test suite can't track this.

The best way to do this is by specifying the args in a `build.rs` file which guarantees that they are set when compiling:
```rust,ignore
fn main() {
    println!("cargo:rustc-link-arg=-sEXPORTED_RUNTIME_METHODS=['cwrap','ccall']");
    println!("cargo:rustc-link-arg=-sEXPORT_ES6=1");
}
```

> If your package is a library, add the additionally required options to your `build.rs`:
> ```rust,ignore
> let out_dir = std::env::var("OUT_DIR").unwrap();
> let pkg_name = std::env::var("CARGO_PKG_NAME").unwrap();
> 
> // the output files should be placed in the "root" build directory (e.g. 
> // target/wasm32-unknown-emscripten/debug) but there is no env variable which 
> // provides this path, so it must be extracted this way
> let target_path = std::path::PathBuf::from(out_dir)
>     .parent()
>     .unwrap()
>     .parent()
>     .unwrap()
>     .parent()
>     .unwrap()
>     .join(pkg_name);
> 
> println!("cargo:rustc-link-arg=-sERROR_ON_UNDEFINED_SYMBOLS=0");
> println!("cargo:rustc-link-arg=--no-entry");
> println!("cargo:rustc-link-arg=-o{}.js", target_path.to_string_lossy());
> ```

### `.cargo/config.toml` (optional)

Here you can set the default target to `wasm32-unknown-emscripten`, so you don't have to specify the `--target wasm32-unknown-emscripten` flag everytime you want to compile your project.
<br>
You can also set the default runner binary here which is useful when running tests, as Rust tries to execute the generated js glue directly which obviously doesn't work because a Javascript file is not an executable.

```toml
[build]
target = "wasm32-unknown-emscripten"

[target.wasm32-unknown-emscripten]
runner = "node --experimental-default-type=module"
```
