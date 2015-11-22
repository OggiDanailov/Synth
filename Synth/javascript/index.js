var pianoKeys =  [{name: "C1", color: "white"}, {name: "Db1", color: "black"},
                  {name: "D1", color: "white"}, {name: "Eb1", color: "black"},
                  {name: "E1", color: "white"},
                  {name: "F1", color: "white"}, {name: "Gb1", color: "black"},
                  {name: "G1", color: "white"}, {name: "Ab1", color: "black"},
                  {name: "A1", color: "white"}, {name: "Bb1", color: "black"},
                  {name: "B1", color: "white"},

                  {name: "C2", color: "white"}, {name: "Db2", color: "black"},
                  {name: "D2", color: "white"}, {name: "Eb2", color: "black"},
                  {name: "E2", color: "white"},
                  {name: "F2", color: "white"}, {name: "Gb2", color: "black"},
                  {name: "G2", color: "white"}, {name: "Ab2", color: "black"},
                  {name: "A2", color: "white"}, {name: "Bb2", color: "black"},
                  {name: "B2", color: "white"},

                  {name: "C3", color: "white"}, {name: "Db3", color: "black"},
                  {name: "D3", color: "white"}, {name: "Eb3", color: "black"},
                  {name: "E3", color: "white"},
                  {name: "F3", color: "white"}, {name: "Gb3", color: "black"},
                  {name: "G3", color: "white"}, {name: "Ab3", color: "black"},
                  {name: "A3", color: "white"}, {name: "Bb3", color: "black"},
                  {name: "B3", color: "white"},

                  {name: "C4", color: "white"}, {name: "Db4", color: "black"},
                  {name: "D4", color: "white"}, {name: "Eb4", color: "black"},
                  {name: "E4", color: "white"},
                  {name: "F4", color: "white"}, {name: "Gb4", color: "black"},
                  {name: "G4", color: "white"}, {name: "Ab4", color: "black"},
                  {name: "A4", color: "white"}, {name: "Bb4", color: "black"},
                  {name: "B4", color: "white"},

                  {name: "C5", color: "white"}, {name: "Db5", color: "black"},
                  {name: "D5", color: "white"}, {name: "Eb5", color: "black"},
                  {name: "E5", color: "white"},
                  {name: "F5", color: "white"}, {name: "Gb5", color: "black"},
                  {name: "G5", color: "white"}, {name: "Ab5", color: "black"},
                  {name: "A5", color: "white"}, {name: "Bb5", color: "black"},
                  {name: "B5", color: "white"},
                  {name: "C6", color: "white"}
                  ];

var noteNames = {
  'sharp' : ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  'flat' : ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
  'enharmonic-sharp' : ['B#', 'C#', 'C##', 'D#', 'D##', 'E#', 'F#', 'F##', 'G#', 'G##', 'A#', 'A##'],
  'enharmonic-flat' : ['Dbb', 'Db', 'Ebb', 'Eb', 'Fb', 'Gbb', 'Gb', 'Abb', 'Ab', 'Bbb', 'Bb', 'Cb']
};


var convolver;
var volume;
var distortion;
var delay;
var mix;
var depth;
var feedback;


// get note name from MIDI note number
getNoteName = function(number, mode) {
  mode = mode || 'sharp';
  //console.log(mode);
  //var octave = Math.floor((number / 12) - 2), // → in Cubase central C = C3 instead of C4
  var octave = Math.floor((number / 12) - 1),
      noteName = noteNames[mode][number % 12];
  return [noteName,octave];
}

getFrequency = function(number){
  var pitch = 440;
  return pitch * Math.pow(2,(number - 69)/12); // midi standard, see: http://en.wikipedia.org/wiki/MIDI_Tuning_Standard
};


// called when a key is pressed either on the virtual HTML piano or on a connected MIDI keyboard
function onMIDIKeyDown(id, frequency, velocity){
  console.log(id, frequency, velocity);

  oscillators[id] = context.createOscillator();
  oscillators[id].type = currentType;
  oscillators[id].frequency.value = frequency;

  oscillators[id].connect(volume);
  oscillators[id].connect(delay);
  oscillators[id].connect(biquadFilter);
  // oscillators[id].connect(distortion);
  delay.connect(mix);
  mix.connect(volume);
  delay.connect(biquadFilter);
  biquadFilter.connect(volume);
  volume.connect(context.destination);


  oscillators[id].connect(convolver);
  // $("#flipSwitch").on("change",function(){
  //   var sw = $(this).val();
  //   if(sw == "on"){
  //     oscillators[id].connect(distortion);
  //   }else{oscillators[id].disconnect(distortion)}
  //   });


  // distortion.connect(convolver)
  convolver.connect(volume);
  volume.connect(context.destination);


  //lfo.connect(depth);


  //lfo.start(0)
  //});

  oscillators[id].start();
}

function onMIDIKeyUp(id){
  oscillators[id].disconnect();
  //lfo.disconnect();
}

