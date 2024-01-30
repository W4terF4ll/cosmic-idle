//current errors: enchants percent chance doesnt apply (intended)
//possible additions: let user know when pickaxe is maxed, let user know energy required for enchant, add more enchants, add cooldown to exchange
//possible additions cont.: add new bandit drops, balance game lol, add book types, add gear sets + enchant caps (?), add currency / chat to seperate tab thats always displayed?

var money = 0;
var energy = 0;
var level = 1;
var overflowExp = 0;

var mineSpeed = 200;
var isMining;
var blockMoney = 0;
var blockEnergy = 0;
var blockExp = 0;
var blockStrength = 0;
var banditType = 0;

var enchantChoices = [];
var enchantChances = [];
var superBreaking = 1;
var superTimer = 0;
var surgingOre = 1;
var surgingTimer = 0;
var powerballStrength = 1;
var powerballRunning = false;

var currentPickaxe = 0;
var currentGear = 0;

var bookCost = 20;
var bookAmount = 0;
var bookPages = 0;
var bookOpened = false;
var bookSuccess = 0;
var bookDestroy = 0;
var bookLevel = 0;
var bookEnchant = 0;

var banditHealth = 0;
var banditAlive = false;
var banditName = "";
var banditVariation = false;
var playerHealth = 20;
var playerRegen = false;

var shardCount = 0;

// Pickaxe enchant data
let enchants = [
	{
		name: "Efficiency",
		max: 6,
		current: 0
	},
	{
		name: "Ore Magnet",
		max: 5,
		current: 0
	},
	{
		name: "Energy Collector",
		max: 5,
		current: 0
	},
	{
		name: "Transfuse",
		max: 3,
		current: 0
	},
	{
		name: "Super Breaker",
		max: 5,
		current: 0
	},
	{
		name: "Ore Surge",
		max: 5,
		current: 0
	},
	{
		name: "Powerball",
		max: 3,
		current: 0
	},
	{
		name: "Shard Discoverer",
		max: 5,
		current: 0
	},
	{
		name: "Magnetism",
		max: 5,
		current: 0
	},
	{
		name: "Fracture",
		max: 5,
		current: 0
	},
	{
		name: "Lucky",
		max: 4,
		current: 0
	},
	{
		name: "Shatter",
		max: 6,
		current: 0
	},
	{
		name: "Combo Rupture",
		max: 5,
		current: 0
	},
];

// Gear enchant data
// Rarity: 0 = common, 1 = uncommon, etc
// Gear: 0 = sword, 1 = helment, etc
let gearEnchants = [
	{
		name: "Blood Money",
		rarity: 0,
		gear: 3,
		max: 5,
		current: 0
	},
	{
		name: "Maneuver",
		rarity: 0,
		gear: 4,
		max: 3,
		current: 0
	},
	{
		name: "Vigor",
		rarity: 0,
		gear: 2,
		max: 5,
		current: 0
	},
	{
		name: "Scorch",
		rarity: 1,
		gear: 1,
		max: 3,
		current: 0
	},
];

// Pickaxe cost data
let pickaxes = [
	{
		name: "Wooden",
		nextCost: 50,
		nextLevel: 30
	},
	{
		name: "Stone",
		nextCost: 100,
		nextLevel: 50
	},
	{
		name: "Gold",
		nextCost: 200,
		nextLevel: 70
	},
	{
		name: "Iron",
		nextCost: 500,
		nextLevel: 90
	},
	{
		name: "Diamond",
		nextCost: 1000,
		nextLevel: 1000
	},
];

// Gear cost data
let gear = [
	{
		armorName: "Chain",
		swordName: "Wood",
		nextCost: 200,
		nextLevel: 30
	},
	{
		armorName: "Gold",
		swordName: "Stone",
		nextCost: 500,
		nextLevel: 60
	},
	{
		armorName: "Iron",
		swordName: "Iron",
		nextCost: 10000,
		nextLevel: 100
	},
	{
		armorName: "Diamond",
		swordName: "Diamond",
		nextCost: 99999999,
		nextLevel: 999
	},
];

