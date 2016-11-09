soundLayer = {};

(function(){
  var context;

  soundLayer.keySounds = [];

  soundLayer.getAudio = function(update, done) {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    var soundSources = [];
    for (var i = 0; i < 24; i++) {
      soundSources[i] = './sounds/key' + i + '.ogg';
    }

    soundLayer.infoText = "loading..";
    update(soundLayer.infoText);

    var loaded = false;

    var addDots = function(){
      if(!loaded) {
          soundLayer.infoText += ".";
          update(soundLayer.infoText);
          setTimeout(addDots,1000);
      }
    }
    setTimeout(addDots,200);

    new BufferLoader(
      context,
      soundSources,
      function(bufferList) {
        loaded = true;
        soundLayer.infoText = "Sound Ready!";
        update(soundLayer.infoText);

        var sounds = [];

        for (var i = 0; i < 24; i++) {
          soundLayer.keySounds[i] = bufferList[i];
        }
        done();
      }
    ).load();
  };

  soundLayer.playKey = function(key) {
    var source = context.createBufferSource();
    source.buffer = soundLayer.keySounds[key];
    source.connect(context.destination);
    source.start(0);
  }

  function BufferLoader(o, r, e) { this.context = o, this.urlList = r, this.onload = e, this.bufferList = new Array, this.loadCount = 0 } BufferLoader.prototype.loadBuffer = function(o, r) { var e = new XMLHttpRequest; e.open("GET", o, !0), e.responseType = "arraybuffer"; var t = this; e.onload = function() { t.context.decodeAudioData(e.response, function(e) { return e ? (t.bufferList[r] = e, void(++t.loadCount == t.urlList.length && t.onload(t.bufferList))) : void alert("error decoding file data: " + o) }, function(o) { console.error("decodeAudioData error", o) }) }, e.onerror = function() { alert("BufferLoader: XHR error") }, e.send() }, BufferLoader.prototype.load = function() { for (var o = 0; o < this.urlList.length; ++o) this.loadBuffer(this.urlList[o], o) };
})();

soundLayer.getAudio(function(){}, function(){});
