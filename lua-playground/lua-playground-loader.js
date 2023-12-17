let luaStdout = null;
let luaStderr = null;

async function run_lua_code(elem) {
    let result;
    if (!elem.nextElementSibling) {
        result = document.createElement('code');
        result.classList.add('result', 'hljs', 'language-bash');
        elem.after(result)
    } else {
        result = elem.nextElementSibling;
    }
    result.innerHTML = '';

    if (window.luaInstance === undefined) {
        let wasm;
        try {
            wasm = await import(window.rootPath + '/lua-playground.js');
        } catch (e) {
            result.innerText = 'Failed to load wasm module: ' + e.toString();
            return;
        }

        const module = {
            print(msg) {
                if (luaStdout) luaStdout(msg)
            },
            printErr(msg) {
                if (luaStderr) luaStderr(msg)
            }
        }
        const luaPlayground = await wasm.default(module);

        window.luaInstance = luaPlayground.ccall('lua_new', 'number', [], []);
        window.luaExecute = luaPlayground.cwrap('lua_execute', null, ['number', 'string']);
    }

    luaStdout = (msg) => result.innerHTML += msg + '<br>';
    luaStderr = (msg) => result.innerHTML += msg + '<br>';
    window.luaExecute(window.luaInstance, ace.edit(elem).getValue());
    luaStdout = null;
    luaStderr = null;
}

function main() {
    const inputElements = document.querySelectorAll('.language-lua.editable');

    for (const inputElem of inputElements) {
        const editor = ace.edit(inputElem);

        /* adds the run and reset button */
        const buttons = inputElem.previousElementSibling;
        const resetButton = document.createElement('button');
        resetButton.classList.add('fa', 'fa-history', 'reset-button');
        resetButton.title = 'Undo changes';
        resetButton.ariaLabel = 'Undo changes';
        resetButton.onclick = () => editor.setValue(editor.originalCode.trim(), -1);
        buttons.prepend(resetButton);
        const runButton = document.createElement('button');
        runButton.classList.add('fa', 'fa-play', 'play-button');
        runButton.title = 'Run this code';
        runButton.ariaLabel = 'Run this code';
        runButton.onclick = () => run_lua_code(inputElem);
        buttons.append(runButton);

        /* i don't know why, but the editor always has an extra newline. when selecting it and trimming it, the newline
        gets removed */
        editor.setValue(editor.originalCode.trim(), -1);
    }
}

function reloadES6() {
    window.rootPath = document.currentScript.src.replace(/lua-playground\/lua-playground-loader\.js.*/, '')
    const injectScript = document.createElement('script');
    injectScript.type = 'module';
    injectScript.src = document.currentScript.src;
    document.body.append(injectScript);
}

// this script is not loaded as es6 module, so it has to "elevate" itself to an es6 module by re-injecting itself with
// the `reloadES6` function
if (window.rootPath) {
    main()
} else {
    reloadES6()
}
