import { Transaction, TransactionType } from '@/types';
import { formatCurrency } from '@/utils/portfolio';
import { mockStocks } from '@/data/mockData';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export default function TransactionsTable({ transactions, isLoading = false }: TransactionsTableProps) {
  const getCompanyName = (symbol: string): string => {
    const stock = mockStocks.find(s => s.symbol === symbol);
    return stock?.name || symbol;
  };

  const formatDateTime = (date: Date | string): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Date & Time
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Symbol
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Company
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Shares
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Price
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total
            </th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {isLoading ? (
            // Loading skeleton rows
            [...Array(6)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-28"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-600 rounded-full w-14"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-36"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-12"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-24"></div>
                </td>
              </tr>
            ))
          ) : !isLoading && transactions.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                No transactions yet. Start trading to see your transaction history here.
              </td>
            </tr>
          ) : (
            // Actual transactions data
            transactions.map((transaction) => (
              <tr
                key={transaction.transactionId}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 hover:shadow-sm group"
              >
                <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  {formatDateTime(transaction.timestamp)}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === TransactionType.BUY
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100 whitespace-nowrap font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {transaction.symbol}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  {getCompanyName(transaction.symbol)}
                </td>
                <td className="px-6 py-4 text-sm text-left text-neutral-700 dark:text-neutral-300">
                  {transaction.shares}
                </td>
                <td className="px-6 py-4 text-sm text-left text-neutral-700 dark:text-neutral-300">
                  {formatCurrency(transaction.price)}
                </td>
                <td className="px-6 py-4 text-sm text-left font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(transaction.totalCost)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}