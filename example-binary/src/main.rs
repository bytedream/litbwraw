fn main() {
    let lua = mlua::Lua::new();

    lua.load(r#"print("Hello from WebAssembly Lua!")"#)
        .exec()
        .unwrap();
}
