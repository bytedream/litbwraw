# Calling from Javascript

> The following code examples are expecting that the compiled glue and wasm files are available as `target/wasm32-unknown-emscripten/debug/my-project.js` and `target/wasm32-unknown-emscripten/debug/my-project.wasm`.

## Browser

> Note that opening the `.html` file as normal file in your browser will prevent the wasm from loading.
> You have to serve it with a webserver. `python3 -m http.server` is a good tool for this.

The following html page will be used as reference in the Javascript code.
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Project</title>
  </head>
  <body>
    <div>
      <h3>Code</h3>
      <textarea id="code"></textarea>
      <button>Execute</button>
    </div>
    <div style="display: flex">
      <div>
          <h3>Stderr</h3>
          <div id="stderr" />
      </div>
      <hr>
      <div>
          <h3>Stdout</h3>
          <div id="stdout" />
      </div>
    </div>
  </body>
</html>
```

First things first, we need to load the compiled wasm file.
For this, we import the Javascript glue that is generated when compiling and loads and configures the actual wasm file.
A custom configuration is fully optional, but needed if you want to do things like catching stdio.
The configuration is done via the [Module](https://emscripten.org/docs/api_reference/module.html) object.
```javascript
// importing the glue
const wasm = await import('./target/wasm32-unknown-emscripten/debug/my-project.js');
// creating a custom configuration. `print` is equal to stdout, `printErr` is equal to
// stderr
const module = {
    print(str) {
        const stdout = document.getElementById('stdout');
        const line = document.createElement('p');
        line.innerText = str;
        stdout.appendChild(line);
    },
    printErr(str) {
        const stderr = document.getElementById('stderr');
        const line = document.createElement('p');
        line.innerText = str;
        stderr.appendChild(line);
    }
};
// this loads the wasm file and exposes the `ccall` and `cwrap` functions whic we'll
// use in the following code
const myProject = await wasm.default(module);
```

With the library loaded, it's time to call our first function, `lua_new`.
This is done via the emscripten [ccall](https://emscripten.org/docs/api_reference/preamble.js.html#ccall) function.
It takes the function name we want to execute, its return type, the function parameter types and the parameters as arguments.
<br>
This will return the raw pointer (as js number) to the address where the [Lua](https://docs.rs/mlua/latest/mlua/struct.Lua.html) struct, we created in the Rust code, resides.
```javascript
const luaInstance = myProject.ccall('lua_new', 'number', [], []);
```

Next up, lets make the `lua_execute` function callable.
This time we're using the emscripten [cwrap](https://emscripten.org/docs/api_reference/preamble.js.html#cwrap) function.
It wraps a normal Javascript function around the ffi call to the wasm `lua_execute` function, which is the recommended way to handle functions which are invoked multiple times.
It takes the function name we want to execute, its return type and the function parameters as arguments.
```javascript
const luaExecute = myProject.cwrap('lua_execute', null, ['number', 'string']);
```

With this all set up, we are able to call any Lua code via WebAssembly, right in the browser. Great!
```javascript
luaExecute(luaInstance, 'print("Hello Lua Wasm")');
```

<details>
  <summary>Full example as html page with Javascript</summary>
 
  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>My Project</title>
      <script type="module">
        const wasm = await import('./target/wasm32-unknown-emscripten/debug/my-project.js');
        const stdout = document.getElementById('stdout');
        const stderr = document.getElementById('stderr');
        const module = {
            print(str) {
                const line = document.createElement('p');
                line.innerText = str;
                stdout.appendChild(line);
            },
            printErr(str) {
                const line = document.createElement('p');
                line.innerText = str;
                stderr.appendChild(line);
            }
        };
        const myProject = await wasm.default(module);

        const luaInstance = myProject.ccall('lua_new', 'number', [], []);
        const luaExecute = myProject.cwrap('lua_execute', null, ['number', 'string']);
   
        window.execute = () => {
          // clear the output
          stdout.innerHTML = '';
          stderr.innerHTML = '';
          const code = document.getElementById('code').value;
          luaExecute(luaInstance, code);
        }
    </script>
  </head>
  <body>
    <div>
      <textarea id="code"></textarea>
      <button onclick="execute()">Execute</button>
    </div>
    <div style="display: flex">
      <div>
          <h3>Stderr</h3>
          <div id="stderr" />
      </div>
      <hr>
      <div>
          <h3>Stdout</h3>
          <div id="stdout" />
      </div>
    </div>
  </body>
</html>
```
</details>

## NodeJS

> The nodejs implementation is not very different from the browser implementation, so the actions done aren't as detailed described as above.
Please read the [Browser](#browser) section first if you want more detailed information.

```javascript
class MyProject {
	#instance;
	#luaExecute;
	#stdout;
	#stderr;
	
	static async init(): Promise<MyProject> {
		const myProject = new MyProject();
		
		const wasm = await import('./target/wasm32-unknown-emscripten/debug/my-project.js');
		const module = {
			print(str) {
				if (myProject.#stdout) myProject.#stdout(str);
            },
            printErr(str) {
                if (myProject.#stderr) myProject.#stderr(str);
            }
        };
		const lib = await wasm.default(module);

        myProject.#instance = lib.ccall('lua_new', 'number', [], []);
        myProject.#luaExecute = lib.cwrap('lua_execute', null, ['number', 'string']);
		
		return myProject;
    }
		
    execute(code, stdout, stderr) {
		if (stdout) this.#stdout = stdout;
		if (stderr) this.#stderr = stderr;
		
		this.#luaExecute(this.#instance, code);

        if (stdout) this.#stdout = null;
        if (stderr) this.#stderr = null;
    }
}
```
