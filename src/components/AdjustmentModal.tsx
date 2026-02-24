import React, { useState } from 'react';
import { X, Plus, Minus, ArrowRightLeft } from 'lucide-react';
import { Product, StockMovement } from '../types';
import { Button, Input, Card } from './UI';
import { motion, AnimatePresence } from 'motion/react';

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAdjust: (adjustment: Omit<StockMovement, 'id' | 'timestamp' | 'productName'>) => void;
}

export const AdjustmentModal: React.FC<AdjustmentModalProps> = ({ isOpen, onClose, product, onAdjust }) => {
  const [type, setType] = useState<StockMovement['type']>('addition');
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState('');
  const [toLocation, setToLocation] = useState('');

  if (!product) return null;

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    onAdjust({
      productId: product.id,
      type,
      quantity: amount,
      reason: reason || `${type.charAt(0).toUpperCase() + type.slice(1)} of ${amount} units`,
      fromLocation: product.location,
      toLocation: type === 'transfer' ? toLocation : undefined
    });
    onClose();
    // Reset
    setAmount(1);
    setReason('');
    setToLocation('');
  };

  const quickAdjust = (val: number) => {
    setAmount(Math.max(1, amount + val));
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
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-black/5">
              <div>
                <h2 className="text-xl font-bold">Adjust Stock</h2>
                <p className="text-xs text-black/50">{product.name} ({product.sku})</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex p-1 bg-black/5 rounded-2xl">
                <button 
                  onClick={() => setType('addition')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all",
                    type === 'addition' ? "bg-white shadow-sm text-emerald-600" : "text-black/40 hover:text-black/60"
                  )}
                >
                  <Plus size={16} /> Add
                </button>
                <button 
                  onClick={() => setType('removal')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all",
                    type === 'removal' ? "bg-white shadow-sm text-red-600" : "text-black/40 hover:text-black/60"
                  )}
                >
                  <Minus size={16} /> Remove
                </button>
                <button 
                  onClick={() => setType('transfer')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all",
                    type === 'transfer' ? "bg-white shadow-sm text-blue-600" : "text-black/40 hover:text-black/60"
                  )}
                >
                  <ArrowRightLeft size={16} /> Transfer
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="number" 
                      min="1"
                      value={amount}
                      onChange={e => setAmount(parseInt(e.target.value) || 1)}
                      className="text-center text-xl font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="secondary" className="px-0 text-xs" onClick={() => quickAdjust(-10)}>-10</Button>
                    <Button variant="secondary" className="px-0 text-xs" onClick={() => quickAdjust(-1)}>-1</Button>
                    <Button variant="secondary" className="px-0 text-xs" onClick={() => quickAdjust(1)}>+1</Button>
                    <Button variant="secondary" className="px-0 text-xs" onClick={() => quickAdjust(10)}>+10</Button>
                  </div>
                </div>

                {type === 'transfer' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-widest">To Location</label>
                    <Input 
                      placeholder="New warehouse/shelf location"
                      value={toLocation}
                      onChange={e => setToLocation(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Reason / Note</label>
                  <Input 
                    placeholder="e.g. Restock, Damaged, Sale"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleAdjust} className="w-full py-4 text-lg">
                  Confirm Adjustment
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper for cn in this file
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
