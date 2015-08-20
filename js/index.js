document.addEventListener("DOMContentLoaded", function(event) { 

  context = new AudioContext();
  var osc = document.getElementById("C");

  

  osc.onmousedown  = function() {
    var oscPitch = document.getElementById('oscPitch').value;
    oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 220;
    oscillator.connect(context.destination);
    oscillator.start();
  };

  



  osc.onmouseup = function() {
    oscillator.disconnect();
  };

});
