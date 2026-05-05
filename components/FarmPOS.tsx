import React, { useState, useMemo } from 'react';
import { Product, Order, Customer, Currency, ExchangeRate } from '../types';
import { ShoppingCart, Plus, Minus, Trash2, Search, ArrowLeft, CheckCircle } from 'lucide-react';

interface FarmPOSProps {
    products: Product[];
    customers: Customer[];
    exchangeRate: ExchangeRate;
    onCompleteSale: (order: Order) => void;
    onBack?: () => void;
}

const FarmPOS: React.FC<FarmPOSProps> = ({ products, customers, exchangeRate, onCompleteSale, onBack }) => {
    const [cart, setCart] = useState<{ product: Product; quantity: number; weight?: number }[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'EcoCash' | 'Credit'>('Cash');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSaleOrder, setLastSaleOrder] = useState<Order | null>(null);

    const categories = ['All', 'Pork', 'Live Animal', 'Manure', 'Other'];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const subtotal = cart.reduce((acc, item) => {
        const price = item.weight ? item.product.price * item.weight : item.product.price * item.quantity;
        return acc + price;
    }, 0);

    const handleAddToCart = (product: Product) => {
        const existing = cart.find(c => c.product.id === product.id);
        if (existing) {
            setCart(cart.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const updateWeight = (productId: string, weight: number) => {
        setCart(cart.map(c => c.product.id === productId ? { ...c, weight } : c));
    };

    const removeItem = (productId: string) => {
        setCart(cart.filter(c => c.product.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(cart.map(c => {
            if (c.product.id === productId) {
                return { ...c, quantity: Math.max(1, c.quantity + delta) };
            }
            return c;
        }));
    };

    const handleCheckout = () => {
        if (cart.length === 0 || !selectedCustomerId) {
            alert('Please select a customer and add items to cart.');
            return;
        }

        const order: Order = {
            id: `POS-${Date.now()}`,
            customerId: selectedCustomerId,
            date: new Date().toISOString().split('T')[0],
            status: 'Confirmed',
            items: cart.map(item => ({
                ...item.product,
                quantity: item.quantity,
                weight: item.weight
            })),
            totalAmount: subtotal,
            paymentStatus: paymentMethod === 'Credit' ? 'Unpaid' : 'Paid'
        };

        onCompleteSale(order);
        setLastSaleOrder(order);
        setShowReceipt(true);
        setCart([]);
        setSelectedCustomerId('');
    };

    if (showReceipt && lastSaleOrder) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Sale Completed!</h2>
                    <p className="text-sm text-gray-500 mb-6">Transaction recorded successfully.</p>

                    <div className="border-t border-b border-dashed border-gray-300 py-4 mb-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Date:</span>
                            <span>{lastSaleOrder.date}</span>
                        </div>
                        <div className="space-y-1 mb-4">
                            {lastSaleOrder.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm text-left">
                                    <span className="text-gray-800 flex-1">{item.name} {item.weight ? `(${item.weight}${item.unit})` : `x${item.quantity}`}</span>
                                    <span className="font-bold ml-2">
                                        {currency === 'USD' ? '$' : 'ZiG'}
                                        {(currency === 'USD' ?
                                            (item.weight ? item.price * item.weight : item.price * item.quantity) :
                                            (item.weight ? item.price * item.weight * exchangeRate.rate : item.price * item.quantity * exchangeRate.rate)
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span>
                                {currency === 'USD' ? '$' : 'ZiG'}
                                {(currency === 'USD' ? lastSaleOrder.totalAmount : lastSaleOrder.totalAmount * exchangeRate.rate).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => { setShowReceipt(false); setLastSaleOrder(null); }}
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                        Next Sale
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row md:h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
            {/* Left: Product Catalog */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search & Filter Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4 mb-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-gray-900">Farm POS</h2>

                        {/* ZIM Multi-Currency Toggle */}
                        <div className="ml-auto flex bg-gray-200 p-1 rounded-lg border border-gray-300">
                            {(['USD', 'ZiG'] as const).map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${currency === c ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search pigs, feed, or crops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-ecomattGreen focus:ring-1 focus:ring-ecomattGreen transition"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-ecomattGreen text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50/30">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-ecomattGreen/50 transition-all text-left group flex flex-col h-full"
                        >
                            <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                                {product.category === 'Pork' && '🍖'}
                                {product.category === 'Live Animal' && '🐖'}
                                {product.category === 'Manure' && '🌱'}
                                {product.category === 'Other' && '📦'}
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1">{product.name}</h3>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-ecomattGreen font-bold">
                                    {currency === 'USD' ? '$' : 'ZiG'}
                                    {currency === 'USD' ? product.price : (product.price * exchangeRate.rate).toFixed(0)}/{product.unit}
                                </span>
                                <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-ecomattGreen group-hover:text-white transition-colors">
                                    <Plus size={14} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-full md:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden shrink-0">
                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} className="text-ecomattGreen" />
                        <h2 className="font-bold">Current Order</h2>
                    </div>
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded font-mono">{cart.length} items</span>
                </div>

                {/* Customer Selection */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <select
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 outline-none focus:border-ecomattGreen transition shadow-sm"
                    >
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                    </select>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                    {cart.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Cart is empty</p>
                            <p className="text-xs mt-1">Select items to start sale</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                        {item.product.category === 'Pork' && '🍖'}
                                        {item.product.category === 'Live Animal' && '🐖'}
                                        {item.product.category === 'Manure' && '🌱'}
                                        {item.product.category === 'Other' && '📦'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.product.name}</h4>
                                        <p className="text-xs text-gray-500">${item.product.price}/{item.product.unit}</p>
                                    </div>
                                    <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-500 p-1 transition-colors"><Trash2 size={16} /></button>
                                </div>

                                <div className="flex items-center gap-2">
                                    {item.product.unit === 'kg' || item.product.unit === 'ton' ? (
                                        <div className="flex-1 flex gap-2 items-center">
                                            <input
                                                type="number"
                                                placeholder="Weight"
                                                value={item.weight || ''}
                                                onChange={(e) => updateWeight(item.product.id, parseFloat(e.target.value))}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-ecomattGreen"
                                            />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{item.product.unit}</span>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"><Minus size={12} /></button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"><Plus size={12} /></button>
                                        </div>
                                    )}
                                    <div className="text-right min-w-[60px]">
                                        <p className="text-xs font-bold text-gray-900">
                                            {currency === 'USD' ? '$' : 'ZiG'}
                                            {(item.weight ?
                                                (currency === 'USD' ? item.product.price * item.weight : item.product.price * item.weight * exchangeRate.rate).toFixed(2) :
                                                (currency === 'USD' ? item.product.price * item.quantity : item.product.price * item.quantity * exchangeRate.rate).toFixed(2)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-gray-500 text-sm">
                            <span>Subtotal</span>
                            <span className="font-bold text-gray-900">
                                {currency === 'USD' ? '$' : 'ZiG'}
                                {(currency === 'USD' ? subtotal : subtotal * exchangeRate.rate).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500 text-sm">
                            <span>Tax (0%)</span>
                            <span className="font-bold text-gray-900">$0.00</span>
                        </div>
                    </div>

                    {/* Payment Method chips */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {(['Cash', 'EcoCash', 'Credit'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setPaymentMethod(m)}
                                className={`py-2 rounded-lg text-[9px] font-bold uppercase transition-all border ${paymentMethod === m
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-ecomattGreen">
                            {currency === 'USD' ? '$' : 'ZiG'}
                            {(currency === 'USD' ? subtotal : subtotal * exchangeRate.rate).toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || !selectedCustomerId}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Review & Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FarmPOS;
