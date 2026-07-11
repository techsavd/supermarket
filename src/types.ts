export type NodeId = string

export type NodeType = 'entrance' | 'intersection' | 'aisle' | 'checkout'

export interface MapNode {
  id: NodeId
  x: number
  y: number
  label: string
  type: NodeType
  color?: string
}

export interface MapEdge {
  from: NodeId
  to: NodeId
  distance: number
}

export interface Product {
  id: string
  name: string
  category: string
  aisle: string
  nodeId: NodeId
  emoji?: string
}

export interface ShoppingItem extends Product {
  completed: boolean
  reportedWrongLocation: boolean
}

export interface RouteResult {
  path: NodeId[]
  orderedStops: NodeId[]
  totalDistance: number
}

export interface FeedbackReport {
  id: string
  itemId: string
  itemName: string
  reportedAisle: string
  timestamp: number
}

export interface Store {
  id: string
  name: string
  address: string
}
