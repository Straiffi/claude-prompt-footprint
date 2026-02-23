import type { ModelType, EnvironmentalImpact } from './types.js';
import { getEmissionFactors } from './constants.js';

export const calculateImpact = (
  promptTokens: number,
  completionTokens: number,
  modelType: ModelType
): EnvironmentalImpact => {
  const factors = getEmissionFactors();
  const type = modelType === 'reasoning' ? 'reasoning' : 'nonReasoning';

  const totalTokens = promptTokens + completionTokens;
  
  return {
    electricity: totalTokens * factors.electricity[type],
    co2: totalTokens * factors.co2[type],
    water: totalTokens * factors.water[type]
  };
};

export const getComparison = (co2Grams: number): string => {
  const meters = Math.round(co2Grams / 0.15);
  
  if (meters < 10) return `≈ ${meters}m drive`;
  if (meters < 1000) return `≈ ${Math.round(meters / 10) * 10}m drive`;
  return `≈ ${(meters / 1000).toFixed(1)}km drive`;
};

// Format numbers with appropriate units
export const formatCo2 = (g: number): string => {
  if (g >= 1000) return `${(g / 1000).toFixed(2)}kg`;
  return `${g.toFixed(0)}g`;
};

export const formatEnergy = (wh: number): string => {
  if (wh >= 1000) return `${(wh / 1000).toFixed(2)}kWh`;
  return `${wh.toFixed(0)}Wh`;
};

export const formatWater = (l: number): string => {
  if (l >= 1000) return `${(l / 1000).toFixed(2)}kL`;
  return `${l.toFixed(1)}L`;
};
