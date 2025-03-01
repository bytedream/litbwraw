if (process.argv.length < 3) {
    console.error('Invalid number of arguments');
    process.exit(1);
}

const program = process.argv[2];
const args = process.argv.slice(3);

const wasm = await import('./target/wasm32-unknown-emscripten/release/wasm.js');
const module = {
    print: (str) => console.log(str),
    printErr: (str) => console.error(str),
}

const Module = await wasm.default(module);

// allocate strings to be able to pass them
const arg_pointers = args.map(a => {
    const arg_pointer = Module._malloc(a.length + 1); // +1 for \0
    Module.stringToUTF8(a, arg_pointer, a.length + 1);
    return arg_pointer;
})
const args_pointer = Module._malloc(args.length * 4); // 4 bytes for each pointer
arg_pointers.forEach((pointer, i) => {
    Module.setValue(args_pointer + i * 4, pointer, 'i32')
});

Module.ccall('execute', null, ['string', 'number', 'array'], [program, args.length, arg_pointers])

// free allocated strings
arg_pointers.forEach(pointer => Module._free(pointer))
Module._free(arg_pointers)
