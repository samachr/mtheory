serverConnect = {};


serverConnect.getExercise = function() {
  var returnSet = [];
  var lastRand = 1;
  for (var i = 0; i < 20; i++) {
    var nextRand = Math.floor((Math.random() * 10) + 1) % 7 + 1;
    while (nextRand == lastRand) {
      nextRand = Math.floor((Math.random() * 10) + 1) % 7 + 1;
    }
    returnSet.push(nextRand);
    lastRand = nextRand;
  }
  return returnSet
}

serverConnect.reportResults = function(results) {
  console.log(results);
}
