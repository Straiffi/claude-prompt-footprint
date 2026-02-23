// Emission factors based on research from Google Cloud, EcoLogits, and academic papers
export const EMISSION_FACTORS = {
    // Electricity consumption per token (Wh/token)
    electricityPerToken: {
        nonReasoning: 0.01, // ~10mWh per token for standard inference
        reasoning: 0.03 // ~30mWh per token (3x for reasoning models)
    },
    // Grid carbon intensity (kg CO2 per kWh) - global average
    // Source: IEA Global Energy Review 2024
    co2PerKWh: 0.5,
    // Water usage for datacenter cooling (L per kWh)
    // Source: Google Cloud sustainability reports
    waterPerKWh: 1.8,
    // Reasoning multiplier for hidden tokens
    reasoningTokenMultiplier: 3.0
};
export const getEmissionFactors = () => {
    const { electricityPerToken, co2PerKWh, waterPerKWh } = EMISSION_FACTORS;
    return {
        electricity: electricityPerToken,
        co2: {
            nonReasoning: (electricityPerToken.nonReasoning / 1000) * co2PerKWh * 1000,
            reasoning: (electricityPerToken.reasoning / 1000) * co2PerKWh * 1000
        },
        water: {
            nonReasoning: (electricityPerToken.nonReasoning / 1000) * waterPerKWh,
            reasoning: (electricityPerToken.reasoning / 1000) * waterPerKWh
        }
    };
};
//# sourceMappingURL=constants.js.map