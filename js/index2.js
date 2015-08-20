document.addEventListener("DOMContentLoaded", function(event) { 
context = new AudioContext();

var oscillators = document.getElementsByClassName("keys");
  _.each(oscillators, function(osc, i){
  keyNum = i + 16;
  exp = (keyNum - 49)/12
  var freq = Math.pow(2, exp) * 440;
osc.onmousedown  = function() {
    oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    oscillator.connect(context.destination);
    oscillator.start();
  };
  
osc.onmouseup = function() {
    oscillator.disconnect();
  };

});






});













