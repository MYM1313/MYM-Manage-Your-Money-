import React from 'react';

export type Tab = 'Home' | 'Expense' | 'Save' | 'Invest' | 'Profile';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'typing';
  content: React.ReactNode;
}

export interface SavingsGoal {
    id: string;
    name: string;
    target: number;
    saved: number;
    emoji: string;
    color: string;
}

export interface DetailedSavingsGoal extends SavingsGoal {
    targetDate: string;
    asset?: 'Bank' | 'Gold' | 'Liquid Fund' | 'Stocks' | 'FD';
    growthRate?: number;
    isEmergency?: boolean;
}

export type TransactionType = 'income' | 'expense' | 'savings' | 'investment';
export type SuperCategory = 'Essential' | 'Entertainment' | 'Investment' | 'Savings' | 'Income';

export interface Transaction {
    id: string;
    merchant: string; // "Transaction Name"
    category: string; // "Custom Tag" like 'Food', 'Shopping'
    superCategory: SuperCategory;
    amount: number;
    date: string; // ISO 8601 format
    type: TransactionType; // Derived from superCategory
    isRecurring: boolean;
    paymentMode: 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash' | 'Net Banking';
    tags: string[];
    notes?: string;
}

export type InvestmentGoalStatus = 'active' | 'paused' | 'completed';
export type InvestmentGoalPriority = 'Low' | 'Medium' | 'High';
export type InvestmentGoalAssetType = 'Stocks' | 'Mutual Fund' | 'ETF' | 'Index Fund' | 'Equity' | 'Bonds' | 'Crypto' | 'Custom Asset';

export interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  assetType: InvestmentGoalAssetType;
  priority: InvestmentGoalPriority;
  status: InvestmentGoalStatus;
  createdAt: string; // ISO 8601 format
}

export type InvestmentCategory = 'Stocks' | 'ETFs' | 'Bonds' | 'Gold' | 'Crypto' | 'Global' | 'Mutual Funds' | 'Other';
export type InvestmentRiskProfile = 'Low' | 'Medium' | 'High';

export interface Investment {
    id: string;
    name: string;
    value: number;
    change: number;
    changeType: 'increase' | 'decrease';
    goalId?: string; // Link to an InvestmentGoal
    category: InvestmentCategory;
    riskProfile?: InvestmentRiskProfile;
    tags?: string[];
    reason?: string; // For portfolio journal
    confidence?: 'Low' | 'Medium' | 'High'; // For portfolio journal
    notes?: string;
    startDate?: string;
}

// --- NEW ONBOARDING TYPES ---
export type SavingGoalType = 'Emergency' | 'Retirement' | 'Education' | 'Wealth Growth';
export type DebtType = 'Credit Card' | 'Personal Loan' | 'Home Loan' | 'Car Loan' | 'Education Loan' | 'Other';
export type AITopic = 'Investing' | 'Saving' | 'Budgeting' | 'Debt' | 'Insurance' | 'Other';
export type AppFeature = 'Expense Tracker' | 'Savings' | 'Investments' | 'Debt Manager' | 'Insurance' | 'AI Chat';
export type InsuranceType = 'Term' | 'Life' | 'Health' | 'Critical Illness' | 'Other';


export interface OnboardingData {
    name: string;
    age: number;
    monthlyIncome: number;
    monthlyExpense: number;
    hasEmergencyFund: 'Yes' | 'No' | null;
    emergencyFundAmount: number;
    emergencyFundGrowthRate: number;
    invests: 'Yes' | 'No' | null;
    investmentAssets: InvestmentCategory[];
    monthlyInvestment: number;
    investmentPlatform: 'Groww' | 'Zerodha' | 'Other' | null;
    riskLevel: 'Low' | 'Medium' | 'High' | null;
    totalInvestmentAmount: number;
    savesRegularly: 'Yes' | 'No' | null;
    monthlySavings: number;
    savingGoals: SavingGoalType[];
    expectedReturn: number | 'DontKnow' | null;
    hasDebts: 'Yes' | 'No' | null;
    debts: {
        type: DebtType;
        outstandingAmount: number;
        interestRate: number;
        emi: number;
        tenure: number; // in months
    }[];
    hasInsurance: 'Yes' | 'No' | null;
    insurancePolicies: {
        type: InsuranceType;
        coverage: number;
        premium: number;
        renewalDate: string;
    }[];
}


// FIX: Add missing onboarding types
export interface InvestmentOnboardingAsset {
    type: InvestmentCategory;
    amount: number;
    reason: string;
    confidence: number;
}

