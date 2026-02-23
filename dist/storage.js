import * as fs from 'node:fs';
const STORAGE_FILE = '/tmp/claude-env-tracker';
export const loadCumulativeData = (sessionId) => {
    const filePath = `${STORAGE_FILE}-${sessionId}.json`;
    try {
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return data;
        }
    }
    catch (e) {
        // File doesn't exist or is corrupted, start fresh
    }
    return {
        totalTokens: 0,
        totalElectricity: 0,
        totalCo2: 0,
        totalWater: 0,
        promptCount: 0
    };
};
export const saveCumulativeData = (sessionId, data) => {
    const filePath = `${STORAGE_FILE}-${sessionId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
export const updateCumulativeData = (sessionId, impact, tokens) => {
    const current = loadCumulativeData(sessionId);
    const updated = {
        totalTokens: current.totalTokens + tokens,
        totalElectricity: current.totalElectricity + impact.electricity,
        totalCo2: current.totalCo2 + impact.co2,
        totalWater: current.totalWater + impact.water,
        promptCount: current.promptCount + 1
    };
    saveCumulativeData(sessionId, updated);
    return updated;
};
export const cleanupSession = (sessionId) => {
    const filePath = `${STORAGE_FILE}-${sessionId}.json`;
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    catch (e) {
        // Ignore cleanup errors
    }
};
//# sourceMappingURL=storage.js.map