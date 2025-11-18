
interface Source {
    uri: string;
    title: string;
}

export const getChatResponse = async (prompt: string): Promise<{ text: string; sources: Source[] }> => {
    // Mock response to simulate AI delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                text: "AI functionality is currently disabled in this demo version. This is a static response to your query.",
                sources: []
            });
        }, 1000);
    });
};

export interface ParsedTransaction {
    merchant: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

export const parseTransactionsFromText = async (prompt: string): Promise<ParsedTransaction[]> => {
    // Mock response to simulate parsing
    return new Promise((resolve) => {
         setTimeout(() => {
            // Return a dummy transaction for demo purposes
            resolve([
                {
                    merchant: "Demo Merchant",
                    amount: 500,
                    category: "Food",
                    type: "expense"
                }
            ]);
        }, 1000);
    });
};
