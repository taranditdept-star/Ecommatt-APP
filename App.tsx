
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PigManager from './components/PigManager';
import PigForm from './components/PigForm';
import PigProfile from './components/PigProfile';
import Operations from './components/Operations';
import FeedLogger from './components/FeedLogger';
import FeedFormulator from './components/FeedFormulator';
import CalendarView from './components/CalendarView';
import CropManager from './components/CropManager';
import MachineryManager from './components/MachineryManager';
import CostCenters from './components/CostCenters';
import StaffManager from './components/StaffManager';
import Finance from './components/Finance';
import FinanceLogger from './components/FinanceLogger';
import BatchProfitability from './components/BatchProfitability';
import ProfitCalculator from './components/ProfitCalculator';
import CashFlowForecast from './components/CashFlowForecast';
import BudgetAnalysis from './components/BudgetAnalysis';
import LoanManagement from './components/LoanManagement';
import CostAnalysis from './components/CostAnalysis';
import FinancialRatios from './components/FinancialRatios';
import TaxCalculator from './components/TaxCalculator';
import VetMedicalSuite from './components/VetMedicalSuite';
import IntelligentCore from './components/IntelligentCore';
import BreedingAI from './components/BreedingAI';
import SlaughterOptimizer from './components/SlaughterOptimizer';
import CriticalWatch from './components/CriticalWatch';
import SmartAssistant from './components/SmartAssistant';
import Login from './components/Login';
import Settings from './components/Settings';
import EmailAlertsSetup from './components/EmailAlertsSetup';
import Onboarding from './components/Onboarding';
import Signup from './components/Signup';
import Verification from './components/Verification';
import BiosecurityFeatures from './components/BiosecurityFeatures';
import PrecisionAgSuite from './components/PrecisionAgSuite';
import WorkforceHub from './components/WorkforceHub';
import AutomationManager from './components/AutomationManager';
import LogisticsOptimizer from './components/LogisticsOptimizer';
import WholesalePortal from './components/WholesalePortal';
import InventoryQRScanner from './components/InventoryQRScanner';
import LineageExplorer from './components/LineageExplorer';
import EnergyDashboard from './components/EnergyDashboard';
import ProcurementAdvisor from './components/ProcurementAdvisor';
import { sendVerificationEmail, sendWelcomeEmail } from './services/emailService';
import CRM from './components/CRM';
import ZimIntelligence from './components/ZimIntelligence';
import FarmPOS from './components/FarmPOS';
import PrecisionFeeding from './components/PrecisionFeeding';
import FarrowingWatch from './components/FarrowingWatch';
import { Pig, Task, PigStatus, PigStage, FeedInventory, HealthRecord, FinanceRecord, BudgetRecord, LoanRecord, ViewState, User, UserRole, TimelineEvent, NotificationConfig, MedicalItem, Product, CartItem, Field, Crop, CropCycle, CropActivity, Asset, MaintenanceLog, FuelLog, TimesheetLog, AttendanceLog, PerformanceScore, PieceRateEarning, VisitorLogEntry, KnowledgeDoc, Protocol, Customer, Order, Invoice, ExchangeRate, Currency, LogisticsRoute, WholesaleProduct, InventoryScan, SolarSystemStatus, SupplierQuote, PenMovement, InfectionAlert } from './types';
import { loadData, saveData, STORAGE_KEYS } from './services/storageService';
import { supabaseService } from './services/supabaseService';
import { supabase } from './lib/supabase';

// Mock Data (Used as initial seed only)
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const SEED_PIGS: Pig[] = [
    {
        id: '1',
        tagId: 'EF-8842',
        breed: 'Large White',
        dob: '2023-01-15',
        gender: 'Female',
        stage: PigStage.Sow,
        status: PigStatus.Pregnant,
        penLocation: 'Pen 3B',
        weight: 210,
        imageUrl: '',
        sireId: 'LW-900',
        damId: 'LW-330',
        lastFed: 'Today 08:00 AM',
        timeline: [
            { id: 'e1', date: '2025-11-20', title: 'Routine Checkup', subtitle: 'Weight check', color: 'green', status: 'Pending' },
            { id: 'e2', date: '2025-11-10', title: 'Artificial Insemination', subtitle: 'Service 1 • Boar: #D-900', color: 'yellow', status: 'Completed' },
            { id: 'e3', date: '2025-10-15', title: 'Weaning (Litter 3)', subtitle: '10 Piglets • Moved to Pen 2', color: 'blue', status: 'Completed' }
        ]
    },
    { id: '2', tagId: 'EF-9001', breed: 'Duroc', dob: '2023-02-20', gender: 'Male', stage: PigStage.Boar, status: PigStatus.Active, penLocation: 'Pen 1A', weight: 210, sireId: 'D-100', damId: 'D-055', lastFed: 'Today 07:45 AM' },
    { id: '7', tagId: 'EF-007', breed: 'Large White', dob: '2025-05-20', gender: 'Female', stage: PigStage.Finisher, status: PigStatus.Active, penLocation: 'Pen F2', weight: 85, lastFed: 'Today 10:00 AM' },
    { id: '8', tagId: 'EF-008', breed: 'Large White', dob: '2025-05-20', gender: 'Male', stage: PigStage.Finisher, status: PigStatus.Active, penLocation: 'Pen F2', weight: 88, lastFed: 'Today 10:00 AM' },
];

const SEED_TASKS: Task[] = [
    { id: 't1', title: 'Administer Iron', dueDate: today, priority: 'High', status: 'Pending', type: 'Health', description: 'Batch #204 needs Iron Dextran' },
    { id: 't2', title: 'Pregnancy Scan', dueDate: yesterday, priority: 'Low', status: 'Completed', type: 'Health', description: 'Check sow 104' },
    { id: 't3', title: 'Order Grower Pellets', dueDate: tomorrow, priority: 'Medium', status: 'Pending', type: 'General', description: 'Low stock' },
    { id: 't4', title: 'Pen Cleaning Routine', dueDate: today, priority: 'Medium', status: 'Pending', type: 'Cleaning', description: 'Pressure wash' },
    { id: 't5', title: 'Market Weight Check', dueDate: tomorrow, priority: 'High', status: 'Pending', type: 'General', description: 'Sort finishers' },
];

const SEED_FEEDS: FeedInventory[] = [
    { id: 'f1', name: 'Sow Meal', type: 'Meal', quantityKg: 450, reorderLevel: 200, lastRestock: 'Nov 1' },
    { id: 'f2', name: 'Grower Pellets', type: 'Pellets', quantityKg: 150, reorderLevel: 300, lastRestock: 'Oct 20' },
    { id: 'f3', name: 'Creep Feed', type: 'Crumble', quantityKg: 80, reorderLevel: 50, lastRestock: 'Nov 10' },
];

const SEED_HEALTH: HealthRecord[] = [
    { id: 'h1', pigId: 'EF-003', date: 'Nov 20', type: 'Treatment', description: 'Swine Flu', medication: 'Oxytetracycline', administeredBy: 'Sarah' },
    { id: 'h2', pigId: 'EF-8842', date: 'Nov 15', type: 'Vaccination', description: 'Parvo', administeredBy: 'John' },
];

