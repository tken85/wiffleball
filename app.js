// note: method of putting elements to the DOM, button navigation of game and using checkX to run through functions in order was previously used when making http://game.mymesstheirkitchen.com/

(function() {
  'use strict';


//variable x is checked frequently to run functions in the correct order

var x=0;
var pitchInfo = {};
var outs = 0;
var balls = 0;
var strikes = 0;
var baseRunners = [{position: 0}, {position: 0}, {position: 0}];


// move position of runners and see if runs are scored
var baseRunnerReset = function(){
  baseRunners = [{position: 0}, {position: 0}, {position: 0}];
};

var updateBaseDisplay = function(){
  if(baseRunners[0].position > 0){
    $('#first').html("Runner On");
  }
  else{
    $('#first').html("");
  }
  if(baseRunners[1].position > 0){
    $('#second').html("Runner On");
  }
  else{
    $('#second').html("");
  }
  if(baseRunners[2].position > 0){
    $('#third').html("Runner On");
  }
  else{
    $('#third').html("");
  }
};

var moveRunners = function(batter, hitType){
  var third = baseRunners[2];
  var second = baseRunners[1];
  var first= baseRunners[0];
  var totalRuns = 0;
  if(hitType === "Single"){
    if(third.position > 0 ){
      batter.runs++;
      totalRuns++;
      $('#text-area').append("One Run Scored." +'<br>' +'<br>');
    }
    updateOpponentScore();
    updatePlayerScore();
    baseRunners.pop();
    baseRunners.unshift({position: 1});
    updateBaseDisplay();
  }
  else if(hitType === "Double"){
    if(third.position > 0){
      batter.runs++;
      totalRuns++;
    }
    if(second.position > 0){
      batter.runs++;
      totalRuns++;
    }
    updateOpponentScore();
    updatePlayerScore();
    $('#text-area').append(totalRuns +" run(s) Scored." +'<br>' +'<br>');
    baseRunners.pop();
    baseRunners.pop();
    baseRunners.unshift({position: 2});
    baseRunners.unshift({position: 0});
    updateBaseDisplay();
  }
  else if(hitType === "Triple"){
    if(third.position > 0){
      batter.runs++;
      totalRuns++;
    }
    if(second.position > 0){
      batter.runs++;
      totalRuns++;
    }
    if(first.position > 0){
      batter.runs++;
      totalRuns++;
    }
    updateOpponentScore();
    updatePlayerScore();
    $('#text-area').append(totalRuns +" run(s) Scored." +'<br>' +'<br>');
    baseRunners.pop();
    baseRunners.pop();
    baseRunners.pop();
    baseRunners.unshift({position: 3});
    baseRunners.unshift({position: 0});
    baseRunners.unshift({position: 0});
    updateBaseDisplay();
  }
  else if (hitType === "Home Run"){
    batter.runs++;
    totalRuns++;
    if(third.position > 0){
      batter.runs++;
      totalRuns++;
    }
    if(second.position > 0){
      batter.runs++;
      totalRuns++;
    }
    if(first.position > 0){
      batter.runs++;
      totalRuns++;
    }
    updateOpponentScore();
    updatePlayerScore();
    $('#text-area').append(totalRuns +" run(s) Scored." +'<br>' +'<br>');
    baseRunnerReset();
    updateBaseDisplay();
  }
};

//create player class

function Player(options){
  this.name = options.name;
  this.pitches = [options.pitch1, options.pitch2];
  //this.pitch1 = options.pitch1;
  //this.pitch2 = options.pitch2;
  this.bat = options.bat;
  this.status = options.status;
  this.runs = 0;
  this.pitch = function(pitchType, location){
    var pitchPower = Math.random();
    var strikeChance = 0;
    pitchInfo.location = location;
    pitchInfo.speed = pitchType.speed;
    if(pitchType.control === "Good"){
    strikeChance = Math.random()*1.5;
    }
    else{
      strikeChance = Math.random();
    }

    if(strikeChance <= 0.5){
      pitchInfo.noSwing ="Ball";
    }
    else{
      pitchInfo.noSwing = "Strike";
    }
    if (pitchType.deception ==="Good"){
      pitchPower *= 1.5;
    }
    pitchInfo.power = pitchPower;
  };
  this.hit = function(timing, location, bat, pitchInfo){
      var contactChance = Math.random();
      var distance = Math.random();
      var contactMade = false;

      // change chance of contact based on pitch type and swing type
      if (bat.contact ==="Good"){
        contactChance *= 1.1;
      }
      else{
        contactChance *= 0.9;
      }
      if((timing ==="Early" && pitchInfo.speed === "Fast") || (timing === "Late" && pitchInfo.speed ==="Slow")){
        contactChance *= 1.1;
      }
      else{
        contactChance *= 0.9;
      }
      if(location === pitchInfo.location){
        contactChance *= 1.1;
      }
      else{
        contactChance *= 0.9;
      }

      // determine if contact was made or missed
      if((pitchInfo.power - contactChance) < 0.2){
        $('#text-area').html("Contact made. ");
        contactMade = true;
      }
      else{
        $('#text-area').html("STTTTTRRRRIIIKKKEE"+'<br>'+'<br>');
        strikes++;
        updateStrikes();
        checkStrikes();

      }

      //determine distance hit and thus type of hit
      if(contactMade){
        if(bat.power==="Good"){
          distance *=1.2;
        }
        if(distance < 0.25){
          $('#text-area').append("Grounded out weakly to the pitcher" +'<br>' +'<br>');
          outs++;
          updateOuts();
          checkOuts();

        }
        else if(distance >=0.25 && distance <0.7){
          $('#text-area').append("Slapped a Single" +'<br>' +'<br>');
          balls = 0;
          strikes = 0 ;
          updateBalls();
          updateStrikes();
          moveRunners(whoHitting(), "Single");
          $('<button/>', {
            text: "Next Pitch",
            click: function () {
              whoPitching();},
                    }).appendTo("#text-area");

        }
        else if (distance >= 0.7 && distance < 0.9){
          $('#text-area').append("Smacked a double" +'<br>' +'<br>');
          balls = 0;
          strikes = 0 ;
          updateBalls();
          updateStrikes();
          moveRunners(whoHitting(), "Double");
          $('<button/>', {
            text: "Next Pitch",
            click: function () {
              whoPitching();},
                    }).appendTo("#text-area");

        }
        else if (distance >=0.9 && distance < 1){
          $('#text-area').append("Hit the gap and got a triple" +'<br>' +'<br>');
          balls = 0;
          strikes = 0 ;
          updateBalls();
          updateStrikes();
          moveRunners(whoHitting(), "Triple");
          $('<button/>', {
            text: "Next Pitch",
            click: function () {
              whoPitching();},
                    }).appendTo("#text-area");

        }
        else{
          $('#text-area').append("Crushed a homer." +'<br>' +'<br>');
          balls = 0;
          strikes = 0 ;
          updateBalls();
          updateStrikes();
          moveRunners(whoHitting(), "Home Run");
          $('<button/>', {
            text: "Next Pitch",
            click: function () {
              whoPitching();},
                    }).appendTo("#text-area");

        }
      }
  };

}

function Pitch(options){
  this.name = options.name;
  this.speed = options.speed;
  this.control = options.control;
  this.deception = options.deception;
}

var fastball = new Pitch({name: "Fastball", speed: "Fast", control: "Good", deception: "Poor"});
var curveball = new Pitch({name: "Curveball", speed: "Slow", control: "Poor", deception: "Good"});
var changeup = new Pitch({name: "Changeup", speed: "Slow", control: "Good", deception: "Poor"});
var slider = new Pitch({name: "Slider", speed: "Fast", control: "Poor", deception: "Good"});

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
      text: currVal.name,
      click: function () {
              player1.bat = currVal;
              checkX(x);},
      mouseenter: function(){
        $('#description').html("<b>Contact</b>: " + currVal.contact + " <b>Power</b>: " + currVal.power);
      },
      mouseleave: function(){
        $('#description').html("");
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
      text: currVal.name,
      click: function () {
              player1.pitches[0] = currVal;
              pitchOptions.splice(idx,1);
              pickPitch2();},
      mouseenter: function(){
              $('#description').html("<b>Speed</b>: " + currVal.speed + " <b>Control</b>: " + currVal.control+ "  <b>Deception</b>: " + currVal.deception);
              },
      mouseleave: function(){
              $('#description').html("");
              }
              }).appendTo("#text-area");
  });
};

  var pickPitch2 = function(){

    $("#text-area").html("Choose your second and last Pitch " +'<br/>'+'<br/>');
    _.each(pitchOptions, function(currVal, idx, arr){
      $('<button/>', {
        text: currVal.name,
        click: function () {
                player1.pitches[1] = currVal;
                checkX(x);},
        mouseenter: function(){
                $('#description').html("<b>Speed</b>: " + currVal.speed + " <b>Control</b>: " + currVal.control+ "  <b>Deception</b>: " + currVal.deception);
                },
        mouseleave: function(){
                $('#description').html("");
                }
                }).appendTo("#text-area");
    });
  };
  pickPitch1();
};

