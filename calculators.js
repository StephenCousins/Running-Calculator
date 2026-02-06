/**
 * Running Calculator - Core Calculation Functions
 * ================================================
 * Pure math functions extracted from index.html for testability.
 * These functions have zero DOM dependencies.
 */

// VO2 Max - VDOT formula
// distance in meters, totalTimeMinutes in minutes
function calculateVDOT(distance, totalTimeMinutes) {
  const speed = distance / totalTimeMinutes; // meters per minute
  return (0.2 * speed) + 3.5;
}

// VO2 Max - Cooper test
// distance in meters (distance run in 12 minutes)
function calculateCooperVO2(distance) {
  return (distance - 504.9) / 44.73;
}

// VO2 Max - FMR composite formula
// gender: 1 = male, 0 = female
function calculateFMR(distance, totalTimeMinutes, maxHR, restHR, gender, age) {
  const speed = distance / totalTimeMinutes;
  const vo2maxTime = (0.2 * speed) + 3.5;
  const vo2maxHR = 15 * (maxHR / restHR);
  let vo2max = (vo2maxTime + vo2maxHR) / 2;

  if (gender === 0) {
    vo2max = vo2max * 0.95;
  }

  if (age > 25) {
    const yearsOver25 = age - 25;
    let ageAdjustmentFactor = 1 - (0.002 * yearsOver25);
    ageAdjustmentFactor = Math.max(ageAdjustmentFactor, 0.7);
    vo2max = vo2max * ageAdjustmentFactor;
  }

  return vo2max;
}

// VO2 classification
function getVO2Classification(vo2) {
  if (vo2 < 35) return 'Poor';
  if (vo2 < 45) return 'Fair';
  if (vo2 < 55) return 'Good';
  if (vo2 < 65) return 'Excellent';
  return 'Superior';
}

// Pace calculations
// totalSeconds: time in seconds, distanceKm: distance in km
function calculatePacePerKm(totalSeconds, distanceKm) {
  return totalSeconds / distanceKm;
}

function calculatePacePerMile(totalSeconds, distanceKm) {
  return totalSeconds / (distanceKm / 1.60934);
}

function calculateSpeedKmh(totalSeconds, distanceKm) {
  return (distanceKm / totalSeconds) * 3600;
}

function calculateSpeedMph(totalSeconds, distanceKm) {
  return calculateSpeedKmh(totalSeconds, distanceKm) / 1.60934;
}

