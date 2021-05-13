const messageBox = document.querySelector('.message-box');
const gameDom = document.querySelector('.game');
const playAgainBtn = document.querySelector('.play-again');
const fields = [...document.querySelectorAll('.field')];

// loads as soon as dom elements load
const initialLoad = () => {
  fields.forEach((field, i) =>
    field.addEventListener('click', game.playerMove.bind(this, i))
  );
  game.board.resetBoard();
  // set the currentPlayer to always start first to play
  game.currentPlayer = undefined;
  messageBox.classList.remove('show');
  messageBox.classList.add('hide');
  gameDom.style.filter = 'blur(0)';
  document.querySelector('.options').style.display = 'flex';
};

playAgainBtn.addEventListener('click', e => {
  e.target.parentNode.classList.remove('show');
  setTimeout(() => {
    fields.forEach(field => (field.textContent = ''));
    initialLoad();
    // show settings and hide board and players option
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.settings').style.display = 'flex';
    document.querySelector('.players').style.display = 'none';
  }, 500);
});

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

  // setting and displaying in the UI
  setField(player, num) {
    const field = document.querySelector(`[data-number="${num}"]`);
    field.textContent = player.getMark();
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
  // ** fields are currenlty only supported in Chrome, Mozilla doesn't support it yet
  WINNING_COMBINATION = [
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
  // keeps track of who is the currentPlayer when mode is multiple
  currentPlayer;

  constructor(player1, player2, computer, mode) {
    this.player1 = player1;
    this.player2 = player2;
    this.computer = computer;
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }
  setMode(mode) {
    this.mode = mode;
  }

  startGame() {
    // before game, clear the board and UI
    this.board.resetBoard();
    if (this.mode === 'computer') {
      if (this.player1.getMark() === 'o') {
        // computer's turn
        this.computerMove();
      }
    } else if (this.mode === 'multiple') {
      // setting the currentPlayer
      this.player1.getMark() === 'o'
        ? (this.currentPlayer = this.player2)
        : this.player1;
    }
  }

  // needed to make it arrow function, to keep it bound to class
  playerMove = num => {
    const clickedField = this.board.getField(num);
    // only fill the field if empty
    if (this.mode === 'computer') {
      if (
        typeof clickedField === 'number' &&
        !this.checkWin(this.board, this.computer)
      ) {
        this.board.setField(this.player1, num);
        // check if player is already won or it's draw, otherwise, it's computer's turn
        if (this.checkWin(this.board, this.player1)) {
          this.endGame(this.player1);
        } else if (this.checkDraw(this.board)) {
          this.endGame('draw');
        } else {
          setTimeout(() => this.computerMove.call(this), 500);
        }
      }
    } else if (this.mode === 'multiple') {
      // if player1 chooses x, make it play first and x
      if (this.currentPlayer === undefined) {
        this.currentPlayer = this.player1;
      }
      const oppositePlayer =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
      if (
        typeof clickedField === 'number' &&
        !this.checkWin(this.board, oppositePlayer)
      ) {
        this.board.setField(this.currentPlayer, num);
        if (this.checkWin(this.board, this.currentPlayer)) {
          this.endGame(this.currentPlayer);
        } else if (this.checkDraw(this.board)) {
          this.endGame('draw');
        }

        // afterwards switch the players
        this.currentPlayer = oppositePlayer;
        `${this.currentPlayer.getMark()}'s turn`;
      }
    }
    return;
  };

  computerMove() {
    const bestStepIndex = minimax.call(this, this.board, this.computer).index;
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
        this.player1 = new Player('x');
        this.computer = new Player('o');
      } else if (mark === 'o') {
        this.player1 = new Player('o');
        this.computer = new Player('x');
      }
    } else if (mode === 'multiple') {
      if (mark === 'x') {
        this.player1 = new Player('x');
        this.player2 = new Player('o');
      } else if (mark === 'o') {
        this.player1 = new Player('o');
        this.player2 = new Player('x');
      }
    }
  }

  // states of the game (DRAW OR WIN)
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
    return this.WINNING_COMBINATION.some(combo => {
      return combo.every(index => board.getField(index) === player.getMark());
    });
  }

  endGame(player) {
    if (player === 'draw') {
      // show the message on UI
      console.log('draw');
      this.gameOverMessage('draw');
      return 'draw';
    } else {
      let winner = player.getMark();
      // show the message on UI
      console.log(`${winner} has won the game`);
      this.gameOverMessage(winner);
      return `${winner} has won the game`;
    }
  }

  gameOverMessage(player) {
    const winner = document.querySelector('.winner');
    messageBox.style.transform = 'scale(1)';
    messageBox.classList.add('show');
    gameDom.style.filter = 'blur(5px)';
    winner.textContent =
      player !== 'draw' ? `${player.toUpperCase()} has won` : 'Draw';
  }
}

// minimax algorithm implementation
// takes as arguments (current board state and current player)
// and for each empty field in current board, it will calculate what is the best move for the computer

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

document.addEventListener('DOMContentLoaded', e => {
  const modeOptions = document.querySelectorAll('.option');
  const players = document.querySelectorAll('.player');

  initialLoad();

  const chooseMode = mode => {
    game.setMode(mode);
    // only on larger screens display mode and player settings at the same time
    if (window.innerWidth <= 450 && window.innerWidth >= 320) {
      setTimeout(() => {
        document.querySelector('.options').style.display = 'none';
        document.querySelector('.players').style.display = 'block';
      }, 500);

      return;
    }
    setTimeout(() => {
      document.querySelector('.players').style.display = 'block';
      document.querySelector('.settings').style.display = 'flex';
    }, 500);
  };

  modeOptions.forEach(mode =>
    mode.addEventListener('click', chooseMode.bind(this, mode.id))
  );

  const chooseMark = mark => {
    game.changeMark(mark, game.getMode());

    setTimeout(() => {
      document.querySelector('.game').style.display = 'flex';
      document.querySelector('.settings').style.display = 'none';
      game.startGame();
    }, 200);
  };

  players.forEach(player => {
    player.addEventListener('click', chooseMark.bind(game, player.id));
  });
});
