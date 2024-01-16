# Testing

Testing is not very different from testing any other ordinary Rust crate.

When running tests, Rust tries to execute the generated Javascript glue directly which will result in an error.
You have to specify the test runner which executes the Javascript, either in the `.cargo/config.toml` file (described [here](./tutorial/creating-a-project.md#cargoconfigtoml-optional)) or via the `CARGO_TARGET_WASM32_UNKNOWN_EMSCRIPTEN_RUNNER` env variable to `node --experimental-default-type=module`.
<br>
If your crate is a library, you also have to remove the `-o<library name>.js` compiler option as it modifies the output filename which the Rust test suite can't track.
Because the `test` subcommand compiles the tests as normal binaries, the Emscripten compiler automatically creates the js glue.

> Also, in the current stable Rust, you have to set the `-sERROR_ON_UNDEFINED_SYMBOLS=0` compiler option in order to avoid test compilation errors. This is due to an incompatibility between emscripten and the internal Rust libc crate ([rust-lang/rust#116655](https://github.com/rust-lang/rust/issues/116655)) but a fix for it should land in Rust 1.75 ([rust-lang/rust#116527](https://github.com/rust-lang/rust/pull/116527)).
> Alternatively you can use the nightly toolchain, the fix is already present there.

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
