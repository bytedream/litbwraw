# Adding wasm logic

Adding logic on the wasm / Rust side is very much just like writing a (C compatible) shared library.

Let's begin simple.
This function creates a [Lua](https://docs.rs/mlua/latest/mlua/struct.Lua.html) instance and returns the raw pointer to it.
```rust,ignore
#[unsafe(no_mangle)]
pub unsafe extern "C" fn lua_new() -> *mut mlua::Lua {
    let lua = mlua::Lua::new();
    Box::into_raw(Box::new(lua))
}
```

Alright, good.
Now we have a Lua instance, but no way to use it, so let us create one.
<br>
The function takes the pointer to the Lua struct we create in the `new_lua` function, as well as an arbitrary string, which should be lua code, as parameters.
It then executes this string via the Lua instance and may write to `stderr` if an error occurs.
```rust,ignore
#[unsafe(no_mangle)]
pub unsafe extern "C" fn lua_execute(lua: *mut mlua::Lua, to_execute: *const std::ffi::c_char) {
    // casting the raw pointer of the created lua instance back to a usable Rust struct
    let lua: &mut mlua::Lua = unsafe { &mut *lua };
    // converting the c string into a `CStr` (which then can be converted to a `String`)
    let to_execute = unsafe { std::ffi::CStr::from_ptr(to_execute) };
    
    // execute the input code via the lua interpreter
    if let Err(err) = lua.load(&to_execute.to_string_lossy().to_string()).exec() {
        // because emscripten wraps stderr, we are able to catch the error on the js
        // side just fine
        eprintln!("{}", err)
    }
}
```

Okay, this looks great! In theory. So let's head over to the next page to see how to compile the code to make it actually usable via Javascript.