// Mine value data
let mines = [
	{
		name: "Coal mines",
		money: 0.2,
		energy: 1,
		exp: 1,
		strength: 0,
		bandits: 0
	},
	{
		name: "Iron mines",
		money: 0.5,
		energy: 1.4,
		exp: 4,
		strength: 0,
		bandits: 0
	},
	{
		name: "Lapis mines",
		money: 1.1,
		energy: 2,
		exp: 20,
		strength: 2000,
		bandits: 1
	},
	{
		name: "Redstone mines",
		money: 2.6,
		energy: 3.2,
		exp: 120,
		strength: 4000,
		bandits: 2
	},
	{
		name: "Gold mines",
		money: 5.4,
		energy: 4.5,
		exp: 740,
		strength: 6000,
		bandits: 2
	},
	{
		name: "Diamond mines",
		money: 12.4,
		energy: 7.3,
		exp: 2400,
		strength: 8000,
		bandits: 3
	},
];

// Bandit value data
let bandits = [
	{
		name: "Coal bandit",
		exp: 200,
		altName: "Iron bandit",
		altExp: 400,
		health: 100,
		damage: 1
	},
	{
		name: "Lapis bandit",
		exp: 4000,
		altName: "Redstone bandit",
		altExp: 24000,
		health: 150,
		damage: 2
	},
	{
		name: "Redstone bandit",
		exp: 24000,
		altName: "Gold bandit",
		altExp: 148000,
		health: 200,
		damage: 4
	},
	{
		name: "Diamond bandit",
		exp: 480000,
		altName: "Emerald bandit",
		altExp: 1000000,
		health: 250,
		damage: 6
	},
];

// Radio command so only one location can be selected
const inps=document.querySelectorAll(".input-wrapper input");
inps.forEach(e=>e.addEventListener("click",ev=>{
  e.checked=e!==inps.last;
  inps.last=e.checked?e:null
}))

// Tab selection
function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

// Stops/starts mining, sets base block values
function travelMine(num) {
	stopMining();
	blockMoney = mines[num].money;
	blockEnergy = mines[num].energy;
	blockExp = mines[num].exp;
	blockStrength = mines[num].strength;
	banditType = mines[num].bandits;
	startMining();
}

// Starts mining
function startMining() {
	isMining = setInterval(function(){mining()}, mineSpeed);
}

// Gives money & energy, procs enchants, calls itself
function mining() {
	var luckyMod = 1 + (enchants[10].current / 10);
	var shatterMod = 1;
	var comboMod = 1;
	var exp = document.getElementById("levelProgress");
	var expHold = 0;
	var randomChance = Math.floor(Math.random() * 100) + 1;
	var transfuseMod = 1;
	if (luckyMod * enchants[3].current * 5 > randomChance) {
		transfuseMod = 2;
	}
	randomChance = Math.floor(Math.random() * 100) + 1;
	if (luckyMod * enchants[4].current * 2 > randomChance && superBreaking == 1) {
		superBreaking = 2;
		superTimer = (5 * enchants[4].current);
	} else if (superBreaking == 2) {
		if (superTimer > 0) {
			superTimer -= 1;
		} else {
			superBreaking = 1;
		}
	}
	randomChance = Math.floor(Math.random() * 100) + 1;
	if (luckyMod * enchants[5].current * 2 > randomChance && surgingOre == 1) {
		surgingOre = 2;
		surgingTimer = (3 * enchants[5].current);
	} else if (surgingOre == 2) {
		if (surgingTimer > 0) {
			surgingTimer -= 1;
		} else {
			surgingOre = 1;
		}
	}
	randomChance = Math.floor(Math.random() * 100) + 1;
	if (enchants[11].current > 0 && (1 * luckyMod > randomChance)) {
		shatterMod = 3 * enchants[11].current;
	} else {
		randomChance = Math.floor(Math.random() * 100) + 1;
		if (enchants[12].current + luckyMod > randomChance) {
			comboMod = 10;
		}
	}
	randomChance = Math.floor(Math.random() * 300) + 1;
	if (luckyMod + enchants[7].current + 2 > randomChance) {
		shardCount += 1;
	}
	expHold = blockExp * (enchants[1].current + 1) * transfuseMod * surgingOre * (1 + (enchants[8].current / 10)) * (1 + enchants[9].current) * shatterMod * comboMod;
	if (expHold > document.getElementById("levelProgress").value) {
			overflowExp += expHold - document.getElementById("levelProgress").value;
	}
	exp.value += expHold;
	money += blockMoney * (enchants[1].current + 1) * transfuseMod * surgingOre * (1 + (enchants[8].current / 10)) * (1 + enchants[9].current) * shatterMod * comboMod;
	energy += blockEnergy * (enchants[2].current + 1) * transfuseMod * (1 + enchants[9].current) * shatterMod * comboMod; 
	clearInterval(isMining);
	var realMineSpeed = 25 + (((mineSpeed - ((enchants[0].current * 200) + (gearEnchants[2].current * 100))) / powerballStrength) / superBreaking) + (Math.max(0, (blockStrength - (currentPickaxe * 2000)) || 0));
	isMining = setInterval(function(){mining()}, realMineSpeed);
}