export interface InvestmentOnboardingData {
    hasInvestedBefore: boolean | null;
    assets: InvestmentOnboardingAsset[];
    riskAppetite: InvestmentRiskProfile | null;
    investmentConfidence: number | null;
    investmentFrequency: 'One-time' | 'Monthly' | 'Periodic' | null;
}

export interface InsurancePolicyOnboarding {
    type: 'Health' | 'Life' | 'Term' | 'Other';
    provider: string;
    premium: number;
    coverage: number;
    renewalDate: string;
    dependentsCovered: number;
}

export interface InsuranceOnboardingData {
    hasExistingInsurance: boolean | null;
    existingPolicies: InsurancePolicyOnboarding[];
    fullName: string;
    age: number | null;
    maritalStatus: 'Single' | 'Married' | null;
    employmentType: 'Salaried' | 'Self-Employed' | 'Other' | null;
    lifestyleSmoker: 'Non-Smoker' | 'Smoker' | null;
    income: number | null;
    monthlyExpenses: number | null;
    insuranceBudget: 'Low' | 'Medium' | 'High' | null;
    riskAppetite: 'Low' | 'Medium' | 'High' | null;
    hasMajorHealthConditions: boolean | null;
    majorHealthConditions?: string;
    preferredCoverageType: 'Basic' | 'Comprehensive' | null;
    willingnessForCheckup: boolean | null;
    mainGoal: 'Protection' | 'Investment-linked' | 'Both' | null;
    desiredCoverage: number | null;
    priorityOfProtection: 'Life' | 'Health' | 'Term' | null;
    claimedInsurance: boolean | null;
    claimedInsuranceDetails?: string;
    preferredPolicyDuration: '1-5 yrs' | '5-10 yrs' | '10+ yrs' | null;
    tipsFrequency: 'Daily' | 'Weekly' | 'Monthly' | null;
    guidanceStyle: 'Text' | 'Charts' | 'Both' | null;
    preferredRecommendationSource: 'Ditto' | 'AI only' | 'Both' | null;
    willingnessToAdjust: boolean | null;
}


// --- NOTIFICATION SYSTEM TYPES ---
export type NotificationCategory = 'Welcome' | 'Insight' | 'Reminder' | 'AI Mentions' | 'System' | 'Achievement';

export interface Notification {
  id: string;
  category: NotificationCategory;
  icon: string; // Emoji
  title: string;
  message: string;
  timestamp: string; // ISO String
  isRead: boolean;
  action?: {
    label: string;
    view: string;
    params?: any;
  };
}

// --- NEW APP SETTINGS & USER TYPES ---
export interface User {
    name: string;
    email: string;
    phone: string;
    profilePictureUrl?: string;
    website?: string;
    location?: string;
}

export type LinkedAccountType = 'Bank' | 'Wallet' | 'Investment';
export interface LinkedAccount {
    id: string;
    name: string;
    type: LinkedAccountType;
    last4: string;
    logoUrl: string; // URL to logo
}

export interface LoginActivity {
    id: string;
    device: string;
    location: string;
    timestamp: string;
    isCurrent: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  aiAlerts: boolean;
  reminders: boolean;
  insights: boolean;
  learningUpdates: boolean;
  reminderFrequency: 'Daily' | 'Weekly' | 'Monthly';
  alertTone: string;
}

export interface AppearanceSettings {
  theme: 'Light' | 'Dark' | 'Auto';
  animationIntensity: number; // 0-100
  fontSize: 'Small' | 'Medium' | 'Large';
  accentColor: string; // hex code
}

export interface PrivacySettings {
  appLock: 'None' | 'PIN' | 'Biometric';
  analyticsConsent: boolean;
  is2FAEnabled: boolean;
  recoveryEmail: string;
}

export interface SystemSettings {
    language: string;
}

export interface LabsSettings {
    betaFeatures: boolean;
    experimentalAITools: boolean;
}

export interface AppSettings {
    notifications: NotificationSettings;
    appearance: AppearanceSettings;
    privacy: PrivacySettings;
    system: SystemSettings;
    labs: LabsSettings;
}

