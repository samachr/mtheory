serverConnect = {};

(function(){
// serverConnect.getExercise = function() {
//   var returnSet = [];
//   var lastRand = 1;
//   for (var i = 0; i < 10; i++) {
//     var nextRand = Math.floor((Math.random() * 10) + 1) % 7 + 1;
//     while (nextRand == lastRand) {
//       nextRand = Math.floor((Math.random() * 10) + 1) % 7 + 1;
//     }
//     returnSet.push(nextRand);
//     lastRand = nextRand;
//   }
//
//   return [returnSet]
// }
serverConnect.getExercise = function(username, $http, callback) {
  $http.get('/api/exercises/'+username).then(function(response){
    // console.log('get report success', response);
    callback(response.data);
  }, function(response){
    console.log('get report failure', response);
  });
}

serverConnect.reportResults = function(username, results, $http, callback) {
  $http.post('/api/report/'+username, {results: results}).then(function(response){
    callback(response);
    // console.log('report success', response);
  }, function(response){
    console.log('report failure', response);
  });
}

serverConnect.getReport = function(username, $http, callback) {
  $http.get('/api/report/'+username).then(function(response){
    // console.log('get report success', response);
    callback(response.data);
  }, function(response){
    console.log('get report failure', response);
  });
}


})();