# Supermarket Navigation App — Planning Document

## Who Is This For? (Two User Types)

| User | Goal |
|---|---|
| **Shopper** | Build a grocery list and follow the fastest in-store route |
| **Store Admin** | Set up the store map, manage product locations, update inventory |

---

## Core Features

### 1. Store Selection
- Landing screen shows available stores (initially just one: e.g. "Oakville Market")
- Each store has its own map, product catalogue, and aisle layout
- Store is persisted in local storage so it doesn't re-ask every visit

### 2. Grocery List Builder
- Search bar with real-time autocomplete against the store's product catalogue
- Tap a result to add it to the list
- Manual free-text fallback: "Add anyway as unknown item" if nothing matches
- List shows item name, aisle label, and department (e.g. "Dairy — Aisle 3")
- Remove individual items with a swipe or X button
- Clear all / Clear completed buttons

### 3. Store Map & Route Visualization
- 2D SVG top-down store map (not GPS — coordinate grid)
- Highlighted path drawn between all stops in optimized order
- Each stop is a numbered pin (1 = first, 2 = second, etc.)
- Current active stop is highlighted prominently
- Entrance and Checkout always anchored as start/end
- Legend showing departments and color coding

### 4. Shopping Mode (Turn-by-turn flow)
- "Start Shopping" button activates guided mode
- Top banner shows: **Next stop → Dairy (Aisle 3)**
- Below shows the current item(s) to grab at this stop
- Check off each item individually
- "Done here → Next stop" advances the route
- Progress bar at top: "3 of 7 stops completed"
- When all stops done → "Head to Checkout" CTA

### 5. Item Check-off & Completion
- Tap item to mark as found/collected
- Completed items get a strikethrough and move to a "Collected" section
- Items not found get a "Report issue" option (wrong aisle, out of stock)
- End-of-trip summary: items collected, items missed, time elapsed

### 6. Route Optimization Engine
- Nearest-neighbour algorithm ordering stops from Entrance → … → Checkout
- Groups multiple items in the same aisle into one stop (no double-back)
- Recalculates dynamically if items are added mid-shop
- "Re-route" button if shopper deviates or skips a stop

### 7. Admin Panel (Store Manager view)
- Password-protected simple admin route (`/admin`)
- **Map editor**: drag-and-drop nodes (aisles, intersections, entrance, checkout) on a canvas
- **Edge editor**: draw walkable paths between nodes with distance weights
- **Product catalogue**: add/edit/delete products with name, category, aisle assignment, and node mapping
- **Bulk import**: CSV upload for product catalogue
- Changes persist to local JSON initially; Supabase/Postgres later

### 8. Feedback & Corrections
- Per-item "Wrong location?" button during shopping mode
- Submits: item name + reported correct aisle (free text)
- Stored locally for admin to review and fix
- Helps crowdsource map accuracy over time

---

## Full Shopper User Flow

```
[Landing]
    ↓
Select Store (e.g. Oakville Market)
    ↓
[List Builder Screen]
  → Search & add items
  → Items appear with aisle labels
  → Route preview updates live on mini-map
    ↓
Tap "Start Shopping"
    ↓
[Shopping Mode]
  → Map fills screen with highlighted route + numbered stops
  → Banner: "Stop 1 → Produce (Aisle 1)"
  → List of items at this stop
  → Check off items
  → Tap "Next Stop →"
  → Repeat for each stop
    ↓
[Final Stop: Checkout]
  → All remaining items shown
  → "Trip Complete" screen
    ↓
[Summary Screen]
  → X items collected
  → Y items missed
  → Time elapsed
  → "Start new list" or "Save this list"
```

---

## Full Admin User Flow

```
[/admin login]
    ↓
[Dashboard]
  → Store stats (# products, # map nodes, # feedback reports)
    ↓
[Map Editor tab]
  → View store canvas
  → Add/move/delete nodes
  → Draw/delete path edges
  → Save map version
    ↓
[Product Catalogue tab]
  → Search/filter products
  → Add / edit / delete product
  → Assign to node
  → Bulk CSV import
    ↓
[Feedback tab]
  → Review shopper-reported wrong locations
  → Accept correction (updates product node) or dismiss
```

---

## Screens Summary

| Screen | Route | Purpose |
|---|---|---|
| Store selector | `/` | Pick a store |
| List builder | `/store/:id` | Build list + see live route preview |
| Shopping mode | `/store/:id/shop` | Guided stop-by-stop navigation |
| Trip summary | `/store/:id/done` | Post-shop recap |
| Admin login | `/admin` | Protected entry |
| Admin dashboard | `/admin/dashboard` | Overview |
| Map editor | `/admin/map` | Node/edge editing |
| Product catalogue | `/admin/products` | Item management |
| Feedback | `/admin/feedback` | Review shopper corrections |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | Zustand (with localStorage persistence) |
| Map rendering | SVG (coordinate grid, no GPS) |
| Routing algorithm | Dijkstra / nearest-neighbour |
| Admin auth | Simple password-protected route (v1) |
| Data persistence | localStorage → Supabase/Postgres (v2) |
| Deployment | Vercel / Netlify |

---

## Out of Scope for v1

- GPS / real-time indoor positioning
- AR camera overlay
- Barcode scanning
- Multi-store chain syncing
- User accounts / auth (beyond admin)
- Push notifications
- Price data / deals / promotions

---

## Open Questions

1. Admin panel in v1 or hardcode store data to start?
2. One store or multi-store architecture from day one?
3. Mobile-first or desktop-first UI?
4. Which specific store layout to model first (real Oakville store or fictional generic layout)?
