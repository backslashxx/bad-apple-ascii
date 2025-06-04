const outputElement = document.querySelector('.output');
const frameRate = 30;
const linesPerFrame = 18;

let lineElements = [];

/**
 * Execute shell command with ksu.exec
 * @param {string} command - The command to execute
 * @param {Object} [options={}] - Options object containing:
 *   - cwd <string> - Current working directory of the child process
 *   - env {Object} - Environment key-value pairs
 * @returns {Promise<Object>} Resolves with:
 *   - errno {number} - Exit code of the command
 *   - stdout {string} - Standard output from the command
 *   - stderr {string} - Standard error from the command
 */
function exec(command, options = {}) {
    return new Promise((resolve, reject) => {
        const callbackFuncName = `exec_callback_${Date.now()}`;
        window[callbackFuncName] = (errno, stdout, stderr) => {
            resolve({ errno, stdout, stderr });
            cleanup(callbackFuncName);
        };
        function cleanup(successName) {
            delete window[successName];
        }
        try {
            ksu.exec(command, JSON.stringify(options), callbackFuncName);
        } catch (error) {
            reject(error);
            cleanup(callbackFuncName);
        }
    });
}

/**
 * Show android toast message
 * @param {string} message - The message to display in toast
 * @returns {void}
 */
export function toast(message) {
    try {
        ksu.toast(message);
    } catch (error) {   
        console.error("Error displaying toast:", error);
    }
}

/**
 * Initialize empty frame for append
 * @return {void}
 */
function initFrame() {
    for (let i = 0; i < linesPerFrame; i++) {
        const line = document.createElement('code');
        line.style.whiteSpace = 'pre';
        outputElement.appendChild(line);
        lineElements.push(line);
    }
}

/**
 * Update content in frame
 * @param {string[]} lines - array of lines to append to interface
 * @returns {void}
 */
function updateFrame(lines) {
    lines.forEach((lineContent, index) => {
        lineElements[index].textContent = lineContent;
    });
}

/**
 * Fetch bad apple ascii and parse each frame
 * @returns {void}
 */
function startBadApple() {
    fetch('frames_30fps.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const frames = data.split('\n').filter(frame => frame.trim() !== '');
            let currentFrame = 0;

            const displayNextFrame = () => {
                if (currentFrame < frames.length) {
                    const frameLines = frames[currentFrame].split('\\n');
                    updateFrame(frameLines);
                    currentFrame++;
                    setTimeout(displayNextFrame, 1000 / frameRate);
                }
            };

            initFrame();
            displayNextFrame();
        })
        .catch(error => {
            console.error('Error fetching frames:', error);
            exec('ln -s /data/adb/modules/bad_apple/frames_30fps.txt /data/adb/modules/bad_apple/webroot/frames_30fps.txt')
                .then(({errno}) => {
                    if (errno === 0) {
                        window.location.reload();
                    } else {
                        toast('Failed to load frames.');
                    }
                });
        });
}

/**
 * Calculate the font size based on the shorter side of the window
 * @returns {void}
 */
function calcFontSize() {
    const body = document.body;
    const shorterSide = Math.min(body.clientWidth, body.clientHeight);
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
