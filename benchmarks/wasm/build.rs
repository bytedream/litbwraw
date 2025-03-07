use std::env;
use std::path::PathBuf;

fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();
    let pkg_name = env::var("CARGO_PKG_NAME").unwrap();
    let target_path = PathBuf::from(out_dir)
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .to_path_buf();

    println!("cargo:rustc-link-arg=-sEXPORTED_RUNTIME_METHODS=['ccall','setValue','stringToUTF8']");
    println!("cargo:rustc-link-arg=-sEXPORTED_FUNCTIONS=['_execute','_malloc','_free']");
    println!("cargo:rustc-link-arg=-sEXPORT_ES6=1");
    println!("cargo:rustc-link-arg=-sERROR_ON_UNDEFINED_SYMBOLS=0");
    println!("cargo:rustc-link-arg=--no-entry");
    println!(
        "cargo:rustc-link-arg=-o{}.js",
        target_path.join(pkg_name).to_string_lossy()
    );
}
