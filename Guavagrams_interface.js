
//Global vars
var moment = require("./../bower_components/moment/moment.js"); //require moment for the timer
var currentTime = moment().minute(20).second($counter--).format('mm : ss');
var scoreTime = moment().minute(0).second(scoreCounter++).format('mm : ss');
var $counter = 0;
var scoreCounter = 0;
var updateInterval;

var boardLogic = require("./../js/boardLogic.js").boardLogic; //require the business logic
var boardLogic = new boardLogic();

var clickedTile = null;
var dumpCounter = 0;
var testArrayRows = [];
var testArrayCols = [];
var testArrayAll = [];
var newLetter;

$(document).ready(function(){
  //Game Start----Display the board, hand and timer
  $('#run').click(function(){
    $('.intro-screen').hide();
    $('.gameBoard').slideDown();
    $('.handDisplay').slideDown();
    $('#run').hide();
    var newHand = boardLogic.dealHand();
    for(var j = 0; j < 31; j++){
      $('#handLetter'+j).html(newHand[j]);
    }

    //setup params for 'drag and drop'

    //Tile params
    $('.gameTile').draggable({
      snap: '.boardTile',
      snapMode: 'inner',
      revert: 'invalid'
    });

    //board space params
    $('.boardTile').droppable({
      scroll: true,
      accept: ".gameTile",
      hoverClass: 'drop-hover',
      tolerance: 'fit',
      drop: function(event, ui){
        $.playSound('sounds/snap');
        $(this).text(ui.draggable[0].innerText);
        $(this).droppable('option', 'accept', ui.draggable);
      },
      out: function(event, ui){
        $(this).empty();
        $(this).droppable('option', 'accept', '.gameTile');
      }
    });

    //Dump area logic
    $('.dump').droppable({
      accept: ".gameTile",
      tolerance: "intersect",
      drop: function(event, ui){
        if (dumpCounter < 2) {
          $(ui.draggable).addClass('invisible');
          dumpCounter++;
          newLetter = boardLogic.letterGenerator();
          $('#handRow4').append("<span id='newTile" + dumpCounter + "' class='gameTile col-xs-1'>" + newLetter + "</span>");
          $('.gameTile').draggable({
            snap: '.boardTile',
            snapMode: 'inner',
            revert: 'invalid'
          });
        } else if (dumpCounter === 2){
          $(ui.draggable).addClass('invisible');
          newLetter = boardLogic.letterGenerator();
          $('#handRow4').append("<span id='newTile" + dumpCounter + "' class='gameTile col-xs-1'>" + newLetter + "</span>");
          $('.gameTile').draggable({
            snap: '.boardTile',
            snapMode: 'inner',
            revert: 'invalid'
          });
          $('.dump').hide();
        }
      }
    });
  }); //run

  //Clock
  $("#timer").hide();
  var update = function(htmlElement) {
    currentTime = moment().minute(1).second($counter--).format('mm : ss');
    scoreTime = moment().minute(0).second(scoreCounter++).format('mm : ss');
    htmlElement.text(currentTime);
    if (currentTime === "00 : 00") {
      $(".hard-wrapper").html('<h3 id="title">You lost! Try again.</h3><a id="restart-button" class="btn btn-info" href="/">New Game</a>');
      $('#end-screen').slideDown();
    }
  };
  update($("time"));
  $("#run").click(function() {
    $("#timer").show();
    updateInterval = setInterval(update, 1000, $("time"));
    $("#stop").click(function() {
      clearInterval(updateInterval);
      $("#stop").hide();
      $(".gameBoard").slideUp();
      $(".handDisplay").slideUp();
      $("#start").show();
    });
    $("#start").click(function() {
      updateInterval = setInterval(update, 1000, $("time"));
      $("#stop").show();
      $(".gameBoard").slideDown();
      $(".handDisplay").slideDown();
      $("#start").hide();
    });
  });

  // Submit Board
  $('#submit').click(function(){
    testArrayAll = [];
    testArrayRows = [];
    testArrayCols = [];
    var notWordArray = [];

    //passing all rows into the business logic array to be tested and filtered for spaces
    for (var xx=1; xx<=400; xx++){
      boardLogic.masterRowArray.push($('#' + xx).text());
    }

    //passing all columns into the business logic array to be tested and filtered for spaces
    for (var yy=1; yy<=20; yy++){
      for (var zz=1; zz<=20; zz++){
        boardLogic.masterColArray.push($('.row'+ zz + ' .col' + yy).text());
      }
    }
    var lettersConnected = boardLogic.lettersConnected();
    var testArrayRows = boardLogic.checkArrayRows();
    var testArrayCols = boardLogic.columnsToRows();
    var lettersUsed = boardLogic.checkLetters(testArrayCols);
    var testArrayAll = testArrayRows.concat(testArrayCols);
    var enteredWord = '';

//test to see that letters are connected and all letters are used
    if (lettersConnected && lettersUsed) {
      $.get("./../../SOWPODS.txt").then(function(response) {
        var dict = response.split("\n");
        for(var i = 0; i < testArrayAll.length; i++){
          if(testArrayAll[i].length > 1){
            enteredWord = testArrayAll[i];
            if( dict.indexOf(enteredWord) === -1 ){
              notWordArray.push(enteredWord);
            }
          }
        }
        // If the list of non-word items is 0 the game is won
        if (notWordArray.length === 0) {
          clearInterval(updateInterval);
          $('#finalTime').append(scoreTime);
          $('.gameBoard').slideUp();
          $('.handDisplay').slideUp();
          $("#timer").slideUp();
          // $("#end-screen").append('<iframe src="//coub.com/embed/409y8?muted=false&autostart=true&originalSize=false&startWithHD=true" allowfullscreen="true" frameborder="0" width="640" height="360"></iframe>');
          $('#end-screen').append('<h3 id="title">Congratulations!</h3><h3 id="timeh3">Your Time Was: <span id="finalTime"></span></h3>')
          $('#end-screen').slideDown();
          // win condition
        } else {
          alert('Sorry, one of your entries isn\'t a word!');
        }
      });

    } else {
      alert("You must use all of your letters make sure your words are all connected.");
    }
  });
}); //ready
