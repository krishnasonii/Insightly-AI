const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        console.error("API Key missing.");
        return;
    }

    try {
        console.log("Checking available models via REST API...");
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        console.log("SUCCESS! Available Models:");
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Failed to list models via API.");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.log("Error Details:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

listModels();
