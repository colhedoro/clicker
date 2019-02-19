
////////// PROPERTIES/VARIABLES //////////

var clicks = 0;
var autoclick = 0;

// Container of all properties.
var properties = {
    clicks: clicks,
    autoclick: autoclick
};

// Gap between each time the game loop is fired...
var refresh = 666;
// Initialise message timer...
var msg = setTimeout(function(){}, 0);

////////// CLICK AND BUY FUNCTIONS //////////

function clickFunction(number) {
    clicks += number;
    document.getElementById("number").innerHTML = format(clicks);
}

function buyAutoclick(number){
    var cost = Math.floor(10 * Math.pow(1.1,autoclick));
    if (clicks >= cost){
        autoclick += number;
        clicks -= cost;
        document.getElementById("autoclick").innerHTML = format(autoclick);
        document.getElementById("number").innerHTML = format(clicks);
    }
    var nextCost = Math.floor(10 * Math.pow(1.1,autoclick));
    document.getElementById("autocost").innerHTML = format(nextCost);

}

////////// SAVE LOAD //////////

function save(){
    try{
        // Update properties object with all current values
        properties = {
            clicks: clicks,
            autoclick: autoclick
        };
        clearmsg();

        // Save and set confirmation message
        localStorage.setItem("save",JSON.stringify(properties));
        document.getElementById("suc").innerHTML = "Saved";
        msg = setTimeout(function(){document.getElementById("suc").innerHTML = ""}, 1000);
    }
    catch(err){
        clearmsg();
        document.getElementById("err").innerHTML = "Save failed";
        msg = setTimeout(function(){document.getElementById("err").innerHTML = ""}, 1000);
    }
}

function load(){

    try{
        // Get the save game
        var savegame = JSON.parse(localStorage.getItem("save"));

        // Cycle through each property, checking that it exists in the save game, and if it is, loading it.
        if (typeof savegame.clicks !== "undefined"){
            clicks = savegame.clicks
        }
        if (typeof savegame.autoclick !== "undefined") {
            autoclick = savegame.autoclick;
        }

        // Confirmation message
        clearmsg();
        document.getElementById("suc").innerHTML = "Load successful";
        msg = setTimeout(function(){document.getElementById("suc").innerHTML = ""}, 1000);

        // Update display
        clickFunction(0);
        buyAutoclick(0);
    }
    catch(err){
        clearmsg();
        document.getElementById("err").innerHTML= "Unable to load savegame";
        msg = setTimeout(function(){document.getElementById("err").innerHTML = ""}, 1000);
    }
}

function deleteSave(){
    try{
        clearmsg();
        localStorage.clear();
        document.getElementById("suc").innerHTML = "Save deleted";
        msg = setTimeout(function(){document.getElementById("suc").innerHTML = ""}, 1000);
    }
    catch(err){
        clearmsg();
        document.getElementById("err").innerHTML = "Unable to delete save";
        msg = setTimeout(function(){document.getElementById("err").innerHTML = ""}, 1000);
    }
}

////////// HELPER FUNCTIONS //////////

// Put commas in large numbers (e.g 1,000,000)
function format(text) {
    var format = Math.round(text)
    format = Number(text.toFixed(0)).toLocaleString().split(/\s/).join(',');
    return format;
}

// Display a clock for user.
var timerVar = setInterval(myTimer, 1000);
function myTimer() {
  var d = new Date();
  document.getElementById("timedisplay").innerHTML = d.toLocaleTimeString();
}

// Clear messages, if button pressed while a message is already displayed.
function clearmsg() {
    clearTimeout(msg)
    document.getElementById("suc").innerHTML = "";
    document.getElementById("err").innerHTML = "";
}


///// GAME LOOP /////
window.setInterval(function(){
    var increase = autoclick * 1.2;
    clickFunction(increase);
}, refresh);