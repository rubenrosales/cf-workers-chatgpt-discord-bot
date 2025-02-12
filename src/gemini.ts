const { GoogleGenerativeAI } = require("@google/generative-ai");

export namespace Gemini {

    export interface Message {
        role: "user" | "model";
        content: string;
    }

    export async function complete(apiKey: string, modelName: string, behavior: string, userIdentifier: string, context: Message[]): Promise<string> {
        try {
            // Initialize GoogleGenerativeAI with your API key
            const genAI = new GoogleGenerativeAI(apiKey);

            // Get the model
            const model = genAI.getGenerativeModel({ model: modelName });

            // Prepare the chat history
            const chatHistory = context.slice(0, context.length - 1).map(message => ({ // Exclude the latest user message from history.
                role: message.role,
                parts: [message.content],
            }));

            // Create a chat session
            const chat = model.startChat({
                history: chatHistory,
                generationConfig: {
                    maxOutputTokens: 2048, // Adjust as needed
                    temperature: 0.4,    // Adjust as needed
                    topP: 1,              // Adjust as needed
                },

            });

             // Send the latest user message
            const latestUserMessage = context[context.length - 1].content; // Get the latest user message

            // Send the prompt to the model
            const result = await chat.sendMessage(latestUserMessage);

            const responseText = result.response.candidates[0].content.parts[0].text;

            return responseText;

        } catch (error: any) {
            console.error("Error in Gemini.complete:", error);
            return `An error occurred while processing your request: ${error.message || error}`;
        }
    }
}