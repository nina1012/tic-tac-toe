// Player class //////
class Player {
  constructor(mark) {
    this.mark = mark;
  }

  getMark() {
    return this.mark;
  }

  setMark(mark) {
    this.mark = mark;
  }
}

// Board class ///////
// takes control over the board(fields)
class Board {
  constructor() {
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  getField(num) {
    return this.board[num];
  }

  setField(player, num) {
    this.board[num] = player.getMark();
  }

  getAvailableFields() {
    // filter only fields that are empty
    return this.board.filter(field => typeof field === 'number');
  }

  resetBoard() {
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = i;
    }
  }
  setTempField(num, player) {
    if (player === undefined) {
      this.board[num] = num;
      return;
    }
    this.board[num] = player.getMark();
  }
}

// controls the state of the game,players
class Game {
  static WINNING_COMBINATION = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  board = new Board();

  constructor(player1, player2, computer, mode) {
    this.player1 = player1;
    this.player2 = player2;
    this.computer = computer;
    this.mode = mode;
  }

  startGame() {
    // before game, clear the board and UI
    if (this.mode === 'computer') {
      if (this.player1.getMark() === 'o') {
        // computer's turn
      }
    } else if (this.mode === 'multiple') {
      // setting the currentPlayer
      let currentPlayer;
      this.player1.getMark() === 'o'
        ? (currentPlayer = this.player2)
        : this.player1;
    }
  }

  playerMove(num) {
    const clickedField = this.board.getField(num);
    // only fill the field if empty
    if (this.mode === 'computer') {
      if (
        typeof clickedField === 'number' &&
        !this.checkWin(board, this.computer)
      ) {
        board.setField(this.player1, num);
        // check if player is already won or it's draw, otherwise, it's computer's turn
        if (this.checkWin(board, this.player1)) {
          this.endGame(this.player1);
        } else if (this.checkDraw(board)) {
          this.endGame('draw');
        } else {
          setTimeout(() => computerMove.call(this), 500);
        }
      }
    } else if (this.mode === 'multiple') {
      const oppositePlayer =
        currentPlayer === this.player1 ? this.player2 : this.player1;
      if (
        typeof clickedField === 'number' &&
        !this.checkWin(board, oppositePlayer)
      ) {
        board.setField(currentPlayer, num);
        if (this.checkWin(board, currentPlayer)) {
          this.endGame(currentPlayer);
        } else if (this.checkDraw(board)) {
          this.endGame('draw');
        }

        // afterwards switch the players
        currentPlayer = oppositePlayer;
        `${currentPlayer.getMark()}'s turn`;
      }
    }
    return;
  }

  computerMove() {
    const bestStepIndex = minimax.call(this, this.board, this.computer).index;
    console.log(bestStepIndex);
    this.board.setField(this.computer, bestStepIndex);

    // check if computer is already won or it's draw, otherwise, it's player's turn
    if (this.checkWin(this.board, this.computer)) {
      return this.endGame(this.computer);
    } else if (this.checkDraw(this.board)) {
      return this.endGame('draw');
    }
    return;
  }

  changeMark(mark, mode) {
    if (mode === 'computer') {
      if (mark === 'x') {
        this.player1.setMark('x');
        this.computer.setMark('o');
      } else if (mark === 'o') {
        this.player1.setMark('o');
        this.computer.setMark('x');
      }
    } else if (mode === 'multiple') {
      if (mark === 'x') {
        this.player1.setMark('x');
        this.player2.setMark('o');
      } else if (mark === 'o') {
        this.player1.setMark('o');
        this.player2.setMark('x');
      }
    }
  }

  // states of the game

  checkDraw(board) {
    // if we have won or all fields are not filled, return false, otherwise true
    // checking for draw based on mode (either player2 or computer)

    // multiple
    if (this.player2) {
      if (
        this.checkWin(board, this.player1) ||
        this.checkWin(board, this.player2)
      ) {
        return false;
      }
    } else if (this.computer) {
      if (
        this.checkWin(board, this.player1) ||
        this.checkWin(board, this.computer)
      ) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      const field = board.getField(i);
      if (typeof field === 'number') {
        return false;
      }
    }
    return true;
  }

  // if [1,2,3] have the same mark [x,x,x] or [o,o,o] from winning-combination array
  checkWin(board, player) {
    return Game.WINNING_COMBINATION.some(combo => {
      return combo.every(
        index => this.board.getField(index) === player.getMark()
      );
    });
  }

