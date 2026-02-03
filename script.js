// Weapons and Multipliers
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

// DOM Elements
const weaponTypeSelect = document.getElementById('weaponType');
const weaponSelect = document.getElementById('weapon');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const statInput = document.getElementById('stat');
const damageDisplay = document.getElementById('damageDisplay');
const dpsDisplay = document.getElementById('dpsDisplay');

// Truncate helper (cuts off decimals instead of rounding)
function truncateDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.floor(num * factor) / factor;
}

// Number formatting function (matches game truncation)
function formatNumber(num) {
    if (num < 1000) return num.toString(); // 110 → "110"

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
            if (n < 10) formatted = truncateDecimals(n, 2).toFixed(2); // 1.23k
            else if (n < 100) formatted = truncateDecimals(n, 1).toFixed(1); // 12.3k
            else formatted = truncateDecimals(n, 0).toFixed(0); // 123k

            return formatted + units[i].suffix;
        }
    }

    return num.toString();
}

// Function to populate weapon dropdown
function populateWeapons(type) {
    weaponSelect.innerHTML = '';
    for (const weaponName in weapons[type]) {
        const option = document.createElement('option');
        option.value = weaponName;
        option.textContent = weaponName;
        weaponSelect.appendChild(option);
    }
    // Select the first weapon by default
    weaponSelect.selectedIndex = 0;
}

// Function to calculate damage
function calculateDamage() {
    const type = weaponTypeSelect.value;
    const weapon = weaponSelect.value;
    const stat = parseFloat(statInput.value.replace(/,/g, ''));

    if (!type || !weapon || isNaN(stat)) return;

    const weaponData = weapons[type][weapon];
    const multiplier = weaponData.multiplier;
    const attackSpeed = weaponData.attackSpeed;

    multiplierDisplay.textContent = `Damage Multiplier: ${multiplier}`;
    document.getElementById('attackSpeedDisplay').textContent = `Attack Speed: ${attackSpeed} `;

    const damage = Math.max(Math.round(stat * multiplier), 1);
    damageDisplay.textContent = `Damage: ${formatNumber(damage)}`;

    const dps = damage * attackSpeed;
    dpsDisplay.textContent = `DPS: ${formatNumber(dps)}`;
}

// Event listeners
weaponTypeSelect.addEventListener('change', () => {
    const type = weaponTypeSelect.value;
    if (type) {
        populateWeapons(type);
        calculateDamage();
    }
});

weaponSelect.addEventListener('change', calculateDamage);

// Clear 0 when user starts typing
statInput.addEventListener('keydown', (e) => {
    if (statInput.value === '0' && !['ArrowLeft','ArrowRight','Tab','Shift','Backspace','Delete'].includes(e.key)) {
        statInput.value = '';
    }
});

// When input changes
statInput.addEventListener('input', () => {
    // Remove any non-digit characters
    let numericValue = statInput.value.replace(/\D/g, '');

    // If empty, set to "0"
    if (numericValue === '') numericValue = '0';

    // Format with commas
    statInput.value = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Use the raw numeric value for calculations
    calculateDamage(parseFloat(numericValue));
});
statInput.addEventListener('input', calculateDamage);

weaponSelect.addEventListener('change', calculateDamage);
statInput.addEventListener('input', calculateDamage);

// --- Set default to Physical and first physical ---
window.addEventListener('DOMContentLoaded', () => {
    weaponTypeSelect.value = 'physical';
    populateWeapons('physical');
    statInput.value = 0; // Default stat points
    calculateDamage();
});
