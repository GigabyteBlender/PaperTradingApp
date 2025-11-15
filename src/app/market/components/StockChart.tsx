'use client';

import { useState, useMemo } from 'react';
import { Stock } from '@/types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockChartProps {
    stock: Stock;
}

interface ChartData {
    time: string;
    price: number;
}

export default function StockChart({ stock }: StockChartProps) {
    const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');

    // Generate mock chart data based on selected timeframe
    const generateChartData = (timeframe: string, currentPrice: number): ChartData[] => {
        const now = new Date();
        const data: ChartData[] = [];
        let points = 50;
        let intervalMs = 60000; // 1 minute

        // Adjust points and intervals based on timeframe
        switch (timeframe) {
            case '1D':
                points = 100; // More points for smoother line
                intervalMs = 300000; // 5 minutes
                break;
            case '1W':
                points = 35; // 5 days * 7 hours
                intervalMs = 3600000; // 1 hour
                break;
            case '1M':
                points = 30; // 30 days
                intervalMs = 86400000; // 1 day
                break;
            case '3M':
                points = 90; // 90 days
                intervalMs = 86400000; // 1 day
                break;
            case '1Y':
                points = 52; // 52 weeks
                intervalMs = 604800000; // 1 week
                break;
        }

        let price = currentPrice;
        const volatility = currentPrice * 0.015;
        
        // creating random points for the graph
        for (let i = points - 1; i >= 0; i--) {
            // variables needed for the graphs
            const timestamp = now.getTime() - i * intervalMs;
            const date = new Date(timestamp);
            // using volatility here to not have too sudden changes on my graph
            const change = (Math.random() - 0.5) * volatility;
            price = Math.max(price + change, currentPrice * 0.7);
            
            // Format time based on timeframe
            let timeString = '';
            if (timeframe === '1D') {
                timeString = date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
            } else if (timeframe === '1W') {
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
            
            data.push({
                time: timeString,
                price: Number(price.toFixed(2))
            });
        }

        return data;
    };

    const chartData = useMemo(() => generateChartData(timeframe, stock.currentPrice), [timeframe, stock.currentPrice]);

    const isPositive = stock.change >= 0;
    const lineColor = isPositive ? '#10b981' : '#ef4444';

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <h2 className="text-base md:text-xl font-semibold text-neutral-900 dark:text-white">
                    Price Chart
                </h2>

                <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1 overflow-x-auto">
                    {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
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

            <div className="w-full h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
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
                            tickFormatter={(value) => `$${Math.round(value)}`}
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
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
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
            </div>
        </div>
    );
}
