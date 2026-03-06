require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        console.error("API Key missing or placeholder.");
        return;
    }

    try {
        console.log("Checking available models via REST API (v1beta)...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
            return;
        }

        if (!data.models) {
            console.log("No models found in the response. Full response:", JSON.stringify(data, null, 2));
            return;
        }

        console.log("SUCCESS! Available Models:");
        data.models.forEach(m => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Failed to list models via API.");
        console.error("Error Message:", error.message);
    }
}

listModels();
