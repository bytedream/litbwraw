# Compiling

Before we can use our Rust code, we have to compile it first.
```shell
# you can omit '--target wasm32-unknown-emscripten' if you added the .cargo/config.toml
# file as describe in the "Setup" section
cargo build --target wasm32-unknown-emscripten
```
