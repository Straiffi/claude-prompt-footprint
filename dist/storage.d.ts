import type { CumulativeImpact } from './types.js';
export declare const loadCumulativeData: (sessionId: string) => CumulativeImpact;
export declare const saveCumulativeData: (sessionId: string, data: CumulativeImpact) => void;
export declare const updateCumulativeData: (sessionId: string, impact: {
    electricity: number;
    co2: number;
    water: number;
}, tokens: number, newSeenThinkingTokens: number) => CumulativeImpact;
export declare const cleanupSession: (sessionId: string) => void;
//# sourceMappingURL=storage.d.ts.map