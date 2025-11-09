// FIX: Removed stray character 'D' from import statement.
import React, { useState, useMemo, createContext, FC, ReactNode, useEffect, useRef, useContext } from 'react';
// FIX: Import InvestmentOnboardingData to fix typing errors.
import { Tab, Transaction, DetailedSavingsGoal, Investment, InsurancePolicy, Debt, SuperCategory, TransactionType, DebtPlan, FinancialContextType, InvestmentGoal, OnboardingData, InvestmentCategory, Notification, AppSettings, User, LinkedAccount, LoginActivity, Asset, Liability, InvestmentOnboardingData, Strategy, RoadmapItem, DebtPaymentDetail } from './types';
import TopNav from './components/layout/TopNav';
import BottomNav from './components/layout/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ExpenseScreen from './screens/TrackScreen';
import SaveScreen from './screens/SaveScreen';
import InvestScreen from './screens/InvestScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';

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
import NotificationScreen from './screens/NotificationScreen';
import SettingsScreen from './screens/SettingsScreen';
import PlaceholderScreen from './screens/settings/PlaceholderScreen';
import EditProfileScreen from './screens/settings/EditProfileScreen';
import LinkedAccountsScreen from './screens/settings/LinkedAccountsScreen';
import SecurityScreen from './screens/settings/SecurityScreen';


// --- FINANCIAL CONTEXT ---
// New initial settings state
const initialAppSettings: AppSettings = {
    notifications: {
        pushEnabled: true,
        aiAlerts: true,
        reminders: true,
        insights: true,
        learningUpdates: true,
        reminderFrequency: 'Weekly',
        alertTone: 'Default'
    },
    appearance: {
        theme: 'Dark',
        animationIntensity: 75,
        fontSize: 'Medium',
        accentColor: '#38bdf8' // sky-400
    },
    privacy: {
        appLock: 'None',
        analyticsConsent: true,
        is2FAEnabled: false,
        recoveryEmail: 'a.sharma.recovery@example.com',
    },
    system: {
        language: 'English'
    },
    labs: {
        betaFeatures: false,
        experimentalAITools: false,
    }
};

const initialUser: User = {
    name: 'Victoria Heard',
    email: 'heard_j@gmail.com',
    phone: '9898712132',
    profilePictureUrl: `https://images.unsplash.com/photo-1521146764736-56c929d59c83?q=80&w=800&auto=format&fit=crop`,
    website: 'www.randomweb.com',
    location: 'Antigua'
};

