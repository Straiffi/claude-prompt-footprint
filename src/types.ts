export type ModelType = 'reasoning' | 'non-reasoning' | 'unknown';

export type SessionData = {
  model: string;
  modelType: ModelType;
  promptTokens: number;
  completionTokens: number;
  reasoningMultiplier: number;
};

export type EnvironmentalImpact = {
  electricity: number;  // Wh
  co2: number;          // gCO2eq
  water: number;        // L
};

export type CumulativeImpact = {
  totalTokens: number;
  totalElectricity: number;  // Wh
  totalCo2: number;          // g
  totalWater: number;        // L
  promptCount: number;
};
