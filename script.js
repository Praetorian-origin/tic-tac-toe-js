const displayController = (() => {
  let turn = "X";
  const turnInfoElement = document.getElementById("turn-info");
  turnInfoElement.textContent = "Player Turn: " + "X";

  const startGameElement = document.getElementById("start-game");
  startGameElement.addEventListener("click", (e) => resetBoard());

  const alreadyPlayedHtmlElements = [];
  const xPositions = [];
  const yPositions = [];
  let victory = false;

  const nextTurn = () => {
    turn = turn === "X" ? "O" : "X";
    turnInfoElement.textContent = "Player Turn: " + turn;
  };

  const calculateColRowPositionFromElem = (index) => {
    // Retrieve Row Number
    let rowCalc = index / 3;
    let row = rowCalc < 1 ? 1 : rowCalc < 2 ? 2 : 3;

    // Retrieve Column Number
    let colCalc = index + 1;
    while (colCalc > 3) {
      colCalc = colCalc % 3;
    }
    let col = colCalc == 0 ? 3 : colCalc;
    return [col, row];
  };

  const playPlayerTurn = (htmlElement, index) => {
    if (!alreadyPlayedHtmlElements.includes(htmlElement) && !victory) {
      htmlElement.textContent = turn;
      alreadyPlayedHtmlElements.push(htmlElement);
      [row, col] = calculateColRowPositionFromElem(index);
      turn === "X" ? xPositions.push([row, col]) : yPositions.push([row, col]);
      if (!(victory = isVictory(row, col))) {
        nextTurn();
      } else {
        turnInfoElement.textContent = turn + " has Won!";
      }
      if (alreadyPlayedHtmlElements.length == 9 && !victory) {
        turnInfoElement.textContent = "It's a Tie!";
      }
    }
  };

  const isVictory = (currentRow, currentCol) => {
    let ListOfArrayPositionsToCheck;
    turn === "X"
      ? (ListOfArrayPositionsToCheck = xPositions)
      : (ListOfArrayPositionsToCheck = yPositions);

    // check if col is filledUp
    if (
      deepContains(ListOfArrayPositionsToCheck, [currentRow, 1]) &&
      deepContains(ListOfArrayPositionsToCheck, [currentRow, 2]) &&
      deepContains(ListOfArrayPositionsToCheck, [currentRow, 3])
    ) {
      return true;
      // check if row is filled up
    } else if (
      deepContains(ListOfArrayPositionsToCheck, [1, currentCol]) &&
      deepContains(ListOfArrayPositionsToCheck, [2, currentCol]) &&
      deepContains(ListOfArrayPositionsToCheck, [3, currentCol])
    ) {
      return true;
      //  check if diagonal  is filled up from 1,1 to 3,3
    } else if (
      deepContains(ListOfArrayPositionsToCheck, [1, 1]) &&
      deepContains(ListOfArrayPositionsToCheck, [2, 2]) &&
      deepContains(ListOfArrayPositionsToCheck, [3, 3])
    ) {
      return true;
      // check if diagonal  is filled up from 3,1 to 1,3
    } else if (
      deepContains(ListOfArrayPositionsToCheck, [3, 1]) &&
      deepContains(ListOfArrayPositionsToCheck, [2, 2]) &&
      deepContains(ListOfArrayPositionsToCheck, [1, 3])
    ) {
      return true;
    }

    return false;
  };

  const deepContains = (listOfArrayPositions, positionArray) => {
    return listOfArrayPositions.find((item) => {
      return item.join() === positionArray.join();
    });
  };

  const resetBoard = () => {
    gameBoard.drawCleanBoard();
    alreadyPlayedHtmlElements.length = 0;
    xPositions.length = 0;
    yPositions.length = 0;
    victory = false;
    nextTurn();
  };

  return { playPlayerTurn, resetBoard };
})();

const gameBoard = (() => {
  const gameBoardDocument = document.getElementById("gameboard");
  const squaresDivs = [];

  const drawCleanBoard = () => {
    while (gameBoardDocument.hasChildNodes()) {
      gameBoardDocument.removeChild(gameBoardDocument.firstChild);
    }

    for (let i = 0; i < 9; i++) {
      const squareDiv = document.createElement("div");
      squareDiv.addEventListener("click", (e) => {
        displayController.playPlayerTurn(e.target, i);
      });
      gameBoardDocument.appendChild(squareDiv);

      squaresDivs.push(squareDiv);
    }
  };

  drawCleanBoard();

  return { drawCleanBoard };
})();
