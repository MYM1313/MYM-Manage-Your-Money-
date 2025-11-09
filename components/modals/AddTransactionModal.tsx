import React, { useState, useContext, useMemo, useEffect } from 'react';
import { FinancialContext } from '../../App';
import { DetailedSavingsGoal, InvestmentGoal } from '../../types';

interface AddTransactionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onNavigate: (view: string, params?: any) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isVisible, onClose, onNavigate }) => {
    const { addTransaction, savingsGoals, addFundsToGoal, investmentGoals, addInvestment } = useContext(FinancialContext);

    const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
    const [merchant, setMerchant] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [notes, setNotes] = useState('');
    const [microCopy, setMicroCopy] = useState('');
    
    // Goal-specific states
    const [selectedGoalId, setSelectedGoalId] = useState('');

    const orderedSavingsGoals = useMemo(() => {
        return [...savingsGoals].sort((a, b) => {
            if (a.isEmergency) return -1;
            if (b.isEmergency) return 1;
            return 0;
        });
    }, [savingsGoals]);

    useEffect(() => {
        if (orderedSavingsGoals.length > 0) {
            setSelectedGoalId(orderedSavingsGoals[0].id);
        }
    }, [orderedSavingsGoals]);
    
    useEffect(() => {
      if (isVisible) {
          // Reset form when modal becomes visible
          setActiveTab('expense');
          setMerchant('');
          setAmount('');
          setCategory('');
          setDate(new Date().toISOString().split('T')[0]);
          setIsRecurring(false);
          setNotes('');
          setMicroCopy('');
          if (orderedSavingsGoals.length > 0) setSelectedGoalId(orderedSavingsGoals[0].id);
          if (investmentGoals.length > 0) setSelectedGoalId(investmentGoals[0].id);
      }
    }, [isVisible, orderedSavingsGoals, investmentGoals]);

    const handleCategorySelect = (selectedCategory: string) => {
        setCategory(selectedCategory);
        switch (selectedCategory) {
            case 'Investment':
            case 'SIP':
                setMicroCopy("Investing is paying your future self first. Great choice.");
                break;
            case 'Savings':
                setMicroCopy("Smart savings today leads to freedom tomorrow.");
                break;
            case 'EMI / Loans':
                setMicroCopy("Organize debt — it makes your finances breathe easier.");
                break;
            default:
                setMicroCopy('');
        }
    };
    
    const handleSubmit = () => {
        if (!amount || parseFloat(amount) <= 0 || (activeTab === 'expense' && !category)) return;

        if (activeTab === 'expense') {
            if (category === 'Savings') {
                const goal = savingsGoals.find(g => g.id === selectedGoalId);
                if (goal) addFundsToGoal(goal.id, goal.name, parseFloat(amount), notes);
            } else if (category === 'Investment') {
                const goal = investmentGoals.find(g => g.id === selectedGoalId);
                addInvestment({
                    name: merchant || 'New Investment',
                    value: parseFloat(amount),
                    change: 0,
                    changeType: 'increase',
                    goalId: goal?.id,
                });
            } else {
                 addTransaction({
                    merchant: merchant || category,
                    amount: parseFloat(amount),
                    category: category,
                    date,
                    isRecurring,
                    notes,
                    transactionType: 'expense'
                });
            }
        } else { // Income
             addTransaction({
                merchant: merchant || category,
                amount: parseFloat(amount),
                category: category || 'Salary',
                date,
                isRecurring,
                notes,
                transactionType: 'income'
            });
        }
        
        onClose();
    };
    
    if(!isVisible) return null;

    const expenseCategories = ['Food', 'Shopping', 'Transport', 'Rent', 'Utilities', 'Groceries', 'Health', 'EMI / Loans', 'Investment', 'SIP', 'Savings', 'Education', 'Insurance', 'Travel', 'Entertainment', 'Gifts', 'Personal Care', 'Subscriptions', 'Other'];
    const incomeCategories = ['Salary', 'Business', 'Freelance', 'Investment Returns', 'Rental Income', 'Gifts', 'Other'];
    const categoriesToShow = activeTab === 'expense' ? expenseCategories : incomeCategories;

