
import React, { useState, useMemo } from 'react';
import { FinanceRecord, ExchangeRate } from '../types';
import { exportToPDF, exportToExcel, formatCurrency } from '../services/exportService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface FinanceProps {
    records: FinanceRecord[];
    exchangeRate: ExchangeRate;
    onOpenLogger: () => void;
    onOpenBatch: () => void;
    onOpenCalculator: () => void;
    onOpenForecast: () => void;
    onOpenBudget: () => void;
    onOpenLoans: () => void;
    onOpenCostAnalysis: () => void;
    onOpenRatios: () => void;
    onOpenCostCenters: () => void;
    onOpenTax: () => void;
}

const Finance: React.FC<FinanceProps> = ({
    records,
    exchangeRate,
    onOpenLogger,
    onOpenBatch,
    onOpenCalculator,
    onOpenForecast,
    onOpenBudget,
    onOpenLoans,
    onOpenCostAnalysis,
    onOpenRatios,
    onOpenCostCenters,
    onOpenTax
}) => {
    const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'ZiG'>('USD');

    const convert = (amount: number, from?: string) => {
        if (displayCurrency === 'USD') return amount;
        return amount * exchangeRate.rate;
    };

    const currencySymbol = displayCurrency === 'USD' ? '$' : 'ZiG';

    // Metrics: Only include 'Paid' (Actual) transactions for the header stats
    const actualRecords = records.filter(r => r.status === 'Paid' || !r.status);

    const totalIncome = actualRecords.filter(r => r.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = actualRecords.filter(r => r.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalIncome - totalExpense;

    // Chart Data Preparation (Last 7 days or similar)
    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dayRecords = actualRecords.filter(r => r.date === date);
            const inc = dayRecords.filter(r => r.type === 'Income').reduce((a, b) => a + b.amount, 0);
            const exp = dayRecords.filter(r => r.type === 'Expense').reduce((a, b) => a + b.amount, 0);
            return {
                date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
                Income: convert(inc),
                Expense: convert(exp),
                Profit: convert(inc - exp)
            };
        });
    }, [actualRecords, displayCurrency, exchangeRate.rate]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Projected': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Paid': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const enterpriseColors: any = {
        'Piggery': '#10b981',
        'Crops': '#f59e0b',
        'Poultry': '#ef4444',
        'Machinery': '#3b82f6',
        'General': '#6b7280'
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">

            {/* Premium Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 px-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Financial Hub</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Manage your farm's economic health</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-end sm:self-auto">
                    <button
                        onClick={() => setDisplayCurrency('USD')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${displayCurrency === 'USD' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >USD</button>
                    <button
                        onClick={() => setDisplayCurrency('ZiG')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${displayCurrency === 'ZiG' ? 'bg-ecomattGreen text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >ZiG</button>
                </div>
            </div>

            {/* Main Stats with Glassmorphism Effect */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em]">Cash Flow Trend</p>
                            <h3 className="text-xl font-bold text-gray-800">Operational Balance</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 block">Net Profit</span>
                            <span className={`text-2xl font-black ${netProfit >= 0 ? 'text-ecomattGreen' : 'text-red-500'}`}>
                                {currencySymbol}{convert(netProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                                <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white shadow-xl shadow-gray-200">
                        <div className="flex justify-between items-center mb-8">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <i className="fas fa-brain text-ecomattGreen"></i>
                            </div>
                            <span className="bg-ecomattGreen/20 text-ecomattGreen text-[10px] px-2 py-1 rounded-lg font-bold">FinAI Insight</span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Recommendation</p>
                        <p className="text-sm font-medium leading-relaxed">
                            {netProfit > 500 ? "Your cash reserves are healthy. Consider pre-purchasing next month's feed to hedge against inflation." :
                                netProfit > 0 ? "Profit margins are thinning. Audit 'Other Expenses' to identify potential savings of up to 12%." :
                                    "Negative cash flow detected. Focus on clearing pending invoices from Downtown Butchery to restore balance."}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => {
                            const columns = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Status'];
                            const data = records.map(r => [r.date, r.type, r.category, r.description, formatCurrency(r.amount), r.status]);
                            exportToPDF('Financial Report', columns, data, 'finance_report.pdf');
                        }} className="flex-1 bg-white border border-gray-100 p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            <i className="fas fa-file-pdf text-red-500"></i> Export
                        </button>
                        <button onClick={onOpenLogger} className="flex-1 bg-ecomattYellow p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-gray-900 shadow-lg shadow-yellow-100 active:scale-95 transition-all">
                            <i className="fas fa-plus"></i> NEW LOG
                        </button>
                    </div>
                </div>
            </div>

            {/* Modern Tools Grid */}
            <h3 className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em] ml-2">Intelligence & Analysis</h3>
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2 mb-8">
                {[
                    { icon: 'fa-layer-group', label: 'Batch P&L', color: 'bg-blue-50 text-blue-600', action: onOpenBatch },
                    { icon: 'fa-calculator', label: 'Projection', color: 'bg-orange-50 text-orange-600', action: onOpenCalculator },
                    { icon: 'fa-chart-line', label: 'Forecast', color: 'bg-purple-50 text-purple-600', action: onOpenForecast },
                    { icon: 'fa-bullseye', label: 'Budget', color: 'bg-red-50 text-red-600', action: onOpenBudget },
                    { icon: 'fa-university', label: 'Loans', color: 'bg-gray-100 text-gray-600', action: onOpenLoans },
                    { icon: 'fa-tags', label: 'Unit Cost', color: 'bg-teal-50 text-teal-600', action: onOpenCostAnalysis },
                    { icon: 'fa-balance-scale', label: 'Ratios', color: 'bg-indigo-50 text-indigo-600', action: onOpenRatios },
                    { icon: 'fa-chart-pie', label: 'Centers', color: 'bg-pink-50 text-pink-600', action: onOpenCostCenters },
                    { icon: 'fa-percent', label: 'Tax Tool', color: 'bg-yellow-50 text-yellow-700', action: onOpenTax },
                ].map((tool, idx) => (
                    <button
                        key={idx}
                        onClick={tool.action}
                        className="group flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-gray-50 hover:border-ecomattGreen hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                            <i className={`fas ${tool.icon}`}></i>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Transactions Feed */}
            <div className="flex justify-between items-center mb-4 ml-2">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Stream</h3>
                <button className="text-[10px] font-bold text-ecomattGreen hover:underline">View All</button>
            </div>

            <div className="space-y-3">
                {records.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-receipt text-gray-300 text-2xl"></i>
                        </div>
                        <p className="text-gray-400 font-bold text-sm">No transactions detected yet.</p>
                        <button onClick={onOpenLogger} className="mt-4 text-ecomattGreen text-xs font-black uppercase tracking-widest">Start Logging</button>
                    </div>
                ) : (
                    records
                        .slice()
                        .reverse() // Show newest first
                        .map(rec => (
                            <div key={rec.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-50 flex justify-between items-center group hover:border-gray-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${rec.type === 'Income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        <div className="relative">
                                            <i className={`fas ${rec.type === 'Income' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                                <div className={`w-1.5 h-1.5 rounded-full ${rec.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{rec.description}</p>
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold text-white`} style={{ backgroundColor: enterpriseColors[rec.enterprise || 'General'] }}>
                                                {rec.enterprise || 'General'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${getStatusColor(rec.status)}`}>
                                                {rec.status || 'Paid'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold">{rec.category} • {new Date(rec.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className={`font-black text-lg whitespace-nowrap ${rec.type === 'Income' ? 'text-ecomattGreen' : 'text-gray-900'}`}>
                                        {rec.type === 'Income' ? '+' : '-'}{currencySymbol}{convert(rec.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter whitespace-nowrap">
                                        {rec.currency || 'USD'} Transaction
                                    </p>
                                </div>
                            </div>
                        ))
                )}
            </div>

        </div>
    );
};

export default Finance;

