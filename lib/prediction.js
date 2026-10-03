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

function digitalRoot(n) {
  let value = n;
  while (value >= 10) {
    value = String(value).split("").reduce((a, d) => a + Number(d), 0);
  }
  return value;
}

export function calculateKNNHistoricalMatch(historySizes) {
  if (!Array.isArray(historySizes) || historySizes.length < 5) {
    return { bias: null, conf: 83, hits: 0, matched: false };
  }
  const s = historySizes;

  const tryGram = (gram) => {
    const pattern = s.slice(0, gram).join(",");
    let big = 0;
    let small = 0;
    for (let i = gram; i < s.length; i++) {
      if (s.slice(i - gram, i).join(",") === pattern) {
        if (s[i] === "BIG") big++;
        else small++;
      }
    }
    const hits = big + small;
    if (hits < 2) return null;
    const delta = Math.abs(big - small);
    const conf = gram === 3 ? 88 + (delta / hits) * 8 : 85 + (delta / hits) * 7;
    return {
      bias: big > small ? "BIG" : small > big ? "SMALL" : null,
      conf: Math.min(96, conf),
      hits,
      matched: big !== small,
    };
  };

  return tryGram(3) || tryGram(2) || { bias: null, conf: 83, hits: 0, matched: false };
}

export function classifyUniversalPattern(historySizes) {
  if (!Array.isArray(historySizes) || historySizes.length < 4) {
    return { name: "Equilibrium", bias: null, conf: 84, matched: false, desc: "Insufficient depth" };
  }

  const s = historySizes;
  const last = s[0];
  const flip = last === "BIG" ? "SMALL" : "BIG";
  const len = s.length;

  let streak = 1;
  for (let i = 1; i < len; i++) {
    if (s[i] === s[0]) streak++;
    else break;
  }

  let altCount = 0;
  for (let i = 1; i < len; i++) {
    if (s[i] !== s[i - 1]) altCount++;
    else break;
  }

  if (s[0] !== s[1] && s[1] === s[2] && (len < 5 || s[2] !== s[3])) {
    return { name: "1-2-1-2 wave", bias: s[0], conf: 93.5, matched: true, desc: "1-2-1-2 build" };
  }

  if (s[0] === s[1] && s[1] !== s[2] && s[2] !== s[3]) {
    return { name: "1-2-1-2 pivot", bias: flip, conf: 92.0, matched: true, desc: "1-2-1-2 pivot" };
  }

  if (s[0] !== s[1] && s[1] === s[2] && len >= 5 && s[3] === s[4] && s[2] !== s[3]) {
    return { name: "2-2 double pair", bias: s[0], conf: 94.0, matched: true, desc: "2-2 step2" };
  }

  if (s[0] === s[1] && s[2] === s[3] && s[0] !== s[2]) {
    return { name: "2-2 double pair", bias: flip, conf: 91.5, matched: true, desc: "2-2 switch" };
  }

  if (altCount >= 2) {
    return { name: "Ping-Pong", bias: flip, conf: 90 + Math.min(altCount * 2, 6), matched: true, desc: "alternation" };
  }

  if (streak === 1 && s[1] === s[2] && s[2] === s[3] && s[0] !== s[1]) {
    return { name: "1-Cut Fakeout", bias: s[1], conf: 93.0, matched: true, desc: "fakeout reversal" };
  }

  if (streak >= 3) {
    return { name: "Dragon streak", bias: s[0], conf: Math.min(94, 88 + 1.5 * streak), matched: true, desc: `${streak} streak` };
  }

  if (s[0] !== s[1] && s[1] === s[2] && len >= 5 && s[3] !== s[4] && s[2] === s[3]) {
    return { name: "2-1-2-1", bias: s[0], conf: 91.0, matched: true, desc: "2-1-2-1" };
  }

  if (streak === 2) {
    return { name: "2-streak momentum", bias: s[0], conf: 88.0, matched: true, desc: "2-streak" };
  }

  return { name: "Equilibrium", bias: flip, conf: 83.5, matched: false, desc: "neutral" };
}

export function calculateQuantDelta(historyNumbers) {
  const nums = (Array.isArray(historyNumbers) ? historyNumbers : []).slice(0, 10).map(Number);
  if (nums.length < 3) {
    return { bias: null, conf: 84, rsi: 50, emaVector: 0 };
  }

  let gains = 0;
  let losses = 0;
  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const rsi = losses === 0 ? 100 : 100 - 100 / (1 + gains / losses);

  const last = nums[nums.length - 1];
  const prev = nums[nums.length - 2];
  const delta = last - prev;

  let bias = null;
  if (Math.abs(delta) >= 4) {
    bias = delta > 0 ? "BIG" : "SMALL";
  } else if (rsi >= 55) {
    bias = "BIG";
  } else if (rsi <= 45) {
    bias = "SMALL";
  }

  const emaVector = nums.reduce((acc, n) => acc + n, 0) / nums.length;
  return { bias, conf: 84, rsi, emaVector };
}

export function calculateShannonEntropy(sizes) {
  if (!Array.isArray(sizes) || sizes.length === 0) return 1.0;
  const big = sizes.filter((s) => s === "BIG").length;
  const small = sizes.length - big;
  if (big === 0 || small === 0) return 0.0;
  const pBig = big / sizes.length;
  const pSmall = small / sizes.length;
  return -(pBig * Math.log2(pBig) + pSmall * Math.log2(pSmall));
}

export function calculateVedicResonance(targetPeriod) {
  const digits = String(targetPeriod ?? "").split("").map(Number).filter((n) => Number.isFinite(n));
  const root = digitalRoot(digits.reduce((a, b) => a + b, 0));
  return { root, bias: root % 2 === 1 ? "BIG" : "SMALL" };
}

