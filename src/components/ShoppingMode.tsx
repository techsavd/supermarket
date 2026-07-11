import { CheckCircle2, ChevronLeft, ChevronRight, X, Flag, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { nodes } from '../data/storeData'
import type { RouteResult, ShoppingItem } from '../types'
import { StoreMap } from './StoreMap'

interface Props {
  items: ShoppingItem[]
  route: RouteResult
  currentStopIndex: number
  tripStartTime: number | null
  onToggle: (id: string) => void
  onReport: (id: string, aisle: string) => void
  onNext: () => void
  onPrev: () => void
  onEnd: () => void
}

export function ShoppingMode({ items, route, currentStopIndex, tripStartTime, onToggle, onReport, onNext, onPrev, onEnd }: Props) {
  const [reportingId, setReportingId] = useState<string | null>(null)
  const [reportAisle, setReportAisle] = useState('')
  const { orderedStops } = route
  const isDone = currentStopIndex >= orderedStops.length
  const currentNodeId = isDone ? 'checkout' : orderedStops[currentStopIndex]
  const currentNode = nodes.find((n) => n.id === currentNodeId)
  const itemsAtStop = items.filter((i) => !i.completed && i.nodeId === currentNodeId)
  const completedCount = items.filter((i) => i.completed).length
  const totalCount = items.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const elapsed = tripStartTime ? Math.floor((Date.now() - tripStartTime) / 60000) : 0

  const handleReport = (id: string) => {
    if (!reportAisle.trim()) return
    onReport(id, reportAisle.trim())
    setReportingId(null)
    setReportAisle('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Shopping mode</p>
          <h2 className="text-xl font-bold text-gray-900">{isDone ? '🎉 Head to Checkout!' : `Stop ${currentStopIndex + 1} of ${orderedStops.length}`}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{elapsed} min elapsed</p>
          <p className="text-sm font-medium text-gray-600">{completedCount}/{totalCount} items</p>
        </div>
        <button onClick={onEnd} className="ml-4 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-400 transition-colors" aria-label="End shopping"><X size={20} /></button>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <StoreMap path={route.path} activeNodeIds={orderedStops} currentStopNodeId={currentNodeId} />

      <div className="rounded-xl p-4 text-white" style={{ backgroundColor: currentNode?.color ?? '#16a34a' }}>
        <p className="text-sm opacity-80">{isDone ? 'Final destination' : 'Current stop'}</p>
        <p className="text-2xl font-bold">{currentNode?.label ?? 'Checkout'}</p>
        <p className="text-sm opacity-80 mt-1">{isDone ? 'You have reached the end of your route!' : `${itemsAtStop.length} item${itemsAtStop.length !== 1 ? 's' : ''} to grab here`}</p>
      </div>

      {!isDone && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Grab these items</p>
          <ul className="flex flex-col gap-2">
            {itemsAtStop.length === 0 ? (
              <li className="text-sm text-gray-400 italic px-2">All items collected at this stop</li>
            ) : itemsAtStop.map((item) => (
              <li key={item.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                <button onClick={() => onToggle(item.id)} className="text-gray-300 hover:text-green-500 transition-colors flex-shrink-0"><CheckCircle2 size={22} /></button>
                <span className="text-xl">{item.emoji ?? '🛍️'}</span>
                <div className="flex-1"><p className="font-medium text-gray-800">{item.name}</p><p className="text-xs text-gray-400">{item.aisle}</p></div>
                {reportingId === item.id ? (
                  <div className="flex gap-2 items-center">
                    <input value={reportAisle} onChange={(e) => setReportAisle(e.target.value)} placeholder="Correct aisle?" className="text-xs border border-gray-200 rounded-lg px-2 py-1 w-28" />
                    <button onClick={() => handleReport(item.id)} className="text-xs text-green-600 font-semibold">Send</button>
                    <button onClick={() => setReportingId(null)} className="text-xs text-gray-400">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setReportingId(item.id)} className="text-gray-200 hover:text-amber-400 transition-colors" aria-label="Report wrong location"><AlertTriangle size={16} /></button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        {currentStopIndex > 0 && (
          <button onClick={onPrev} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"><ChevronLeft size={18} /> Back</button>
        )}
        {isDone ? (
          <button onClick={onEnd} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"><Flag size={18} /> Finish trip</button>
        ) : (
          <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors">{currentStopIndex === orderedStops.length - 1 ? 'Go to Checkout' : 'Next stop'} <ChevronRight size={18} /></button>
        )}
      </div>
    </div>
  )
}
