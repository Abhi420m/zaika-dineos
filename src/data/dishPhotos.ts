export interface PresetDishPhoto {
  id: string;
  name: string;
  category: 'Mains' | 'Starters' | 'Breads' | 'Drinks' | 'Desserts';
  url: string;
  tags: string[];
}

export const PRESET_DISH_PHOTOS: PresetDishPhoto[] = [
  {
    id: 'paneer-makhani',
    name: 'Paneer Makhani / Butter Paneer',
    category: 'Mains',
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    tags: ['paneer', 'curry', 'gravy', 'makhani']
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani (Slow-Cooked Lentils)',
    category: 'Mains',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    tags: ['dal', 'lentils', 'curry', 'butter']
  },
  {
    id: 'veg-biryani',
    name: 'Dum Hyderabadi Biryani',
    category: 'Mains',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    tags: ['biryani', 'rice', 'pulao', 'dum']
  },
  {
    id: 'kadhai-paneer',
    name: 'Kadhai Paneer / Mix Veg',
    category: 'Mains',
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    tags: ['paneer', 'kadhai', 'spicy']
  },
  {
    id: 'paneer-tikka',
    name: 'Tandoori Paneer Tikka / Chaap',
    category: 'Starters',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    tags: ['tikka', 'tandoor', 'chaap', 'starter']
  },
  {
    id: 'dahi-kebab',
    name: 'Crispy Dahi Ke Kebab',
    category: 'Starters',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    tags: ['kebab', 'crispy', 'starter']
  },
  {
    id: 'kachumber-salad',
    name: 'Fresh Kachumber Salad',
    category: 'Starters',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tags: ['salad', 'cucumber', 'healthy']
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Butter Naan',
    category: 'Breads',
    url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80',
    tags: ['naan', 'bread', 'garlic', 'tandoor']
  },
  {
    id: 'tandoori-roti',
    name: 'Tandoori Roti Basket',
    category: 'Breads',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    tags: ['roti', 'bread', 'wheat']
  },
  {
    id: 'mango-lassi',
    name: 'Alphonso Mango Lassi',
    category: 'Drinks',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    tags: ['lassi', 'mango', 'drink', 'yogurt']
  },
  {
    id: 'masala-chai',
    name: 'Kullad Masala Chai',
    category: 'Drinks',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    tags: ['chai', 'tea', 'masala', 'hot']
  },
  {
    id: 'nimbu-soda',
    name: 'Fresh Nimbu Soda (Shikanji)',
    category: 'Drinks',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    tags: ['soda', 'lemon', 'cooler']
  },
  {
    id: 'gulab-jamun',
    name: 'Warm Shahi Gulab Jamun',
    category: 'Desserts',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    tags: ['gulab jamun', 'sweet', 'dessert']
  }
];
