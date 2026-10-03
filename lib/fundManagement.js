/**
 * TRION AI — Fund Management Allocation Engine
 * 
 * Provides isolated, deterministic mathematical calculation for level-wise fund allocation.
 * Designed strictly as an educational budgeting and allocation calculation utility.
 */

const ORDINAL_SEQUENCE_LABELS = [
  "First Allocation",
  "Second Allocation",
  "Third Allocation",
  "Fourth Allocation",
  "Fifth Allocation",
  "Sixth Allocation",
  "Seventh Allocation",
  "Eighth Allocation",
  "Ninth Allocation"
];

/**
 * Returns neutral sequence label for a given level (1-indexed).
 * @param {number} level 
 * @returns {string} e.g. "First Allocation"
 */
export function getSequenceLabel(level) {
  const idx = Math.max(1, Math.min(9, Math.floor(level))) - 1;
  return ORDINAL_SEQUENCE_LABELS[idx] || `Allocation Stage ${level}`;
}

/**
 * Consistent currency formatting utility for INR and numbers.
 * Prevents floating point artifacts like 99.999999999.
 * 
 * @param {number|string} value 
 * @param {string} [symbol="₹"] 
 * @returns {string} e.g. "₹1,250" or "₹1,250.50"
 */
export function formatCurrency(value, symbol = "₹") {
  if (value === null || value === undefined || value === "") return `${symbol}0`;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return `${symbol}0`;

  // Check if value has significant decimal fraction
  const hasDecimals = Math.abs(num % 1) > 0.0001;

  const formatted = hasDecimals
    ? num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : num.toLocaleString("en-IN", {
        maximumFractionDigits: 0
      });

  return `${symbol}${formatted}`;
}

/**
 * Validates calculation inputs.
 * Returns an error string if invalid, or null if valid.
 * 
 * @param {number|string} amount 
 * @param {number|string} levels 
 * @returns {string|null}
 */
export function validateFundManagementInputs(amount, levels) {
  if (amount === undefined || amount === null || String(amount).trim() === "") {
    return "Please enter an amount.";
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return "Please enter a valid numeric amount.";
  }

  if (numAmount < 0) {
    return "Amount cannot be negative.";
  }

  if (numAmount === 0) {
    return "Please enter an amount greater than zero.";
  }

  if (numAmount > 100000000) {
    return "Amount exceeds the maximum limit of ₹10,00,00,000.";
  }

  if (levels === undefined || levels === null || String(levels).trim() === "") {
    return "Please select a management level.";
  }

  const numLevels = Number(levels);
  if (isNaN(numLevels) || !Number.isInteger(numLevels) || numLevels < 1 || numLevels > 9) {
    return "Please select a management level between 1 and 9.";
  }

  return null;
}

/**
 * Core Isolated Calculation Engine
 * 
 * Allocates total amount across 1 to 9 levels using a structured staged geometric progression.
 * Formula: Each level i has weight w_i = multiplier^(i-1).
 * Default multiplier is 3 (standard 3x staged allocation).
 * Normalizes all levels so their sum equals 100% of the input amount.
 * Performs deterministic rounding reconciliation to guarantee sum(level allocations) === entered amount
 * without floating-point leaks.
 * 
 * @param {number|string} amount - Total available amount
 * @param {number|string} levels - Selected levels (1-9)
 * @param {object} [options] - Optional configurations (multiplier, customDecimals)
 * @returns {object} Calculated result containing plan array and summary metrics
 */
export function calculateFundManagement(amount, levels, options = {}) {
  const validationError = validateFundManagementInputs(amount, levels);
  if (validationError) {
    throw new Error(validationError);
  }

  const numAmount = Number(amount);
  const numLevels = parseInt(levels, 10);
  const multiplier = typeof options.multiplier === "number" && options.multiplier > 0 ? options.multiplier : 3;

  // Decide decimal precision based on input and magnitude
  const isDecimalInput = Math.abs(numAmount % 1) > 0.0001;
  const decimals = options.decimals !== undefined ? options.decimals : (isDecimalInput || numAmount < 100 ? 2 : 0);
  const factor = Math.pow(10, decimals);

  // 1. Calculate progressive weights
  const weights = [];
  let totalWeight = 0;
  for (let i = 0; i < numLevels; i++) {
    const w = Math.pow(multiplier, i);
    weights.push(w);
    totalWeight += w;
  }

  // 2. Compute proportional raw allocation for each level
  const rawAllocations = weights.map((w) => (numAmount * w) / totalWeight);

  // 3. Round allocations according to decimal precision
  const roundedAllocations = rawAllocations.map((val) => Math.round(val * factor) / factor);

  // 4. Rounding reconciliation: ensure sum(allocations) === numAmount exactly
  const initialSum = roundedAllocations.reduce((acc, v) => acc + v, 0);
  const difference = Math.round((numAmount - initialSum) * factor) / factor;

  if (difference !== 0) {
    // Reconcile on the last level (or highest allocation) so UI never has unexplained discrepancy
    const adjustIdx = numLevels - 1;
    roundedAllocations[adjustIdx] = Math.round((roundedAllocations[adjustIdx] + difference) * factor) / factor;
  }

  // 5. Build level-wise allocation list with cumulative tracking
  let cumulative = 0;
  const plan = roundedAllocations.map((alloc, idx) => {
    cumulative = Math.round((cumulative + alloc) * factor) / factor;
    const levelNumber = idx + 1;
    const percent = ((alloc / numAmount) * 100);

    return {
      level: levelNumber,
      levelFormatted: String(levelNumber).padStart(2, "0"),
      sequenceLabel: `Level ${levelNumber} — ${getSequenceLabel(levelNumber)}`,
      shortLabel: `Level ${levelNumber}`,
      allocation: alloc,
      allocationFormatted: formatCurrency(alloc),
      cumulative: cumulative,
      cumulativeFormatted: formatCurrency(cumulative),
      percentage: percent.toFixed(1) + "%",
      rawPercent: percent
    };
  });

  const totalAllocated = plan[plan.length - 1].cumulative;
  const remaining = Math.max(0, Math.round((numAmount - totalAllocated) * factor) / factor);

  return {
    totalAmount: numAmount,
    totalAmountFormatted: formatCurrency(numAmount),
    selectedLevels: numLevels,
    plan,
    totalAllocated,
    totalAllocatedFormatted: formatCurrency(totalAllocated),
    remaining,
    remainingFormatted: formatCurrency(remaining),
    isExactMatch: Math.abs(numAmount - totalAllocated) <= (1 / factor),
    formulaDescription: `${multiplier}x Progressive Staged Allocation (Normalized)`
  };
}