export const FinancialContext = createContext<FinancialContextType>({
    transactions: [] as Transaction[],
    addTransaction: () => '',
    removeTransaction: () => {},
    savingsGoals: [] as DetailedSavingsGoal[],
    addSavingsGoal: () => {},
    updateSavingsGoal: () => {},
    addFundsToGoal: () => {},
    investments: [] as Investment[],
    addInvestment: () => {},
    updateInvestment: () => {},
    deleteInvestment: () => {},
    insurancePolicies: [] as InsurancePolicy[],
    addInsurancePolicy: () => {},
    updateInsurancePolicy: () => {},
    deleteInsurancePolicy: () => {},
    debts: [] as Debt[],
    addDebt: () => {},
    deleteAllData: () => {},
    categorySplit: { essential: 50, investment: 30, wants: 20 },
    setCategorySplit: () => {},
    debtPlan: null,
    setDebtPlan: () => {},
    investmentGoals: [] as InvestmentGoal[],
    addInvestmentGoal: () => {},
    updateInvestmentGoal: () => {},
    deleteInvestmentGoal: () => {},
    isInvestingOnboarded: false,
    investmentOnboardingData: { hasInvestedBefore: null, assets: [], riskAppetite: null, investmentConfidence: 5, investmentFrequency: null },
    setInvestmentOnboardingData: () => {},
    completeInvestingOnboarding: () => {},
    notifications: [] as Notification[],
    addNotification: () => {},
    markNotificationAsRead: () => {},
    clearAllNotifications: () => {},
    deleteNotification: () => {},
    toggleNotificationReadStatus: () => {},
    appSettings: initialAppSettings,
    setAppSettings: () => {},
    resetAppSettings: () => {},
    user: initialUser,
    updateUser: () => {},
    linkedAccounts: [] as LinkedAccount[],
    removeLinkedAccount: () => {},
    loginActivity: [] as LoginActivity[],
    logout: () => {},
    assets: [] as Asset[],
    addAsset: () => {},
    deleteAsset: () => {},
    liabilities: [] as Liability[],
    addLiability: () => {},
    deleteLiability: () => {},
});

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<{ view: string; params?: any }>({ view: 'Home' });
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const { appSettings } = useContext(FinancialContext);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
        const currentScrollY = mainEl.scrollTop;
        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            if (isBottomNavVisible) setIsBottomNavVisible(false);
        } else {
            if (!isBottomNavVisible) setIsBottomNavVisible(true);
        }
        lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, [isBottomNavVisible]);
  
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    if (appSettings.appearance.theme === 'Light') {
        root.classList.add('light');
    } else { // Dark or Auto defaults to dark for now
        root.classList.remove('light');
    }
    
    // Font Size
    if (appSettings.appearance.fontSize === 'Small') {
        root.style.fontSize = '14px';
    } else if (appSettings.appearance.fontSize === 'Large') {
        root.style.fontSize = '18px';
    } else {
        root.style.fontSize = '16px'; // Medium
    }

  }, [appSettings.appearance.theme, appSettings.appearance.fontSize]);


  const handleNavigation = (view: string, params?: any) => {
    setCurrentView({ view, params });
  };

  const activeTab = useMemo(() => {
    const topLevelTabs: Tab[] = ['Home', 'Expense', 'Save', 'Invest'];
    if (topLevelTabs.includes(currentView.view as Tab)) {
        return currentView.view as Tab;
    }
    if(currentView.view === 'Profile') return 'Home'; // No profile tab now, so fallback to home visually
    const profileSubViews = ['debt', 'insurance', 'netWorth', 'tools', 'aiChat', 'learning', 'bookExpert', 'transactions', 'aiAnalysis', 'notifications', 'settings', 'editProfile', 'linkedAccounts', 'security', 'language', 'terms', 'support', 'feedback', 'community', 'faq'];
    if (profileSubViews.includes(currentView.view)) {
         return 'Home'; // No profile tab now
    }
    return 'Home'; // Fallback
  }, [currentView.view]);

  const renderContent = () => {
    const handleBackToHome = () => handleNavigation('Home');
    const handleBackToProfile = () => handleNavigation('Profile');
    const handleBackToSettings = () => handleNavigation('settings');

    switch (currentView.view) {
      case 'Home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'Expense':
        return <ExpenseScreen onNavigate={handleNavigation} />;
      case 'Save':
        return <SaveScreen onNavigate={handleNavigation} />;
      case 'Invest':
        return <InvestScreen onNavigate={handleNavigation} />;
      case 'Profile':
        return <ProfileScreen onNavigate={handleNavigation} />;
      case 'notifications':
        return <NotificationScreen onBack={() => handleNavigation(activeTab)} onNavigate={handleNavigation} />;
      case 'settings':
        return <SettingsScreen onBack={handleBackToProfile} onNavigate={handleNavigation} />;
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
        return <NetWorthScreen onBack={handleBackToHome} />;
      case 'learning':
        return <LearningCenterScreen onBack={handleBackToProfile} initialCategory={currentView.params?.category} />;
      case 'transactions':
        return <TransactionsScreen onBack={handleBackToProfile} />;
      // Functional settings screens
      case 'editProfile':
        return <EditProfileScreen onBack={handleBackToSettings} />;
      case 'linkedAccounts':
          return <LinkedAccountsScreen onBack={handleBackToSettings} />;
      case 'security':
          return <SecurityScreen onBack={handleBackToSettings} />;
      // Placeholder screens
      case 'language':
          return <PlaceholderScreen title="Language" onBack={handleBackToSettings} />;
      case 'terms':
          return <PlaceholderScreen title="Terms & Privacy" onBack={handleBackToProfile} />;
      case 'support':
          return <PlaceholderScreen title="Support" onBack={handleBackToProfile} />;
      case 'feedback':
          return <PlaceholderScreen title="Feedback & Suggestions" onBack={handleBackToProfile} />;
      case 'community':
          return <PlaceholderScreen title="Community" onBack={handleBackToProfile} />;
      case 'faq':
          return <PlaceholderScreen title="FAQs" onBack={handleBackToProfile} />;
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };
  
  const isProfileScreen = currentView.view === 'Profile';


  return (
    <div className="h-screen w-full bg-[#0D1117] font-sans relative flex flex-col overflow-hidden">
        {!isProfileScreen && <TopNav setActiveTab={handleNavigation} />}
        <main ref={mainRef} className={`flex-1 overflow-y-auto no-scrollbar ${!isProfileScreen ? 'pb-24' : ''}`}>
          {renderContent()}
        </main>
        {!isProfileScreen && <BottomNav activeTab={activeTab} setActiveTab={handleNavigation} isVisible={isBottomNavVisible} />}
    </div>
  );
};

