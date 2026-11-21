# 🍛 Zaika DineOS — Restaurant Table QR Ordering, KDS & Floor Management

> A production-ready, full-stack responsive web application designed for modern Indian dining establishments. It unites a high-contrast, thumb-friendly mobile guest ordering experience with a dark-mode operational dashboard for kitchen stations, floor captains, and restaurant owners.

---

## 🌟 Key Features & Modules

### 1. 📱 Table QR Entry & Guest Digital Menu (`/table/:tableId/menu`)
- **Real Phone-Scannable 2D QR Codes**: Standee cards for Tables T1–T6 that any phone camera (Google Lens, iPhone Camera, Paytm, GPay) scans and opens instantly.
- **Dynamic Table Selection**: Switch between tables T1 to T6 (defaulting to Table T5 with guests Aman & Riya).
- **Categories & Instant Search**: Filter by Starters, Mains, Breads, Drinks, Desserts, and Veg/Spice level.
- **Rich Dish Detail Drawer**:
  - Portion size toggle (Half / Full) with dynamic price calculation.
  - Spice level selector (Mild 🌶️, Medium 🌶️🌶️, Spicy 🌶️🌶️🌶️).
  - Special combo deal add-ons (e.g., *+ Mango Lassi ₹99* or *+ Garlic Naan*).
  - Guest tagging ("Who is this for?") enabling automated itemized split billing.
  - Allergen tags (Dairy, Nuts, Gluten) and special kitchen instructions.

### 2. 🍳 Staff Tablet Order Console & Kitchen Display System (KDS) (`/staff/kds`)
- **Incoming Order Queue**: Waitstaff reviews incoming table tickets and fires them to kitchen stations with 1 tap.
- **Station-Specific Routing**:
  - **TANDOOR**: Clay oven naans, rotis, paneer tikka, and chaap.
  - **CURRY**: Dal Makhani, Paneer Makhani, Dum Biryani, and desserts.
  - **DRINKS**: Mango Lassi, Masala Chai, and fresh sodas.
- **Live Elapsed Cooking Timers**: Real-time timer on each ticket with color-coded alerts (Green < 5m, Amber 5–10m, Pulsing Red > 10m).
- **Station Bump Controls**: Item-level status bumps (`Cooking` → `Ready` → `Served`) and full ticket completion.

### 3. ⏳ While-You-Wait Guest Experience (`/table/:tableId/wait`)
- **Live Cooking Progress Stepper**: Dynamic 4-step progress (`Ordered` → `Cooking` → `Plating / Ready` → `Served`) with real-time countdown timer.
- **1-Click High-Speed Wi-Fi**: Copy network credentials (`Zaika_Guest_5G` / `zaika2026`) with instant confirmation state.
- **Rewards Tracker**: Saffron Gold Member points progress bar and dining perks.
- **Interactive Spice Master Quiz**:
  - Head-to-Head play (*Aman vs Riya*) with alternating turns.
  - Table-vs-Table mode (*Table 5 vs Table 3*) with leaderboard scoring.
  - Fun Indian culinary trivia, chef fact explanations, and victory confetti!

### 4. 🛎️ One-Tap Call Waiter & Live Architectural Floor Map (`/table/:tableId/call` & `/staff/floor`)
- **Guest Call Bell**: Quick request chips (*Water*, *Napkins*, *Bill*, *Cutlery*, *Clean Table*).
- **Interactive Floor Blueprint**: Visual layout covering Window Boulevard, Main Dining Hall, and Patio Garden.
- **Real-Time Visual Alerts**: Pulsing glow rings, waiter response timer, and 1-tap *Acknowledge* & *Resolve* server dispatch.

