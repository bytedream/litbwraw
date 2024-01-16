# Testing

Testing is not very different from testing any other ordinary Rust crate.

When running tests, Rust tries to execute the generated Javascript glue directly which will result in an error.
You have to specify the test runner which executes the Javascript, either in the `.cargo/config.toml` file (described [here](./tutorial/creating-a-project.md#cargoconfigtoml-optional)) or via the `CARGO_TARGET_WASM32_UNKNOWN_EMSCRIPTEN_RUNNER` env variable to `node --experimental-default-type=module`.
<br>
If your crate is a library, you also have to remove the `-o<library name>.js` compiler option as it modifies the output filename which the Rust test suite can't track.
Because the `test` subcommand compiles the tests as normal binaries, the Emscripten compiler automatically creates the js glue.

> Before Rust 1.75 there were a major incompatibility between emscripten and the internal Rust libc crate ([rust-lang/rust#116655](https://github.com/rust-lang/rust/issues/116655)) which always resulted in a compiler error.
> To prevent this issue, you have to set the `-sERROR_ON_UNDEFINED_SYMBOLS=0` compiler option.

With this done, we can create a simple test:
```rust,ignore
#[cfg(test)]
mod tests {
    #[test]
    fn lua_test() {
        let lua = mlua::Lua::new();
        lua.load("print(\"test\")").exec().unwrap();
    }
}

```

And then run it:
```shell
# you can omit '--target wasm32-unknown-emscripten' if you added the .cargo/config.toml
# file as describe in the "Setup" section
cargo test --target wasm32-unknown-emscripten
```
