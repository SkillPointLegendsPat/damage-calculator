// --- Weapons and Multipliers ---
const weapons = {
  physical: {
    "Punch": { multiplier: 0.1, attackSpeed: 2.0 },
    "Longsword": { multiplier: 0.15, attackSpeed: 2.0 },
    "Claymore": { multiplier: 0.2, attackSpeed: 2.0 },
    "Royal Sword": { multiplier: 0.25, attackSpeed: 2.0 },
    "Sandshard": { multiplier: 0.3, attackSpeed: 2.0 },
    "Inferno Sword": { multiplier: 0.35, attackSpeed: 2.0 },
    "Dragofeng": { multiplier: 1.2, attackSpeed: 2.0 },
    "Emberheart Sword": { multiplier: 0.7, attackSpeed: 2.0 },
  },
  magic: {
    "Winterbolt Staff": { multiplier: 0.15, attackSpeed: 1.0 },
    "Flame Staff": { multiplier: 0.17, attackSpeed: 1.0 },
    "Lightning Staff": { multiplier: 0.2, attackSpeed: 1.0 },
    "Aqua Staff": { multiplier: 0.23, attackSpeed: 1.0 },
    "Inferno Staff": { multiplier: 0.3, attackSpeed: 1.0 },
  }
};

// --- Bosses ---
const bosses = {
  "None": { physical: 0.0, magic: 0.0 },
  "Chief": { physical: 0.0, magic: 0.0 },
  "Dino": { physical: 0.0, magic: 0.2 },
  "Arachinex": { physical: 0.2, magic: 0.2 },
  "Grimroot": { physical: 0.2, magic: 1.0 },
  "Leonidas": { physical: 0.25, magic: 0.25 },
  "Lightning God": { physical: 0.3, magic: 0.3 },
  "Sand Golem": { physical: 0.4, magic: 0.0 },
  "Hydra Worm": { physical: 0.2, magic: 0.9 },
  "Dragon": { physical: 0.4, magic: 0.4 },
  "Nevermore": { physical: 0.3, magic: 0.6 },
  "Simba": { physical: 0.7, magic: 0.3 },
  "Anubis": { physical: 0.5, magic: 0.7 },
  "Minotaur": { physical: 0.5, magic: 0.5 },
  "Ashgor": { physical: 0.5, magic: 0.5 },
};

// --- DOM Elements ---
const statInput = document.getElementById('stat');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const attackSpeedDisplay = document.getElementById('attackSpeedDisplay');
const damageDisplay = document.getElementById('damageDisplay');
const dpsDisplay = document.getElementById('dpsDisplay');
const physicalResDisplay = document.getElementById('physicalResDisplay');
const magicResDisplay = document.getElementById('magicResDisplay');

let currentWeaponType = "physical";
let currentWeapon = "Punch";
let currentBoss = "None";

// --- Helpers ---
function truncateDecimals(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

function formatNumber(num) {
  if (num < 1000) return num.toString();
  const units = [
    { value: 1e3, suffix: 'k' },
    { value: 1e6, suffix: 'm' },
    { value: 1e9, suffix: 'b' },
    { value: 1e12, suffix: 't' },
    { value: 1e15, suffix: 'q' },
  ];
  for (let i = units.length - 1; i >= 0; i--) {
    if (num >= units[i].value) {
      const n = num / units[i].value;
      let formatted;
      if (n < 10) formatted = truncateDecimals(n, 2).toFixed(2);
      else if (n < 100) formatted = truncateDecimals(n, 1).toFixed(1);
      else formatted = truncateDecimals(n, 0).toFixed(0);
      return formatted + units[i].suffix;
    }
  }
  return num.toString();
}

// --- Custom Dropdown Setup ---
function setupCustomDropdown(dropdownId, optionsArray, callback) {
  const dropdown = document.getElementById(dropdownId);
  const selected = dropdown.querySelector('.selected');
  const optionsList = dropdown.querySelector('.options');

  // Populate options
  optionsList.innerHTML = '';
  optionsArray.forEach(opt => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.dataset.value = opt;
    li.addEventListener('click', () => {
      selected.textContent = opt;
      optionsList.style.display = 'none';
      callback(opt);
    });
    optionsList.appendChild(li);
  });

  // Toggle options
  selected.addEventListener('click', () => {
    const isOpen = optionsList.style.display === 'block';
    document.querySelectorAll('.custom-dropdown .options').forEach(o => o.style.display = 'none');
    optionsList.style.display = isOpen ? 'none' : 'block';
  });

  // Close if click outside
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) optionsList.style.display = 'none';
  });
}

// --- Initialize dropdowns ---
// Weapon dropdown initialization function
function populateWeaponDropdown(type) {
  const weaponOptions = type === "physical" ? Object.keys(weapons.physical) : Object.keys(weapons.magic);
  currentWeapon = weaponOptions[0];
  setupCustomDropdown('weaponDropdown', weaponOptions, weapon => {
    currentWeapon = weapon;
    calculateDamage();
  });
}

// Setup weapon type dropdown
setupCustomDropdown('weaponTypeDropdown', ["Physical", "Magic"], type => {
  currentWeaponType = type.toLowerCase();
  populateWeaponDropdown(currentWeaponType);
  calculateDamage();
});

// Populate weapon dropdown on page load
populateWeaponDropdown(currentWeaponType);

setupCustomDropdown('bossDropdown', Object.keys(bosses), boss => {
  currentBoss = boss;
  calculateDamage();
});

// --- Calculate Damage ---
function calculateDamage() {
  const stat = parseFloat(statInput.value.replace(/,/g, '')) || 0;

  const weaponData = weapons[currentWeaponType][currentWeapon];
  const multiplier = weaponData.multiplier;
  const attackSpeed = weaponData.attackSpeed;

  multiplierDisplay.textContent = multiplier;
  attackSpeedDisplay.textContent = attackSpeed;

  const rawDamage = Math.max(Math.round(stat * multiplier), 1);
  const resistance = bosses[currentBoss][currentWeaponType] || 0;

  let damageAfterResist;
  let dps;

  if (resistance >= 1) {
    damageAfterResist = "Immune";
    dps = 0;
  } else {
    damageAfterResist = Math.max(Math.round(rawDamage * (1 - resistance)), 1);
    dps = damageAfterResist * attackSpeed;
  }

  damageDisplay.textContent = typeof damageAfterResist === 'number' ? formatNumber(damageAfterResist) : damageAfterResist;
  dpsDisplay.textContent = typeof dps === 'number' ? formatNumber(dps) : dps;

  // Update Boss Resistances
  const physRes = bosses[currentBoss].physical > 0 ? Math.round(bosses[currentBoss].physical * 100) + "%" : "None";
  const magRes = bosses[currentBoss].magic > 0 ? Math.round(bosses[currentBoss].magic * 100) + "%" : "None";

  physicalResDisplay.textContent = physRes;
  magicResDisplay.textContent = magRes;
}

// --- Stat input ---
statInput.addEventListener('keydown', (e) => {
  if (statInput.value === '0' && !['ArrowLeft','ArrowRight','Tab','Shift','Backspace','Delete'].includes(e.key)) {
    statInput.value = '';
  }
});

statInput.addEventListener('input', () => {
  let numericValue = statInput.value.replace(/\D/g, '');
  if (numericValue === '') numericValue = '0';
  statInput.value = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  calculateDamage();
});

// --- Initial calculation ---
window.addEventListener('DOMContentLoaded', () => {
  calculateDamage();
});
