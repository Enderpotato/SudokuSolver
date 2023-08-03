# SudokuSolver

## Description
A simple web page to solve sudoku boards. Coded using HTML, CSS and JS. 
This solver uses wave function collapse algorithm to solve the board.

### Algorithm
https://en.wikipedia.org/wiki/Wave_function_collapse

Wave function collapse algorithm basically finds the node with the least entropy and assigns a random possible value to it.
This continues until the board is solved. However, if there is a case where the board cannot be solved after a step, the algorithm will backtrack
and try another random value.
