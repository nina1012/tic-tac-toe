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

  const getField = num => _board[num];
  const setField = (player, num) => (_board[num] = player.getMark());

  return {
    getField,
    setField,
    _board
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
        return GameBoard._board[index] === player;
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

  const endGame = () => {
    // when there is a win,draw or  no empty fields anymore
    const board = GameBoard._board;
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
    endGame
  };
})();

const displayController = (() => {
  const _markField = e => {
    const clicked = e.target;
    let num = e.target.dataset.number;
    // mark field only if it's not end game or if field is empty
    if (e.target.textContent !== '' || GameController.endGame()) return;
    let player1 = GameController.getPlayer1();
    let player2 = GameController.getPlayer2().getMark();
    clicked.textContent = GameBoard.setField(player1, num);

    GameController.changeMark(player2);
    GameController.switchPlayer();
    if (GameController.endGame()) {
      return;
    }
  };

  const render = e => {
    _markField(e);
  };

  return {
    render
  };
})();

document.addEventListener('DOMContentLoaded', e => {
  const board = document.querySelector('.board');
  board.addEventListener('click', e => displayController.render(e));
});
