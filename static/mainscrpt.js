// Init
$('.btn-sm').popover();
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var version = 0.1;

////////// PROPERTIES/VARIABLES //////////
var virusName = "",

infected = {
	name:'infected',
	total:1,
    increment:1,
    virulence: 0,
    deaths: 0,
    doctors: 50,
    virmultiplier: 1, // Additive general multiplier from upgrades.
    incrmultiplier: 1, // Multiplier for infection (Click and auto).
    multiplier: 1 // Multiplier for cost increase.
},

replication = {
	name:'replication',
    total:0,
    auto:false,
    chance:0.1
},

listUpgrades = {
    transmission:[],
    symptoms:[],
    adaptation:[]
}

trPath = {
    name:'None',
    increment:0
}

symptoms = {
    cough: 0,
    sneeze: 0,
    headache: 0,
    nausea: 0,
    cyst: 0,
    pneumonia: 0,
    migraine: 0,
    vomit: 0
}

sympCost = {
    cough: 40,
    sneeze: 50,
    headache: 20,
    nausea: 20,
    cyst: 40,
    pneumonia: 80,
    migraine: 60,
    vomit: 60
}

adUpgrades = {
    autoRep: 0,
    motility: 0,
    energy: 0,
    trans1: 0,
    ev1: 0,
    heat1: 0,
    cold1: 0
}

trUpgrades = {
    // Droplet
    mucus: 0,
    breath: 0,
    saliva: 0,
    // Sit and Wait
    suspension1: 0,
    envelope: 0,
    multiply: 0,
    burst1: 0,
    // Vector
    // Contact
}

visibility = {
    // List the id of each option, if 1 it is visible and if 0 invisible. 
    // Update each time an option is added.
    // Basic
    virul: 0,
    deaths: 0,
    // Transmission
    choosePath: 1,
    droplet: 0,
    breath: 1,
    mucus: 1,
    saliva: 1,
    sitwait: 0,
    envelope: 1,
    suspension1: 1,
    multiply: 1,
    burst1: 0,
    vector: 0,
    contact: 0,
    //Symptom
    cough: 1,
    sneeze: 1,
    headache: 1,
    nausea: 1,
    cyst: 0,
    pneumonia: 0,
    migraine: 0,
    vomit: 0,
    //Adaptation
    autoRep: 1,
    heat1: 1,
    cold1: 1,
    motility: 0,
    energy: 0,
    ev1: 0,
}

// Container of all properties.
properties = {
    virusName: virusName,
    infected: infected,
    replication: replication,
    listUpgrades: listUpgrades,
    trPath: trPath,
    symptoms: symptoms,
    sympCost: sympCost,
    adUpgrades: adUpgrades,
    trUpgrades: trUpgrades,
    visibility: visibility
};

// Gap (in ms) between each time the game loop is fired (Tick rate)...
var refresh = 666;
// Initialise message timer...
var msg = setTimeout(function(){}, 0);

////////// CLICK AND BUY FUNCTIONS //////////

// Click on infect button
function infect(){
    var increase = infected.increment * infected.incrmultiplier * infected.virmultiplier;
    increase = checkResistance(increase);
    if (increase <= 1){
        increase = 1;
    }
    infected.total += increase;
    if (replication.total >= 50){
        increase /= 10;
    }
    for(var i=0; i < (increase); i++){
        randomchance(increase);
    }
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
        visibility.droplet = 1;
    }
    else if (path == 'sitwait'){
        trPath.increment = 0.5;
        visibility.sitwait = 1;
    }
    else if (path == 'vector'){
        trPath.increment = 1;
        visibility.vector = 1;
    }
    else if (path == 'contact'){
        trPath.increment = 1;
        visibility.contact = 1;
    }
    else{
        console.log("Unknown transmission type")
        trPath.name = "None";
    }
    visibility.choosePath = 0;
}

