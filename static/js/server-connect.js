serverConnect = {};

(function(){
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
  return [returnSet[0]]
}

serverConnect.reportResults = function(username, results, $http) {
  $http.post('/api/report/'+username, {results: results}).then(function(response){
    console.log('report success', response);
  }, function(response){
    console.log('report failure', response);
  });
}

})();