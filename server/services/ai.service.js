const OpenAI = require("openai");




const groq = new OpenAI({
    apiKey: (process.env.GROQ_API_KEY || "").trim(),
    baseURL: "https://api.groq.com/openai/v1",
});

const generateSummary = async (transcript) => {
    if (!process.env.GROQ_API_KEY) {
        console.error("[GROQ] Error: GROQ_API_KEY is not defined in .env");
        return "Summary generation failed: AI service not configured.";
    }

    if (!transcript || transcript.trim().length === 0) {
        return "No transcript available to summarize.";
    }

    try {
        console.log("[GROQ] Generating structured summary using llama-3.1-8b-instant...");

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are a professional meeting assistant. Summarize the provided transcript into a clear, structured recap.
                    Your output MUST follow this exact structure:
                    
                    # Title
                    [Meeting Title]

                    ## Overview
                    [Brief overview of the meeting]

                    ## Key Points
                    - [Key point 1]
                    - [Key point 2]

                    ## Action Items
                    - [Action item 1]
                    - [Action item 2]

                    ## Conclusion
                    [Final closing remarks]

                    Format the output using professional Markdown. Keep it concise and focused.`
                },
                {
                    role: "user",
                    content: `Transcript to summarize:\n${transcript}`
                }
            ],
            temperature: 0.3,
            max_tokens: 600,
            top_p: 1,
            stream: false,
        });

        const summary = response.choices[0]?.message?.content;


        if (!summary) {
            throw new Error("Received empty response from Groq API.");
        }

        return summary;

    } catch (error) {
        console.error("[GROQ] Error during summarization:", error.message);

        
        if (error.status === 401) {
            return "Summary generation failed: Invalid Groq API key.";
        }
        if (error.status === 429) {
            return "Summary generation failed: Groq API rate limit exceeded. Please try again in a moment.";
        }

        return "Summary generation failed. An unexpected error occurred with the AI service.";
    }
};

module.exports = { generateSummary };
