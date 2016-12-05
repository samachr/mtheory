function pianoController($scope, $http) {
  $scope.keyText = [];
  $scope.results = [];
  $scope.currentScaleDegree = 1;
  $scope.infoText = "Enter your username.."

  // soundLayer.getAudio(function(){}, function(){});

  $scope.exerciseSet = [];
  $scope.exerciseNumber = -1;
  $scope.commonLetterNames = theoryLayer.commonLetterNames;
  $scope.whiteKeyList = theoryLayer.whiteKeyList;
  $scope.blackKeyList = theoryLayer.blackKeyList;
  $scope.state = "ready";

  $scope.start = function() {
    serverConnect.getExercise($scope.username, $http, function(exercises){
      $scope.exerciseSet = exercises;
      $scope.updateKeyLabels();
      $scope.getNextNumber();
    });
  }

  $scope.updateKeyLabels = function() {
    $scope.going = true;
    $scope.totalAnswers = 0;
    $scope.correctAnswers = 0;
    $scope.infoText = "";
    $scope.lastTimestamp = Date.now();

    for (var i = 0; i < 24; i++) {
      if (theoryLayer.isInKey($scope.currentKey, i)) {
        $scope.keyText[i] = theoryLayer.getNoteNameInKey($scope.currentKey, i);
      } else {
        $scope.keyText[i] = "";
      }
    }
    $scope.state = "playing";
  };

  $scope.getNextNumber = function() {
    if ($scope.exerciseNumber == $scope.exerciseSet.length-1) {
      $scope.state = "ready";
      $scope.exerciseNumber = -1;
      $scope.infoText = "Reporting Results"
      serverConnect.reportResults($scope.username || "test", $scope.results, $http, function(response){
        $scope.update();
      });
    } else {
      $scope.exerciseNumber += 1;
      $scope.currentKey = $scope.exerciseSet[$scope.exerciseNumber].key;
      $scope.currentScaleDegree = $scope.exerciseSet[$scope.exerciseNumber].scaledegree;
      $scope.updateKeyLabels();
      $scope.lastTimestamp = Date.now();
    }
  };

  $scope.play = function(noteNumber) {
    if ($scope.keyText[noteNumber] == "") return;
    // soundLayer.playKey(noteNumber);

    var keyElement = document.getElementById("key" + noteNumber);
    if (theoryLayer.isCorrect($scope.currentScaleDegree, $scope.currentKey, noteNumber)) {
      $scope.infoText = "Got it Right!";
      $scope.results.push({key:$scope.currentKey, scaledegree: $scope.currentScaleDegree, time: Date.now() - $scope.lastTimestamp, correct: true })
      $scope.getNextNumber();

      keyElement.style.background = "green";
      $scope.correctAnswers += 1;
    } else {
        $scope.infoText = "Try Again";
        // $scope.results.push({key:$scope.currentKey, scaledegree: $scope.currentScaleDegree, time: Date.now() - $scope.lastTimestamp, correct: false })
        keyElement.style.background = "red";

    }

    $scope.totalAnswers += 1;

    lock[noteNumber]++;
    document.getElementById("key" + noteNumber).style.color = "white";
    setTimeout(function() {
      clearAnimation(noteNumber, (theoryLayer.isWhite(noteNumber)) ? "white" : "black");
    }, 1000);

  };

  var lock = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  function clearAnimation(keyPressed, color) {
    if (lock[keyPressed] == 1) {
      keyDOMRef = document.getElementById("key" + keyPressed);
      keyDOMRef.style.background = color;
      keyDOMRef.style.color = color;
    }
    lock[keyPressed]--;
  }

  $scope.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
  };

  $scope.chartdata = {
    labels: ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"],
    datasets: [{
        label: '1',
        backgroundColor: $scope.chartColors.red,
        borderColor: $scope.chartColors.red,
        borderWidth: 1,
        data: [ ]
    }, {
        label: '2',
        backgroundColor: $scope.chartColors.orange,
        borderColor: $scope.chartColors.orange,
        borderWidth: 1,
        data: [ ]
    }, {
        label: '3',
        backgroundColor: $scope.chartColors.yellow,
        borderColor: $scope.chartColors.yellow,
        borderWidth: 1,
        data: [ ]
    }, {
        label: '4',
        backgroundColor: $scope.chartColors.green,
        borderColor: $scope.chartColors.green,
        borderWidth: 1,
        data: [ ]
    }, {
        label: '5',
        backgroundColor: $scope.chartColors.purple,
        borderColor: $scope.chartColors.purple,
        borderWidth: 1,
        data: [ ]
    }, {
        label: '6',
        backgroundColor: $scope.chartColors.grey,
        borderColor: $scope.chartColors.grey,
        borderWidth: 1,
        data: [ ]
    }, {
        label: '7',
        backgroundColor: $scope.chartColors.blue,
        borderColor: $scope.chartColors.blue,
        borderWidth: 1,
        data: [ ]
    }]
  };

  $scope.chart = new Chart(document.getElementById("canvas").getContext("2d"), {
      type: 'bar',
      data: $scope.chartdata,
      options: {
          responsive: true,
          legend: {
              position: 'bottom',
          },
          title: {
              display: true,
              text: 'Progress'
          }
      }
  });
  $scope.update = function() {

    $scope.chartdata.datasets.forEach(function(dataset){
      dataset.data = [];
    });
    $scope.infoText = "Updating chart..";
    $scope.chart.update();

    serverConnect.getReport($scope.username, $http, function(data){
      var timedata = {};

      data.forEach(function(item){
        var key = parseInt(item[2]);
        var scaledegree = item[3];
        var time = item[6];
        if (timedata[key] == undefined) {
          timedata[key] = {};
          timedata[key][scaledegree] = time;
        } else {
          timedata[key][scaledegree] = time;
        }
      });

      for (var i = 0; i < 12; i++) {
        for (var j = 1; j < 8; j++) {
          if (timedata[i] != undefined && timedata[i][j] != undefined) {
            $scope.chartdata.datasets[j-1].data.push(timedata[i][j]);
          } else {
            $scope.chartdata.datasets[j-1].data.push(0);
          }
        }
      }
      $scope.chart.update();
      $scope.infoText = "Chart Ready!";
    });
  };
}