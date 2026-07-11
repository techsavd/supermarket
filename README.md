# Smart Cart - Supermarket Navigator

A React-based supermarket navigation app that helps shoppers find items efficiently using an optimized routing algorithm.

## Features

- **Smart Grocery List** - Add items by searching or browsing categories
- **Optimized Route** - Dijkstra-based nearest-neighbor routing minimizes walking distance
- **Interactive Store Map** - SVG-based 2D map showing your route visually
- **Shopping Mode** - Step-by-step guided navigation through each aisle
- **Real-time Progress** - Track collected items with a progress bar
- **Persistent State** - Your list is saved via Zustand with localStorage

## Tech Stack

- **React 18** + TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Custom Dijkstra** routing algorithm

## Project Structure

```
src/
  components/
    StoreMap.tsx       # SVG map with route visualization
    GroceryList.tsx    # Item list with search and category filter
    ShoppingMode.tsx   # Step-by-step guided shopping
    RouteSummary.tsx   # Optimized route overview
  data/
    storeData.ts       # Store layout: aisles, nodes, edges
  lib/
    routing.ts         # Dijkstra pathfinding algorithm
  store/
    useShoppingStore.ts  # Zustand global state
  types.ts             # TypeScript interfaces
  App.tsx              # Main app with tab navigation
  main.tsx             # React entry point
  index.css            # Tailwind + custom styles
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

1. Add items to your grocery list
2. The app groups items by aisle and calculates an optimal walking route
3. View the route on the store map or follow step-by-step in Shopping Mode
4. Check off items as you collect them

## Store Layout

The store is modeled as a graph with nodes (intersections/aisles) and weighted edges (walking distances). The routing algorithm finds the shortest path visiting all required aisles using a nearest-neighbor heuristic.

See [PLANNING.md](./PLANNING.md) for full product specification.
