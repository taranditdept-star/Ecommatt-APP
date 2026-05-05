import { supabase } from '../lib/supabase';
import { Pig, Task, FinanceRecord, FeedInventory, HealthRecord, BudgetRecord, LoanRecord, Field, User, Crop, CropCycle, CropActivity, Asset, MedicalItem, Customer, Order, Invoice, AttendanceLog, VisitorLogEntry, Protocol, KnowledgeDoc } from '../types';

const createGenericService = <T>(tableName: string) => ({
    async getAll() {
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) throw error;
        return data as T[];
    },
    async create(record: any) {
        const { data, error } = await supabase.from(tableName).insert([record]).select().single();
        if (error) throw error;
        return data as T;
    },
    async update(id: string, updates: Partial<T>) {
        const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data as T;
    },
    async delete(id: string) {
        const { error } = await supabase.from(tableName).delete().eq('id', id);
        if (error) throw error;
    }
});

export const supabaseService = {
    // specific overrides if needed
    profiles: createGenericService<User>('profiles'),
    pigs: {
        ...createGenericService<Pig>('pigs'),
        async getAll() {
            const { data, error } = await supabase.from('pigs').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data as Pig[];
        }
    },
    tasks: {
        ...createGenericService<Task>('tasks'),
        async getAll() {
            const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
            if (error) throw error;
            return data as Task[];
        }
    },
    finance: {
        ...createGenericService<FinanceRecord>('finance_records'),
        async getAll() {
            const { data, error } = await supabase.from('finance_records').select('*').order('date', { ascending: false });
            if (error) throw error;
            return data as FinanceRecord[];
        }
    },
    feeds: createGenericService<FeedInventory>('feed_inventory'),
    fields: createGenericService<Field>('fields'),
    budgets: createGenericService<BudgetRecord>('budgets'),
    loans: createGenericService<LoanRecord>('loans'),
    health: createGenericService<HealthRecord>('health_records'),
    crops: createGenericService<Crop>('crops'),
    cropCycles: createGenericService<CropCycle>('crop_cycles'),
    assets: createGenericService<Asset>('assets'),
    medicalInventory: createGenericService<MedicalItem>('medical_inventory'),
    customers: createGenericService<Customer>('customers'),
    orders: createGenericService<Order>('orders'),
    invoices: createGenericService<Invoice>('invoices'),
    attendance: createGenericService<AttendanceLog>('attendance_logs'),
    visitors: createGenericService<VisitorLogEntry>('visitor_logs'),
    protocols: createGenericService<Protocol>('protocols'),
    knowledgeDocs: createGenericService<KnowledgeDoc>('knowledge_docs'),
};
