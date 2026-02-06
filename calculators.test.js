/**
 * Running Calculator - Core Calculation Tests
 * =============================================
 * Regression tests for all pure math functions in calculators.js.
 *
 * Run with: npm test
 */

/**
 * Functions are loaded into the global scope via test-setup.js
 * which evaluates calculators.js using vm.runInThisContext().
 * Vitest globals (describe, it, expect) are enabled in vitest.config.js.
 */

// -------------------------------------------
// VO2 Max Tests
// -------------------------------------------
describe('VO2 Max - VDOT formula', () => {
  it('calculates VO2 for 5000m in 20 minutes', () => {
    // speed = 5000/20 = 250 m/min, VO2 = 0.2*250 + 3.5 = 53.5
    const vo2 = calculateVDOT(5000, 20);
    expect(vo2).toBeCloseTo(53.5, 1);
  });

  it('calculates VO2 for 10000m in 50 minutes', () => {
    // speed = 10000/50 = 200, VO2 = 0.2*200 + 3.5 = 43.5
    const vo2 = calculateVDOT(10000, 50);
    expect(vo2).toBeCloseTo(43.5, 1);
  });

  it('faster time gives higher VO2', () => {
    const slow = calculateVDOT(5000, 30);
    const fast = calculateVDOT(5000, 20);
    expect(fast).toBeGreaterThan(slow);
  });
});

describe('VO2 Max - Cooper test', () => {
  it('calculates VO2 for 3000m in 12 min run', () => {
    // (3000 - 504.9) / 44.73 = 55.78
    const vo2 = calculateCooperVO2(3000);
    expect(vo2).toBeCloseTo(55.78, 1);
  });

  it('calculates VO2 for 2000m in 12 min run', () => {
    // (2000 - 504.9) / 44.73 = 33.41
    const vo2 = calculateCooperVO2(2000);
    expect(vo2).toBeCloseTo(33.41, 1);
  });

  it('further distance gives higher VO2', () => {
    expect(calculateCooperVO2(3000)).toBeGreaterThan(calculateCooperVO2(2000));
  });
});

describe('VO2 Max - FMR formula', () => {
  it('calculates for male age 30', () => {
    // distance=5000, time=20min, maxHR=190, restHR=60, male=1, age=30
    const vo2 = calculateFMR(5000, 20, 190, 60, 1, 30);
    // speed=250, vo2Time=53.5, vo2HR=15*(190/60)=47.5, avg=50.5
    // age>25: factor=1-(0.002*5)=0.99, result=50.5*0.99=49.995
    expect(vo2).toBeCloseTo(49.995, 1);
  });

  it('female gets 5% reduction', () => {
    const male = calculateFMR(5000, 20, 190, 60, 1, 20);
    const female = calculateFMR(5000, 20, 190, 60, 0, 20);
    expect(female).toBeCloseTo(male * 0.95, 1);
  });

  it('age adjustment caps at 0.7 factor', () => {
    // Age 200 would give factor = 1 - 0.002*175 = 0.65, capped at 0.7
    const vo2 = calculateFMR(5000, 20, 190, 60, 1, 200);
    const vo2Age25 = calculateFMR(5000, 20, 190, 60, 1, 25);
    expect(vo2).toBeCloseTo(vo2Age25 * 0.7, 1);
  });

  it('no age adjustment for age 25 or under', () => {
    const vo2_20 = calculateFMR(5000, 20, 190, 60, 1, 20);
    const vo2_25 = calculateFMR(5000, 20, 190, 60, 1, 25);
    expect(vo2_20).toBeCloseTo(vo2_25, 5);
  });
});

