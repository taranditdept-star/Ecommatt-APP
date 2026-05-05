
import React, { useState, useMemo } from 'react';
import { Field, Crop, CropCycle, HarvestLog, CropActivity } from '../types';
import { Sprout, Tractor, Calendar as CalendarIcon, Droplets, Map, Plus, ClipboardList, CheckCircle, Clock, DollarSign, Satellite } from 'lucide-react';

interface CropManagerProps {
    fields: Field[];
    crops: Crop[];
    cycles: CropCycle[];
    activities: CropActivity[];
    onPlantField: (fieldId: string, cropId: string, date: string) => void;
    onHarvest: (cycleId: string, date: string, quantity: number, quality: string, destination: 'Market' | 'FeedInventory', feedType?: string) => void;
    onUpdateFieldStatus: (fieldId: string, status: 'Fallow' | 'Preparation') => void;
    onLogActivity: (activity: CropActivity) => void;
    onNavigateToPrecision?: (fieldId: string) => void;
}

const CropManager: React.FC<CropManagerProps> = ({ fields, crops, cycles, activities, onPlantField, onHarvest, onUpdateFieldStatus, onLogActivity, onNavigateToPrecision }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Fields' | 'Harvests'>('Overview');

    // View Details State
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    // Plant Modal State
    const [isPlanting, setIsPlanting] = useState<string | null>(null); // Field ID
    const [selectedCrop, setSelectedCrop] = useState<string>('');

    const [plantDate, setPlantDate] = useState(new Date().toISOString().split('T')[0]);

    // Harvest Modal State
    const [isHarvesting, setIsHarvesting] = useState<string | null>(null); // Cycle ID
    const [harvestQty, setHarvestQty] = useState('');
    const [harvestQuality, setHarvestQuality] = useState('A'); // Default
    const [harvestDest, setHarvestDest] = useState<'Market' | 'FeedInventory'>('Market');
    const [feedType, setFeedType] = useState<string>('Maize');

    // Activity Modal State
    const [isLoggingActivity, setIsLoggingActivity] = useState<string | null>(null); // Field ID
    const [activityType, setActivityType] = useState<CropActivity['type']>('Scouting');
    const [activityDesc, setActivityDesc] = useState('');
    const [activityCost, setActivityCost] = useState('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [fertilizerSource, setFertilizerSource] = useState<'Synthetic' | 'Manure'>('Synthetic');


    // Helpers
    const getActiveCycle = (fieldId: string) => cycles.find(c => c.fieldId === fieldId && c.status === 'Active');
    const getCropDetails = (cropId: string) => crops.find(c => c.id === cropId);

    // Filter activities for selected field
    const fieldActivities = useMemo(() => {
        if (!selectedFieldId) return [];
        return activities
            .filter(a => a.fieldId === selectedFieldId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [activities, selectedFieldId]);

    const handlePlantSubmit = () => {
        if (isPlanting && selectedCrop) {
            onPlantField(isPlanting, selectedCrop, plantDate);
            setIsPlanting(null);
            setSelectedCrop('');
        }
    };

    const handleHarvestSubmit = () => {
        if (isHarvesting && harvestQty) {
            onHarvest(isHarvesting, new Date().toISOString().split('T')[0], parseFloat(harvestQty), harvestQuality, harvestDest, feedType);
            setIsHarvesting(null);
            setHarvestQty('');
            setHarvestDest('Market');
        }
    };

    const handleActivitySubmit = () => {
        if (isLoggingActivity && activityDesc) {
            const newActivity: CropActivity = {
                id: Date.now().toString(),
                fieldId: isLoggingActivity,
                cycleId: getActiveCycle(isLoggingActivity)?.id,
                date: activityDate,
                type: activityType,
                description: activityDesc,
                cost: activityCost ? parseFloat(activityCost) : 0,
                fertilizerSource: activityType === 'Fertilizer' ? fertilizerSource : undefined
            };
            onLogActivity(newActivity);
            setIsLoggingActivity(null);
            setActivityDesc('');
            setActivityCost('');
            setFertilizerSource('Synthetic'); // Reset
        }
    }

    // Calculations
    const totalArea = fields.reduce((sum, f) => sum + f.size, 0);
    const plantedArea = fields.filter(f => f.status === 'Planted').reduce((sum, f) => sum + f.size, 0);
    const preparationArea = fields.filter(f => f.status === 'Preparation').reduce((sum, f) => sum + f.size, 0);

    const renderFieldCard = (field: Field) => {
        const cycle = getActiveCycle(field.id);
        const crop = cycle ? getCropDetails(cycle.cropId) : null;

        // Progress Calculation
        let progress = 0;
        let daysLeft = 0;
        if (cycle && crop) {
            const start = new Date(cycle.plantingDate).getTime();
            const end = new Date(cycle.expectedHarvestDate).getTime();
            const now = new Date().getTime();
            const total = end - start;
            const elapsed = now - start;
            progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
            daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        }

        return (
            <div key={field.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={(e) => {
                // Prevent modal trigger if clicking buttons
                if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                    setSelectedFieldId(field.id);
                }
            }}>
                <div className={`h-2 ${field.status === 'Planted' ? 'bg-green-500' : field.status === 'Preparation' ? 'bg-yellow-500' : 'bg-orange-300'}`}></div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Map size={16} className="text-gray-400" />
                                {field.name}
                            </h3>
                            <p className="text-xs text-gray-500">{field.size} Ha • {field.soilType}</p>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${field.status === 'Planted' ? 'bg-green-100 text-green-700' :
                            field.status === 'Preparation' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-orange-100 text-orange-700'
                            }`}>
                            {field.status}
                        </span>
                    </div>

                    {field.status === 'Planted' && cycle && crop ? (
                        <div className="bg-green-50/50 rounded-lg p-3 border border-green-50 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                    <Sprout size={14} className="text-ecomattGreen" /> {crop.name}
                                </span>
                                <span className="text-xs text-green-600 font-bold">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                <div className="bg-ecomattGreen h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>Planted: {cycle.plantingDate}</span>
                                <span>Harvest: {daysLeft > 0 ? `${daysLeft} days left` : 'Ready!'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center border-dashed border border-gray-200">
                            <p className="text-xs text-gray-400">Field is currently fallow</p>
                        </div>
                    )}

                    <div className="flex gap-2 mt-2">
                        {field.status !== 'Planted' ? (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsPlanting(field.id); }}
                                    className="flex-1 bg-ecomattBlack text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition"
                                >
                                    Plant Crop
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onUpdateFieldStatus(field.id, field.status === 'Fallow' ? 'Preparation' : 'Fallow'); }}
                                    className="px-3 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition"
                                >
                                    {field.status === 'Fallow' ? <Tractor size={14} /> : 'Set Fallow'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); cycle && setIsHarvesting(cycle.id); }}
                                className="flex-1 bg-ecomattGreen text-white text-xs font-bold py-2 rounded-lg hover:bg-green-600 transition shadow-sm shadow-green-200"
                            >
                                Record Harvest
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsLoggingActivity(field.id); }}
                            className="px-3 bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-100 transition"
                            title="Log Activity"
                        >
                            <ClipboardList size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNavigateToPrecision?.(field.id); }}
                            className="px-3 bg-green-50 text-ecomattGreen text-xs font-bold py-2 rounded-lg hover:bg-green-100 transition"
                            title="Precision Analysis"
                        >
                            <Satellite size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    {selectedFieldId ? (
                        <button onClick={() => setSelectedFieldId(null)} className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-1">
                            <i className="fas fa-arrow-left"></i> Back to Fields
                        </button>
                    ) : null}
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sprout className="w-6 h-6 text-ecomattGreen" />
                        {selectedFieldId ? `Field Activity: ${fields.find(f => f.id === selectedFieldId)?.name}` : 'Crop Management'}
                    </h2>
                    <p className="text-sm text-gray-500">Monitor fields, crop cycles, and harvests</p>
                </div>
                {!selectedFieldId && (
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['Overview', 'Fields', 'Harvests'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-ecomattBlack text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Default View (No Field Selected) */}
            {!selectedFieldId && (
                <>
                    {/* Overview Stats */}
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Map size={20} /></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Total Area</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{totalArea} <span className="text-sm text-gray-400">Ha</span></h3>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Sprout size={20} /></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Planted</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{plantedArea} <span className="text-sm text-gray-400">Ha</span></h3>
                                <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                                    <div className="bg-green-500 h-1 rounded-full" style={{ width: `${(plantedArea / totalArea) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Tractor size={20} /></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">In Prep</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{preparationArea} <span className="text-sm text-gray-400">Ha</span></h3>
                            </div>
                        </div>
                    )}

                    {/* Field Grid */}
                    {activeTab !== 'Harvests' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fields.map(renderFieldCard)}
                        </div>
                    )}
                </>
            )}

            {!selectedFieldId && activeTab === 'Harvests' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Field</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Crop</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Yield</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cycles.filter(c => c.status === 'Harvested').length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">No harvest records found.</td>
                                </tr>
                            ) : (
                                cycles.filter(c => c.status === 'Harvested').map(cycle => (
                                    <tr key={cycle.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-sm font-bold text-gray-900">{cycle.harvestDate || '-'}</td>
                                        <td className="p-4 text-sm text-gray-600">{fields.find(f => f.id === cycle.fieldId)?.name}</td>
                                        <td className="p-4 text-sm text-gray-600">{crops.find(c => c.id === cycle.cropId)?.name}</td>
                                        <td className="p-4 text-sm font-bold text-ecomattGreen">{cycle.yieldAmount} Tonnes</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${cycle.yieldQuality === 'Grade A' ? 'bg-green-100 text-green-700' :
                                                cycle.yieldQuality === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {cycle.yieldQuality}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Field Details View (Activity Timeline) */}

            {selectedFieldId && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right duration-300">
                    {/* Left: Field Summary */}
                    <div className="lg:col-span-1 space-y-4">
                        {renderFieldCard(fields.find(f => f.id === selectedFieldId)!)}

                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 mb-3">Quick Actions</h4>
                            <button
                                onClick={() => setIsLoggingActivity(selectedFieldId)}
                                className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                            >
                                <ClipboardList size={18} /> Log Activity
                            </button>
                        </div>
                    </div>

                    {/* Right: Activity Timeline */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Activity Log</h3>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-bold">{fieldActivities.length} Records</span>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {fieldActivities.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400">
                                        <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>No activities recorded yet.</p>
                                        <p className="text-xs">Log weeding, spraying, or observations.</p>
                                    </div>
                                ) : (
                                    fieldActivities.map(activity => (
                                        <div key={activity.id} className="p-4 hover:bg-gray-50 transition flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${activity.type === 'Pest Control' ? 'bg-red-500' :
                                                    activity.type === 'Fertilizer' ? 'bg-blue-500' :
                                                        activity.type === 'Harvest' ? 'bg-green-600' :
                                                            'bg-gray-400'
                                                    }`}>
                                                    {activity.type === 'Pest Control' ? <i className="fas fa-bug"></i> :
                                                        activity.type === 'Fertilizer' ? <i className="fas fa-fill-drip"></i> :
                                                            <i className="fas fa-clipboard"></i>}
                                                </div>
                                                <div className="h-full w-px bg-gray-200 my-2"></div>
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-bold text-gray-800">{activity.type}</h4>
                                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} /> {activity.date}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                                {activity.cost > 0 && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                                        <DollarSign size={10} /> -${activity.cost}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Planting Modal */}
            {isPlanting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Plant New Crop</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Select Crop</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    value={selectedCrop}
                                    onChange={e => setSelectedCrop(e.target.value)}
                                >
                                    <option value="">-- Choose Crop --</option>
                                    {crops.map(c => <option key={c.id} value={c.id}>{c.name} ({c.variety}) - {c.daysToMaturity} days</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Planting Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    value={plantDate}
                                    onChange={e => setPlantDate(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => setIsPlanting(null)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button onClick={handlePlantSubmit} className="flex-1 py-3 text-sm font-bold bg-ecomattGreen text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-600">Start Cycle</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Harvest Modal */}
            {isHarvesting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Record Harvest</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Quantity (Tonnes)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    value={harvestQty}
                                    onChange={e => setHarvestQty(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Destination</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setHarvestDest('Market')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border ${harvestDest === 'Market' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600'}`}
                                    >
                                        Market
                                    </button>
                                    <button
                                        onClick={() => setHarvestDest('FeedInventory')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border ${harvestDest === 'FeedInventory' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-gray-200 text-gray-600'}`}
                                    >
                                        Feed Stock
                                    </button>
                                </div>
                            </div>

                            {harvestDest === 'FeedInventory' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Feed Type</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                        value={feedType}
                                        onChange={e => setFeedType(e.target.value)}
                                    >
                                        <option value="Maize">Maize (Grain)</option>
                                        <option value="Soya">Soya Beans</option>
                                        <option value="Sunflower">Sunflower</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <p className="text-[10px] text-amber-600 mt-1">Hasvest will be added to Feed Inventory.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Quality Grade</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    value={harvestQuality}
                                    onChange={e => setHarvestQuality(e.target.value)}
                                >
                                    <option>Grade A</option>
                                    <option>Grade B</option>
                                    <option>Grade C</option>
                                    <option>Rejected</option>
                                </select>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => setIsHarvesting(null)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button onClick={handleHarvestSubmit} className="flex-1 py-3 text-sm font-bold bg-ecomattBlack text-white rounded-xl hover:bg-gray-800">Complete Cycle</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Activity Modal */}
            {isLoggingActivity && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Log Activity</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Activity Type</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    value={activityType}
                                    onChange={e => setActivityType(e.target.value as any)}
                                >
                                    <option value="Scouting">Daily Scouting</option>
                                    <option value="Fertilizer">Fertilizer Application</option>
                                    <option value="Pest Control">Pest Control / Spraying</option>
                                    <option value="Irrigation">Irrigation</option>
                                    <option value="Land Prep">Land Preparation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description (Notes)</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    rows={2}
                                    placeholder="e.g. Applied Urea @ 50kg/ha"
                                    value={activityDesc}
                                    onChange={e => setActivityDesc(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Cost (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        className="w-full p-3 pl-6 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                        placeholder="0.00"
                                        value={activityCost}
                                        onChange={e => setActivityCost(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">If set, this creates an Expense record.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-ecomattGreen"
                                    value={activityDate}
                                    onChange={e => setActivityDate(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => setIsLoggingActivity(null)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button onClick={handleActivitySubmit} className="flex-1 py-3 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700">Save Log</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropManager;
