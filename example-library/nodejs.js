async function main() {
    let wasm;
    for (const buildType of ['release', 'debug']) {
        try {
            wasm = await import(`./target/wasm32-unknown-emscripten/${buildType}/example-library.js`);
            break;
        } catch (e) {
            if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
        }
    }
    if (!wasm) {
        throw new Error('Rust wasm binary not built');
    }

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
