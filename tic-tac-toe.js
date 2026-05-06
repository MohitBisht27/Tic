const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise(resolve => rl.question(question, ans => resolve(ans.trim())));
}

function printBoard(board) {
  const cells = board.map((c, i) => c || String(i + 1));
  console.log(`\n ${cells[0]} | ${cells[1]} | ${cells[2]}`);
  console.log('---+---+---');
  console.log(` ${cells[3]} | ${cells[4]} | ${cells[5]}`);
  console.log('---+---+---');
  console.log(` ${cells[6]} | ${cells[7]} | ${cells[8]}\n`);
}

function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,bIdx,c] of wins) {
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
  }
  return null;
}

function isDraw(board) {
  return board.every(Boolean) && !checkWinner(board);
}

function validMoves(board) {
  return board.map((v,i)=> v ? null : i).filter(i => i !== null);
}

function cpuMove(board) {
  const moves = validMoves(board);
  if (moves.length === 0) return -1;
  return moves[Math.floor(Math.random() * moves.length)];
}

async function playOneGame(mode) {
  const board = Array(9).fill(null);
  let current = 'X';
  while (true) {
    printBoard(board);
    if (mode === '2' && current === 'O') {
      const move = cpuMove(board);
      console.log(`CPU chooses ${move+1}`);
      board[move] = 'O';
    } else {
      const ans = await ask(`${current}'s move (1-9): `);
      const n = Number(ans);
      if (!Number.isInteger(n) || n < 1 || n > 9) { console.log('Please enter a number 1-9.'); continue; }
      const idx = n - 1;
      if (board[idx]) { console.log('Cell already taken. Choose another.'); continue; }
      board[idx] = current;
    }

    const winner = checkWinner(board);
    if (winner) { printBoard(board); console.log(`${winner} wins!\n`); break; }
    if (isDraw(board)) { printBoard(board); console.log("It's a draw!\n"); break; }
    current = current === 'X' ? 'O' : 'X';
  }
}

async function main() {
  console.log('Tic-Tac-Toe');
  while (true) {
    console.log('\nSelect mode:\n1) Two-player\n2) Play vs CPU');
    const mode = await ask('Mode (1 or 2): ');
    if (mode !== '1' && mode !== '2') { console.log('Invalid mode.'); continue; }
    await playOneGame(mode);
    const again = await ask('Play again? (y/n): ');
    if (!/^y(es)?$/i.test(again)) break;
  }
  rl.close();
}

main().catch(err => { console.error(err); rl.close(); });
