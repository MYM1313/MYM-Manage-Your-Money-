import React from 'react';

// Investing Icons
import { SIPCalculatorIcon } from './components/icons/calculators/SIPCalculatorIcon';
import { LumpsumCalculatorIcon } from './components/icons/calculators/LumpsumCalculatorIcon';
import { GoalBasedInvestmentPlannerIcon } from './components/icons/calculators/GoalBasedInvestmentPlannerIcon';
import { SWPCalculatorIcon } from './components/icons/calculators/SWPCalculatorIcon';
import { XIRRCalculatorIcon } from './components/icons/calculators/XIRRCalculatorIcon';
import { AssetAllocationToolIcon } from './components/icons/calculators/AssetAllocationToolIcon';

// Saving Icons
import { FixedDepositCalculatorIcon } from './components/icons/calculators/FixedDepositCalculatorIcon';
import { RecurringDepositCalculatorIcon } from './components/icons/calculators/RecurringDepositCalculatorIcon';
import { EmergencyFundCalculatorIcon } from './components/icons/calculators/EmergencyFundCalculatorIcon';
import { GoalSavingCalculatorIcon } from './components/icons/calculators/GoalSavingCalculatorIcon';
import { InflationImpactCalculatorIcon } from './components/icons/calculators/InflationImpactCalculatorIcon';
import { GoldSavingsCalculatorIcon } from './components/icons/calculators/GoldSavingsCalculatorIcon';

// Insurance Icons
import { TermInsuranceCalculatorIcon } from './components/icons/calculators/TermInsuranceCalculatorIcon';
import { LifeInsuranceNeedsCalculatorIcon } from './components/icons/calculators/LifeInsuranceNeedsCalculatorIcon';
import { HealthInsurancePremiumEstimatorIcon } from './components/icons/calculators/HealthInsurancePremiumEstimatorIcon';
import { CriticalIllnessCoverageCalculatorIcon } from './components/icons/calculators/CriticalIllnessCoverageCalculatorIcon';
import { HumanLifeValueCalculatorIcon } from './components/icons/calculators/HumanLifeValueCalculatorIcon';

// Debt & Loans Icons
import { LoanEMICalculatorIcon } from './components/icons/calculators/LoanEMICalculatorIcon';
import { PrepaymentImpactCalculatorIcon } from './components/icons/calculators/PrepaymentImpactCalculatorIcon';
import { DebtSnowballPlannerIcon } from './components/icons/calculators/DebtSnowballPlannerIcon';
import { DebtAvalanchePlannerIcon } from './components/icons/calculators/DebtAvalanchePlannerIcon';
import { CreditCardPayoffCalculatorIcon } from './components/icons/calculators/CreditCardPayoffCalculatorIcon';
import { LoanEligibilityCalculatorIcon } from './components/icons/calculators/LoanEligibilityCalculatorIcon';

// Others Icons
import { NetWorthCalculatorIcon } from './components/icons/calculators/NetWorthCalculatorIcon';
import { FIRECalculatorIcon } from './components/icons/calculators/FIRECalculatorIcon';
import { RetirementCorpusCalculatorIcon } from './components/icons/calculators/RetirementCorpusCalculatorIcon';
import { RiskToleranceAssessmentIcon } from './components/icons/calculators/RiskToleranceAssessmentIcon';
import { TaxSavingOptimizerIcon } from './components/icons/calculators/TaxSavingOptimizerIcon';
import { FutureValueOfMoneyToolIcon } from './components/icons/calculators/FutureValueOfMoneyToolIcon';


export const CALCULATOR_CATEGORIES = ["Investing", "Saving", "Insurance", "Debt & Loans", "Others"] as const;

export interface CalculatorInfo {
  name: string;
  description: string;
  category: typeof CALCULATOR_CATEGORIES[number];
  icon: React.FC<any>;
  slug: string;
}

