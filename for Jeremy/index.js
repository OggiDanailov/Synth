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
                  ] 

document.addEventListener("DOMContentLoaded", function(event) { 
  context = new AudioContext();
  $whiteContainer = $('#white');
  $blackContainer = $('#black');
  oscillators = {};

    var pianoKeysFreq = _.map(pianoKeys, function(pianoKeys, i){
      keyNum = i + 16;
      exp = (keyNum - 49) / 12
      var frequency = Math.pow(2, exp) * 440;
      return _.extend(pianoKeys, {frequency:frequency})
    })

    whites = _.where(pianoKeys, {color: "white"});
    blacks = _.where(pianoKeys, {color: "black"});

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


        
        $("#" + id).on('mousedown', function(){  
          console.log(id)
          oscillators[id] = context.createOscillator();
          oscillators[id].type = 'sine';
          oscillators[id].frequency.value = frequency;
          oscillators[id].connect(context.destination);
          oscillators[id].start();
         });

        $("#" + id).on('mouseup', function() {
          oscillators[id].disconnect();
        });
      })  
    }
    populateKeys(whites);
    populateKeys(blacks);

});

