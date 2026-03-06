const { generateSummary } = require("./services/ai.service");
require("dotenv").config();

async function testSummary() {
    console.log("--- Starting Gemini Summarization Test ---");
    const sampleTranscript = `
Speaker 1: Hello everyone, let's discuss the project status.
Speaker 2: I've finished the frontend components.
Speaker 3: Great, I'll start the backend integration tomorrow.
Speaker 1: Perfect, let's aim for a demo on Friday.
`;

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-2.0-flash",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    const apiVersions = ["v1", "v1beta"];

    for (const apiVersion of apiVersions) {
        console.log(`\n=== Testing with API Version: ${apiVersion} ===`);
        for (const modelName of modelsToTry) {
            console.log(`\n[TEST] Trying model: ${modelName}...`);
            try {
                const { GoogleGenerativeAI } = require("@google/generative-ai");
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                
                
                
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(sampleTranscript);
                const response = await result.response;
                console.log(`[SUCCESS] Model ${modelName} worked on default API!`);
                console.log("Summary Snippet:", response.text().substring(0, 100) + "...");
                return;
            } catch (error) {
                console.error(`[FAILED] Model ${modelName} failed:`, error.message);
            }
        }
    }
    console.log("\n[TEST FAILED] All models failed.");
}

testSummary();
