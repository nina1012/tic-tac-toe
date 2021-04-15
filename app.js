const Player = mark => {
  let _mark = mark;

  getMark = () => _mark;
  setMark = mark => (_mark = mark);

  return {
    getMark,
    setMark
  };
};

const GameBoard = (() => {
  const _board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => _board;

  const getField = num => _board[num];
  const setField = (player, num) => (_board[num] = player.getMark());

  const resetBoard = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = '';
    }
  };

  return {
    getField,
    setField,
    getBoard,
    resetBoard
  };
})();

const GameController = (() => {
  const _player1 = Player('x');
  const _player2 = Player('o');

  const getPlayer1 = () => _player1;
  const getPlayer2 = () => _player2;

  const _winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let currentPlayer = getPlayer1();

  const switchPlayer = () => {
    currentPlayer === 'x' ? (currentPlayer = 'o') : (currentPlayer = 'x');
  };

  // set player1

  const changeMark = mark => {
    if (mark === 'x') {
      _player1.setMark('x');
      _player2.setMark('o');
    } else if (mark === 'o') {
      _player1.setMark('o');
      _player2.setMark('x');
    }
  };

  const _checkWin = player => {
    return _winningCombinations.some(combo => {
      return combo.every(index => {
        return GameBoard.getBoard()[index] === player;
      });
    });
  };

  const _checkForEmptyFields = board => board.every(field => field !== '');

  const _checkDraw = board => {
    switch (true) {
      case _checkWin(currentPlayer):
      case !_checkForEmptyFields(board):
        return false;
      default:
        return true;
    }
  };

  const initGame = () => {
    const player1 = getPlayer1() || Player.setMark('x');
  };

  const endGame = () => {
    // when there is a win,draw or  no empty fields anymore
    const board = GameBoard.getBoard();
    if (_checkDraw(board)) {
      console.log('draw');
      return true;
    }
    if (_checkWin(currentPlayer)) {
      console.log('win');
      return true;
    }
    return false;
  };

  return {
    getPlayer1,
    getPlayer2,
    changeMark,
    switchPlayer,
    currentPlayer,
    endGame,
    initGame
  };
})();

const displayController = (() => {
  const _markField = e => {
    const clicked = e.target;
    let num = e.target.dataset.number;
    // mark field only if it's not end game or if field is empty
    if (e.target.textContent !== '' || GameController.endGame()) return;
    let player1 = GameController.getPlayer1() || Player('x');
    let player2 = GameController.getPlayer2().getMark() || Player('o');
    clicked.textContent = GameBoard.setField(player1, num);

    GameController.changeMark(player2);
    GameController.switchPlayer();
    if (GameController.endGame()) {
      return;
    }
  };

  const clearUI = e => {
    const fields = document.querySelectorAll('.field');
    // clear all the fields
    fields.forEach(field => (field.textContent = ''));
    // reset board to be empty array
    GameBoard.resetBoard();
  };

  const render = e => {
    _markField(e);
  };

  return {
    render,
    clearUI
  };
})();

document.addEventListener('DOMContentLoaded', e => {
  const board = document.querySelector('.board');
  board.addEventListener('click', e => displayController.render(e));
});

document
  .querySelector('.clear')
  .addEventListener('click', e => displayController.clearUI(e));

// setting the player1, opponent will be not selected player
document.addEventListener('click', e => {
  if (!e.target.className.includes('player')) return;
  let markChosen = e.target.id === 'x' ? 'x' : 'o';
  // if click the players, user wants to change the own player
  // we have to change it only in that case, otherwise player1 will be x
});
