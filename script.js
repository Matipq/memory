const game = document.getElementById('game');
const gameSetup = document.getElementById('game-setup');
const startGameButton = document.getElementById('start-game');
const gameGrid = document.querySelector('.game-grid');
const newGameButton = document.getElementById('new-game');
const restartGameButton = document.getElementById('restart-game');
const themeButtons = document.querySelectorAll('.theme');
const playersButtons = document.querySelectorAll('.players');
const sizeButtons = document.querySelectorAll('.size');

let selectedTheme = 0;
let selectedPlayers = 0;
let selectedSize = 0;

let sec = 0;
let timeInterval;

function pad(val) {
return val > 9 ? val : "0" + val;
}

function startTimer(){
    timeInterval = setInterval(function() {
        document.getElementById('seconds').textContent = pad(++sec % 60);
        document.getElementById('minutes').textContent = pad(parseInt(sec / 60, 10));
    }, 1000);
}


function resetTimer() {
    clearInterval(timeInterval);
    timeInterval = null;
    sec = 0;
    document.getElementById('seconds').textContent = "00";
    document.getElementById('minutes').textContent = "00";
}


function createArray(N) {
    return [...Array(N).keys()].map(i => i + 1);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));

        [array[i], array[random]] = [array[random], array[i]];
    }
}

function restartGame() {
    resetTimer();
    gameGrid.replaceChildren();
    gameGrid.classList.remove('game-grid-36');
    score.textContent = '0';
    startNewGame();
    startTimer();
}

function newGame() {
    game.classList.add('invisible');
    gameSetup.classList.remove('invisible');

    gameGrid.replaceChildren();
    gameGrid.classList.remove('game-grid-36');
    score.textContent = '0';

    resetTimer();
}

function startNewGame() {
    if (selectedSize === 0) {

        let N = 8;
        let arr1 = createArray(N);
        let arr2 = createArray(N);
        const numbers = arr1.concat(arr2);
        shuffle(numbers);

        for (let i = 0; i < 16; i++) {
            gameGrid.classList.add('game-grid-16')
            const gameButton = document.createElement('div');
            const button = document.createElement('button');
            const cover = document.createElement('div');

            cover.innerHTML = numbers[0 + i]

            cover.className = 'cover';
            button.className = 'button';
            gameButton.className = 'gameButton';
            
            gameGrid.appendChild(gameButton);
            gameButton.appendChild(button);
            gameButton.appendChild(cover);
        }
            
    } else if (selectedSize === 1) {

        let N = 18;
        let arr1 = createArray(N);
        let arr2 = createArray(N);
        const numbers = arr1.concat(arr2);
        shuffle(numbers);

        for (let i = 0; i < 36; i++) {
            gameGrid.classList.add('game-grid-36')
            const gameButton = document.createElement('div');
            const button = document.createElement('button');
            const cover = document.createElement('div');

            cover.innerHTML = numbers[0 + i]

            cover.className = 'cover';
            button.className = 'button';
            gameButton.className = 'gameButton';
            
            gameGrid.appendChild(gameButton);
            gameButton.appendChild(button);
            gameButton.appendChild(cover);
        } 
    }


    const gameButton = document.querySelectorAll('.gameButton');
    const score = document.getElementById('score');
    const elements = gameGrid.querySelectorAll('button');

    let firstGuess = null;
    let secondGuess = null;
    let scoreVariable = 0;

    function disableGuessing() {
        elements.forEach((element) => {
            element.removeAttribute('disabled');
        }) 
    }


    function handleAction(buttonValue, buttonElement) {
        
        if (buttonElement.classList.contains('matched') || buttonElement.classList.contains('flipped')) {
            return;
        }
        
        if (firstGuess === null) {
            firstGuess = {value: buttonValue, element: buttonElement};
            buttonElement.classList.add('flipped');
        } else if (secondGuess === null) {
            secondGuess = {value: buttonValue, element: buttonElement};
            buttonElement.classList.add('flipped');
            
            gameGrid.querySelectorAll('button').forEach((element) => {
                element.setAttribute('disabled', true);
            })

            compareGuess();
        
        }
    }
    
    
    function compareGuess() {

        if (firstGuess.value === secondGuess.value) {
            firstGuess.element.classList.add('matched');
            secondGuess.element.classList.add('matched');
            firstGuess = null;
            secondGuess = null;
            disableGuessing();
        } else {
            setTimeout(() => {
                firstGuess.element.classList.remove('flipped');
                secondGuess.element.classList.remove('flipped');
                firstGuess.element.querySelector('button').classList.remove('invisible');
                secondGuess.element.querySelector('button').classList.remove('invisible');
                firstGuess = null;
                secondGuess = null; 
                disableGuessing();
            }, 1000);     
        } 

        scoreVariable++; 
        score.innerText = scoreVariable; 

        summaryPopup();

    }

    gameButton.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cover = btn.querySelector('div');
            const button = btn.querySelector('button');
            button.classList.add('invisible');
            handleAction(cover.innerHTML, btn);        
        })
    })


    function summaryPopup() {
        let allHaveClass = Array.from(elements).every(element => element.classList.contains('invisible'));
        const summaryOverlay = document.querySelector('.summary-modal');
        const summaryRestartButton = document.getElementById('summary-restart');
        const summaryNewGameButton = document.getElementById('summary-new-game');

        if (allHaveClass) {
            summaryOverlay.classList.remove('invisible');

            getTime();
            getMoves();
            resetTimer();
        }

        summaryRestartButton.addEventListener('click', () => {
            restartGame();
            summaryOverlay.classList.add('invisible');
        })

        summaryNewGameButton.addEventListener('click', () => {
            newGame();
            summaryOverlay.classList.add('invisible');
        })
    }
    

    function getTime() {
        let secondsElapsed = document.getElementById('seconds').innerHTML;
        let minutesElapsed = document.getElementById('minutes').innerHTML;
        let gameTime = minutesElapsed + ':' + secondsElapsed;
        const timeElapsed = document.getElementById('time-elapsed');
        
        timeElapsed.innerHTML = gameTime;
    }

    function getMoves() {
        const movesTaken = document.getElementById('moves-taken');

        movesTaken.innerHTML = scoreVariable;
    }
}



startGameButton.addEventListener('click', () => {
    game.classList.remove('invisible');
    gameSetup.classList.add('invisible');
    startNewGame();
    startTimer();
})

newGameButton.addEventListener('click', () => {
    newGame();
})

restartGameButton.addEventListener('click', () => {
    restartGame();
})

themeButtons.forEach((button, id) => {
    button.addEventListener('click', (event) => {
        themeButtons.forEach(btn => btn.classList.remove('active'));
    
        event.target.classList.add('active');
        selectedTheme = (id);
    })
    
});

playersButtons.forEach((button, id) => {
    button.addEventListener('click', (event) => {
        playersButtons.forEach(btn => btn.classList.remove('active'));
    
        event.target.classList.add('active');
        selectedPlayers = (id);
    })
    
});

sizeButtons.forEach((button, id) => {
    button.addEventListener('click', (event) => {
        sizeButtons.forEach(btn => btn.classList.remove('active'));
    
        event.target.classList.add('active');
        selectedSize = (id);

    })
    
});