const boardSize = 7;
const maxMistakes = 3;

let boardNumbers = [];
let drawnNumbers = [];
let currentDraw = null;
let mistakeCount = 0;
let seconds = 0;
let timerInterval;

const boardDiv = document.getElementById("bingo-board");
const messageDiv = document.getElementById("message");
const drawnDiv = document.getElementById("drawn-number");
const timerDiv = document.getElementById("timer");
const drawBtn = document.getElementById("draw-btn");
const playAgainDiv = document.getElementById("play-again");

generateBoard();
startTimer();

function generateBoard() {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, boardSize * boardSize);

  boardNumbers = [];

  for (let i = 0; i < boardSize; i++) {
    boardNumbers.push(numbers.slice(i * boardSize, (i + 1) * boardSize));
  }

  boardDiv.innerHTML = "";

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      const value = boardNumbers[y][x];
      cell.className = "bingo-cell";
      cell.innerText = value;
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.value = value;
      cell.dataset.status = "unmarked";
      cell.addEventListener("click", handleCellClick);
      boardDiv.appendChild(cell);
    }
  }
}

function drawNumber() {
  if (drawBtn.disabled || drawnNumbers.length >= 100) return;

  let num;
  do {
    num = Math.floor(Math.random() * 100) + 1;
  } while (drawnNumbers.includes(num));

  drawnNumbers.push(num); // نحفظ الرقم
  currentDraw = num;
  drawnDiv.innerText = `מספר שהוגרל: ${num}`;
  document.querySelector('#test').innerHTML = drawnNumbers.join(', ')
}

function handleCellClick(e) {
  const cell = e.target;
  const cellValue = parseInt(cell.dataset.value);
  const status = cell.dataset.status;

  if (status === "marked") return;

  if (cellValue === currentDraw) {
    cell.classList.remove("wrong", "shake");
    cell.classList.add("marked");
    cell.dataset.status = "marked";
    checkWin();
  } else {
    if (cell.dataset.status !== "wrong") {
      mistakeCount++;
      cell.classList.add("wrong", "shake");
      setTimeout(() => {
        cell.classList.remove("wrong", "shake");
      }, 1000);
      messageDiv.innerText = `טעית! (${mistakeCount} מתוך ${maxMistakes})`;
    }

    if (mistakeCount >= maxMistakes) {
      endGame(false);
    }
  }
}

function checkWin() {
  const allCells = document.querySelectorAll(".bingo-cell");

  // التحقق من صفوف
  for (let y = 0; y < boardSize; y++) {
    let complete = true;
    for (let x = 0; x < boardSize; x++) {
      const cell = [...allCells].find(c => c.dataset.x == x && c.dataset.y == y);
      if (!cell || cell.dataset.status !== "marked") {
        complete = false;
        break;
      }
    }
    if (complete) {
      endGame(true);
      return;
    }
  }

  // التحقق من أعمدة
  for (let x = 0; x < boardSize; x++) {
    let complete = true;
    for (let y = 0; y < boardSize; y++) {
      const cell = [...allCells].find(c => c.dataset.x == x && c.dataset.y == y);
      if (!cell || cell.dataset.status !== "marked") {
        complete = false;
        break;
      }
    }
    if (complete) {
      endGame(true);
      return;
    }
  }
}

function endGame(win) {
  drawBtn.disabled = true;
  stopTimer();

  if (win) {
    messageDiv.innerText = "🎉 ניצחת! השלמת שורה או טור!";
    document.body.classList.add("win");
  } else {
    messageDiv.innerText = "❌ הפסדת! הגעת ל-3 טעויות.";
  }

  showPlayAgain();
  disableAllCells();
}

function disableAllCells() {
  document.querySelectorAll(".bingo-cell").forEach(cell => {
    cell.removeEventListener("click", handleCellClick);
  });
}

function showPlayAgain() {
  playAgainDiv.style.display = "block";
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    timerDiv.innerText = `⏱️ זמן: ${seconds} שניות`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

