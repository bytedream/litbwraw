async function main() {
    const wasm = await import('./target/wasm32-unknown-emscripten/debug/example-binary.js');
    const module = {
        print: (str) => console.log(str),
        printErr: (str) => console.error(str),
    }

    await wasm.default(module);
}

main();
