import React, { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Product, CATEGORIES } from '../types';
import { Button, Input, Select, Card, cn } from './UI';
import { Barcode } from './Barcode';

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdjust: (product: Product) => void;
  onAdd: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ 
  products, 
  onEdit, 
  onDelete, 
  onAdjust,
  onAdd 
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.sku.toLowerCase().includes(search.toLowerCase()) ||
                           p.supplier.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Quantity', 'Reorder Level', 'Unit Price', 'Supplier', 'Location'];
    const rows = filteredProducts.map(p => [
      p.name, p.sku, p.category, p.quantity, p.reorderLevel, p.unitPrice, p.supplier, p.location
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= reorderLevel) return { label: 'Low', color: 'bg-red-100 text-red-700 border-red-200' };
    if (quantity <= reorderLevel * 1.5) return { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Healthy', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-1 gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <Input 
              placeholder="Search products, SKU, supplier..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select 
            className="w-40"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="secondary" onClick={exportToCSV}>
            <Download size={18} />
            Export
          </Button>
          <Button onClick={onAdd}>
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 text-xs font-bold uppercase tracking-wider text-black/60">
                <th className="px-6 py-4 cursor-pointer hover:text-black transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Product <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4">SKU & Barcode</th>
                <th className="px-6 py-4 cursor-pointer hover:text-black transition-colors" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">Category <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-black transition-colors" onClick={() => handleSort('quantity')}>
                  <div className="flex items-center gap-1">Stock <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredProducts.map(p => {
                const status = getStockStatus(p.quantity, p.reorderLevel);
                return (
                  <tr key={p.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-black">{p.name}</div>
                      <div className="text-xs text-black/40">{p.supplier}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono mb-1">{p.sku}</div>
                      <Barcode value={p.sku} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-black/5 text-xs font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{p.quantity}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", status.color)}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${p.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60">
                      {p.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" className="p-2 h-auto" onClick={() => onAdjust(p)} title="Adjust Stock">
                          <ArrowUpDown size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 h-auto" onClick={() => onEdit(p)} title="Edit">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 h-auto text-red-500 hover:text-red-600" onClick={() => onDelete(p.id)} title="Delete">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-black/40 italic">
                    No products found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