var describeOpponent = function(){
  $('#text-area').html("Hello, " + player1.name + "! You will be facing " + opponent.name + ", who wields a " + opponent.bat.name + " and throws a "+ opponent.pitches[0].name + " and a " + opponent.pitches[1].name + ". Prepare for Glory!" +'<br>'+'<br>');
  $('#description').html('');
  $('<button/>', {
    text: "Proceed",
    click: function () {
      checkX(x);},
            }).appendTo("#text-area");

};

var playerPitching = function(){
  var pitchSelected = "";
  var locationSelected = "";

  var thrownPitch = function(){
  $('#text-area').html("You're pitching, " + player1.name + ". Select a pitch" +'<br>'+'<br>');

  _.each(player1.pitches, function(currVal, idx, arr){
    $('<button/>', {
      text: currVal.name,
      click: function () {
              pitchSelected = currVal;
              thrownLocation();
              $('#description').html("");},
      mouseenter: function(){
              $('#description').html("<b>Speed</b>: " + currVal.speed + " <b>Control</b>: " + currVal.control+ "  <b>Deception</b>: " + currVal.deception);
                },
      mouseleave: function(){
              $('#description').html("");
              }
              }).appendTo("#text-area");
  });


};

  var thrownLocation = function(){
    $('#text-area').html("Where would you like to throw it?" +'<br>'+'<br>');

    $('<button/>', {
      text: "High",
      click: function () {
        locationSelected = "High";
        player1.pitch(pitchSelected, locationSelected);
        opponentHitting();},
              }).appendTo("#text-area");

      $('<button/>', {
          text: "Low",
          click: function () {
                locationSelected = "Low";
                player1.pitch(pitchSelected, locationSelected);
                opponentHitting();},
                }).appendTo("#text-area");
  };
  thrownPitch();
};

