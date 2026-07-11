import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeedbackReport, Product, ShoppingItem } from '../types'

interface ShoppingState {
  items: ShoppingItem[]
  shoppingMode: boolean
  currentStopIndex: number
  tripStartTime: number | null
  feedbackReports: FeedbackReport[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  toggleCompleted: (id: string) => void
  reportWrongLocation: (id: string, reportedAisle: string) => void
  clearCompleted: () => void
  clearAll: () => void
  startShopping: () => void
  endShopping: () => void
  nextStop: () => void
  prevStop: () => void
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set) => ({
      items: [],
      shoppingMode: false,
      currentStopIndex: 0,
      tripStartTime: null,
      feedbackReports: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state
          return { items: [...state.items, { ...product, completed: false, reportedWrongLocation: false }] }
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      toggleCompleted: (id) =>
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, completed: !i.completed } : i),
        })),

      reportWrongLocation: (id, reportedAisle) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id)
          if (!item) return state
          const report: FeedbackReport = {
            id: `${id}-${Date.now()}`,
            itemId: id,
            itemName: item.name,
            reportedAisle,
            timestamp: Date.now(),
          }
          return {
            items: state.items.map((i) => i.id === id ? { ...i, reportedWrongLocation: true } : i),
            feedbackReports: [...state.feedbackReports, report],
          }
        }),

      clearCompleted: () =>
        set((state) => ({ items: state.items.filter((i) => !i.completed) })),

      clearAll: () => set({ items: [] }),

      startShopping: () =>
        set({ shoppingMode: true, currentStopIndex: 0, tripStartTime: Date.now() }),

      endShopping: () =>
        set({ shoppingMode: false, currentStopIndex: 0, tripStartTime: null }),

      nextStop: () =>
        set((state) => ({ currentStopIndex: state.currentStopIndex + 1 })),

      prevStop: () =>
        set((state) => ({ currentStopIndex: Math.max(0, state.currentStopIndex - 1) })),
    }),
    { name: 'supermarket-nav-v1' }
  )
)
