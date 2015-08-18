document.addEventListener("DOMContentLoaded", function(event) { 
context = new AudioContext();


// Assign corresponding frequency to each key
// _.range(40, 52).map / function(n){
// exp = (n - 49)/12
// return Math.pow(2, exp) * 440; }


var oscillators = document.getElementsByClassName("key");
_.each(oscillators, function(osc, i){
  keyNum = i + 40;
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