// Updates all relevant HTML constantly
HTMLupdater = setInterval(function(){
	document.getElementById("money").innerText = money.toFixed(1);
	document.getElementById("energy").innerText = energy.toFixed(1);
	document.getElementById("level").innerText = level;
	document.getElementById("bookCount").innerText = bookAmount;
	document.getElementById("pageCount").innerText = bookPages;
	document.getElementById("playerHealth").innerText = playerHealth;
	document.getElementById("shardDisplay").innerText = shardCount;
	if (document.getElementById("levelProgress").value >= document.getElementById("levelProgress").max) {
		levelUp();
		document.getElementById("levelProgress").value += overflowExp;
		overflowExp -= document.getElementById("levelProgress").max;
		if (overflowExp < 0) {
			overflowExp = 0;
		}
	}
	if (bookAmount > 0) {
		document.getElementById("buttonBookOpen").disabled = false;
	} else {
		document.getElementById("buttonBookOpen").disabled = true;
	}
	if (bookPages > 0 && bookOpened) {
		document.getElementById("buttonBookPaged").disabled = false;
		document.getElementById("buttonBookPagedAll").disabled = false;
	} else {
		document.getElementById("buttonBookPaged").disabled = true;
		document.getElementById("buttonBookPagedAll").disabled = true;
	}
	if (document.getElementById("bookProgress").value == document.getElementById("bookProgress").max && bookOpened && gearEnchants[bookEnchant].current < bookLevel) {
		if (gearEnchants[bookEnchant].gear < 5) {
			document.getElementById("buttonEnchant" + gearEnchants[bookEnchant].gear).disabled = false;
		}
	} else {
		for (i = 0; i <= 4; i++) {
			document.getElementById("buttonEnchant" + i).disabled = true;
		}
	}
	if (banditAlive) {
		document.getElementById("enemyName").innerText = banditName;
		document.getElementById("enemyHealth").innerText = "Health: " + banditHealth;
	} else {
		document.getElementById("enemyName").innerText = "";
		document.getElementById("enemyHealth").innerText = "";
	}
	if (shardCount > 0) {
		document.getElementById("buttonOpenShard").disabled = false;
	} else {
		document.getElementById("buttonOpenShard").disabled = true;
	}
	if (level >= 10) {
		document.getElementById("ironMineDiv").hidden = false;
	}
	if (level >= 30) {
		document.getElementById("lapisMineDiv").hidden = false;
		document.getElementById("minesDiv").style.height = "125";
	}
	if (level >= 50) {
		document.getElementById("redstoneMineDiv").hidden = false;
	}
	if (level >= 70) {
		document.getElementById("goldMineDiv").hidden = false;
		document.getElementById("minesDiv").style.height = "175";
	}
	if (level >= 90) {
		document.getElementById("diamondMineDiv").hidden = false;
	}
	if (money >= pickaxes[currentPickaxe].nextCost && level >= pickaxes[currentPickaxe].nextLevel) {
		document.getElementById("buttonPickaxeCost").disabled = false;
	} else {
		document.getElementById("buttonPickaxeCost").disabled = true;
	}
	if (money >= gear[currentGear].nextCost && level >= gear[currentGear].nextLevel) {
		document.getElementById("buttonGearCost").disabled = false;
	} else {
		document.getElementById("buttonGearCost").disabled = true;
	}
	if (energy >= bookCost) {
		document.getElementById("buttonBookBuy").disabled = false;
	} else {
		document.getElementById("buttonBookBuy").disabled = true;
	}
}, 20);

