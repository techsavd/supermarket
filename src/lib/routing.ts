import { edges, nodes } from '../data/storeData'
import type { NodeId, RouteResult } from '../types'

type Graph = Record<NodeId, { to: NodeId; distance: number }[]>

const buildGraph = (): Graph =>
  edges.reduce<Graph>((g, e) => {
    g[e.from] ??= []
    g[e.from].push({ to: e.to, distance: e.distance })
    return g
  }, {})

const graph = buildGraph()

export function dijkstra(start: NodeId, end: NodeId): { path: NodeId[]; distance: number } {
  const dist: Record<NodeId, number> = {}
  const prev: Record<NodeId, NodeId | undefined> = {}
  const unvisited = new Set(nodes.map((n) => n.id))

  for (const n of nodes) dist[n.id] = Infinity
  dist[start] = 0

  while (unvisited.size > 0) {
    const curr = [...unvisited].reduce((best, id) =>
      dist[id] < dist[best] ? id : best
    )
    if (curr === end || dist[curr] === Infinity) break
    unvisited.delete(curr)
    for (const nb of graph[curr] ?? []) {
      const alt = dist[curr] + nb.distance
      if (alt < dist[nb.to]) {
        dist[nb.to] = alt
        prev[nb.to] = curr
      }
    }
  }

  const path: NodeId[] = []
  let cur: NodeId | undefined = end
  while (cur) { path.unshift(cur); cur = prev[cur] }
  return { path: path[0] === start ? path : [], distance: dist[end] }
}

export function buildShoppingRoute(stopNodeIds: NodeId[]): RouteResult {
  const uniqueStops = [...new Set(stopNodeIds)]
  if (uniqueStops.length === 0) {
    return { path: ['entrance', 'checkout'], orderedStops: [], totalDistance: 0 }
  }

  const remaining = [...uniqueStops]
  let current: NodeId = 'entrance'
  const fullPath: NodeId[] = ['entrance']
  const orderedStops: NodeId[] = []
  let totalDistance = 0

  while (remaining.length > 0) {
    let best: { stop: NodeId; path: NodeId[]; dist: number } | null = null
    for (const stop of remaining) {
      const r = dijkstra(current, stop)
      if (r.path.length === 0) continue
      if (!best || r.distance < best.dist) {
        best = { stop, path: r.path, dist: r.distance }
      }
    }
    if (!best) break
    fullPath.push(...best.path.slice(1))
    orderedStops.push(best.stop)
    totalDistance += best.dist
    current = best.stop
    remaining.splice(remaining.indexOf(best.stop), 1)
  }

  const toCheckout = dijkstra(current, 'checkout')
  if (toCheckout.path.length > 0) {
    fullPath.push(...toCheckout.path.slice(1))
    totalDistance += toCheckout.distance
  }

  return { path: fullPath, orderedStops, totalDistance }
}
