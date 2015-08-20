document.addEventListener("DOMContentLoaded", function(event) { 
context = new AudioContext();
var sine = document.getElementById('sine');
var triangle =document.getElementById('triangle');
var sawtooth = document.getElementById('sawtooth');
var square = document.getElementById('square');
var gain = context.creategain(); //gain
oscillator = context.createOscillator();

var oscillators = document.getElementsByClassName("keys");
  _.each(oscillators, function(osc, i){
  keyNum = i + 16;
  exp = (keyNum - 49)/12
  var freq = Math.pow(2, exp) * 440;

osc.onmousedown  = function() {
    oscillator.frequency.value = freq;
    oscillator.connect(context.destination);
    oscillator.start();
  };
  // we set the 4 different types of waves
  document.getElementById("sine").addEventListener("click", function(){
        oscillator.type = 'sine'
    });
  document.getElementById("triangle").addEventListener("click", function(){
        oscillator.type = 'triangle'
    });
    document.getElementById("square").addEventListener("click", function(){
        oscillator.type = 'square'
    });
    document.getElementById("sawtooth").addEventListener("click", function(){
        oscillator.type = 'sawtooth'
    });

  
osc.onmouseup = function() {
    oscillator.disconnect();
  };

});


});