// Handle all upgrades for the Droplet path
// Droplet path is designed as a basic reliable path with lower peaks but works in combination well with symptoms.
function dropletUpgrade(upgrade){
    if (upgrade == 'mucus' && replication.total >= 10 && trUpgrades.mucus == 0){
        listUpgrades.transmission.push(" Mucus");
        trUpgrades.mucus = 1;
        replication.total -= 10;
        trPath.increment += 12;
        if (symptoms.sneeze == 1){
            trPath.increment += 5;
        }
        visibility.mucus = 0;
        update();
    }
    if (upgrade == 'breath' && replication.total >= 10 && trUpgrades.breath == 0){
        listUpgrades.transmission.push(" Breath");
        trUpgrades.breath = 1;
        replication.total -= 10;
        trPath.increment += 9;
        if (symptoms.cough == 1){
            trPath.increment += 5;
        }
        visibility.breath = 0;
        update();
    }
    if (upgrade == 'saliva' && replication.total >= 25 && trUpgrades.saliva == 0){
        listUpgrades.transmission.push(" Saliva");
        trUpgrades.saliva = 1;
        replication.total -= 25;
        trPath.increment += 30;
        if (symptoms.vomit == 1){
            trPath.increment += 10;
        }
        visibility.saliva = 0;
        update();
    }
}

// Handle all upgrades for the Sit and Wait path
// Sit and Wait path is a slow gaining path that has comparitively higher Replication and explodes Infected once certain points have been reached.
function waitUpgrade(upgrade){
    if (upgrade == 'suspension1' && replication.total >= 5 && trUpgrades.suspension1 == 0){
        listUpgrades.transmission.push(" Suspension 1");
        trUpgrades.suspension1 = 1;
        replication.total -= 5;
        replication.chance += 0.05;
        trPath.increment += 0.1;
        if(trUpgrades.envelope == 1 && trUpgrades.multiply == 1){
            visibility.burst1 = 1;
        }
        visibility.suspension1 = 0;
        update();
    }
    if (upgrade == 'envelope' && replication.total >= 25 && trUpgrades.envelope == 0){
        listUpgrades.transmission.push(" Non-Enveloped Virus");
        trUpgrades.envelope = 1;
        replication.total -= 25;
        trPath.increment += 0.1;
        if(trUpgrades.suspension1 == 1 && trUpgrades.multiply == 1){
            visibility.burst1 = 1;
        }
        visibility.envelope = 0;
        update();
    }
    if (upgrade == 'multiply' && replication.total >= 25 && trUpgrades.multiply == 0){
        listUpgrades.transmission.push(" Multiplication");
        trUpgrades.multiply = 1;
        replication.total -= 25;
        replication.chance += 0.1;
        trPath.increment += 0.1;
        if(trUpgrades.envelope == 1 && trUpgrades.suspension1 == 1){
            visibility.burst1 = 1;
        }
        visibility.multiply = 0;
        update();
    }
    if (upgrade == 'burst1' && replication.total >= 150 && trUpgrades.burst1 == 0){
        listUpgrades.transmission.push(" Burst(1)");
        trPath.increment += 200;
        replication.chance -= 1;
        setTimeout(function(){trPath.increment -= 200; replication.chance += 1;}, 5000);
        trUpgrades.burst1 = 1;
        replication.total -= 150;
        trPath.increment += 15;
        visibility.burst1 = 0;
        update();
    }
}

// Handle all upgrades for the Vector path
// Gambler path - begins similar to Droplet but later higher potential (and risk) from Random Events.
function vectorUpgrade(upgrade){
}

// Handle all upgrades for the Contact path
// A path with lower spread to begin with, but can kill and gain virulence much easier later.
function contactUpgrade(upgrade){
}

////////// SYMPTOMS ///////////

