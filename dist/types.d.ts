export type ModelType = 'reasoning' | 'non-reasoning' | 'unknown';
export type SessionData = {
    model: string;
    modelType: ModelType;
    promptTokens: number;
    completionTokens: number;
    reasoningMultiplier: number;
};
export type EnvironmentalImpact = {
    electricity: number;
    co2: number;
    water: number;
};
export type CumulativeImpact = {
    totalTokens: number;
    totalElectricity: number;
    totalCo2: number;
    totalWater: number;
    promptCount: number;
};
//# sourceMappingURL=types.d.ts.map