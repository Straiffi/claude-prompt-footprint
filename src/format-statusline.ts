import { loadCumulativeData } from './storage.js';
import { formatCo2, formatEnergy, formatWater, getComparison } from './calculator.js';

const [storageFile] = process.argv.slice(2);
const sessionId = storageFile.split('-').pop()?.replace('.json', '') || 'unknown';

const data = loadCumulativeData(sessionId);

if (data.promptCount === 0) {
  console.log('');
  process.exit(0);
}

const co2Str = formatCo2(data.totalCo2);
const energyStr = formatEnergy(data.totalElectricity);
const waterStr = formatWater(data.totalWater);
const comparison = getComparison(data.totalCo2);

console.log(`🌱 ${co2Str} (${comparison}) | ⚡ ${energyStr} | 💧 ${waterStr}`);
