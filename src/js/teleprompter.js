const prompterContent = document.getElementById('prompterContent');
const prompterContainer = document.getElementById('prompterContainer');
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const fontSizeInput = document.getElementById("font-size");
const speedInput = document.getElementById("speed");
const fullscreenBtn = document.getElementById("bg-fullscreen");
const cancelFullscreenBtn = document.getElementById("cancel-fullscreen");
const totalTimeContainer = document.getElementById("total-time-consumption");
const currentTimeContainer = document.getElementById("current-time-consumption");
const exitBtn = document.getElementById("exit");


const REFRESH_RATE = 1000 / 60; // 1/60 s


let intervalId;
let speed = 5;
let currentPosition = 0;
let fontSize = 5;
let totalTime = 0;
let currentTime = 0;

function computeRealSpeed(speed) {
    return ((speed * 0.02) ** 2) * 50; // 单位：px/m
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function startTeleprompter() {
    if (!intervalId) {
        intervalId = setInterval(() => {
            currentPosition -= computeRealSpeed(speed);
            if (-currentPosition + prompterContainer.offsetHeight / 2 >= prompterContent.offsetHeight) {
                stopTeleprompter();
                startBtn.style.display = "initial";
                stopBtn.style.display = "none";
                return;
            }
            updateCurrentTime()
            prompterContent.style.transform = `translateY(${currentPosition}px)`;
        }, REFRESH_RATE);
    }
}
function updateCurrentTime() {
    currentTime = Math.ceil(totalTime * (-(currentPosition - (prompterContainer.offsetHeight / 2)) / prompterContent.offsetHeight));
    const currentHours = Math.floor(currentTime / 3600).toString().padStart(2, "0");
    const currentMinutes = Math.floor((currentTime % 3600) / 60).toString().padStart(2, "0");
    const currentSeconds = Math.floor((currentTime % 3600) % 60).toString().padStart(2, "0")
    currentTimeContainer.textContent = `${currentHours}:${currentMinutes}:${currentSeconds}`
}

function stopTeleprompter() {
    clearInterval(intervalId);
    intervalId = null;
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    stopTeleprompter();
}
function updateTotalTime() {
    let realSpeed = computeRealSpeed(speed) * 60;
    totalTime = Math.floor(prompterContent.offsetHeight / realSpeed);
    const totalHours = Math.floor(totalTime / 3600).toString().padStart(2, "0");
    const totalMinutes = Math.floor((totalTime % 3600) / 60).toString().padStart(2, "0");
    const totalSeconds = Math.floor((totalTime % 3600) % 60).toString().padStart(2, "0")
    totalTimeContainer.textContent = `${totalHours}:${totalMinutes}:${totalSeconds}`
}
function reset() {
    currentPosition = prompterContainer.offsetHeight / 2;
    prompterContent.style.transform = `translateY(${currentPosition}px)`;
    startBtn.style.display = "initial";
    stopBtn.style.display = "none";

    updateTotalTime();
}


window.addEventListener("load", () => {
    const text = getUrlParameter('draft');
    prompterContent.textContent = text;
    prompterContent.style.fontSize = fontSize + "rem";
    speedInput.value = speed;
    fontSizeInput.value = fontSize;
    reset();
});

exitBtn.addEventListener("click", () => {
    history.back();
})
startBtn.addEventListener("click", () => {
    startTeleprompter();
    startBtn.style.display = "none";
    stopBtn.style.display = "initial";
});

stopBtn.addEventListener("click", () => {
    stopTeleprompter();
    stopBtn.style.display = "none";
    startBtn.style.display = "initial";
});

resetBtn.addEventListener("click", () => {
    reset();
    stopTeleprompter();
});

fontSizeInput.addEventListener("change", () => {
    fontSize = fontSizeInput.value;
    prompterContent.style.fontSize = fontSize + "rem";
    updateTotalTime()
});

speedInput.addEventListener("change", () => {
    speed = speedInput.value;
    updateTotalTime()
});

fullscreenBtn.addEventListener("click", () => {
    toggleFullScreen();
    cancelFullscreenBtn.style.display = "initial";
    fullscreenBtn.style.display = "none";
});

cancelFullscreenBtn.addEventListener("click", () => {
    toggleFullScreen();
    fullscreenBtn.style.display = "initial";
    cancelFullscreenBtn.style.display = "none";
});

const ro = new ResizeObserver(() => {
    reset();
});
ro.observe(prompterContainer);
