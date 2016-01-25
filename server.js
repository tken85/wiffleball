var express = require('express');
var port = process.env.PORT || 3001;
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var mongoConfig = process.env.MONGOLAB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/wiffle';
var bodyParser = require('body-parser');
var HighScore = require('./highScore');

mongoose.connect(mongoConfig);


mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});


app.use(express.static(__dirname + "/app"));
app.use(bodyParser.json());

app.get('/', function(req,res) {
  res.sendFile('app');
});

app.post('/addScore', function(req, res){
  var score = new HighScore({
    username: req.body.username,
    score: req.body.score
  });
  score.save(function(err, data) {
    if (err) return err;
    res.json(JSON.stringify(data));
  });

});

app.get('/highScores', function(req, res){
  HighScore.find(function(err,scores){
    if(err) return (err);
    res.json(scores);
  });

});

http.listen(port);

console.log('WE ARE RUNNING ON PORT:' + port);
