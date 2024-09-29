async function main() {
    const wasm = await import('./target/wasm32-unknown-emscripten/debug/example-library.js');
    const module = {
        print: (str) => console.log(str),
        printErr: (str) => console.error(str),
    }

    const exampleLibrary = await wasm.default(module);
    const luaInstance = exampleLibrary.ccall('lua_new', 'number', [], []);
    const luaExecute = exampleLibrary.cwrap('lua_execute', null, ['number', 'string']);

    luaExecute(luaInstance, 'print("Hello from WebAssembly Lua!")');
}

main();
