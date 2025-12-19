'use client';

import { useState, useEffect } from 'react';
import { Stock } from '@/lib/types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getStockHistory } from '@/lib/api/stocks';

interface StockChartProps {
    stock: Stock;
}

interface ChartData {
    time: string;
    price: number;
}

export default function StockChart({ stock }: StockChartProps) {
    const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '1Y' | '5Y'>('1M');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch historical data when timeframe or stock changes
    useEffect(() => {
        const fetchHistoricalData = async () => {
            setError(null);
            
            try {
                // Map UI timeframe to API period
                const periodMap: Record<string, '1d' | '5d' | '1mo' | '3mo' | '1y' | '5y'> = {
                    '1D': '1d',
                    '5D': '5d',
                    '1M': '1mo',
                    '3M': '3mo',
                    '1Y': '1y',
                    '5Y': '5y',
                };
                
                const period = periodMap[timeframe];
                const history = await getStockHistory(stock.symbol, period);
                
                // Transform response to chart data
                const transformed: ChartData[] = history.map(item => {
                    const date = new Date(item.date);
                    let timeString = '';
                    
                    // Format time based on timeframe
                    if (timeframe === '1D') {
                        timeString = date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                        });
                    } else if (timeframe === '5D') {
                        timeString = date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            hour: '2-digit'
                        });
                    } else {
                        timeString = date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                        });
                    }
                    
                    return {
                        time: timeString,
                        price: item.close,
                    };
                });
                
                setChartData(transformed);
            } catch (err) {
                console.error('Failed to fetch historical data:', err);
                setError('Failed to load chart data');
            }
        };

        fetchHistoricalData();
    }, [timeframe, stock.symbol]);

    const isPositive = stock.change >= 0;
    const lineColor = isPositive ? '#10b981' : '#ef4444';

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <h2 className="text-base md:text-xl font-semibold text-neutral-900 dark:text-white">
                    Price Chart
                </h2>

                <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1 overflow-x-auto">
                    {(['1D', '5D', '1M', '3M', '1Y', '5Y'] as const).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                                timeframe === tf
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-[250px] md:h-[300px] min-h-[250px]">
                {error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">No chart data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={lineColor} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={lineColor} stopOpacity={0.05}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#374151" 
                                opacity={0.3}
                            />
                            <XAxis 
                                dataKey="time" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                interval="preserveStartEnd"
                                height={30}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                domain={['dataMin - 1', 'dataMax + 1']}
                                tickFormatter={(value) => `${Math.round(value)}`}
                                width={45}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#f9fafb',
                                    padding: '8px 12px',
                                    fontSize: '12px'
                                }}
                                formatter={(value: number) => [`${Number(value).toFixed(2)}`, 'Price']}
                                labelStyle={{ color: '#9ca3af', fontSize: '11px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={lineColor}
                                strokeWidth={2}
                                fill="url(#colorPrice)"
                                dot={false}
                                activeDot={{ r: 4, fill: lineColor }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