export const CALCULATORS: CalculatorInfo[] = [
  // Investing
  { name: 'SIP Calculator', description: 'Project future wealth from your monthly investments.', category: 'Investing', icon: SIPCalculatorIcon, slug: 'sip' },
  { name: 'Lumpsum Calculator', description: 'See how a one-time investment can grow over time.', category: 'Investing', icon: LumpsumCalculatorIcon, slug: 'lumpsum' },
  { name: 'Goal-Based Planner', description: 'Plan investments to achieve your financial goals.', category: 'Investing', icon: GoalBasedInvestmentPlannerIcon, slug: 'goal-planner' },
  { name: 'SWP Calculator', description: 'Plan regular withdrawals from your investments.', category: 'Investing', icon: SWPCalculatorIcon, slug: 'swp' },
  { name: 'XIRR / CAGR Calculator', description: 'Calculate your portfolio\'s annualized return.', category: 'Investing', icon: XIRRCalculatorIcon, slug: 'xirr-cagr' },
  { name: 'Asset Allocation Tool', description: 'Optimize your investment diversification strategy.', category: 'Investing', icon: AssetAllocationToolIcon, slug: 'asset-allocation' },

  // Saving
  { name: 'Fixed Deposit Calculator', description: 'Calculate the maturity amount of your FDs.', category: 'Saving', icon: FixedDepositCalculatorIcon, slug: 'fd' },
  { name: 'Recurring Deposit', description: 'Estimate returns on your regular RD savings.', category: 'Saving', icon: RecurringDepositCalculatorIcon, slug: 'rd' },
  { name: 'Emergency Fund', description: 'Determine how much you need for a safety net.', category: 'Saving', icon: EmergencyFundCalculatorIcon, slug: 'emergency-fund' },
  { name: 'Goal Saving Calculator', description: 'Plan how much to save for specific goals.', category: 'Saving', icon: GoalSavingCalculatorIcon, slug: 'goal-saving' },
  { name: 'Inflation Impact', description: 'Understand how inflation affects your savings.', category: 'Saving', icon: InflationImpactCalculatorIcon, slug: 'inflation' },
  { name: 'Gold Savings Calculator', description: 'Plan your savings for gold accumulation.', category: 'Saving', icon: GoldSavingsCalculatorIcon, slug: 'gold-saving' },

  // Insurance
  { name: 'Term Insurance', description: 'Estimate the life cover you need.', category: 'Insurance', icon: TermInsuranceCalculatorIcon, slug: 'term-insurance' },
  { name: 'Life Insurance Needs', description: 'Analyze your total insurance requirements.', category: 'Insurance', icon: LifeInsuranceNeedsCalculatorIcon, slug: 'life-insurance' },
  { name: 'Health Premium Estimator', description: 'Get an estimate for your health insurance premium.', category: 'Insurance', icon: HealthInsurancePremiumEstimatorIcon, slug: 'health-premium' },
  { name: 'Critical Illness Cover', description: 'Calculate the ideal coverage for critical illnesses.', category: 'Insurance', icon: CriticalIllnessCoverageCalculatorIcon, slug: 'critical-illness' },
  { name: 'Human Life Value', description: 'Calculate your economic value for insurance.', category: 'Insurance', icon: HumanLifeValueCalculatorIcon, slug: 'hlv' },

  // Debt & Loans
  { name: 'Loan EMI Calculator', description: 'Calculate your equated monthly installments.', category: 'Debt & Loans', icon: LoanEMICalculatorIcon, slug: 'emi' },
  { name: 'Prepayment Impact', description: 'See how prepayments can reduce your loan tenure.', category: 'Debt & Loans', icon: PrepaymentImpactCalculatorIcon, slug: 'prepayment' },
  { name: 'Debt Snowball Planner', description: 'Plan to clear debts by paying smallest first.', category: 'Debt & Loans', icon: DebtSnowballPlannerIcon, slug: 'debt-snowball' },
  { name: 'Debt Avalanche Planner', description: 'Plan to clear debts by paying highest-interest first.', category: 'Debt & Loans', icon: DebtAvalanchePlannerIcon, slug: 'debt-avalanche' },
  { name: 'Credit Card Payoff', description: 'Strategize how to pay off your credit card debt.', category: 'Debt & Loans', icon: CreditCardPayoffCalculatorIcon, slug: 'cc-payoff' },
  { name: 'Loan Eligibility', description: 'Check your eligibility for different types of loans.', category: 'Debt & Loans', icon: LoanEligibilityCalculatorIcon, slug: 'loan-eligibility' },

  // Others
  { name: 'Net Worth Calculator', description: 'Calculate and track your total net worth.', category: 'Others', icon: NetWorthCalculatorIcon, slug: 'net-worth' },
  { name: 'FIRE Calculator', description: 'Plan your journey to Financial Independence.', category: 'Others', icon: FIRECalculatorIcon, slug: 'fire' },
  { name: 'Retirement Corpus', description: 'Estimate the funds you need for retirement.', category: 'Others', icon: RetirementCorpusCalculatorIcon, slug: 'retirement' },
  { name: 'Risk Tolerance', description: 'Assess your personal investment risk profile.', category: 'Others', icon: RiskToleranceAssessmentIcon, slug: 'risk-tolerance' },
  { name: 'Tax-Saving Optimizer', description: 'Find the best ways to save on income tax.', category: 'Others', icon: TaxSavingOptimizerIcon, slug: 'tax-optimizer' },
  { name: 'Future Value of Money', description: 'See the future value of your money.', category: 'Others', icon: FutureValueOfMoneyToolIcon, slug: 'future-value' },
];