document.addEventListener("DOMContentLoaded", function(event) {

  if(navigator.requestMIDIAccess !== undefined){
    navigator.requestMIDIAccess().then(

      function onFulfilled(access, options){
        MIDIAccess = access;
        showMIDIPorts();
      },

      function onRejected(e){
        console.log('No access to MIDI devices:' + e);
      }
    );
  }else{
    // browsers without WebMIDI API or Jazz plugin
    console.log('No access to MIDI devices');
  }

  // see this example: http://abudaan.github.io/heartbeat/examples/#!midi_in_&_out/webmidi_create_midi_events
  function showMIDIPorts(){
    console.log('MIDI supported');
    var inputs = [];
    MIDIAccess.inputs.forEach(function(port, key){
      // console.log(port);
      inputs.push(port);
    });
    // connect the first found MIDI keyboard
    var input = inputs[2];
    console.log(input)
    // explicitly open MIDI port
    input.open();
    input.addEventListener('midimessage', function(e){
      console.log(e)
      var type = e.data[0];
      var data1 = e.data[1];
      var data2 = e.data[2];
      var noteName = getNoteName(data1);
      noteName = noteName[0] + noteName[1];
      if(type === 144 && data2 !== 0){
        onMIDIKeyDown(noteName, getFrequency(data1), data2);
      }else if(type === 128 || (type === 144 && data2 === 0)){
        onMIDIKeyUp(noteName);
      }
    }, false);
  }

  context = new AudioContext();
  $whiteContainer = $('#white');
  $blackContainer = $('#black');
  oscillators = {};
  currentType = "sine";

  biquadFilter = context.createBiquadFilter(); //set a defualt value for the wave form

  convolver = context.createConvolver(); //this is the echo creation
  volume = context.createGain(); //this is the volume
  distortion = context.createWaveShaper();

  delay = context.createDelay();
  lfo = context.createOscillator();
  depth = context.createGain();
  mix = context.createGain();
  feedback = context.createGain();

  function setupChorusLfo(){ 

    delay.connect(mix);
    mix.connect(context.destination);
    lfo.connect(depth);
    depth.connect(delay.delayTime);
    delay.connect(feedback);
    feedback.connect(delay);

    if (this.value){
            lfo.frequency.value = this.value;
          } else {
            lfo.frequency.value = 0.0;
          }

           var depthRate = 0.8; 
          delay.delayTime.value  = 0.005;          
          depth.gain.value = delay.delayTime.value * depthRate;  // 5 msec +- 4 (5 * 0.8) msec
          mix.gain.value = 0.4;
          feedback.gain.value = 0.4;

          lfo.start(0);
  }  


  function setupFeedbackLfo(){ 
    
    // delay.connect(mix);
    mix.connect(context.destination);
    lfo.connect(depth);
    depth.connect(feedback);
    // delay.connect(feedback);
    feedback.connect(context.destination);

    if (this.value){
            feedback.gain.value = this.value;
          } else {
            feedback.gain.value = 0.0;
          }

           var depthRate = 0.8; 
           // lfo.frequency.value = 0.5;
          // delay.delayTime.value  = 0.005;          
          depth.gain.value = delay.delayTime.value * depthRate;  // 5 msec +- 4 (5 * 0.8) msec
          // mix.gain.value = 0.4;
          // feedback.gain.value = 0.4;
  } 

  function debtRate(){ 

    delay.connect(mix);
    mix.connect(context.destination);
    lfo.connect(depth);
    depth.connect(delay.delayTime);
    delay.connect(feedback);
    feedback.connect(delay);

    if (this.value){
            var depthRate = this.value;
          } else {
            var depthRate = 0.0;
          }

           // var depthRate = 0.8; 
          delay.delayTime.value  = 0.005;          
          depth.gain.value = delay.delayTime.value * depthRate;  // 5 msec +- 4 (5 * 0.8) msec
          mix.gain.value = 0.4;
          feedback.gain.value = 0.4;
  }



 var gainSlider = document.getElementById("gainSlider");
  gainSlider.addEventListener('change', function() {
  volume.gain.value = this.value;
  });

  var distSlider = document.getElementById("distSlider");
  var DelaySlider = document.getElementById("DelaySlider");
  var lfoSlider = document.getElementById('lfo');
  var feedbacklfo = document.getElementById('feedbacklfo');
  var debtrate = document.getElementById('debtrate');

//   function makeDistortionCurve(amount) {
//   var k = typeof amount === 'number' ? amount : 50,
//     n_samples = 44100,
//     curve = new Float32Array(n_samples),
//     deg = Math.PI / 180,
//     i = 0,
//     x;
//     for ( ; i < n_samples; ++i ) {
//     x = i * 5 / n_samples - 1;
//     curve[i] = ( 7 + k ) * x * 17 * deg / ( Math.PI + k * Math.abs(x) );
//     }
//   return curve;
//   };


// distortion.curve = makeDistortionCurve(distSlider);
// distortion.oversample = '4x';


  function setupEcho(echo){
    return function() {
      var request = new XMLHttpRequest();
      request.open("GET", "./audio_files/echo" + echo + ".wav", true);
      request.responseType = "arraybuffer";

      request.onload = function() {
        var audioData = request.response;
        context.decodeAudioData(audioData, function(buffer) {
          concertHallBuffer = buffer;

          soundSource = context.createBufferSource();
          soundSource.buffer = concertHallBuffer;
          convolver.buffer = concertHallBuffer;
        }, function(e){"Error with decoding audio data" + e.err});
      }

      request.send();
    }
     var soundSource, concertHallBuffer;  //this is the echo
  var echo1 = document.getElementById('echo1');
  var echo2 = document.getElementById('echo2');
  var echo3 = document.getElementById('echo3');
  var echo4 = document.getElementById('echo4');
  var echo5 = document.getElementById('echo5');

  }

  echo1.onclick = setupEcho(1);
  echo2.onclick = setupEcho(2);
  echo3.onclick = setupEcho(3);
  echo4.onclick = setupEcho(4);
  echo5.onclick = setupEcho(5);

///////////////////////////////////////////////////////////////////
    var pianoKeysFreq = _.map(pianoKeys, function(pianoKeys, i){
      keyNum = i + 16;
      exp = (keyNum - 49) / 12
      var frequency = Math.pow(2, exp) * 440;
      return _.extend(pianoKeys, {frequency:frequency})
    })

    whites = _.where(pianoKeys, {color: "white"});
    blacks = _.where(pianoKeys, {color: "black"});
//////////////////////////////////////////////////////////////////////
    function setupDelay(){
          depth.connect(delay.delayTime);
          delay.connect(feedback);
          feedback.connect(delay);
          var depthRate = 0.2;  // 80 %

          if (this.value){
            delay.delayTime.value = this.value;
          } else {
            delay.delayTime.value = 0.0;
          }

          // var lfo = context.createOscillator();
          depth.gain.value = delay.delayTime.value * depthRate;  // 5 msec +- 4 (5 * 0.8) msec
          // lfo.frequency.value = 50;  // 5 Hz
          mix.gain.value = 0.3;
          feedback.gain.value = 0.3;
    }

              ////////////////////////////////////////////////////
        // currentFilter = "allpass";

        // document.getElementById("lowpass").addEventListener("click", function(){
        //  currentFilter= 'lowpass';});
        // document.getElementById("highpass").addEventListener("click", function(){
        //  currentFilter = 'highpass';});
        // document.getElementById("allpass").addEventListener("click", function(){
        //  currentFilter = 'allpass';});
        // document.getElementById("nada").addEventListener("click", function(){
        //  currentFilter = 'notch';});
              
          // biquadFilter.frequency.value = 1000;
          biquadFilter.type = 'lowpass';
          // biquadFilter.gain.value = slider;
          // biquadFilter.detune.value = 0;
          // biquadFilter.Q.value = 0; // 80 %

          // var slider = document.getElementById("Slider");
          //   slider.addEventListener('change', function() {
          //   biquadFilter.gain.value = this.value;
          //   });

            // var quality = document.getElementById("q");
            //   quality.addEventListener('change', function() {
            //   biquadFilter.Q.value = this.value;
            //   });

              // var tune = document.getElementById("tune");
              //   tune.addEventListener('change', function() {
              //   biquadFilter.detune.value = this.value;
              //   });


            var freq = document.getElementById("Freq");
              freq.addEventListener('change', function() {
              biquadFilter.frequency.value = this.value;
              });

    //////////////////////////////////////////////////////


    function populateKeys(keys){

      _.each(keys, function(key) {
        var name = key.name;
        var id = key.name;
        var color = key.color;
        var frequency = key.frequency;

        var div = "<div class='" + color + "' id='" + id + "'></div>";

        if(color == "white"){
          $(div).appendTo($whiteContainer)
        } else {
          $(div).appendTo($blackContainer)
        };

        $("#" + id).on('mousedown', function() {
          onMIDIKeyDown(id, frequency);
        });

        $("#" + id).on('mouseup', function() {
          onMIDIKeyUp(id);
        });
      })


           
    }
    populateKeys(whites);
    populateKeys(blacks);

    setupFeedbackLfo();
    setupChorusLfo();
    debtRate();
    setupDelay();
    DelaySlider.addEventListener('change', setupDelay);
    lfoSlider.addEventListener('change', setupChorusLfo);
    feedbacklfo.addEventListener('change', setupFeedbackLfo);
    debtrate.addEventListener('change', debtRate);


    document.getElementById("triangle").addEventListener("click", function(){
     currentType = 'triangle';});
    document.getElementById("square").addEventListener("click", function(){
     currentType = 'square';});
    document.getElementById("sine").addEventListener("click", function(){
     currentType = 'sine';});
    document.getElementById("sawtooth").addEventListener("click", function(){
     currentType = 'sawtooth';});
    document.getElementById("custom").addEventListener("click", function(){
     currentType = 'custom';});





});
