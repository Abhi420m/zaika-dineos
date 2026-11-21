import { MenuItem, TableInfo, Order, QuizQuestion, RestaurantProfile } from '../types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'dish-1',
    name: 'Paneer Makhani',
    hindiName: 'पनीर मक्खनी',
    category: 'Mains',
    kitchenStation: 'CURRY',
    priceHalf: 240,
    priceFull: 380,
    description: 'Char-grilled cottage cheese cubes simmered in a velvety satin gravy of vine-ripened tomatoes, cashew butter, and aromatic fenugreek.',
    spiceDefault: 'Medium',
    allergens: ['Dairy', 'Tree Nuts'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Chef Special',
    dealCombo: {
      name: '+ Garlic Naan & Salted Jeera Lassi',
      price: 119,
      description: '1 buttered garlic naan & chilled cumin-spiced yogurt cooler.'
    }
  },
  {
    id: 'dish-2',
    name: 'Dal Makhani',
    hindiName: 'दाल मक्खनी',
    category: 'Mains',
    kitchenStation: 'CURRY',
    priceHalf: 210,
    priceFull: 340,
    description: 'Slow-simmered black urad lentils & kidney beans cooked overnight on charcoal tandoor with fresh churned white butter and cream.',
    spiceDefault: 'Mild',
    allergens: ['Dairy'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Bestseller',
    dealCombo: {
      name: '+ Chur Chur Naan',
      price: 69,
      description: 'Crisp crushed flaky naan dusted with amchur & kasuri methi.'
    }
  },
  {
    id: 'dish-3',
    name: 'Dum Hyderabadi Veg Biryani',
    hindiName: 'दम वेज बिरयानी',
    category: 'Mains',
    kitchenStation: 'CURRY',
    priceHalf: 260,
    priceFull: 410,
    description: 'Aged long-grain basmati rice layered with garden vegetables, saffron milk, fried onions, and whole spices sealed in purdah dough.',
    spiceDefault: 'Medium',
    allergens: ['Dairy', 'Tree Nuts'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Signature',
    dealCombo: {
      name: '+ Burani Garlic Raita & Mirchi Salan',
      price: 59,
      description: 'Smoky roasted garlic spiced raita and sesame-peanut salan.'
    }
  },
  {
    id: 'dish-4',
    name: 'Tandoori Soya Chaap & Paneer Tikka',
    hindiName: 'तंदूरी पनीर टिक्का',
    category: 'Starters',
    kitchenStation: 'TANDOOR',
    priceHalf: 220,
    priceFull: 350,
    description: 'Malai & mustard marinated cottage cheese and soya ribs charred in clay oven with bell peppers, served with mint coriander relish.',
    spiceDefault: 'Spicy',
    allergens: ['Dairy', 'Gluten', 'Mustard'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Must Try',
    dealCombo: {
      name: '+ Mango Lassi ₹99',
      price: 99,
      description: 'Alphonso mango pulp blended with creamy thick Greek yogurt.'
    }
  },
  {
    id: 'dish-5',
    name: 'Crispy Dahi Ke Kebab',
    hindiName: 'दही के कबाब',
    category: 'Starters',
    kitchenStation: 'TANDOOR',
    priceHalf: 190,
    priceFull: 310,
    description: 'Golden spiced hung curd patties encrusted with roasted bell pepper seeds and panko, melting instantly on the palate.',
    spiceDefault: 'Mild',
    allergens: ['Dairy', 'Gluten'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Chef Special'
  },
  {
    id: 'dish-6',
    name: 'Garlic Butter Naan',
    hindiName: 'गार्लिक बटर नान',
    category: 'Breads',
    kitchenStation: 'TANDOOR',
    priceHalf: 60,
    priceFull: 95,
    description: 'Clay-oven baked leavened flatbread studded with fresh crushed garlic cloves, fresh cilantro, and brushed generously with Amul butter.',
    spiceDefault: 'Mild',
    allergens: ['Dairy', 'Gluten'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Bestseller'
  },
  {
    id: 'dish-7',
    name: 'Tandoori Roti Basket (4 pcs)',
    hindiName: 'तंदूरी रोटी बास्केट',
    category: 'Breads',
    kitchenStation: 'TANDOOR',
    priceHalf: 70,
    priceFull: 120,
    description: 'Stone-ground whole wheat rotis cooked crisp in the clay oven, offered plain or brushed with desi ghee.',
    spiceDefault: 'Mild',
    allergens: ['Gluten', 'Dairy'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-8',
    name: 'Alphonso Mango Lassi',
    hindiName: 'आम की लस्सी',
    category: 'Drinks',
    kitchenStation: 'DRINKS',
    priceHalf: 110,
    priceFull: 160,
    description: 'Authentic Ratnagiri Alphonso mango pulp churned with rich curd, green cardamom seed powder, and slivered pistachios.',
    spiceDefault: 'Mild',
    allergens: ['Dairy', 'Tree Nuts'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Bestseller'
  },
  {
    id: 'dish-9',
    name: 'Kullad Masala Chai',
    hindiName: 'कुल्हड़ मसाला चाय',
    category: 'Drinks',
    kitchenStation: 'DRINKS',
    priceHalf: 50,
    priceFull: 85,
    description: 'Assam CTC brew boiled with whole ginger, crushed green cardamom, cinnamon quill, and organic jaggery in an earthen clay pot.',
    spiceDefault: 'Mild',
    allergens: ['Dairy'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Must Try'
  },
  {
    id: 'dish-10',
    name: 'Spiced Kachumber Salad',
    hindiName: 'कचुम्बर सलाद',
    category: 'Starters',
    kitchenStation: 'CURRY',
    priceHalf: 90,
    priceFull: 140,
    description: 'Diced crisp English cucumbers, vine tomatoes, shallots, and green chilies tossed with rock salt, roasted cumin, and Key lime juice.',
    spiceDefault: 'Medium',
    allergens: [],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-11',
    name: 'Warm Shahi Gulab Jamun (2 pcs)',
    hindiName: 'शाही गुलाब जामुन',
    category: 'Desserts',
    kitchenStation: 'CURRY',
    priceHalf: 95,
    priceFull: 160,
    description: 'Golden mawa dumplings soaked in saffron and rose petal infused light sugar syrup, topped with toasted almond flakes.',
    spiceDefault: 'Mild',
    allergens: ['Dairy', 'Gluten', 'Tree Nuts'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    popularTag: 'Chef Special'
  },
  {
    id: 'dish-12',
    name: 'Fresh Nimbu Soda (Sweet & Salted)',
    hindiName: 'ताज़ा शिकंजी सोडा',
    category: 'Drinks',
    kitchenStation: 'DRINKS',
    priceHalf: 70,
    priceFull: 110,
    description: 'Hand-pressed fresh lemon fizzed with bubbling soda, pink Himalayan rock salt, mint sprigs, and roasted jeera.',
    spiceDefault: 'Mild',
    allergens: [],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_TABLES: TableInfo[] = [
  {
    id: 'T1',
    name: 'Table 1 - Window 1',
    section: 'Window Booth',
    capacity: 4,
    status: 'EATING',
    guests: ['Kabir', 'Ananya'],
    activeGuestsCount: 2,
    serverName: 'Rahul',
    seatedAt: Date.now() - 42 * 60 * 1000,
    waiterRequest: { active: false },
    currentOrderId: 'ORD-1081',
    notes: 'Anniversary celebration'
  },
  {
    id: 'T2',
    name: 'Table 2 - Center Cozy',
    section: 'Main Dining',
    capacity: 2,
    status: 'ORDERING',
    guests: ['Sameer', 'Priya'],
    activeGuestsCount: 2,
    serverName: 'Pooja',
    seatedAt: Date.now() - 8 * 60 * 1000,
    waiterRequest: { active: false },
    currentOrderId: 'ORD-1082',
    notes: 'Looking at vegan options'
  },
  {
    id: 'T3',
    name: 'Table 3 - Royal Booth',
    section: 'Main Dining',
    capacity: 6,
    status: 'COOKING',
    guests: ['Verma Family (4)'],
    activeGuestsCount: 4,
    serverName: 'Rahul',
    seatedAt: Date.now() - 19 * 60 * 1000,
    waiterRequest: { active: false },
    currentOrderId: 'ORD-1083',
    notes: 'Kids food mild spice'
  },
  {
    id: 'T4',
    name: 'Table 4 - Patio Terrace',
    section: 'Patio Garden',
    capacity: 4,
    status: 'BILL',
    guests: ['Arjun', 'Meera', 'Rohan'],
    activeGuestsCount: 3,
    serverName: 'Vikram',
    seatedAt: Date.now() - 55 * 60 * 1000,
    waiterRequest: { active: true, type: 'Bill', requestedAt: Date.now() - 95 * 1000 },
    currentOrderId: 'ORD-1084',
    notes: 'Split bill request'
  },
  {
    id: 'T5',
    name: 'Table 5 - Signature Window',
    section: 'Window Booth',
    capacity: 2,
    status: 'COOKING',
    guests: ['Aman', 'Riya'],
    activeGuestsCount: 2,
    serverName: 'Rahul',
    seatedAt: Date.now() - 14 * 60 * 1000,
    waiterRequest: { active: false },
    currentOrderId: 'ORD-1085',
    notes: 'Default demo active table'
  },
  {
    id: 'T6',
    name: 'Table 6 - Chef Counter',
    section: 'Chef Terrace',
    capacity: 4,
    status: 'HELP',
    guests: ['Karan', 'Simran'],
    activeGuestsCount: 2,
    serverName: 'Pooja',
    seatedAt: Date.now() - 28 * 60 * 1000,
    waiterRequest: { active: true, type: 'Water', requestedAt: Date.now() - 48 * 1000 },
    currentOrderId: 'ORD-1086',
    notes: 'Requested extra chilled water & napkins'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1085',
    orderNumber: '#ORD-1085',
    tableId: 'T5',
    status: 'COOKING',
    createdAt: Date.now() - 12 * 60 * 1000,
    sentToKitchenAt: Date.now() - 11 * 60 * 1000,
    subtotal: 1140,
    taxGst: 57,
    tipAmount: 60,
    tipPercentage: 5,
    totalAmount: 1257,
    paymentStatus: 'UNPAID',
    items: [
      {
        id: 'ord-item-1',
        menuItemId: 'dish-1',
        name: 'Paneer Makhani',
        portion: 'Full',
        unitPrice: 380,
        quantity: 1,
        spiceChoice: 'Medium',
        addons: [],
        specialInstructions: 'Extra butter on top please',
        assignedGuest: 'Riya',
        station: 'CURRY',
        itemStatus: 'Cooking',
        totalPrice: 380
      },
      {
        id: 'ord-item-2',
        menuItemId: 'dish-2',
        name: 'Dal Makhani',
        portion: 'Half',
        unitPrice: 210,
        quantity: 1,
        spiceChoice: 'Mild',
        addons: [],
        specialInstructions: 'Less spicy',
        assignedGuest: 'Aman',
        station: 'CURRY',
        itemStatus: 'Cooking',
        totalPrice: 210
      },
      {
        id: 'ord-item-3',
        menuItemId: 'dish-6',
        name: 'Garlic Butter Naan',
        portion: 'Full',
        unitPrice: 95,
        quantity: 3,
        spiceChoice: 'Mild',
        addons: [],
        specialInstructions: 'Crisp and hot',
        assignedGuest: 'Shared',
        station: 'TANDOOR',
        itemStatus: 'Ready',
        totalPrice: 285
      },
      {
        id: 'ord-item-4',
        menuItemId: 'dish-8',
        name: 'Alphonso Mango Lassi',
        portion: 'Full',
        unitPrice: 160,
        quantity: 1,
        spiceChoice: 'Mild',
        addons: [],
        specialInstructions: 'Less sweet',
        assignedGuest: 'Aman',
        station: 'DRINKS',
        itemStatus: 'Served',
        totalPrice: 160
      },
      {
        id: 'ord-item-5',
        menuItemId: 'dish-11',
        name: 'Warm Shahi Gulab Jamun (2 pcs)',
        portion: 'Half',
        unitPrice: 95,
        quantity: 1,
        spiceChoice: 'Mild',
        addons: [],
        specialInstructions: 'Serve warm after mains',
        assignedGuest: 'Riya',
        station: 'CURRY',
        itemStatus: 'Pending',
        totalPrice: 95
      }
    ],
    billSplit: {
      type: 'by_guest',
      splits: [
        { guestName: 'Aman', amount: 562, isPaid: false },
        { guestName: 'Riya', amount: 695, isPaid: false }
      ]
    }
  },
  {
    id: 'ORD-1083',
    orderNumber: '#ORD-1083',
    tableId: 'T3',
    status: 'COOKING',
    createdAt: Date.now() - 17 * 60 * 1000,
    sentToKitchenAt: Date.now() - 16 * 60 * 1000,
    subtotal: 1390,
    taxGst: 69.5,
    tipAmount: 0,
    tipPercentage: 0,
    totalAmount: 1459.5,
    paymentStatus: 'UNPAID',
    items: [
      {
        id: 'ord-item-10',
        menuItemId: 'dish-3',
        name: 'Dum Hyderabadi Veg Biryani',
        portion: 'Full',
        unitPrice: 410,
        quantity: 2,
        spiceChoice: 'Medium',
        addons: [],
        specialInstructions: 'Extra raita',
        assignedGuest: 'Table',
        station: 'CURRY',
        itemStatus: 'Cooking',
        totalPrice: 820
      },
      {
        id: 'ord-item-11',
        menuItemId: 'dish-4',
        name: 'Tandoori Soya Chaap & Paneer Tikka',
        portion: 'Full',
        unitPrice: 350,
        quantity: 1,
        spiceChoice: 'Spicy',
        addons: [],
        specialInstructions: 'Crispy edges',
        assignedGuest: 'Table',
        station: 'TANDOOR',
        itemStatus: 'Cooking',
        totalPrice: 350
      },
      {
        id: 'ord-item-12',
        menuItemId: 'dish-12',
        name: 'Fresh Nimbu Soda (Sweet & Salted)',
        portion: 'Full',
        unitPrice: 110,
        quantity: 2,
        spiceChoice: 'Mild',
        addons: [],
        specialInstructions: 'Extra ice',
        assignedGuest: 'Table',
        station: 'DRINKS',
        itemStatus: 'Ready',
        totalPrice: 220
      }
    ]
  },
  {
    id: 'ORD-1084',
    orderNumber: '#ORD-1084',
    tableId: 'T4',
    status: 'READY',
    createdAt: Date.now() - 48 * 60 * 1000,
    sentToKitchenAt: Date.now() - 47 * 60 * 1000,
    subtotal: 1720,
    taxGst: 86,
    tipAmount: 172,
    tipPercentage: 10,
    totalAmount: 1978,
    paymentStatus: 'UNPAID',
    items: [
      {
        id: 'ord-item-20',
        menuItemId: 'dish-1',
        name: 'Paneer Makhani',
        portion: 'Full',
        unitPrice: 380,
        quantity: 2,
        spiceChoice: 'Medium',
        addons: [],
        assignedGuest: 'Table',
        station: 'CURRY',
        itemStatus: 'Served',
        totalPrice: 760
      },
      {
        id: 'ord-item-21',
        menuItemId: 'dish-6',
        name: 'Garlic Butter Naan',
        portion: 'Full',
        unitPrice: 95,
        quantity: 6,
        spiceChoice: 'Mild',
        addons: [],
        assignedGuest: 'Table',
        station: 'TANDOOR',
        itemStatus: 'Served',
        totalPrice: 570
      },
      {
        id: 'ord-item-22',
        menuItemId: 'dish-8',
        name: 'Alphonso Mango Lassi',
        portion: 'Full',
        unitPrice: 160,
        quantity: 2,
        spiceChoice: 'Mild',
        addons: [],
        assignedGuest: 'Table',
        station: 'DRINKS',
        itemStatus: 'Served',
        totalPrice: 320
      },
      {
        id: 'ord-item-23',
        menuItemId: 'dish-10',
        name: 'Spiced Kachumber Salad',
        portion: 'Half',
        unitPrice: 90,
        quantity: 1,
        spiceChoice: 'Medium',
        addons: [],
        assignedGuest: 'Table',
        station: 'CURRY',
        itemStatus: 'Served',
        totalPrice: 90
      }
    ]
  }
];

export const SPICE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which precious spice is traditionally used to give Hyderabadi Dum Biryani its golden hue and fragrance?',
    options: ['Turmeric Root', 'Kashmiri Kesar (Saffron)', 'Yellow Mustard', 'Fenugreek Seed'],
    correctIndex: 1,
    explanation: 'Pure Kashmiri Kesar (Saffron) soaked in warm milk imparts the regal golden hue and distinct floral aroma to authentic Hyderabadi Dum Biryani.'
  },
  {
    id: 2,
    question: 'Authentic Dal Makhani gets its signature smokiness and creamy body from cooking on which heat source?',
    options: ['Induction Stove', 'Overnight Clay Tandoor Charcoal', 'Microwave Steam', 'Cast Iron Gas Burner'],
    correctIndex: 1,
    explanation: 'True Dhaba & Royal style Dal Makhani is simmered for 12+ hours over residual charcoal embers in the clay tandoor, slowly melting butter and lentils.'
  },
  {
    id: 3,
    question: 'What gives authentic Indian Mango Lassi its signature cooling zest and sweetness?',
    options: ['Corn syrup & lime', 'Alphonso Mango & Green Cardamom', 'Vanilla sugar & orange juice', 'Almond paste & cloves'],
    correctIndex: 1,
    explanation: 'The pairing of ripe Alphonso (Hapus) pulp and freshly ground fragrant green cardamom pods creates the classic refreshing Punjabi lassi flavor.'
  },
  {
    id: 4,
    question: 'Which dried herb is gently rubbed between palms and dusted over Butter Chicken and Paneer Makhani before serving?',
    options: ['Kasoori Methi (Dried Fenugreek)', 'Dry Mint Leaves', 'Oregano', 'Coriander powder'],
    correctIndex: 0,
    explanation: 'Toasted Kasoori Methi (sun-dried fenugreek leaves from Nagaur, Rajasthan) gives North Indian gravies their irreplaceable restaurant aroma.'
  },
  {
    id: 5,
    question: 'What type of clay oven is traditionally used to bake Garlic Naan and char Paneer Tikka at 480°C?',
    options: ['Chulha', 'Tandoor', 'Sigdi', 'Angithi'],
    correctIndex: 1,
    explanation: 'A traditional clay tandoor generates intense radiant heat (up to 480°C / 900°F) that blisters the naan dough in seconds and creates smoky charred edges.'
  }
];

export const WIFI_INFO = {
  ssid: 'Zaika_Guest_5G',
  password: 'zaika2026',
  speed: '300 Mbps Fiber',
  security: 'WPA3 Enterprise'
};

export const REWARDS_INFO = {
  currentPoints: 180,
  targetPoints: 250,
  tier: 'Saffron Gold Member',
  nextReward: 'Free Shahi Gulab Jamun or Mango Lassi',
  pointsMultiplier: '10 pts per ₹100 spent',
  perks: ['Complimentary Chef Welcome Drink', '10% Birthday Discount', 'Priority Table Booking']
};

export const INITIAL_RESTAURANT_PROFILE: RestaurantProfile = {
  name: 'Zaika Indian Bistro',
  tagline: 'Crafted North Indian Dining & Tandoor',
  legalEntity: 'Zaika Hospitality & Foods Pvt. Ltd.',
  fssaiNumber: '11524021000345',
  gstin: '27AABCZ1234F1Z5',
  phone: '+91 98765 43210',
  email: 'contact@zaikabistro.in',
  address: 'Shop 12-14, Ground Floor, Cyber Hub',
  city: 'Mumbai, Maharashtra',
  pincode: '400050',
  upiId: 'zaikabistro@icici',
  merchantName: 'Zaika Indian Bistro',
  paymentGateway: 'UPI_DIRECT',
  razorpayKeyId: 'rzp_test_98ZaikaDineOS',
  anonymousMode: true, // End-to-end guest privacy: no phone or login required
  adminPin: '1234',
  isRegistered: true
};
