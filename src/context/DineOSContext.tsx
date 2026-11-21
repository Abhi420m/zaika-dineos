import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  TableId,
  TableStatus,
  TableInfo,
  MenuItem,
  OrderItem,
  Order,
  OrderStatus,
  KitchenStation,
  WaiterCall,
  PortionSize,
  SpiceLevel,
  RestaurantProfile
} from '../types';
import { INITIAL_MENU, INITIAL_TABLES, INITIAL_ORDERS, INITIAL_RESTAURANT_PROFILE } from '../data/seedData';
import { sounds } from '../utils/audio';

export type MainView = 'guest' | 'staff_kds' | 'staff_floor' | 'staff_overview';
export type GuestTab = 'menu' | 'wait' | 'call' | 'pay';

interface DineOSContextType {
  // Navigation & UI View
  mainView: MainView;
  setMainView: (view: MainView) => void;
  guestTab: GuestTab;
  setGuestTab: (tab: GuestTab) => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
  soundMuted: boolean;
  toggleSound: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;

  // Staff Privacy & Security Lock
  isStaffUnlocked: boolean;
  staffAuthModalOpen: boolean;
  setStaffAuthModalOpen: (open: boolean) => void;
  pendingStaffView: MainView | null;
  setPendingStaffView: (view: MainView | null) => void;
  unlockStaff: (pin: string) => boolean;
  lockStaff: () => void;

  // Restaurant Business Profile & Settings
  restaurantProfile: RestaurantProfile;
  updateRestaurantProfile: (profile: Partial<RestaurantProfile>) => void;
  restaurantSetupModalOpen: boolean;
  setRestaurantSetupModalOpen: (open: boolean) => void;

  // Selected Table
  selectedTableId: TableId;
  setSelectedTableId: (id: TableId) => void;
  activeTable: TableInfo;

  // Data
  menu: MenuItem[];
  tables: TableInfo[];
  orders: Order[];

  // Active Guest Cart
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Dish Modal
  selectedDish: MenuItem | null;
  setSelectedDish: (dish: MenuItem | null) => void;

  // Add Dish Modal
  addDishModalOpen: boolean;
  setAddDishModalOpen: (open: boolean) => void;
  addMenuItem: (item: MenuItem) => void;

  // Call Waiter Modal
  callWaiterModalOpen: boolean;
  setCallWaiterModalOpen: (open: boolean) => void;

  // Order Actions
  placeOrder: (tableId: TableId) => Order | null;
  sendToKitchen: (orderId: string) => void;
  updateItemStationStatus: (orderId: string, itemId: string, status: OrderItem['itemStatus']) => void;
  bumpOrder: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;

  // Waiter Actions
  callWaiter: (tableId: TableId, type: WaiterCall['type']) => void;
  acknowledgeWaiter: (tableId: TableId) => void;
  resolveWaiter: (tableId: TableId) => void;

  // Payment & Review Actions
  updateTip: (orderId: string, percentage: number, customAmount?: number) => void;
  confirmPayment: (orderId: string, method: NonNullable<Order['paymentMethod']>) => void;
  submitReview: (orderId: string, rating: number, tags: string[], comment?: string) => void;

  // Stats & Helpers
  getOrdersForTable: (tableId: TableId) => Order[];
  getCurrentOrderForTable: (tableId: TableId) => Order | undefined;
  activeOrdersCount: number;
  totalSalesToday: number;
  occupiedTablesCount: number;
  openWaiterRequestsCount: number;
  resetDemoData: () => void;
}

const DineOSContext = createContext<DineOSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'zaika_dineos_v1';

