import React from 'react';
import { StockMovement } from '../types';
import { Card } from './UI';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Clock } from 'lucide-react';

interface HistoryListProps {
  movements: StockMovement[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ movements }) => {
  const getIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'addition': return <ArrowUpRight className="text-emerald-500" size={18} />;
      case 'removal': return <ArrowDownRight className="text-red-500" size={18} />;
      case 'transfer': return <ArrowRightLeft className="text-blue-500" size={18} />;
    }
  };

  const getBg = (type: StockMovement['type']) => {
    switch (type) {
      case 'addition': return 'bg-emerald-50';
      case 'removal': return 'bg-red-50';
      case 'transfer': return 'bg-blue-50';
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
        <h3 className="font-bold flex items-center gap-2">
          <Clock size={18} />
          Recent Stock Movements
        </h3>
        <span className="text-xs text-black/40">{movements.length} total events</span>
      </div>
      <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto">
        {movements.map(m => (
          <div key={m.id} className="px-6 py-4 hover:bg-black/[0.01] transition-colors flex items-start gap-4">
            <div className={`p-2 rounded-xl ${getBg(m.type)} mt-1`}>
              {getIcon(m.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm">{m.productName}</p>
                  <p className="text-xs text-black/60">{m.reason}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${m.type === 'addition' ? 'text-emerald-600' : m.type === 'removal' ? 'text-red-600' : 'text-blue-600'}`}>
                    {m.type === 'addition' ? '+' : m.type === 'removal' ? '-' : ''}{m.quantity} units
                  </p>
                  <p className="text-[10px] text-black/40">{format(new Date(m.timestamp), 'MMM d, HH:mm')}</p>
                </div>
              </div>
              {m.type === 'transfer' && (
                <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-black/50">
                  <span className="px-1.5 py-0.5 bg-black/5 rounded">{m.fromLocation}</span>
                  <ArrowRightLeft size={10} />
                  <span className="px-1.5 py-0.5 bg-black/5 rounded">{m.toLocation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {movements.length === 0 && (
          <div className="px-6 py-12 text-center text-black/40 italic">
            No stock movements recorded yet
          </div>
        )}
      </div>
    </Card>
  );
};
