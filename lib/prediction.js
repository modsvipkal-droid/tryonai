export function getNumberSize(num) {
  return Number(num) >= 5 ? "BIG" : "SMALL";
}

export function getNumberColor(num) {
  const n = Number(num);
  if (n === 0) return "red,violet";
  if (n === 5) return "green,violet";
  if ([1, 3, 7, 9].includes(n)) return "green";
  return "red";
}

export function getAdvancedSquareDeltaDetails(N1, N2, periodNumber) {
  // 1. Core Square Difference
  let delta = Math.abs(Math.pow(N1, 2) - Math.pow(N2, 2));

  // 2. The Zero-Delta Anti-Trap (Agar numbers repeat ho jaye)
  if (delta === 0) {
    delta = 7; // Hidden kinetic constant
  }

  // 3. Momentum from immediate trend
  const momentum = N1 - N2;

  // 4. Dynamic Time Injection
  const parsedPeriod = Number(periodNumber) || 0;
  const periodLastDigit = Math.abs(parsedPeriod) % 10;
  let timeFactor = 0;

  if (parsedPeriod % 2 === 0) {
    // Even period -> Addition
    timeFactor = periodLastDigit;
  } else {
    // Odd period -> Multiplication (Creates a sudden spike in data)
    timeFactor = periodLastDigit * 2;
  }

  // 5. Final Calculation with Modulo 10
  // Math.abs use kiya hai taaki negative momentum total ko minus me na le jaye
  const total = Math.abs(delta + momentum + timeFactor);
  const finalIndex = total % 10;

  // 6. Big / Small Output (0-4: SMALL, 5-9: BIG)
  const size = finalIndex >= 5 ? "BIG" : "SMALL";

  return {
    delta,
    momentum,
    timeFactor,
    total,
    finalIndex,
    size,
  };
}

export function advancedSquareDelta(N1, N2, periodNumber) {
  // Big ya Small prediction return karta hai
  const details = getAdvancedSquareDeltaDetails(N1, N2, periodNumber);
  return details.size; // "BIG" ya "SMALL"
}

// Tumhara Example Test: N1=7, N2=3, Period=342
// Output calculation:
// Delta = |49 - 9| = 40
// Momentum = 7 - 3 = 4
// Period is Even (342), so timeFactor = 2
// Total = 40 + 4 + 2 = 46
// Final Index = 46 % 10 = 6
// Prediction: 6 >= 5 => "BIG"
// console.log(advancedSquareDelta(7, 3, 342)); // "BIG"

export function generateSmartPrediction(targetPeriod, historyList, currentLevel = 0) {
  const level = Math.min(2, Math.max(0, Number(currentLevel) || 0));

  let N1 = 7;
  let N2 = 3;

  if (Array.isArray(historyList) && historyList.length > 0) {
    if (historyList[0]?.number !== undefined && !Number.isNaN(Number(historyList[0].number))) {
      N1 = Number(historyList[0].number);
    }
    if (historyList.length > 1 && historyList[1]?.number !== undefined && !Number.isNaN(Number(historyList[1].number))) {
      N2 = Number(historyList[1].number);
    } else {
      N2 = (N1 + 5) % 10;
    }
  }

  const details = getAdvancedSquareDeltaDetails(N1, N2, targetPeriod);
  const size = details.size; // "BIG" ya "SMALL"
  const predictedDigit = details.finalIndex;
  const color = getNumberColor(predictedDigit);

  const pool = size === "BIG" ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  const hotNumbers = [predictedDigit, ...pool.filter((d) => d !== predictedDigit)].slice(0, 3).sort((a, b) => a - b);
  const confidence = (Math.min(98.5, 92.4 + level * 2.2)).toFixed(1);

  return {
    period: targetPeriod,
    size, // "BIG" ya "SMALL"
    prediction: size === "BIG" ? "Big" : "Small",
    level,
    predictedDigit,
    sniperDigit: predictedDigit,
    sniperProb: String(Math.round(42 + level * 3)),
    numbers: hotNumbers,
    color,
    confidence,
    strategy: "Advanced Square Delta Engine",
    patternName: "Square Delta Momentum",
    risk: level === 0 ? "LEVEL 0 (SAFE)" : level === 1 ? "LEVEL 1 (MODERATE)" : "LEVEL 2 (RECOVERY)",
    votes: {
      squareDelta: size,
      momentum: N1 >= N2 ? "BIG" : "SMALL",
    },
    rsi: 50,
  };
}

export const PREDICTION_STAKES = { 0: "1x", 1: "3x", 2: "8x" };

export function getNextPredictionLevel(prevLevel, won) {
  if (won) return 0;
  return Math.min(2, Number(prevLevel) + 1);
}
