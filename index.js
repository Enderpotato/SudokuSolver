const SudokuBoard = [];
const Srows = [[], [], [], [], [], [], [], [], []];
const Scols = [[], [], [], [], [], [], [], [], []];
const Sgrids = [[], [], [], [], [], [], [], [], []];

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    let cell = new SudokuCell(i, j, " ");
    Srows[i].push(cell);
    Scols[j].push(cell);
    Sgrids[Math.floor(i / 3) * 3 + Math.floor(j / 3)].push(cell);
    SudokuBoard[i * 9 + j] = cell;
  }
}

const LeftPadding = 50;
const TopPadding = 50;
const BoardLen = 396;
const CellLen = (BoardLen / 9).toFixed();

let currentCell;
let highlightedCells;

let selectedNumber = null;

const numberButtons = document.getElementById("number-selection").children;
numberButtons.forEach((div) => {
  div.onclick = function () {
    let num = parseInt(div.innerText);
    if (selectedNumber != num) {
      selectedNumber = num;
    } else {
      selectedNumber = null;
    }
  };
});

function setup() {
  const canvas = createCanvas(500, 500);

  canvas.parent("board");
}

function draw() {
  numberButtons.forEach((elt, index) => {
    if (index == selectedNumber - 1) elt.style.backgroundColor = "#FFFF00";
    else elt.style.backgroundColor = "#FFFFFF";
  });

  background(0);

  push();
  translate(LeftPadding, TopPadding);
  fill(255);
  rect(0, 0, BoardLen);

  //draw grid
  SudokuBoard.forEach((Cell) => drawCell(Cell, CellLen));

  stroke(0);
  strokeWeight(5);
  for (let i = 0; i < 9; i += 3) {
    line(i * CellLen, 0, i * CellLen, BoardLen);
    line(0, i * CellLen, BoardLen, i * CellLen);
  }

  pop();
  let selectedRow = Math.floor((mouseY - LeftPadding) / CellLen);
  let selectedCol = Math.floor((mouseX - LeftPadding) / CellLen);

  let mouseOutOfBounds =
    mouseX < LeftPadding ||
    mouseX > LeftPadding + BoardLen ||
    mouseY < TopPadding ||
    mouseY > TopPadding + BoardLen;

  if (!mouseOutOfBounds && !isSolving) {
    if (currentCell) currentCell.changeState(0);
    if (highlightedCells)
      highlightedCells.forEach((Cell) => Cell.changeState(0));
    if (
      !(
        selectedRow < 0 ||
        selectedRow > 8 ||
        selectedCol < 0 ||
        selectedCol > 8
      )
    ) {
      currentCell = SudokuBoard[selectedRow * 9 + selectedCol];
      highlightedCells = highlightRelevant(selectedRow, selectedCol);
      currentCell.changeState(2);
    } else currentCell = undefined;
  }

  if (mouseOutOfBounds) {
    if (currentCell) currentCell.changeState(0);
    if (highlightedCells) {
      highlightedCells.forEach((Cell) => Cell.changeState(0));
      highlightedCells = [];
    }
    currentCell = undefined;
  }

  if (mouseIsPressed && currentCell) {
    if (selectedNumber != null) {
      currentCell.value = selectedNumber;
      gridCheck();
      if (checkSolve()) {
        console.log("SOLVED!");
      }
    } else {
      currentCell.value = " ";
      gridCheck();
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    selectedNumber = null;
  } else if (keyCode >= 49 && keyCode <= 57) {
    selectedNumber = keyCode - 48;
  }
}

window.setup = setup;
window.draw = draw;
