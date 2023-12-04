const cards = document.querySelector('.cards');
let cardsNumber = 12;
let speed = 2500;
let pairs = true;
let firstCard, secondCard;
let hasFlippedCard = false;
const classNames = ['shown', 'shadow-custom'];
const classNamesHidden = ['shown', 'opacity-0'];
let lockedBoard = false;
let bindObj;
const modal = document.querySelector('.modal');
const newBtn = document.querySelector('.new-btn');
const finalTime = {
    'hour': null,
    'min': null,
    'sec': null
};
let breakPoint = false;
const modalCardsNumber = document.querySelector('.modal-cards');
const modalTime = document.querySelector('.modal-time');


newBtn.addEventListener('click', hideModalWindow);

// Create random cards choice
function randomCardsChoose(n) {
    const unsortedArr = [];

    for (let i = 0; i < n; i++) {
        unsortedArr.push(i+1);
    }

    const sortedArr = shuffle(unsortedArr);
    return sortedArr;
}

// Одна из вариаций алгоритма Фишера-Йетса: берём последний элемент и меняем его местами со случайно выбранным элементом 
// не правее его (в том числе, возможно, и с ним самим). 
// Затем повторяем ту же операцию для предпоследнего элемента, 
// потом для предпредпоследнего и т.д.
function shuffle(arr) {
    for (let j = arr.length - 1; j > 0; j--) {
        let i = Math.floor(Math.random()*(j+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


//Create cards
function appendCard(arrCards) {
    arrCards.forEach(c => {
        const card = document.createElement('div');
        card.classList = 'card w-40 h-40 bg--700 rounded-lg relative cursor-pointer preserve transition'
        card.dataset.kind = 'card';
        card.dataset.number = c;
        const obverse = document.createElement('div');
        obverse.classList = 'w-40 h-40 bg-violet-800 rounded-lg absolute backface-hidden rotate-y-0';
        const reverse = document.createElement('img');
        reverse.src =`../src/img/${c}.jpg`;
        reverse.classList = 'w-40 h-40 rounded-lg absolute backface-hidden rotate-y-180';
        card.append(reverse);
        card.append(obverse);
        cards.append(card);
    });
}

// Flip cards and check if they match
function checkMatch() {
    let isMatch;
    if (firstCard.dataset.number % 2 === 0) {
        isMatch = ((+firstCard.dataset.number - 1) === +secondCard.dataset.number) ? true : false;
    } else {
        isMatch = ((+firstCard.dataset.number + 1) === +secondCard.dataset.number) ? true : false;
    }
    isMatch ? markMatchedCards() : hideCards();
}

function addGlow() {
    classNames.forEach(clN => {
        firstCard.classList.add(clN);
        secondCard.classList.add(clN)
    });
}

function addTransparency() {
    classNamesHidden.forEach(clN => {
        setTimeout(() => {
            bindObj.firstCard.classList.add(clN);
            bindObj.secondCard.classList.add(clN);
        },500)
    });
}

function markMatchedCards() {
    (pairs === true) ? addGlow() : addTransparency();

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    console.log(document.querySelectorAll('.shown').length);

    declareVictory();
    resetBoard();
}

function hideCards() {
    setTimeout(() => {
        firstCard.classList.remove('rotate-y-180');
        secondCard.classList.remove('rotate-y-180');

        resetBoard();
        }, speed);
}

function resetBoard() {
    hasFlippedCard = false;
    lockedBoard = false;
    firstCard = null;
    secondCard = null;
}

//Declare the victory
function showModalWindow() {
    modal.classList.remove('hidden');
    modalCardsNumber.innerHTML = cardsNumber + ' cards';
    modalTime.innerHTML = `in ${finalTime.hour > 0 ? (finalTime.hour + " hr, ") : ""}${finalTime.min > 0 ? (finalTime.min + " min and ") : ""}${finalTime.sec > 0 && finalTime.sec} sec.`
}

function hideModalWindow() {
    modal.classList.add('hidden');
    window.location.reload();
}

function declareVictory() {

    setTimeout(() => {
        if (document.querySelectorAll('.opacity-0').length > 0) {
            if (document.querySelectorAll('.shown').length === cardsNumber-2) {
                commitFinalTime();
                showModalWindow();
                stopTimer();
            }
        } else if (pairs === true) {
            if (document.querySelectorAll('.shown').length === cardsNumber) {
                commitFinalTime();
                showModalWindow();
                stopTimer();
            }
        }
    }, 400)
}

function flipCard() {
    if (lockedBoard) return;
    if (this === firstCard) return;

    this.classList.add('rotate-y-180');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    } 

    secondCard = this;
    lockedBoard = true;

    bindObj = {
        'firstCard': firstCard,
        'secondCard': secondCard
    };

    checkMatch();
}

const data = [
    ['Level', [12, 24, 36]], 
    ['Speed', ['medium', 'fast', 'slow'], [2000, 800, 3500]],
    ['Pairs', ['show the matched pairs', 'hide the matched pairs'], [true, false]]
];

// Create controls
function createOptions(optionsInfo, optionsAddInfo) {
    let optionsArr = [];
    for (let i = 0; i < optionsInfo.length; i++) {
        const option = document.createElement('option');
        option.innerHTML = `${optionsInfo[i]}`;
        if (optionsAddInfo) option.value = `${optionsAddInfo[i]}`;
        optionsArr.push(option);
    }
    return optionsArr;
}

function createSelect(optionsList) {
    const form = document.querySelector('.form');
    const wrapper = document.createElement('div');
    wrapper.classList = 'my-10 flex flex-col gap-2';
    form.append(wrapper);
    const label = document.createElement('label');
    label.classList = 'text-violet-400 font-bold';
    label.textContent = `${optionsList[0]}`;
    const select = document.createElement('select');
    select.classList = 'border border-violet-500 rounded-md bg-transparent text-violet-500 px-6 py-2 font-medium hover:bg-violet-500 hover:text-violet-950 transition-colors cursor-pointer';
    select.dataset.mean = `${optionsList[0].toLowerCase()}`;
    wrapper.append(label);
    wrapper.append(select);
    const options = optionsList[2] ? createOptions(optionsList[1], optionsList[2]) : createOptions(optionsList[1]);
    select.append(...options);
}

//create timer
const timer = document.querySelector('.timer');
const hourElem = document.querySelector('.hour');
const minElem = document.querySelector('.min');
const secElem = document.querySelector('.sec');

let hour = 0;
let min = 0;
let sec = 0;
let interval;

function resetTime() {
    hour = 0;
    min = 0;
    sec = 0;
}

function startTimer() {
    if (breakPoint === false) {
        sec++;
        if (sec < 10) {
            secElem.innerText = `0${sec}`;
        } else {
            if (sec > 59) {
                min++;
                sec = 0;
                if (min < 10) {
                    minElem.innerText = '0' + min;
                } else {
                    if (min > 59) {
                        min = 0;
                        hour++;
                        if (hour < 10) {
                            hourElem.innerText = "0" + hour;
                        }
                        hourElem.innerText = hour;
                    }
                    minElem.innerText = min;
                }
            }
            secElem.innerText = sec;
        };
    }
}

function commitFinalTime() {
    finalTime.hour = hour;
    finalTime.min = min;
    finalTime.sec = sec;
}

function stopTimer() {
    breakPoint = true;
}

class Btns {
    constructor(elem) {
    elem.onclick = this.onClick.bind(this);
    }

    start() {
        resetTime();
        clearInterval(interval);
        while (cards.firstChild) {
            cards.removeChild(cards.firstChild);
            }
        appendCard(randomCardsChoose(cardsNumber));
        document.querySelectorAll('.card').forEach(card => card.addEventListener('click', flipCard));
        interval = setInterval( startTimer, 1000);
    }

    reset() {
        window.location.reload();
    }

    onClick(event) {
        let action = event.target.dataset.action;
        if (action) {
            this[action]();
        }
    }
}

new Btns(btns);

document.addEventListener("DOMContentLoaded", () => {
    data.forEach(d => createSelect(d));
});


function chooseOption(mean, event) {
    switch(mean) {
        case 'level':
            cardsNumber = event.target.value;
            break;
        case 'speed':
            speed = event.target.value;
            break;
        case 'pairs':
            pairs = event.target.value;
            break;
    }
}



document.addEventListener('change', function(event) {
    chooseOption(event.target.dataset.mean, event);
});

