import React from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from './UI';
import { Product, StockMovement } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { startOfWeek, isAfter } from 'date-fns';

interface DashboardProps {
  products: Product[];
  movements: StockMovement[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products, movements }) => {
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity <= p.reorderLevel).length;
  const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
  
  const weekStart = startOfWeek(new Date());
  const weeklyMovements = movements.filter(m => isAfter(new Date(m.timestamp), weekStart)).length;

  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += p.quantity;
    } else {
      acc.push({ name: p.category, value: p.quantity });
    }
    return acc;
  }, []);

  const COLORS = ['#000000', '#444444', '#888888', '#AAAAAA', '#CCCCCC', '#EEEEEE'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-black/50 font-medium">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-black/50 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold">{lowStockCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-black/50 font-medium">Inventory Value</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-black/50 font-medium">Movements (Week)</p>
            <p className="text-2xl font-bold">{weeklyMovements}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Stock by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-4">Low Stock Items</h3>
          <div className="space-y-4">
            {products
              .filter(p => p.quantity <= p.reorderLevel)
              .slice(0, 5)
              .map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-black/50">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-sm">{p.quantity} left</p>
                    <p className="text-[10px] text-black/40">Level: {p.reorderLevel}</p>
                  </div>
                </div>
              ))}
            {lowStockCount === 0 && (
              <p className="text-center text-black/40 py-8 italic">All stock levels are healthy</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
