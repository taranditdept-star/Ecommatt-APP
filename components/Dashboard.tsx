
import React, { useEffect, useState } from 'react';
import { Pig, PigStatus, PigStage, Task, FinanceRecord, ViewState, FeedInventory, Field, CropCycle, Asset } from '../types';
import { generateSmartAlerts } from '../services/geminiService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardProps {
    pigs: Pig[];
    tasks: Task[];
    financeRecords: FinanceRecord[];
    feeds: FeedInventory[];
    fields: Field[];
    cropCycles: CropCycle[];
    assets: Asset[];
    onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pigs, tasks, financeRecords, feeds, fields = [], cropCycles = [], assets = [], onViewChange }) => {
    const [smartAlerts, setSmartAlerts] = useState<any[]>([]);

    // Computed Metrics
    const totalPigs = pigs.length;
    const piglets = pigs.filter(p => p.stage === PigStage.Piglet).length;
    const weaners = pigs.filter(p => p.stage === PigStage.Weaner).length;
    const growers = pigs.filter(p => p.stage === PigStage.Grower).length;
    const finishers = pigs.filter(p => p.stage === PigStage.Finisher).length;
    const sows = pigs.filter(p => p.stage === PigStage.Sow).length;
    const boars = pigs.filter(p => p.stage === PigStage.Boar).length;
    const pregnant = pigs.filter(p => p.status === PigStatus.Pregnant).length;

    // Critical Metrics
    const sickPigs = pigs.filter(p => p.status === PigStatus.Sick).length;
    const urgentTasks = tasks.filter(t => t.priority === 'High' && t.status === 'Pending').length;
    const lowStockFeeds = feeds.filter(f => f.quantityKg < f.reorderLevel).length;

    // Finance Metrics
    const sales = financeRecords
        .filter(r => r.type === 'Income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = financeRecords
        .filter(r => r.type === 'Expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const netProfit = sales - expenses;

    // Breakdown
    const feedCost = financeRecords
        .filter(r => r.type === 'Expense' && r.category.toLowerCase().includes('feed'))
        .reduce((acc, curr) => acc + curr.amount, 0);

    const machineryCost = financeRecords
        .filter(r => r.type === 'Expense' && (r.category === 'Fuel' || r.category === 'Maintenance'))
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Pens count
    const pens = new Set(pigs.map(p => p.penLocation).filter(l => l && l && l !== 'Unassigned')).size;

    // Mortality rate
    const deceased = pigs.filter(p => p.status === PigStatus.Deceased).length;
    const mortalityRate = totalPigs > 0 ? ((deceased / (totalPigs + deceased)) * 100).toFixed(1) : '0.0';

    // Crop Metrics
    const activeFields = fields.filter(f => f.status === 'Planted').length;
    const plantedDirect = fields.filter(f => f.status === 'Planted').reduce((acc, curr) => acc + curr.size, 0).toFixed(1);
    const activeCycles = cropCycles.filter(c => c.status === 'Active');

    // Machinery Metrics
    const activeAssets = assets.filter(a => a.status === 'Active').length;
    const inMaintenanceAssets = assets.filter(a => a.status === 'Maintenance').length;


    const financeData = [
        { name: 'Rev', amount: sales, fill: '#27cd00' },
        { name: 'Exp', amount: expenses, fill: '#ef4444' },
        { name: 'Feed', amount: feedCost, fill: '#f1b103' },
        { name: 'Machinery', amount: machineryCost, fill: '#64748b' },
    ];

    useEffect(() => {
        const fetchAlerts = async () => {
            const metrics = { totalPigs, piglets, sows, mortalityRate, sickPigs };
            const alerts = await generateSmartAlerts(metrics);
            setSmartAlerts(alerts);
        };
        fetchAlerts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helper Components
    const StatCard = ({ title, value, subtitle, icon, color, onClick, highlight }: any) => (
        <div
            onClick={onClick}
            className={`p-6 rounded-3xl shadow-sm border flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all w-full ${highlight ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
        >
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{value}</h3>
                {subtitle && <p className={`text-sm font-bold mt-2 flex items-center gap-1 ${highlight ? 'text-ecomattGreen' : 'text-gray-400'}`}>{subtitle}</p>}
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${highlight ? 'bg-gray-800' : 'bg-gray-50'} ${color}`}>
                <i className={`fas ${icon}`}></i>
            </div>
        </div>
    );

    const PipelineItem = ({ label, count, total, color, icon }: any) => (
        <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0" style={{ color: color }}>
                <i className={`fas ${icon}`}></i>
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-2">
                    <span className="text-base font-bold text-gray-700">{label}</span>
                    <span className="text-base font-bold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${total > 0 ? (count / total) * 100 : 0}%`, backgroundColor: color }}
                    ></div>
                </div>
            </div>
        </div>
    );

    // New Helper for Simple List Items
    const SimpleListItem = ({ title, subtitle, icon, color, onClick }: any) => (
        <div onClick={onClick} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} bg-white shadow-sm`}>
                <i className={`fas ${icon}`}></i>
            </div>
            <div>
                <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500 pb-24 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-end px-1 pb-2">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Today's Overview</p>
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard <span className="text-[10px] bg-ecomattGreen text-white px-2 py-0.5 rounded ml-1 align-middle">Beta v9.0</span></h2>
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                    <i className="fas fa-cloud-sun text-ecomattYellow text-lg"></i>
                    <span className="text-sm font-bold text-gray-700">24°C</span>
                </div>
            </div>

            {/* 1. Hero Section: Grid for Multi-Enterprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Piggery"
                    value={totalPigs}
                    subtitle={<span><i className="fas fa-layer-group"></i> {pens} Pens</span>}
                    icon="fa-piggy-bank"
                    color="text-pink-500"
                    onClick={() => onViewChange(ViewState.Pigs)}
                />
                <StatCard
                    title="Crop Fields"
                    value={activeFields}
                    subtitle={<span><i className="fas fa-seedling"></i> {plantedDirect} Ha Planted</span>}
                    icon="fa-tractor"
                    color="text-green-600"
                    onClick={() => onViewChange(ViewState.Crops)}
                />
                <StatCard
                    title="Machinery"
                    value={activeAssets}
                    subtitle={<span><i className="fas fa-wrench"></i> {inMaintenanceAssets} In Service</span>}
                    icon="fa-truck-pickup"
                    color="text-slate-600"
                    onClick={() => onViewChange(ViewState.Machinery)}
                />
                <StatCard
                    title="Net Profit"
                    value={`$${netProfit.toLocaleString()}`}
                    subtitle={<span><i className="fas fa-chart-line"></i> YTD Status</span>}
                    icon="fa-wallet"
                    color={netProfit >= 0 ? 'text-ecomattGreen' : 'text-red-500'}
                    onClick={() => onViewChange(ViewState.Finance)}
                    highlight={true}
                />
            </div>

            {/* 2. Quick Actions: 2-Col Grid on Mobile for larger targets */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => onViewChange(ViewState.Pigs)} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition hover:border-ecomattGreen group h-32">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-ecomattGreen flex items-center justify-center group-hover:bg-ecomattGreen group-hover:text-white transition-colors"><i className="fas fa-plus text-lg"></i></div>
                    <span className="text-xs font-bold text-gray-700">Add Pig</span>
                </button>
                <button onClick={() => onViewChange(ViewState.Operations)} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition hover:border-yellow-400 group h-32">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors"><i className="fas fa-utensils text-lg"></i></div>
                    <span className="text-xs font-bold text-gray-700">Log Feed</span>
                </button>
                <button onClick={() => onViewChange(ViewState.Machinery)} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition hover:border-slate-400 group h-32">
                    <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white transition-colors"><i className="fas fa-gas-pump text-lg"></i></div>
                    <span className="text-xs font-bold text-gray-700">Log Fuel</span>
                </button>
                <button onClick={() => onViewChange(ViewState.Finance)} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition hover:border-gray-400 group h-32">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors"><i className="fas fa-dollar-sign text-lg"></i></div>
                    <span className="text-xs font-bold text-gray-700">Finance</span>
                </button>
                <button onClick={() => onViewChange(ViewState.CRM)} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition hover:border-purple-400 group h-32">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors"><i className="fas fa-users text-lg"></i></div>
                    <span className="text-xs font-bold text-gray-700">CRM & Sales</span>
                </button>
            </div>

            {/* 3. Operational Overview (Crops & Machinery) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Crops Status */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Active Crops</h3>
                        <i className="fas fa-seedling text-green-500"></i>
                    </div>
                    {activeCycles.length > 0 ? (
                        <div className="space-y-3">
                            {activeCycles.slice(0, 3).map(cycle => (
                                <SimpleListItem
                                    key={cycle.id}
                                    title={`${cycle.cropType} (${cycle.variety})`}
                                    subtitle={`Planted: ${cycle.startDate} • Stage: ${cycle.stage}`}
                                    icon="fa-leaf"
                                    color="text-green-600"
                                    onClick={() => onViewChange(ViewState.Crops)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No active crop cycles.</p>
                    )}
                </div>

                {/* Machinery Status */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Fleet Status</h3>
                        <i className="fas fa-truck text-slate-500"></i>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl text-center">
                            <p className="text-2xl font-bold text-green-700">{activeAssets}</p>
                            <p className="text-xs font-bold text-green-600 uppercase">Active</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl text-center">
                            <p className="text-2xl font-bold text-yellow-700">{inMaintenanceAssets}</p>
                            <p className="text-xs font-bold text-yellow-600 uppercase">Maintenance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Critical Alerts (Horizontal Scroll) */}
            {(sickPigs > 0 || urgentTasks > 0 || lowStockFeeds > 0) && (
                <div className="animate-in slide-in-from-right">
                    <div className="flex items-center gap-2 mb-3 ml-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requires Attention</h3>
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                        {sickPigs > 0 && (
                            <div onClick={() => onViewChange(ViewState.Operations)} className="bg-white border-l-4 border-red-500 p-5 rounded-2xl min-w-[240px] shadow-sm cursor-pointer snap-center active:bg-gray-50 flex-shrink-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded uppercase tracking-wide">Health Alert</span>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{sickPigs}</p>
                                <p className="text-xs text-gray-500 font-medium">Sick animals reported</p>
                            </div>
                        )}
                        {lowStockFeeds > 0 && (
                            <div onClick={() => onViewChange(ViewState.Operations)} className="bg-white border-l-4 border-yellow-500 p-5 rounded-2xl min-w-[240px] shadow-sm cursor-pointer snap-center active:bg-gray-50 flex-shrink-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded uppercase tracking-wide">Low Stock</span>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{lowStockFeeds}</p>
                                <p className="text-xs text-gray-500 font-medium">Feed types below reorder</p>
                            </div>
                        )}
                        {urgentTasks > 0 && (
                            <div onClick={() => onViewChange(ViewState.Operations)} className="bg-white border-l-4 border-orange-500 p-5 rounded-2xl min-w-[240px] shadow-sm cursor-pointer snap-center active:bg-gray-50 flex-shrink-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded uppercase tracking-wide">Urgent Tasks</span>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{urgentTasks}</p>
                                <p className="text-xs text-gray-500 font-medium">Pending high priority</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 5. Production Pipeline */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100" onClick={() => onViewChange(ViewState.Pigs)}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-xl">Production Pipeline</h3>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </div>
                <div className="space-y-2">
                    <PipelineItem label="Piglets" count={piglets} total={totalPigs} color="#f1b103" icon="fa-paw" />
                    <PipelineItem label="Weaners" count={weaners} total={totalPigs} color="#3b82f6" icon="fa-cube" />
                    <PipelineItem label="Growers" count={growers} total={totalPigs} color="#27cd00" icon="fa-arrow-up" />
                    <PipelineItem label="Finishers" count={finishers} total={totalPigs} color="#a855f7" icon="fa-weight-hanging" />
                </div>
            </div>

            {/* 6. Breeding Stock - Vertical Stack for Mobile */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Breeding Stock</h3>
                <div className="flex flex-col gap-3 md:grid md:grid-cols-3">
                    <div onClick={() => onViewChange(ViewState.Pigs)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:bg-gray-50">
                        <div>
                            <p className="text-xs font-bold text-pink-500 uppercase mb-1">Sows & Gilts</p>
                            <p className="text-4xl font-bold text-gray-900">{sows}</p>
                        </div>
                        <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center text-2xl"><i className="fas fa-venus"></i></div>
                    </div>

                    <div onClick={() => onViewChange(ViewState.Pigs)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:bg-gray-50">
                        <div>
                            <p className="text-xs font-bold text-gray-600 uppercase mb-1">Boars</p>
                            <p className="text-4xl font-bold text-gray-900">{boars}</p>
                        </div>
                        <div className="w-14 h-14 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center text-2xl"><i className="fas fa-mars"></i></div>
                    </div>

                    <div onClick={() => onViewChange(ViewState.Pigs)} className="bg-green-50 p-6 rounded-3xl shadow-sm border border-green-100 flex justify-between items-center cursor-pointer active:scale-[0.98] transition">
                        <div>
                            <p className="text-xs font-bold text-green-700 uppercase mb-1">Pregnant</p>
                            <p className="text-4xl font-bold text-green-800">{pregnant}</p>
                        </div>
                        <div className="w-14 h-14 bg-white text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm"><i className="fas fa-baby-carriage"></i></div>
                    </div>
                </div>
            </div>

            {/* 7. Charts & Finance */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Financial Performance</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 8. AI Alerts */}
            {smartAlerts.length > 0 && (
                <div className="space-y-3 pb-12">
                    <div className="flex items-center gap-2 mb-2 ml-1">
                        <i className="fas fa-robot text-ecomattGreen"></i>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Insights</h3>
                    </div>
                    {smartAlerts.map((alert, idx) => (
                        <div key={idx} className="bg-gray-900 p-5 rounded-2xl shadow-md text-white flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-ecomattGreen shrink-0 mt-1">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1 text-ecomattGreen">{alert.title}</h4>
                                <p className="text-xs text-gray-300 leading-relaxed">{alert.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Dashboard;