// Runs powerball enchant
function powerballLaunch() {
	const buttonPowerball = document.getElementById("buttonPowerball");
	if (powerballRunning == true) {
		powerballStrength = 1;
		powerballRunning = false;
	} else {
		buttonPowerball.disabled = true;
		powerballStrength = enchants[6].current + 1;
		powerballRunning = true;
		setTimeout(function() {
			powerballLaunch();
		}, 5000);
	}
	setTimeout(function() {
		if (enchants[6].current > 0) {
			buttonPowerball.disabled = false;
		}
	}, 30000);
}

// Stops mining
function stopMining() {
	clearInterval(isMining);
}

// Levels player up
function levelUp() {
	var exp = document.getElementById("levelProgress");
	shardCount += level;
	level += 1;
	exp.value = 0;
	exp.max = Math.floor(exp.max * 1.2);
}

// Pickaxe upgrader
function shopPickaxe() {
	money -= pickaxes[currentPickaxe].nextCost;
	currentPickaxe += 1;
	document.getElementById("pickaxeCost").innerText = pickaxes[currentPickaxe].nextCost;
	document.getElementById("pickaxeLevel").innerText = pickaxes[currentPickaxe].nextLevel;
	document.getElementById("pickaxeMaterial").innerText = pickaxes[currentPickaxe].name;
	document.getElementById("buttonPowerball").disabled = true;
	document.getElementById("pickaxeEnchants").innerText = "";
	for (let i = 0; i < enchants.length; i++) {
		enchants[i].current = 0;
	}
}

// Gear upgrader
function shopGear() {
	money -= gear[currentGear].nextCost;
	currentGear += 1;
	document.getElementById("gearCost").innerText = gear[currentGear].nextCost;
	document.getElementById("gearLevel").innerText = gear[currentGear].nextLevel;
	document.getElementById("swordMaterial").innerText = gear[currentGear].swordName;
	document.getElementById("helmetMaterial").innerText = gear[currentGear].armorName;
	document.getElementById("chestplateMaterial").innerText = gear[currentGear].armorName;
	document.getElementById("leggingsMaterial").innerText = gear[currentGear].armorName;
	document.getElementById("bootsMaterial").innerText = gear[currentGear].armorName;
}

// Buys books
function shopBook() {
	energy -= bookCost;
	bookAmount += 1;
}

// Converts money to energy
function shopEnergy() {
	energy += money * 2;
	money = 0;
}

//Converts energy to money
function shopMoney() {
	money += energy / 2;
	energy = 0;
}
	

// Deposits energy into pickaxe
function pickaxeDeposit() {
	var pickaxeProgress = document.getElementById("pickaxeProgress");
	var pickaxeEnchant = document.getElementById("buttonPickaxeEnchant");
	var neededEnergy = pickaxeProgress.max - pickaxeProgress.value
	if (energy >= neededEnergy) {
		pickaxeProgress.value += neededEnergy;
		energy = energy - neededEnergy;
	} else {
		pickaxeProgress.value += energy;
		energy = 0;
	}
	if (pickaxeProgress.value == pickaxeProgress.max) {
		buttonPickaxeEnchant.disabled = false;
	}
}

