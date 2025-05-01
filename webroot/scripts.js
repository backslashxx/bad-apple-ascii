/**
 * Spawns shell process with ksu spawn
 * @param {string} command - The command to execute
 * @param {string[]} [args=[]] - Array of arguments to pass to the command
 * @param {string[]} [option=[]] - Array of options
 *   - cwd <string> - Current working directory of the child process
 *   - env <Object> - Environment key-value pairs
 * @returns {Object} A child process object with:
 *   - stdout: Stream for standard output
 *   - stderr: Stream for standard error
 *   - stdin: Stream for standard input
 *   - on(event, listener): Attach event listener ('exit', 'error')
 *   - emit(event, ...args): Emit events internally
 */
function spawn(command, args = [], option = []) {
    const child = {
        listeners: {},
        stdout: { listeners: {} },
        stderr: { listeners: {} },
        stdin: { listeners: {} },
        on: function(event, listener) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(listener);
        },
        emit: function(event, ...args) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(listener => listener(...args));
            }
        }
    };
    ['stdout', 'stderr', 'stdin'].forEach(io => {
        child[io].on = child.on.bind(child[io]);
        child[io].emit = child.emit.bind(child[io]);
    });
    const callbackName = `spawn_callback_${Date.now()}`;
    window[callbackName] = child;
    child.on("exit", () => delete window[callbackName]);
    try {
        ksu.spawn(command, JSON.stringify(args), JSON.stringify(option), callbackName);
    } catch (error) {
        child.emit("error", error);
        delete window[callbackName];
    }
    return child;
}

const outputElement = document.querySelector('.output');

/**
 * Append text to web interface with optimized performance
 * @param {string} content - text to append to interface
 * @returns {void}
 */
function appendOutput(content) {
    if (outputElement.childNodes.length >= 17) outputElement.innerHTML = '';
    const line = document.createElement('code');
    line.textContent = content;
    line.style.whiteSpace = 'pre';
    outputElement.appendChild(line);
}

/**
 * Run action.sh and pass output to appendOutput
 * @returns {void}
 */
function startBadApple() {
    const scriptOutput = spawn('sh', ["/data/adb/modules/bad_apple/action.sh"], { env: { KSU_WEBUI: 'true' } });
    scriptOutput.stdout.on('data', (data) => appendOutput(data));
}

/**
 * Calculate the font size based on the shorter side of the window
 * @returns {void}
 */
function calcFontSize() {
    const shorterSide = Math.min(window.innerWidth, window.innerHeight);
    const testElement = document.createElement('code');
    testElement.innerHTML = 'X'.repeat(30);
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);

    // Calculate font size
    let minSize = 8;
    let maxSize = 40;
    let fontSize = maxSize;
    while (minSize <= maxSize) {
        fontSize = Math.floor((minSize + maxSize) / 2);
        testElement.style.fontSize = `${fontSize}px`;
        if (testElement.offsetWidth <= shorterSide) {
            minSize = fontSize + 1;
        } else {
            maxSize = fontSize - 1;
        }
    }
    document.body.removeChild(testElement);
    document.body.style.setProperty('--code-font-size', `${fontSize}px`);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    calcFontSize();
    startBadApple();
});
