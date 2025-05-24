
import { supabase } from '@/integrations/supabase/client';

export type Receipt = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  upload_date: string;
  total_amount: number;
  store_name: string | null;
  receipt_date: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReceiptItem = {
  id: string;
  receipt_id: string;
  item_name: string;
  item_price: number;
  category: string;
  quantity: number;
  created_at: string;
};

export type CategorySpending = {
  id: string;
  user_id: string;
  expense_id: string | null;
  receipt_id: string | null;
  category: string;
  amount: number;
  month_year: string;
  created_at: string;
};

export const PREDEFINED_CATEGORIES = [
  'Fruits & Vegetables',
  'Crisps & Snacks',
  'Frozen Foods',
  'Toiletries',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Bakery',
  'Beverages',
  'Household Items',
  'Personal Care',
  'Health & Medicine',
  'Other'
];

export const receiptService = {
  // Upload receipt file to storage
  async uploadReceiptFile(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file);

    if (error) throw error;
    return filePath;
  },

  // Create receipt record
  async createReceipt(receiptData: {
    file_name: string;
    file_path: string;
    total_amount: number;
    store_name?: string;
    receipt_date?: string;
  }): Promise<Receipt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('receipts')
      .insert({
        ...receiptData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create receipt items
  async createReceiptItems(items: Omit<ReceiptItem, 'id' | 'created_at'>[]): Promise<ReceiptItem[]> {
    const { data, error } = await supabase
      .from('receipt_items')
      .insert(items)
      .select();

    if (error) throw error;
    return data;
  },

  // Create category spending records
  async createCategorySpending(spending: Omit<CategorySpending, 'id' | 'created_at'>[]): Promise<CategorySpending[]> {
    const { data, error } = await supabase
      .from('category_spending')
      .insert(spending)
      .select();

    if (error) throw error;
    return data;
  },

  // Get receipt items by receipt ID
  async getReceiptItems(receiptId: string): Promise<ReceiptItem[]> {
    const { data, error } = await supabase
      .from('receipt_items')
      .select('*')
      .eq('receipt_id', receiptId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get category spending by month/year
  async getCategorySpending(monthYear: string): Promise<CategorySpending[]> {
    const { data, error } = await supabase
      .from('category_spending')
      .select('*')
      .eq('month_year', monthYear)
      .order('amount', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get receipt by ID
  async getReceipt(receiptId: string): Promise<Receipt | null> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', receiptId)
      .single();

    if (error) return null;
    return data;
  },

  // Get receipt file URL
  getReceiptFileUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Categorize item based on name
  categorizeItem(itemName: string): string {
    const name = itemName.toLowerCase();
    
    // Fruits & Vegetables
    if (name.includes('apple') || name.includes('banana') || name.includes('orange') || 
        name.includes('tomato') || name.includes('lettuce') || name.includes('carrot') ||
        name.includes('fruit') || name.includes('vegetable') || name.includes('produce')) {
      return 'Fruits & Vegetables';
    }
    
    // Crisps & Snacks
    if (name.includes('chips') || name.includes('crisp') || name.includes('snack') ||
        name.includes('cookie') || name.includes('cracker') || name.includes('nuts')) {
      return 'Crisps & Snacks';
    }
    
    // Frozen Foods
    if (name.includes('frozen') || name.includes('ice cream') || name.includes('popsicle')) {
      return 'Frozen Foods';
    }
    
    // Toiletries
    if (name.includes('toilet') || name.includes('tissue') || name.includes('paper') ||
        name.includes('soap') || name.includes('shampoo') || name.includes('toothpaste')) {
      return 'Toiletries';
    }
    
    // Dairy & Eggs
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') ||
        name.includes('butter') || name.includes('egg') || name.includes('cream')) {
      return 'Dairy & Eggs';
    }
    
    // Meat & Seafood
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') ||
        name.includes('fish') || name.includes('meat') || name.includes('salmon')) {
      return 'Meat & Seafood';
    }
    
    // Beverages
    if (name.includes('water') || name.includes('juice') || name.includes('soda') ||
        name.includes('coffee') || name.includes('tea') || name.includes('beer') ||
        name.includes('wine') || name.includes('drink')) {
      return 'Beverages';
    }
    
    // Personal Care
    if (name.includes('deodorant') || name.includes('lotion') || name.includes('makeup') ||
        name.includes('razor') || name.includes('perfume')) {
      return 'Personal Care';
    }
    
    return 'Other';
  }
};
