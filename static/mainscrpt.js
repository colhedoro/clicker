////////// PROPERTIES/VARIABLES //////////
var virusName = "",

infected = {
	name:'infected',
	total:0,
	increment:1,
	replichance:0.1
},

replication = {
	name:'replication',
	total:0,
},

trPath = {
    name:'None',
    upgrades:'',
}

// Container of all properties.
properties = {
    virusName: virusName,
    infected: infected,
    replication: replication,
    trPath: trPath
};

// Gap between each time the game loop is fired...
var refresh = 666;
// Initialise message timer...
var msg = setTimeout(function(){}, 0);

////////// CLICK AND BUY FUNCTIONS //////////
function infect(){
    infected.total += infected.increment;
    randomchance();
    update();
}

function transPath(path){
    if (replication.total >= 5){
        replication.total -= 5;
        trPath.name = path;
        update();
    }  
}

////////// SAVE LOAD //////////
function save(){
    try{
        // Update properties object with all current values
        properties = {
            virusName: virusName,
            infected: infected,
            replication: replication,
            trPath: trPath
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
        console.log(err);
        msg = setTimeout(function(){document.getElementById("err").innerHTML = ""}, 1000);
    }
}

function load(){

    try{
        // Get the save game
        var savegame = JSON.parse(localStorage.getItem("save"));

        // Cycle through each property, checking that it exists in the save game, and if it is, loading it.
        if (typeof savegame.virusName !== "undefined"){
            virusName = savegame.virusName
        }
        if (typeof savegame.infected !== "undefined"){
            infected = savegame.infected
        }
        if (typeof savegame.replication !== "undefined") {
            replication = savegame.replication;
        }
        if (typeof savegame.trPath !== "undefined") {
            trPath = savegame.trPath;
        }

        // Confirmation message
        clearmsg();
        document.getElementById("suc").innerHTML = "Load successful";
        msg = setTimeout(function(){document.getElementById("suc").innerHTML = ""}, 1000);

        update();
    }
    catch(err){
        clearmsg();
        console.log(err);
        document.getElementById("err").innerHTML= "Unable to load savegame";
        msg = setTimeout(function(){document.getElementById("err").innerHTML = ""}, 1000);
    }
}

function deleteSave(){
    var confdel = confirm('Really delete save?'); //Check the player really wanted to do that.
    if(confdel){
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
}

////////// HELPER FUNCTIONS //////////

// Update display. Update this function for each added property
function update() {
    document.getElementById('virusName').innerHTML = virusName;
    document.getElementById("infected").innerHTML = format(infected.total);
    document.getElementById("replication").innerHTML = format(replication.total);
    document.getElementById("pathName").innerHTML = trPath.name;

    if(trPath.name != "None"){
        document.getElementById('choosePath').style.display = 'none';
        document.getElementById("transmission").style.display = "block";
    }
}

// Prompts player to name the Virus.
function nameVirus(){
    if (virusName == ""){
        virusName = randomName();
    }
	var n = prompt('Please name your Virus',virusName);
	if (n != null){
		virusName = n;
		update();
    }
    else nameVirus();
}

// Random chance (for Replications)
function randomchance(){
    var ran = Math.random();
    if (ran < infected.replichance){
        replication.total += infected.increment;
    }
}

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

// Autoload on page refresh
document.addEventListener("DOMContentLoaded", function(){
    var savedgame = JSON.parse(localStorage.getItem("save"));
    try {
        if (typeof savedgame.infected !== "undefined"){
        load()
        console.log("Loaded save game from LocalStorage")
        }
    }
    catch(err){
        console.log("No save game to load")
        nameVirus();
    }
});

// Random name generator
function randomName(){
    var examples = ["Bird Flu","Common Cold","Ebola","Encephalitis","Gastroenteritis","Hepatitis","Human Immunodeficiency Virus","Influenza","Meningitis",
                    "Mumps","Poliomyelitis","Poliovirus","Rabies","Rabies","Rubella","Shingles","Smallpox","Swine Flu","t-Virus","Zika virus"];
    var res = Math.floor(Math.random() * examples.length);
    return examples[res];
}


///// GAME LOOP /////
window.setInterval(function(){

}, refresh);