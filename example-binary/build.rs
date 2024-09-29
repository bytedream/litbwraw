fn main() {
    println!("cargo:rustc-link-arg=-sEXPORTED_RUNTIME_METHODS=['cwrap','ccall']");
    println!("cargo:rustc-link-arg=-sEXPORT_ES6=1");
}
