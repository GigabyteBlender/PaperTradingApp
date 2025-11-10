import { Portfolio, Transaction, User } from '@/types';

const STORAGE_KEYS = {
  USER: 'trading_app_user',
  PORTFOLIO: 'trading_app_portfolio',
  TRANSACTIONS: 'trading_app_transactions'
} as const;

// Save user data to localStorage
export const saveUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

// Get user data from localStorage
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Save portfolio to localStorage
export const savePortfolio = (portfolio: Portfolio): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
  }
};

// Get portfolio from localStorage and parse dates
export const getPortfolio = (): Portfolio | null => {
  if (typeof window !== 'undefined') {
    const portfolioData = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    if (portfolioData) {
      const portfolio = JSON.parse(portfolioData);
      return {
        ...portfolio,
        holdings: portfolio.holdings.map((holding: any) => ({
          ...holding,
          purchasedAt: new Date(holding.purchasedAt)
        }))
      };
    }
  }
  return null;
};

// Save transactions array to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

// Get transactions from localStorage and parse dates
export const getTransactions = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const transactionsData = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (transactionsData) {
      const transactions = JSON.parse(transactionsData);
      return transactions.map((transaction: any) => ({
        ...transaction,
        timestamp: new Date(transaction.timestamp)
      }));
    }
  }
  return [];
};

// Add new transaction to existing transactions
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

// Update user balance in localStorage
export const saveBalance = (balance: number): void => {
  if (typeof window !== 'undefined') {
    const user = getUser();
    if (user) {
      const updatedUser = { ...user, balance };
      saveUser(updatedUser);
    }
  }
};

// Get user balance from localStorage
export const getBalance = (): number => {
  if (typeof window !== 'undefined') {
    const user = getUser();
    return user ? user.balance : 25000;
  }
  return 25000;
};

// Clear all app data from localStorage
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};