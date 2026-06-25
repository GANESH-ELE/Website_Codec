export type Category = string;
export type StockStatus = 'In Stock' | 'Out of Stock';

export interface Product {
  id: string;
  item_name: string;
  brand: string;
  category: Category;
  subcategory?: string;
  description: string;
  images: string[];
  video_url?: string;
  stock_status: StockStatus;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuotationPayload {
  items: CartItem[];
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  note?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}
