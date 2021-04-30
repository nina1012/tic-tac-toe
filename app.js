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

  const getField = num => _board[num];
  const setField = (player, num) => {
    const field = document.querySelector(`[data-number="${num}"]`);
    field.textContent = player.getMark();
    _board[num] = player.getMark();
  };

  const availableFields = () => {
    const available = [];
    for (let i = 0; i < _board.length; i++) {
      if (typeof _board[i] === 'number') {
        available.push(i);
      }
    }
    return available;
  };

  // temp field for minimax function
  const setTempField = (num, player) => {
    if (player == undefined) {
      _board[num] = num;
      return;
    }
    _board[num] = player.getMark();
  };

  const resetBoard = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = i;
    }
  };

  return {
    getField,
    setField,
    availableFields,
    setTempField,
    resetBoard
  };
})();

// controls the state of the game,players
const GameController = (() => {
  let _player1;
  let _player2;
  let _computer;
  let _mode;

  const getPlayer1 = () => _player1;
  const getPlayer2 = () => _player2;
  const getComputer = () => _computer;
  const getMode = () => _mode;
  const setMode = mode => (_mode = mode);
  let currentPlayer;

  // shows state of game or who plays when mode is multiple (play with friend)
  const message = document.querySelector('.message');

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
        _player1 = Player('x');
        _computer = Player('o');
      } else if (mark === 'o') {
        _player1 = Player('o');
        _computer = Player('x');
      }
    } else if (mode === 'multiple') {
      if (mark === 'x') {
        _player1 = Player('x');
        _player2 = Player('o');
      } else if (mark === 'o') {
        _player1 = Player('o');
        _player2 = Player('x');
      }
    }
  };

  const playerMove = num => {
    const clickedField = GameBoard.getField(num);
    // only fill the field if empty
    if (_mode === 'computer') {
      if (
        typeof clickedField === 'number' &&
        !_checkWin(GameBoard, _computer)
      ) {
        GameBoard.setField(_player1, num);
        // check if player is already won or it's draw, otherwise, it's computer's turn
        if (_checkWin(GameBoard, _player1)) {
          message.textContent = endGame(_player1);
        } else if (_checkDraw(GameBoard)) {
          message.textContent = endGame('draw');
        } else {
          computerMove();
        }
      }
    } else if (_mode === 'multiple') {
      const oppositePlayer = currentPlayer === _player1 ? _player2 : _player1;
      if (
        typeof clickedField === 'number' &&
        !_checkWin(GameBoard, oppositePlayer)
      ) {
        GameBoard.setField(currentPlayer, num);

        if (_checkWin(GameBoard, currentPlayer)) {
          message.textContent = endGame(currentPlayer);
        } else if (_checkDraw(GameBoard)) {
          message.textContent = endGame('draw');
        }
        // afterwards switch the players
        currentPlayer = oppositePlayer;
      }
    }

    return;
  };

  const computerMove = () => {
    const bestStepIndex = minimax(GameBoard, _computer).index;
    GameBoard.setField(_computer, bestStepIndex);
    // check if computer is already won or it's draw, otherwise, it's player's turn
    if (_checkWin(GameBoard, _computer)) {
      return (message.textContent = endGame(_computer));
    } else if (_checkDraw(GameBoard)) {
      return (message.textContent = endGame('draw'));
    }
    return;
  };

  const startGame = () => {
    // before game, clear the board and UI
    GameBoard.resetBoard();
    displayController.clearUI();
    if (_mode === 'computer') {
      if (_player1.getMark() === 'o') {
        computerMove();
      }
    } else if (_mode === 'multiple') {
      // setting the currentPlayer
      _player1.getMark() === 'o'
        ? (currentPlayer = _player2)
        : (currentPlayer = _player1);
    }
  };

  // checking the state of game : draw or win possibilities

  // const _allFilledFields = GameBoard.availableFields().length === 0;

  const _checkDraw = board => {
    // if we have win or all fields are not filled,return false,otherwise true
    // checking for draw based on mode (either player2 or computer)
    if (_player2) {
      if (_checkWin(board, _player1) || _checkWin(board, _player2)) {
        return false;
      }
    } else if (_computer) {
      if (_checkWin(board, _player1) || _checkWin(board, _computer)) {
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
  };

  const _checkWin = (board, player) => {
    return _winningCombinations.some(combo => {
      return combo.every(index => board.getField(index) === player.getMark());
    });
  };

  const endGame = player => {
    if (player === 'draw') {
      console.log('draw');
      return 'draw';
    } else {
      console.log(player.getMark(), ' has won ');
      return `${player.getMark()} has won the game`;
    }
  };

  // current board and current player
  const minimax = (board, player) => {
    const emptySpots = board.availableFields();
    // base case : if any of these are true, the current recursion should be stopped
    if (_checkDraw(board)) {
      return { score: 0 };
    } else if (_checkWin(board, _player1)) {
      return { score: -10 };
    } else if (_checkWin(board, _computer)) {
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
      if (player === _computer) {
        let result = minimax(board, _player1);
        move.score = result.score;
      }
      // otherwise, call it with _computer
      else if (player === _player1) {
        let result = minimax(board, _computer);
        move.score = result.score;
      }
      // reset the board to be empty again(with number)
      board.setTempField(emptySpots[i], undefined);
      moves.push(move);
    }

    // find the best step based on player
    let bestStep;

    if (player === _computer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestStep = i;
        }
      }
    } else if (player === _player1) {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestStep = i;
        }
      }
    }
    return moves[bestStep];
  };

  return {
    getPlayer1,
    getComputer,
    setMode,
    getMode,
    changeMark,
    playerMove,
    startGame
  };
})();

// controls UI
const displayController = (() => {
  const modeOptions = document.querySelectorAll('.option');
  const players = document.querySelectorAll('.player');
  const fields = [...document.querySelectorAll('.field')];

  const _initialLoad = (() => {
    fields.forEach((field, i) =>
      field.addEventListener('click', GameController.playerMove.bind(this, i))
    );
    GameBoard.resetBoard();
  })();

  // _initialLoad();

  const _chooseMode = mode => {
    GameController.setMode(mode);
    document.querySelector('.players').style.display = 'block';
    // restart the board and UI
  };

  const _chooseMark = mark => {
    GameController.changeMark(mark, GameController.getMode());
    document.querySelector('.game').style.display = 'flex';
    document.querySelector('.settings').style.display = 'none';
    // restart the board and UI
    // _initialLoad();
    GameController.startGame();
  };

  const clearUI = () => {
    fields.forEach(field => (field.textContent = ''));
  };

  modeOptions.forEach(mode =>
    mode.addEventListener('click', _chooseMode.bind(this, mode.id))
  );

  players.forEach(player =>
    player.addEventListener('click', _chooseMark.bind(this, player.id))
  );
  return {
    clearUI
  };
})();