function buySymptom(upgrade){
    // Cough
    if (upgrade == 'cough' && infected.total > (sympCost.cough) && symptoms.cough == 0){
        if(listUpgrades.symptoms == ""){
            visibility.ev1 = 1;
        }
        listUpgrades.symptoms.push(" Coughing");
        symptoms.cough = 1;
        infected.total -= sympCost.cough;
        infected.increment += 3;
        trPath.increment += 1;
        infected.virulence += 1;
        if (trUpgrades.breath == 1){
            trPath.increment += 1;
        }
        costUpdate(infected.multiplier);
        visibility.cough = 0;
        update();
    }

    // Sneeze
    if (upgrade == 'sneeze' && infected.total > (sympCost.sneeze) && symptoms.sneeze == 0){
        if(listUpgrades.symptoms == ""){
            visibility.ev1 = 1;
        }
        listUpgrades.symptoms.push(" Sneezing");
        symptoms.sneeze = 1;
        infected.total -= sympCost.sneeze;
        infected.increment += 5;
        trPath.increment += 2;
        infected.virulence += 1;
        if (trUpgrades.mucus == 1){
            trPath.increment += 1;
        }
        infected.multiplier += 0.1;
        visibility.sneeze = 0;
        costUpdate(infected.multiplier);
        update();
    }

    // Headache
    if (upgrade == 'headache' && infected.total > (sympCost.headache) && symptoms.headache == 0){
        if(listUpgrades.symptoms == ""){
            visibility.ev1 = 1;
        }
        listUpgrades.symptoms.push(" Headache");
        symptoms.headache = 1;
        infected.total -= sympCost.headache;
        infected.doctors -= 3;
        infected.virulence += 3;
        infected.multiplier += 0.1;
        visibility.headache = 0;
        costUpdate(infected.multiplier);
        update();
    }

    // Nausea
    if (upgrade == 'nausea' && infected.total > (sympCost.nausea) && symptoms.nausea == 0){
        if(listUpgrades.symptoms == ""){
            visibility.ev1 = 1;
        }
        listUpgrades.symptoms.push(" Nausea");
        symptoms.nausea = 1;
        infected.total -= sympCost.nausea;
        infected.increment += 1;
        trPath.increment += 0.5;
        infected.virulence += 1;
        visibility.nausea = 0;
        costUpdate(infected.multiplier);
        update();
    }

    // Cyst
    if (upgrade == 'cyst' && infected.total > (sympCost.cyst) && symptoms.cyst == 0){
        listUpgrades.symptoms.push(" Cysts");
        symptoms.cyst = 1;
        infected.total -= sympCost.cyst;
        infected.increment += 2;
        trPath.increment += 1;
        infected.virulence += 2;
        infected.doctors += 1;
        visibility.cyst = 0;
        costUpdate(infected.multiplier);
        update();
    }

    // Pneumonia
    if (upgrade == 'pneumonia' && infected.total > (sympCost.pneumonia) && symptoms.pneumonia == 0){
        listUpgrades.symptoms.push(" Pneumonia");
        symptoms.pneumonia = 1;
        infected.total -= sympCost.pneumonia;
        infected.increment += 3;
        if (adUpgrades.cold1 == 1){
            trPath.increment += 0.75;
        }
        trPath.increment += 1;
        infected.virulence += 2;
        infected.doctors += 1;
        visibility.pneumonia = 0;
        costUpdate(infected.multiplier);
        update();
    }

    // Migraine
    if (upgrade == 'migraine' && infected.total > (sympCost.migraine) && symptoms.migraine == 0){
        listUpgrades.symptoms.push(" Migraines");
        symptoms.migraine = 1;
        infected.total -= sympCost.migraine;
        infected.increment += 1;
        trPath.increment += 0.5;
        infected.virulence += 4;
        infected.doctors -= 4;
        visibility.migraine = 0;
        costUpdate(infected.multiplier);
        update();
    }

    // Vomit
    if (upgrade == 'vomit' && infected.total > (sympCost.vomit) && symptoms.vomit == 0){
        listUpgrades.symptoms.push(" Vomiting");
        symptoms.vomit = 1;
        infected.total -= sympCost.vomit;
        infected.increment += 3;
        trPath.increment += 1.5;
        if(trUpgrades.saliva == 1){
            trPath.increment += 2;
        }
        infected.virulence += 1;
        infected.doctors += 2;
        visibility.vomit = 0;
        costUpdate(infected.multiplier);
        update();
    }
}

////////// ADAPTATIONS ////////