### 5. 💳 Split Bill, Dynamic Bank UPI, Digital Receipt & 1-Tap Review (`/table/:tableId/pay`)
- **Itemized Bill Summary**: Subtotal, 5% GST, and grand total.
- **Flexible Bill Splitting**: Single bill, Split evenly (1/2, 1/3, etc.), or Split by guest items.
- **Dynamic Tip Buttons**: 0%, 5%, 10%, 15% tipping with instant total updates.
- **Direct Merchant Bank UPI**: Real NPCI standard `upi://pay` QR code for direct bank credit via GPay/PhonePe/Paytm with 0% MDR fee.
- **Official Digital Tax Receipt**: Includes FSSAI license number, GSTIN, invoice reference, and email receipt action.
- **1-Tap 5-Star Meal Review**: Interactive star rating with compliment chips (*Delicious Gravy*, *Super Fast Service*, *Cozy Ambiance*).

### 6. 📊 Owner Command Overview (`/staff/overview`)
- Real-time KPI bar (Active Tables 6/6, Today's Orders 45+, Live Day Sales ₹52k+, Avg Ticket Prep Time 14.2 min, Floor Alerts).
- Station throughput load meters (% load on Tandoor, Curry, Drinks).
- Live activity audit log streaming all floor and kitchen events.

### 7. 🔒 Zero-Leak Guest Privacy & Hotel Setup (`Hotel Setup & Security`)
- **Anonymous Dining Mode**: Guests order without mandatory phone numbers, sign-ups, or app downloads.
- **PCI-DSS Compliant**: No credit card or banking data stored on restaurant servers.
- **Role-Based Access Control**: Kitchen and floor staff see only ordered dishes, never customer personal details.
- **Master Admin PIN**: Protects revenue analytics, daily sales, and bank UPI settings behind a secret PIN.
- **FSSAI & GSTIN Legal Compliance**: Custom legal entity, license numbers, and address pre-formatted on all invoices.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **QR Engine**: `qrcode` (real 2D scan-ready matrix generation)
- **Sound Synthesis**: Native Web Audio API (oscillators for kitchen order bells and alerts without external audio files)
- **Visual FX**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd HOTEL

# Install dependencies
npm install

# Start local development server
npm run dev
```

The app will be live at `http://localhost:5174/`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📦 Project Structure

```
src/
├── assets/                  # Icons and static media
├── components/
│   ├── common/
│   │   ├── AddDishModal.tsx         # Add new dish with photo selector & upload
│   │   ├── QRScannerModal.tsx       # Real scannable QR standees (T1–T6) & camera scanner
│   │   └── RestaurantSetupModal.tsx # FSSAI, GST, Bank UPI settlement & privacy console
│   ├── guest/
│   │   ├── CallWaiterModal.tsx      # One-tap call waiter with request chips
│   │   ├── CartDrawer.tsx           # Order cart & fire-to-kitchen action
│   │   ├── DishModal.tsx            # Rich customization drawer (portion, spice, combo)
│   │   ├── GuestLayout.tsx          # Mobile phone mockup & thumb-friendly nav
│   │   ├── GuestMenu.tsx            # Digital menu with categories & search
│   │   ├── PayBillView.tsx          # Split bill, dynamic UPI QR, tax receipt & review
│   │   └── WhileYouWait.tsx         # Live kitchen sync, Wi-Fi copy & Spice Quiz
│   ├── layout/
│   │   └── HeaderNav.tsx            # Role switcher, table pill, audio & frame toggles
│   └── staff/
│       ├── StaffFloorMap.tsx        # Real-time architectural floor map with alert rings
│       ├── StaffKDS.tsx             # Kitchen Display System by station with elapsed timers
│       └── StaffOverview.tsx        # Executive KPIs, station throughput & audit feed
├── context/
│   └── DineOSContext.tsx            # Central reactive store & localStorage persistence
├── data/
│   ├── dishPhotos.ts                # Curated Indian dish photography presets
│   └── seedData.ts                  # Authentic dishes, tables T1–T6 & quiz questions
├── types/
│   ├── index.ts                     # TypeScript data models and interfaces
│   └── qrcode.d.ts                  # Type definitions for QR engine
└── utils/
    └── audio.ts                     # Web Audio API brass bell & chime synthesizer
```

---

## 📄 License

MIT License — Feel free to use and adapt for commercial restaurant operations.
