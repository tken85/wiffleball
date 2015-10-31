// note: method of putting elements to the DOM, button navigation of game and using checkX to run through functions in order was previously used when making http://game.mymesstheirkitchen.com/

// can you refactor object look ups from if statements

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

var baseUpdates = function(){
  updateBaseDisplay();
  updateOpponentScore();
  updatePlayerScore();
};

var moveRunners = function(batter, hitType){
  var third = baseRunners[2];
  var second = baseRunners[1];
  var first= baseRunners[0];
  var totalRuns = 0;
  if(hitType ==="Walk"){
    if(first.position > 0){
      if(second.position>0){
        if(third.position>0){
          batter.runs++;
          totalRuns++;
          baseRunners.pop();
          baseRunners.unshift({position:1});
          baseUpdates();
        }
        else{
          third.position = 1;
          updateBaseDisplay();
        }
      }
      else{
        second.position = 1;
        updateBaseDisplay();
      }
    }
    else{
      baseRunners.shift();
      baseRunners.unshift({position:1});
      updateBaseDisplay();
    }
  }
  if(hitType === "Single"){
    if(third.position > 0 ){
      batter.runs++;
      totalRuns++;
      $('#text-area').append("One Run Scored." +'<br>' +'<br>');
    }

    baseRunners.pop();
    baseRunners.unshift({position: 1});
    baseUpdates();
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

    $('#text-area').append(totalRuns +" run(s) Scored." +'<br>' +'<br>');
    baseRunners.pop();
    baseRunners.pop();
    baseRunners.unshift({position: 2});
    baseRunners.unshift({position: 0});
    baseUpdates();
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
    $('#text-area').append(totalRuns +" run(s) Scored." +'<br>' +'<br>');
    baseRunners.pop();
    baseRunners.pop();
    baseRunners.pop();
    baseRunners.unshift({position: 3});
    baseRunners.unshift({position: 0});
    baseRunners.unshift({position: 0});
    baseUpdates();
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

    $('#text-area').append(totalRuns +" run(s) Scored." +'<br>' +'<br>');
    baseRunnerReset();
    baseUpdates();
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
  this.hits = 0;
  this.strikeouts = 0;
  this.pitch = function(pitchType, location){
    var pitchPower = Math.random();
    var strikeChance = 0;
    pitchType.mph();
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
          this.hits++;
          $('span').removeClass('ballOn');
          $('span').removeClass('strikeOn');
          moveRunners(whoHitting(), "Single");
          $('<button/>', {
            class: "btn btn-default btn-sm",
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
          this.hits++;
          $('span').removeClass('ballOn');
          $('span').removeClass('strikeOn');
          moveRunners(whoHitting(), "Double");
          $('<button/>', {
            class: "btn btn-default btn-sm",
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
          this.hits++;
          $('span').removeClass('ballOn');
          $('span').removeClass('strikeOn');
          moveRunners(whoHitting(), "Triple");
          $('<button/>', {
            class: "btn btn-default btn-sm",
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
          this.hits++;
          $('span').removeClass('ballOn');
          $('span').removeClass('strikeOn');
          moveRunners(whoHitting(), "Home Run");
          $('<button/>', {
            class: "btn btn-default btn-sm",
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
  this.horizontalMovement = options.horizontalMovement;
  this.verticalMovement = options.verticalMovement;
  this.duration = options.duration;
  this.mph = function(){
    var speed = 0;
    if(this.speed === "Fast"){
      speed = 90+(Math.random()*10);
    }
    else{
      speed = 70+(Math.random()*10);
    }
    pitchInfo.mph = speed.toFixed(0);
    $('#mph').html(speed.toFixed(0) + " MPH");
    return speed;

  };
}

var fastball = new Pitch({name: "Fastball", speed: "Fast", control: "Good", deception: "Poor", horizontalMovement: 5, verticalMovement: 5, duration: 1200});
var curveball = new Pitch({name: "Curveball", speed: "Slow", control: "Poor", deception: "Good", horizontalMovement: 60, verticalMovement: 80, duration: 1500});
var changeup = new Pitch({name: "Changeup", speed: "Slow", control: "Good", deception: "Poor", horizontalMovement: 10, verticalMovement: 20, duration: 1500});
var slider = new Pitch({name: "Slider", speed: "Fast", control: "Poor", deception: "Good", horizontalMovement: 120, verticalMovement: 20, duration: 1200});

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

function PowerUp(options){
  this.name = options.name;
  this.type = options.type;

}

var superPitch = new PowerUp({name: "Super Pitch", type: "Pitching"});
var superBat = new PowerUp({name: "Super Bat", type: "Batting"});

var oppNames = ["Steffan", "Lars", "Terry", "Robin"];
var oppPitches = [fastball, curveball, changeup, slider];
var oppBats = [bigRedBat, thinYellowBat];

var setOpponent = function(){
 ///set opponent Name
  var nameChoice = Math.floor(Math.random()*oppNames.length);
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
  var pitchChoice1 = Math.floor(Math.random()*oppPitches.length);
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
  var pitchChoice2 =  Math.floor(Math.random()*(oppPitches.length-1));
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
  var batChoice = Math.floor(Math.random()*oppBats.length);
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
      class: "btn btn-default btn-sm",
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
      class: "btn btn-default btn-sm",
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
        class: "btn btn-default btn-sm",
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
    class: "btn btn-default btn-sm",
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
  resetBall();
  _.each(player1.pitches, function(currVal, idx, arr){
    $('<button/>', {
      class: "btn btn-default btn-sm",
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
    $('#text-area').html("Select where you would like to throw it. Then stop the meter in the green zone for maximum pitch power." +'<br>'+'<br>');
    $('#marker').css('left','0px');

    $('#topBox').on('click', function(){
        locationSelected = "High";
        $('#topBox').unbind('click');
        $('#bottomBox').unbind('click');
        meterRun();
      });
    $('#bottomBox').on('click',function(){
      locationSelected = "Low";
      $('#topBox').unbind('click');
      $('#bottomBox').unbind('click');
      meterRun();
    });
  };

  var meterRun = function(){
    $('#marker').animate({left: "+180px"}, 1200);
    setBall(75, locationSelected);
    var horMovement = $('#wiffleBall').position().left + pitchSelected.horizontalMovement;
    var vertMovement = $('#wiffleBall').position().top + pitchSelected.verticalMovement;
    $('#topBox, #bottomBox').on('click', function(){
      $('#marker').stop();
      $('#topBox').unbind('click');
      $('#bottomBox').unbind('click');
      if($('#marker').position().left >=120 && $('#marker').position().left <= 150){
        console.log("perfect pitch");
        player1.pitch(pitchSelected, locationSelected);
        moveBall(horMovement, vertMovement, pitchSelected.duration);
        opponentHitting();
      }
      else{
        console.log("bad pitch");
        player1.pitch(pitchSelected, locationSelected);
        moveBall(horMovement, vertMovement, pitchSelected.duration);
        opponentHitting();
      }
    });
  };
  thrownPitch();
};
//Thanks to Joshua at stackOverflow for showing how to chain animations with queue: false. http://stackoverflow.com/questions/1251300/how-to-run-two-jquery-animations-simultaneously
var setBall = function(horizontal, vertical){
  var horRand = horizontal + Math.floor(Math.random()*70);
  var vertRand;
  $('#wiffleBall').css('left', horRand);
  if(vertical === "High"){
    vertRand = 50 + Math.floor(Math.random()*50);
    $('#wiffleBall').css('top', vertRand);
  }
  else{
    vertRand = 150 + Math.floor(Math.random()*50);
    $('#wiffleBall').css('top', vertRand);
  }
};
var moveBall = function(horizontal, vertical, speed){
  $('#wiffleBall').animate({left: horizontal}, {duration: speed, queue: false});
  $('#wiffleBall').animate({top: vertical}, {duration: speed, queue: false});
  $('#wiffleBall').animate({fontSize: "32px"}, {duration: speed, queue: false});
};

var resetBall = function(){
  $('#wiffleBall').css('left', '0px');
  $('#wiffleBall').css('top', '0px');
  $('#wiffleBall').css('font-size', '0px');
};

var opponentPitching = function(){
  resetBall();
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
  setBall(75, locationSelected);
  var horMovement = $('#wiffleBall').position().left + pitchSelected.horizontalMovement;
  var vertMovement = $('#wiffleBall').position().top + pitchSelected.verticalMovement;
  moveBall(horMovement, vertMovement, pitchSelected.duration);
  opponent.pitch(pitchSelected, locationSelected);
  playerHitting();
};

var playerHitting = function(){
  var swings;
  var swingTiming = "";
  var swingLocation = "";

  var setSwing = function(){
    $('#text-area').html("The pitch is on its way at "+pitchInfo.mph + " MPH. Time and locate your swing by clicking in the box. Waiting 2s will result in no swing." +'<br>'+'<br>');

  var noSwing = function(){
    $('#topBox').unbind('click');
    $('#bottomBox').unbind('click');
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

  //special thanks to Jonathan Fingland on Stackoverflow for the suggestion on timing events http://stackoverflow.com/questions/1038677/how-can-i-measure-the-time-between-click-and-release-in-javascript

  function swingFunction(){
  swings = setTimeout(noSwing, 2000);
  }
  swingFunction();

    var startTime;
    var endTime;
    function start(){
      startTime = new Date();
    }
    function end(){
      endTime = new Date();
    }
    function totalTime(){
       return endTime-startTime;
    }

    start();
    $('#topBox').on('click', function(){
      clearTimeout(swings);
      swingLocation = "High";
      end();
      $('#topBox').unbind('click');
      $('#bottomBox').unbind('click');
      if(totalTime()<1000){
        swingTiming = "Early";
      }
      else{
        swingTiming = "Late";
      }
      console.log(endTime-startTime);
      console.log(swingTiming);
      player1.hit(swingTiming,swingLocation, player1.bat, pitchInfo);

    });
    $('#bottomBox').on('click', function(){
      clearTimeout(swings);
      swingLocation = "Low";
      end();
      $('#topBox').unbind('click');
      $('#bottomBox').unbind('click');
      if(totalTime()<1000){
        swingTiming = "Early";
      }
      else{
        swingTiming = "Late";
      }
      console.log(endTime-startTime);
      console.log(swingTiming);
      player1.hit(swingTiming,swingLocation, player1.bat, pitchInfo);

    });

  };
    setSwing();
};

var opponentHitting = function(){
  var swings = Math.random();
  var timing = Math.random();
  var swingLocation = "";
  var swingTiming = "";
  //for batter taking the pitch
  if(swings<0.33){
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
    $('span').removeClass('ballOn');
    $('span').removeClass('strikeOn');
  }
  else{
    if(strikes === 2){
      addStrikes($('#strikes2'));
    }
    if(strikes === 1){
      addStrikes($('#strikes1'));
    }
    $('<button/>', {
      class: "btn btn-default btn-sm",
      text: "Next Pitch",
      click: function () {
        whoPitching();},
              }).appendTo("#text-area");
  }
};

var addBalls = function(id){
  id.addClass('ballOn');
};

var addStrikes = function(id){
  id.addClass('strikeOn');
};

var addOuts = function(id){
  id.addClass('outsOn');
};

var checkBalls = function(){
  if(balls === 4){
    $("<h1> Batter Walks.</h1>").appendTo("#text-area");
    balls = 0;
    strikes = 0;
    updateBalls();
    updateStrikes();
    $('span').removeClass('ballOn');
    $('span').removeClass('strikeOn');
  }
  if (balls === 3){
    addBalls($('#balls3'));
  }
  if (balls === 2){
    addBalls($('#balls2'));
  }
  if (balls === 1){
    addBalls($('#balls1'));
  }
  $('<button/>', {
    class: "btn btn-default btn-sm",
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
    $('span').removeClass('ballOn');
    $('span').removeClass('strikeOn');
    $('span').removeClass('outsOn');
    if(x <7){
    $('<button/>', {
      class: "btn btn-default btn-sm",
      text: "Switch Sides",
      click: function () {
        resetBall();
        checkX(x);},
              }).appendTo("#text-area");
  }
  else{
    strikes = 0;
    balls = 0;
    updateStrikes();
    updateBalls();
    $('span').removeClass('ballOn');
    $('span').removeClass('strikeOn');
    $('<button/>', {
      class: "btn btn-default btn-sm",
      text: "Shake Hands and say 'good game'.",
      click: function () {
        checkX(x);},
              }).appendTo("#text-area");
  }
}
  else{
    if(outs === 2){
      addOuts($('#outs2'));
    }
    if(outs === 1){
      addOuts($('#outs1'));
    }
    $('<button/>', {
      class: "btn btn-default btn-sm",
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