function adapUpgrade(upgrade){
    if (upgrade == 'autoRep' && replication.total >= 5 && adUpgrades.autoRep == 0){
        listUpgrades.adaptation.push(" Auto-Replicate");
        adUpgrades.autoRep = 1;
        replication.total -= 5;
        replication.auto = true;
        visibility.motility = 1;
        visibility.autoRep = 0;
        update();
    }
    if (upgrade == 'motility' && infected.total > 150 && infected.virulence >= 5 && adUpgrades.motility == 0){
        listUpgrades.adaptation.push(" Motility");
        adUpgrades.motility = 1;
        infected.total -= 150;
        infected.virmultiplier += 1;
        visibility.energy = 1;
        visibility.motility = 0;
        update();
    }
    if (upgrade == 'energy' && infected.total > 1000 && infected.virulence >= 10 && adUpgrades.energy == 0){
        listUpgrades.adaptation.push(" Energy Drain");
        adUpgrades.energy = 1;
        infected.total -= 1000;
        infected.virmultiplier += 2;
        visibility.energy = 0;
        update();
    }
    if (upgrade == 'heat1' && replication.total >=10 && infected.total > 100 && adUpgrades.heat1 == 0){
        listUpgrades.adaptation.push(" Heat Resistance 1");
        replication.total -= 10;
        infected.total -= 100;
        adUpgrades.heat1 = 1;
        visibility.heat1 = 0;
        update();
    }
    if (upgrade == 'cold1' && replication.total >=10 && infected.total > 100 && adUpgrades.cold1 == 0){
        listUpgrades.adaptation.push(" Cold Resistance 1");
        replication.total -= 10;
        infected.total -= 100;
        adUpgrades.cold1 = 1;
        visibility.cold1 = 0;
        update();
    }
    if (upgrade =='ev1' && infected.virulence >= 3 && adUpgrades.ev1 == 0){
        adUpgrades.ev1 = 1;
        visibility.ev1 = 0;
        visibility.cyst = visibility.pneumonia = visibility.migraine = visibility.vomit = 1;
        update();
    }
}

////////// HELPER FUNCTIONS //////////

// Update display. Update this function for each added property
function update(){
    if (infected.total <= 0){
        //game is lost
        document.getElementById("infected").innerHTML = 0;
        loss();
    }
    // Get the current properties
    document.getElementById('virusName').innerHTML = virusName;
    document.getElementById("infected").innerHTML = format(infected.total);
    document.getElementById("replication").innerHTML = format(replication.total);
    if(listUpgrades.symptoms.length > 0){
        visibility.virul = 1;
        document.getElementById("virulence").innerHTML = ("Virulence: " + infected.virulence);
        $("#virul").show();
    }
    if(infected.virmultiplier == 1){
        $("#virMultiplier").hide();
    }
    if(infected.multiplier > 1){
        $("#virMultiplier").show();
        document.getElementById("virMultiplierCount").innerHTML = Math.round(infected.multiplier);
    }

    // Update the lists of upgrades and display the correct possible upgrades.
    if (trPath.name != "None" && listUpgrades.transmission.length > 0){
        document.getElementById(trPath.name[0] + 'upgradeList').innerHTML = listUpgrades.transmission;
    }

    if (listUpgrades.adaptation.length > 0){
        document.getElementById("adapList").innerHTML = listUpgrades.adaptation;
    }
    if (listUpgrades.symptoms.length > 0){
        document.getElementById("sympList").innerHTML = listUpgrades.symptoms;
    }
    loadButtons();
}

function loadButtons(){
    for(element in visibility){
        if(visibility[element] == 1){
            $("#" + element).show();
        }
        if(visibility[element] == 0){
            $("#" + element).hide();
        }
    }
}

// Game lost
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
    if(trPath.name != "None"){
        var increase = trPath.increment * infected.incrmultiplier;
        increase = checkResistance(increase);
        infected.total += increase;
        if (replication.auto == true){
            for(var i=0; i < (increase / 5); i++){
                randomchance(increase);
            }
        }
    }
}