export const DineOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Staff Security & Privacy Lock (Defaults to locked for guest privacy)
  const [isStaffUnlocked, setIsStaffUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('zaika_staff_session') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [staffAuthModalOpen, setStaffAuthModalOpen] = useState<boolean>(false);
  const [pendingStaffView, setPendingStaffView] = useState<MainView | null>(null);

  // Navigation State parsed from initial URL (params, hash, or path)
  // If staff is not unlocked, guests are strictly locked into 'guest' view
  const [mainView, setMainView] = useState<MainView>(() => {
    if (typeof window !== 'undefined') {
      const isUnlocked = sessionStorage.getItem('zaika_staff_session') === 'true';
      if (isUnlocked) {
        const params = new URLSearchParams(window.location.search);
        const v = params.get('view');
        if (v && ['guest', 'staff_kds', 'staff_floor', 'staff_overview'].includes(v)) {
          return v as MainView;
        }
        const href = window.location.href.toLowerCase();
        if (href.includes('/staff/kds') || href.includes('kds')) return 'staff_kds';
        if (href.includes('/staff/floor') || href.includes('floor')) return 'staff_floor';
        if (href.includes('/staff/overview') || href.includes('overview')) return 'staff_overview';
      }
    }
    return 'guest';
  });

  const [guestTab, setGuestTab] = useState<GuestTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['menu', 'wait', 'call', 'pay'].includes(tab)) {
        return tab as GuestTab;
      }
      const href = window.location.href.toLowerCase();
      if (href.includes('/wait')) return 'wait';
      if (href.includes('/call')) return 'call';
      if (href.includes('/pay')) return 'pay';
    }
    return 'menu';
  });

  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);

  // Active Table (defaults to T5 or query param ?table=T...)
  const [selectedTableId, setSelectedTableId] = useState<TableId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        const clean = urlTable.toUpperCase();
        if (['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].includes(clean)) {
          return clean as TableId;
        }
        if (['1', '2', '3', '4', '5', '6'].includes(clean)) {
          return `T${clean}` as TableId;
        }
      }
      // Also check hash and pathname (e.g., #table=T1 or /table/T1/menu)
      const fullUrl = window.location.href;
      const match = fullUrl.match(/table[=_/-]?(T[1-6]|[1-6])/i);
      if (match && match[1]) {
        const found = match[1].toUpperCase();
        return (found.startsWith('T') ? found : `T${found}`) as TableId;
      }
    }
    return 'T5';
  });

  // Sync table ID & view to URL for seamless QR scans and sharing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('table', selectedTableId);
        if (mainView !== 'guest') {
          url.searchParams.set('view', mainView);
        } else {
          url.searchParams.delete('view');
        }
        if (guestTab !== 'menu' && mainView === 'guest') {
          url.searchParams.set('tab', guestTab);
        } else {
          url.searchParams.delete('tab');
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Fallback for isolated contexts
      }
    }
  }, [selectedTableId, mainView, guestTab]);

  // Core Data
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_MENU;
  });

  const [tables, setTables] = useState<TableInfo[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_tables');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_TABLES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_ORDERS;
  });

  // Guest Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

  // Modals
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [addDishModalOpen, setAddDishModalOpen] = useState<boolean>(false);
  const [callWaiterModalOpen, setCallWaiterModalOpen] = useState<boolean>(false);
  const [restaurantSetupModalOpen, setRestaurantSetupModalOpen] = useState<boolean>(false);

  // Restaurant Business Profile
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_RESTAURANT_PROFILE;
  });

  const updateRestaurantProfile = (updated: Partial<RestaurantProfile>) => {
    sounds.playSuccess();
    setRestaurantProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem(LOCAL_STORAGE_KEY + '_profile', JSON.stringify(next));
      return next;
    });
  };

  // Persist menu, tables & orders to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_profile', JSON.stringify(restaurantProfile));
  }, [restaurantProfile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_orders', JSON.stringify(orders));
  }, [orders]);

  // Guarded View Switcher: Intercepts staff views if not authenticated
  const handleSetMainView = useCallback((view: MainView) => {
    if (view === 'guest') {
      setMainView('guest');
      return;
    }
    if (!isStaffUnlocked) {
      setPendingStaffView(view);
      setStaffAuthModalOpen(true);
      return;
    }
    setMainView(view);
  }, [isStaffUnlocked]);

  // Unlock Staff Mode with 4-digit PIN
  const unlockStaff = useCallback((pin: string): boolean => {
    const validPin = restaurantProfile.adminPin || '1234';
    if (pin.trim() === validPin.trim()) {
      sounds.playSuccess();
      setIsStaffUnlocked(true);
      try {
        sessionStorage.setItem('zaika_staff_session', 'true');
      } catch {
        // Fallback
      }
      setStaffAuthModalOpen(false);
      if (pendingStaffView) {
        setMainView(pendingStaffView);
        setPendingStaffView(null);
      } else {
        setMainView('staff_kds');
      }
      return true;
    }
    sounds.playAlert();
    return false;
  }, [restaurantProfile.adminPin, pendingStaffView]);

  // Re-lock to Guest Mode (Complete privacy)
  const lockStaff = useCallback(() => {
    sounds.playTap();
    setIsStaffUnlocked(false);
    try {
      sessionStorage.removeItem('zaika_staff_session');
    } catch {
      // Fallback
    }
    setMainView('guest');
    setGuestTab('menu');
  }, []);

  // Guarded Admin Modals (Cannot be opened by guests)
  const handleSetAddDishModalOpen = useCallback((open: boolean) => {
    if (open && !isStaffUnlocked) {
      setPendingStaffView(null);
      setStaffAuthModalOpen(true);
      return;
    }
    setAddDishModalOpen(open);
  }, [isStaffUnlocked]);

  const handleSetRestaurantSetupModalOpen = useCallback((open: boolean) => {
    if (open && !isStaffUnlocked) {
      setPendingStaffView(null);
      setStaffAuthModalOpen(true);
      return;
    }
    setRestaurantSetupModalOpen(open);
  }, [isStaffUnlocked]);

  const addMenuItem = (item: MenuItem) => {
    sounds.playSuccess();
    setMenu(prev => [item, ...prev]);
  };

  const toggleSound = () => {
    const isMute = sounds.toggleMute();
    setSoundMuted(isMute);
  };

  const activeTable = tables.find(t => t.id === selectedTableId) || tables[4]; // Default T5

  // Helper getters
  const getOrdersForTable = useCallback((tableId: TableId): Order[] => {
    return orders.filter(o => o.tableId === tableId);
  }, [orders]);

  const getCurrentOrderForTable = useCallback((tableId: TableId): Order | undefined => {
    return orders.find(o => o.tableId === tableId && o.paymentStatus !== 'PAID') ||
           orders.filter(o => o.tableId === tableId).slice(-1)[0];
  }, [orders]);

  // Cart Management
  const addToCart = (newItem: OrderItem) => {
    sounds.playTap();
    setCart(prev => {
      // Check if same item with same portion, spice and guest exists
      const existingIdx = prev.findIndex(
        i => i.menuItemId === newItem.menuItemId &&
             i.portion === newItem.portion &&
             i.spiceChoice === newItem.spiceChoice &&
             i.assignedGuest === newItem.assignedGuest &&
             JSON.stringify(i.addons) === JSON.stringify(newItem.addons)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + newItem.quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          totalPrice: (existing.unitPrice + existing.addons.reduce((sum, a) => sum + a.price, 0)) * newQty
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    sounds.playTap();
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const baseUnit = item.unitPrice + item.addons.reduce((sum, a) => sum + a.price, 0);
          return {
            ...item,
            quantity: newQty,
            totalPrice: baseUnit * newQty
          };
        }
        return item;
      }).filter(Boolean) as OrderItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    sounds.playTap();
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place Order Action (Guest places draft cart)
  const placeOrder = (tableId: TableId): Order | null => {
    if (cart.length === 0) return null;

    sounds.playOrderBell();

    const subtotal = cart.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxGst = Math.round(subtotal * 0.05);
    const tipAmount = Math.round(subtotal * 0.05); // Default 5% tip
    const totalAmount = subtotal + taxGst + tipAmount;

    // Split calculations for Aman & Riya if Table 5
    const table = tables.find(t => t.id === tableId);
    const guests = table?.guests || ['Aman', 'Riya'];

    const splits = guests.map(guest => {
      const guestItems = cart.filter(i => i.assignedGuest === guest);
      const sharedItems = cart.filter(i => i.assignedGuest === 'Shared' || i.assignedGuest === 'Table');
      const guestDirectSubtotal = guestItems.reduce((s, i) => s + i.totalPrice, 0);
      const sharedSplit = sharedItems.reduce((s, i) => s + i.totalPrice, 0) / (guests.length || 1);
      const individualSubtotal = guestDirectSubtotal + sharedSplit;
      const individualTotal = Math.round(individualSubtotal * 1.10); // + tax + tip
      return {
        guestName: guest,
        amount: individualTotal,
        isPaid: false
      };
    });

    // Check if table already has an active unpaid order
    const existingOrder = orders.find(o => o.tableId === tableId && o.paymentStatus !== 'PAID');

    let newOrder: Order;
    if (existingOrder) {
      // Append items to existing order
      const updatedItems = [...existingOrder.items, ...cart.map(i => ({ ...i, itemStatus: 'Pending' as const }))];
      const newSubtotal = existingOrder.subtotal + subtotal;
      const newTax = Math.round(newSubtotal * 0.05);
      const newTip = Math.round(newSubtotal * (existingOrder.tipPercentage / 100 || 0.05));
      const newTotal = newSubtotal + newTax + newTip;

      newOrder = {
        ...existingOrder,
        items: updatedItems,
        subtotal: newSubtotal,
        taxGst: newTax,
        tipAmount: newTip,
        totalAmount: newTotal,
        status: 'NEW'
      };

      setOrders(prev => prev.map(o => o.id === existingOrder.id ? newOrder : o));
    } else {
      const orderNum = `#ORD-${1080 + orders.length + 1}`;
      newOrder = {
        id: `ORD-${Date.now()}`,
        orderNumber: orderNum,
        tableId,
        items: cart.map(i => ({ ...i, itemStatus: 'Pending' })),
        status: 'NEW',
        createdAt: Date.now(),
        subtotal,
        taxGst,
        tipAmount,
        tipPercentage: 5,
        totalAmount,
        paymentStatus: 'UNPAID',
        billSplit: {
          type: 'by_guest',
          splits
        }
      };

      setOrders(prev => [newOrder, ...prev]);
    }

    // Update Table status
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'COOKING',
          currentOrderId: newOrder.id
        };
      }
      return t;
    }));

    clearCart();
    setCartDrawerOpen(false);
    setGuestTab('wait'); // Immediately take guest to While-You-Wait screen!

    return newOrder;
  };

  // Staff: Send order from console to Kitchen
  const sendToKitchen = (orderId: string) => {
    sounds.playOrderBell();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'COOKING',
          sentToKitchenAt: Date.now(),
          items: order.items.map(item => ({
            ...item,
            itemStatus: item.itemStatus === 'Pending' ? 'Cooking' : item.itemStatus
          }))
        };
      }
      return order;
    }));

    // Update Table status to COOKING
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      setTables(prev => prev.map(t => {
        if (t.id === targetOrder.tableId && t.status !== 'HELP') {
          return { ...t, status: 'COOKING' };
        }
        return t;
      }));
    }
  };

  // Update item station status (Cooking -> Ready -> Served)
  const updateItemStationStatus = (orderId: string, itemId: string, newStatus: OrderItem['itemStatus']) => {
    sounds.playTap();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            return { ...item, itemStatus: newStatus };
          }
          return item;
        });

        // If all items are ready or served, advance order status
        const allReady = updatedItems.every(i => i.itemStatus === 'Ready' || i.itemStatus === 'Served');
        const allServed = updatedItems.every(i => i.itemStatus === 'Served');

        let nextOrderStatus = order.status;
        if (allServed) {
          nextOrderStatus = 'SERVED';
        } else if (allReady) {
          nextOrderStatus = 'READY';
        }

        return {
          ...order,
          items: updatedItems,
          status: nextOrderStatus,
          readyAt: allReady && !order.readyAt ? Date.now() : order.readyAt,
          servedAt: allServed && !order.servedAt ? Date.now() : order.servedAt
        };
      }
      return order;
    }));
  };

  // Bump entire order ticket
  const bumpOrder = (orderId: string) => {
    sounds.playSuccess();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'READY',
          readyAt: Date.now(),
          items: order.items.map(i => ({
            ...i,
            itemStatus: i.itemStatus === 'Cooking' || i.itemStatus === 'Pending' ? 'Ready' : i.itemStatus
          }))
        };
      }
      return order;
    }));
  };

  // Mark Order as Served
  const markOrderServed = (orderId: string) => {
    sounds.playSuccess();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'SERVED',
          servedAt: Date.now(),
          items: order.items.map(i => ({ ...i, itemStatus: 'Served' }))
        };
      }
      return order;
    }));

    const order = orders.find(o => o.id === orderId);
    if (order) {
      setTables(prev => prev.map(t => {
        if (t.id === order.tableId) {
          return { ...t, status: 'EATING' };
        }
        return t;
      }));
    }
  };

  // Call Waiter
  const callWaiter = (tableId: TableId, type: WaiterCall['type'] = 'General') => {
    sounds.playWaiterCall();
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          status: 'HELP',
          waiterRequest: {
            active: true,
            type,
            requestedAt: Date.now(),
            acknowledged: false,
            resolved: false
          }
        };
      }
      return table;
    }));
  };

  // Acknowledge Waiter Call
  const acknowledgeWaiter = (tableId: TableId) => {
    sounds.playTap();
    setTables(prev => prev.map(table => {
      if (table.id === tableId && table.waiterRequest.active) {
        return {
          ...table,
          waiterRequest: {
            ...table.waiterRequest,
            acknowledged: true,
            acknowledgedAt: Date.now()
          }
        };
      }
      return table;
    }));
  };

  // Resolve Waiter Call
  const resolveWaiter = (tableId: TableId) => {
    sounds.playSuccess();
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        // Return table to reasonable previous status
        const activeOrder = orders.find(o => o.tableId === tableId && o.paymentStatus !== 'PAID');
        let newStatus: TableStatus = 'EATING';
        if (!activeOrder) {
          newStatus = 'ORDERING';
        } else if (activeOrder.status === 'COOKING') {
          newStatus = 'COOKING';
        } else if (activeOrder.status === 'READY' || activeOrder.status === 'SERVED') {
          newStatus = 'EATING';
        }

        return {
          ...table,
          status: newStatus,
          waiterRequest: {
            active: false,
            resolved: true
          }
        };
      }
      return table;
    }));
  };

  // Tip Selector
  const updateTip = (orderId: string, percentage: number, customAmount?: number) => {
    sounds.playTap();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const tipVal = customAmount !== undefined ? customAmount : Math.round(order.subtotal * (percentage / 100));
        const total = order.subtotal + order.taxGst + tipVal;
        return {
          ...order,
          tipPercentage: percentage,
          tipAmount: tipVal,
          totalAmount: total
        };
      }
      return order;
    }));
  };

  // Confirm Payment
  const confirmPayment = (orderId: string, method: NonNullable<Order['paymentMethod']>) => {
    sounds.playSuccess();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod: method,
          paidAt: Date.now()
        };
      }
      return order;
    }));

    const order = orders.find(o => o.id === orderId);
    if (order) {
      setTables(prev => prev.map(t => {
        if (t.id === order.tableId) {
          return {
            ...t,
            status: 'VACANT',
            notes: 'Table paid and vacated'
          };
        }
        return t;
      }));
    }
  };

  // Submit Review
  const submitReview = (orderId: string, rating: number, tags: string[], comment?: string) => {
    sounds.playSuccess();
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          review: {
            rating,
            tags,
            comment,
            createdAt: Date.now()
          }
        };
      }
      return order;
    }));
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_menu');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_tables');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_orders');
    setMenu(INITIAL_MENU);
    setTables(INITIAL_TABLES);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setSelectedTableId('T5');
    setMainView('guest');
    setGuestTab('menu');
    sounds.playSuccess();
  };

  // Computed Metrics for Staff Overview
  const activeOrdersCount = orders.filter(o => o.paymentStatus !== 'PAID').length + 42; // Seeded base + live
  const totalSalesToday = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : o.subtotal), 0) + 47250;
  const occupiedTablesCount = tables.filter(t => t.status !== 'VACANT').length;
  const openWaiterRequestsCount = tables.filter(t => t.waiterRequest.active).length;

  return (
    <DineOSContext.Provider
      value={{
        mainView: isStaffUnlocked ? mainView : 'guest',
        setMainView: handleSetMainView,
        guestTab,
        setGuestTab,
        isDeviceFrame,
        setIsDeviceFrame,
        soundMuted,
        toggleSound,
        qrModalOpen,
        setQrModalOpen,

        isStaffUnlocked,
        staffAuthModalOpen,
        setStaffAuthModalOpen,
        pendingStaffView,
        setPendingStaffView,
        unlockStaff,
        lockStaff,

        selectedTableId,
        setSelectedTableId,
        activeTable,

        restaurantProfile,
        updateRestaurantProfile,
        restaurantSetupModalOpen,
        setRestaurantSetupModalOpen: handleSetRestaurantSetupModalOpen,

        menu,
        tables,
        orders,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,

        selectedDish,
        setSelectedDish,
        addDishModalOpen,
        setAddDishModalOpen: handleSetAddDishModalOpen,
        addMenuItem,

        callWaiterModalOpen,
        setCallWaiterModalOpen,

        placeOrder,
        sendToKitchen,
        updateItemStationStatus,
        bumpOrder,
        markOrderServed,

        callWaiter,
        acknowledgeWaiter,
        resolveWaiter,

        updateTip,
        confirmPayment,
        submitReview,

        getOrdersForTable,
        getCurrentOrderForTable,
        activeOrdersCount,
        totalSalesToday,
        occupiedTablesCount,
        openWaiterRequestsCount,
        resetDemoData
      }}
    >
      {children}
    </DineOSContext.Provider>
  );
};

export const useDineOS = () => {
  const context = useContext(DineOSContext);
  if (!context) {
    throw new Error('useDineOS must be used within a DineOSProvider');
  }
  return context;
};
