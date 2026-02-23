import { calculateImpact } from './calculator.js';
import { detectModelType } from './model-detector.js';
import { loadCumulativeData, updateCumulativeData } from './storage.js';

const [storageFile, model, inputTokens, outputTokens, transcriptThinkingTokens] = process.argv.slice(2);
const sessionId = storageFile.split('-').pop()?.replace('.json', '') || 'unknown';

const modelType = detectModelType(model);

// Compute delta thinking tokens (transcript total minus what we've already counted)
const transcriptThinking = parseInt(transcriptThinkingTokens ?? '0', 10);
const current = loadCumulativeData(sessionId);
const newThinkingTokens = Math.max(0, transcriptThinking - (current.seenThinkingTokens ?? 0));

const effectiveOutputTokens = parseInt(outputTokens, 10) + newThinkingTokens;

const impact = calculateImpact(
  parseInt(inputTokens, 10),
  effectiveOutputTokens,
  modelType
);

const totalTokens = parseInt(inputTokens, 10) + effectiveOutputTokens;
updateCumulativeData(sessionId, impact, totalTokens, transcriptThinking);
