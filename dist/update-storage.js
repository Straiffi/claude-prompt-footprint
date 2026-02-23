import { calculateImpact } from './calculator.js';
import { detectModelType } from './model-detector.js';
import { updateCumulativeData } from './storage.js';
const [storageFile, model, inputTokens, outputTokens] = process.argv.slice(2);
const sessionId = storageFile.split('-').pop()?.replace('.json', '') || 'unknown';
const modelType = detectModelType(model);
const impact = calculateImpact(parseInt(inputTokens, 10), parseInt(outputTokens, 10), modelType);
const totalTokens = parseInt(inputTokens, 10) + parseInt(outputTokens, 10);
updateCumulativeData(sessionId, impact, totalTokens);
//# sourceMappingURL=update-storage.js.map