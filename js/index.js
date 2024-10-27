(function () {
    let gameArea = document.getElementById('gameArea')
    let blankCell = null;
    let gameEnded = false;
    let playersObjIdx = 0;
    //все выигрышные позиции в двоичном виде

    // тут рендерим поле (эту функцию переписать бы)
    function renderGame(cellType = "outerCell") {
        let trr, td, table

        if (cellType === "outerCell") {
            //Outer cells
            for (let i = 0; i < 3; i++) {
                trr = document.createElement('tr');
                gameArea.appendChild(trr); // опционально
                for (let u = 0; u < 3; u++) {
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
            for (let o = 0; o < 9; o++) {
                for (let i = 0; i < 3; i++) {
                    trr = document.createElement('tr');
                    for (let u = 0; u < 3; u++) {
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
    function checkAvailableCell(event) {
        let innercells = Array.from(event.target.closest('.innerTable').querySelectorAll('.innerCell'));
        let mainCells = Array.from(document.querySelectorAll('.outerCell'));
        innercells.forEach(innerCell => {
            if (innerCell === event.target) { // находим ячейку, на которую кликул пользователь
                mainCells.forEach(mainCell => {
                    if (mainCells.indexOf(mainCell) === innercells.indexOf(innerCell)) {
                        //проверяем: есть ли в подходящей ячейке свободные поля и не считается ли игра в ней законченной
                        if (Array.from(mainCell.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage === "" && (cell.closest(".outerCell").querySelector('.winnedCell')) === null)) {
                            blankCell = mainCell
                        } else {
                            let availableCells = mainCells.filter((mainCell) => Array.from(mainCell.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage === "") && mainCell.closest(".outerCell").querySelector('.winnedCell') === null); //сделать проверку на winnedCell
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
    function winInnerCheck(event, pObj) {
        let boardArr = Array.from(event.target.parentElement.parentElement.querySelectorAll('.innerCell'))
        let binary = [].reduce.call(boardArr, function (result, innerCell) {
            return result + +(innerCell.style.backgroundImage === pObj)
        }, "0b")
        // Проверяем: есть ли в кликнутой ячейке выигрыщная комбинация (обрабатываем только для того знака, который кликнул)
        if (localStorage.getItem('winpos').split(",").some((pos) => (pos & binary) == pos)) { 
            let winDiv = document.createElement('div')
            winDiv.className = "winnedCell";
            winDiv.style.backgroundImage = pObj
            event.target.closest('.outerCell').appendChild(winDiv)
            winOuterCheck(pObj)
        }
        // Иначе проверяем: есть ли вообще свободные клетки и если нет, делаем поле с ничьёй
        else if (boardArr.every((cell) => cell.style.backgroundImage != "")) {
            let winDiv = document.createElement('div')
            winDiv.className = "winnedCell";
            event.target.closest('.outerCell').appendChild(winDiv)
            winOuterCheck(pObj)
        }
    }

    // Функция проверки ячеек, где игра уже закончена
    function winOuterCheck(pObj) {
        let outerCells = Array.from(document.querySelectorAll('.outerCell'));
        let binary = [].reduce.call(outerCells, function (result, outerCell) {
            let check = (outerCell.querySelector('.winnedCell') != null)
            return result + +(check ? (outerCell.querySelector('.winnedCell').style.backgroundImage === pObj) : "0");
        }, "0b")
        //Всё так-же проверяем выигрышные комбинации в внешних ячейках, только тут проверка происходит после выигрыша кого-либо
        if (localStorage.getItem('winpos').split(",").some((pos) => (pos & binary) == pos)) { 
            if (localStorage.getItem('playerObj').split(',').indexOf(pObj) === 1) { 
                winEvent('Победили крестики')
            } else winEvent('Победили нолики');
            //Если победы нет, то проверяем есть ли свободные ячейки и в противном случае вызываем ничью глобально.
        } else if (outerCells.every((outerCell) => outerCell.querySelector('.winnedCell') !== null)) {
            winEvent('Победителей нет..')
        }
    }

    function winEvent(winInfo) {
        gameEnded = true;
        document.getElementById('winEventModal').style.display = "block"
        document.getElementById('winText').innerText = winInfo;
    }

    //Функция делающая ход
    function makeMove(event) {
        let innercells = Array.from(document.querySelectorAll('.innerCell'));
        if (event.target.classList.contains("innerCell") && event.target.style.backgroundImage === "") {
            if (innercells.every((cell) => cell.style.backgroundImage === "")) {
                event.target.style.backgroundImage = localStorage.getItem('playerObj').split(',')[[playersObjIdx]]; ///
            }
            else if (event.target.closest('.outerCell') === blankCell) {
                event.target.style.backgroundImage = localStorage.getItem('playerObj').split(',')[[playersObjIdx]]; ///
                blankCell.style.border = "none";
            }
        }
        document.getElementById('switch').classList.toggle('playerMoveCross')
        winInnerCheck(event, localStorage.getItem('playerObj').split(',')[[playersObjIdx]]) 
        playersObjIdx = changePlayer()
        checkAvailableCell(event)
    }

    document.addEventListener('onload', renderGame())
    gameArea.addEventListener("click", (event) => {
        if (gameEnded !== true && event.target.classList.contains('innerCell') && (event.target.closest('.outerCell') === blankCell || blankCell === null) && event.target.style.backgroundImage === "") {
            makeMove(event)
        }
    });
    console.log(localStorage.getItem('playerObj')) 
})()