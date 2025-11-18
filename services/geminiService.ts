
interface Source {
    uri: string;
    title: string;
}

export const getChatResponse = async (prompt: string): Promise<{ text: string; sources: Source[] }> => {
    const lower = prompt.toLowerCase();
    let response = "I'm your offline financial assistant. I can help with basic concepts like SIP, debt, savings strategies, and budgeting.";

    // Basic offline knowledge base
    if (lower.includes('sip')) {
        response = "A Systematic Investment Plan (SIP) allows you to invest small amounts regularly in mutual funds. It helps in rupee cost averaging and instills financial discipline.";
    } else if (lower.includes('debt') || lower.includes('loan')) {
        response = "To manage debt effectively, consider the Avalanche method (paying off highest interest debt first to save money) or the Snowball method (paying off smallest debt first for motivation).";
    } else if (lower.includes('save') || lower.includes('saving') || lower.includes('budget')) {
        response = "A popular budgeting strategy is the 50/30/20 rule: Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.";
    } else if (lower.includes('emergency')) {
        response = "An emergency fund is crucial. Aim to save 3-6 months of living expenses in a liquid asset like a savings account or liquid fund to cover unexpected costs.";
    } else if (lower.includes('invest') || lower.includes('stock') || lower.includes('market')) {
        response = "Investing helps your money grow and beat inflation. Diversify your portfolio across different asset classes like stocks, bonds, and gold to manage risk.";
    } else if (lower.includes('tax')) {
         response = "You can save tax under Section 80C (up to ₹1.5L) via PPF, ELSS, or LIC. Health insurance premiums offer deductions under Section 80D.";
    } else if (lower.includes('fd') || lower.includes('fixed deposit')) {
        response = "Fixed Deposits (FDs) offer guaranteed returns and are safer than stocks, but returns are often lower. They are great for short-term goals or emergency funds.";
    }

    // Simulate a short network delay for realism
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                text: response,
                sources: []
            });
        }, 600);
    });
};

export interface ParsedTransaction {
    merchant: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

export const parseTransactionsFromText = async (prompt: string): Promise<ParsedTransaction[]> => {
    // Local Regex-based parser to simulate AI extraction without an API
    const transactions: ParsedTransaction[] = [];
    const lower = prompt.toLowerCase();

    // 1. Attempt to extract amount (looks for numbers)
    const amountRegex = /(\d+)/g;
    const amounts = lower.match(amountRegex);

    if (amounts && amounts.length > 0) {
        // 2. Heuristic Category Detection
        let category = 'Other';
        if (lower.includes('food') || lower.includes('zomato') || lower.includes('swiggy') || lower.includes('pizza') || lower.includes('burger')) category = 'Food';
        else if (lower.includes('grocery') || lower.includes('blinkit') || lower.includes('bigbasket') || lower.includes('zepto') || lower.includes('milk')) category = 'Groceries';
        else if (lower.includes('cab') || lower.includes('uber') || lower.includes('ola') || lower.includes('fuel') || lower.includes('petrol') || lower.includes('bus')) category = 'Transport';
        else if (lower.includes('shopping') || lower.includes('amazon') || lower.includes('flipkart') || lower.includes('clothes')) category = 'Shopping';
        else if (lower.includes('bill') || lower.includes('electricity') || lower.includes('wifi') || lower.includes('recharge')) category = 'Utilities';
        else if (lower.includes('rent')) category = 'Rent';
        else if (lower.includes('movie') || lower.includes('cinema') || lower.includes('netflix')) category = 'Entertainment';

        // 3. Heuristic Type Detection
        let type: 'income' | 'expense' = 'expense';
        if (lower.includes('received') || lower.includes('income') || lower.includes('salary') || lower.includes('credited')) type = 'income';

        // 4. Heuristic Merchant Detection
        // Try to find a word that looks like a name (capitalized in original prompt), skipping common words
        const commonWords = ['i', 'paid', 'spent', 'on', 'for', 'to', 'the', 'a', 'an', 'at', 'in', 'rs', 'rupees', 'my'];
        const words = prompt.split(/\s+/);
        let merchant = category === 'Other' ? 'Unknown Merchant' : category; // Default to category name
        
        for (const word of words) {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '');
            if (cleanWord.length > 2 && /^[A-Z]/.test(word) && !commonWords.includes(cleanWord.toLowerCase())) {
                merchant = cleanWord;
                break;
            }
        }

        // Use the first number found as the amount
        const amount = parseInt(amounts[0]);

        transactions.push({
            merchant: merchant,
            amount: amount,
            category: category,
            type: type
        });
    }

    return new Promise((resolve) => {
         setTimeout(() => {
            resolve(transactions);
        }, 800);
    });
};
