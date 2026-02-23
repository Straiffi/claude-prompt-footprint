import type { ModelType } from './types.js';

export const detectModelType = (modelName: string): ModelType => {
  if (!modelName) return 'unknown';
  
  const name = modelName.toLowerCase();
  
  // Claude Opus = reasoning
  if (name.includes('claude') && name.includes('opus')) return 'reasoning';
  
  // Claude with thinking = reasoning
  if (name.includes('claude') && name.includes('thinking')) return 'reasoning';
  
  // Claude Sonnet/Haiku = non-reasoning
  if (name.includes('claude')) return 'non-reasoning';
  
  return 'non-reasoning';
};
