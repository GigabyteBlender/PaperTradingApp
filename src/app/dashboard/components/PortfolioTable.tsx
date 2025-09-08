type PortfolioRow = {
  symbol: string;
  company: string;
  shares: number;
  price: string;
  value: string;
  change: string;
};

type PortfolioTableProps = {
  rows: PortfolioRow[];
  totalValue: string;
};

export default function PortfolioTable({ rows, totalValue }: PortfolioTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">Symbol</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">Company</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">Shares</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">Price</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">Value</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.symbol} className={row.symbol === 'GOOGL' ? 'bg-gray-50 dark:bg-neutral-950' : undefined}>
              <td className="px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-100">{row.symbol}</td>
              <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{row.company}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-700 dark:text-gray-200">{row.shares}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-700 dark:text-gray-200">{row.price}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-700 dark:text-gray-200">{row.value}</td>
              <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">{row.change}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-neutral-800">Total Value</td>
            <td className="px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-neutral-800">{totalValue}</td>
            <td className="px-4 py-2 border-t border-gray-200 dark:border-neutral-800"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}