// Displays enchant options if avaliable, sets next pickaxe enchant cost
function pickaxeEnchant() {
	enchantChoices = [];
	enchantChances = [];
	var pickaxeProgress = document.getElementById("pickaxeProgress");
	var pickaxeEnchant = document.getElementById("buttonPickaxeEnchant");
	buttonPickaxeEnchant.disabled = true;
	pickaxeProgress.value = 0;
	pickaxeProgress.max = pickaxeProgress.max + 5;
	const enchantOptions = document.querySelectorAll(".enchantOption");
	const enchantButtons = document.querySelectorAll(".buttonEnchantOption");
	var count = 0;
	for (let i = 0; i < enchants.length; i++) {
		if (enchants[i].current == enchants[i].max) {
			count++;
		}
	}
	if (count == enchants.length) {
		return;
	}
	for (let i = 0; i < enchantOptions.length; i++) {
		var randomEnchant = Math.floor(Math.random() * (enchants.length));
		while (enchants[randomEnchant].current == enchants[randomEnchant].max) {
			randomEnchant = Math.floor(Math.random() * (enchants.length));
		}
		var randomChance = Math.floor(Math.random() * 100) + 1;
		enchantChoices.push(randomEnchant);
		enchantChances.push(randomChance);
		enchantOptions[i].innerText = enchants[randomEnchant].name + " " + (enchants[randomEnchant].current + 1) + "  " + randomChance + "%" ;
		enchantButtons[i].hidden = false;
	}
}

// Enchants pickaxe from avaliable options
function pickaxeSelect(choice) {
	enchants[enchantChoices[choice]].current += 1;
	enchantChoices = [];
	enchantChances = [];
	const enchantOptions = document.querySelectorAll(".enchantOption");
	const enchantButtons = document.querySelectorAll(".buttonEnchantOption");
	const enchantDisplay = document.getElementById("pickaxeEnchants");
	const buttonPowerball = document.getElementById("buttonPowerball");
	for (let i = 0; i < enchantOptions.length; i++) {
		enchantOptions[i].innerText = "";
		enchantButtons[i].hidden = true;
	}
	var enchantString = "";
	for (let i = 0; i < enchants.length; i++) {
		if (enchants[i].current > 0) {
			enchantString += enchants[i].name + " " + enchants[i].current + "\n";
			if (enchants[i].name == "Powerball") {
				buttonPowerball.disabled = false;
			}
		}
	}
	enchantDisplay.innerText = enchantString;
}

// Opens books
function bookOpen() {
	bookAmount -= 1;
	bookOpened = true;
	document.getElementById("buttonBookDeposit").disabled = false;
	document.getElementById("buttonBookSalvage").disabled = false;
	document.getElementById("bookProgress").value = 0;
	document.getElementById("bookProgress").max = 10;
	bookEnchant = Math.floor(Math.random() * (gearEnchants.length));
	bookLevel = Math.floor(Math.random() * (gearEnchants[bookEnchant].max - 1)) + 1;
	bookSuccess = Math.floor(Math.random() * 99) + 1;
	bookDestroy = Math.floor(Math.random() * 99) + 1;
	document.getElementById("bookDisplay").innerText = gearEnchants[bookEnchant].name + " " + bookLevel;
	document.getElementById("successDisplay").innerText = "Enchant: " + bookSuccess + "%";
	document.getElementById("failureDisplay").innerText = "Destroy: " + bookDestroy + "%";
}

// Closes books
function bookClosed() {
	bookOpened = false;
	bookSuccess = 0;
	bookDestroy = 0;
	buttonBookUpgrade.disabled = true;
	document.getElementById("bookProgress").value = 0;
	document.getElementById("bookDisplay").innerText = "";
	document.getElementById("successDisplay").innerText = "";
	document.getElementById("failureDisplay").innerText = "";
	document.getElementById("buttonBookDeposit").disabled = true;
	document.getElementById("buttonBookSalvage").disabled = true;
}

