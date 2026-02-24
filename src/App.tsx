/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, History, Settings, Bell, Menu, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { InventoryTable } from './components/InventoryTable';
import { HistoryList } from './components/HistoryList';
import { ProductModal } from './components/ProductModal';
import { AdjustmentModal } from './components/AdjustmentModal';
import { Product, StockMovement } from './types';
import { storageService } from './services/storageService';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'dashboard' | 'inventory' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setProducts(storageService.getProducts());
    setMovements(storageService.getMovements());
  }, []);

  const handleSaveProduct = (productData: Partial<Product>) => {
    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...p, ...productData, updatedAt: new Date().toISOString() } as Product : p
      );
    } else {
      const newProduct: Product = {
        ...productData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product;
      updatedProducts = [newProduct, ...products];
      
      // Record initial stock as movement
      if (newProduct.quantity > 0) {
        storageService.addMovement({
          productId: newProduct.id,
          productName: newProduct.name,
          type: 'addition',
          quantity: newProduct.quantity,
          reason: 'Initial stock entry',
          fromLocation: 'N/A',
          toLocation: newProduct.location
        });
      }
    }
    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);
    setMovements(storageService.getMovements());
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? All history will remain but the product record will be removed.')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      storageService.saveProducts(updatedProducts);
    }
  };

  const handleAdjustStock = (adjustment: Omit<StockMovement, 'id' | 'timestamp' | 'productName'>) => {
    const product = products.find(p => p.id === adjustment.productId);
    if (!product) return;

    let newQuantity = product.quantity;
    if (adjustment.type === 'addition') newQuantity += adjustment.quantity;
    if (adjustment.type === 'removal') newQuantity -= adjustment.quantity;
    
    // For transfer, quantity doesn't change globally, but location might
    const updatedProduct = {
      ...product,
      quantity: Math.max(0, newQuantity),
      location: adjustment.type === 'transfer' ? (adjustment.toLocation || product.location) : product.location,
      updatedAt: new Date().toISOString()
    };

    const updatedProducts = products.map(p => p.id === product.id ? updatedProduct : p);
    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);

    storageService.addMovement({
      ...adjustment,
      productName: product.name
    });
    setMovements(storageService.getMovements());
  };

  const lowStockCount = products.filter(p => p.quantity <= p.reorderLevel).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'history', label: 'Movements', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-black font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-black/5 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Package size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">StockFlow Pro</h1>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                activeTab === item.id 
                  ? 'bg-black text-white shadow-lg shadow-black/10' 
                  : 'text-black/40 hover:bg-black/5 hover:text-black'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-black/5 space-y-2">
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-black/40 hover:bg-black/5 hover:text-black transition-all font-bold">
            <Settings size={20} />
            Settings
          </button>
          <div className="p-4 bg-black/5 rounded-2xl mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold">All Systems Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-black/5 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Package size={18} />
          </div>
          <h1 className="text-lg font-black tracking-tight">StockFlow</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-black/5 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 p-6 lg:hidden"
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                  <Package size={24} />
                </div>
                <h1 className="text-xl font-black tracking-tight">StockFlow Pro</h1>
              </div>
              <nav className="space-y-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                      activeTab === item.id 
                        ? 'bg-black text-white shadow-lg shadow-black/10' 
                        : 'text-black/40 hover:bg-black/5 hover:text-black'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              {activeTab === 'dashboard' && 'Operations Overview'}
              {activeTab === 'inventory' && 'Inventory Management'}
              {activeTab === 'history' && 'Stock Movement History'}
            </h2>
            <p className="text-black/40 font-medium">
              {activeTab === 'dashboard' && 'Real-time performance metrics and alerts'}
              {activeTab === 'inventory' && 'Track, update and manage your product catalog'}
              {activeTab === 'history' && 'Audit trail of all stock adjustments and transfers'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-3 bg-white border border-black/5 rounded-2xl hover:bg-black/5 transition-all relative">
                <Bell size={20} />
                {lowStockCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-black/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">Warehouse Manager</p>
              </div>
              <div className="w-10 h-10 bg-black/5 rounded-2xl flex items-center justify-center font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard products={products} movements={movements} />
            )}
            {activeTab === 'inventory' && (
              <InventoryTable 
                products={products} 
                onAdd={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setIsProductModalOpen(true);
                }}
                onDelete={handleDeleteProduct}
                onAdjust={(p) => {
                  setAdjustingProduct(p);
                  setIsAdjustModalOpen(true);
                }}
              />
            )}
            {activeTab === 'history' && (
              <HistoryList movements={movements} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Extensibility Markers */}
        {/* 
          EXTENSIBILITY NOTE: 
          - To add Barcode Scanner: Integrate a library like 'html5-qrcode' in a new component and call handleAdjustStock.
          - To add Multiple Warehouses: Update Product type to include a 'warehouses' array and update AdjustmentModal to handle warehouse selection.
          - To add Sales Orders: Create a new 'orders' collection in storageService and add a tab to process them, deducting from stock.
          - To add Expiry Tracking: Add 'expiryDate' to Product type and create a new alert panel in Dashboard.
        */}
      </main>

      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />

      <AdjustmentModal 
        isOpen={isAdjustModalOpen}
        onClose={() => {
          setIsAdjustModalOpen(false);
          setAdjustingProduct(null);
        }}
        product={adjustingProduct}
        onAdjust={handleAdjustStock}
      />
    </div>
  );
}
