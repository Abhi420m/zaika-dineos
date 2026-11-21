export type TableId = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';

export type TableStatus = 'VACANT' | 'ORDERING' | 'COOKING' | 'EATING' | 'BILL' | 'HELP';

export type KitchenStation = 'TANDOOR' | 'CURRY' | 'DRINKS';

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy';

export type PortionSize = 'Half' | 'Full';

export interface DealCombo {
  name: string;
  price: number;
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Starters' | 'Mains' | 'Breads' | 'Drinks' | 'Desserts';
  kitchenStation: KitchenStation;
  priceHalf: number;
  priceFull: number;
  description: string;
  spiceDefault: SpiceLevel;
  allergens: string[];
  isVeg: boolean;
  image: string;
  popularTag?: 'Chef Special' | 'Bestseller' | 'Must Try' | 'Signature';
  dealCombo?: DealCombo;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  portion: PortionSize;
  unitPrice: number;
  quantity: number;
  spiceChoice: SpiceLevel;
  addons: { name: string; price: number }[];
  specialInstructions?: string;
  assignedGuest: string; // e.g. "Aman", "Riya", or "Shared"
  station: KitchenStation;
  itemStatus: 'Pending' | 'SentToKitchen' | 'Cooking' | 'Ready' | 'Served';
  totalPrice: number;
}

export type OrderStatus = 'NEW' | 'SENT_TO_KITCHEN' | 'COOKING' | 'READY' | 'SERVED' | 'PAID';

export interface Order {
  id: string;
  orderNumber: string;
  tableId: TableId;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  sentToKitchenAt?: number;
  readyAt?: number;
  servedAt?: number;
  paidAt?: number;
  subtotal: number;
  taxGst: number; // 5%
  tipAmount: number;
  tipPercentage: number;
  totalAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  paymentMethod?: 'Cash' | 'Card' | 'Apple Pay' | 'Google Pay' | 'Bank transfer';
  billSplit?: {
    type: 'even' | 'by_guest' | 'custom';
    splits: { guestName: string; amount: number; isPaid: boolean }[];
  };
  review?: {
    rating: number;
    tags: string[];
    comment?: string;
    createdAt: number;
  };
}

export interface WaiterCall {
  active: boolean;
  type?: 'Water' | 'Napkins' | 'Bill' | 'Cutlery' | 'Clean Table' | 'General';
  requestedAt?: number;
  acknowledged?: boolean;
  acknowledgedAt?: number;
  resolved?: boolean;
}

export interface TableInfo {
  id: TableId;
  name: string;
  section: 'Main Dining' | 'Window Booth' | 'Patio Garden' | 'Chef Terrace';
  capacity: number;
  status: TableStatus;
  guests: string[];
  activeGuestsCount: number;
  serverName: string;
  seatedAt: number;
  waiterRequest: WaiterCall;
  currentOrderId?: string;
  notes?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  mode: 'head_to_head' | 'table_vs_table';
  currentQuestionIndex: number;
  player1Name: string; // e.g. "Aman"
  player2Name: string; // e.g. "Riya" or "Table 3"
  player1Score: number;
  player2Score: number;
  currentTurn: 'player1' | 'player2';
  selectedOption: number | null;
  isAnswered: boolean;
  isFinished: boolean;
}

export interface RestaurantProfile {
  name: string;
  tagline: string;
  legalEntity: string;
  fssaiNumber: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  upiId: string; // Merchant VPA for zero-fee direct bank settlements
  merchantName: string;
  paymentGateway: 'UPI_DIRECT' | 'RAZORPAY' | 'STRIPE' | 'CASH_CARD';
  razorpayKeyId?: string;
  razorpaySecret?: string;
  anonymousMode: boolean; // End-to-end guest privacy
  adminPin: string; // Master pin to view revenue & settings
  isRegistered: boolean;
}
