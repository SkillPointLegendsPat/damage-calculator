// --- Weapons ---
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
  "None": { health: 0, physical: 0.0, magic: 0.0 },
  "Chief": { health: 25000, physical: 0.0, magic: 0.0 },
  "Dino": { health: 250000, physical: 0.0, magic: 0.2 },
  "Arachinex": { health: 450000, physical: 0.2, magic: 0.2 },
  "Grimroot": { health: 950000, physical: 0.2, magic: 1.0 },
  "Leonidas": { health: 1250000, physical: 0.25, magic: 0.25 },
  "Lightning God": { health: 25000000, physical: 0.3, magic: 0.3 },
  "Sand Golem": { health: 2000000000, physical: 0.4, magic: 0.0 },
  "Hydra Worm": { health: 4000000000, physical: 0.2, magic: 0.9 },
  "Dragon": { health: 8000000000, physical: 0.4, magic: 0.4 },
  "Nevermore": { health: 75000000000, physical: 0.3, magic: 0.6 },
  "Simba": { health: 750000000000, physical: 0.7, magic: 0.3 },
  "Anubis": { health: 1500000000000, physical: 0.5, magic: 0.7 },
  "Minotaur": { health: 30000000000, physical: 0.5, magic: 0.5 },
  "Ashgor": { health: 1600000000000, physical: 0.5, magic: 0.5 },
};

// --- MOBS ---
const mobs = {
  "None": { health: 0, physical: 0.0, magic: 0.0 },
  "Snail": { health: 10, physical: 0.0, magic: 0.0 },
  "Pig": { health: 800, physical: 0.0, magic: 0.0 },
  "Turtle": { health: 2500, physical: 0.1, magic: 0.0 },
  "Caveman": { health: 4500, physical: 0.0, magic: 0.0 },
  "Spider": { health: 12500, physical: 0.0, magic: 0.1 },
  "Mammoth": { health: 75000, physical: 0.2, magic: 0.1 },
  "Viperbloom": { health: 125000, physical: 0.0, magic: 0.0 },
  "Warlock": { health: 100000, physical: 0.0, magic: 0.2 },
  "Spartan": { health: 250000, physical: 0.2, magic: 0.0 },
  "Reaper": { health: 750000, physical: 0.1, magic: 0.2 },
  "Angel": { health: 1500000, physical: 0.1, magic: 0.25 },
  "Cowboy": { health: 15000000, physical: 0.1, magic: 0.0 },
  "Ghost": { health: 60000000, physical: 0.2, magic: 0.8 },
  "Totem Sentinal": { health: 250000000, physical: 0.2, magic: 0.2 },
  "Mummy": { health: 500000000, physical: 0.3, magic: 0.1 },
  "Blightleap": { health: 2500000000, physical: 0.1, magic: 0.3 },
  "Bonepicker": { health: 25000000000, physical: 0.3, magic: 0.3 },
  "Oculon": { health: 100000000000, physical: 0.1, magic: 0.7 },
  "Magmaton": { health: 600000000000, physical: 0.1, magic: 0.2 },
};

// --- DOM Elements ---
const statInput = document.getElementById('stat');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const attackSpeedDisplay = document.getElementById('attackSpeedDisplay');
const damageDisplay = document.getElementById('damageDisplay');
const dpsDisplay = document.getElementById('dpsDisplay');
const physicalResDisplay = document.getElementById('physicalResDisplay');
const magicResDisplay = document.getElementById('magicResDisplay');
const bossHealthDisplay = document.getElementById('bossHealthDisplay');
const mobHealthDisplay = document.getElementById('mobHealthDisplay');
const mobPhysicalResDisplay = document.getElementById('mobPhysicalResDisplay');
const mobMagicResDisplay = document.getElementById('mobMagicResDisplay');

// --- State ---
let currentWeaponType = "physical";
let currentWeapon = "Punch";
let currentBoss = "None";
let currentMob = "None";

// --- Helpers ---
function truncateDecimals(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

function formatNumber(num) {
  if (num < 1000) return num.toString();
  const units = [
    { value: 1e15, suffix: 'Q' },
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];
  for (const unit of units) {
    if (num >= unit.value) {
      let n = num / unit.value;
      if (n < 10) n = truncateDecimals(n, 2);
      else if (n < 100) n = truncateDecimals(n, 1);
      else n = Math.floor(n);
      return n + unit.suffix;
    }
  }
  return num.toString();
}

function formatBossHealth(num) {
  if (num === 0) return "0";
  if (num < 1000) return num.toString();

  const units = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      let value = num / unit.value;
      value = Math.round(value * 100) / 100;
      let text = value.toFixed(2).replace(/\.?0+$/, '');
      return text + unit.suffix;
    }
  }
}

// --- Dropdown Helpers ---
function setupDropdown(dropdownId, callback) {
  const dropdown = document.getElementById(dropdownId);
  const selected = dropdown.querySelector('.selected');
  const optionsList = dropdown.querySelector('.options');

  selected.addEventListener('click', () => {
    const isOpen = optionsList.style.display === 'block';
    document.querySelectorAll('.custom-dropdown .options').forEach(o => o.style.display = 'none');
    optionsList.style.display = isOpen ? 'none' : 'block';
  });

  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) optionsList.style.display = 'none';
  });

  optionsList.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      selected.textContent = e.target.dataset.value;
      optionsList.style.display = 'none';
      optionsList.querySelectorAll('li').forEach(li => li.classList.remove('selected-option'));
      e.target.classList.add('selected-option');
      callback(e.target.dataset.value);
    }
  });
}

