const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const stats = document.querySelector(".wpm");

var timer = [0,0,0,0];
var interval;
var timerRunning = false;
var numErrors = 0;
var numGross = 0;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
  let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
  theTimer.innerHTML = currentTime;
  timer[3]++;

  timer[0] = Math.floor((timer[3] / 100) / 60);
  timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
  timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

function calcWPM() {
  let minutes = timer[0] + (timer[1]/60) + ((timer[2]/60)/100)
  let currentWPM;
  if ((numGross/5) > numErrors) {
    currentWPM = ((numGross/5) - numErrors) / minutes;
  } else {
    currentWPM = 0;
  }
  stats.innerHTML = currentWPM.toFixed(0) + " wpm";
}

// Match the text entered with the provided text on the page:
function spellCheck() {
  let textEntered = testArea.value;
  let originTextMatch = originText.substring(0, textEntered.length);
  numGross++;

  if (textEntered == originText) {
    clearInterval(interval);
    testWrapper.style.borderColor = "#429890";
  } else {
    if (textEntered == originTextMatch) {
      testWrapper.style.borderColor = "#65CCf3";
    } else {
      testWrapper.style.borderColor = "#E95D0F";
      numErrors++;
    }
  }
  console.log(textEntered);
}

// Start the timer:
function start(){
  let textEnteredLength = testArea.value.length;
  if (textEnteredLength == 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
  console.log(textEnteredLength);
}

// Reset everything:
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0,0,0,0];
  timerRunning = false;
  numGross = 0;
  numErrors = 0;

  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "grey";
  stats.innerHTML = "0 wpm"
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
testArea.addEventListener("keypress", calcWPM, false);
resetButton.addEventListener("click", reset, false);