describe('VO2 Classification', () => {
  it('returns Poor for VO2 < 35', () => {
    expect(getVO2Classification(30)).toBe('Poor');
  });
  it('returns Fair for VO2 35-44', () => {
    expect(getVO2Classification(40)).toBe('Fair');
  });
  it('returns Good for VO2 45-54', () => {
    expect(getVO2Classification(50)).toBe('Good');
  });
  it('returns Excellent for VO2 55-64', () => {
    expect(getVO2Classification(60)).toBe('Excellent');
  });
  it('returns Superior for VO2 >= 65', () => {
    expect(getVO2Classification(70)).toBe('Superior');
  });
});

// -------------------------------------------
// Pace Calculation Tests
// -------------------------------------------
describe('Pace calculations', () => {
  it('calculates pace per km correctly', () => {
    // 10km in 50min (3000s) => 300s/km = 5:00/km
    expect(calculatePacePerKm(3000, 10)).toBe(300);
  });

  it('calculates pace per mile correctly', () => {
    // 10km in 3000s => pace/mile = 3000 / (10/1.60934) = 3000/6.2137 = ~482.8
    const pace = calculatePacePerMile(3000, 10);
    expect(pace).toBeCloseTo(482.8, 0);
  });

  it('calculates speed in km/h', () => {
    // 10km in 3000s => 10/3000*3600 = 12 km/h
    expect(calculateSpeedKmh(3000, 10)).toBe(12);
  });

  it('calculates speed in mph', () => {
    // 12 km/h / 1.60934 = 7.456 mph
    const mph = calculateSpeedMph(3000, 10);
    expect(mph).toBeCloseTo(7.456, 2);
  });
});

// -------------------------------------------
// Format Functions Tests
// -------------------------------------------
describe('formatTime', () => {
  it('formats hours, minutes, seconds', () => {
    expect(formatTime(1, 30, 5)).toBe('1h 30m 05s');
  });

  it('omits hours when zero', () => {
    expect(formatTime(0, 25, 30)).toBe('25m 30s');
  });

  it('pads seconds with leading zero', () => {
    expect(formatTime(0, 5, 3)).toBe('5m 03s');
  });
});

describe('formatTimeFromSeconds', () => {
  it('formats 3661 seconds as 1h 1m 01s', () => {
    expect(formatTimeFromSeconds(3661)).toBe('1h 1m 01s');
  });

  it('formats 300 seconds as 5m 00s', () => {
    expect(formatTimeFromSeconds(300)).toBe('5m 00s');
  });

  it('formats 7200 seconds as 2h 0m 00s', () => {
    expect(formatTimeFromSeconds(7200)).toBe('2h 0m 00s');
  });
});

describe('formatPace', () => {
  it('formats 300 seconds/km as 5:00', () => {
    expect(formatPace(300)).toBe('5:00');
  });

  it('formats 270 seconds/km as 4:30', () => {
    expect(formatPace(270)).toBe('4:30');
  });

  it('pads seconds with leading zero', () => {
    expect(formatPace(305)).toBe('5:05');
  });
});

// -------------------------------------------
// Race Time Prediction Tests
// -------------------------------------------
describe('Race time prediction - Quick mode', () => {
  it('predicts same time for same distance', () => {
    const predicted = predictRaceTimeQuick(10, 50, 10, 1.06);
    expect(predicted).toBeCloseTo(50, 5);
  });

  it('predicts longer time for longer distance', () => {
    const predicted = predictRaceTimeQuick(10, 50, 42.195, 1.06);
    expect(predicted).toBeGreaterThan(50);
  });

  it('predicts shorter time for shorter distance', () => {
    const predicted = predictRaceTimeQuick(10, 50, 5, 1.06);
    expect(predicted).toBeLessThan(50);
  });

  it('higher fatigue factor gives slower predictions', () => {
    const fast = predictRaceTimeQuick(10, 50, 42.195, 1.04);
    const slow = predictRaceTimeQuick(10, 50, 42.195, 1.10);
    expect(slow).toBeGreaterThan(fast);
  });
});