export interface FinancialContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'type' | 'paymentMode' | 'tags' | 'superCategory'> & { transactionType: 'income' | 'expense'; notes?: string; }) => string;
    removeTransaction: (transactionId: string) => void;
    savingsGoals: DetailedSavingsGoal[];
    addSavingsGoal: (goal: Omit<DetailedSavingsGoal, 'id'>) => void;
    updateSavingsGoal: (goalId: string, updates: Partial<Omit<DetailedSavingsGoal, 'id'>>) => void;
    addFundsToGoal: (goalId: string, goalName: string, amount: number, notes?: string) => void;
    investments: Investment[];
    addInvestment: (investment: Omit<Investment, 'id'>) => void;
    updateInvestment: (investmentId: string, updates: Partial<Omit<Investment, 'id'>>) => void;
    deleteInvestment: (investmentId: string) => void;
    insurancePolicies: InsurancePolicy[];
    addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id'>) => void;
    updateInsurancePolicy: (policyId: string, updates: Partial<InsurancePolicy>) => void;
    deleteInsurancePolicy: (policyId: string) => void;
    debts: Debt[];
    addDebt: (debt: Omit<Debt, 'id'>) => void;
    deleteAllData: () => void;
    categorySplit: { essential: number; investment: number; wants: number; };
    setCategorySplit: React.Dispatch<React.SetStateAction<{ essential: number; investment: number; wants: number; }>>;
    debtPlan: DebtPlan | null;
    setDebtPlan: React.Dispatch<React.SetStateAction<DebtPlan | null>>;
    investmentGoals: InvestmentGoal[];
    addInvestmentGoal: (goal: Omit<InvestmentGoal, 'id' | 'currentAmount' | 'status' | 'createdAt'>) => void;
    updateInvestmentGoal: (goalId: string, updates: Partial<Omit<InvestmentGoal, 'id'>>) => void;
    deleteInvestmentGoal: (goalId: string) => void;
    isInvestingOnboarded: boolean;
    // FIX: Replace 'any' with the specific InvestmentOnboardingData type.
    investmentOnboardingData: InvestmentOnboardingData;
    setInvestmentOnboardingData: React.Dispatch<React.SetStateAction<InvestmentOnboardingData>>;
    completeInvestingOnboarding: (investments: Investment[]) => void;
    // Notification System
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationAsRead: (id: string | 'all') => void;
    clearAllNotifications: () => void;
    deleteNotification: (id: string) => void;
    toggleNotificationReadStatus: (id: string) => void;
    // App Settings
    appSettings: AppSettings;
    setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    resetAppSettings: () => void;
    // User Profile & Accounts
    user: User;
    updateUser: (updates: Partial<User>) => void;
    linkedAccounts: LinkedAccount[];
    removeLinkedAccount: (id: string) => void;
    loginActivity: LoginActivity[];
    logout: () => void;
    // Net Worth
    assets: Asset[];
    addAsset: (asset: Omit<Asset, 'id'>) => void;
    deleteAsset: (assetId: string) => void;
    liabilities: Liability[];
    addLiability: (liability: Omit<Liability, 'id'>) => void;
    deleteLiability: (liabilityId: string) => void;
}


export interface InsurancePolicy {
  id: string;
  type: 'Term Life' | 'Health' | 'Car' | 'Other';
  provider: string; // Name of policy/provider
  coverage: number; // Sum assured
  coverageYears?: number; // Term of the policy in years
  premium: number; // Premium amount
  premiumFrequency: 'Monthly' | 'Annually';
  premiumDueDate: string; // Next premium due date YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  autopay?: boolean;
  autopayTransactionId?: string;
  notes?: string;
}

export interface Debt {
    id: string;
    name: string;
    amount: number;
    apr: number;
    minPayment: number;
    paymentDate: number; // Day of the month (1-31)
}


// --- DEBT MANAGEMENT TYPES ---
export type Strategy = 'avalanche' | 'snowball' | 'ai';

export type DebtPaymentDetail = {
    debtName: string;
    payment: number;
    interestPaid: number;
    principalPaid: number;
    remainingBalance: number;
};

export type RoadmapItem = {
    month: number;
    totalPayment: number;
    totalInterestPaid: number;
    totalPrincipalPaid: number;
    totalRemainingBalance: number;
    focus: string;
    paymentDetails: DebtPaymentDetail[];
};

export interface DebtPlan {
    strategy: Strategy;
    totalMonths: number;
    totalInterest: number;
    totalPaid: number;
    monthlyPayment: number;
    extraMonthlyPayment: number;
    debts: Omit<Debt, 'id'>[];
    roadmap: RoadmapItem[];
    automatedPlanTransactionId?: string;
    checkedInMonths?: number[];
}

// --- NET WORTH TYPES ---
export type AssetType = 'Cash' | 'Investments' | 'Real Estate' | 'Other';
export interface Asset {
  id: string;
  name: string;
  value: number;
  type: AssetType;
}

export type LiabilityType = 'Loan' | 'Credit Card' | 'EMI' | 'Other';
export interface Liability {
  id: string;
  name: string;
  value: number;
  type: LiabilityType;
}