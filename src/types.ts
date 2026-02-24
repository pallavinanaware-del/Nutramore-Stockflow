import { format } from 'date-fns';

export type Category = 'Electronics' | 'Furniture' | 'Raw Materials' | 'Office Supplies' | 'Apparel' | 'Food & Beverage';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'addition' | 'removal' | 'transfer';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  timestamp: string;
}

export const CATEGORIES: Category[] = [
  'Electronics',
  'Furniture',
  'Raw Materials',
  'Office Supplies',
  'Apparel',
  'Food & Beverage'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ergonomic Chair',
    sku: 'FUR-001',
    category: 'Furniture',
    quantity: 15,
    reorderLevel: 5,
    unitPrice: 199.99,
    supplier: 'Comfort Seating Co.',
    location: 'Warehouse A-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'ELE-042',
    category: 'Electronics',
    quantity: 4,
    reorderLevel: 10,
    unitPrice: 25.50,
    supplier: 'TechGear Solutions',
    location: 'Warehouse B-05',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Steel Bolts (100pk)',
    sku: 'RAW-882',
    category: 'Raw Materials',
    quantity: 150,
    reorderLevel: 50,
    unitPrice: 12.00,
    supplier: 'Industrial Supply Inc.',
    location: 'Warehouse C-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Oak Desk',
    sku: 'FUR-002',
    category: 'Furniture',
    quantity: 8,
    reorderLevel: 3,
    unitPrice: 450.00,
    supplier: 'Comfort Seating Co.',
    location: 'Warehouse A-14',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'USB-C Cable 2m',
    sku: 'ELE-105',
    category: 'Electronics',
    quantity: 45,
    reorderLevel: 20,
    unitPrice: 15.99,
    supplier: 'TechGear Solutions',
    location: 'Warehouse B-02',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Aluminum Sheet 2x4',
    sku: 'RAW-112',
    category: 'Raw Materials',
    quantity: 12,
    reorderLevel: 15,
    unitPrice: 85.00,
    supplier: 'MetalWorks Ltd.',
    location: 'Warehouse C-05',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'A4 Paper (500 sheets)',
    sku: 'OFF-001',
    category: 'Office Supplies',
    quantity: 120,
    reorderLevel: 30,
    unitPrice: 5.99,
    supplier: 'PaperTrail Corp',
    location: 'Warehouse A-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Cotton T-Shirt L',
    sku: 'APP-055',
    category: 'Apparel',
    quantity: 60,
    reorderLevel: 25,
    unitPrice: 18.50,
    supplier: 'Global Fabrics',
    location: 'Warehouse D-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Coffee Beans 1kg',
    sku: 'FNB-001',
    category: 'Food & Beverage',
    quantity: 22,
    reorderLevel: 10,
    unitPrice: 24.99,
    supplier: 'RoastMasters',
    location: 'Warehouse E-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Monitor 27"',
    sku: 'ELE-200',
    category: 'Electronics',
    quantity: 2,
    reorderLevel: 5,
    unitPrice: 299.99,
    supplier: 'TechGear Solutions',
    location: 'Warehouse B-08',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
