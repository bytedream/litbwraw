# Setup

Before we can start developing, a few prerequisites must be fulfilled.

## The Rust toolchain

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
