//Challenge 1: Your age in days

function ageInDays(){
if(document.getElementById('ageInDays') != null){
    document.getElementById('ageInDays').remove();
}
var birthYear = prompt("What year were you born?");
var givenage = (2021 - birthYear) * 365;
var h1 = document.createElement('h1');
var textAnswer = document.createTextNode('You are ' + givenage + ' days old');
h1.setAttribute('id', 'ageInDays');
h1.appendChild(textAnswer);
document.getElementById('flex-box-result').appendChild(h1);
}

function reset() {
    document.getElementById('ageInDays').remove();
}

function getCat(){
    var image = document.createElement('img');
    var div = document.getElementById('flex-cat-gen');
    image.src = "http://thecatapi.com/api/images/get?format=src&type=gif&size=small";
    div.appendChild(image);
}

function rpsGame(choice){
    var choicename = choice.id;
    console.log(choicename);
    var computer = Math.floor(Math.random() * 10);
    console.log(computer);
    var computerchoice;
    var computerimage = document.createElement('img');
    computerimage.width = 150;
    computerimage.height = 150;
    if(computer < 4){
        computerimage.src = "https://thumbs.dreamstime.com/z/sticker-cartoon-rock-creative-150391514.jpg";
        computerchoice = 1;
    }
    if(computer >= 4 && computer < 8){
        computerimage.src = "https://thumbs.dreamstime.com/z/old-paper-23050622.jpg";
        computerchoice = 2;
    }
    if(computer > 7){
        computerimage.src = "https://thumbs.dreamstime.com/z/vintage-scissors-16202222.jpg";
        computerchoice = 3;
    }
    var choicenum;
    var image = document.createElement('img');
    image.width = 150;
    image.height = 150;
    switch(choicename){
        case "rock":{
            choicenum = 1;
            image.src = "https://thumbs.dreamstime.com/z/sticker-cartoon-rock-creative-150391514.jpg";
        }
        break;
        case "paper":{
            choicenum = 2;
            image.src = "https://thumbs.dreamstime.com/z/old-paper-23050622.jpg";
        }
        break;
        case "scissors": {
            choicenum = 3;
            image.src = "https://thumbs.dreamstime.com/z/vintage-scissors-16202222.jpg";
        }
        break;
    }

    var outcome = (rps(choicenum, computerchoice));
    for(let i = 0; i < 6; i++){
    document.getElementById('flex-box-rps-div').firstChild.remove();
    }
    
    document.getElementById('flex-box-rps-div').style.fontSize = "90px";


    document.getElementById('flex-box-rps-div').appendChild(image);
    document.getElementById('flex-box-rps-div').appendChild(document.createTextNode(outcome));
    document.getElementById('flex-box-rps-div').appendChild(computerimage);
}

function rps(choice, opponentchoice){
    if(choice == opponentchoice){
        return "It's a Tie!";
    }
    if(choice == 1){
        if(opponentchoice == 2){
            return "You Lose!";
        }
        else{
            return "You Win!";
        }
    }
    else if(choice == 2){
        if(opponentchoice == 1){
            return "You Win!";
        }
        else{
            return "You lose!";
        }
    }
    else{
        if(opponentchoice == 1){
            return "You lose!";
        }
        else{
            return "You win!";
        }
    }
}

var numgames;

