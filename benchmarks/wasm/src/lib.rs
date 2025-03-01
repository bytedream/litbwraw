#![warn(clippy::missing_safety_doc)]

use mlua::Lua;
use std::ffi::{c_char, c_int, CStr};

#[no_mangle]
pub unsafe extern "C" fn execute(program: *const c_char, argc: c_int, argv: *const *const c_char) {
    let lua = Lua::new();
    let lua_globals = lua.globals();

    // set 'arg' (argv) value, this allows to manipulate the behavior of the scripts
    let arg = lua.create_table().unwrap();
    arg.set(-1, "mlua").unwrap();
    arg.set(0, "execute").unwrap();
    for i in 0..argc {
        let argv_arg = CStr::from_ptr(*argv.offset(i as isize));
        arg.push(argv_arg.to_str().unwrap()).unwrap();
    }
    lua_globals.set("arg", arg).unwrap();

    let exec = CStr::from_ptr(program).to_str().unwrap();
    if let Err(err) = lua.load(exec).exec() {
        eprintln!("{}", err)
    }
}