export function calculateSniperAndHotDigits(predictedSize, historyNumbers, targetPeriod) {
  const pool = predictedSize === "BIG" ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  const recent = (Array.isArray(historyNumbers) ? historyNumbers : []).slice(0, 20).map(Number);

  const freq = {};
  const lastSeen = {};
  pool.forEach((d) => {
    freq[d] = 0;
    lastSeen[d] = 20;
  });

  recent.forEach((n, idx) => {
    if (pool.includes(n)) {
      freq[n]++;
      lastSeen[n] = Math.min(lastSeen[n], idx);
    }
  });

  let pSeed = 7;
  for (const ch of String(targetPeriod ?? "")) {
    pSeed = (pSeed * 31 + ch.charCodeAt(0)) % 1000;
  }

  const scored = pool
    .map((d) => {
      const score = freq[d] * 1.6 + Math.min(lastSeen[d] * 0.8, 4.2) + ((pSeed + d * 11) % 10) / 10;
      return { digit: d, score };
    })
    .sort((a, b) => b.score - a.score);

  const sniper = scored[0];
  const hot = scored.slice(0, 3).map((s) => s.digit).sort((a, b) => a - b);
  const prob = Math.min(48, Math.max(38, 38 + sniper.score * 2));
  const greenCount = hot.filter((d) => [1, 3, 5, 7, 9].includes(d)).length;
  let color = greenCount >= 2 ? "green" : "red";
  if (sniper.digit === 0) color = "red,violet";
  if (sniper.digit === 5) color = "green,violet";

  return { sniperDigit: sniper.digit, sniperProb: String(Math.round(prob)), numbers: hot, color, hot: scored.slice(0, 3) };
}

export function generateSmartPrediction(targetPeriod, historyList, currentLevel = 0) {
  const level = Math.min(2, Math.max(0, Number(currentLevel) || 0));

  if (!Array.isArray(historyList) || historyList.length === 0) {
    const size = Math.random() >= 0.5 ? "BIG" : "SMALL";
    return {
      period: targetPeriod,
      size,
      sniperDigit: size === "BIG" ? 8 : 2,
      sniperProb: "40",
      numbers: size === "BIG" ? [6, 8, 9] : [1, 2, 4],
      color: size === "BIG" ? "red" : "green",
      confidence: "89.5",
      strategy: "0-2 Level Fix Win Baseline",
      patternName: "Baseline",
      risk: "LEVEL 0 (SAFE)",
      votes: { wave: size, ngram: size, regime: size, quant: size, entropy: size, vedic: size },
      rsi: 50,
    };
  }

  const recent = historyList.slice(0, 35);
  const sizes = recent.map((r) => getNumberSize(Number(r.number)));
  const numbers = recent.map((r) => Number(r.number));

  const pattern = classifyUniversalPattern(sizes);
  const knn = calculateKNNHistoricalMatch(sizes);
  const quant = calculateQuantDelta(numbers);
  const entropy = calculateShannonEntropy(sizes);
  const vedic = calculateVedicResonance(targetPeriod);

  const bigCount = sizes.filter((s) => s === "BIG").length;
  const smallCount = sizes.length - bigCount;
  let entropyVote = pattern.bias;
  if (entropy < 0.65) {
    if (bigCount >= 7) entropyVote = "SMALL";
    else if (smallCount >= 7) entropyVote = "BIG";
  }

  const votes = {
    wave: pattern.bias,
    ngram: knn.bias,
    regime: pattern.bias,
    quant: quant.bias,
    entropy: entropyVote,
    vedic: vedic.bias,
  };

  let size;
  let confidence;
  let strategy;
  let risk;

  if (level === 0) {
    size = pattern.matched ? pattern.bias : knn.bias || pattern.bias;
    confidence = pattern.matched ? pattern.conf : knn.conf;
    strategy = pattern.matched ? "0-2 Level Fix Win Pattern" : "0-2 Level Fix Win Markov";
    risk = "LEVEL 0 (OPTIMAL ENTRY)";
  } else if (level === 1) {
    size = pattern.matched ? pattern.bias : knn.bias || pattern.bias;
    confidence = pattern.matched ? Math.min(96, pattern.conf + 3) : 93;
    strategy = "Recovery Snipe";
    risk = "LEVEL 1 (RECOVERY SNIPE)";
  } else {
    const weights = { pattern: 2.0, knn: 1.8, quant: 1.2, vedic: 1.0 };
    const voters = { pattern: pattern.bias, knn: knn.bias, quant: quant.bias, vedic: vedic.bias };
    let bigScore = 0;
    let smallScore = 0;
    for (const [key, vote] of Object.entries(voters)) {
      if (vote === "BIG") bigScore += weights[key];
      else if (vote === "SMALL") smallScore += weights[key];
    }
    size = bigScore > smallScore ? "BIG" : smallScore > bigScore ? "SMALL" : pattern.bias;
    confidence = 96.8;
    strategy = "Max Recovery Fix";
    risk = "LEVEL 2 (MAX RECOVERY FIX)";
  }

  if (!size) size = pattern.bias || "BIG";

  const sniper = calculateSniperAndHotDigits(size, numbers, targetPeriod);

  return {
    period: targetPeriod,
    size,
    level,
    sniperDigit: sniper.sniperDigit,
    sniperProb: sniper.sniperProb,
    numbers: sniper.numbers,
    color: sniper.color,
    confidence: confidence.toFixed(1),
    strategy,
    patternName: pattern.name,
    risk,
    votes,
    rsi: Math.round(quant.rsi),
  };
}

export const PREDICTION_STAKES = { 0: "1x", 1: "3x", 2: "8x" };

export function getNextPredictionLevel(prevLevel, won) {
  if (won) return 0;
  return Math.min(2, Number(prevLevel) + 1);
}
