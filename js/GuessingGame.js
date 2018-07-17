var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}


function newGame() {
  var newG = new Game();
    return newG;
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if(Number.isNaN(guess) || guess < 1 || guess > 100) {
        return "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        this.pastGuesses.push(this.playersGuess);
          $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').css('font-family', 'amatic').text("Press the Reset button to play again!")
        return 'You Win! Kowabunga!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit, #player-input').prop("disabled",true);
                $('#subtitle').css('font-family', 'amatic').text(`Press Reset to play again!`);
                return 'Oh no... You lost! The winning number was ' + this.winningNumber;
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').css('font-family','snowtt').text("GUESS HIGHER!")
                } else {
                    $('#subtitle').css('font-family', 'flame').text("GUESS LOWER!")
                }
                if(diff < 10) return 'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

function shuffle(arr) {
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}


Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is ' +hints[0]+ ', '+hints[1]+', or '+hints[2]);
        $('#hint').prop("disabled", true);
    });

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100');
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
})
