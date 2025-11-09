





import React, { useState, useMemo, createContext, FC, ReactNode } from 'react';
import { Tab, Transaction, DetailedSavingsGoal, Investment, InsurancePolicy, Debt, SuperCategory, TransactionType, DebtPlan, FinancialContextType, InvestmentGoal } from './types';
import TopNav from './components/layout/TopNav';
import BottomNav from './components/layout/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/TrackScreen';
import SaveScreen from './screens/SaveScreen';
import InvestScreen from './screens/InvestScreen';
import ProfileScreen from './screens/ProfileScreen';

// Sub-screen imports for navigation
import ManageDebtScreen from './screens/ManageDebtScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import NetWorthScreen from './screens/NetWorthScreen';
import ToolsAndCalculatorsScreen from './screens/ToolsAndCalculatorsScreen';
import AIChatScreen from './screens/AIChatScreen';
import LearningCenterScreen from './screens/LearningCenterScreen';
import BookExpertScreen from './screens/BookExpertScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AIAnalysisScreen from './screens/AIAnalysisScreen';

// --- FINANCIAL CONTEXT ---

// FIX: Added explicit types to empty arrays in the default context value.
// This prevents TypeScript from inferring them as `never[]`, which caused type errors
// in components consuming this context (e.g., `HomeScreen`).
export const FinancialContext = createContext<FinancialContextType>({
    transactions: [] as Transaction[],
    addTransaction: (transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }) => '',
    removeTransaction: () => {},
    savingsGoals: [] as DetailedSavingsGoal[],
    addSavingsGoal: () => {},
    updateSavingsGoal: () => {},
    addFundsToGoal: () => {},
    investments: [] as Investment[],
    addInvestment: () => {},
    insurancePolicies: [] as InsurancePolicy[],
    addInsurancePolicy: () => {},
    updateInsurancePolicy: () => {},
    debts: [] as Debt[],
    addDebt: () => {},
    categorySplit: { essential: 50, investment: 30, wants: 20 },
    setCategorySplit: () => {},
    debtPlan: null,
    setDebtPlan: () => {},
    investmentGoals: [] as InvestmentGoal[],
    addInvestmentGoal: () => {},
    updateInvestmentGoal: () => {},
    deleteInvestmentGoal: () => {},
});

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<{ view: string; params?: any }>({ view: 'Home' });

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView({ view, params });
  };

  const activeTab = useMemo(() => {
    const topLevelTabs: Tab[] = ['Home', 'Expense', 'Save', 'Invest', 'Profile'];
    if (topLevelTabs.includes(currentView.view as Tab)) {
        return currentView.view as Tab;
    }
    const profileSubViews = ['debt', 'insurance', 'netWorth', 'tools', 'aiChat', 'learning', 'bookExpert', 'transactions', 'aiAnalysis'];
    if (profileSubViews.includes(currentView.view)) {
        return 'Profile';
    }
    return 'Home'; // Fallback
  }, [currentView.view]);

  const renderContent = () => {
    const handleBackToHome = () => handleNavigation('Home');
    const handleBackToProfile = () => handleNavigation('Profile');

    switch (currentView.view) {
      case 'Home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'Expense':
        return <ExpenseScreen onNavigate={handleNavigation} />;
      case 'Save':
        return <SaveScreen />;
      case 'Invest':
        return <InvestScreen />;
      case 'Profile':
        return <ProfileScreen onNavigate={handleNavigation} />;
      case 'tools':
        return <ToolsAndCalculatorsScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'aiAnalysis':
        return <AIAnalysisScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'bookExpert':
        return <BookExpertScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'aiChat':
        return <AIChatScreen onBack={activeTab === 'Home' ? handleBackToHome : handleBackToProfile} />;
      case 'debt':
        return <ManageDebtScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'insurance':
        return <InsuranceScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
      case 'netWorth':
        return <NetWorthScreen onBack={handleBackToProfile} />;
      case 'learning':
        return <LearningCenterScreen onBack={handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'transactions':
        return <TransactionsScreen onBack={handleBackToProfile} />;
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#0D1117] font-sans relative flex flex-col overflow-hidden">
        <TopNav setActiveTab={(tab) => handleNavigation(tab)} />
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {renderContent()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={(tab) => handleNavigation(tab)} />
    </div>
  );
};

// --- DUMMY DATA ---

// Helper function to generate ISO dates for the current year
const getDate = (day: number, monthOffset = 0, yearOffset = 0) => {
    const today = new Date();
    // Handles month wrapping correctly, e.g., month -1 becomes previous year's December
    return new Date(today.getFullYear() - yearOffset, today.getMonth() - monthOffset, day).toISOString();
};

// FIX: Explicitly cast `type` and `paymentMode` to their respective literal types to fix TypeScript inference errors.
const DUMMY_TRANSACTIONS: Transaction[] = [
    { id: 't1', merchant: 'Salary', category: 'Salary', superCategory: 'Income' as SuperCategory, amount: 95000, date: getDate(30, 1), type: 'income' as TransactionType, isRecurring: true, paymentMode: 'Net Banking' as 'Net Banking', tags: ['salary'] },
    { id: 't2', merchant: 'House Rent', category: 'Rent', superCategory: 'Essential' as SuperCategory, amount: 25000, date: getDate(1), type: 'expense' as TransactionType, isRecurring: true, paymentMode: 'UPI' as 'UPI', tags: ['rent', 'housing'] },
    { id: 't3', merchant: 'Zomato', category: 'Food', superCategory: 'Entertainment' as SuperCategory, amount: 650, date: getDate(3), type: 'expense' as TransactionType, isRecurring: false, paymentMode: 'Credit Card' as 'Credit Card', tags: ['food', 'dining'] },
    { id: 't4', merchant: 'BigBasket', category: 'Groceries', superCategory: 'Essential' as SuperCategory, amount: 4500, date: getDate(5), type: 'expense' as TransactionType, isRecurring: false, paymentMode: 'Credit Card' as 'Credit Card', tags: ['groceries', 'household'] },
    { id: 't5', merchant: 'SIP - Parag Parikh', category: 'Investment', superCategory: 'Investment' as SuperCategory, amount: 15000, date: getDate(7), type: 'investment' as TransactionType, isRecurring: true, paymentMode: 'Net Banking' as 'Net Banking', tags: ['sip', 'mutual-fund'] },
    { id: 't6', merchant: 'Fund Goal: Europe Trip', category: 'Goal Contribution', superCategory: 'Savings' as SuperCategory, amount: 10000, date: getDate(8), type: 'savings' as TransactionType, isRecurring: true, paymentMode: 'UPI' as 'UPI', tags: ['savings', 'travel-goal'] },
    { id: 't7', merchant: 'Myntra', category: 'Shopping', superCategory: 'Entertainment' as SuperCategory, amount: 3200, date: getDate(10), type: 'expense' as TransactionType, isRecurring: false, paymentMode: 'Credit Card' as 'Credit Card', tags: ['shopping', 'clothing'] },
    { id: 't12', merchant: 'HDFC Life Premium', category: 'Insurance Premium', superCategory: 'Essential' as SuperCategory, amount: 1200, date: getDate(15), type: 'expense' as TransactionType, isRecurring: true, paymentMode: 'Net Banking' as 'Net Banking', tags: ['insurance', 'life-insurance'] },
    { id: 't8', merchant: 'ICICI Credit Card Bill', category: 'EMI', superCategory: 'Essential' as SuperCategory, amount: 5000, date: getDate(20), type: 'expense' as TransactionType, isRecurring: true, paymentMode: 'Net Banking' as 'Net Banking', tags: ['emi', 'credit-card'] },
    { id: 't9', merchant: 'BookMyShow', category: 'Entertainment', superCategory: 'Entertainment' as SuperCategory, amount: 850, date: getDate(22), type: 'expense' as TransactionType, isRecurring: false, paymentMode: 'UPI' as 'UPI', tags: ['movies', 'entertainment'] },
    { id: 't10', merchant: 'Uber', category: 'Transport', superCategory: 'Essential' as SuperCategory, amount: 300, date: getDate(24), type: 'expense' as TransactionType, isRecurring: false, paymentMode: 'UPI' as 'UPI', tags: ['transport', 'commute'] },
    { id: 't11', merchant: 'Salary', category: 'Salary', superCategory: 'Income' as SuperCategory, amount: 95000, date: getDate(30), type: 'income' as TransactionType, isRecurring: true, paymentMode: 'Net Banking' as 'Net Banking', tags: ['salary'] },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


const DUMMY_SAVINGS_GOALS: DetailedSavingsGoal[] = [
    { id: 'sg1', name: 'Emergency Fund', target: 300000, saved: 120000, emoji: '🛡️', color: 'from-amber-400 to-orange-500', targetDate: '2025-12', isEmergency: true, growthRate: 6 },
    { id: 'sg2', name: 'Europe Trip', target: 250000, saved: 75000, emoji: '✈️', color: 'from-sky-400 to-blue-500', targetDate: '2025-06', isEmergency: false },
    { id: 'sg3', name: 'Macbook Pro', target: 210000, saved: 45000, emoji: '💻', color: 'from-purple-400 to-indigo-500', targetDate: '2024-12', isEmergency: false },
];

const DUMMY_INVESTMENT_GOALS: InvestmentGoal[] = [
    { id: 'ig1', name: 'Retirement Corpus', targetAmount: 20000000, currentAmount: 365000, targetDate: '2050-01-01', assetType: 'Mutual Fund', priority: 'High', status: 'active', createdAt: getDate(1, 0, 1) },
    { id: 'ig2', name: 'House Downpayment', targetAmount: 5000000, currentAmount: 50000, targetDate: '2029-01-01', assetType: 'Equity', priority: 'Medium', status: 'active', createdAt: getDate(1, 0, 0) },
];

const DUMMY_INVESTMENTS: Investment[] = [
    { id: 'inv1', name: 'Parag Parikh Flexi Cap', value: 250000, change: 1.2, changeType: 'increase', goalId: 'ig1', category: 'Mutual Funds' },
    { id: 'inv2', name: 'UTI Nifty 50 Index', value: 100000, change: 0.8, changeType: 'increase', goalId: 'ig1', category: 'ETFs' },
    { id: 'inv3', name: 'Tata Digital India Fund', value: 50000, change: -0.5, changeType: 'decrease', goalId: 'ig2', category: 'Mutual Funds' },
];

const DUMMY_INSURANCE_POLICIES: InsurancePolicy[] = [
    { id: 'ins1', type: 'Term Life', provider: 'HDFC Life Click 2 Protect', coverage: 15000000, coverageYears: 32, premium: 1200, premiumFrequency: 'Monthly', premiumDueDate: getDate(15), expiryDate: '2056-06-14', autopay: true, autopayTransactionId: 't12' },
    { id: 'ins2', type: 'Health', provider: 'Star Health Comprehensive', coverage: 2000000, coverageYears: 1, premium: 21600, premiumFrequency: 'Annually', premiumDueDate: '2025-03-20', expiryDate: '2025-03-19', autopay: false },
];

const DUMMY_DEBTS: Debt[] = [
    { id: 'd1', name: 'ICICI Credit Card', amount: 85000, apr: 24, minPayment: 5000, paymentDate: 20 },
    { id: 'd2', name: 'Personal Loan', amount: 250000, apr: 14, minPayment: 7500, paymentDate: 10 },
];

const App: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);
    const [savingsGoals, setSavingsGoals] = useState<DetailedSavingsGoal[]>(DUMMY_SAVINGS_GOALS);
    const [investments, setInvestments] = useState<Investment[]>(DUMMY_INVESTMENTS);
    const [investmentGoals, setInvestmentGoals] = useState<InvestmentGoal[]>(DUMMY_INVESTMENT_GOALS);
    const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(DUMMY_INSURANCE_POLICIES);
    const [debts, setDebts] = useState<Debt[]>(DUMMY_DEBTS);
    const [categorySplit, setCategorySplit] = useState({ essential: 50, investment: 30, wants: 20 });
    const [debtPlan, setDebtPlan] = useState<DebtPlan | null>(null);

    const categoryToSuperCategoryMap: Record<string, SuperCategory> = {
        'Groceries': 'Essential',
        'Bills': 'Essential',
        'EMI': 'Essential',
        'Loan Payment': 'Essential',
        'Rent': 'Essential',
        'Transport': 'Essential',
        'Health': 'Essential',
        'Utilities': 'Essential',
        'Education': 'Essential',
        'Household': 'Essential',
        'Investment': 'Investment',
        'Savings': 'Savings',
        'Insurance Premium': 'Essential',
        'Goal Contribution': 'Savings',
        'Food': 'Entertainment',
        'Shopping': 'Entertainment',
        'Entertainment': 'Entertainment',
        'Travel': 'Entertainment',
        'Gifts': 'Entertainment',
    };

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }): string => {
        let superCategory: SuperCategory;
        if (transaction.transactionType === 'income') {
            superCategory = 'Income';
        } else {
            superCategory = categoryToSuperCategoryMap[transaction.category] || 'Essential'; // Default unknown expenses to Essential
        }

        const typeMap: Record<SuperCategory, TransactionType> = {
            'Income': 'income',
            'Essential': 'expense',
            'Entertainment': 'expense',
            'Savings': 'savings',
            'Investment': 'investment'
        };
        
        const newTransactionId = Date.now().toString();
        const newTransaction: Transaction = {
            merchant: transaction.merchant,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            isRecurring: transaction.isRecurring,
            notes: transaction.notes,
            id: newTransactionId,
            superCategory,
            type: typeMap[superCategory],
            paymentMode: 'UPI', // Default
            tags: [transaction.category.toLowerCase()]
        };

        setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        return newTransactionId;
    };

    const removeTransaction = (transactionId: string) => {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    };
    
    const addSavingsGoal = (goal: Omit<DetailedSavingsGoal, 'id'>) => {
        setSavingsGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
    };
    
    const updateSavingsGoal = (goalId: string, updates: Partial<Omit<DetailedSavingsGoal, 'id'>>) => {
        setSavingsGoals(prev => 
            prev.map(goal => 
                goal.id === goalId ? { ...goal, ...updates } : goal
            )
        );
    };

    const addFundsToGoal = (goalId: string, goalName: string, amount: number, notes?: string) => {
        setSavingsGoals(prevGoals =>
            prevGoals.map(goal => {
                if (goal.id === goalId) {
                    const newSavedAmount = Math.min(goal.saved + amount, goal.target);
                    return { ...goal, saved: newSavedAmount };
                }
                return goal;
            })
        );
        addTransaction({
            merchant: `Fund Goal: ${goalName}`,
            amount,
            category: 'Goal Contribution',
            date: new Date().toISOString(),
            isRecurring: false,
            notes,
            transactionType: 'expense'
        });
    };
    
    const updateInvestmentGoal = (goalId: string, updates: Partial<Omit<InvestmentGoal, 'id'>>) => {
        setInvestmentGoals(prev => 
            prev.map(goal => 
                goal.id === goalId ? { ...goal, ...updates } : goal
            )
        );
    };
    
    const addInvestment = (investment: Omit<Investment, 'id'>) => {
        const newInvestmentWithId = { ...investment, id: Date.now().toString() };
        
        const updatedInvestments = [...investments, newInvestmentWithId];
        setInvestments(updatedInvestments);

        // Also create a corresponding transaction for the cash outflow
        addTransaction({
            merchant: investment.name,
            amount: investment.value,
            category: 'Investment',
            date: new Date().toISOString(),
            isRecurring: false,
            transactionType: 'expense',
        });


        if (investment.goalId) {
            const newCurrentAmountForGoal = updatedInvestments
                .filter(inv => inv.goalId === investment.goalId)
                .reduce((sum, inv) => sum + inv.value, 0);
            
            updateInvestmentGoal(investment.goalId, { currentAmount: newCurrentAmountForGoal });
        }
    };
    
    const addInvestmentGoal = (goal: Omit<InvestmentGoal, 'id' | 'currentAmount' | 'status' | 'createdAt'>) => {
        const newGoal: InvestmentGoal = {
            ...goal,
            id: Date.now().toString(),
            currentAmount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
        };
        setInvestmentGoals(prev => [...prev, newGoal]);
    };

    const deleteInvestmentGoal = (goalId: string) => {
        setInvestmentGoals(prev => prev.filter(g => g.id !== goalId));
    };

    const addInsurancePolicy = (policy: Omit<InsurancePolicy, 'id'>) => {
        setInsurancePolicies(prev => [...prev, { ...policy, id: Date.now().toString(), autopay: false }]);
    };
    const updateInsurancePolicy = (policyId: string, updates: Partial<InsurancePolicy>) => {
        const policyToUpdate = insurancePolicies.find(p => p.id === policyId);
        if (!policyToUpdate) return;
        
        const finalUpdates = {...updates};

        // If autopay is being enabled
        if (updates.autopay === true && !policyToUpdate.autopay) {
            const transactionId = addTransaction({
                merchant: `${policyToUpdate.provider} Premium`,
                amount: policyToUpdate.premium,
                category: 'Insurance Premium',
                date: policyToUpdate.premiumDueDate,
                isRecurring: true,
                transactionType: 'expense',
            });
            finalUpdates.autopayTransactionId = transactionId;
        } 
        // If autopay is being disabled
        else if (updates.autopay === false && policyToUpdate.autopay && policyToUpdate.autopayTransactionId) {
            removeTransaction(policyToUpdate.autopayTransactionId);
            finalUpdates.autopayTransactionId = undefined;
        }

        setInsurancePolicies(prev => 
            prev.map(p => p.id === policyId ? { ...p, ...finalUpdates } : p)
        );
    };
    const addDebt = (debt: Omit<Debt, 'id'>) => {
        setDebts(prev => [...prev, { ...debt, id: Date.now().toString() }]);
    };

    const value: FinancialContextType = {
        transactions, addTransaction, removeTransaction,
        savingsGoals, addSavingsGoal, updateSavingsGoal, addFundsToGoal,
        investments, addInvestment,
        insurancePolicies, addInsurancePolicy, updateInsurancePolicy,
        debts, addDebt,
        categorySplit, setCategorySplit,
        debtPlan, setDebtPlan,
        investmentGoals, addInvestmentGoal, updateInvestmentGoal, deleteInvestmentGoal,
    };

    return (
        <FinancialContext.Provider value={value}>
            <AppContent />
        </FinancialContext.Provider>
    );
};

export default App;