    const isComplexCategory = ['Savings', 'Investment'].includes(category);
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-[60]" onClick={onClose}>
            <div 
                className="w-full bg-gradient-to-t from-[#0F0F1F] to-[#1e1e1e] border-t-2 border-sky-500/50 rounded-t-3xl flex flex-col max-h-[90vh] animate-slide-up" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4 flex-shrink-0">
                    <div className="flex justify-center mb-4"><div className="w-16 h-1.5 bg-gray-700 rounded-full"></div></div>
                    <div className="flex bg-gray-900/50 p-1 rounded-full">
                        <button onClick={() => { setActiveTab('expense'); setCategory(''); }} className={`flex-1 py-2 rounded-full text-center font-semibold transition-all ${activeTab === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400'}`}>Expense</button>
                        <button onClick={() => { setActiveTab('income'); setCategory(''); }} className={`flex-1 py-2 rounded-full text-center font-semibold transition-all ${activeTab === 'income' ? 'bg-green-500 text-white shadow-md' : 'text-gray-400'}`}>Income</button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="₹ Amount" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-amber-400 transition-all animate-active-glow-gold" />
                        <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-sky-500 transition-all" />
                    </div>
                    <input value={merchant} onChange={e => setMerchant(e.target.value)} type="text" placeholder={activeTab === 'expense' ? "Name (e.g., Zomato)" : "Name (e.g., Acme Corp)"} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-sky-500 transition-all" />
                    
                    <div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar p-2 bg-black/20 rounded-lg">
                            {categoriesToShow.map(cat => (
                                <button key={cat} onClick={() => handleCategorySelect(cat)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${category === cat ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {microCopy && <p className="text-xs text-sky-300 mt-2 text-center animate-fade-in">{microCopy}</p>}
                    </div>

                    {activeTab === 'expense' && ['EMI / Loans'].includes(category) && (
                        <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-4 text-center animate-slide-up-fade-in space-y-2">
                            <p className="font-semibold text-purple-300">Smart Suggestion</p>
                            <p className="text-sm text-gray-300">To track this loan stress-free and get payoff insights, visit the Debt Module now.</p>
                            <button onClick={() => onNavigate('debt')} className="text-sm font-bold text-black bg-purple-400 px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors">Organize Debt Properly</button>
                        </div>
                    )}
                    
                    {activeTab === 'expense' && category === 'Insurance' && (
                        <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-xl p-4 text-center animate-slide-up-fade-in space-y-2">
                            <p className="font-semibold text-cyan-300">Smart Suggestion</p>
                            <p className="text-sm text-gray-300">Want to optimize your protection plan? Open the Insurance Module to compare cover strategies.</p>
                            <button onClick={() => onNavigate('insurance')} className="text-sm font-bold text-black bg-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-300 transition-colors">Go to Insurance Panel</button>
                        </div>
                    )}

                    {activeTab === 'expense' && isComplexCategory && (
                        <div className="space-y-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700 animate-slide-up-fade-in">
                            <h3 className="font-semibold text-center text-gray-200">Choose where to allocate this {category.toLowerCase()}.</h3>
                            {(category === 'Savings' && savingsGoals.length === 0) || (category === 'Investment' && investmentGoals.length === 0) ? (
                                <div className="text-center p-4 bg-black/30 rounded-lg">
                                    <p className="text-amber-400 font-semibold">You don’t have any {category.toLowerCase()} goals yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">To allocate properly, create your first goal now.</p>
                                    <button onClick={() => onNavigate(category === 'Savings' ? 'Save' : 'Invest')} className="mt-3 text-sm font-bold text-black bg-amber-400 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors">Create {category} Goal</button>
                                </div>
                            ) : (
                                <select value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-sky-500">
                                    {category === 'Savings' ? orderedSavingsGoals.map(g => <option key={g.id} value={g.id}>{g.isEmergency && '🛡️ '} {g.name}</option>)
                                    : investmentGoals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 flex-shrink-0">
                    <button 
                        onClick={handleSubmit} 
                        disabled={(isComplexCategory && ((category === 'Savings' && savingsGoals.length === 0) || (category === 'Investment' && investmentGoals.length === 0)))} 
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transform hover:scale-105 active:scale-100 transition-transform disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Save Transaction
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddTransactionModal;