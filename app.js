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

  const _checkForEmptyFields = board =>
    board.every(field => {
      return field !== '';
    });

  const _checkDraw = board => {
    if (_checkWin) return false;
    for (let i = 0; i < 9; i++) {
      const field = GameBoard._board.getField(i);
      if (field === undefined) {
        return false;
      }
    }
    return true;
  };

  const endGame = () => {
    // when there is a win,draw or  no empty fields anymore
    const board = GameBoard._board;
    if (
      _checkWin(currentPlayer) ||
      _checkDraw(board) ||
      _checkForEmptyFields(board)
    ) {
      console.log(currentPlayer, ' has won the game');
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

    // if (!clicked.className.includes('field') || clicked.textContent !== '')
    //   return;
    let player1 = GameController.getPlayer1();
    let player2 = GameController.getPlayer2().getMark();
    clicked.textContent = GameBoard.setField(player1, num);

    GameController.changeMark(player2);
    GameController.switchPlayer();
    if (GameController.endGame()) {
      console.log('end game');
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