// Adds energy to book
function bookDeposit() {
	var bookProgress = document.getElementById("bookProgress");
	var bookUpgrade = document.getElementById("buttonBookUpgrade");
	var neededEnergy = bookProgress.max - bookProgress.value
	if (energy >= neededEnergy) {
		bookProgress.value += neededEnergy;
		energy = energy - neededEnergy;
	} else {
		bookProgress.value += energy;
		energy = 0;
	}
	if (bookProgress.value == bookProgress.max) {
		if (bookLevel == gearEnchants[bookEnchant].max) {
			buttonBookUpgrade.disabled = true;
		} else {
			buttonBookUpgrade.disabled = false;
		}
	}
}

// Attempts book upgrade
function bookUpgrade() {
	var randomDestroy = Math.floor(Math.random() * 99) + 1;
	buttonBookUpgrade.disabled = true;
	document.getElementById("bookProgress").value = 0;
	if (randomDestroy < bookDestroy) {
		bookPages += Math.floor(bookLevel + Math.abs((bookDestroy - 100) / (7 + (Math.random() * 5))));
		bookClosed();
	} else if (randomDestroy >= bookDestroy && gearEnchants[bookEnchant].max > bookLevel) {
		bookLevel += 1;
		document.getElementById("bookProgress").max += document.getElementById("bookProgress").max * 2;
		document.getElementById("bookDisplay").innerText = gearEnchants[bookEnchant].name + " " + bookLevel;
	}
}

// Salvages book energy
function bookSalvage() {
	energy += document.getElementById("bookProgress").value + (document.getElementById("bookProgress").max / 10);
	bookClosed();
}

// Pages book odds
function bookPaged() {
	if (bookSuccess < 100 || bookDestroy > 0) {
		bookPages -= 1;
		if (bookSuccess < 100) {
			bookSuccess += 1;
		}
		if (bookDestroy > 0) {
			bookDestroy -= 1;
		}
	}
	document.getElementById("successDisplay").innerText = "Enchant: " + bookSuccess + "%";
	document.getElementById("failureDisplay").innerText = "Destroy: " + bookDestroy + "%";
}

// Uses all pages
function bookPagedAll() {
	while (bookPages > 0 && (bookSuccess < 100 || bookDestroy > 0)) {
		bookPages -= 1;
		if (bookSuccess < 100) {
			bookSuccess += 1;
		}
		if (bookDestroy > 0) {
			bookDestroy -= 1;
		}
	}
	document.getElementById("successDisplay").innerText = "Enchant: " + bookSuccess + "%";
	document.getElementById("failureDisplay").innerText = "Destroy: " + bookDestroy + "%";
}

// Views selected equipment
var previous;
window.onload = function() {
    previous = document.getElementById("swordDiv");
};
function equipSelect() {
	var equipChoice = document.getElementById("equipmentOptions").value;
	previous.hidden = true;
	if (equipChoice == "sword") {
		previous = document.getElementById("swordDiv");
		previous.hidden = false;
	} else if (equipChoice == "helmet") {
		previous = document.getElementById("helmetDiv");
		previous.hidden = false;
	} else if (equipChoice == "chestplate") {
		previous = document.getElementById("chestplateDiv");
		previous.hidden = false;
	} else if (equipChoice == "leggings") {
		previous = document.getElementById("leggingsDiv");
		previous.hidden = false;
	} else if (equipChoice == "boots") {
		previous = document.getElementById("bootsDiv");
		previous.hidden = false;
	}
}

// Enchants equipment from book
function equipEnchant(num) {
	gearEnchants[bookEnchant].current = bookLevel;
	var enchantString = "";
	for (let i = 0; i < gearEnchants.length; i++) {
		if (gearEnchants[i].current > 0 && gearEnchants[i].gear == num) {
			enchantString += gearEnchants[i].name + " " + gearEnchants[i].current + "\n";
		}
	}
	document.getElementById(num + "Enchants").innerText = enchantString;
	bookClosed();
}