describe('Personal exponent calculation', () => {
  it('calculates Riegel-like exponent from two races', () => {
    // 5K in 20min, 10K in ~41.4min would give exponent ~1.06
    const time5k = 20 * 60; // 1200s
    const time10k = 41.4 * 60; // 2484s
    const exponent = calculatePersonalExponent(5, time5k, 10, time10k);
    expect(exponent).toBeCloseTo(1.06, 1);
  });

  it('returns exponent > 1 for typical runners', () => {
    const exponent = calculatePersonalExponent(5, 1200, 42.195, 14400);
    expect(exponent).toBeGreaterThan(1);
  });
});

// -------------------------------------------
// Age Grading Tests
// -------------------------------------------
describe('Age grading classification', () => {
  it('returns World Class for >= 100%', () => {
    expect(getAgeGradingClassification(100)).toBe('World Class');
  });
  it('returns National Class for 90-99%', () => {
    expect(getAgeGradingClassification(92)).toBe('National Class');
  });
  it('returns Regional Class for 80-89%', () => {
    expect(getAgeGradingClassification(85)).toBe('Regional Class');
  });
  it('returns Local Class for 70-79%', () => {
    expect(getAgeGradingClassification(75)).toBe('Local Class');
  });
  it('returns Excellent for 60-69%', () => {
    expect(getAgeGradingClassification(65)).toBe('Excellent');
  });
  it('returns Good for < 60%', () => {
    expect(getAgeGradingClassification(55)).toBe('Good');
  });
});

// -------------------------------------------
// Elevation Adjustment Tests
// -------------------------------------------
describe('Elevation adjustment', () => {
  it('adds time for elevation gain', () => {
    const flat = 3600; // 1 hour
    const adjusted = calculateElevationAdjustment(flat, 1000, 0, 1.0);
    // gainPenalty = (1000/10)*60 = 6000s, lossBenefit = 0, terrainPenalty = 0
    expect(adjusted).toBe(3600 + 6000);
  });

  it('reduces time for elevation loss (capped)', () => {
    const flat = 3600;
    const adjusted = calculateElevationAdjustment(flat, 500, 500, 1.0);
    // gainPenalty = (500/10)*60 = 3000
    // lossBenefit = min((500/10)*30, (500/10)*30) = 1500
    // net = 3600 + 3000 - 1500 = 5100
    expect(adjusted).toBe(5100);
  });

  it('adds terrain penalty', () => {
    const flat = 3600;
    const adjusted = calculateElevationAdjustment(flat, 0, 0, 1.2);
    // terrainPenalty = 3600 * 0.2 = 720
    expect(adjusted).toBe(3600 + 720);
  });

  it('returns flat time when no elevation and smooth terrain', () => {
    expect(calculateElevationAdjustment(3600, 0, 0, 1.0)).toBe(3600);
  });

  it('loss benefit is capped at half of gain penalty', () => {
    // Even with much more loss than gain, benefit is capped
    const adjusted = calculateElevationAdjustment(3600, 100, 10000, 1.0);
    // gainPenalty = (100/10)*60 = 600
    // lossBenefit = min((10000/10)*30, (100/10)*30) = min(30000, 300) = 300
    expect(adjusted).toBe(3600 + 600 - 300);
  });
});