let blackjackGame = {
    'you': {'scoreSpan' : '#your-blackjack-result', 'div': '#your-box', 'score': 0}, 
    'dealer': {'scoreSpan' : '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const CARDS = blackjackGame['cards'];

const hitSound = new Audio('/blackjack_assets/sounds/swish.m4a');

document.querySelector('#hit-button').addEventListener('click', blackjackHit);
document.querySelector('#deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#stand-button').addEventListener('click', blackjackStand);

function blackjackStand(){
    if(numgames == true){
    document.getElementById('backcard').remove();
    showCard(DEALER);
    if(DEALER.score == 21){
        document.getElementById("blackjack-result").innerHTML = "Dealer Blackjack! You lose!";
        var losses = parseInt(document.getElementById("losses").innerHTML);
        losses += 1;
        document.getElementById("losses").innerHTML = losses;
    }
    console.log(DEALER.score);
    check17();
    setTimeout(() => {
    if(DEALER.score > 21){
        document.getElementById("blackjack-result").innerHTML = "Dealer Busted! You win!";
        var wins = parseInt(document.getElementById("wins").innerHTML);
        wins += 1;
        document.getElementById("wins").innerHTML = wins;
    }
    else if(DEALER.score > YOU.score){
        document.getElementById("blackjack-result").innerHTML = "Dealer Wins! You Lose!";
        var losses = parseInt(document.getElementById("losses").innerHTML);
        losses += 1;
        document.getElementById("losses").innerHTML = losses;
    }
    else if(DEALER.score < YOU.score){
        document.getElementById("blackjack-result").innerHTML = "You Win! Dealer Loses!";
        var wins = parseInt(document.getElementById("wins").innerHTML);
        wins += 1;
        document.getElementById("wins").innerHTML = wins;
    }
    else{
        document.getElementById("blackjack-result").innerHTML = "It's a push!";
        var pushes = parseInt(document.getElementById("pushes").innerHTML);
        pushes += 1;
        document.getElementById("pushes").innerHTML = pushes;
    };
}, 1300);
    numgames = false;
    }
}


function check17(){
    if(DEALER.score < 17){
        setTimeout(() => { showCard(DEALER); }, 500);
        setTimeout(() => { check17(); }, 501);
    }
}

function blackjackHit(){
    let checkempty = document.querySelector('#your-box').querySelectorAll('img');
    if(checkempty.length !== 0 && YOU.score < 21){
        showCard(YOU);  
    }
    if(YOU.score > 21 && numgames == true){
        document.getElementById("blackjack-result").innerHTML = "Busted! You lose!";
        var losses = parseInt(document.getElementById("losses").innerHTML);
        losses += 1;
        document.getElementById("losses").innerHTML = losses;
        numgames = false;
    }
    if(YOU.score == 21){
        blackjackStand();
    }
}

function showCard(player){
    let cardImage = document.createElement('img');
    cardImage.src = chooseCard(player);
    document.querySelector(player['div']).appendChild(cardImage);
    hitSound.play();
}

function faceDown(){
    let cardImage = document.createElement('img');
    cardImage.src = '/blackjack_assets/images/gray_back.png';
    cardImage.id = 'backcard';
    document.querySelector(DEALER['div']).appendChild(cardImage);
    hitSound.play();
}

function chooseCard(player){
    let card = CARDS[Math.floor(Math.random() * 13)]
    sendScore(player, card);
    return `/PNG/${card}.png`
}

function sendScore(player, cardnum){
    //console.log(player);
    //console.log(player.score);
    if(isNaN(cardnum) == false) {
        let newnum = parseInt(cardnum);
        player.score += newnum;
    }
    else if(cardnum == 'A'){
    if(player.score > 11){
        player.score += 1;
    }
    else{
        player.score += 11;
    }
    }
    else{
        player.score += 10;
    }
    //console.log(player.score);
    if(player == YOU){
    document.getElementById("your-blackjack-result").innerHTML = player.score;
    }
    else{
    document.getElementById("dealer-blackjack-result").innerHTML = player.score;    
    }
}

function blackjackDeal() {
    document.getElementById("blackjack-result").innerHTML = "Let's Play!";
    numgames = true;
    YOU.score = 0;
    DEALER.score = 0;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    for(i=0; i < yourImages.length; i++){
        yourImages[i].remove();
    }
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    for(i=0; i < dealerImages.length; i++){
        dealerImages[i].remove();
    }

    showCard(YOU);
    setTimeout(() => { showCard(DEALER); }, 400);
    setTimeout(() => { showCard(YOU); }, 900);
    setTimeout(() => { faceDown(); }, 1400);
    setTimeout(() => { if(YOU.score == 21){
        document.getElementById("blackjack-result").innerHTML = "Blackjack! You win!";
        var wins = parseInt(document.getElementById("wins").innerHTML);
        wins += 1;
        document.getElementById("wins").innerHTML = wins;
        numgames = false;
    }; }, 1400);
}