// Finds a bandit to fight
function combatSearch() {
	var randomBandit = Math.floor(Math.random() * 99) + 1;
	banditHealth = bandits[banditType].health;
	if (randomBandit < 75) {
		banditName = bandits[banditType].name;
		banditVariation = false;
	} else {
		banditName = bandits[banditType].altName;
		banditVariation = true;
	}
	document.getElementById("buttonCombatRun").disabled = false;
	document.getElementById("buttonCombatAttack").disabled = false;
	banditAlive = true;
	setTimeout(function() {
		if (banditAlive) {
			combatBanditAttack();
		}
	}, 800);
}

// Regens player when out of combat
function combatRegen() {
	if (playerHealth < 20) {
		playerHealth += 1;
	}
	setTimeout(function() {
		if (!banditAlive) {
			combatRegen();
		} else {
			playerRegen = false;
		}
	}, 2000);
}

// Runs from bandit
function combatRun() {
	combatBanditDeath();
}

// Runs on bandit death or flee
function combatBanditDeath() {
	document.getElementById("buttonCombatRun").disabled = true;
	document.getElementById("buttonCombatAttack").disabled = true;
	banditAlive = false;
	banditName = "";
	setTimeout(function() {
		if (!banditAlive && !playerRegen) {
			playerRegen = true;
			combatRegen();
		}
	}, 2000);
}

// Runs on player death
function combatDeath() {
	playerHealth = 1;
	combatBanditDeath();
	document.getElementById("buttonCombatSearch").disabled = true;
	setTimeout(function() {
		document.getElementById("buttonCombatSearch").disabled = false;
	}, 60000);
}

// Bandit attacks player
function combatBanditAttack() {
	var randomInt = Math.floor(Math.random() * 99) + 1;
	if (randomInt > (gearEnchants[1].current * 10)) {
		playerHealth -= 1 + (bandits[banditType].damage - currentGear);
	}
	randomInt = Math.floor(Math.random() * 99) + 1;
	if (randomInt < (gearEnchants[3].current * 3)) {
		banditHealth -= 10;
	}
	if (playerHealth <= 0) {
		combatDeath();
	}
	setTimeout(function() {
		if (banditAlive) {
			combatBanditAttack();
		}
	}, 1600);
}

// Player attacks bandit
function combatAttack() {
	banditHealth -= 10 + (2 * currentGear);
	if (banditHealth <= 0) {
		combatBanditLoot();
		combatBanditDeath();
	}
	document.getElementById("buttonCombatAttack").disabled = true;
	setTimeout(function() {
		if (banditAlive) {
			document.getElementById("buttonCombatAttack").disabled = false;
		}
	}, 400);
}

// Recieve loot from bandit
function combatBanditLoot() {
	var exp = document.getElementById("levelProgress");
	if (!banditVariation) {
		if (bandits[banditType].exp > document.getElementById("levelProgress").value) {
			overflowExp += bandits[banditType].exp - document.getElementById("levelProgress").value;
		}
		exp.value += bandits[banditType].exp;
	} else {
		if (bandits[banditType].altExp > document.getElementById("levelProgress").value) {
			overflowExp += bandits[banditType].altExp - document.getElementById("levelProgress").value;
		}
		exp.value += bandits[banditType].altExp;
	}
	if (gearEnchants[0].current > 0) {
		money += (bandits[banditType].exp / 100) * gearEnchants[0].current;
	}
}

// Open shard
function openShard() {
	shardCount -= 1;
	var randomChance = Math.floor(Math.random() * 100) + 1;
	var randomCount = Math.floor(Math.random() * 10) + 1;
	if (randomChance <= 90) {
		money += 1.2 * randomCount * (1 + (level / 10));
	} else if (randomChance > 90 && randomChance <= 98) {
		energy += 2.4 * randomCount * (1 + (level / 10));
	} else if (randomChance > 98 && randomChance <= 99) {
		bookPages += Math.floor(1 * randomCount);
	} else if (randomChance > 99) {
		bookAmount += Math.floor(1 + randomCount);
	}
}