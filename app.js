var x=0;

function Player(options){
  this.name = options.name;
  this.pitch1 = options.pitch1;
  this.pitch2 = options.pitch2;
  this.bat = options.bat;

}

function Pitch(options){
  this.name = options.name;
  this.speed = options.speed;
  this.control = options.control;
}

var fastball = new Pitch({name: "Fastball", speed: "Fast", control: "Good"});
var curveball = new Pitch({name: "Curveball", speed: "Slow", control: "Poor"});
var changeup = new Pitch({name: "Changeup", speed: "Slow", control: "Good"});
var slider = new Pitch({name: "Slider", speed: "Fast", control: "Poor"});

function Bat(options){
  this.name = options.name;
  this.contact = options.contact;
  this.power = options.power;
}

var bigRedBat = new Bat({name: "Big Red Bat", contact: "Good", power: "Poor"});
var thinYellowBat = new Bat({name: "Thin Yellow Bat", contact: "Poor", power: "Good"});

var choices = {};
var oppChoices ={};
var player1 = new Player(choices);
var opponent = new Player(oppChoices);


var oppNames = ["Smitty", "Lars", "Terry", "Robin"];
var oppPitches = [fastball, curveball, changeup, slider];
var oppBats = [bigRedBat, thinYellowBat];

var setOpponent = function(){
 ///set opponent Name
  var nameChoice = Math.floor(Math.random()*4);
  switch (nameChoice){

    case 0:
    oppChoices.name = oppNames[0];
    break;

    case 1:
    oppChoices.name = oppNames[1];
    break;

    case 2:
    oppChoices.name = oppNames[2];
    break;

    case 3:
    oppChoices.name = oppNames[3];
    break;
  }

  //choose opponent Pitches
  var pitchChoice1 = Math.floor(Math.random()*4);
  switch (pitchChoice1){

    case 0:
    oppChoices.pitch1 = oppPitches[0];
    oppPitches.splice(0,1);
    break;

    case 1:
    oppChoices.pitch1 = oppPitches[1];
    oppPitches.splice(1,1);
    break;

    case 2:
    oppChoices.pitch1 = oppPitches[2];
    oppPitches.splice(2,1);
    break;

    case 3:
    oppChoices.pitch1 = oppPitches[3];
    oppPitches.splice(3,1);
    break;
  }

  //set pitch type 2. now only has 3 options so no repeats
  var pitchChoice2 =  Math.floor(Math.random()*3);
  switch (pitchChoice2){

    case 0:
    oppChoices.pitch2 = oppPitches[0];
    oppPitches.splice(0,1);
    break;

    case 1:
    oppChoices.pitch2 = oppPitches[1];
    oppPitches.splice(1,1);
    break;

    case 2:
    oppChoices.pitch2 = oppPitches[2];
    oppPitches.splice(2,1);
    break;
  }
  var batChoice = Math.floor(Math.random()*2);
  switch (batChoice){

    case 0:
    oppChoices.bat = oppBats[0];
    break;

    case 1:
    oppChoices.bat = oppBats[1];
    break;
  }
    opponent = new Player(oppChoices);
};




var playerBat = function(){
  var batOptions= [thinYellowBat, bigRedBat];
  $("#text-area").html("Choose Your Bat " +'<br/>'+'<br/>');
  _.each(batOptions, function(currVal, idx, arr){
    $('<button/>', {
      id: "proceed",
      text: currVal.name,
      click: function () {
              player1.bat = currVal;
              checkX(x);},
      hover: function(){
        $('#description').html("<b>Contact</b>: " + currVal.contact + " <b>Power</b>: " + currVal.power);
      }
              }).appendTo("#text-area");
  });

};

var playerName = function(){
  $("#text-area").html("What is your name? " +'<br/>'+'<br/>' +"<form><input type='text' name='playerName'></input></form>");
  $('form').on('submit', function(){
    event.preventDefault();
    player1.name = $('input').val();
    checkX(x);
  });
};

var playerPitches = function(){

  var pitchOptions =[fastball, changeup, curveball, slider];
  var pickPitch1 =function(){
  $("#text-area").html("Choose Your First Pitch " +'<br/>'+'<br/>');

  _.each(pitchOptions, function(currVal, idx, arr){
    $('<button/>', {
      id: "proceed",
      text: currVal.name,
      click: function () {
              player1.pitch1 = currVal;
              pitchOptions.splice(idx,1);
              pickPitch2();},
      hover: function(){
        $('#description').html("<b>Speed</b>: " + currVal.speed + " <b>Control</b>: " + currVal.control);
      }
              }).appendTo("#text-area");
  });
};

  var pickPitch2 = function(){

    $("#text-area").html("Choose your second and last Pitch " +'<br/>'+'<br/>');
    _.each(pitchOptions, function(currVal, idx, arr){
      $('<button/>', {
        id: "proceed",
        text: currVal.name,
        click: function () {
                player1.pitch2 = currVal;
                checkX(x);},
        hover: function(){
          $('#description').html("<b>Speed</b>: " + currVal.speed + " <b>Control</b>: " + currVal.control);
        }
                }).appendTo("#text-area");
    });
  };
  pickPitch1();
};

var describeOpponent = function(){
  $('#text-area').html("Hello, " + player1.name + "! You will be facing " + opponent.name + ", who wields a " + opponent.bat.name + " and throws a "+ opponent.pitch1.name + " and a " + opponent.pitch2.name + ". Prepare for Glory!");
  $('#description').html('');
};

var checkX = function(z){

  switch(z){
    case 0:
      setOpponent();
      x++;
      checkX(x);
      break;
    case 1:
      playerName();
      x++;
      break;
    case 2:
      playerBat();
      x++;
      break;
    case 3:
      playerPitches();
      x++;
      break;
    case 4:
      describeOpponent();
      x++;
      break;
    }


  };
  $(document).ready(function(){
    checkX(x);
  });
