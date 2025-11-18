import { GoogleGenAI, Type } from "@google/genai";

interface Source {
    uri: string;
    title: string;
}

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const getChatResponse = async (prompt: string): Promise<{ text: string; sources: Source[] }> => {
    // Check if the prompt suggests a web search
    const isSearchQuery = /who|what|when|where|why|current|latest|price of/i.test(prompt);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // Only add the googleSearch tool if it seems like a search query
                tools: isSearchQuery ? [{ googleSearch: {} }] : [],
            },
        });
        
        const text = response.text;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: Source[] = groundingChunks
            .filter((chunk: any) => chunk.web && chunk.web.uri)
            .map((chunk: any) => ({
                uri: chunk.web.uri,
                title: chunk.web.title || chunk.web.uri,
            }));
            
        return { text, sources };

    } catch (error) {
        console.error("Gemini API call failed:", error);
        return {
            text: "I'm sorry, I encountered an error while processing your request. Please check your connection or try again later. 🛠️",
            sources: []
        };
    }
};

export interface ParsedTransaction {
    merchant: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

export const parseTransactionsFromText = async (prompt: string): Promise<ParsedTransaction[]> => {
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                merchant: {
                    type: Type.STRING,
                    description: "The name of the merchant or source of income/expense."
                },
                amount: {
                    type: Type.NUMBER,
                    description: "The monetary value of the transaction."
                },
                category: {
                    type: Type.STRING,
                    description: "A suitable category like 'Food', 'Shopping', 'Salary', 'Bills'."
                },
                type: {
                    type: Type.STRING,
                    enum: ['income', 'expense'],
                    description: "The type of transaction, either 'income' or 'expense'."
                }
            },
            required: ['merchant', 'amount', 'category', 'type']
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Parse the following text and extract all transactions into a JSON array. Identify the merchant, amount, category, and whether it is an 'income' or 'expense'. Use your best judgement for categorization. Text: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (Array.isArray(parsedData)) {
            return parsedData as ParsedTransaction[];
        }
        return [];

    } catch (error) {
        console.error("Gemini transaction parsing failed:", error);
        throw new Error("Failed to parse transactions with AI. The model might be unable to understand the format.");
    }
};