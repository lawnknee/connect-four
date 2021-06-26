"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    let rowArr = [];
    for (let j = 0; j < WIDTH; j++) {
      rowArr.push(null);
    }
    board.push(rowArr);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board")

  // adds a table row element to top of the game board
  let top = document.createElement("tr");
  // gives the top table row element an id of column-top and click event listener
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // creates cells for each column in top row, sets each id = index of row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    // TODO: Create a table row element and assign to a "row" variable
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // TODO: Create a table cell element and assign to a "cell" variable
      let cell = document.createElement("td");
      // TODO: add an id, y-x, to the above table cell element
      // you'll use this later, so make sure you use y-x
      cell.setAttribute("id",y+"-"+x)
      // TODO: append the table cell to the table row
      row.append(cell);
    }
    // TODO: append the row to the html board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let bottom = HEIGHT-1;
  for (let y = bottom; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let piece = document.createElement("div");
  piece.setAttribute("class","piece");
  piece.classList.add(`p${currPlayer}`);
  piece.classList.add("fall")
  let placed = document.getElementById(`${y}-${x}`);
  placed.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie()) {
    endGame("It's a tie!");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

// helper function checks for tie by looking at every [y][x] coordinate for null
// returns false if null exists

function checkForTie() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x= 0; x < WIDTH; x++) {
      if (board[y][x] === null) {
        return false;
      }
    }
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    
    // example: cells = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]
    // so cell = [y, x]
    
    // for (let [y,x] of cells) {
    //   if (board[y] === undefined) return false;
    //   if (board[y][x] === undefined) return false;
    // }
    
    // if (cells.every(([y,x]) => board[y][x] === 1)) return true;
    // else if (cells.every(([y,x]) => board[y][x] === 2)) return true;
    // else return false;

    return cells.every(([y,x]) => 
      board[y] !== undefined && (board[y][x] === currPlayer)
    );

  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
  return false;
}

makeBoard();
makeHtmlBoard();
