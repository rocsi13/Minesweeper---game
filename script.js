document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 15;
    let squares = [];
    let minesAmount = 30;
    let flags = 0;
    let gameOver = false;
    let validBoxes = 0;
    let remainingBoxes = width * width - minesAmount - validBoxes;
    let remainingFlags = minesAmount - flags;

    boardGrid();

    function boardGrid() {
        const minesArray = Array(minesAmount).fill('mine');
        const emptyArray = Array(width*width - minesAmount).fill('valid');
        const gameArray = minesArray.concat(emptyArray);
        const shuffleMines = gameArray.sort(() => Math.random() - 0.5);
        for (let i = 0; i < width*width; ++i) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffleMines[i]);
            grid.appendChild(square);
            squares.push(square);
            square.addEventListener('click', function(e) {
                revealSquare(square);
            })
            square.oncontextmenu = function(e) {
                e.preventDefault();
                clickFlag(square);
            }
        }

        for (let i = 0; i < squares.length; ++i) {
            let neighbouringMines = 0;
            const leftEdge = (i % width === 0);
            const rightEdge = (i % width === width - 1);
            if (squares[i].classList.contains('valid')) {
                if (i > 0 && i != leftEdge && squares[i - 1].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i > 14 && i !=rightEdge && squares[i + 1 - width].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i > 15 && squares[i - width].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i > 16 && i != leftEdge && squares[i - 1 - width].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i < 223 && i != rightEdge && squares[i + 1].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i < 210 && i != leftEdge && squares[i - 1 + width].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i < 208 && i != rightEdge && squares[i +1 + width].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                if (i < 209 && squares[i + width].classList.contains('mine')) {
                    ++neighbouringMines;
                }
                squares[i].setAttribute('data', neighbouringMines);
            }
        }
    }

    function checkWin() {
        if (validBoxes === width * width - minesAmount) {
            gameOver = true;
            let gameOverMessage = document.getElementById("gameMessage");
            gameOverMessage.innerHTML = "You won!";
            return;
        }
        if (!gameOver) {
            let constantGameMessage = document.getElementById("gameMessage");
            constantGameMessage.innerHTML = "You have " + remainingBoxes + " more empty boxes to find and " + remainingFlags + " remaining flags.";
        }
    }

    function revealSquare(square) {
        checkWin();
        let currentId = square.id;
        if (gameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('mine')) {
            let gameOverMessage = document.getElementById("gameMessage");
            gameOverMessage.innerHTML = "Game over!";
            gameOver = true;
            squares.forEach(square => {
                if (square.classList.contains('mine')) {
                    square.innerHTML = '💣';
                }
            })
            return;
        } else {
            let surroundingMines = square.getAttribute('data');
            if (surroundingMines > 0) {
                square.classList.add('checked');
                square.innerHTML = surroundingMines;
                ++validBoxes;
                remainingBoxes = width * width - minesAmount - validBoxes;
                remainingFlags = minesAmount - flags;
                return;
            }
            checkSquare(square, currentId); 
        }
        square.classList.add('checked');
    }

    function checkSquare(square, currentId) {
        const leftEdge = (currentId % width === 0);
        const rightEdge = (currentId % width === width - 1);

        setTimeout (() => {
            if (currentId > 0 && currentId != leftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId > 14 && currentId != rightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId > width) {
                const newId = squares[parseInt(currentId - width)].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId > 16 && currentId != leftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId < 223 && currentId != rightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId < 210 && currentId !=leftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId < 208 && currentId != rightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
            if (currentId < 209) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                revealSquare(newSquare);
            }
        }, 5);
    }

    function clickFlag(square) {
        if (gameOver) return;
        if (!square.classList.contains('checked') && remainingFlags > 0) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                ++flags;
                checkWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                --flags;
            }
        }
        remainingFlags = minesAmount - flags;
    }
});

function restartGame() {
    document.location.reload();
}