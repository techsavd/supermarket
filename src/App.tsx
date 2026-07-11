import { useState } from 'react';
import { useShoppingStore } from './store/useShoppingStore';
import StoreMap from './components/StoreMap';
import GroceryList from './components/GroceryList';
import RouteSummary from './components/RouteSummary';
import ShoppingMode from './components/ShoppingMode';

type Tab = 'list' | 'map' | 'route';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const { items, route } = useShoppingStore();

  const checkedCount = items.filter(i => i.checked).length;
  const totalItems = items.length;

  if (isShoppingMode) {
    return (
      <ShoppingMode
        onEnd={() => setIsShoppingMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">🫑 Smart Cart</h1>
              <p className="text-xs text-gray-500">Supermarket Navigator</p>
            </div>
            {totalItems > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  {checkedCount}/{totalItems} collected
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: totalItems > 0 ? `${(checkedCount / totalItems) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1">
            {(['list', 'route', 'map'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'list' ? '🗒 List' : tab === 'route' ? '📍 Route' : '🗺 Map'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {activeTab === 'list' && <GroceryList />}
        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <StoreMap />
          </div>
        )}
        {activeTab === 'route' && (
          <RouteSummary
            items={items}
            route={route}
            onStartShopping={() => setIsShoppingMode(true)}
          />
        )}
      </main>
    </div>
  );
}
