var mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
  username: {type: String},
  score: {type: Number},
});

var Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
