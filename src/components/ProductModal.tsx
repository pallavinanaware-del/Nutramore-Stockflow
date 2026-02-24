import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product, Category, CATEGORIES } from '../types';
import { Button, Input, Select } from './UI';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  initialData?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Electronics',
    quantity: 0,
    reorderLevel: 5,
    unitPrice: 0,
    supplier: '',
    location: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'Electronics',
        quantity: 0,
        reorderLevel: 5,
        unitPrice: 0,
        supplier: '',
        location: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Product Name</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Wireless Keyboard"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">SKU / Code</label>
                  <Input 
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. ELE-101"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Category</label>
                  <Select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Unit Price ($)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Initial Quantity</label>
                  <Input 
                    type="number"
                    required
                    disabled={!!initialData}
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Reorder Level</label>
                  <Input 
                    type="number"
                    required
                    value={formData.reorderLevel}
                    onChange={e => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Supplier</label>
                  <Input 
                    value={formData.supplier}
                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black/60 uppercase tracking-wider">Location / Warehouse</label>
                  <Input 
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. A-12-B"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {initialData ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
