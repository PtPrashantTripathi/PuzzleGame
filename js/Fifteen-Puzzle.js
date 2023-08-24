//grid size
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var G = urlParams.has("grid") ? urlParams.get("grid") : 3;
var moves = 0;
//initial puzzle
var solved_puzzle = [];
for (var i = 1; i < G ** 2; i++) {
  solved_puzzle.push(i);
}
solved_puzzle.push(0);

//inhearted function
var canBoardWin = (array) => {
  // Check if Start board is the same after ramdomize
  let startBoardPosition = array.every((el, i) => {
    return el === solved_puzzle[i];
  });
  if (startBoardPosition) return false;

  // Check can board win
  let p = 0;
  let row = 0;
  let blankRow = 0;
  for (let i = 0; i < array.length; i++) {
    if (i % G == 0) row++;
    if (array[i] == 0) {
      blankRow = row;
      continue;
    }
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j] && array[j] != 0) p++;
    }
  }

  if (G % 2 == 0 && blankRow % 2 != 0) return p % 2 != 0;
  else return p % 2 == 0;
};

//jumble puzzle
var jumble = () => {
  let array = solved_puzzle.concat().sort(() => Math.random() - 0.5);
  if (canBoardWin(array)) {
    return array;
  }
  return jumble();
};

var A = jumble();

//switch the local
var switcher = (l) => {
  moves++;
  let temp = A[l[0]];
  A[l[0]] = A[l[1]];
  A[l[1]] = temp;
  printer();
};

//win checker puzzle
var checker = () => {
  let flag = true;
  A.forEach((a, i) => (flag *= a == (i == A.length - 1 ? 0 : i + 1)));
  if (flag) {
    var msg = document.getElementById("msg");
    msg.textContent = "you won";
    msg.setAttribute("style", "color:gold;font-size:x-large;font-weight:bold");
  }
};

//location finder
var finder = (n) => {
  let loc = [0, 0];
  for (let i = 0; i < A.length; i++) {
    if (A[i] == n) loc[0] = i;
    else if (A[i] == 0) loc[1] = i;
  }
  return loc;
};

//play
var play = (n) => {
  var msg = document.getElementById("msg");
  msg.innerHTML = "";
  let l = finder(n);
  //left-right
  if (
    Math.floor(l[0] / G) == Math.floor(l[1] / G) &&
    Math.abs(l[0] - l[1]) == 1
  ) {
    switcher(l);
  }
  //up-down
  else if (Math.abs(l[0] - l[1]) == G) {
    switcher(l);
  }
  //cant switch
  else {
    var error = document.getElementById("msg");
    error.textContent = `cant move : ${n}`;
    error.style.color = "red";
  }
  checker();
};

//print puzzle
var printer = () => {
  //moves
  var tmoves = document.getElementById("moves");
  tmoves.textContent = `Total moves : ${moves}`;
  tmoves.style.color = "blue";
  //puzzle table
  var table = document.getElementById("puzzle");
  table.innerHTML = "";
  var tableBody = document.createElement("TBODY");
  table.appendChild(tableBody);
  let p = 0;
  for (let i = 0; i < G; i++) {
    var tr = document.createElement("TR");
    tableBody.appendChild(tr);
    for (let j = 0; j < G; j++) {
      var td = document.createElement("TD");
      if (A[p] > 0) {
        td.setAttribute("onclick", `play("${A[p]}")`);
        td.appendChild(document.createTextNode(A[p]));
      } else {
        td.appendChild(document.createTextNode(""));
      }
      tr.appendChild(td);
      p++;
    }
  }
};
printer();
