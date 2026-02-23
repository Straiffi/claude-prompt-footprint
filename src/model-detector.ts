import type { ModelType } from './types.js';

export const detectModelType = (modelName: string): ModelType => {
  if (!modelName) return 'unknown';
  
  const name = modelName.toLowerCase();
  
  // Claude Opus = reasoning
  if (name.includes('claude') && name.includes('opus')) return 'reasoning';
  
  // Claude with thinking = reasoning
  if (name.includes('claude') && name.includes('thinking')) return 'reasoning';
  
  // Claude Sonnet 4.6 always uses extended thinking in Claude Code
  if (name.includes('sonnet-4-6')) return 'light-reasoning';

  // Claude Sonnet/Haiku = non-reasoning
  if (name.includes('claude')) return 'non-reasoning';
  
  return 'non-reasoning';
};
