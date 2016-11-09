var theoryLayer = {};
//                      0    1     2    3     4    5    6     7    8     9    10    11   12   13    14   15   16    17   18    19   20    21   22   23
theoryLayer.noteLettersS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
theoryLayer.noteLettersB = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
theoryLayer.sharpKeys = [2, 4, 6, 7, 9, 11];
theoryLayer.flatKeys = [0, 1, 3, 5, 8, 10];
theoryLayer.noteNames = ["C", "D", "E", "F", "G", "A", "B"];
theoryLayer.commonLetterNames = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
theoryLayer.majorScalePattern = [0, 2, 4, 5, 7, 9, 11];
theoryLayer.whiteKeyList = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
theoryLayer.blackKeyList = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];

theoryLayer.isCorrect = function(currentScaleDegree, currentKey, inputNoteNumber) {
  return (theoryLayer.majorScalePattern[currentScaleDegree - 1] + parseInt(currentKey)) % 12 == inputNoteNumber % 12
}

theoryLayer.isInKey = function(key, note) {
  for (var i = 0; i < 7; i++) {
    if ((theoryLayer.majorScalePattern[i] + parseInt(key)) % 12 == note % 12) return true;
  }
  return false;
}

theoryLayer.isSharpKey = function(key) {
  for (var i = 0; i < 6; i++) {
    if (theoryLayer.sharpKeys[i] == key) return true;
  }
  return false;
}

theoryLayer.isWhite = function(keyNum) {
  for (var i = 0; i < theoryLayer.whiteKeyList.length; i++) {
    if (keyNum === theoryLayer.whiteKeyList[i]) {
      return true;
    }
  }
  return false;
}

theoryLayer.getNoteNameInKey = function(key, i) {
  theoryLayer.isSharpKey(key) ? theoryLayer.noteLettersS[i] : theoryLayer.noteLettersB[i];
}
