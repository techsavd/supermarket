import { nodes, edges } from '../data/storeData'
import type { NodeId } from '../types'

interface Props {
  path: NodeId[]
  activeNodeIds: NodeId[]
  currentStopNodeId?: NodeId
}

const W = 800
const H = 560

export function StoreMap({ path, activeNodeIds, currentStopNodeId }: Props) {
  const pathSet = new Set(path)

  const pathCoords = path
    .map((id) => nodes.find((n) => n.id === id))
    .filter(Boolean)
    .map((n) => `${n!.x},${n!.y}`)
    .join(' ')

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-gray-50">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }} aria-label="Store map">
        <rect x={0} y={0} width={W} height={H} fill="#f8fafc" />
        <rect x={40} y={60} width={720} height={460} rx={16} fill="white" stroke="#e2e8f0" strokeWidth={2} />
        <rect x={60} y={80} width={680} height={100} rx={8} fill="#f0fdf4" opacity={0.6} />
        <rect x={60} y={260} width={680} height={100} rx={8} fill="#fef9f0" opacity={0.6} />

        {edges
          .filter(({ from, to }) => path.length > 1 ? pathSet.has(from) && pathSet.has(to) : false)
          .map(({ from, to }, i) => {
            const f = nodes.find((n) => n.id === from)
            const t = nodes.find((n) => n.id === to)
            if (!f || !t) return null
            return <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
          })}

        {path.length > 1 && (
          <polyline points={pathCoords} fill="none" stroke="#16a34a" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 4" opacity={0.85} />
        )}

        {nodes.filter((n) => n.type !== 'intersection').map((node) => {
          const isActive = activeNodeIds.includes(node.id)
          const isCurrent = node.id === currentStopNodeId
          const isEntryExit = node.type === 'entrance' || node.type === 'checkout'
          const r = isCurrent ? 22 : isEntryExit ? 18 : 16
          return (
            <g key={node.id}>
              {isCurrent && <circle cx={node.x} cy={node.y} r={r + 8} fill="#16a34a" opacity={0.2} />}
              <circle cx={node.x} cy={node.y} r={r} fill={isActive ? (node.color ?? '#16a34a') : '#e2e8f0'} stroke={isCurrent ? '#166534' : isActive ? '#fff' : '#cbd5e1'} strokeWidth={isCurrent ? 3 : 2} />
              <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={10} fontWeight={600} fill={isActive ? 'white' : '#64748b'}>{node.label.slice(0, 4)}</text>
              {node.label && <text x={node.x} y={node.y + r + 14} textAnchor="middle" fontSize={11} fill="#475569" fontWeight={isActive ? 700 : 400}>{node.label}</text>}
            </g>
          )
        })}

        {activeNodeIds.map((nodeId, idx) => {
          const node = nodes.find((n) => n.id === nodeId)
          if (!node) return null
          return (
            <g key={`stop-${nodeId}`}>
              <circle cx={node.x + 20} cy={node.y - 20} r={10} fill="#16a34a" />
              <text x={node.x + 20} y={node.y - 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">{idx + 1}</text>
            </g>
          )
        })}
      </svg>

      <div className="flex flex-wrap gap-3 px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500" /> Active stop</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-gray-200" /> Not needed</span>
        <span className="flex items-center gap-1"><span className="inline-block w-8 border-t-2 border-dashed border-green-600" /> Your route</span>
      </div>
    </div>
  )
}
