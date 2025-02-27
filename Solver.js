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
const noSolElt = document.getElementById("no-sol");
const speedSlider = document.getElementById("speed-slider");
const speedLabel = document.getElementById("speed-label");

function onSpeedChange() {
  value = speedSlider.value;
  solveDelay = value;
  speedLabel.innerText = `Speed: ${solveDelay}ms/step`;
}

let solverIterator,
  isSolving = false;

function solveStart() {
  solverIterator = solveBoardG();
  loadingElt.style.display = "block";
  noSolElt.style.display = "none";
  isSolving = true;
  solveStep();
}

function solveStep() {
  let result = solverIterator.next();
  if (result.done) {
    isSolving = false;
    loadingElt.style.display = "none";
    if (result.value) {
      console.log("SOLVED!");
    } else {
      console.log("Board cannot be solved");
      noSolElt.style.display = "block";
    }
  } else {
    setTimeout(solveStep, speedSlider.value); // Adjust the delay as needed
  }
}