var opponentPitching = function(){
  var pitchSelected = "";
  var locationSelected = "";
  var pitchSelector = Math.random();
  //set opponent Pitch
  if(pitchSelector < 0.5){
    pitchSelected = opponent.pitches[0];
  }
  else{
    pitchSelected = opponent.pitches[1];
  }
  var locationSelector = Math.random();
  if (locationSelector < 0.5){
    locationSelected = "Low";
  }
  else{
    locationSelected = "High";
  }

  opponent.pitch(pitchSelected, locationSelected);
  playerHitting();
};

var playerHitting = function(){
  var swings = "";
  var swingTiming = "";
  var swingLocation = "";

  var setSwing = function(){
    $('#text-area').html("The pitch is on its way. Do you swing at the pitch?" +'<br>'+'<br>');

    $('<button/>', {
      text: "Yes",
      click: function () {
        swings=true;
        setTiming();},
              }).appendTo("#text-area");

      $('<button/>', {
          text: "No",
          click: function () {
                swings = false;
                noSwing();
                },
                }).appendTo("#text-area");

  };
  var noSwing = function(){
    if(pitchInfo.noSwing ==="Ball"){
      balls++;
      $('#balls').html(balls);
      $('#text-area').html("The batter takes the pitch for a ball" +'<br>'+'<br>');
      checkBalls();
    }
    else{
      strikes++;
      $('#strikes').html(strikes);
      $('#text-area').html("The batter is frozen by the pitch for a strike" +'<br>'+'<br>');
      checkStrikes();
    }
  };
  var setTiming = function(){
    $('#text-area').html("The pitch is moving " +pitchInfo.speed + ". How do you time your swing?" +'<br>'+'<br>');

    $('<button/>', {
      text: "Early",
      click: function () {
            swingTiming = "Early";
            setLocation();},
              }).appendTo("#text-area");

      $('<button/>', {
          text: "Late",
          click: function () {
                swingTiming = "Late";
                setLocation();},
                }).appendTo("#text-area");

  };

  var setLocation = function(){
    $('#text-area').html("Do you swing high or low?" +'<br>'+'<br>');

    $('<button/>', {
      text: "High",
      click: function () {
            swingLocation = "High";
            player1.hit(swingTiming, swingLocation, player1.bat, pitchInfo);
            },
              }).appendTo("#text-area");

      $('<button/>', {
          text: "Low",
          click: function () {
                swingLocation = "Low";
                player1.hit(swingTiming, swingLocation, player1.bat, pitchInfo);
                },
                }).appendTo("#text-area");
  };
    setSwing();
};

