// All AI functionality has been disabled for this version of the app.

interface Source {
    uri: string;
    title: string;
}

export const getChatResponse = async (prompt: string): Promise<{ text: string; sources: Source[] }> => {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 500));
    
    // Return a mock response indicating the feature is disabled
    return {
        text: "I'm sorry, the AI chat functionality is temporarily disabled. We're working on bringing it back soon! 🛠️",
        sources: []
    };
};

export interface ParsedTransaction {
    merchant: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

export const parseTransactionsFromText = async (prompt: string): Promise<ParsedTransaction[]> => {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 1000));

    // Throw an error to indicate the feature is disabled
    throw new Error("AI transaction parsing is temporarily disabled.");
};
