let gameArea = document.getElementById('gameArea')
let playerSwitch = document.getElementById('switch')
let playersObj = ['url("../img/circle.png")', 'url("../img/cross.png")']
let blankCell = null;
let playersObjIdx = 0;
const WIN_POSITIONS = [ 0b111000000,
    0b000111000,
    0b000000111,
    0b100100100,
    0b010010010,
    0b001001001,
    0b100010001,
    0b001010100
]; //все выигрышные позиции в двоичном виде

// тут рендерим поле (эту функцию переписать бы)
function renderGame(cellType = "outerCell"){
    let trr, td, table

    if (cellType === "outerCell"){
        //Outer cells
            for (let i = 0; i < 3; i++){
                trr = document.createElement('tr');
                gameArea.appendChild(trr); // опционально
                for (let u = 0; u < 3; u++){
                    td = document.createElement('td')
                    table = document.createElement('table') // опционально
                    table.className = "innerTable" // опционально
                    td.className = cellType; 
                    trr.appendChild(td);
                    td.appendChild(table); // опционально
                }
            }
        } else {
        //inner cells
            for (let o = 0; o < 9; o++){
                for (let i = 0; i < 3; i++){
                    trr = document.createElement('tr');
                    for (let u = 0; u < 3; u++){
                    td = document.createElement('td')
                    td.className = cellType;
                    trr.appendChild(td);
                    } 
                    document.querySelectorAll('.innerTable')[o].appendChild(trr);    
                }  
            }
        }
        if (cellType === "outerCell") {
            return renderGame("innerCell")
        }
        else {
            return 
    }
}

function changePlayer() {
    return (playersObjIdx === 1) ? 0 : 1;
}

// Функция для проверки доступных для хода ячеек
function checkAvailableCell(event){
    let innercells = Array.from(event.target.closest('.innerTable').querySelectorAll('.innerCell'));
    let mainCells = Array.from(document.querySelectorAll('.outerCell'));
    innercells.forEach(innerCell => {
            if (innerCell === event.target){ // находим ячейку, на которую кликул пользователь
                mainCells.forEach(mainCell => {
                    if (mainCells.indexOf(mainCell) === innercells.indexOf(innerCell)) {
                       if (Array.from(mainCell.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage === "" && (cell.closest(".outerCell").querySelector('.winnedCell')) === null)){
                            blankCell = mainCell
                        } else {
                            let availableCells = mainCells.filter((mainCell) => Array.from(mainCell.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage === "") && mainCell.closest(".outerCell").querySelector('.winnedCell') === null ); //сделать проверку на winnedCell
                            let randomIdx = Math.floor(Math.random() * availableCells.length);
                            blankCell = availableCells[randomIdx];
                        }
                        blankCell.style.border = '5px solid red';
                    } 
                })
            }
        }
    )
}

//Функция проверки на выигрыш во внутренней ячейке (она такая маленькая лол)
function winInnerCheck(event, pObj){
    let boardArr = Array.from(event.target.parentElement.parentElement.querySelectorAll('.innerCell'))
    let binary = [].reduce.call(boardArr, function(result, innerCell){
        return result + +(innerCell.style.backgroundImage === pObj)
    }, "0b")
    if (WIN_POSITIONS.some((pos) => (pos & binary) == pos)) {
        let winDiv = document.createElement('div')
        winDiv.className = "winnedCell";
        winDiv.style.backgroundImage = pObj
        event.target.closest('.outerCell').appendChild(winDiv)
        winOuterCheck(pObj)
    }
    else if (boardArr.every((cell) => cell.style.backgroundImage != "")){
        let winDiv = document.createElement('div')
        winDiv.className = "winnedCell";
        event.target.closest('.outerCell').appendChild(winDiv)
        winOuterCheck(pObj)
    }
}

// Функция проверки ячеек, где игра уже закончена
function winOuterCheck(pObj){
    let outerCells = Array.from(document.querySelectorAll('.outerCell'));
    let binary = [].reduce.call(outerCells, function(result, outerCell){
        let check = (outerCell.querySelector('.winnedCell') != null)
        return result + +(check ? (outerCell.querySelector('.winnedCell').style.backgroundImage === pObj) : "0");
    }, "0b")
    if (WIN_POSITIONS.some((pos) => (pos & binary) == pos)){
        if(playersObj.indexOf(pObj) === 1){
            alert('Победили крестики')
        } else alert('Победили нолики');
    } else if(outerCells.every((outerCell) => outerCell.querySelector('.winnedCell') !== null)){
        alert('ничья ёпта') ///
    }
}

//Функция делающая ход
function makeMove(event){
    let innercells = Array.from(document.querySelectorAll('.innerCell'));
    if (event.target.classList.contains("innerCell") && event.target.style.backgroundImage === ""){
        if (innercells.every((cell) => cell.style.backgroundImage === "")){
            event.target.style.backgroundImage = playersObj[playersObjIdx];
        }
        else if (event.target.closest('.outerCell') === blankCell){
            event.target.style.backgroundImage = playersObj[playersObjIdx];
            blankCell.style.border = "none";
        }
    }
    playerSwitch.classList.toggle('playerMoveCross')
    winInnerCheck(event, playersObj[playersObjIdx])
    playersObjIdx = changePlayer()
    checkAvailableCell(event)
}

document.addEventListener('onload', renderGame())
gameArea.addEventListener("click", (event) => {
    if (event.target.classList.contains('innerCell') && (event.target.closest('.outerCell') === blankCell || blankCell === null) && event.target.style.backgroundImage === ""){
        makeMove(event)
    }
});