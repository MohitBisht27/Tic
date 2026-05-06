// Game State
let board = Array(9).fill(null);
let currentPlayer = "X";
let gameMode = null; // 'pvp' or 'pvc'
let gameActive = true;
let scores = {
  x: 0,
  draw: 0,
  o: 0,
};

// Load scores from localStorage
function loadScores() {
  const saved = localStorage.getItem("tictactoeScores");
  if (saved) {
    scores = JSON.parse(saved);
    updateScoreDisplay();
  }
}

// Save scores to localStorage
function saveScores() {
  localStorage.setItem("tictactoeScores", JSON.stringify(scores));
}

// Winning combinations
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Start game with selected mode
function startGame(mode) {
  gameMode = mode;
  document.getElementById("modeSelection").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  resetBoard();
}

// Reset board for new game
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  document.getElementById("resultModal").style.display = "none";
  renderBoard();
  updateCurrentPlayer();
}

// Back to menu
function backToMenu() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  gameMode = null;
  document.getElementById("modeSelection").style.display = "block";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("resultModal").style.display = "none";
  renderBoard();
}

// Make player move
function makeMove(index) {
  if (!gameActive || board[index] !== null) {
    return;
  }

  board[index] = currentPlayer;
  renderBoard();

  const winner = checkWinner();
  if (winner) {
    endGame(`${winner} Wins!`, `Player ${winner} has won the game!`, winner);
    return;
  }

  if (isBoardFull()) {
    endGame("It's a Draw!", "No one wins this time!", "draw");
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateCurrentPlayer();

  // CPU move (if playing against CPU and it's O's turn)
  if (gameMode === "pvc" && currentPlayer === "O") {
    gameActive = false;
    setTimeout(() => {
      cpuMove();
      gameActive = true;
    }, 600);
  }
}

// CPU AI move
function cpuMove() {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((val) => val !== null);

  if (availableMoves.length === 0) return;

  // Simple AI: Try to win, block opponent, or play strategically
  let move = findWinningMove("O");
  if (move === -1) move = findWinningMove("X");
  if (move === -1) move = playStrategic(availableMoves);

  board[move] = "O";
  renderBoard();

  const winner = checkWinner();
  if (winner) {
    endGame(`${winner} Wins!`, `CPU has won the game!`, winner);
    return;
  }

  if (isBoardFull()) {
    endGame("It's a Draw!", "No one wins this time!", "draw");
    return;
  }

  currentPlayer = "X";
  updateCurrentPlayer();
}

// Find winning move or return -1
function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = player;
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  return -1;
}

// Play strategically
function playStrategic(availableMoves) {
  // Prioritize center
  if (availableMoves.includes(4)) return 4;

  // Then corners
  const corners = [0, 2, 6, 8].filter((i) => availableMoves.includes(i));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // Otherwise random
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Check for winner
function checkWinner() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(condition);
      return board[a];
    }
  }
  return null;
}

// Highlight winning cells
function highlightWinningCells(condition) {
  condition.forEach((index) => {
    document.querySelectorAll(".cell")[index].classList.add("winning");
  });
}

// Check if board is full
function isBoardFull() {
  return board.every((cell) => cell !== null);
}

// End game
function endGame(title, message, result) {
  gameActive = false;

  // Update scores
  if (result === "X") scores.x++;
  else if (result === "O") scores.o++;
  else if (result === "draw") scores.draw++;

  saveScores();
  updateScoreDisplay();

  // Show result modal
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultMessage").textContent = message;
  document.getElementById("resultModal").style.display = "flex";
}

// Render board
function renderBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.textContent = board[index] || "";
    cell.className = "cell";
    if (board[index] === "X") cell.classList.add("x");
    if (board[index] === "O") cell.classList.add("o");
    if (board[index] !== null) cell.classList.add("disabled");
  });
}

// Update current player display
function updateCurrentPlayer() {
  const playerDisplay = document.getElementById("currentPlayer");
  const statusDisplay = document.getElementById("gameStatus");

  if (gameMode === "pvc") {
    if (currentPlayer === "X") {
      playerDisplay.textContent = "👤 Your Turn (X)";
      statusDisplay.textContent = "Make your move";
    } else {
      playerDisplay.textContent = "🤖 CPU Turn (O)";
      statusDisplay.textContent = "CPU is thinking...";
    }
  } else {
    playerDisplay.textContent = `👤 Player ${currentPlayer}'s Turn`;
    statusDisplay.textContent = "";
  }
}

// Update score display
function updateScoreDisplay() {
  document.getElementById("scoreX").textContent = scores.x;
  document.getElementById("scoreO").textContent = scores.o;
  document.getElementById("scoreDraw").textContent = scores.draw;
}

// Initialize game on page load
function resetBoard() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  renderBoard();
  updateCurrentPlayer();
}

// Load scores when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadScores();
});
