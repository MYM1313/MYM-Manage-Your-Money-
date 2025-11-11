import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";

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

export interface ParsedTransaction {
    merchant: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

const expenseCategories = ['Food', 'Shopping', 'Transport', 'Rent', 'Utilities', 'Groceries', 'Health', 'EMI / Loans', 'Investment', 'SIP', 'Savings', 'Education', 'Insurance', 'Travel', 'Entertainment', 'Gifts', 'Personal Care', 'Subscriptions', 'Other'];
const incomeCategories = ['Salary', 'Business', 'Freelance', 'Investment Returns', 'Rental Income', 'Gifts', 'Other'];
const allCategories = [...new Set([...expenseCategories, ...incomeCategories])];

const transactionSchema = {
    type: Type.OBJECT,
    properties: {
        merchant: { type: Type.STRING, description: 'The name of the merchant or a short description of the expense/income, e.g., "Zomato", "Electricity Bill", "Monthly Salary".' },
        amount: { type: Type.NUMBER, description: 'The transaction amount as a positive number.' },
        category: { 
            type: Type.STRING, 
            description: 'The most appropriate category for this transaction from the provided list.',
            enum: allCategories
        },
        type: {
            type: Type.STRING,
            description: 'The type of transaction, either "income" or "expense".',
            enum: ['income', 'expense']
        }
    },
    required: ['merchant', 'amount', 'category', 'type']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        transactions: {
            type: Type.ARRAY,
            description: 'An array of parsed transactions.',
            items: transactionSchema
        }
    }
};

export const parseTransactionsFromText = async (prompt: string): Promise<ParsedTransaction[]> => {
    try {
        const systemInstruction = `You are an expert financial assistant. Parse the user's unstructured text into a structured list of transactions. Identify each transaction's merchant/description, amount, category, and whether it is an 'income' or 'expense'. Today's date is ${new Date().toDateString()}. Infer transaction type from keywords like 'got', 'received', 'salary' for income, and 'spent', 'paid', 'bought' for expenses. If type is ambiguous, default to expense. For example, 'Zomato 500 rs and got salary of 80000' should be two separate transactions.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Parse the following user input: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const json = JSON.parse(response.text);
        return json.transactions || [];
    } catch (error) {
        console.error("Gemini transaction parsing failed:", error);
        throw new Error("Failed to parse transactions with AI.");
    }
};