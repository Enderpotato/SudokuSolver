class SudokuCell {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.error = false;
    this.selectedState = 0;
    this.color;
    this.possibleValues = [null];
    this.getColor();
  }

  getColor() {
    switch (this.selectedState) {
      case 0:
        this.color = "#00000000";
        break;
      case 1:
        this.color = "#C8C80064";
        break;
      case 2:
        this.color = "#C8323264";
        break;
    }
  }

  changeState(stateValue) {
    this.selectedState = stateValue;
    this.getColor();
  }
}

function highlightRelevant(row, col) {
  let highlighted = [];
  Srows[row].forEach((Cell) => {
    Cell.changeState(1);
    highlighted.push(Cell);
  });
  Scols[col].forEach((Cell) => {
    Cell.changeState(1);
    highlighted.push(Cell);
  });
  Sgrids[Math.floor(row / 3) * 3 + Math.floor(col / 3)].forEach((Cell) => {
    Cell.changeState(1);
    highlighted.push(Cell);
  });
  return highlighted;
}

function returnDuplicates(arr) {
  let dupIndices = [];
  let duplicates = [];
  arr.forEach((elt, ind) => {
    if (duplicates.includes(ind)) return;
    let isDuplicate = false;
    for (let i = 0; i < arr.length; i++) {
      if (i == ind) continue;
      if (elt.value == arr[i].value && elt.value != " ") {
        dupIndices.push(i);
        duplicates.push(i);
        isDuplicate = true;
      }
    }
    if (isDuplicate) dupIndices.push(ind);
  });
  return dupIndices;
}

function gridCheck() {
  SudokuBoard.forEach((Cell) => (Cell.error = false));
  Srows.forEach((row) => {
    let dupes = returnDuplicates(row);
    dupes.forEach((index) => (row[index].error = true));
  });
  Scols.forEach((col) => {
    let dupes = returnDuplicates(col);
    dupes.forEach((index) => (col[index].error = true));
  });
  Sgrids.forEach((grid) => {
    let dupes = returnDuplicates(grid);
    dupes.forEach((index) => (grid[index].error = true));
  });
}

function printBoard() {
  let printStr = [];
  for (let i = 0; i < 9; i++) {
    let rowStr = [];
    for (let j = 0; j < 9; j++) {
      rowStr.push(SudokuBoard[i * 9 + j].value);
    }
    printStr.push(rowStr.join("|"));
  }
  let board = printStr.join("\n");
  console.log(board);
  return board;
}