  endGame(player) {
    if (player === 'draw') {
      console.log('draw');
      // show the message on UI
      return 'draw';
    } else {
      let winner = player.getMark();
      // show the message on UI
      return `${winner} has won the game`;
    }
  }
}

// current board and current player
function minimax(board, player) {
  const emptySpots = board.getAvailableFields();
  // base case : if any of these are true, the current recursion should be stopped
  if (this.checkDraw(board)) {
    return { score: 0 };
  } else if (this.checkWin(board, this.player1)) {
    return { score: -10 };
  } else if (this.checkWin(board, this.computer)) {
    return { score: 10 };
  }
  // stores the moves for each field
  const moves = [];

  for (let i = 0; i < emptySpots.length; i++) {
    // individual move,should have index and score of a given empty field
    let move = {};
    // set the index of the board.availableFields() field to the move
    move.index = emptySpots[i];
    // fill board.availableFields() field with current player
    board.setTempField(emptySpots[i], player);
    // if player is computer, call minimax with _player1
    if (player === this.computer) {
      let result = minimax.call(this, this.board, this.player1);
      move.score = result.score;
    }
    // otherwise, call it with _computer
    else if (player === this.player1) {
      let result = minimax.call(this, this.board, this.computer);
      move.score = result.score;
    }
    // reset the board to be empty again(with number)
    this.board.setTempField(emptySpots[i], undefined);
    moves.push(move);
  }

  // find the best step based on player
  let bestStep;

  if (player === this.computer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestStep = i;
      }
    }
  } else if (player === this.player1) {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestStep = i;
      }
    }
  }
  return moves[bestStep];
}

const game = new Game();

// controls UI

// const UIController = (() => {
//   const modeOptions = document.querySelectorAll('.option');
//   const playAgainBtn = document.querySelector('.play-again');
//   const players = document.querySelectorAll('.player');
//   const fields = [...document.querySelectorAll('.field')];
//   const game = document.querySelector('.game');
//   const messageBox = document.querySelector('.message-box');

//   const _initialLoad = () => {
//     fields.forEach((field, i) =>
//       field.addEventListener('click', GameController.playerMove.bind(this, i))
//     );
//     GameBoard.resetBoard();
//     messageBox.classList.remove('show');
//     messageBox.classList.add('hide');
//     game.style.filter = 'blur(0)';
//     document.querySelector('.options').style.display = 'flex';
//   };

//   _initialLoad();

//   const _chooseMode = mode => {
//     GameController.setMode(mode);
//     // only on larger screens display mode and player settings at the same time
//     if (window.innerWidth <= 450 && window.innerWidth >= 320) {
//       setTimeout(() => {
//         document.querySelector('.options').style.display = 'none';
//         document.querySelector('.players').style.display = 'block';
//       }, 500);

//       return;
//     }
//     setTimeout(() => {
//       document.querySelector('.players').style.display = 'block';
//       document.querySelector('.settings').style.display = 'flex';
//     }, 500);
//   };

//   const _chooseMark = mark => {
//     GameController.changeMark(mark, GameController.getMode());

//     setTimeout(() => {
//       document.querySelector('.game').style.display = 'flex';
//       document.querySelector('.settings').style.display = 'none';
//       GameController.startGame();
//     }, 200);
//   };

//   const clearUI = () => {
//     fields.forEach(field => (field.textContent = ''));
//   };

//   modeOptions.forEach(mode =>
//     mode.addEventListener('click', _chooseMode.bind(this, mode.id))
//   );

//   players.forEach(player =>
//     player.addEventListener('click', _chooseMark.bind(this, player.id))
//   );

//   // reset everything (board, ui, hide the board)
//   playAgainBtn.addEventListener('click', e => {
//     e.target.parentNode.classList.remove('show');
//     setTimeout(() => {
//       clearUI();
//       _initialLoad();
//       // show settings and hide board and players option
//       document.querySelector('.game').style.display = 'none';
//       document.querySelector('.settings').style.display = 'flex';
//       document.querySelector('.players').style.display = 'none';
//     }, 500);
//   });

//   const gameOverMessage = player => {
//     const winner = document.querySelector('.winner');
//     messageBox.style.transform = 'scale(1)';
//     messageBox.classList.add('show');
//     game.style.filter = 'blur(5px)';
//     winner.textContent =
//       player !== 'draw' ? `${player.toUpperCase()} has won` : 'Draw';
//   };
//   return {
//     clearUI,
//     gameOverMessage
//   };
// })();