const SEED_FINANCE: FinanceRecord[] = [
    { id: 'fin1', date: '2025-11-15', type: 'Income', category: 'Sales', amount: 1200, description: 'Pork Sales Batch #21', batchId: 'Batch #21', status: 'Paid' },
    { id: 'fin2', date: '2025-11-10', type: 'Expense', category: 'Supplies', amount: 150, description: 'Vet Supplies', status: 'Paid' },
    { id: 'fin3', date: '2025-11-05', type: 'Expense', category: 'Feed', amount: 450, description: 'Sow Meal Bulk', status: 'Paid' },
    // Scheduled Transactions for Forecasting
    { id: 'sched1', date: new Date(Date.now() + (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], type: 'Expense', category: 'Feed', amount: 800, description: 'Bulk Feed Order', status: 'Scheduled' },
    { id: 'sched2', date: new Date(Date.now() + (25 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], type: 'Expense', category: 'Labor', amount: 1200, description: 'Monthly Wages', status: 'Scheduled' },
];

const SEED_BUDGETS: BudgetRecord[] = [
    { id: 'b1', category: 'Feed', amount: 1000, period: 'Monthly' },
    { id: 'b2', category: 'Labor', amount: 1500, period: 'Monthly' },
    { id: 'b3', category: 'Supplies', amount: 300, period: 'Monthly' },
    { id: 'b4', category: 'Maintenance', amount: 200, period: 'Monthly' },
];

const SEED_LOANS: LoanRecord[] = [
    {
        id: 'l1',
        lender: 'AgriBank',
        principal: 5000,
        interestRate: 12,
        startDate: '2025-01-01',
        termMonths: 12,
        balance: 4200,
        monthlyPayment: 450,
        nextPaymentDate: '2025-12-01',
        status: 'Active'
    }
];

// Initial Users
const INITIAL_USERS: User[] = [
    { id: 'u1', name: 'Admin User', email: 'manager@ecomatt.co.zw', role: 'Farm Manager', password: '123456', hasCompletedOnboarding: true },
    { id: 'u2', name: 'Mike Herdsman', email: 'herdsman@ecomatt.co.zw', role: 'Herdsman', password: '123456', hasCompletedOnboarding: true },
    { id: 'u3', name: 'John Doe', email: 'worker@ecomatt.co.zw', role: 'General Worker', password: '123456', hasCompletedOnboarding: true },
    { id: 'u4', name: 'Sarah Vet', email: 'vet@ecomatt.co.zw', role: 'Veterinarian', password: '123456', hasCompletedOnboarding: true },
];

const ROLE_PERMISSIONS: Record<UserRole, ViewState[]> = {
    'Farm Manager': [ViewState.Dashboard, ViewState.Pigs, ViewState.Vet, ViewState.Operations, ViewState.Calendar, ViewState.POS, ViewState.Finance, ViewState.AI_Tools, ViewState.Settings, ViewState.Crops, ViewState.Machinery, ViewState.Staff, ViewState.Biosecurity, ViewState.CRM, ViewState.PrecisionFeeding, ViewState.FarrowingWatch, ViewState.PrecisionAg, ViewState.Workforce, ViewState.Genetics, ViewState.Energy, ViewState.Procurement],
    'Herdsman': [ViewState.Dashboard, ViewState.Pigs, ViewState.Operations, ViewState.Calendar, ViewState.Crops, ViewState.Machinery, ViewState.PrecisionFeeding, ViewState.FarrowingWatch, ViewState.PrecisionAg, ViewState.Workforce, ViewState.Energy],
    'General Worker': [ViewState.Dashboard, ViewState.Operations, ViewState.Calendar, ViewState.POS, ViewState.Crops, ViewState.Biosecurity, ViewState.Workforce],
    'Veterinarian': [ViewState.Dashboard, ViewState.Operations, ViewState.Pigs, ViewState.Vet, ViewState.Calendar, ViewState.AI_Tools, ViewState.Biosecurity, ViewState.Automation, ViewState.PrecisionFeeding, ViewState.FarrowingWatch, ViewState.PrecisionAg, ViewState.Workforce, ViewState.Genetics, ViewState.Energy, ViewState.Procurement]
};

const SEED_VISITORS: VisitorLogEntry[] = [
    { id: 'v1', name: 'Dr. Gusha', company: 'Vet Services', contact: '+263 771 000 000', purpose: 'Vet', checkInTime: '09:00 AM', date: today, status: 'Checked In', visitedOtherFarm: true, sanitized: true, riskLevel: 'High', notes: 'Monthly audit' },
    { id: 'v2', name: 'John Supplier', company: 'FeedCo', contact: '+263 772 000 000', purpose: 'Delivery', checkInTime: '10:30 AM', date: today, status: 'Checked In', visitedOtherFarm: false, sanitized: true, riskLevel: 'Low' },
    { id: 'v3', name: 'Local Buyer', contact: '+263 773 000 000', purpose: 'Other', checkInTime: 'Yesterday 02:00 PM', checkOutTime: '03:00 PM', date: yesterday, status: 'Checked Out', visitedOtherFarm: false, sanitized: false, riskLevel: 'Low' }
];

const SEED_PROTOCOLS: Protocol[] = [
    {
        id: 'p1',
        name: 'New Piglet Batch Protocol',
        triggerType: 'Event',
        triggerEvent: 'Sow_Farrowed',
        active: true,
        templates: [
            { id: 't1', title: 'Iron Injection', type: 'Health', priority: 'High', daysAfterTrigger: 3, checklist: ['Prepare Iron Dextran', 'Inject 1ml/piglet'], verificationMethod: 'None' },
            { id: 't2', title: 'Tail Docking', type: 'Health', priority: 'Medium', daysAfterTrigger: 4, checklist: ['Sanitize Cutter', 'Dock Tails', 'Apply Iodine'], verificationMethod: 'None' }
        ]
    }
];

const SEED_DOCS: KnowledgeDoc[] = [
    { id: '1', title: 'Biosecurity Protocol v2.4', category: 'SOPs', type: 'PDF', size: '2.4 MB', uploadDate: '2025-11-20', addedBy: 'Admin' },
    { id: '2', title: 'Visitor Entry Policy', category: 'SOPs', type: 'PDF', size: '1.1 MB', uploadDate: '2025-11-15', addedBy: 'Admin' },
    { id: '3', title: 'Tractor JD-550 Service Manual', category: 'Manuals', type: 'PDF', size: '15 MB', uploadDate: '2025-05-10', addedBy: 'Manager' },
    { id: '4', title: 'Vaccination Schedule 2025', category: 'Health', type: 'XLSX', size: '0.4 MB', uploadDate: '2025-12-01', addedBy: 'Vet' }
];


const SEED_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Downtown Butchery', type: 'Wholesale', contact: '0771234567', balance: 450, email: 'orders@downtown.co.zw' },
    { id: 'c2', name: 'Mama Sarah Kitchen', type: 'Restaurant', contact: '0779876543', balance: 0, email: 'sarah@kitchen.co.zw' },
    { id: 'c3', name: 'John Doe (Local)', type: 'Individual', contact: '0712345678', balance: 30 }
];

const SEED_ORDERS: Order[] = [
    { id: 'o1', customerId: 'c1', date: '2025-12-01', status: 'Delivered', items: [{ id: 'p1', name: 'Pork Chops', price: 6.50, unit: 'kg', category: 'Pork', quantity: 100 }], totalAmount: 650, paymentStatus: 'Partial', invoiceId: 'inv1' },
    { id: 'o2', customerId: 'c2', date: '2025-12-15', status: 'Confirmed', items: [{ id: 'p3', name: 'Sausages', price: 5.00, unit: 'kg', category: 'Pork', quantity: 20 }], totalAmount: 100, paymentStatus: 'Unpaid' }
];

const SEED_INVOICES: Invoice[] = [
    { id: 'inv1', orderId: 'o1', customerId: 'c1', issueDate: '2025-12-01', dueDate: '2025-12-15', totalAmount: 650, paidAmount: 200, status: 'Overdue' }
];

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>(ViewState.Dashboard);
    const [subView, setSubView] = useState<string | null>(null);

    // Zimbabwe Strategy State
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
        pair: 'USD/ZiG',
        rate: 28.5,
        lastUpdated: new Date().toLocaleTimeString()
    });

    // Auth Flow State
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [pendingUser, setPendingUser] = useState<any>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [pigsLog, tasksLog, feedsLog, financeLog] = await Promise.all([
                    supabaseService.pigs.getAll(),
                    supabaseService.tasks.getAll(),
                    supabaseService.feeds.getAll(),
                    supabaseService.finance.getAll()
                ]);

                setPigs(pigsLog);
                setTasks(tasksLog);
                setFeeds(feedsLog);
                setFinanceRecords(financeLog);

                // Fetch profiles (users)
                const profiles = await supabaseService.profiles.get();
                setUsers(profiles);

            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setIsAuthenticated(true);
                // Fetch or create profile
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();

                if (profile) {
                    setCurrentUser(profile as User);
                    if (!profile.has_completed_onboarding) {
                        setShowOnboarding(true);
                    }
                } else {
                    // Create basic profile if missing (optional, usually handled by trigger)
                    const newProfile = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata.name,
                        role: session.user.user_metadata.role || 'General Worker',
                        has_completed_onboarding: false
                    };
                    await supabase.from('profiles').insert([newProfile]);
                    setCurrentUser(newProfile as User);
                    setShowOnboarding(true);
                }
                fetchData();
            } else {
                setIsAuthenticated(false);
                setCurrentUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Data State - Initialize empty, will fetch from Supabase
    const [pigs, setPigs] = useState<Pig[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [feeds, setFeeds] = useState<FeedInventory[]>([]);
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
    const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);
    const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
    const [loans, setLoans] = useState<LoanRecord[]>([]);
    const [users, setUsers] = useState<User[]>([]);


    const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => );
    const [medicalInventory, setMedicalInventory] = useState<MedicalItem[]>(() => );

    // Seed Products
    const [products] = useState<Product[]>([
        { id: 'p1', name: 'Pork Chops', category: 'Pork', price: 6.50, unit: 'kg', inStock: true },
        { id: 'p2', name: 'Pork Belly', category: 'Pork', price: 8.00, unit: 'kg', inStock: true },
        { id: 'p3', name: 'Sausages (Traditional)', category: 'Pork', price: 5.00, unit: 'kg', inStock: true },
        { id: 'p4', name: 'Piglet (Weaner)', category: 'Live Animal', price: 45.00, unit: 'unit', inStock: true },
        { id: 'p5', name: 'Pig Manure (Compost)', category: 'Manure', price: 2.00, unit: 'bag', inStock: true },
    ]);

    // Crop State
    const [fields, setFields] = useState<Field[]>(() => );

    const [crops] = useState<Crop[]>([
        { id: 'c1', name: 'Maize', variety: 'SC727', type: 'Cereal', daysToMaturity: 120, expectedYieldPerHa: 8 },
        { id: 'c2', name: 'Sugar Beans', variety: 'NUA45', type: 'Legume', daysToMaturity: 90, expectedYieldPerHa: 2 },
        { id: 'c3', name: 'Tomatoes', variety: 'Rodade', type: 'Vegetable', daysToMaturity: 75, expectedYieldPerHa: 40 },
        { id: 'c4', name: 'Cabbages', variety: 'Fabian', type: 'Vegetable', daysToMaturity: 85, expectedYieldPerHa: 60 }
    ]);

    const [cropCycles, setCropCycles] = useState<CropCycle[]>(() => );
    const [cropActivities, setCropActivities] = useState<CropActivity[]>(() => );
    const [precisionSelectedFieldId, setPrecisionSelectedFieldId] = useState<string | null>(null);

    const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => );

    const [performanceScores, setPerformanceScores] = useState<PerformanceScore[]>(() => );

    const [pieceRateEarnings, setPieceRateEarnings] = useState<PieceRateEarning[]>(() => );

    // Machinery State
    const [assets, setAssets] = useState<Asset[]>(() => );
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => );
    const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => );

    const [timesheets, setTimesheets] = useState<TimesheetLog[]>(() => );

    // Manure State
    const [manureStock, setManureStock] = useState<number>(() => );

    // Biosecurity & Automation State
    const [visitorLogs, setVisitorLogs] = useState<VisitorLogEntry[]>(() => );
    const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>(() => );
    const [protocols, setProtocols] = useState<Protocol[]>(() => );

    // CRM State
    const [customers, setCustomers] = useState<Customer[]>(() => );
    const [orders, setOrders] = useState<Order[]>(() => );
    const [invoices, setInvoices] = useState<Invoice[]>(() => );

    // Logistics & Supply Chain State
    const [logisticsRoutes, setLogisticsRoutes] = useState<LogisticsRoute[]>(() => );

    // Biosecurity Tracing State
    const [penMovements, setPenMovements] = useState<PenMovement[]>(() => );

    const [infectionAlerts, setInfectionAlerts] = useState<InfectionAlert[]>(() => ', severity: 'Critical', detectedAt: today, status: 'Active' }
    ]));

    const [wholesaleProducts] = useState<WholesaleProduct[]>([
        { id: 'wp1', name: 'Premium Pork (Sides)', category: 'Pork', availableQty: 120, unit: 'kg', pricePerUnit: 4.5, qualityGrade: 'A' },
        { id: 'wp2', name: 'Bulk White Maize', category: 'Grain', availableQty: 5000, unit: 'kg', pricePerUnit: 0.38, qualityGrade: 'B', expectedHarvestDate: '2025-12-28' },
        { id: 'wp3', name: 'Fresh Sugar Beans', category: 'Grain', availableQty: 850, unit: 'kg', pricePerUnit: 1.2, qualityGrade: 'A' }
    ]);

    const [inventoryScans, setInventoryScans] = useState<InventoryScan[]>(() => );

    // Multi-Currency & Procurement State
    const [supplierQuotes] = useState<SupplierQuote[]>(() => );

    const [marketRates] = useState<Record<string, number>>({
        'ZiG': 28.5,
        'ZAR': 19.2
    });

    const [solarStatus, setSolarStatus] = useState<SolarSystemStatus>(() => );

    



    // Crop Handlers
    const handlePlantField = (fieldId: string, cropId: string, date: string) => {
        const crop = crops.find(c => c.id === cropId);
        if (!crop) return;

        const expectedHarvest = new Date(new Date(date).getTime() + (crop.daysToMaturity * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

        const newCycle: CropCycle = {
            id: `cycle-${Date.now()}`,
            fieldId,
            cropId,
            plantingDate: date,
            expectedHarvestDate: expectedHarvest,
            status: 'Active'
        };

        setCropCycles([...cropCycles, newCycle]);
        setFields(fields.map(f => f.id === fieldId ? { ...f, status: 'Planted', currentCropId: newCycle.id } : f));
    };

    const handleUpdateFieldStatus = (fieldId: string, status: 'Fallow' | 'Preparation') => {
        setFields(fields.map(f => f.id === fieldId ? { ...f, status } : f));
    };

    const handleHarvestCrop = (cycleId: string, date: string, quantity: number, quality: string, destination: 'Market' | 'FeedInventory', feedType?: string) => {
        // 1. Update Cycle
        setCropCycles(cropCycles.map(c => c.id === cycleId ? {
            ...c,
            status: 'Harvested',
            harvestDate: date,
            yieldAmount: quantity,
            yieldQuality: quality,
            destination: destination,
            feedTypeId: feedType
        } : c));

        // 2. Free Field
        const cycle = cropCycles.find(c => c.id === cycleId);
        if (cycle) {
            setFields(fields.map(f => f.id === cycle.fieldId ? { ...f, status: 'Fallow', currentCropId: undefined } : f));
        }

        // 3. Handle Destination
        if (destination === 'Market') {
            // Record Finance Income (Estimated)
            handleSaveTransaction({
                date,
                type: 'Income',
                category: 'Crop Sales',
                amount: quantity * 100, // Dummy pricing logic
                description: `Harvest: ${quantity} tons (Quality: ${quality})`,
                status: 'Projected'
            });
        } else if (destination === 'FeedInventory' && feedType) {
            // Convert Tonnes to Kg
            const quantityKg = quantity * 1000;

            // Update or Add to Feed Inventory
            const existingFeed = feeds.find(f => f.name.toLowerCase().includes(feedType.toLowerCase()));

            if (existingFeed) {
                setFeeds(feeds.map(f => f.id === existingFeed.id ? { ...f, quantityKg: f.quantityKg + quantityKg, lastRestock: date } : f));
                alert(`Added ${quantityKg}kg to ${existingFeed.name} inventory.`);
            } else {
                const newFeed: FeedInventory = {
                    id: `feed-${Date.now()}`,
                    name: `${feedType} (Harvest)`,
                    type: 'Grain',
                    quantityKg: quantityKg,
                    reorderLevel: 100,
                    lastRestock: date
                };
                setFeeds([...feeds, newFeed]);
                alert(`Created new feed: ${newFeed.name} with ${quantityKg}kg.`);
            }
        }
    };

    

    // Navigation State for Pig Module
    const [selectedPig, setSelectedPig] = useState<Pig | null>(null);
    const [isAddingPig, setIsAddingPig] = useState(false);
    const [isEditingPig, setIsEditingPig] = useState(false);

    // Operations Navigation State
    const [operationsInitialTab, setOperationsInitialTab] = useState<'Tasks' | 'Feed' | 'Pharmacy' | undefined>(undefined);
    const [operationsPigFilter, setOperationsPigFilter] = useState<string | undefined>(undefined);
    const [operationsSubView, setOperationsSubView] = useState<'None' | 'FeedLogger' | 'FeedFormulator'>('None');

    // Finance Navigation State
    // Finance Navigation State
    const [financeSubView, setFinanceSubView] = useState<'None' | 'Logger' | 'Batch' | 'Calculator' | 'Forecast' | 'Budget' | 'Loans' | 'CostAnalysis' | 'Ratios' | 'CostCenters' | 'Tax'>('None');

    // Intelligent Core Navigation State
    const [intelligentSubView, setIntelligentSubView] = useState<'None' | 'Breeding' | 'Optimizer' | 'Critical' | 'Chat'>('None');

    // Settings Navigation State
    const [settingsSubView, setSettingsSubView] = useState<'None' | 'EmailSetup'>('None');

    // Auth & User State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loginError, setLoginError] = useState('');

    // Handlers
    const handleLogin = async (email: string, password?: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: password || '',
        });

        if (error) {
            setLoginError(error.message);
            setIsLoading(false);
        } else {
            setLoginError('');
            // Auth state listener handles the rest
        }
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        if (currentUser) {
            const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
            setCurrentUser(updatedUser);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
    };

    // Signup Handlers
    const handleSignupSubmit = async (formData: any) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    role: formData.role
                }
            }
        });

        if (error) {
            alert(error.message);
            setIsLoading(false);
        } else {
            alert("Signup successful! Please check your email for verification.");
            setIsSigningUp(false);
            setIsLoading(false);
        }
    };

    // Removed handleVerificationSuccess as Supabase handles email verification

    // Automation Trigger Helper
    const checkAutomationTriggers = (eventName: string, context: any) => {
        const activeProtocols = protocols.filter(p => p.active && p.triggerType === 'Event' && p.triggerEvent === eventName);

        activeProtocols.forEach(protocol => {
            const newTasks = protocol.templates.map(template => {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + template.daysAfterTrigger);

                return {
                    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: template.title,
                    type: template.type,
                    status: 'Pending' as const,
                    priority: template.priority,
                    dueDate: dueDate.toISOString().split('T')[0],
                    description: `Auto-generated by protocol: ${protocol.name}. ${template.description || ''}`,
                    checklist: template.checklist?.map((item, idx) => ({ id: `cl-${idx}`, text: item, completed: false })),
                    verificationMethod: template.verificationMethod
                };
            });

            if (newTasks.length > 0) {
                setTasks(prev => [...newTasks, ...prev]);
                alert(`⚡ Automation: Generated ${newTasks.length} tasks from "${protocol.name}"`);
            }
        });
    };

    // Pig Management Handlers
    const handleSaveNewPig = async (newPig: Pig) => {
        try {
            const savedPig = await supabaseService.pigs.create(newPig);
            setPigs([...pigs, savedPig]);
            setIsAddingPig(false);

            // Trigger Automation
            if (savedPig.stage === PigStage.Piglet) {
                checkAutomationTriggers('Sow_Farrowed', { pigId: savedPig.id });
            }
        } catch (error) {
            console.error("Error saving pig:", error);
            alert("Failed to save pig to database.");
        }
    };


    const handleDeletePig = async (id: string) => {
        try {
            await supabaseService.pigs.delete(id);
            setPigs(pigs.filter(p => p.id !== id));
            setSelectedPig(null); // Return to list
        } catch (error) {
            console.error("Error deleting pig:", error);
            alert("Failed to delete pig from database.");
        }
    };

    const handleUpdatePig = async (updatedPig: Pig) => {
        try {
            const savedPig = await supabaseService.pigs.update(updatedPig.id, updatedPig);
            setPigs(pigs.map(p => p.id === savedPig.id ? savedPig : p));
            setSelectedPig(savedPig);
            setIsEditingPig(false);
        } catch (error) {
            console.error("Error updating pig:", error);
            alert("Failed to update pig in database.");
        }
    };

    const handleUpdateTask = async (updatedTask: Task) => {
        try {
            const savedTask = await supabaseService.tasks.update(updatedTask.id, updatedTask);
            setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleNavClick = (view: ViewState, subViewStr?: string) => {
        setCurrentView(view);
        const activeSubView = subViewStr || null;
        setSubView(activeSubView);

        // Reset or Set sub-views when changing main module
        if (view === ViewState.Pigs) {
            if (!activeSubView) {
                setSelectedPig(null);
                setIsAddingPig(false);
                setIsEditingPig(false);
            }
        } else {
            setSelectedPig(null);
            setIsAddingPig(false);
            setIsEditingPig(false);
        }

        if (view === ViewState.Operations) {
            setOperationsSubView(activeSubView as any || 'None');
            if (activeSubView === 'Tasks') setOperationsInitialTab('Tasks');
            if (activeSubView === 'Feed') setOperationsInitialTab('Feed');
            if (activeSubView === 'Pharmacy') setOperationsInitialTab('Pharmacy');
            if (activeSubView === 'Health') setCurrentView(ViewState.Vet);
        } else {
            setOperationsInitialTab(undefined);
            setOperationsPigFilter(undefined);
            setOperationsSubView('None');
        }

        if (view === ViewState.Finance) {
            setFinanceSubView(activeSubView as any || 'None');
        } else {
            setFinanceSubView('None');
        }

        if (view === ViewState.AI_Tools) {
            setIntelligentSubView(activeSubView as any || 'None');
        } else {
            setIntelligentSubView('None');
        }

        if (view === ViewState.Settings) {
            setSettingsSubView(activeSubView as any || 'None');
        } else {
            setSettingsSubView('None');
        }
    };

    // Link to Health Records from Pig Profile
    const handleViewHealthRecords = () => {
        if (selectedPig) {
            setOperationsPigFilter(selectedPig.tagId);
        }
        setCurrentView(ViewState.Vet);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setCurrentView(ViewState.Dashboard);
    };

    const handleAddUser = (newUser: User) => setUsers([...users, newUser]);

    const handleUpdatePassword = (newPassword: string) => {
        if (!currentUser) return;
        const updatedUsers = users.map(u =>
            u.id === currentUser.id ? { ...u, password: newPassword } : u
        );
        setUsers(updatedUsers);
        setCurrentUser({ ...currentUser, password: newPassword });
    };

    const handleSaveNotificationConfig = (config: NotificationConfig) => {
        setNotificationConfig(config);
        setSettingsSubView('None');
        alert("Email & Alert preferences updated.");
    };

    // Feed Handlers
    const handleLogDailyFeed = (data: { feedId: string; quantity: number; pen: string; batch?: string }) => {
        // 1. Deduct stock
        const updatedFeeds = feeds.map(f => {
            if (f.id === data.feedId) {
                return { ...f, quantityKg: Math.max(0, f.quantityKg - data.quantity) };
            }
            return f;
        });
        setFeeds(updatedFeeds);
        setOperationsSubView('None');
        alert(`Feed Logged: ${data.quantity}kg for ${data.pen}`);
    };

    const handleLogManure = (amount: number, date: string) => {
        setManureStock(prev => prev + amount);
        alert(`Logged ${amount}kg of manure. Total Stock: ${manureStock + amount}kg`);
    };

    // Finance Handlers
    const handleSaveTransaction = async (recordData: Omit<FinanceRecord, 'id'>) => {
        try {
            const savedRecord = await supabaseService.finance.create({
                ...recordData,
                status: 'Paid'
            });
            setFinanceRecords([...financeRecords, savedRecord]);
            setFinanceSubView('None');
        } catch (error) {
            console.error("Error saving transaction:", error);
            alert("Failed to save transaction to database.");
        }
    };

    // Medical Inventory Handlers
    const handleSaveMedicalItem = (item: MedicalItem) => {
        if (medicalInventory.some(i => i.id === item.id)) {
            setMedicalInventory(medicalInventory.map(i => i.id === item.id ? item : i));
        } else {
            setMedicalInventory([...medicalInventory, item]);
        }
    };

    const handleDeleteMedicalItem = (id: string) => {
        setMedicalInventory(medicalInventory.filter(i => i.id !== id));
    };

    const handleSaveHealthRecord = (record: HealthRecord) => {
        setHealthRecords(prev => [record, ...prev]);

        // Auto-deduct from Inventory
        if (record.medicalItemId && record.quantityUsed) {
            setMedicalInventory(prev => prev.map(item => {
                if (item.id === record.medicalItemId) {
                    return { ...item, quantity: Math.max(0, item.quantity - (record.quantityUsed || 0)) };
                }
                return item;
            }));
        }
    };


    // POS Handlers
    const handleSaleComplete = (items: CartItem[], total: number, paymentMethod: string) => {
        const description = `POS Sale: ${items.map(i => `${i.name} (x${i.quantity})`).join(', ')}`;
        handleSaveTransaction({
            date: new Date().toISOString().split('T')[0],
            type: 'Income',
            category: 'Sales',
            amount: total,
            description,
            status: 'Paid'
        });
    };

    // GLOBAL QUICK ACTIONS HANDLER
    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'add_pig':
                setCurrentView(ViewState.Pigs);
                setIsAddingPig(true);
                setSelectedPig(null);
                break;

            case 'log_feed':
                setCurrentView(ViewState.Operations);
                setOperationsInitialTab('Feed');
                setOperationsSubView('FeedLogger');
                break;

            case 'log_health':
                setCurrentView(ViewState.Vet);
                break;

            case 'add_task':
                setCurrentView(ViewState.Operations);
                setOperationsInitialTab('Tasks');
                break;

            case 'add_income':
            case 'add_expense':
                setCurrentView(ViewState.Finance);
                setFinanceSubView('Logger');
                break;

            case 'add_user':
                setCurrentView(ViewState.Settings);
                break;

            case 'add_customer':
                setCurrentView(ViewState.CRM);
                // We'd need to trigger the tab/form here, but basic nav is a start
                break;

            case 'add_order':
                setCurrentView(ViewState.CRM);
                // We'd need to trigger the tab/form here
                break;

            default:
                // Fallback
                break;
        }
    };


    const handleLogCropActivity = (activity: CropActivity) => {
        setCropActivities(prev => [...prev, activity]);

        // If cost exists, log expense automatically
        if (activity.cost > 0) {
            handleSaveTransaction({
                date: activity.date,
                type: 'Expense',
                category: 'Crop Input',
                amount: activity.cost,
                description: `${activity.type}: ${activity.description}`,
                status: 'Paid'
            });
        }
    };


    // Machinery Handlers
    const handleAddAsset = (asset: Asset) => {
        setAssets([...assets, asset]);
    };

    const handleLogMaintenance = (log: MaintenanceLog) => {
        setMaintenanceLogs([...maintenanceLogs, log]);

        // Auto Expense
        handleSaveTransaction({
            date: log.date,
            type: 'Expense',
            category: 'Maintenance',
            amount: log.cost,
            description: `Maintenance: ${log.type} on Asset`, // Could lookup name if needed
            status: 'Paid'
        });
    };

    const handleLogFuel = (log: FuelLog) => {
        setFuelLogs([...fuelLogs, log]);

        // Auto Expense
        handleSaveTransaction({
            date: log.date,
            type: 'Expense',
            category: 'Fuel',
            amount: log.cost,
            description: `Fuel: ${log.quantity}L`,
            status: 'Paid'
        });
    };

    const handleLogTime = (log: TimesheetLog) => {
        setTimesheets([...timesheets, log]);
    };

    // Biosecurity Handlers
    const handleCheckInVisitor = (entry: VisitorLogEntry) => {
        setVisitorLogs([entry, ...visitorLogs]);
    };

    const handleCheckOutVisitor = (id: string, time: string) => {
        setVisitorLogs(visitorLogs.map(v => v.id === id ? { ...v, checkOutTime: time, status: 'Checked Out' } : v));
    };

    const handleAddDocument = (doc: KnowledgeDoc) => {
        setKnowledgeDocs([...knowledgeDocs, doc]);
    };

    const handleDeleteDocument = (id: string) => {
        setKnowledgeDocs(knowledgeDocs.filter(d => d.id !== id));
    };

    // Automation Handlers
    const handleSaveProtocol = (protocol: Protocol) => {
        if (protocols.find(p => p.id === protocol.id)) {
            setProtocols(protocols.map(p => p.id === protocol.id ? protocol : p));
        } else {
            setProtocols([...protocols, protocol]);
        }
    };

    const handleToggleProtocol = (id: string) => {
        setProtocols(protocols.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const handleDeleteProtocol = (id: string) => {
        setProtocols(protocols.filter(p => p.id !== id));
    };

    const handleFabClick = () => {
        setCurrentView(ViewState.Pigs);
        setIsAddingPig(true);
    };

    // CRM Handlers
    const handleAddOrder = (order: Order) => {
        setOrders([...orders, order]);
        // Update Customer Balance
        const customer = customers.find(c => c.id === order.customerId);
        if (customer) {
            setCustomers(customers.map(c => c.id === customer.id ? { ...c, balance: c.balance + order.totalAmount, lastOrderDate: order.date } : c));
        }
    };

    const handleAddCustomer = (customer: Customer) => {
        setCustomers([...customers, customer]);
    };

    const handleUpdateOrder = (order: Order) => {
        setOrders(orders.map(o => o.id === order.id ? order : o));
    };

    const handleGenerateInvoice = (order: Order) => {
        const invoice: Invoice = {
            id: `inv-${Date.now()}`,
            orderId: order.id,
            customerId: order.customerId,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days due
            totalAmount: order.totalAmount,
            paidAmount: 0,
            status: 'Sent'
        };
        setInvoices([...invoices, invoice]);

        // Auto-Link to Order
        setOrders(orders.map(o => o.id === order.id ? { ...o, invoiceId: invoice.id } : o));

        // Auto Expense Log (Revenue Recognition) could happen here or on Payment
        handleSaveTransaction({
            date: invoice.issueDate,
            type: 'Income',
            category: 'Sales',
            amount: invoice.totalAmount,
            description: `Invoice ${invoice.id} for Order ${order.id}`,
            status: 'Projected'
        });

        alert(`Invoice Generated: ${invoice.id}`);
    };


    const handleToggleEnergyAsset = (id: string) => {
        setSolarStatus(prev => {
            const updatedAssets = prev.assets.map(a =>
                a.id === id ? { ...a, status: a.status === 'Active' ? 'Shed' as any : 'Active' as any } : a
            );
            const newLoad = updatedAssets.reduce((sum, a) => sum + (a.status === 'Active' ? a.powerDrawKw : 0), 0);
            const updated = { ...prev, assets: updatedAssets, currentLoadKw: newLoad };
            saveData('ECOMATT_SOLAR', updated);
            return updated;
        });
    };

    const handleLogMovement = (movement: Partial<PenMovement>) => {
        const newMovement: PenMovement = {
            id: `move-${Date.now()}`,
            userId: currentUser?.id || 'unknown',
            userName: currentUser?.name || 'Unknown User',
            penId: movement.penId || 'unknown',
            penName: movement.penName || 'Unknown Pen',
            timestamp: new Date().toISOString(),
            type: movement.type || 'In',
            sanitized: movement.sanitized || false,
        };
        setPenMovements(prev => [newMovement, ...prev]);
    };

    const renderContent = () => {
        if (!currentUser) return null;
        const allowedViews = ROLE_PERMISSIONS[currentUser.role] || [];

        if (!allowedViews.includes(currentView)) {
            return <div className="p-8 text-center text-gray-500">Access Restricted</div>;
        }

        switch (currentView) {
            case ViewState.Dashboard:
                return <Dashboard
                    pigs={pigs}
                    tasks={tasks}
                    financeRecords={financeRecords}
                    feeds={feeds}
                    fields={fields}
                    cropCycles={cropCycles}
                    assets={assets}
                    onViewChange={handleNavClick}
                />;

            case ViewState.Pigs:
                if (isAddingPig) {
                    return <PigForm onSave={handleSaveNewPig} onCancel={() => setIsAddingPig(false)} />;
                }
                if (isEditingPig && selectedPig) {
                    return <PigForm
                        initialData={selectedPig}
                        onSave={handleUpdatePig}
                        onCancel={() => setIsEditingPig(false)}
                    />;
                }
                if (selectedPig) {
                    return <PigProfile
                        pig={selectedPig}
                        allPigs={pigs}
                        onBack={() => setSelectedPig(null)}
                        onDelete={handleDeletePig}
                        onUpdate={handleUpdatePig}
                        onEdit={() => setIsEditingPig(true)}
                        onViewHealth={handleViewHealthRecords}
                    />;
                }
                return <PigManager
                    pigs={pigs}
                    onAddPigClick={() => setIsAddingPig(true)}
                    onSelectPig={setSelectedPig}
                />;

            case ViewState.Operations:
                if (operationsSubView === 'FeedLogger') {
                    return <FeedLogger feeds={feeds} onSave={handleLogDailyFeed} onCancel={() => setOperationsSubView('None')} />;
                }
                if (operationsSubView === 'FeedFormulator') {
                    return <FeedFormulator onCancel={() => setOperationsSubView('None')} />;
                }
                return <Operations
                    pigs={pigs}
                    feeds={feeds}
                    healthRecords={healthRecords}
                    tasks={tasks}
                    initialTab={operationsInitialTab}
                    pigFilter={operationsPigFilter}
                    onOpenFeedLogger={() => setOperationsSubView('FeedLogger')}
                    onOpenFeedFormulator={() => setOperationsSubView('FeedFormulator')}
                    onOpenVetSuite={() => handleNavClick(ViewState.Vet)}
                    medicalItems={medicalInventory}
                    onSaveMedicalItem={handleSaveMedicalItem}
                    onDeleteMedicalItem={handleDeleteMedicalItem}
                    onSaveHealthRecord={handleSaveHealthRecord}
                    onLogManure={handleLogManure}
                    onUpdateTask={handleUpdateTask}
                />;

            case ViewState.Finance:
                if (financeSubView === 'Logger') {
                    return <FinanceLogger
                        onSave={handleSaveTransaction}
                        onCancel={() => setFinanceSubView('None')}
                        fields={fields}
                        assets={assets}
                    />;
                }
                if (financeSubView === 'Batch') {
                    return <BatchProfitability records={financeRecords} onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'Calculator') {
                    return <ProfitCalculator onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'Forecast') {
                    return <CashFlowForecast records={financeRecords} pigs={pigs} onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'Budget') {
                    return <BudgetAnalysis records={financeRecords} budgets={budgets} onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'Loans') {
                    return <LoanManagement loans={loans} onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'CostAnalysis') {
                    return <CostAnalysis onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'CostCenters') {
                    return <CostCenters financeRecords={financeRecords} fields={fields} assets={assets} onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'Ratios') {
                    return <FinancialRatios financeRecords={financeRecords} pigs={pigs} feeds={feeds} loans={loans} onCancel={() => setFinanceSubView('None')} />;
                }
                if (financeSubView === 'Tax') {
                    const monthlyIncome = financeRecords.filter(r => r.type === 'Income').reduce((a, b) => a + b.amount, 0);
                    return <TaxCalculator monthlyRevenue={monthlyIncome} onCancel={() => setFinanceSubView('None')} />;
                }
                return <Finance
                    records={financeRecords}
                    exchangeRate={exchangeRate}
                    onOpenLogger={() => setFinanceSubView('Logger')}
                    onOpenBatch={() => setFinanceSubView('Batch')}
                    onOpenCalculator={() => setFinanceSubView('Calculator')}
                    onOpenForecast={() => setFinanceSubView('Forecast')}
                    onOpenBudget={() => setFinanceSubView('Budget')}
                    onOpenLoans={() => setFinanceSubView('Loans')}
                    onOpenCostAnalysis={() => setFinanceSubView('CostAnalysis')}
                    onOpenRatios={() => setFinanceSubView('Ratios')}
                    onOpenCostCenters={() => setFinanceSubView('CostCenters')}
                    onOpenTax={() => setFinanceSubView('Tax')}
                />;

            case ViewState.Vet:
                return (
                    <VetMedicalSuite
                        pigs={pigs}
                        healthRecords={healthRecords}
                        medicalItems={medicalInventory}
                        onSaveRecord={handleSaveHealthRecord}
                        onCancel={() => handleNavClick(ViewState.Operations, 'Health')}
                    />
                );


            case ViewState.AI_Tools:
                if (intelligentSubView === 'Chat') {
                    return <SmartAssistant
                        user={currentUser}
                        onUpdateUser={(updated) => {
                            setUsers(users.map(u => u.id === updated.id ? updated : u));
                            setCurrentUser(updated);
                        }}
                        config={notificationConfig}
                        onUpdateConfig={setNotificationConfig}
                    />;
                }
                if (intelligentSubView === 'Critical') {
                    return <CriticalWatch pigs={pigs} tasks={tasks} feeds={feeds} onCancel={() => setIntelligentSubView('None')} onNavigateToPig={(pig) => { setSelectedPig(pig); setCurrentView(ViewState.Pigs); }} />;
                }
                if (intelligentSubView === 'Optimizer') {
                    return <SlaughterOptimizer pigs={pigs} onCancel={() => setIntelligentSubView('None')} onNavigateToPig={(pig) => { setSelectedPig(pig); setCurrentView(ViewState.Pigs); }} />;
                }
                if (intelligentSubView === 'Breeding') {
                    return <BreedingAI pigs={pigs} onCancel={() => setIntelligentSubView('None')} onNavigateToPig={(pig) => { setSelectedPig(pig); setCurrentView(ViewState.Pigs); }} />;
                }
                return <IntelligentCore
                    onOpenBreeding={() => setIntelligentSubView('Breeding')}
                    onOpenOptimizer={() => setIntelligentSubView('Optimizer')}
                    onOpenCritical={() => setIntelligentSubView('Critical')}
                    onOpenChat={() => setIntelligentSubView('Chat')}
                />;

            case ViewState.Calendar:
                return <CalendarView
                    pigs={pigs}
                    tasks={tasks}
                    financeRecords={financeRecords}
                    onNavigate={handleNavClick}
                />;


            case ViewState.Crops:
                return <CropManager
                    fields={fields}
                    crops={crops}
                    cycles={cropCycles}
                    activities={cropActivities}
                    onPlantField={handlePlantField}
                    onHarvest={handleHarvestCrop}
                    onUpdateFieldStatus={handleUpdateFieldStatus}
                    onLogActivity={handleLogCropActivity}
                    onNavigateToPrecision={(fieldId) => {
                        setPrecisionSelectedFieldId(fieldId);
                        handleNavClick(ViewState.PrecisionAg);
                    }}
                />;

            case ViewState.Machinery:
                return <MachineryManager
                    assets={assets}
                    maintenanceLogs={maintenanceLogs}
                    fuelLogs={fuelLogs}
                    onAddAsset={handleAddAsset}
                    onLogMaintenance={handleLogMaintenance}
                    onLogFuel={handleLogFuel}
                />;

            case ViewState.Staff:
                return <StaffManager
                    users={users}
                    currentUser={currentUser}
                    timesheets={timesheets}
                    tasks={tasks}
                    onLogTime={handleLogTime}
                />;

            case ViewState.Biosecurity:
                return <BiosecurityFeatures
                    visitorLogs={visitorLogs}
                    onCheckInVisitor={handleCheckInVisitor}
                    onCheckOutVisitor={handleCheckOutVisitor}
                    knowledgeDocs={knowledgeDocs}
                    onAddDocument={handleAddDocument}
                    onDeleteDocument={handleDeleteDocument}
                    currentUser={currentUser}
                    movements={penMovements}
                    alerts={infectionAlerts}
                    users={users}
                    onLogMovement={handleLogMovement}
                />;

            case ViewState.Automation:
                return <AutomationManager
                    protocols={protocols}
                    onSaveProtocol={handleSaveProtocol}
                    onToggleProtocol={handleToggleProtocol}
                    onDeleteProtocol={handleDeleteProtocol}
                />;

            case ViewState.Settings:
                if (settingsSubView === 'EmailSetup') {
                    return <EmailAlertsSetup config={notificationConfig} onSave={handleSaveNotificationConfig} onCancel={() => setSettingsSubView('None')} />;
                }
                return <Settings
                    currentUser={currentUser}
                    allUsers={users}
                    onAddUser={handleAddUser}
                    onUpdatePassword={handleUpdatePassword}
                    onLogout={handleLogout}
                    onOpenEmailSetup={() => setSettingsSubView('EmailSetup')}
                />;
            case ViewState.CRM:
                if (subView === 'Wholesale') {
                    return (
                        <WholesalePortal
                            products={wholesaleProducts}
                            customers={customers}
                            onPlaceOrder={(order) => { /* Logic */ }}
                            onBack={() => setSubView(null)}
                        />
                    );
                }
                if (subView === 'Zimbabwe') {
                    return <ZimIntelligence exchangeRate={exchangeRate} onUpdateRate={(r) => setExchangeRate({ ...exchangeRate, rate: r, lastUpdated: new Date().toLocaleTimeString() })} onBack={() => handleNavClick(ViewState.CRM)} />;
                }
                return (
                    <CRM
                        customers={customers}
                        orders={orders}
                        invoices={invoices}
                        products={products}
                        onAddOrder={handleAddOrder}
                        onUpdateOrder={handleUpdateOrder}
                        onAddCustomer={handleAddCustomer}
                        onGenerateInvoice={handleGenerateInvoice}
                        onBack={() => handleNavClick(ViewState.Dashboard)}
                    />
                );

            case ViewState.Operations:
                if (subView === 'Scanner') {
                    return (
                        <InventoryQRScanner
                            feeds={feeds}
                            medicalItems={medicalInventory}
                            onLogScan={(scan) => {
                                if (scan.type === 'Usage') {
                                    setFeeds(feeds.map(f => f.id === scan.itemId ? { ...f, quantityKg: f.quantityKg - scan.quantity } : f));
                                } else if (scan.type === 'Inbound') {
                                    setFeeds(feeds.map(f => f.id === scan.itemId ? { ...f, quantityKg: f.quantityKg + scan.quantity } : f));
                                }
                                const updated = [scan, ...inventoryScans];
                                setInventoryScans(updated);
                                saveData('ECOMATT_SCANS', updated);
                            }}
                            onBack={() => setSubView(null)}
                        />
                    );
                }
                return (
                    <Operations
                        pigs={pigs}
                        feeds={feeds}
                        healthRecords={healthRecords}
                        tasks={tasks}
                        medicalItems={medicalInventory}
                        onOpenFeedLogger={() => setOperationsSubView('FeedForm' as any)}
                        onOpenFeedFormulator={() => setOperationsSubView('FeedFormulator' as any)}
                        onOpenVetSuite={() => handleNavClick(ViewState.Vet)}
                        onSaveMedicalItem={handleSaveMedicalItem}
                        onDeleteMedicalItem={handleDeleteMedicalItem}
                        onSaveHealthRecord={handleSaveHealthRecord}
                        onUpdateTask={handleUpdateTask}
                        onLogManure={(amount) => {
                            setManureStock(manureStock + amount);
                        }}
                        onOpenScanner={() => setSubView('Scanner')}
                    />
                );
            case ViewState.Logistics:
                return (
                    <LogisticsOptimizer
                        routes={logisticsRoutes}
                        assets={assets}
                        onUpdateRoute={(route) => {
                            const updated = logisticsRoutes.map(r => r.id === route.id ? route : r);
                            setLogisticsRoutes(updated);
                            saveData('ECOMATT_ROUTES', updated);
                        }}
                        onBack={() => handleNavClick(ViewState.Dashboard)}
                    />
                );

            case ViewState.Genetics:
                return (
                    <LineageExplorer
                        pigs={pigs}
                        onBack={() => handleNavClick(ViewState.Dashboard)}
                    />
                );

            case ViewState.Energy:
                return (
                    <EnergyDashboard
                        status={solarStatus}
                        onToggleAsset={handleToggleEnergyAsset}
                        onBack={() => handleNavClick(ViewState.Dashboard)}
                    />
                );

            case ViewState.Procurement:
                return (
                    <ProcurementAdvisor
                        quotes={supplierQuotes}
                        exchangeRates={marketRates}
                        onBack={() => handleNavClick(ViewState.Finance)}
                    />
                );
            case ViewState.FarrowingWatch:
                return <FarrowingWatch pigs={pigs} onBack={() => handleNavClick(ViewState.Operations)} />;
            default:
                return <Dashboard
                    pigs={pigs}
                    tasks={tasks}
                    financeRecords={financeRecords}
                    feeds={feeds}
                    fields={fields}
                    cropCycles={cropCycles}
                    assets={assets}
                    onViewChange={handleNavClick}
                />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 border-t-4 border-green-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
                <span className="ml-4 text-white font-medium">Ecommatt Cloud Loading...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (isSigningUp) {
            return <Signup
                onSignupSubmit={handleSignupSubmit}
                onNavigateToLogin={() => setIsSigningUp(false)}
            />;
        }
        return <Login
            onLogin={handleLogin}
            onSignupClick={() => setIsSigningUp(true)}
            error={loginError}
        />;
    }

    // Determine Back Button Logic
    let showBack = false;
    let onBack: (() => void) | undefined = undefined;

    if (currentView === ViewState.Pigs) {
        if (selectedPig || isAddingPig || isEditingPig) {
            showBack = true;
            onBack = () => {
                setSelectedPig(null);
                setIsAddingPig(false);
                setIsEditingPig(false);
            };
        }
    } else if (currentView === ViewState.Operations) {
        if (operationsSubView !== 'None') {
            showBack = true;
            onBack = () => setOperationsSubView('None');
        }
    } else if (currentView === ViewState.Finance) {
        if (financeSubView !== 'None') {
            showBack = true;
            onBack = () => setFinanceSubView('None');
        }
    } else if (currentView === ViewState.AI_Tools) {
        if (intelligentSubView !== 'None') {
            showBack = true;
            onBack = () => setIntelligentSubView('None');
        }
    } else if (currentView === ViewState.Settings) {
        if (settingsSubView !== 'None') {
            showBack = true;
            onBack = () => setSettingsSubView('None');
        }
    } else if ([ViewState.Energy, ViewState.Genetics, ViewState.Logistics, ViewState.CRM, ViewState.Biosecurity].includes(currentView)) {
        showBack = true;
        onBack = () => handleNavClick(ViewState.Dashboard);
    } else if (currentView === ViewState.Procurement) {
        showBack = true;
        onBack = () => handleNavClick(ViewState.Finance);
    }

    return (
        <>
            <Layout
                currentView={currentView}
                currentSubView={subView}
                setView={handleNavClick}
                onAddClick={handleFabClick}
                onQuickAction={handleQuickAction}
                currentUser={currentUser}
                onLogout={handleLogout}
                showBack={showBack}
                onBack={onBack}
            >
                {renderContent()}
            </Layout>
            {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        </>
    );
};

export default App;