var opponentHitting = function(){
  var swings = Math.random();
  var timing = Math.random();
  var swingLocation = "";
  var swingTiming = "";
  //for batter taking the pitch
  if(swings<0.25){
    if(pitchInfo.noSwing ==="Ball"){
      balls++;
      $('#balls').html(balls);
      $('#text-area').html("The batter takes the pitch for a ball"+'<br>'+'<br>');
      checkBalls();
    }
    else{
      strikes++;
      $('#strikes').html(strikes);
      $('#text-area').html("The batter is frozen by your pitch for a strike"+'<br>'+'<br>');
      checkStrikes();
    }

  }
  else{
    var highOrLow = Math.random();
    if(highOrLow < 0.5){
      swingLocation = "Low";
    }
    else{
      swingLocation = "High";
    }
    if(timing < 0.5){
      swingTiming = "Early";
    }
    else{
      swingTiming = "Late";
    }
    opponent.hit(swingTiming, swingLocation, opponent.bat, pitchInfo);
}
};
var updateStrikes = function(){
  $('#strikes').html(strikes);
};
updateStrikes();

var updateBalls = function(){
  $('#balls').html(balls);
};
updateBalls();

var updateOuts = function(){
  $('#outs').html(outs);
};
updateOuts();

var updateBatter = function(batter){
  $('#batter').html(batter.name);
};

var updatePitcher = function(pitcher){
  $('#pitcher').html(pitcher.name);
};
var updateOpponentScore = function(){
  $('#opponentScore').html(opponent.runs);
};

var updatePlayerScore = function(){
  $('#playerScore').html(player1.runs);
};

var checkStrikes = function(){
  if(strikes === 3){
    $("<h1> Batter strikes out!</h1>").appendTo("#text-area");
    outs++;
    strikes = 0;
    balls = 0;
    updateOuts();
    updateStrikes();
    checkOuts();
  }
  else{
    $('<button/>', {
      text: "Next Pitch",
      click: function () {
        whoPitching();},
              }).appendTo("#text-area");
  }
};

var checkBalls = function(){
  if(balls === 4){
    $("<h1> Batter Walks.</h1>").appendTo("#text-area");
    balls = 0;
    strikes = 0;
    updateBalls();
    updateStrikes();
  }
  $('<button/>', {
    text: "Next Pitch",
    click: function () {
      whoPitching();},
            }).appendTo("#text-area");
};

var checkOuts = function(){
  if(outs === 3){
  $("<h1> Side retired.</h1>").appendTo("#text-area");
    outs = 0;
    strikes = 0;
    balls = 0;
    baseRunnerReset();
    updateOuts();
    updateStrikes();
    updateBalls();
    updateBaseDisplay();
    if(x <7){
    $('<button/>', {
      text: "Switch Sides",
      click: function () {
        checkX(x);},
              }).appendTo("#text-area");
  }
  else{
    strikes = 0;
    balls = 0;
    updateStrikes();
    updateBalls();
    $('<button/>', {
      text: "Shake Hands and say 'good game'.",
      click: function () {
        checkX(x);},
              }).appendTo("#text-area");
  }
}
  else{
    $('<button/>', {
      text: "Next Pitch",
      click: function () {
        whoPitching();},
              }).appendTo("#text-area");
  }
};

var whoPitching = function(){
  if(player1.status === "Pitching"){
    playerPitching();
  }
  else{
    opponentPitching();
  }
};

var whoHitting = function(){
  if(player1.status ==="Hitting")
  {
    return player1;
  }
  else{
    return opponent;
  }
};

var halfInning = function(pitcher, batter){
  if(pitcher === player1){
    playerPitching();
  }
  else{
  opponentPitching();
  }
};

var winOrLose = function(){
  if(player1.runs > opponent.runs){
    $('#text-area').html("Congrats, "+ player1.name + ". You beat " + opponent.name + " by a score of "+player1.runs + "-" + opponent.runs);
  }
  else if(opponent.runs > player1.runs){
    $('#text-area').html("Sorry, "+ player1.name + ", but you got destroyed by " + opponent.name + " by a score of "+opponent.runs + "-" + player1.runs + ". Maybe try practicing next time.");
  }
  else{
    $('#text-area').html("You tied. How disappointing...");
  }

};

//script of events to run in order

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
      $('#opponentName').html(opponent.name + ": ");
      $('#playerName').html(player1.name + ": ");
      $('#opponentScore').html(opponent.runs);
      $('#playerScore').html(player1.runs);
      x++;
      break;
    case 5:
      opponent.status = "Hitting";
      player1.status = "Pitching";
      updateBatter(opponent);
      updatePitcher(player1);
      halfInning(player1, opponent);
      x++;
      break;
    case 6:
      opponent.status = "Pitching";
      player1.status = "Hitting";
      updateBatter(player1);
      updatePitcher(opponent);
      halfInning(opponent, player1);
      x++;
      break;
    case 7:
      winOrLose();

    }

  };
  $(document).ready(function(){
    checkX(x);
  });
}());
