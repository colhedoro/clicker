// Init
$('.btn-sm').popover();
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

////////// PROPERTIES/VARIABLES //////////
var virusName = "",

infected = {
	name:'infected',
	total:1,
	increment:1
},

replication = {
	name:'replication',
    total:0,
    auto:false,
    chance:0.1
},

trPath = {
    name:'None',
    upgrades:[],
    increment:0
}

symptoms = {
    upgrades:[],
    cough: 0,
    sneeze: 0,
    headache: 0,
    nausea: 0
}

adUpgrades = {
    upgrades:[],
    autoRep: 0,
    trans1: 0,
    symp1: 0,
    heat1: 1
}

trUpgrades = {
    // Droplet
    mucus: 0,
    breath: 0,
    saliva: 0,
    // Sit and Wait
    survival1: 0
    // Vector
    // Contact
}

// Container of all properties.
properties = {
    virusName: virusName,
    infected: infected,
    replication: replication,
    trPath: trPath,
    symptoms: symptoms,
    adUpgrades: adUpgrades,
    trUpgrades: trUpgrades
};

// Gap (in ms) between each time the game loop is fired (Tick rate)...
var refresh = 666;
// Initialise message timer...
var msg = setTimeout(function(){}, 0);

////////// CLICK AND BUY FUNCTIONS //////////

// Click on infect button
function infect(){
    infected.total += infected.increment;
    randomchance();
    update();
}

// Choose (Buy) the transmission Path
function transPath(path){
    if (replication.total >= 2){
        replication.total -= 2;
        trPath.name = path;
        transInit(trPath.name);
        console.log("Chosen transmission path: " + trPath.name)
        update();
    }  
}

////////// TRANSMISSION PATHS /////////

function transInit(path){
    if (path == 'droplet'){
        trPath.increment = 1;
    }
    else if (path == 'sitwait'){
        trPath.increment = 0.5;
    }
    else if (path == 'vector'){
        trPath.increment = 1;
    }
    else if (path == 'contact'){
        trPath.increment = 1;
    }
    else{
        console.log("Unknown transmission type")
        trPath.name = "None";
    }
}

// Handle all upgrades for the Droplet path
function dropletUpgrade(upgrade){
    if (upgrade == 'mucus' && replication.total >= 5){
        trPath.upgrades.push(" Mucus");
        trUpgrades.mucus = 1;
        replication.total -= 5;
        trPath.increment += 2;
        update();
    }
    if (upgrade == 'breath' && replication.total >= 5){
        trPath.upgrades.push(" Breath");
        trUpgrades.breath = 1;
        replication.total -= 5;
        trPath.increment += 1.5;
        update();
    }
    if (upgrade == 'saliva' && replication.total >= 25){
        trPath.upgrades.push(" Saliva");
        trUpgrades.saliva = 1;
        replication.total -= 25;
        trPath.increment += 5;
        update();
    }
}

// Handle all upgrades for the Sit and Wait path
function waitUpgrade(upgrade){
    if (upgrade == 'survival1' && replication.total >= 5){
        trPath.upgrades.push(" Survival 1");
        trUpgrades.survival1 = 1;
        replication.total -= 5;
        trPath.increment += 0.5;
        update();
    }
}

// Handle all upgrades for the Vector path
function vectorUpgrade(upgrade){
}

// Handle all upgrades for the Contact path
function contactUpgrade(upgrade){
}

////////// SYMPTOMS ///////////

////////// ADAPTATIONS ////////
/* In progress
function adapUpgrade(upgrade){
    if (upgrade == 'autoRep' && replication.total >= 5){
        adUpgrades.autoRep = 1;
        replication.total -= 5;
        replication.auto = true;
        update();
    }
}
*/

////////// HELPER FUNCTIONS //////////

// Update display. Update this function for each added property
function update(){
    if (infected.total <= 0){
        //game is lost
        document.getElementById("infected").innerHTML = 0;
        loss();
    }
    document.getElementById('virusName').innerHTML = virusName;
    document.getElementById("infected").innerHTML = format(infected.total);
    document.getElementById("replication").innerHTML = format(replication.total);
    if (trPath.name != "None"){
        document.getElementById(trPath.name[0] + 'upgradeList').innerHTML = trPath.upgrades;
    }
    loadButtons()
}

// Update this function for each added Upgrade
function loadButtons(){
    if(trPath.name != "None"){
        document.getElementById('choosePath').style.display = 'none';
        document.getElementById(trPath.name).style.display = "block";
    }
    for (var i in trUpgrades){
        if (trUpgrades[i] == 1){
            document.getElementById(i).style.display = 'none';
        }
    }
}

function loss(){
    console.log("Game is lost.");
    confirm('No hosts remain: The Virus has been cured !');
    var doLoad = confirm('Load most recent save ?');
    if (doLoad){
        window.location.reload();
    }
    else{
        deleteSave();
        window.location.reload();
    }
}

// Add increments from Transmission
function autoInfect(){
    infected.total += trPath.increment;
    if (replication.auto == true){
        for(var i=0; i < trPath.increment; i++){
            randomchance();
        }
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
    if (ran < replication.chance){
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
    if (isMobile) {
        $('#modMob').modal();
    }
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
        clearmsg();
        document.getElementById("suc").innerHTML = "Patient Zero infected...";
        msg = setTimeout(function(){document.getElementById("suc").innerHTML = ""}, 1000);
    }
});

// Random name generator
function randomName(){
    var examples = ["Bird Flu","Common Cold","Ebola","Encephalitis","Gastroenteritis","Hepatitis","Human Immunodeficiency Virus","Influenza","Meningitis",
                    "Mumps","Poliomyelitis","Poliovirus","Rabies","Rabies","Rubella","Shingles","Smallpox","Swine Flu","t-Virus","Zika virus"];
    var res = Math.floor(Math.random() * examples.length);
    return examples[res];
}


// ***FOR TEST*** Remove 10 infected
function kill(){
    infected.total -= 10;
    update();
}

////////// SAVE LOAD //////////
function save(){
    try{
        // Update properties object with all current values
        properties = {
            virusName: virusName,
            infected: infected,
            replication: replication,
            trPath: trPath,
            symptoms: symptoms,
            adUpgrades: adUpgrades,
            trUpgrades: trUpgrades
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

        for (var i in trUpgrades){
            if (trUpgrades[i] == 1){
                document.getElementById(i).style.display = 'none';
            }
        }

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
        if (typeof savegame.symptoms !== "undefined"){
            symptoms = savegame.symptoms;
        }
        if (typeof savegame.adUpgrades !== "undefined"){
            adUpgrades = savegame.adUpgrades;
        }
        if (typeof savegame.trUpgrades !== "undefined"){
            trUpgrades = savegame.trUpgrades;
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
    var confdel = confirm('Are you sure you want to delete the saved game ?'); //Check the player really wanted to do that.
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


///// GAME LOOP /////
var run = 
    window.setInterval(function(){
    autoInfect();
    update();
}, refresh);