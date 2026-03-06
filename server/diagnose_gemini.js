const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        console.error("API Key missing or placeholder.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        
        const models = await genAI.listModels();
        console.log("Available Gemini Models:");
        models.models.forEach(m => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Failed to list models:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data));
        }
    }
}

listModels();
