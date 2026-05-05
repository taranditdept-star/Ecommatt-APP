import React, { useState, useMemo } from 'react';
import { Customer, Order, Invoice, Product } from '../types';

interface CRMProps {
    customers: Customer[];
    orders: Order[];
    invoices: Invoice[];
    products: Product[];
    onAddOrder: (order: Order) => void;
    onAddCustomer: (customer: Customer) => void;
    onUpdateOrder: (order: Order) => void;
    onGenerateInvoice: (order: Order) => void;
    onBack?: () => void;
}

const CRM: React.FC<CRMProps> = ({ customers, orders, invoices, products, onAddOrder, onAddCustomer, onUpdateOrder, onGenerateInvoice, onBack }) => {
    const [activeTab, setActiveTab] = useState<'Intelligence' | 'Credit' | 'Orders' | 'Directory' | 'Aggregator'>('Intelligence');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

    // Dashboard Metrics
    const totalReceivables = customers.reduce((acc, c) => acc + c.balance, 0);
    const highRiskCount = customers.filter(c => c.balance > 1000).length;
    const pendingOrderTotal = orders.filter(o => o.status === 'Pending').reduce((acc, o) => acc + o.totalAmount, 0);

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const customerOrders = orders.filter(o => o.customerId === selectedCustomerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-slate-900/5 rounded-full text-slate-900 transition-colors border border-slate-900/10">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Customer Intelligence</h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Ecomatt CRM & Relationship Hub</p>
                    </div>
                </div>

                <div className="flex bg-slate-900/5 p-1 rounded-2xl border border-slate-900/10 overflow-x-auto no-scrollbar">
                    {(['Intelligence', 'Credit', 'Orders', 'Directory', 'Aggregator'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab
                                ? 'bg-white text-slate-900 shadow-md border-slate-900/10'
                                : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Component-Specific Views */}
                <div className="lg:col-span-8 space-y-6">
                    {activeTab === 'Intelligence' && (
                        <div className="space-y-6">
                            {/* Key Performance Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-900/10 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Receivables</p>
                                    <h3 className="text-3xl font-black text-slate-900">${totalReceivables.toLocaleString()}</h3>
                                    <p className="text-[10px] font-bold text-red-500 mt-2 uppercase">Unpaid Market Exposure</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-900/10 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">High Risk Clients</p>
                                    <h3 className="text-3xl font-black text-slate-900">{highRiskCount}</h3>
                                    <p className="text-[10px] font-bold text-amber-600 mt-2 uppercase">Balances Over $1,000</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-900/10 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pipeline Value</p>
                                    <h3 className="text-3xl font-black text-slate-900">${pendingOrderTotal.toLocaleString()}</h3>
                                    <p className="text-[10px] font-bold text-ecomattGreen mt-2 uppercase">Current Pending Orders</p>
                                </div>
                            </div>

                            {/* Relationship Timeline (Placeholder for selected or recent) */}
                            <div className="bg-white rounded-3xl border border-slate-900/10 p-8">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                    <i className="fas fa-history text-ecomattGreen"></i>
                                    Recent Engagement Lifecycle
                                </h4>
                                <div className="space-y-6">
                                    {orders.slice(0, 5).map((order, idx) => {
                                        const cust = customers.find(c => c.id === order.customerId);
                                        return (
                                            <div key={order.id} className="relative flex gap-6 group">
                                                {idx !== 4 && <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-900/5"></div>}
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${order.status === 'Delivered' ? 'bg-ecomattGreen text-black' : 'bg-slate-900 text-white'
                                                    }`}>
                                                    <i className={`fas ${order.status === 'Delivered' ? 'fa-check' : 'fa-truck-loading'} text-[10px]`}></i>
                                                </div>
                                                <div className="pb-6 w-full flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-black text-slate-900 uppercase truncate">{cust?.name}</p>
                                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight truncate">{order.status} Order: ${order.totalAmount}</p>
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-900/5 px-2 py-1 rounded-md shrink-0 whitespace-nowrap">{order.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Credit' && (
                        <div className="bg-white rounded-3xl border border-slate-900/10 p-8">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-red-500"></i>
                                Credit Exposure Heatmap
                            </h4>
                            <div className="space-y-3">
                                {customers.sort((a, b) => b.balance - a.balance).map(c => (
                                    <div key={c.id} className="group cursor-pointer">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-xs font-black text-slate-900 uppercase">{c.name}</p>
                                            <p className={`text-xs font-black ${c.balance > 1000 ? 'text-red-500' : 'text-slate-900'}`}>${c.balance.toLocaleString()}</p>
                                        </div>
                                        <div className="h-3 bg-slate-900/5 rounded-full overflow-hidden border border-slate-900/10">
                                            <div
                                                className={`h-full transition-all duration-1000 ${c.balance > 1500 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : c.balance > 500 ? 'bg-amber-500' : 'bg-ecomattGreen'}`}
                                                style={{ width: `${Math.min(100, (c.balance / 2000) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-6 bg-red-500/5 rounded-2xl border border-red-500/10">
                                <p className="text-[10px] font-black text-red-600 uppercase mb-2">Internal Policy Tip</p>
                                <p className="text-xs text-slate-600 leading-relaxed italic">"Do not release new pork batches to any wholesale client with an exposure greater than $1,500 without manager approval."</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Directory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customers.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedCustomerId(c.id)}
                                    className={`p-6 rounded-3xl border transition-all text-left ${selectedCustomerId === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-900/10 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${selectedCustomerId === c.id ? 'bg-white/10' : 'bg-slate-900/5 text-slate-900'
                                            }`}>
                                            {c.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="font-black uppercase tracking-tight">{c.name}</h5>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedCustomerId === c.id ? 'text-white/60' : 'text-slate-400'}`}>{c.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end gap-4 min-w-0 w-full">
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <p className={`text-[9px] font-black uppercase ${selectedCustomerId === c.id ? 'text-white/40' : 'text-slate-400'}`}>Contact</p>
                                            <p className="text-xs font-bold leading-none truncate">{c.contact}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={`text-[9px] font-black uppercase ${selectedCustomerId === c.id ? 'text-white/40' : 'text-slate-400'}`}>Balance</p>
                                            <p className={`text-sm font-black whitespace-nowrap ${c.balance > 1000 ? 'text-red-400' : 'text-ecomattGreen'}`}>${c.balance.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Detailed Context / Action Panel */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl border border-slate-900/10 p-8 shadow-2xl sticky top-24">
                        {selectedCustomer ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Selected Lifecycle</h5>
                                    <div className="w-16 h-16 bg-slate-900/5 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-900 mb-4">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase leading-tight">{selectedCustomer.name}</h3>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{selectedCustomer.type} Partnership</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900/5 rounded-2xl border border-slate-900/10">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Tier</p>
                                            <span className="bg-ecomattGreen text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">VIP Wholesale</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-900 mr-2 uppercase">Bulk Discount Applied (15%)</p>
                                    </div>

                                    <div className="p-4 bg-slate-900 shadow-xl rounded-2xl border border-slate-900 text-white">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Total Outstanding</p>
                                        <h4 className="text-2xl font-black">${selectedCustomer.balance.toLocaleString()}</h4>
                                        <div className="mt-4 flex gap-2">
                                            <button className="flex-1 bg-white text-slate-900 text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-ecomattGreen transition-colors">Record Payment</button>
                                            <button className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"><i className="fas fa-file-invoice"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</p>
                                    {customerOrders.length > 0 ? customerOrders.slice(0, 3).map(order => (
                                        <div key={order.id} className="flex justify-between items-center p-3 border-b border-slate-900/5 hover:bg-slate-900/5 transition-colors rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-slate-900 uppercase truncate">Order #{order.id.slice(-4)}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{order.status}</p>
                                            </div>
                                            <p className="text-xs font-black text-slate-900 shrink-0 ml-4">/${order.totalAmount}</p>
                                        </div>
                                    )) : <p className="text-xs text-slate-400 italic">No recent transactions recorded.</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-900/5 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <i className="fas fa-handshake text-4xl"></i>
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Client</h4>
                                <p className="text-xs text-slate-400 px-8">Visualize customer lifecycles and manage debt exposure.</p>
                            </div>
                        )}
                    </div>
                    {activeTab === 'Aggregator' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-900/10 p-10 overflow-hidden relative">
                            {/* Watermark Background */}
                            <div className="absolute top-10 right-10 text-slate-900 opacity-[0.02] text-9xl -rotate-12 pointer-events-none">
                                <i className="fas fa-tractor"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Outgrower Aggregator Hub</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Side Marketing Control & Partner Supply</p>
                                    </div>
                                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ecomattGreen hover:text-black transition-all">
                                        Register New Outgrower
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-slate-900/5 rounded-3xl border border-slate-900/5 hover:border-ecomattGreen transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 group-hover:bg-ecomattGreen transition-colors">
                                                <i className="fas fa-hand-holding-heart"></i>
                                            </div>
                                            <span className="bg-green-100 text-green-600 text-[9px] font-black px-2 py-1 rounded-lg uppercase">Active Partner</span>
                                        </div>
                                        <h5 className="text-lg font-black text-slate-900 uppercase">Murewa Cooperatives</h5>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-6 tracking-tight">12 Members • Weekly Pork Supply</p>

                                        <div className="flex justify-between items-end border-t border-slate-900/10 pt-6">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current Intake</p>
                                                <p className="text-sm font-black text-slate-900 uppercase">450kg / Weekly</p>
                                            </div>
                                            <i className="fas fa-chevron-right text-slate-300"></i>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-900/5 rounded-3xl border border-slate-900/5 hover:border-amber-500 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 group-hover:bg-amber-500 transition-colors text-xl font-black">
                                                G
                                            </div>
                                            <span className="bg-amber-100 text-amber-600 text-[9px] font-black px-2 py-1 rounded-lg uppercase">Evaluation Phase</span>
                                        </div>
                                        <h5 className="text-lg font-black text-slate-900 uppercase">Gweru Pig Syndicate</h5>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-6 tracking-tight">5 Members • Seasonal Supply</p>

                                        <div className="flex justify-between items-end border-t border-slate-900/10 pt-6">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current Intake</p>
                                                <p className="text-sm font-black text-slate-900 uppercase">0kg (Pending Audit)</p>
                                            </div>
                                            <i className="fas fa-chevron-right text-slate-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CRM;
