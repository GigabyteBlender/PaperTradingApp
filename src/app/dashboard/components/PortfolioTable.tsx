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
      <table className="min-w-full bg-white dark:bg-neutral-900 border-radius border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-neutral-800">
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800 rounded-tl-xl">
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
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Value
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800 rounded-tr-xl">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.symbol}
              className={`transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-neutral-800`}
            >
              <td className="px-6 py-3 text-sm font-mono text-blue-700 dark:text-blue-300 whitespace-nowrap">
                {row.symbol}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {row.company}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {row.shares}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {row.price}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {row.value}
              </td>
              <td
                className={`px-6 py-3 text-sm text-right font-semibold ${
                  row.change.startsWith("-")
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {row.change}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 dark:bg-neutral-800">
            <td
              colSpan={4}
              className="px-6 py-3 text-right text-base font-bold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-neutral-800 rounded-bl-xl"
            >
              Total Value
            </td>
            <td className="px-6 py-3 text-right text-base font-bold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-neutral-800">
              {totalValue}
            </td>
            <td className="px-6 py-3 border-t border-gray-200 dark:border-neutral-800 rounded-br-xl"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
