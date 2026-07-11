import { CheckCircle2, Circle, Trash2, AlertTriangle } from 'lucide-react'
import type { ShoppingItem } from '../types'

interface Props {
  items: ShoppingItem[]
  onRemove: (id: string) => void
  onToggle: (id: string) => void
  onClearCompleted: () => void
  onClearAll: () => void
}

export function GroceryList({ items, onRemove, onToggle, onClearCompleted, onClearAll }: Props) {
  const active = items.filter((i) => !i.completed)
  const completed = items.filter((i) => i.completed)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
        <span className="text-5xl mb-3">🛒</span>
        <p className="font-medium text-gray-500">Your list is empty</p>
        <p className="text-sm mt-1">Search for items above to add them</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {active.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">To get ({active.length})</p>
          <ul className="flex flex-col gap-2">
            {active.map((item) => (
              <li key={item.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                <button onClick={() => onToggle(item.id)} className="text-gray-300 hover:text-green-500 transition-colors flex-shrink-0" aria-label="Mark as collected">
                  <Circle size={20} />
                </button>
                <span className="text-xl">{item.emoji ?? '🛍️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category} · {item.aisle}</p>
                </div>
                {item.reportedWrongLocation && <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />}
                <button onClick={() => onRemove(item.id)} className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0" aria-label="Remove item">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Collected ({completed.length})</p>
            <button onClick={onClearCompleted} className="text-xs text-gray-400 hover:text-red-400 transition-colors">Clear</button>
          </div>
          <ul className="flex flex-col gap-2">
            {completed.map((item) => (
              <li key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 opacity-60">
                <button onClick={() => onToggle(item.id)} className="text-green-500 flex-shrink-0" aria-label="Unmark">
                  <CheckCircle2 size={20} />
                </button>
                <span className="text-xl">{item.emoji ?? '🛍️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-400 line-through truncate">{item.name}</p>
                  <p className="text-xs text-gray-300">{item.category}</p>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0" aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
        <button onClick={onClearAll} className="mt-2 w-full text-xs text-gray-300 hover:text-red-400 transition-colors py-2">Clear all items</button>
      )}
    </div>
  )
}