// Format time from components
function formatTime(hours, minutes, seconds) {
  let result = '';
  if (hours > 0) {
    result += `${hours}h `;
  }
  result += `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  return result;
}

// Format time from total seconds
function formatTimeFromSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return formatTime(hours, minutes, seconds);
}

// Format pace (seconds per km) to mm:ss string
function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Race prediction - Quick mode (Riegel formula with adjustments)
function predictRaceTimeQuick(knownDistanceKm, knownTimeMinutes, targetDistanceKm, fatigueFactor) {
  return knownTimeMinutes * Math.pow(targetDistanceKm / knownDistanceKm, fatigueFactor);
}

// Calculate personal exponent from two race results
function calculatePersonalExponent(race1DistanceKm, race1TimeSeconds, race2DistanceKm, race2TimeSeconds) {
  return Math.log(race2TimeSeconds / race1TimeSeconds) / Math.log(race2DistanceKm / race1DistanceKm);
}

// Age grading classification
function getAgeGradingClassification(percentage) {
  if (percentage >= 100) return 'World Class';
  if (percentage >= 90) return 'National Class';
  if (percentage >= 80) return 'Regional Class';
  if (percentage >= 70) return 'Local Class';
  if (percentage >= 60) return 'Excellent';
  return 'Good';
}

// Elevation adjustment using modified Naismith's Rule
function calculateElevationAdjustment(flatTimeSeconds, elevGain, elevLoss, terrainFactor) {
  const gainPenalty = (elevGain / 10) * 60; // seconds
  const lossBenefit = Math.min((elevLoss / 10) * 30, (elevGain / 10) * 30); // capped
  const terrainPenalty = flatTimeSeconds * (terrainFactor - 1);
  return flatTimeSeconds + gainPenalty - lossBenefit + terrainPenalty;
}

// Nutrition calculations
function calculateNutritionNeeds(weightKg, distanceKm, paceMinPerKm, terrainFactor, tempFactor) {
  const totalTimeHours = (distanceKm * paceMinPerKm) / 60;
  const speedKmh = 60 / paceMinPerKm;

  const baseCaloriesPerHour = weightKg * speedKmh;
  const adjustedCaloriesPerHour = baseCaloriesPerHour * terrainFactor * tempFactor;
  const totalCalories = adjustedCaloriesPerHour * totalTimeHours;

  const carbsPerHour = totalTimeHours > 2.5 ? 70 : 50;
  const totalCarbs = carbsPerHour * totalTimeHours;

  const baseHydrationPerHour = 600;
  const hydrationPerHour = Math.round(baseHydrationPerHour * tempFactor);
  const totalHydration = hydrationPerHour * totalTimeHours;

  const sodiumPerHour = 500;
  const totalSodium = sodiumPerHour * totalTimeHours;

  return {
    totalTimeHours,
    speedKmh,
    adjustedCaloriesPerHour,
    totalCalories,
    carbsPerHour,
    totalCarbs,
    hydrationPerHour,
    totalHydration,
    sodiumPerHour,
    totalSodium,
  };
}

// Training zone calculation - HR-based (Karvonen method)
function calculateHRZones(maxHR, restHR) {
  const hrReserve = maxHR - restHR;
  const zoneRanges = [
    { name: 'Zone 1', range: [0.50, 0.60] },
    { name: 'Zone 2', range: [0.60, 0.70] },
    { name: 'Zone 3', range: [0.70, 0.80] },
    { name: 'Zone 4', range: [0.80, 0.90] },
    { name: 'Zone 5', range: [0.90, 1.00] },
  ];

  return zoneRanges.map(z => ({
    name: z.name,
    minHR: Math.round(restHR + (hrReserve * z.range[0])),
    maxHR: Math.round(restHR + (hrReserve * z.range[1])),
  }));
}

// Training zone calculation - Pace-based
function calculatePaceZones(thresholdPaceSeconds) {
  const factors = [1.25, 1.15, 1.05, 1.0, 0.90];
  return factors.map(f => Math.round(thresholdPaceSeconds * f));
}

// BMI calculation
function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// Efficiency rating
function getEfficiencyRating(bmi, gender) {
  const optimalBMI = gender === 'female' ? 21 : 20;
  if (bmi < 18) return 'Too Light';
  if (bmi < optimalBMI - 1) return 'Very Lean';
  if (bmi <= optimalBMI + 1) return 'Optimal';
  if (bmi < 25) return 'Good';
  if (bmi < 27) return 'Carrying Extra';
  return 'Consider Weight Loss';
}

// Distance name lookup
function getDistanceName(km) {
  const distances = {
    1.60934: '1 Mile',
    5: '5 km',
    10: '10 km',
    21.0975: 'Half Marathon',
    42.195: 'Marathon',
    50: '50 km',
    80.4672: '50 Miles',
    100: '100 km',
    160.934: '100 Miles',
  };
  return distances[km] || `${km} km`;
}

// Export for testing (CommonJS-compatible conditional export)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateVDOT,
    calculateCooperVO2,
    calculateFMR,
    getVO2Classification,
    calculatePacePerKm,
    calculatePacePerMile,
    calculateSpeedKmh,
    calculateSpeedMph,
    formatTime,
    formatTimeFromSeconds,
    formatPace,
    predictRaceTimeQuick,
    calculatePersonalExponent,
    getAgeGradingClassification,
    calculateElevationAdjustment,
    calculateNutritionNeeds,
    calculateHRZones,
    calculatePaceZones,
    calculateBMI,
    getEfficiencyRating,
    getDistanceName,
  };
}
