import React, { useState, useContext, FC } from 'react';
import { FinancialContext } from '../../App';
import { parseTransactionsFromText, ParsedTransaction } from '../../services/geminiService';
import { ChatIcon as SparklesIcon } from '../icons/ChatIcon';
import { XIcon } from '../icons/XIcon';

interface AITransactionModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const categoryIcons: { [key: string]: string } = {
    'Food': '🍔', 'Shopping': '🛍️', 'Transport': '🚗', 'Housing': '🏠', 'Utilities': '💡',
    'Health': '❤️', 'Entertainment': '🎬', 'Groceries': '🛒', 'Salary': '💼',
    'Freelance': '🖋️', 'Investment': '📈', 'Savings': '🎯', 'EMI': '🏦', 'Loan Payment': '🏦', 'Insurance Premium': '🛡️',
    'Rent': '🏠', 'Bills': '🧾', 'EMI / Loans': '🏦',
    'Default': '💰', 'Other': '💰'
};

const AITransactionModal: FC<AITransactionModalProps> = ({ isVisible, onClose }) => {
    const { addTransaction } = useContext(FinancialContext);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
    const [step, setStep] = useState<'input' | 'confirm'>('input');

    const handleReset = () => {
        setInputText('');
        setIsLoading(false);
        setError(null);
        setParsedTransactions([]);
        setStep('input');
    };
    
    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await parseTransactionsFromText(inputText);
            if (result && result.length > 0) {
                setParsedTransactions(result);
                setStep('confirm');
            } else {
                setError("The AI couldn't find any transactions. Please try rephrasing.");
            }
        } catch (e) {
            setError("AI transaction parsing is temporarily disabled. Please add transactions manually.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmAndAdd = () => {
        parsedTransactions.forEach(parsed => {
            addTransaction({
                merchant: parsed.merchant,
                amount: parsed.amount,
                category: parsed.category,
                date: new Date().toISOString(),
                isRecurring: false,
                transactionType: parsed.type,
            });
        });
        handleClose();
    };

    const handleRemoveTransaction = (index: number) => {
        setParsedTransactions(prev => prev.filter((_, i) => i !== index));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-[60]" onClick={handleClose}>
            <div 
                className="w-full bg-gradient-to-t from-[#0F0F1F] to-[#1e1e1e] border-t-2 border-purple-500/50 rounded-t-3xl flex flex-col max-h-[75vh] animate-slide-up" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 pb-4 flex-shrink-0">
                    <div className="flex justify-center mb-4"><div className="w-16 h-1.5 bg-gray-700 rounded-full"></div></div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-900/50 rounded-lg"><SparklesIcon className="h-6 w-6 text-purple-300"/></div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Add Transactions with AI</h2>
                            <p className="text-sm text-gray-400">Describe your spending in one go.</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pb-6">
                    {step === 'input' && (
                        <>
                            <textarea 
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="e.g., Zomato 500 rs, paid my phone bill for 999, and groceries for 1200 from Blinkit"
                                className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                            />
                            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        </>
                    )}
                    {step === 'confirm' && (
                        <div className="space-y-3">
                             <h3 className="font-semibold text-gray-300">Please review the transactions found by AI:</h3>
                             {parsedTransactions.map((t, index) => (
                                <div key={index} className="bg-black/30 rounded-lg p-3 flex items-center space-x-3 group">
                                    <span className="text-2xl">{categoryIcons[t.category] || categoryIcons['Default']}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-100">{t.merchant}</p>
                                        <p className="text-xs text-gray-400">{t.category}</p>
                                    </div>
                                    <p className={`font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                    </p>
                                    <button onClick={() => handleRemoveTransaction(index)} className="p-1 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                             ))}
                        </div>
                    )}
                </div>
                
                <div className="p-6 pt-4 flex-shrink-0">
                    {step === 'input' && (
                        <button onClick={handleAnalyze} disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transform hover:scale-105 active:scale-100 transition-transform disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Analyzing...' : 'Analyze Text'}
                        </button>
                    )}
                    {step === 'confirm' && (
                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 py-3 bg-gray-700/50 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/50">Back</button>
                            <button onClick={handleConfirmAndAdd} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20">
                                Confirm & Add
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AITransactionModal;