// Slow infection if doesn't have resistances.
function checkResistance(incr){
    // Heat
    if (adUpgrades.heat1 == 0 && infected.total > 500){
        incr /= 25;
    }
    if (adUpgrades.heat1 == 0 && infected.total > 750){
        incr /= 50;
    }
    if (adUpgrades.heat1 == 0 && infected.total > 1000){
        incr /= 100;
    }
    // Cold
    if (adUpgrades.cold1 == 0 && infected.total > 500){
        incr /= 25;
    }
    if (adUpgrades.cold1 == 0 && infected.total > 750){
        incr /= 50;
    }
    if (adUpgrades.cold1 == 0 && infected.total > 1000){
        incr /= 100;
    }
    // Medication
    // None yet

    return incr;
}


// Update costs for each symptom.
function costUpdate(multiplier){
    for (var symptom in sympCost){
        // Remove current cost from string
        var current = document.getElementById(symptom);
        current.dataset.content = current.dataset.content.substring(0, current.dataset.content.length - (" Infected.").length);
        // If page being reloaded
        if(current.dataset.content.substr(current.dataset.content.length - 3) == 00){ 
            current.dataset.content = current.dataset.content.substring(0, current.dataset.content.length - 2);
        }
        else {
            var commas = (format(sympCost[symptom]).split(",").length - 1); // Work out the number of commas in order to subtract them from the existing string.
            var len = String(sympCost[symptom]).length;
            current.dataset.content = current.dataset.content.substring(0, current.dataset.content.length - (len + commas));
        }
        // Calculate new cost
        sympCost[symptom] = Math.floor(sympCost[symptom] * multiplier);
        // Update cost to user
        sympCost[symptom] = Math.round(sympCost[symptom]);
        current.dataset.content += " ";
        current.dataset.content += format(sympCost[symptom]);
        current.dataset.content += " Infected.";
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
function randomchance(incr){
    var ran = Math.random();
    if (ran < replication.chance){
        replication.total += incr;
    }
}

// Put commas in large numbers (e.g 1,000,000)
function format(text) {
    var format = Math.round(text)
    format = Number(text.toFixed(0)).toLocaleString().split(/\s/).join(',');
    return format;
}

// Clear messages, if button pressed while a message is already displayed.
function clearmsg() {
    clearTimeout(msg)
    document.getElementById("suc").innerHTML = "";
    document.getElementById("err").innerHTML = "";
}

// Autoload on page refresh
// Warn for mobile users. Probably keep this after mobile version (/mobile) is implemented.
document.addEventListener("DOMContentLoaded", function(){
    if (isMobile) {
        window.location.replace("/mobile");
        $('#modMob').modal();
    }
    update();
});

// Load save game if there is one, if not, setup a new game.
window.onload = function() {
    var savedgame = JSON.parse(localStorage.getItem("save"));
    try {
        if (typeof savedgame.infected !== "undefined"){
        load()
        console.log("Loaded save game from LocalStorage")
        }
    }
    catch(err){
        console.log("No save game to load");
        nameVirus();
        clearmsg();
        document.getElementById("suc").innerHTML = "Patient Zero infected...";
        msg = setTimeout(function(){document.getElementById("suc").innerHTML = ""}, 1000);
    }
    costUpdate(1);
};

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
            listUpgrades: listUpgrades,
            trPath: trPath,
            symptoms: symptoms,
            sympCost: sympCost,
            adUpgrades: adUpgrades,
            trUpgrades: trUpgrades,
            visibility: visibility
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

function tryload(){
    try{
        var savegame = JSON.parse(localStorage.getItem("save"));
        if (typeof savegame.virusName !== "undefined"){
            location.reload();
        }
    }

    catch(err){
        console.log("No save game to load");
        clearmsg();
        document.getElementById("err").innerHTML = "No save game to load";
        msg = setTimeout(function(){document.getElementById("err").innerHTML = ""}, 1000);
    }
}

function load(){

    try{
        // Get the save game
        var savegame = JSON.parse(localStorage.getItem("save"));

        // Cycle through each property, checking that it exists in the save game, and if it is, loading it.
        for (var property in savegame){
            window[property] = savegame[property];
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
            console.log("Save deleted.");
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