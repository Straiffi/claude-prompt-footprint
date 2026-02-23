import type { CumulativeImpact } from './types.js';
import * as fs from 'node:fs';

const STORAGE_FILE = '/tmp/claude-env-tracker';

export const loadCumulativeData = (sessionId: string): CumulativeImpact => {
  const filePath = `${STORAGE_FILE}-${sessionId}.json`;
  
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data as CumulativeImpact;
    }
  } catch (e) {
    // File doesn't exist or is corrupted, start fresh
  }
  
  return {
    totalTokens: 0,
    totalElectricity: 0,
    totalCo2: 0,
    totalWater: 0,
    promptCount: 0
  };
};

export const saveCumulativeData = (sessionId: string, data: CumulativeImpact): void => {
  const filePath = `${STORAGE_FILE}-${sessionId}.json`;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const updateCumulativeData = (
  sessionId: string,
  impact: { electricity: number; co2: number; water: number },
  tokens: number
): CumulativeImpact => {
  const current = loadCumulativeData(sessionId);
  
  const updated: CumulativeImpact = {
    totalTokens: current.totalTokens + tokens,
    totalElectricity: current.totalElectricity + impact.electricity,
    totalCo2: current.totalCo2 + impact.co2,
    totalWater: current.totalWater + impact.water,
    promptCount: current.promptCount + 1
  };
  
  saveCumulativeData(sessionId, updated);
  return updated;
};

export const cleanupSession = (sessionId: string): void => {
  const filePath = `${STORAGE_FILE}-${sessionId}.json`;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    // Ignore cleanup errors
  }
};
