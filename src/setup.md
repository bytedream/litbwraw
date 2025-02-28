# Setup

Before we can start developing, a few prerequisites must be fulfilled.

## The Rust toolchain

Because Lua relies on some libc functions that aren't available in bare-bones WebAssembly (aka `wasm32-unknown-unknown`), the `wasm32-unknown-emscripten` toolchain is used, which provides a custom libc implementation.
The downside of this toolchain is the compatability with the existing Rust WebAssembly ecosystem.
Some crates that state to have WebAssembly support, are only supporting `wasm32-unknown-unknown` which might lead to some compatability problems.

To add the toolchain via rustup, use:
```shell
rustup target add wasm32-unknown-emscripten
```

## The Emscripten compiler

To build for the `wasm32-unknown-emscripten` target, you need the [emscripten](https://emscripten.org/) compiler toolchain.

General install instructions are available [here](https://emscripten.org/docs/getting_started/downloads.html) or you look if your package manager has an emscripten package (some examples provided below).

_Debian_
```shell
sudo apt install emscripten
```

_Arch Linux_
```shell
sudo pacman -S emscripten

# arch does not add the path to the emscripten executables to PATH, so it must be 
# explicitly added.
# you probably want to add this to your bashrc (or any other file which permanently 
# adds this to PATH) to make it permanently available
export PATH=$PATH:/usr/lib/emscripten
```
