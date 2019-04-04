
// Create the game timer 
const timer = document.createElement(`div`);
timer.className = `timer`;
timer.innerHTML = `00:00`;
const panel = document.getElementsByClassName(`score-panel`);
panel[0].appendChild(timer);
let totalSeconds = 0;

// Default values
let openedCards = [],
    matchCounter = 0,
    moveCounter = 0,
    tryCounter = 0,
    starRating = 3,
    timeInt = 0;

// Get the deck div element from the HTML
let deck = document.getElementsByClassName(`deck`);

// Get the 'moves' from the HTML and change the text to 0
let moves = document.getElementsByClassName(`moves`);
moves[0].innerHTML = 0;

// Get the 'reset' icon from the HTML
const restart = document.getElementsByClassName(`fa-repeat`);

// Create a list of cards 
const card = [`anchor`, `bicycle`, `bolt`, `bomb`, `cube`, `diamond`, `leaf`, `paper-plane-o`];
const cards = [...card, ...card];

// Returns a shuffled list of items
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Call the Congrats function 
congrats();

// Add eventlistener to listen for click on reset button
restart[0].addEventListener(`click`, reset);

// Call the reset function when page loads
reset();

// Resets the game to default values
function reset() {
    openedCards = [];
    matchCounter = 0;
    tryCounter = 0;
    resetTimer();
    resetCounter();
    resetStars();
    clearDeck(deck);
    let shuffledDeck = shuffle(cards);
    createDeck(shuffledDeck);
    hideCongrats();
}

// Clear the old deck of cards 
function clearDeck(deck) {
    deck[0].remove();
}

// Create the Deck function that adds the proper classname and evenlistnener to each card.
function createDeck(deck) {
    const ul = document.createElement(`ul`);
    ul.className = `deck`;
    const container = document.getElementsByClassName(`container`);
    container[0].appendChild(ul);
    for (let i=0; i<deck.length; i++){
        const li = document.createElement(`li`);
        li.className = `card`;
        const inner = document.createElement(`i`);
        inner.className = `fa fa-${deck[i]}`;
        ul.appendChild(li);
        li.appendChild(inner);
        li.addEventListener(`click`, start);
    }
}


// Starting the game 

function start() {
    
    if ((openedCards.length < 2) && (!isSameCard(this)) && (!isAlreadyMatched(this)) ) {
        // Count the number of clicks that do not result a match
        tryCounter++;

        displayCard(this);
        addOpenedList(this);
        incrementCounter();

        // Start the timer if it is the first click
        if (moveCounter === 1) {
            timeInt = setInterval(startTimer, 1000);
        }
        // if two cards are open
        if(openedCards.length === 2){
            // if the two opened cards match
            if(openedCards[0] === openedCards[1]){
                // Reset the failed match count back to 0
                tryCounter = 0;
                lockMatch();
                removeOpenedList();
                // if cards are matched, stop the timer and display congrats
                if (matchCounter === 16){
                    stopTimer();
                    // display popup after the last match
                    setTimeout(function() {
                        return displayCongrats();}, 900
                    );
                }
            } else {  // if  no match
                // hide the cards after 1 second 
                setTimeout(function(){
                    return hideCards();}, 1000
                );
                // remove the cards from the list of open cards
                setTimeout(function() {
                    return removeOpenedList();}, 1000);

                // Rating the user base on the moves 
                if ((moveCounter >= 8) && (tryCounter >= 4) && (starRating > 1)){
                    lowerStars();
                }
            }
        }
    }
}

// Disply time in minutes and seconds
function startTimer(){
    ++totalSeconds;
    function addZero(i) {
        return (i < 10) ? `0` + i : i;
    }
    let min = addZero(Math.floor(totalSeconds/60));
    let sec = addZero(totalSeconds - (min*60));
    timer.innerHTML = `${min}:${sec}`;
}

// Reset the timer to default 
function resetTimer(){
    clearInterval(timeInt);
    totalSeconds = 0;
    timer.innerHTML = `00:00`;
}

// Stop the timer
function stopTimer(){
    clearInterval(timeInt);
}

// Show the card 
function displayCard(item) {
    item.className = `card open show`;
}

// Hide opened cards 
function hideCards() {
    let openClass = document.getElementsByClassName(`open`);
    while (openClass.length){
        openClass[0].className = `card`;
    }
}

// Return true if the item is already opened and false if not
function isSameCard(item) {
    const isSame = (item.className === `card open show`) ? true : false;
    return isSame;
}

// Return true if the item is already matched and false if not
function isAlreadyMatched(item) {
    const isAM = (item.className === `card match`) ? true : false;
    return isAM;
}

// Add the item to a list of opened cards
function addOpenedList(item) {
    let inner = item.childNodes;
    for (let i=0; i<inner.length; i++){
        let symbol = inner[i].className;
        // remove the 'fa fa-'
        symbol = symbol.slice(6);
        openedCards.push(symbol);
    }
}

// Increase the click(move) count by 1 and update the HTML text 
function incrementCounter() {
    moveCounter++;
    moves[0].innerHTML = moveCounter;
}

// Reset the click(move) to 0 and update the HTML text 
function resetCounter() {
    moves[0].innerHTML = moveCounter = 0;
}

// Keep the matched cards opened by setting the class name to 'card match'
// Increase the match count by 2
function lockMatch() {
    let faSymbol = `fa-${openedCards[0]}`;
    let collection = document.getElementsByClassName(`${faSymbol}`);

    for(let i=0; i<collection.length; i++){
        collection[i].parentElement.className = `card match`;
    }
    matchCounter += 2;
}

// Remove the two items in the list of opened card symbols
function removeOpenedList() {
    openedCards.pop();
    openedCards.pop();
}

// Create a div element to add to the page that will hold the congrats message later
// Hide the div element initially
function congrats() {
    const page = document.getElementsByClassName(`container`);
    const popup = document.createElement(`div`);
    popup.className = `congratsPopup dimmed`;
    popup.innerHTML = ``;
    page[0].appendChild(popup);
}

// Display the congrats message with the move count, total time, star rating and play again 'button'
function displayCongrats() {
    const popup = document.getElementsByClassName(`congratsPopup`);
    popup[0].className = `congratsPopup`;
    popup[0].innerHTML =
        `<h2 class="congratsHeading" > Congratulations </h2>
        <h3 class="congratsTagline" > Smart You!</h3>
        <p class="congratsMove" > ${moveCounter} moves </p>
        <p class="congratsTime" > ${timer.innerHTML} total time </p>
        <p class="congratsStar" > ${starRating} stars </p>
        <p class="congratsPlay" > Wanna Play Again? </p>`;
    const play = document.getElementsByClassName(`congratsPlay`);
    play[0].addEventListener(`click`,reset);
}

// Hide the congrats popup 
// Erase the congrats text messages
function hideCongrats() {
    const popup = document.getElementsByClassName(`congratsPopup`);
    popup[0].className = `congratsPopup dimmed`;
    popup[0].innerHTML = ``;
}

// Lower the star rating by one, and hide the last star by adding the class 'dimmed'
function lowerStars() {
    starRating--;
    tryCounter = 0;
    const stars = document.getElementsByClassName(`fa-star`);
    stars[starRating].className = `fa fa-star dimmed`;
}

// Reset the rating to 3 and show all stars by removing the class 'dimmed'
function resetStars() {
    starRating = 3;
    const stars = document.getElementsByClassName(`fa-star`);
    for (let i=0; i<3; i++){
        stars[i].className = `fa fa-star`;
    }
}
