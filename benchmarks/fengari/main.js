import fengari from 'fengari';

if (process.argv.length < 3) {
    console.error('Invalid number of arguments');
    process.exit(1);
}

const program = process.argv[2];
const args = process.argv.slice(3);

const lauxlib = fengari.lauxlib;
const lua = fengari.lua;
const lualib = fengari.lualib;

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);

// set 'arg' (argv) value, this allows to manipulate the behavior of the scripts
lauxlib.luaL_newlibtable(L);
lua.lua_pushstring(L, 'lua');
lua.lua_rawseti(L, -2, 0);
for (let i = 0; i < args.length; i++) {
    lua.lua_pushstring(L, args[i]);
    lua.lua_rawseti(L, -2, i + 1);
}
lua.lua_setglobal(L, 'arg');

lauxlib.luaL_dostring(L, fengari.to_luastring(program));
