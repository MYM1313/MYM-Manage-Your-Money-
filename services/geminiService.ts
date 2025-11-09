import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface Source {
    uri: string;
    title: string;
}

const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: `You are 'MYM Money Coach,' a friendly, warm, and professional AI assistant for the personal finance app MYM (Manage Your Money). Your target audience is young Indians (18-30). The app has a premium, futuristic dark mode aesthetic. Your goal is to make personal finance feel calm, empowering, and simple.
        - Your tone should be light, stress-free, and encouraging.
        - Provide clear, actionable advice.
        - Use simple language, avoiding complex financial jargon.
        - You can use emojis to make the conversation more engaging.
        - Keep responses concise and easy to read on a mobile screen.
        - When asked for financial advice, provide general guidance and disclaim that you are an AI and not a licensed financial advisor.
        - You must be prepared to answer any query, not just personal finance. This includes general knowledge, current events, global finance news, historical facts, and any other non-financial inquiry. You have access to real-time information to answer these questions accurately.`,
        tools: [{googleSearch: {}}],
    },
});

export const getChatResponse = async (prompt: string): Promise<{ text: string; sources: Source[] }> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        let sources: Source[] = [];

        if (groundingMetadata?.groundingChunks) {
            const sourceMap = new Map<string, Source>();
            groundingMetadata.groundingChunks.forEach((chunk: any) => {
                const web = chunk.web;
                if (web && web.uri && !sourceMap.has(web.uri)) {
                    sourceMap.set(web.uri, { uri: web.uri, title: web.title || '' });
                }
            });
            sources = Array.from(sourceMap.values());
        }

        return { text: response.text, sources };
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get response from AI.");
    }
};