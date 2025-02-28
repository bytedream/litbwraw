# Lua in the Browser, with Rust 🦀 and WebAssembly

This smol book describes how to use Lua in the Browser, powered by Rust WebAssembly.

> You should have basic knowledge of Rust, Rust FFI and Javascript, the book will not explain language features or constructs that are irrelevant to Rust WebAssembly.

---

```lua,editable
-- Hello world example that executes right in your browser.
-- This is an interactive REPL, you can write any Lua code you want here.

print("Hello from WebAssembly Lua!")
```

### How it works

Unlike other Lua VMs in the browser, like [fengari](https://github.com/fengari-lua/fengari) that is completely written in JavaScript, the approach described here uses the official Lua VM to execute code.
To interact with the Lua VM, the [mlua](https://github.com/mlua-rs/mlua) crate is used which contains all relevant methods to interact with the VM.

Because Lua relies on some libc functions that aren't available in WebAssembly (most notably `setjmp`, which is used for error handling), it can't be built with the `wasm32-unknown-unknown` toolchain.
This limitation is bypassed by using the `wasm32-unknown-emscripten` toolchain instead.

### Why?

In most cases using "web-native" VMs like [fengari](https://github.com/fengari-lua/fengari) is probably the better choice, especially if you just want your code to be run in the browser.
But if you have an existing Rust codebase that uses Lua or that is planned to use Lua, and want to run it in the browser, the describe approach might be the right choice.

I personally had the case where user code got executed on a server, and I wanted the users to check their code for correctness in the browser before uploading/submitting it.
The Lua environment had custom defined Rust functions that got exposed to Lua and any user code could use, and I didn't want to rewrite everything in JavaScript.
