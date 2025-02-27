function calculateEntropy(row, col) {
  let possibleValues = [];
  let check = SudokuBoard[row * 9 + col];
  let ogValue = check.value;
  for (let i = 1; i < 10; i++) {
    check.value = i;
    gridCheck();
    if (!check.error) {
      possibleValues.push(i);
    }
  }
  check.value = ogValue;

  gridCheck();

  return possibleValues;
}

let EntropyValues = [];

function updateEntropy() {
  EntropyValues = [];
  SudokuBoard.forEach((Cell) => {
    if (Cell.value != " ") {
      Cell.possibleValues = [Cell.value];
      return;
    }
    Cell.possibleValues = calculateEntropy(Cell.row, Cell.col);
    EntropyValues.push(Cell);
  });

  EntropyValues.sort(
    (a, b) => a.possibleValues.length - b.possibleValues.length
  );
}

const checkSolve = () => {
  return SudokuBoard.every((Cell) => Cell.value != " " && !Cell.error);
};

function checkInvalid() {
  return SudokuBoard.some((Cell) => Cell.possibleValues.length == 0);
}

function checkError() {
  return SudokuBoard.some((Cell) => Cell.error);
}

function solveBoard() {
  updateEntropy();
  if (checkError()) return false;
  if (checkSolve()) return true;
  if (EntropyValues.length == 0) return false;
  let currentC = EntropyValues[0];
  let possibleV = currentC.possibleValues;
  let possibleVLen = possibleV.length;
  if (possibleVLen == 0) return false;
  for (let i = 0; i < possibleVLen; i++) {
    let randValue = random(possibleV);
    currentC.value = randValue;
    possibleV.splice(possibleV.indexOf(randValue), 1);
    gridCheck();
    if (currentC.error) continue;
    updateEntropy();
    if (checkInvalid()) continue;
    let state = solveBoard();

    if (!state) continue;
    if (state) return true;
  }
  currentC.value = " ";
  return false;
}

function* solveBoardG() {
  updateEntropy();
  if (checkError()) return false;
  if (checkSolve()) return true;
  if (EntropyValues.length == 0) return false;
  let currentC = EntropyValues[0];
  let possibleV = currentC.possibleValues;
  let possibleVLen = possibleV.length;
  if (possibleVLen == 0) return false;
  for (let i = 0; i < possibleVLen; i++) {
    let randValue = random(possibleV);
    currentC.value = randValue;
    currentC.setSelectedBySolver(0);
    possibleV.splice(possibleV.indexOf(randValue), 1);
    gridCheck();
    yield; // Pause after each cell change
    if (currentC.error) continue;
    updateEntropy();
    if (checkInvalid()) continue;
    let state = yield* solveBoardG();

    if (!state) continue;
    if (state) return true;
  }
  currentC.value = " ";
  currentC.setSelectedBySolver(1);
  yield; // Pause after each cell change
  return false;
}

const loadingElt = document.getElementById("loading");
let solverIterator,
  isSolving = false;

function solveStart() {
  solverIterator = solveBoardG();
  loadingElt.style.display = "block";
  isSolving = true;
  solveStep();
}

function solveStep() {
  let result = solverIterator.next();
  if (result.done) {
    isSolving = false;
    if (result.value) {
      console.log("SOLVED!");
      loadingElt.style.display = "none";
    } else {
      console.log("Board cannot be solved");
    }
  } else {
    setTimeout(solveStep, 100); // Adjust the delay as needed
  }
}
