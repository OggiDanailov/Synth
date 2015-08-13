document.addEventListener("DOMContentLoaded", function(event) { 



  context = new AudioContext();
  var osc = document.getElementById("osc");
 


  osc.onmousedown  = function() {
    var oscPitch = document.getElementById('oscPitch').value;
    oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = oscPitch;
    oscillator.connect(context.destination);
    oscillator.start();
  };

  osc.onmouseup = function() {
    oscillator.disconnect();
  };

});
