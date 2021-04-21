const Player = mark => {
  let _mark = mark;

  getMark = () => _mark;
  setMark = mark => (_mark = mark);

  return {
    getMark,
    setMark
  };
};

// takes control over the board(fields)
const GameBoard = (() => {
  const _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const getBoard = () => _board;

  const getField = num => _board[num];
  const setField = (player, num) => {
    const field = document.querySelector(`[data-number="${num}"]`);
    field.textContent = player.getMark();
    _board[num] = player.getMark();
    console.log(_board);
  };
  const availableFields = _board.filter(field => typeof field === 'number');
  const resetBoard = () => _board.map((field, i) => (field = i));

  return {
    getField,
    setField,
    getBoard,
    resetBoard
  };
})();

// controls the state of the game,players
const GameController = (() => {
  let _player1;
  let _player2;
  let _computer;
  let _mode = 'computer';

  const getPlayer1 = () => _player1;
  const getPlayer2 = () => _player2;
  const getComputer = () => _computer;
  const getMode = () => _mode;
  const setMode = mode => (_mode = mode);

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

  const changeMark = (mark, mode) => {
    if (mode === 'computer') {
      if (mark === 'x') {
        _player1 = 'x';
        _computer = 'o';
      } else if (mark === 'o') {
        _player1 = 'o';
        _computer = 'x';
      }
    } else if (mode === 'multiple') {
      if (mark === 'x') {
        _player1 = 'x';
        _player2 = 'o';
      } else if (mark === 'o') {
        _player1 = 'o';
        _player2 = 'x';
      }
    }
  };

  let currentPlayer = getPlayer1();

  const switchPlayer = () => {
    currentPlayer === 'x' ? (currentPlayer = 'o') : (currentPlayer = 'x');
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

  const playerMove = num => {
    const field = GameBoard.getField(num);
    if (typeof field === 'number') {
      GameBoard.setField(Player('o'), num);
    }
  };

  const endGame = () => {
    const message = document.querySelector('.message');
    // when there is a win,draw or  no empty fields anymore
    const board = GameBoard.getBoard();
    if (_checkDraw(board)) {
      message.textContent = 'Draw';
      return true;
    }
    if (_checkWin(currentPlayer)) {
      message.textContent = `${currentPlayer} has won`;
      return true;
    }
    return false;
  };

  return {
    setMode,
    getMode,
    playerMove
  };
})();

// controls UI
const displayController = (() => {
  const modeOptions = document.querySelectorAll('.option');

  const _initialLoad = (() => {
    const fields = [...document.querySelectorAll('.field')];
    fields.forEach((field, i) =>
      field.addEventListener('click', GameController.playerMove.bind(this, i))
    );
  })();

  const _chooseMode = mode => {
    GameController.setMode(mode);
    // restart the board and UI
  };

  const _chooseMark = mark => {
    GameController.changeMark(mark, GameController.getMode());
    // restart the board and UI
  };

  modeOptions.forEach(mode =>
    mode.addEventListener('click', _chooseMode.bind(this, mode.id))
  );
})();
