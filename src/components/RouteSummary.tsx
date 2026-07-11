import { useMemo } from 'react';
import { ShoppingItem, RouteStop } from '../types';
import { storeAisles } from '../data/storeData';

interface RouteSummaryProps {
  items: ShoppingItem[];
  route: RouteStop[];
  onStartShopping: () => void;
}

export default function RouteSummary({ items, route, onStartShopping }: RouteSummaryProps) {
  const checkedCount = items.filter(i => i.checked).length;
  const totalItems = items.length;

  const estimatedTime = useMemo(() => {
    // Rough estimate: 1 minute per stop + 30 seconds per item
    const stopTime = route.length * 1;
    const itemTime = Math.ceil(totalItems * 0.5);
    return stopTime + itemTime;
  }, [route.length, totalItems]);

  const getAisleName = (aisleId: string) => {
    const aisle = storeAisles.find(a => a.id === aisleId);
    return aisle ? aisle.name : aisleId;
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="text-4xl mb-3">🛒</div>
        <p className="text-gray-500 text-sm">Add items to your list to see the optimized route</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
        <h2 className="font-bold text-lg">Optimized Route</h2>
        <div className="flex gap-4 mt-1 text-sm text-green-100">
          <span>📍 {route.length} stops</span>
          <span>🛍️ {totalItems} items</span>
          <span>⏱️ ~{estimatedTime} min</span>
        </div>
      </div>

      <div className="p-4">
        {checkedCount > 0 && (
          <div className="mb-3 bg-green-50 rounded-lg px-3 py-2 text-sm text-green-700 flex items-center gap-2">
            <span>✅</span>
            <span>{checkedCount} of {totalItems} items collected</span>
            <div className="flex-1 bg-green-200 rounded-full h-1.5 ml-2">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${(checkedCount / totalItems) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {route.map((stop, index) => {
            const stopItems = items.filter(i => i.aisleId === stop.aisleId);
            const allChecked = stopItems.every(i => i.checked);
            return (
              <div
                key={stop.aisleId}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  allChecked ? 'bg-gray-50 opacity-60' : 'bg-blue-50'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  allChecked ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'
                }`}>
                  {allChecked ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${
                    allChecked ? 'text-gray-400 line-through' : 'text-gray-800'
                  }`}>
                    {getAisleName(stop.aisleId)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {stopItems.map(item => item.name).join(', ')}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {stopItems.filter(i => i.checked).length}/{stopItems.length}
                </div>
              </div>
            );
          })}
        </div>

        {route.length > 0 && checkedCount === 0 && (
          <button
            onClick={onStartShopping}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>🚶</span>
            Start Shopping
          </button>
        )}
      </div>
    </div>
  );
}
