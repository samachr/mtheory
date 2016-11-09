function pianoController($scope) {
  $scope.keyText = [];
  $scope.time = 0;
  $scope.timer = setInterval(function() {
		$scope.$apply(function() {
			$scope.time++;
	    $scope.speed = $scope.correctAnswers / $scope.time * 60;
		});
  }, 1000);
  $scope.results = [];
  $scope.currentScaleDegree = 1;
  $scope.infoText = "Select a key to begin.."
  $scope.exerciseSet = serverConnect.getExercise();
  $scope.exerciseNumber = 0;
  $scope.commonLetterNames = theoryLayer.commonLetterNames;
  $scope.whiteKeyList = theoryLayer.whiteKeyList;
  $scope.blackKeyList = theoryLayer.blackKeyList;
  $scope.state = "keychoice";

  $scope.updateKeyLabels = function() {
    $scope.totalAnswers = 0;
    $scope.correctAnswers = 0;
    $scope.time = 0;
    $scope.infoText = "Time is ticking!";
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
    if ($scope.exerciseNumber == $scope.exerciseSet.length) {
      $scope.state = "keychoice";
      clearInterval($scope.timer);
      serverConnect.reportResults($scope.results);
    } else {
      $scope.exerciseNumber += 1;
      $scope.currentScaleDegree = $scope.exerciseSet[$scope.exerciseNumber];
      $scope.lastTimestamp = Date.now();
    }
  };

  $scope.play = function(noteNumber) {
    // console.log("playing noteNumber" + noteNumber);
    if ($scope.keyText[noteNumber] == "") return;
    // $scope.keysounds[noteNumber].currentTime = 0;
    soundLayer.playKey(noteNumber);

    if (theoryLayer.isCorrect($scope.currentScaleDegree, $scope.currentKey, noteNumber)) {
      $scope.infoText = "Got it Right!";
      $scope.results.push({key:$scope.currentKey, scaledegree: $scope.currentScaleDegree, time: Date.now() - $scope.lastTimestamp, correct: true })
      $scope.getNextNumber();

      var keyElement = document.getElementById("key" + noteNumber);
      keyElement.style.background = "green";
      $scope.correctAnswers += 1;

    } else {
      if ($scope.currentKey >= 0) {
        $scope.infoText = "Try Again";
        $scope.results.push({key:$scope.currentKey, scaledegree: $scope.currentScaleDegree, time: Date.now() - $scope.lastTimestamp, correct: false })
        keyElement.style.background = "red";
      } else {
        keyElement.style.background = "#2e3436";
      }
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
}
