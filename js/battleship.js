let board = [];
let boardSize = 10;
let ships = [];
let shipsLeft = 0;
let time = 0;
let timerInterval;
let isGameOver = false; // إضافة متغير للتحقق إذا انتهت اللعبة

document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  const size = parseInt(document.getElementById("board-size").value);
  const shipCounts = {
    2: parseInt(document.getElementById("ship2").value),
    3: parseInt(document.getElementById("ship3").value),
    4: parseInt(document.getElementById("ship4").value),
    5: parseInt(document.getElementById("ship5").value),
  };

  boardSize = size;
  board = Array(size).fill().map(() => Array(size).fill(0));
  ships = [];
  shipsLeft = 0;
  time = 0;
  document.getElementById("timer").innerText = `⏱️ זמן: 0 שניות`;
  document.getElementById("win-message").style.display = "none";

  placeAllShips(shipCounts);
  renderBoard();
  document.querySelector(".board-container").style.display = 'block';
  updateShipsLeft();
  startTimer();
}

function placeAllShips(shipCounts) {
  for (let size in shipCounts) {
    for (let i = 0; i < shipCounts[size]; i++) {
      placeShip(parseInt(size));
      shipsLeft++;
    }
  }
}

function placeShip(length) {
  let placed = false;
  while (!placed) {
    const dir = Math.random() < 0.5 ? 'H' : 'V';
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);

    if (canPlace(x, y, length, dir)) {
      let shipCells = [];
      for (let i = 0; i < length; i++) {
        let nx = dir === 'H' ? x + i : x;
        let ny = dir === 'H' ? y : y + i;
        board[ny][nx] = ships.length + 1;
        shipCells.push({ x: nx, y: ny, hit: false });
      }
      ships.push(shipCells);
      placed = true;
    }
  }
}

function canPlace(x, y, length, dir) {
  if (dir === 'H' && x + length > boardSize) return false;
  if (dir === 'V' && y + length > boardSize) return false;

  for (let i = -1; i <= length; i++) {
    for (let j = -1; j <= 1; j++) {
      let nx = dir === 'H' ? x + i : x + j;
      let ny = dir === 'H' ? y + j : y + i;
      if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
        if (board[ny][nx] !== 0) return false;
      }
    }
  }
  return true;
}

function renderBoard() {
  const boardDiv = document.getElementById("game-board");
  boardDiv.innerHTML = "";
  boardDiv.style.display = "grid";
  boardDiv.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
  boardDiv.style.gridTemplateRows = `repeat(${boardSize}, 40px)`;

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", handleClick);
      boardDiv.appendChild(cell);
    }
  }
}

function handleClick(e) {
  if (isGameOver) return; 

  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  const cell = e.target;
  const cellValue = board[y][x];

  if (cell.classList.contains("hit") || cell.classList.contains("miss")) return;

  if (cellValue > 0) {
    cell.classList.add("hit");
    cell.style.backgroundColor = "orange"; // تغيير لون المربع إلى البرتقالي عند ضرب السفينة
    cell.innerHTML = `<img src="assets/images/123.webp" class="explosion-animation" style="width:100%; height:100%;">`; // إضافة أنيميشن انفجار
    board[y][x] = -cellValue;
    const ship = ships[cellValue - 1];
    const part = ship.find(p => p.x === x && p.y === y);
    if (part) part.hit = true;

    document.getElementById("missile-sound").play();

    if (ship.every(p => p.hit)) {
      shipsLeft--;
      updateShipsLeft();
      document.getElementById("boom-sound").play();
    }

  } else {
    cell.classList.add("miss");
    cell.innerHTML = `<img src="assets/images/water.gif" style="width:100%; height:100%;">`;
    board[y][x] = -999;
    document.getElementById("splash-sound").play();
  }

  if (shipsLeft === 0) {
    stopTimer();
    isGameOver = true; // إنهاء اللعبة بعد تدمير جميع السفن
    setTimeout(() => {
      document.getElementById("win-message").style.display = 'block';
    }, 500);
  }
}

function updateShipsLeft() {
  document.getElementById("remaining-ships").innerText = shipsLeft;
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = `⏱️ זמן: ${time} שניות`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

