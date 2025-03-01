#![allow(clippy::missing_safety_doc)]

use mlua::Lua;
use std::ffi::{CStr, c_char};

#[unsafe(no_mangle)]
pub unsafe extern "C" fn lua_new() -> *mut Lua {
    let lua = Lua::new();
    Box::into_raw(Box::new(lua))
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn lua_execute(lua: *mut Lua, to_execute: *const c_char) {
    let lua: &mut Lua = unsafe { &mut *lua };
    let to_execute = unsafe { CStr::from_ptr(to_execute) };

    if let Err(err) = lua.load(to_execute.to_string_lossy().to_string()).exec() {
        eprintln!("{}", err)
    }
}
