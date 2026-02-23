import type { ModelType, EnvironmentalImpact } from './types.js';
export declare const calculateImpact: (promptTokens: number, completionTokens: number, modelType: ModelType) => EnvironmentalImpact;
export declare const getComparison: (co2Grams: number) => string;
export declare const formatCo2: (g: number) => string;
export declare const formatEnergy: (wh: number) => string;
export declare const formatWater: (l: number) => string;
//# sourceMappingURL=calculator.d.ts.map