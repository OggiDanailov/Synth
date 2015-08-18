document.addEventListener("DOMContentLoaded", function(event) { 



  context = new AudioContext();
  var osc = document.getElementById("C");

  var waves_sine = document.getElementById("waves_sine");
  var waves_triangle = document.getElementById("waves_triangle");
  var waves_sawtooth = document.getElementById("waves_sawtooth");
  var waves_square = document.getElementById("waves_square");
  
 


  osc.onmousedown  = function() {
    var oscPitch = document.getElementById('oscPitch').value;
    oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 120;
    oscillator.connect(context.destination);
    oscillator.start();
  };

  



  osc.onmouseup = function() {
    oscillator.disconnect();
  };

});
