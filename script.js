// Game variables
let xp = 0; // Experience points
let health = 100; // Starting health
let gold = 50; // Starting gold
let currentWeapon = 0; // Index of the current weapon
let fighting; // Indicates which monster is being fought
let monsterHealth; // Health of the current monster
let inventory = ["stick"]; // Initial inventory

// Button elements
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text"); // Text display area
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Define weapons with their powers
const weapons = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'claw hammer', power: 50 },
    { name: 'sword', power: 100 }
];

// Define monsters available to fight
const monsters = [
    { name: "slime", level: 2, health: 15 },
    { name: "fanged beast", level: 8, health: 60 },
    { name: "dragon", level: 20, health: 300 }
];

// Define game locations and their actions
const locations = [{
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
];

// Initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Function to update the display based on current location
function update(location) {
    monsterStats.style.display = "none"; // Hide monster stats initially
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

// Navigation functions
function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

// Buying health function
function buyHealth() {
    if (gold >= 10) {
        gold -= 10; // Deduct gold
        health += 10; // Increase health
        goldText.innerText = gold; // Update gold display
        healthText.innerText = health; // Update health display
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

// Buying weapon function
function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30; // Deduct gold
            currentWeapon++; // Upgrade weapon
            goldText.innerText = gold; // Update gold display
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon); // Add to inventory
            text.innerText += " In your inventory you have: " + inventory.join(", ");
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon; // Set sell weapon function
    }
}

// Selling weapon function
function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15; // Increase gold
        goldText.innerText = gold; // Update gold display
        let currentWeapon = inventory.shift(); // Remove the sold weapon
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory.join(", ");
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

// Fight functions
function fightSlime() {
    fighting = 0; // Slime index
    goFight();
}

function fightBeast() {
    fighting = 1; // Beast index
    goFight();
}

function fightDragon() {
    fighting = 2; // Dragon index
    goFight();
}

// Start fight sequence
function goFight() {
    update(locations[3]); // Update to fight location
    monsterHealth = monsters[fighting].health; // Set monster health
    monsterStats.style.display = "block"; // Show monster stats
    monsterName.innerText = monsters[fighting].name; // Display monster name
    monsterHealthText.innerText = monsterHealth; // Display monster health
}

// Attack function
function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks."; // Monster attack
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level); // Calculate damage taken
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1; // Monster takes damage
    } else {
        text.innerText += " You miss."; // Missed attack
    }
    healthText.innerText = health; // Update health display
    monsterHealthText.innerText = monsterHealth; // Update monster health display
    if (health <= 0) {
        lose(); // Player lost
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame(); // Player wins the game
        } else {
            defeatMonster(); // Player defeats the monster
        }
    }
    // Weapon breaking logic
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks."; // Weapon breaks
        currentWeapon--; // Go back to previous weapon
    }
}

// Get monster's attack value
function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp)); // Calculate hit
    return hit > 0 ? hit : 0; // Ensure non-negative
}

// Determine if the monster hits
function isMonsterHit() {
    return Math.random() > .2 || health < 20; // Higher chance to hit if low health
}

// Dodge function
function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

// Handle monster defeat
function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7); // Gain gold based on monster level
    xp += monsters[fighting].level; // Gain experience points
    goldText.innerText = gold; // Update gold display
    xpText.innerText = xp; // Update XP display
    update(locations[4]); // Update to monster defeat location
}

// Lose function
function lose() {
    update(locations[5]); // Update to lose location
}

// Win function
function winGame() {
    update(locations[6]); // Update to win location
}

// Restart game
function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"]; // Reset inventory
    // Update display
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown(); // Return to town
}

// Easter egg function
function easterEgg() {
    update(locations[7]); // Update to easter egg location
}

// Number picking functions for the easter egg
function pickTwo() {
    pick(2); // Pick 2
}

function pickEight() {
    pick(8); // Pick 8
}

// Random number picking logic
function pick(guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11)); // Generate random numbers
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n"; // Display random numbers
    }
    // Determine if the guess was correct
    if (numbers.includes(guess)) {
        text.innerText += "Right! You win 20 gold!";
        gold += 20; // Increase gold
        goldText.innerText = gold; // Update gold display
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10; // Decrease health
        healthText.innerText = health; // Update health display
        if (health <= 0) {
            lose(); // Player loses
        }
    }
}