const { generateSummary } = require("./services/ai.service");
require("dotenv").config();

async function testGroqSummary() {
    console.log("--- Starting Groq Llama 3.1 8B Summarization Test ---");
    const sampleTranscript = `
Speaker 1: Hello everyone, let's discuss the project status. We need to decide on the database.
Speaker 2: I suggest using MongoDB for its flexibility.
Speaker 3: I agree. I'll start the setup tomorrow.
Speaker 1: Great, so the decision is MongoDB. Speaker 3, please have it ready by Friday.
`;

    try {
        const summary = await generateSummary(sampleTranscript);
        console.log("\n[TEST RESULT] Generated Summary:");
        console.log("----------------------------------");
        console.log(summary);
        console.log("----------------------------------");
    } catch (error) {
        console.error("\n[TEST FAILED] Error during test:", error.message);
    }
}

testGroqSummary();