// -------------------------------------------
// Nutrition Calculation Tests
// -------------------------------------------
describe('Nutrition calculations', () => {
  it('calculates total race time correctly', () => {
    const result = calculateNutritionNeeds(70, 50, 6, 1.0, 1.0);
    // totalTimeHours = (50 * 6) / 60 = 5
    expect(result.totalTimeHours).toBe(5);
  });

  it('uses 70g carbs/hour for races > 2.5 hours', () => {
    const result = calculateNutritionNeeds(70, 50, 6, 1.0, 1.0);
    expect(result.carbsPerHour).toBe(70);
  });

  it('uses 50g carbs/hour for races <= 2.5 hours', () => {
    const result = calculateNutritionNeeds(70, 10, 6, 1.0, 1.0);
    // totalTimeHours = (10*6)/60 = 1
    expect(result.carbsPerHour).toBe(50);
  });

  it('adjusts hydration for hot temperature', () => {
    const normal = calculateNutritionNeeds(70, 50, 6, 1.0, 1.0);
    const hot = calculateNutritionNeeds(70, 50, 6, 1.0, 1.5);
    expect(hot.hydrationPerHour).toBeGreaterThan(normal.hydrationPerHour);
  });

  it('terrain factor increases calories', () => {
    const flat = calculateNutritionNeeds(70, 50, 6, 1.0, 1.0);
    const hilly = calculateNutritionNeeds(70, 50, 6, 1.3, 1.0);
    expect(hilly.totalCalories).toBeGreaterThan(flat.totalCalories);
  });

  it('calculates speed correctly', () => {
    const result = calculateNutritionNeeds(70, 50, 6, 1.0, 1.0);
    // speed = 60 / 6 = 10 km/h
    expect(result.speedKmh).toBe(10);
  });
});

// -------------------------------------------
// Training Zones Tests
// -------------------------------------------
describe('Heart rate training zones (Karvonen)', () => {
  it('calculates 5 zones', () => {
    const zones = calculateHRZones(190, 50);
    expect(zones).toHaveLength(5);
  });

  it('Zone 1 starts at 50% HRR', () => {
    const zones = calculateHRZones(190, 50);
    // HRR = 140, 50% = 70, + rest 50 = 120
    expect(zones[0].minHR).toBe(120);
  });

  it('Zone 5 maxes at 100% HRR', () => {
    const zones = calculateHRZones(190, 50);
    // 100% of HRR = 140 + 50 = 190
    expect(zones[4].maxHR).toBe(190);
  });

  it('zones are in ascending order', () => {
    const zones = calculateHRZones(190, 50);
    for (let i = 1; i < zones.length; i++) {
      expect(zones[i].minHR).toBeGreaterThanOrEqual(zones[i - 1].minHR);
    }
  });
});

describe('Pace training zones', () => {
  it('returns 5 pace zones', () => {
    const zones = calculatePaceZones(270); // 4:30/km threshold
    expect(zones).toHaveLength(5);
  });

  it('Zone 5 (VO2) is fastest (lowest seconds)', () => {
    const zones = calculatePaceZones(270);
    expect(zones[4]).toBeLessThan(zones[0]);
  });

  it('Zone 4 (threshold) equals the input threshold pace', () => {
    const zones = calculatePaceZones(270);
    expect(zones[3]).toBe(270); // factor 1.0
  });
});

// -------------------------------------------
// BMI and Efficiency Tests
// -------------------------------------------
describe('BMI calculation', () => {
  it('calculates BMI correctly', () => {
    // 70kg, 175cm => BMI = 70/(1.75^2) = 22.86
    const bmi = calculateBMI(70, 175);
    expect(bmi).toBeCloseTo(22.86, 1);
  });
});

describe('Efficiency rating', () => {
  it('returns Optimal for male at BMI 20', () => {
    expect(getEfficiencyRating(20, 'male')).toBe('Optimal');
  });
  it('returns Too Light for BMI < 18', () => {
    expect(getEfficiencyRating(17, 'male')).toBe('Too Light');
  });
  it('returns Good for BMI 22-24 male', () => {
    expect(getEfficiencyRating(23, 'male')).toBe('Good');
  });
  it('returns Optimal for female at BMI 21', () => {
    expect(getEfficiencyRating(21, 'female')).toBe('Optimal');
  });
});

// -------------------------------------------
// Distance Name Tests
// -------------------------------------------
describe('Distance name lookup', () => {
  it('returns Marathon for 42.195', () => {
    expect(getDistanceName(42.195)).toBe('Marathon');
  });
  it('returns 5 km for 5', () => {
    expect(getDistanceName(5)).toBe('5 km');
  });
  it('returns fallback for unknown distance', () => {
    expect(getDistanceName(15)).toBe('15 km');
  });
});
