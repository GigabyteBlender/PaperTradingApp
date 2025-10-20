import { Portfolio, Transaction, User } from '@/types';

const STORAGE_KEYS = {
  USER: 'trading_app_user',
  PORTFOLIO: 'trading_app_portfolio',
  TRANSACTIONS: 'trading_app_transactions'
} as const;

export const saveUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};
export const savePortfolio = (portfolio: Portfolio): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
  }
};

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

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

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

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const saveBalance = (balance: number): void => {
  if (typeof window !== 'undefined') {
    const user = getUser();
    if (user) {
      const updatedUser = { ...user, balance };
      saveUser(updatedUser);
    }
  }
};

export const getBalance = (): number => {
  if (typeof window !== 'undefined') {
    const user = getUser();
    return user ? user.balance : 25000;
  }
  return 25000;
};
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};