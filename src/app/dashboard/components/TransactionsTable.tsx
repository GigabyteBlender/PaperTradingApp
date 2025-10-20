import { Transaction, TransactionType } from '@/types';
import { formatCurrency } from '@/utils/portfolio';
import { mockStocks } from '@/data/mockData';

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
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

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions to display.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-neutral-900 border-radius border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-neutral-800">
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800 rounded-tl-xl">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Company
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Shares
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800 rounded-tr-xl">
              Total
            </th>
          </tr>
        </thead>
        
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.transactionId}
              className="transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-neutral-800"
            >
              <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {formatDateTime(transaction.timestamp)}
              </td>
              <td className="px-6 py-3 text-sm whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction.type === TransactionType.BUY
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-3 text-sm font-mono text-blue-700 dark:text-blue-300 whitespace-nowrap">
                {transaction.symbol}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {getCompanyName(transaction.symbol)}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {transaction.shares}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {formatCurrency(transaction.price)}
              </td>
              <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(transaction.totalCost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}