const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const lines = envFile.split('\n');
        for (const line of lines) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                process.env[match[1].trim()] = match[2].trim();
            }
        }
    } catch (e) {
        console.error("Could not read .env.local");
    }
}
loadEnv();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Unfortunately the SDK doesn't expose listModels directly on the main class in this version easily.
        // But we can try to use the model manager if we can find it, or just try a few more variations.
        // Actually, let's try to fetch the models list using fetch directly to be sure.

        console.log("Fetching available models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
