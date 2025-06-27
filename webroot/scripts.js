const outputElement = document.querySelector('.output');
const moddir = '/data/adb/modules/bad_apple';
const frameRate = 30;
let asciiFile = 'frames_30fps.txt';
let linesPerFrame = 18;
let rowPerFrame = 30;

let lineElements = [];
let isPaused = false;
let currentFrame = 0;
let totalFrames = 0;
let overlayTimeout;

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
 * Update progress bar
 * @param {number} currentFrame - Current frame number
 * @param {number} totalFrames - Total number of frames
 * @returns {void}
 */
function updateProgressBar(currentFrame, totalFrames) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = (currentFrame / totalFrames) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Fetch bad apple ascii and parse each frame
 * @returns {void}
 */
function startBadApple() {
    fetch(asciiFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const frames = data.split('\n').filter(frame => frame.trim() !== '');
            totalFrames = frames.length;
            currentFrame = 0;

            const displayNextFrame = () => {
                if (currentFrame < frames.length && !isPaused) {
                    const frameLines = frames[currentFrame].split('\\n');
                    updateFrame(frameLines);
                    updateProgressBar(currentFrame + 1, totalFrames);
                    currentFrame++;
                    setTimeout(displayNextFrame, 1000 / frameRate);
                }
            };

            document.body.addEventListener('click', () => {
                isPaused = !isPaused;
                const currentIcon = document.getElementById(isPaused ? 'pause' : 'play');
                currentIcon.style.opacity = '1';
                currentIcon.style.transform = 'scale(2)';
                document.getElementById('pause-icon').style.visibility = isPaused ? 'visible' : 'hidden';
                document.getElementById('play-icon').style.visibility = isPaused ? 'hidden' : 'visible';
                if (!isPaused) displayNextFrame();

                if (overlayTimeout) {
                    clearTimeout(overlayTimeout);
                }
                overlayTimeout = setTimeout(() => {
                    currentIcon.style.opacity = '0';
                    setTimeout(() => {
                        currentIcon.style.transform = 'scale(1)';
                    }, 200);
                }, 200);
            })

            initFrame();
            displayNextFrame();
        })
        .catch(error => {
            console.error('Error fetching frames:', error);
            exec(`ln -s ${moddir}/${asciiFile} ${moddir}/webroot/${asciiFile}`)
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
 * Determin which file to use based on client width
 * @returns {void}
 */
function calcDpi() {
    // PC
    if (window.matchMedia("(min-width: 1024px").matches) {
        linesPerFrame = 34;
        rowPerFrame = 60;
        asciiFile = 'frames_30fps_60x32.txt';
    // Tablet
    } else if (window.matchMedia("(min-width: 768px").matches) {
        linesPerFrame = 25;
        rowPerFrame = 45;
        asciiFile = 'frames_30fps_45x24.txt';
    }
}

/**
 * Calculate the font size based on the shorter side of the window
 * @returns {void}
 */
function calcFontSize() {
    const body = document.body;
    const shorterSide = Math.min(body.clientWidth, body.clientHeight);
    const testElement = document.createElement('code');
    testElement.innerHTML = 'X'.repeat(rowPerFrame);
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
    document.body.style.boxSizing = 'content-box';
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    calcDpi();
    calcFontSize();
    startBadApple();
});