// --- DUMMY DATA ---
const getDate = (day: number, monthOffset = 0, yearOffset = 0) => {
    const today = new Date();
    return new Date(today.getFullYear() - yearOffset, today.getMonth() - monthOffset, day).toISOString();
};

const DUMMY_TRANSACTIONS: Transaction[] = [];
const DUMMY_SAVINGS_GOALS: DetailedSavingsGoal[] = [];
const DUMMY_INVESTMENT_GOALS: InvestmentGoal[] = [];
const DUMMY_INVESTMENTS: Investment[] = [];
const DUMMY_INSURANCE_POLICIES: InsurancePolicy[] = [];
const DUMMY_DEBTS: Debt[] = [];

const DUMMY_ASSETS: Asset[] = [
    { id: 'a1', name: 'Savings Account', value: 350000, type: 'Cash' },
    { id: 'a2', name: '24K Digital Gold', value: 75000, type: 'Other' },
];

const DUMMY_LIABILITIES: Liability[] = [];


const DUMMY_NOTIFICATIONS: Notification[] = [
    { id: 'n-welcome', category: 'Welcome', icon: '🎉', title: 'Welcome to MYM!', message: 'We\'re excited to help you on your journey to financial freedom. Explore the app to get started.', timestamp: new Date().toISOString(), isRead: false, action: { label: 'Explore Features', view: 'Home' }},
    { id: 'n1', category: 'Insight', icon: '💡', title: 'Spending Spike', message: 'Your spending on "Food" was 25% higher this week compared to your average. Consider dining in more often to boost your savings rate.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isRead: false, action: { label: 'View Expenses', view: 'Expense' }},
    { id: 'n-ai', category: 'AI Mentions', icon: '🤖', title: 'AI Portfolio Nudge', message: 'Your portfolio risk is slightly high for your stated goals. I have a few suggestions to balance it. Would you like to review them?', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isRead: false, action: { label: 'Ask AI Mentor', view: 'aiChat' }},
    { id: 'n2', category: 'Reminder', icon: '🗓️', title: 'Premium Due', message: 'Your HDFC Life premium of ₹1,200 is due in 3 days. Ensure your account is funded to avoid policy lapse.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: false, action: { label: 'View Policy', view: 'insurance' }},
     { id: 'n-system', category: 'System', icon: '⚙️', title: 'App Update', message: 'We\'ve updated our privacy policy. Please take a moment to review the changes.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, action: { label: 'Read Policy', view: 'Profile' }},
    { id: 'n3', category: 'Achievement', icon: '🏆', title: 'Goal Reached!', message: 'You\'ve successfully saved for your Macbook Pro! Congratulations on your discipline and hard work!', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, action: { label: 'View Goals', view: 'Save' }},
     { id: 'n4', category: 'Insight', icon: '📊', title: 'Weekly Summary', message: 'Your weekly financial summary is ready. You spent ₹8,450 and saved ₹5,000. Tap to see the full breakdown.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, action: { label: 'View Analysis', view: 'aiAnalysis' }}
];

const DUMMY_LINKED_ACCOUNTS: LinkedAccount[] = [
    { id: 'acc1', name: 'HDFC Bank Savings', type: 'Bank', last4: '6789', logoUrl: `https://api.dicebear.com/8.x/icons/svg?seed=bank` },
    { id: 'acc2', name: 'Groww Demat', type: 'Investment', last4: '1234', logoUrl: `https://api.dicebear.com/8.x/icons/svg?seed=trending-up` },
    { id: 'acc3', name: 'Paytm Wallet', type: 'Wallet', last4: '5678', logoUrl: `https://api.dicebear.com/8.x/icons/svg?seed=wallet` },
];

const DUMMY_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: 'la1', device: 'iPhone 15 Pro (Current)', location: 'Mumbai, IN', timestamp: new Date().toISOString(), isCurrent: true },
    { id: 'la2', device: 'Chrome on macOS', location: 'Mumbai, IN', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isCurrent: false },
    { id: 'la3', device: 'iPad Air', location: 'Pune, IN', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isCurrent: false },
];


// Debt plan calculation logic moved from ManageDebtScreen for use in onboarding
const calculatePlan = (debts: Omit<Debt, 'id'>[], strategy: Strategy, extraMonthlyPayment: number): Omit<DebtPlan, 'automatedPlanTransactionId'|'checkedInMonths'> => {
    let currentDebts: (Omit<Debt, 'id'> & { id: number, amount: number })[] = JSON.parse(JSON.stringify(debts.filter(d => d.amount > 0).map((d, i) => ({...d, id: i}))));
    if (currentDebts.length === 0) {
        return { strategy, totalMonths: 0, totalInterest: 0, totalPaid: 0, monthlyPayment: 0, extraMonthlyPayment, debts: [], roadmap: [] };
    }

    const initialTotalDebt = currentDebts.reduce((sum, d) => sum + d.amount, 0);
    let month = 0;
    let totalInterestPaid = 0;
    const roadmap: RoadmapItem[] = [];

    while (currentDebts.some(d => d.amount > 0)) {
        month++;
        if (month > 600) break; // Safety break for 50 years

        let totalPaymentForMonth = extraMonthlyPayment;
        let totalInterestForMonth = 0;
        const paymentsThisMonth = new Map<number, {payment: number, interest: number}>();

        currentDebts.forEach(debt => {
            const interest = debt.amount * (debt.apr / 100 / 12);
            debt.amount += interest;
            totalInterestForMonth += interest;
            totalInterestPaid += interest;
            totalPaymentForMonth += debt.minPayment;
            paymentsThisMonth.set(debt.id, { payment: 0, interest: interest });
        });

        let paymentPool = totalPaymentForMonth;
        
        currentDebts.forEach(debt => {
            const payment = Math.min(debt.amount, debt.minPayment);
            debt.amount -= payment;
            paymentPool -= payment;
            paymentsThisMonth.get(debt.id)!.payment += payment;
        });
        
        if (paymentPool > 0) {
            let activeDebts = currentDebts.filter(d => d.amount > 0.01);
            if (activeDebts.length > 0) {
                if (strategy === 'snowball') {
                    activeDebts.sort((a, b) => a.amount - b.amount);
                } else { // Avalanche and AI default
                    activeDebts.sort((a, b) => b.apr - a.apr);
                }

                for (const debt of activeDebts) {
                    if (paymentPool <= 0) break;
                    const payment = Math.min(debt.amount, paymentPool);
                    debt.amount -= payment;
                    paymentPool -= payment;
                    paymentsThisMonth.get(debt.id)!.payment += payment;
                }
            }
        }
        
        const focusDebtList = currentDebts.filter(d => d.amount > 0).sort((a, b) => strategy === 'snowball' ? a.amount - b.amount : b.apr - a.apr);

        const paymentDetails: DebtPaymentDetail[] = debts.map((originalDebt, index) => {
            const paymentData = paymentsThisMonth.get(index);
            const currentDebtOnLoopEnd = currentDebts.find(d => d.id === index); 

            if (paymentData) {
                const principalPaid = paymentData.payment - paymentData.interest;
                return { debtName: originalDebt.name, payment: paymentData.payment, interestPaid: paymentData.interest, principalPaid: principalPaid > 0 ? principalPaid : 0, remainingBalance: currentDebtOnLoopEnd ? Math.max(0, currentDebtOnLoopEnd.amount) : 0 };
            } else {
                return { debtName: originalDebt.name, payment: 0, interestPaid: 0, principalPaid: 0, remainingBalance: 0 };
            }
        });

        const totalPrincipalPaidForMonth = totalPaymentForMonth - totalInterestForMonth;
        const totalRemainingBalanceAfterPayments = currentDebts.reduce((s, d) => s + d.amount, 0);

        roadmap.push({
            month: month,
            totalPayment: totalPaymentForMonth,
            totalInterestPaid: totalInterestForMonth,
            totalPrincipalPaid: totalPrincipalPaidForMonth > 0 ? totalPrincipalPaidForMonth : 0,
            totalRemainingBalance: totalRemainingBalanceAfterPayments > 0 ? totalRemainingBalanceAfterPayments : 0,
            focus: focusDebtList.length > 0 ? focusDebtList[0].name : "All Paid Off!",
            paymentDetails: paymentDetails,
        });
        
        currentDebts = currentDebts.filter(d => d.amount > 0.01);
    }

    const totalPaid = initialTotalDebt + totalInterestPaid;
    const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);
    return { strategy, totalMonths: month, totalInterest: totalInterestPaid, totalPaid, monthlyPayment: totalMinPayments + extraMonthlyPayment, extraMonthlyPayment, debts: debts.map((d) => ({...d})), roadmap };
};


// --- Main App Container with Context Provider ---
const AppContainer: FC<{ initialData: any | null, onboardedUser: User | null, onLogout: () => void }> = ({ initialData, onboardedUser, onLogout }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialData?.transactions || DUMMY_TRANSACTIONS);
    const [savingsGoals, setSavingsGoals] = useState<DetailedSavingsGoal[]>(initialData?.savingsGoals || DUMMY_SAVINGS_GOALS);
    const [investments, setInvestments] = useState<Investment[]>(initialData?.investments || DUMMY_INVESTMENTS);
    const [investmentGoals, setInvestmentGoals] = useState<InvestmentGoal[]>(initialData?.investmentGoals || DUMMY_INVESTMENT_GOALS);
    const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(initialData?.insurancePolicies || DUMMY_INSURANCE_POLICIES);
    const [debts, setDebts] = useState<Debt[]>(initialData?.debts || DUMMY_DEBTS);
    const [assets, setAssets] = useState<Asset[]>(initialData?.assets || DUMMY_ASSETS);
    const [liabilities, setLiabilities] = useState<Liability[]>(initialData?.liabilities || DUMMY_LIABILITIES);
    const [categorySplit, setCategorySplit] = useState({ essential: 50, investment: 30, wants: 20 });
    const [debtPlan, setDebtPlan] = useState<DebtPlan | null>(initialData?.debtPlan || null);

    const [notifications, setNotifications] = useState<Notification[]>(initialData?.notifications || DUMMY_NOTIFICATIONS);
    const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
    const resetAppSettings = () => setAppSettings(initialAppSettings);

    // User Profile, Accounts, Security state
    const [user, setUser] = useState<User>(onboardedUser || initialUser);
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(DUMMY_LINKED_ACCOUNTS);
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>(DUMMY_LOGIN_ACTIVITY);
    
    const updateUser = (updates: Partial<User>) => setUser(prev => ({...prev, ...updates}));
    const removeLinkedAccount = (id: string) => setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));

    const deleteAllData = () => {
        setTransactions([]);
        setSavingsGoals([]);
        setInvestments([]);
        setInvestmentGoals([]);
        setInsurancePolicies([]);
        setDebts([]);
        setAssets([]);
        setLiabilities([]);
        setDebtPlan(null);
        setNotifications(prev => prev.filter(n => n.category === 'Welcome' || n.category === 'System'));
    };

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const [isInvestingOnboarded, setIsInvestingOnboarded] = useState(() => !!localStorage.getItem('mym_investing_onboarded'));
    // FIX: Update state to use InvestmentOnboardingData type instead of any
    const [investmentOnboardingData, setInvestmentOnboardingData] = useState<InvestmentOnboardingData>({ hasInvestedBefore: null, assets: [], riskAppetite: null, investmentConfidence: 5, investmentFrequency: null });
    const completeInvestingOnboarding = (onboardingInvestments: Investment[]) => {
        setInvestments(prev => [...prev, ...onboardingInvestments]);
        localStorage.setItem('mym_investing_onboarded', 'true');
        setIsInvestingOnboarded(true);
    };
    
    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}`,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationAsRead = (id: string | 'all') => setNotifications(prev => prev.map(n => (id === 'all' || n.id === id ? { ...n, isRead: true } : n)));
    const clearAllNotifications = () => setNotifications([]);
    const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
    const toggleNotificationReadStatus = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));

    const categoryToSuperCategoryMap: Record<string, SuperCategory> = { 'Groceries': 'Essential', 'Bills': 'Essential', 'EMI': 'Essential', 'Loan Payment': 'Essential', 'Rent': 'Essential', 'Transport': 'Essential', 'Health': 'Essential', 'Utilities': 'Essential', 'Education': 'Essential', 'Insurance': 'Essential', 'Family': 'Essential', 'Personal Care': 'Essential', 'Investment': 'Investment', 'SIP': 'Investment', 'Savings': 'Savings', 'Goal Contribution': 'Savings', 'Food': 'Entertainment', 'Shopping': 'Entertainment', 'Entertainment': 'Entertainment', 'Travel': 'Entertainment', 'Gifts': 'Entertainment', 'Subscriptions': 'Entertainment', 'Other': 'Entertainment' };

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }): string => {
        let superCategory: SuperCategory = transaction.transactionType === 'income' ? 'Income' : categoryToSuperCategoryMap[transaction.category] || 'Essential';
        const typeMap: Record<SuperCategory, TransactionType> = { 'Income': 'income', 'Essential': 'expense', 'Entertainment': 'expense', 'Savings': 'savings', 'Investment': 'investment' };
        const newTransactionId = Date.now().toString();
        const newTransaction: Transaction = { ...transaction, id: newTransactionId, superCategory, type: typeMap[superCategory], paymentMode: 'UPI', tags: [transaction.category.toLowerCase()] };
        setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        return newTransactionId;
    };

    const removeTransaction = (transactionId: string) => { setTransactions(prev => prev.filter(t => t.id !== transactionId)); };
    const addSavingsGoal = (goal: Omit<DetailedSavingsGoal, 'id'>) => { setSavingsGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]); };
    const updateSavingsGoal = (goalId: string, updates: Partial<Omit<DetailedSavingsGoal, 'id'>>) => { setSavingsGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updates } : goal)); };

    const addFundsToGoal = (goalId: string, goalName: string, amount: number, notes?: string) => {
        setSavingsGoals(prevGoals => prevGoals.map(goal => goal.id === goalId ? { ...goal, saved: Math.min(goal.saved + amount, goal.target) } : goal));
        addTransaction({ merchant: `Fund Goal: ${goalName}`, amount, category: 'Goal Contribution', date: new Date().toISOString(), isRecurring: false, notes, transactionType: 'expense' });
    };
    
    const updateInvestmentGoal = (goalId: string, updates: Partial<Omit<InvestmentGoal, 'id'>>) => { setInvestmentGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updates } : goal)); };
    
    const addInvestment = (investment: Omit<Investment, 'id'>) => {
        const newInvestmentWithId = { ...investment, id: Date.now().toString() };
        const updatedInvestments = [...investments, newInvestmentWithId];
        setInvestments(updatedInvestments);
        addTransaction({ merchant: investment.name, amount: investment.value, category: 'Investment', date: new Date().toISOString(), isRecurring: false, transactionType: 'expense' });
        if (investment.goalId) {
            const newCurrentAmountForGoal = updatedInvestments.filter(inv => inv.goalId === investment.goalId).reduce((sum, inv) => sum + inv.value, 0);
            updateInvestmentGoal(investment.goalId, { currentAmount: newCurrentAmountForGoal });
        }
    };
    const updateInvestment = (investmentId: string, updates: Partial<Omit<Investment, 'id'>>) => { setInvestments(prev => prev.map(inv => inv.id === investmentId ? { ...inv, ...updates } : inv)); };
    const deleteInvestment = (investmentId: string) => setInvestments(prev => prev.filter(inv => inv.id !== investmentId));
    
    const addInvestmentGoal = (goal: Omit<InvestmentGoal, 'id' | 'currentAmount' | 'status' | 'createdAt'>) => {
        const newGoal: InvestmentGoal = { ...goal, id: Date.now().toString(), currentAmount: 0, status: 'active', createdAt: new Date().toISOString() };
        setInvestmentGoals(prev => [...prev, newGoal]);
    };
    const deleteInvestmentGoal = (goalId: string) => { setInvestmentGoals(prev => prev.filter(g => g.id !== goalId)); };
    
    const addInsurancePolicy = (policy: Omit<InsurancePolicy, 'id'>) => {
        const newPolicy = { ...policy, id: Date.now().toString(), autopay: false };
        setInsurancePolicies(prev => [...prev, newPolicy]);
    
        if (policy.premium > 0 && policy.premiumFrequency && policy.premiumDueDate) {
            addTransaction({
                merchant: `${policy.provider} Premium`,
                amount: policy.premium,
                category: 'Insurance',
                date: policy.premiumDueDate,
                isRecurring: true,
                transactionType: 'expense',
            });
            addNotification({
                category: 'Reminder',
                icon: '🧾',
                title: 'Recurring Transaction Set',
                message: `A recurring payment for your ${policy.provider} premium of ₹${policy.premium.toLocaleString()} (${policy.premiumFrequency}) has been scheduled.`,
                action: { label: 'View Policy', view: 'insurance' }
            });
        }
    };
    const updateInsurancePolicy = (policyId: string, updates: Partial<InsurancePolicy>) => {
        const policyToUpdate = insurancePolicies.find(p => p.id === policyId);
        if (!policyToUpdate) return;
        const finalUpdates = {...updates};
        if (updates.autopay === true && !policyToUpdate.autopay) {
            const transactionId = addTransaction({ merchant: `${policyToUpdate.provider} Premium`, amount: policyToUpdate.premium, category: 'Insurance Premium', date: policyToUpdate.premiumDueDate, isRecurring: true, transactionType: 'expense' });
            finalUpdates.autopayTransactionId = transactionId;
        } else if (updates.autopay === false && policyToUpdate.autopay && policyToUpdate.autopayTransactionId) {
            removeTransaction(policyToUpdate.autopayTransactionId);
            finalUpdates.autopayTransactionId = undefined;
        }
        setInsurancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, ...finalUpdates } : p));
    };
    const deleteInsurancePolicy = (policyId: string) => setInsurancePolicies(prev => prev.filter(p => p.id !== policyId));
    const addDebt = (debt: Omit<Debt, 'id'>) => { setDebts(prev => [...prev, { ...debt, id: Date.now().toString() }]); };

    const addAsset = (asset: Omit<Asset, 'id'>) => { setAssets(prev => [...prev, { ...asset, id: Date.now().toString() }]); };
    const deleteAsset = (assetId: string) => setAssets(prev => prev.filter(a => a.id !== assetId));
    const addLiability = (liability: Omit<Liability, 'id'>) => { setLiabilities(prev => [...prev, { ...liability, id: Date.now().toString() }]); };
    const deleteLiability = (liabilityId: string) => setLiabilities(prev => prev.filter(l => l.id !== liabilityId));

    const value: FinancialContextType = {
        transactions, addTransaction, removeTransaction,
        savingsGoals, addSavingsGoal, updateSavingsGoal, addFundsToGoal,
        investments, addInvestment, updateInvestment, deleteInvestment,
        insurancePolicies, addInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy,
        debts, addDebt,
        deleteAllData,
        categorySplit, setCategorySplit,
        debtPlan, setDebtPlan,
        investmentGoals, addInvestmentGoal, updateInvestmentGoal, deleteInvestmentGoal,
        isInvestingOnboarded,
        investmentOnboardingData,
        setInvestmentOnboardingData,
        completeInvestingOnboarding,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        deleteNotification,
        toggleNotificationReadStatus,
        appSettings,
        setAppSettings,
        resetAppSettings,
        user,
        updateUser,
        linkedAccounts,
        removeLinkedAccount,
        loginActivity,
        logout,
        assets, addAsset, deleteAsset,
        liabilities, addLiability, deleteLiability,
    };

    return (
        <FinancialContext.Provider value={value}>
            <AppContent />
        </FinancialContext.Provider>
    );
};

// --- Top-level App Component ---
const App: FC = () => {
    const [isLocalStorageEnabled, setIsLocalStorageEnabled] = useState(true);

    useEffect(() => {
        try {
            localStorage.setItem('__test', 'test');
            localStorage.removeItem('__test');
            setIsLocalStorageEnabled(true);
        } catch (e) {
            setIsLocalStorageEnabled(false);
        }
    }, []);

    const [isOnboarded, setIsOnboarded] = useState(() => {
        try {
            return !!localStorage.getItem('mym_onboarded');
        } catch (e) {
            return false;
        }
    });
    const [initialData, setInitialData] = useState<any | null>(null);
    const [onboardedUser, setOnboardedUser] = useState<User | null>(null);

    const handleOnboardingComplete = (data: OnboardingData) => {
        setOnboardedUser({
            name: data.name,
            email: `${data.name.split(' ')[0].toLowerCase()}@mym.app`, // Placeholder
            phone: '9876543210', // Placeholder
            profilePictureUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${data.name}`,
        });

        const processedData: {
            transactions: Transaction[];
            savingsGoals: DetailedSavingsGoal[];
            investments: Investment[];
            debts: Debt[];
            insurancePolicies: InsurancePolicy[];
            assets: Asset[];
            liabilities: Liability[];
            notifications: Notification[];
            debtPlan: DebtPlan | null;
        } = {
            transactions: [],
            savingsGoals: [],
            investments: [],
            debts: [],
            insurancePolicies: [],
            assets: [],
            liabilities: [],
            notifications: [DUMMY_NOTIFICATIONS.find(n => n.category === 'Welcome')!],
            debtPlan: null,
        };

        // Process Emergency Fund
        const emergencyTarget = data.monthlyExpense > 0 ? data.monthlyExpense * 6 : 150000;
        processedData.savingsGoals.push({
            id: 'onboarding-ef', name: 'Emergency Fund', target: emergencyTarget,
            saved: data.emergencyFundAmount,
            emoji: '🛡️', color: 'from-amber-400 to-orange-500',
            targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 7),
            isEmergency: true, growthRate: data.emergencyFundGrowthRate,
        });
        if (data.emergencyFundAmount > 0) {
            processedData.assets.push({ id: 'onboarding-asset-ef', name: 'Emergency Fund Savings', value: data.emergencyFundAmount, type: 'Cash' });
        }

        // Process Investments
        if (data.invests === 'Yes' && data.totalInvestmentAmount > 0) {
            processedData.investments.push({
                id: 'onboarding-inv-total', name: 'Existing Portfolio', value: data.totalInvestmentAmount,
                change: 0, changeType: 'increase', category: data.investmentAssets[0] || 'Stocks',
                riskProfile: data.riskLevel || undefined,
            });
            processedData.assets.push({ id: 'onboarding-asset-inv', name: 'Investment Portfolio', value: data.totalInvestmentAmount, type: 'Investments' });
        }
        
        // Process Debts
        if (data.hasDebts === 'Yes' && data.debts.length > 0) {
            const planDebts: Omit<Debt, 'id'>[] = [];
            data.debts.forEach((d, i) => {
                const newDebt = {
                    id: `onboarding-debt-${i}`, name: d.type, amount: d.outstandingAmount,
                    apr: d.interestRate, minPayment: d.emi, paymentDate: 15
                };
                processedData.debts.push(newDebt);
                processedData.liabilities.push({ id: `onboarding-lia-${i}`, name: d.type, value: d.outstandingAmount, type: 'Loan' });
                planDebts.push({ name: newDebt.name, amount: newDebt.amount, apr: newDebt.apr, minPayment: newDebt.minPayment, paymentDate: newDebt.paymentDate });
            });
             const newDebtPlan = calculatePlan(planDebts, 'avalanche', 0);
             processedData.debtPlan = { ...newDebtPlan, checkedInMonths: [] };
        }

        // Process Insurance
        const insuranceTypeMap: Record<string, 'Term Life' | 'Health' | 'Other'> = {
            'Term': 'Term Life', 'Life': 'Term Life', 'Health': 'Health',
            'Critical Illness': 'Health', 'Other': 'Other'
        };
        if (data.hasInsurance === 'Yes') {
            data.insurancePolicies.forEach((p, i) => {
                processedData.insurancePolicies.push({
                    id: `onboarding-ins-${i}`, type: insuranceTypeMap[p.type] || 'Other', provider: 'Existing Policy',
                    coverage: p.coverage, premium: p.premium, premiumFrequency: 'Annually',
                    premiumDueDate: p.renewalDate, expiryDate: p.renewalDate
                });
            });
        }
        
        // Add income/expense transactions
        processedData.transactions.push({
            id: 'onboarding-income', merchant: 'Monthly Income', category: 'Salary', superCategory: 'Income',
            amount: data.monthlyIncome, date: new Date().toISOString(), type: 'income', isRecurring: true, paymentMode: 'Net Banking', tags: ['income']
        });
         processedData.transactions.push({
            id: 'onboarding-expense', merchant: 'Avg. Monthly Expense', category: 'Utilities', superCategory: 'Essential',
            amount: data.monthlyExpense, date: new Date().toISOString(), type: 'expense', isRecurring: true, paymentMode: 'UPI', tags: ['expense']
        });


        setInitialData(processedData);
        if (isLocalStorageEnabled) {
            localStorage.setItem('mym_onboarded', 'true');
        }
        setIsOnboarded(true);
    };

    const handleSkipOnboarding = () => {
        if (isLocalStorageEnabled) {
            localStorage.setItem('mym_onboarded', 'true');
        }
        setIsOnboarded(true);
    };

    if (!isLocalStorageEnabled) {
        return (
            <div className="h-screen w-full bg-[#0D1117] flex items-center justify-center text-center p-8">
                <div className="premium-glass p-8">
                    <h1 className="text-2xl font-bold text-red-400">Local Storage Disabled</h1>
                    <p className="text-gray-300 mt-2">
                        This application requires local storage to be enabled in your browser to save your progress and preferences.
                    </p>
                    <p className="text-gray-400 mt-4 text-sm">Please enable local storage in your browser settings and refresh the page.</p>
                </div>
            </div>
        );
    }

    if (!isOnboarded) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />;
    }

    return <AppContainer initialData={initialData} onboardedUser={onboardedUser} onLogout={() => setIsOnboarded(false)} />;
};

export default App;