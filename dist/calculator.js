import { getEmissionFactors, EMISSION_FACTORS } from './constants.js';
export const calculateImpact = (promptTokens, completionTokens, modelType) => {
    const factors = getEmissionFactors();
    const type = modelType === 'reasoning' ? 'reasoning' : 'nonReasoning';
    const adjustedCompletionTokens = modelType === 'reasoning'
        ? completionTokens * EMISSION_FACTORS.reasoningTokenMultiplier
        : completionTokens;
    const totalTokens = promptTokens + adjustedCompletionTokens;
    return {
        electricity: totalTokens * factors.electricity[type],
        co2: totalTokens * factors.co2[type],
        water: totalTokens * factors.water[type]
    };
};
export const getComparison = (co2Grams) => {
    const meters = Math.round(co2Grams / 0.15);
    if (meters < 10)
        return `≈ ${meters}m drive`;
    if (meters < 1000)
        return `≈ ${Math.round(meters / 10) * 10}m drive`;
    return `≈ ${(meters / 1000).toFixed(1)}km drive`;
};
// Format numbers with appropriate units
export const formatCo2 = (g) => {
    if (g >= 1000)
        return `${(g / 1000).toFixed(2)}kg`;
    return `${g.toFixed(0)}g`;
};
export const formatEnergy = (wh) => {
    if (wh >= 1000)
        return `${(wh / 1000).toFixed(2)}kWh`;
    return `${wh.toFixed(0)}Wh`;
};
export const formatWater = (l) => {
    if (l >= 1000)
        return `${(l / 1000).toFixed(2)}kL`;
    return `${l.toFixed(1)}L`;
};
//# sourceMappingURL=calculator.js.map