function populateOptions(dropdownId, optionsArray, defaultValue) {
  const optionsList = document.getElementById(dropdownId).querySelector('.options');
  optionsList.innerHTML = '';
  optionsArray.forEach(opt => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.dataset.value = opt;
    if (opt === defaultValue) li.classList.add('selected-option');
    optionsList.appendChild(li);
  });
  document.getElementById(dropdownId).querySelector('.selected').textContent = defaultValue;
}

// --- Setup Dropdowns ---
setupDropdown('weaponTypeDropdown', type => {
  currentWeaponType = type.toLowerCase(); // normalize
  const weaponList = Object.keys(weapons[currentWeaponType]);
  currentWeapon = weaponList[0]; // reset weapon
  populateOptions('weaponDropdown', weaponList, currentWeapon);
  calculateDamage();
});
populateOptions('weaponTypeDropdown', ["Physical", "Magic"], "Physical");

setupDropdown('weaponDropdown', weapon => {
  currentWeapon = weapon;
  calculateDamage();
});
populateOptions('weaponDropdown', Object.keys(weapons.physical), "Punch");

setupDropdown('bossDropdown', boss => {
  currentBoss = boss;
  if (currentBoss !== "None") {
    currentMob = "None";
    populateOptions('mobDropdown', Object.keys(mobs), "None");
  }
  calculateDamage();
});
populateOptions('bossDropdown', Object.keys(bosses), "None");

setupDropdown('mobDropdown', mob => {
  currentMob = mob;
  if (currentMob !== "None") {
    currentBoss = "None";
    populateOptions('bossDropdown', Object.keys(bosses), "None");
  }
  calculateDamage();
});
populateOptions('mobDropdown', Object.keys(mobs), "None");

// --- Calculate Damage ---
function calculateDamage() {
  // --- Parse stat ---
  let stat = parseFloat(statInput.value.replace(/,/g, ''));
  if (isNaN(stat) || stat < 0) stat = 0;

  const weaponType = currentWeaponType; // already lowercase
  const weaponData = weapons[weaponType]?.[currentWeapon];
  if (!weaponData) return;

  multiplierDisplay.textContent = weaponData.multiplier;
  attackSpeedDisplay.textContent = weaponData.attackSpeed;

  const rawDamage = Math.max(Math.round(stat * weaponData.multiplier), 1);

  // --- Determine target ---
  let target = null;
  if (currentBoss !== "None") target = bosses[currentBoss];
  else if (currentMob !== "None") target = mobs[currentMob];

  let resistance = 0;
  if (target) resistance = target[weaponType] || 0;

  let damageAfterResist;
  let dps;

  if (resistance >= 1) {
    damageAfterResist = "Immune";
    dps = 0;
  } else {
    damageAfterResist = Math.max(Math.round(rawDamage * (1 - resistance)), 1);
    dps = damageAfterResist * weaponData.attackSpeed;
  }

  damageDisplay.textContent =
    typeof damageAfterResist === "number" ? formatNumber(damageAfterResist) : damageAfterResist;
  dpsDisplay.textContent =
    typeof dps === "number" ? formatNumber(dps) : dps;

  // --- Boss info ---
  bossHealthDisplay.textContent =
    currentBoss === "None" ? "None" : formatBossHealth(bosses[currentBoss].health);
  physicalResDisplay.textContent =
    bosses[currentBoss]?.physical > 0 ? Math.round(bosses[currentBoss].physical * 100) + "%" : "None";
  magicResDisplay.textContent =
    bosses[currentBoss]?.magic > 0 ? Math.round(bosses[currentBoss].magic * 100) + "%" : "None";

  // --- Mob info ---
  mobHealthDisplay.textContent =
    currentMob === "None" ? "None" : formatBossHealth(mobs[currentMob].health);
  mobPhysicalResDisplay.textContent =
    mobs[currentMob]?.physical > 0 ? Math.round(mobs[currentMob].physical * 100) + "%" : "None";
  mobMagicResDisplay.textContent =
    mobs[currentMob]?.magic > 0 ? Math.round(mobs[currentMob].magic * 100) + "%" : "None";
}

// --- Stat Input ---
statInput.addEventListener('keydown', e => {
  if (statInput.value === '0' && !['ArrowLeft','ArrowRight','Tab','Shift','Backspace','Delete'].includes(e.key)) {
    statInput.value = '';
  }
});

statInput.addEventListener('input', () => {
  let numericValue = statInput.value.replace(/\D/g, '');
  if (numericValue === '') numericValue = '0';

  const maxValue = 999_000_000_000_000_000; // 999 quadrillion
  if (BigInt(numericValue) > BigInt(maxValue)) {
    statInput.value = '0';
    calculateDamage();
    return;
  }

  statInput.value = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  calculateDamage();
});


window.addEventListener('DOMContentLoaded', calculateDamage);
