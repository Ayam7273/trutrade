// Mock records for the seller dashboard, shaped like the rows the Supabase
// tables will return. Replace each export with a real query once the schema
// and RLS policies exist; components only depend on the shapes below.
import { stockLevel } from './products';
import { localIsoDate } from './format';

const HOUR = 60 * 60 * 1000;

export const mockSeller = {
  storeName: 'Giddy Store',
  storeActive: true,
  avatarUrl: null,
};

export const mockStore = {
  name: 'Giddy Store',
  slug: 'giddy-store',
  category: 'Fashion & Accessories',
  description: 'Quality fashion pieces and accessories curated for everyday style. Based in the heart of Lagos.',
  email: 'hello@giddystore.com',
  phone: '+234 801 234 5678',
  location: 'Lagos, Nigeria',
  verified: true,
  active: true,
  logoUrl: null,
  bannerUrl: null,
  rating: 4.8,
  reviewCount: 328,
  productCount: 42,
  followers: 1200,
  joinedAt: '2024-06-12',
  featuredProducts: [
    { id: 'p1', name: 'Classic Sneakers', price: 35000, currency: 'GBP', imageUrl: null },
    { id: 'p2', name: 'Premium Leather Bag', price: 45000, currency: 'GBP', imageUrl: null },
    { id: 'p3', name: 'Oversized Hoodie', price: 18000, currency: 'GBP', imageUrl: null },
  ],
};

export const mockStats = {
  today: {
    sales: { amount: 320, currency: 'GBP', delta: 4.2 },
    orders: { count: 9, delta: 2.1 },
    products: { count: 42, newCount: 1 },
    rating: { value: 4.8, delta: 0 },
  },
  week: {
    sales: { amount: 1180, currency: 'GBP', delta: 9.4 },
    orders: { count: 37, delta: 6.8 },
    products: { count: 42, newCount: 3 },
    rating: { value: 4.8, delta: 0.1 },
  },
  month: {
    sales: { amount: 2450, currency: 'GBP', delta: 18.6 },
    orders: { count: 84, delta: 12.4 },
    products: { count: 42, newCount: 5 },
    rating: { value: 4.8, delta: 0.3 },
  },
};

export const mockSalesSeries = {
  today: {
    total: 320, currency: 'GBP', delta: 3.1,
    points: [
      { label: '8am', value: 12 }, { label: '9am', value: 20 }, { label: '10am', value: 34 },
      { label: '11am', value: 28 }, { label: '12pm', value: 46 }, { label: '1pm', value: 38 },
      { label: '2pm', value: 30 }, { label: '3pm', value: 42 }, { label: '4pm', value: 32 },
      { label: '5pm', value: 38 },
    ],
  },
  week: {
    total: 1180, currency: 'GBP', delta: 8.2,
    points: [
      { label: 'Mon', value: 120 }, { label: 'Tue', value: 180 }, { label: 'Wed', value: 140 },
      { label: 'Thu', value: 210 }, { label: 'Fri', value: 260 }, { label: 'Sat', value: 160 },
      { label: 'Sun', value: 110 },
    ],
  },
  month: {
    total: 2450, currency: 'GBP', delta: 14.3,
    points: [
      { label: 'Day 1-3', value: 90 }, { label: 'Day 4-6', value: 190 }, { label: 'Day 7-9', value: 140 },
      { label: 'Day 10-12', value: 240 }, { label: 'Day 13-15', value: 200 }, { label: 'Day 16-18', value: 360 },
      { label: 'Day 19-21', value: 280 }, { label: 'Day 22-24', value: 410 }, { label: 'Day 25-27', value: 340 },
      { label: 'Day 28-31', value: 510 },
    ],
  },
  year: {
    total: 21640, currency: 'GBP', delta: 22.5,
    points: [
      { label: 'Jan', value: 1200 }, { label: 'Feb', value: 1350 }, { label: 'Mar', value: 1500 },
      { label: 'Apr', value: 1420 }, { label: 'May', value: 1780 }, { label: 'Jun', value: 1900 },
      { label: 'Jul', value: 2050 }, { label: 'Aug', value: 2300 }, { label: 'Sep', value: 2450 },
      { label: 'Oct', value: 2100 }, { label: 'Nov', value: 1690 }, { label: 'Dec', value: 1900 },
    ],
  },
};

// 84 orders, newest first. The first six match the Orders design; the rest
// are generated deterministically: 12 pending, 24 processing, 18 shipped,
// 28 delivered and 2 cancelled, matching the Overview design's order chart.
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function daysAgo(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return localIsoDate(date);
}

const FEATURED_ORDERS = [
  { id: 'ORD-10293', customer: 'John Doe', items: 2, amount: 45000, status: 'pending' },
  { id: 'ORD-10287', customer: 'Jane Smith', items: 3, amount: 23500, status: 'processing' },
  { id: 'ORD-10281', customer: 'Michael Johnson', items: 1, amount: 65000, status: 'shipped' },
  { id: 'ORD-10276', customer: 'Sarah Williams', items: 4, amount: 120000, status: 'delivered' },
  { id: 'ORD-10270', customer: 'Chinedu Okafor', items: 2, amount: 38000, status: 'delivered' },
  { id: 'ORD-10265', customer: 'Amina Bello', items: 1, amount: 55000, status: 'cancelled' },
];

const MOCK_CUSTOMERS = [
  'Tunde Bakare', 'Grace Okeke', 'Oliver Brown', 'Fatima Yusuf', 'Emeka Nwosu',
  'Charlotte Evans', 'Ngozi Adeyemi', 'James Wilson', 'Aisha Mohammed', 'Daniel Taylor',
  'Kemi Adebayo', 'Sophie Clarke', 'Ibrahim Musa', 'Lucy Harris', 'Chioma Eze',
  'Harry Walker', 'Zainab Lawal', 'Thomas Wright', 'Funke Ogunleye', 'Emily Davis',
];

const STATUS_RANK = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: 2.5 };
const REMAINING_COUNTS = { pending: 11, processing: 23, shipped: 17, delivered: 26, cancelled: 1 };

function buildMockOrders() {
  const random = seededRandom(2406);
  const featured = FEATURED_ORDERS.map((order, index) => ({
    ...order,
    currency: 'GBP',
    payment: order.status === 'cancelled' ? 'refunded' : 'paid',
    date: daysAgo(index),
  }));

  // Newer orders lean towards pending/processing, older towards delivered.
  const statuses = Object.entries(REMAINING_COUNTS)
    .flatMap(([status, count]) => Array.from({ length: count }, () => status))
    .map((status) => ({ status, key: STATUS_RANK[status] + random() * 1.5 }))
    .sort((a, b) => a.key - b.key)
    .map((entry) => entry.status);

  let nextId = 10264;
  const generated = statuses.map((status, index) => {
    nextId -= 1 + Math.floor(random() * 4);
    return {
      id: `ORD-${nextId}`,
      customer: MOCK_CUSTOMERS[Math.floor(random() * MOCK_CUSTOMERS.length)],
      items: 1 + Math.floor(random() * 5),
      amount: Math.round((5000 + random() * 145000) / 500) * 500,
      currency: 'GBP',
      status,
      payment: status === 'cancelled' ? 'refunded' : 'paid',
      date: daysAgo(6 + Math.floor(index * 0.3)),
    };
  });

  return [...featured, ...generated];
}

export const mockOrders = buildMockOrders();

export const mockOrdersTrend = { delta: 12.4 };

export const mockBalances = {
  currency: 'GBP',
  available: { amount: 185000, delta: 12.4 },
  pending: { amount: 72500, delta: 5.2 },
  earnings: { amount: 245000, delta: 18.6 },
  withdrawals: { amount: 226450, delta: 15.0 },
};

export const mockEarningsSeries = {
  today: {
    total: 8200, currency: 'GBP',
    points: [
      { label: '8am', value: 400 }, { label: '10am', value: 1200 }, { label: '12pm', value: 2100 },
      { label: '2pm', value: 1600 }, { label: '4pm', value: 1900 }, { label: '6pm', value: 1000 },
    ],
  },
  week: {
    total: 61400, currency: 'GBP',
    points: [
      { label: 'Mon', value: 6200 }, { label: 'Tue', value: 9100 }, { label: 'Wed', value: 7400 },
      { label: 'Thu', value: 11800 }, { label: 'Fri', value: 13200 }, { label: 'Sat', value: 8700 },
      { label: 'Sun', value: 5000 },
    ],
  },
  month: {
    total: 245000, currency: 'GBP',
    points: [
      { label: 'Week 1', value: 48000 }, { label: 'Week 2', value: 61500 },
      { label: 'Week 3', value: 57000 }, { label: 'Week 4', value: 78500 },
    ],
  },
  year: {
    total: 1284000, currency: 'GBP',
    points: [
      { label: 'Mar', value: 162000 }, { label: 'Apr', value: 188000 }, { label: 'May', value: 201000 },
      { label: 'Jun', value: 176000 }, { label: 'Jul', value: 228000 }, { label: 'Aug', value: 245000 },
    ],
  },
};

export const mockPayoutSpeedHours = 24;

export const mockWithdrawal = {
  nextAmount: 72500,
  currency: 'GBP',
  estimatedDate: daysAgo(-5),
  account: {
    bank: 'First Bank of Nigeria',
    holder: 'Gideon Adebayo',
    last4: '4521',
    verified: true,
  },
};

// Wallet transactions, newest first. The first five match the Payments
// design; the rest follow the mock orders so links between pages line up.
function buildMockTransactions() {
  const byId = Object.fromEntries(mockOrders.map((order) => [order.id, order]));
  // A sale is completed once the buyer confirms delivery; until then the
  // money is still held in escrow.
  const sale = (txn, orderId) => ({
    id: `TXN-${txn}`, type: 'sale', orderId, amount: byId[orderId].amount, currency: 'GBP',
    status: byId[orderId].status === 'delivered' ? 'completed' : 'pending', date: byId[orderId].date,
  });
  const featured = [
    sale(98231, 'ORD-10293'),
    sale(98227, 'ORD-10287'),
    { id: 'TXN-98194', type: 'payout', amount: -100000, currency: 'GBP', status: 'completed', date: daysAgo(2) },
    sale(98188, 'ORD-10276'),
    { id: 'TXN-98175', type: 'fee', amount: -8500, currency: 'GBP', status: 'completed', date: daysAgo(4) },
  ];

  const refund = mockOrders.find((order) => order.status === 'cancelled');
  const generated = [
    { id: 'TXN-98170', type: 'refund', orderId: refund.id, amount: -refund.amount, currency: 'GBP', status: 'completed', date: refund.date },
  ];
  let txn = 98166;
  mockOrders.slice(6, 22).forEach((order, index) => {
    if (order.status === 'cancelled') return;
    generated.push(sale(txn, order.id));
    txn -= 3;
    if (index % 5 === 4) {
      generated.push({ id: `TXN-${txn}`, type: 'payout', amount: -60000, currency: 'GBP', status: index === 9 ? 'failed' : 'completed', date: order.date });
      txn -= 2;
    }
  });

  return [...featured, ...generated];
}

export const mockTransactions = buildMockTransactions();

export const mockStorePerformance = {
  listed: { value: 42, target: 68 },
  sold: { value: 156, target: 190 },
  averageOrder: { amount: 29167, currency: 'NGN', target: 43000 },
  rating: { value: 4.8 },
};

// 42 products, newest first: 38 listed (active), 4 draft/hidden, 4 low on
// stock and 2 out of stock. The first six match the Products design.
const FEATURED_PRODUCTS = [
  { name: 'Leather Handbag', category: 'Fashion', price: 45000, stock: 24, rating: 4.8, age: 3 },
  { name: 'Premium Sneakers', category: 'Footwear', price: 65000, stock: 8, rating: 4.7, age: 5 },
  { name: 'Cotton Casual Shirt', category: 'Clothing', price: 23500, stock: 3, rating: 4.5, age: 8 },
  { name: 'Luxury Wristwatch', category: 'Accessories', price: 85000, stock: 0, rating: 4.9, age: 11 },
  { name: 'Ankara Print Dress', category: 'Fashion', price: 18000, stock: 15, rating: 4.6, age: 14 },
  { name: 'Leather Belt', category: 'Accessories', price: 12500, stock: 20, rating: 4.4, age: 33 },
];

const CATALOGUE = [
  ['Classic Sneakers', 'Footwear'], ['Suede Loafers', 'Footwear'], ['Leather Sandals', 'Footwear'],
  ['Canvas Trainers', 'Footwear'], ['Chelsea Boots', 'Footwear'], ['Slide Sandals', 'Footwear'],
  ['Platform Heels', 'Footwear'], ['Oversized Hoodie', 'Clothing'], ['Denim Jacket', 'Clothing'],
  ['Linen Shirt', 'Clothing'], ['Cargo Trousers', 'Clothing'], ['Graphic Tee', 'Clothing'],
  ['Knit Cardigan', 'Clothing'], ['Bomber Jacket', 'Clothing'], ['Track Pants', 'Clothing'],
  ['Polo Shirt', 'Clothing'], ['Classic Wristwatch', 'Accessories'], ['Silk Scarf', 'Accessories'],
  ['Beaded Bracelet', 'Accessories'], ['Aviator Sunglasses', 'Accessories'], ['Leather Wallet', 'Accessories'],
  ['Bucket Hat', 'Accessories'], ['Gold Hoop Earrings', 'Accessories'], ['Canvas Backpack', 'Accessories'],
  ['Premium Leather Bag', 'Fashion'], ['Classic Leather Handbag', 'Fashion'], ['Woven Tote Bag', 'Fashion'],
  ['Adire Kaftan', 'Fashion'], ['Aso Oke Wrap', 'Fashion'], ['Midi Wrap Dress', 'Fashion'],
  ['Agbada Set', 'Fashion'], ['Lace Blouse', 'Fashion'], ['Kente Clutch', 'Fashion'],
  ['Mini Crossbody Bag', 'Fashion'], ['Pleated Skirt', 'Fashion'], ['Satin Headwrap', 'Fashion'],
];

const FIXED_STOCK = { 'Premium Leather Bag': 4, 'Classic Wristwatch': 6, 'Denim Jacket': 3, 'Kente Clutch': 0 };
const UNLISTED = { 'Agbada Set': 'draft', 'Pleated Skirt': 'draft', 'Polo Shirt': 'draft', 'Bucket Hat': 'hidden' };

// Maps the short catalogue groups above onto the product category list
// (productFormContent.categories), using the name where the group is vague.
function categoryFor(name, group) {
  if (/Watch|Earrings|Bracelet/.test(name)) return 'Jewelry & Watches';
  if (/Bag|Tote|Clutch|Backpack|Wallet|Belt|Sunglasses|Hat|Scarf|Headwrap/.test(name)) return 'Bags & Accessories';
  if (group === 'Footwear') return 'Shoes';
  return 'Fashion & Clothing';
}

function mockDescription(name) {
  return `${name} from Giddy Store. Quality materials, carefully checked before dispatch.`;
}

function buildMockProducts() {
  const random = seededRandom(4242);
  const featured = FEATURED_PRODUCTS.map((product, index) => ({
    id: `PRD-${1042 - index}`,
    name: product.name,
    category: categoryFor(product.name, product.category),
    price: product.price,
    currency: 'GBP',
    stock: product.stock,
    status: 'active',
    rating: product.rating,
    description: mockDescription(product.name),
    dateAdded: daysAgo(product.age),
    imageUrl: null,
  }));

  const generated = CATALOGUE.map(([name, category], index) => {
    const status = UNLISTED[name] ?? 'active';
    return {
      id: `PRD-${1036 - index}`,
      name,
      category: categoryFor(name, category),
      price: Math.round((8000 + random() * 87000) / 500) * 500,
      currency: 'GBP',
      stock: FIXED_STOCK[name] ?? 8 + Math.floor(random() * 52),
      status,
      rating: status === 'active' ? Math.round((4 + random()) * 10) / 10 : null,
      description: mockDescription(name),
      dateAdded: daysAgo(40 + index * 9),
      imageUrl: null,
    };
  });

  return [...featured, ...generated];
}

export const mockProducts = buildMockProducts();

export const mockTopProducts = [
  { name: 'Classic Sneakers', sold: 42 },
  { name: 'Premium Leather Bag', sold: 31 },
  { name: 'Oversized Hoodie', sold: 26 },
].map(({ name, sold }) => {
  const product = mockProducts.find((item) => item.name === name);
  return {
    id: product.id,
    name,
    sold,
    revenue: sold * product.price,
    currency: product.currency,
    stock: stockLevel(product),
    imageUrl: product.imageUrl,
  };
});

export const mockLowStock = mockProducts
  .filter((product) => product.status === 'active' && stockLevel(product) === 'low')
  .map((product) => ({ id: product.id, name: product.name, left: product.stock }));

// 328 reviews, newest first: 284 five-star, 31 four-star, 7 three-star,
// 4 two-star, 2 one-star (a 4.8 average). The first three match the Reviews
// design; the rest are generated deterministically.
const REVIEW_PRODUCTS = [
  'Classic Leather Handbag', 'Cotton Casual Shirt', 'Luxury Wristwatch', 'Classic Sneakers',
  'Premium Leather Bag', 'Oversized Hoodie', 'Denim Jacket', 'Silk Scarf',
];

const REVIEW_BODIES = {
  5: [
    'Absolutely love it. The quality is excellent.',
    'Fast delivery and exactly as pictured.',
    'Will definitely order again!',
    'Great quality and fast delivery.',
    'Exceeded my expectations. Thank you!',
  ],
  4: [
    'Good product, packaging could be better.',
    'Nice quality, delivery took a little longer than expected.',
    'Fits well, the colour is slightly different from the photos.',
  ],
  3: ['It is okay for the price.', 'Average quality, but it does the job.'],
  2: ['Not quite what I expected.', 'Took too long to arrive.'],
  1: ['The item arrived damaged.'],
};

const REVIEW_REPLIES = {
  positive: 'Thank you, {first}! We are so glad you love it.',
  negative: 'Sorry to hear this, {first}. Please message us so we can make it right.',
};

function hoursAgoIso(hours) {
  return new Date(Date.now() - hours * HOUR).toISOString();
}

function buildMockReviews() {
  const random = seededRandom(1307);
  const featured = [
    {
      id: 'REV-1001', author: 'John Doe', rating: 5, product: 'Classic Leather Handbag',
      body: 'Excellent quality and exactly as described. Delivery was also very fast.',
      postedAt: hoursAgoIso(2), reply: null,
    },
    {
      id: 'REV-1000', author: 'Amina Bello', rating: 4, product: 'Cotton Casual Shirt',
      body: 'Nice product but packaging could be better. Still happy with the purchase.',
      postedAt: hoursAgoIso(50),
      reply: { body: 'Thank you for the feedback Amina! We are working on improving our packaging for future orders.', postedAt: hoursAgoIso(40) },
    },
    {
      id: 'REV-0999', author: 'Chinedu Okafor', rating: 5, product: 'Luxury Wristwatch',
      body: 'Beautiful watch and it arrived well packaged. Highly recommend this store.',
      postedAt: hoursAgoIso(120), reply: null,
    },
  ];

  const ratings = Object.entries({ 5: 282, 4: 30, 3: 7, 2: 4, 1: 2 })
    .flatMap(([rating, count]) => Array.from({ length: count }, () => Number(rating)))
    .map((rating) => ({ rating, key: random() }))
    .sort((a, b) => a.key - b.key)
    .map((entry) => entry.rating);

  const generated = ratings.map((rating, index) => {
    const author = MOCK_CUSTOMERS[Math.floor(random() * MOCK_CUSTOMERS.length)];
    const bodies = REVIEW_BODIES[rating];
    const postedHours = 130 + index * 26 + Math.floor(random() * 20);
    const replied = rating <= 3 || random() < 0.3;
    const first = author.split(' ')[0];
    return {
      id: `REV-${String(998 - index).padStart(4, '0')}`,
      author,
      rating,
      product: REVIEW_PRODUCTS[Math.floor(random() * REVIEW_PRODUCTS.length)],
      body: bodies[Math.floor(random() * bodies.length)],
      postedAt: hoursAgoIso(postedHours),
      reply: replied
        ? {
          body: (rating >= 4 ? REVIEW_REPLIES.positive : REVIEW_REPLIES.negative).replace('{first}', first),
          postedAt: hoursAgoIso(postedHours - 6),
        }
        : null,
    };
  });

  return [...featured, ...generated];
}

export const mockReviews = buildMockReviews();

export const mockReviewTrend = { rating: 0.1, total: 18, five: 14, four: 3 };

// Notifications, newest first. Each one points at a real mock record so the
// "View" buttons land on matching pages. Copy lives in notificationsPageContent;
// `params` fills its templates.
const MINUTE = 60 * 1000;

function buildMockNotifications() {
  const order = (id) => mockOrders.find((item) => item.id === id);
  const txn = (id) => mockTransactions.find((item) => item.id === id);
  const minutesAgoIso = (minutes) => new Date(Date.now() - minutes * MINUTE).toISOString();
  const lowStock = mockLowStock.find((item) => item.left === Math.min(...mockLowStock.map((s) => s.left)));
  const review = mockReviews[0];
  const payout = txn('TXN-98194');
  const bank = mockWithdrawal.account.bank;

  const fromOrder = (id, minutes, read) => {
    const o = order(id);
    return {
      id: `NTF-order-${id}`, type: 'new_order', read, createdAt: minutes == null ? `${o.date}T10:00:00.000Z` : minutesAgoIso(minutes),
      params: { order: id, amount: { money: o.amount, currency: o.currency }, items: { count: o.items } },
      link: `/dashboard/orders/${id}`,
    };
  };
  const fromPayment = (txnId, minutes, read) => {
    const t = txn(txnId);
    return {
      id: `NTF-pay-${txnId}`, type: 'payment', read, createdAt: minutes == null ? `${t.date}T11:00:00.000Z` : minutesAgoIso(minutes),
      params: { order: t.orderId, amount: { money: t.amount, currency: t.currency } },
      link: `/dashboard/payments/transactions/${txnId}`,
    };
  };

  return [
    fromOrder('ORD-10293', 5, false),
    fromPayment('TXN-98227', 60, false),
    {
      id: `NTF-stock-${lowStock.id}`, type: 'low_stock', read: false, createdAt: minutesAgoIso(180),
      params: { product: lowStock.name, left: lowStock.left }, link: '/dashboard/products?stock=low',
    },
    {
      id: `NTF-review-${review.id}`, type: 'new_review', read: true, createdAt: review.postedAt,
      params: { author: review.author, rating: review.rating, product: review.product, body: review.body },
      link: '/dashboard/reviews',
    },
    {
      id: `NTF-payout-${payout.id}`, type: 'payout', read: true, createdAt: `${payout.date}T15:00:00.000Z`,
      params: { amount: { money: Math.abs(payout.amount), currency: payout.currency }, bank },
      link: `/dashboard/payments/transactions/${payout.id}`,
    },
    {
      id: 'NTF-system-verified', type: 'system', read: true, createdAt: `${daysAgo(20)}T09:00:00.000Z`,
      params: {}, link: '/dashboard/store',
    },
    fromPayment('TXN-98188', null, true),
    fromOrder('ORD-10281', null, true),
    fromOrder('ORD-10276', null, true),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const mockNotifications = buildMockNotifications();

// ---------------------------------------------------------------------------
// Order details: contact info, delivery and line items for one order. Built on
// demand and seeded by the order number, so the same order always shows the
// same details. The line totals always add up to the order amount.
const MOCK_ADDRESSES = [
  ['14 Admiralty Way', 'Lekki Phase 1', 'Lagos', 'Nigeria'],
  ['22 Gimbiya Street', 'Area 11, Garki', 'Abuja', 'Nigeria'],
  ['8 Peckham High Street', 'London SE15 5DT', 'London', 'United Kingdom'],
  ['41 Deansgate', 'Manchester M3 2AY', 'Manchester', 'United Kingdom'],
  ['5 Ring Road', 'Iyaganku GRA', 'Ibadan', 'Nigeria'],
  ['17 Broad Street', 'Birmingham B1 2HF', 'Birmingham', 'United Kingdom'],
];

const MOCK_DELIVERY = ['Standard Delivery (3–5 days)', 'Express Delivery (1–2 days)', 'Local Pickup'];

export function mockOrderDetails(order) {
  const random = seededRandom(Number(order.id.replace(/\D/g, '')) || 1);
  const slug = order.customer.toLowerCase().replace(/[^a-z]+/g, '.');
  const address = MOCK_ADDRESSES[Math.floor(random() * MOCK_ADDRESSES.length)];
  const uk = address[3] === 'United Kingdom';
  const phoneDigits = String(Math.floor(random() * 90000000) + 10000000);

  const listed = mockProducts.filter((product) => product.status === 'active');
  const lineCount = Math.min(order.items, 3);
  const picks = [];
  while (picks.length < lineCount) {
    const product = listed[Math.floor(random() * listed.length)];
    if (!picks.includes(product)) picks.push(product);
  }
  const quantities = picks.map(() => 1);
  for (let left = order.items - lineCount; left > 0; left -= 1) quantities[left % lineCount] += 1;

  const weights = picks.map((product, index) => product.price * quantities[index]);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  let allocated = 0;
  const lines = picks.map((product, index) => {
    const isLast = index === picks.length - 1;
    const total = isLast
      ? order.amount - allocated
      : Math.round((order.amount * weights[index]) / weightTotal / 100) * 100;
    allocated += total;
    return { productId: product.id, name: product.name, quantity: quantities[index], total };
  });

  return {
    email: `${slug}@example.com`,
    phone: uk ? `+44 7${phoneDigits.slice(0, 3)} ${phoneDigits.slice(3)}` : `+234 80${phoneDigits.slice(0, 2)} ${phoneDigits.slice(2, 5)} ${phoneDigits.slice(5)}`,
    address,
    delivery: MOCK_DELIVERY[Math.floor(random() * MOCK_DELIVERY.length)],
    lines,
  };
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function stampOn(dateIso, dayOffset, hour) {
  const [year, month, day] = dateIso.split('-').map(Number);
  const stamp = new Date(year, month - 1, day + dayOffset, hour, 0, 0);
  return new Date(Math.min(stamp.getTime(), Date.now())).toISOString();
}

// The status history implied by an order's current status, for orders that
// have not been changed in this session.
export function mockOrderHistory(order) {
  const history = [
    { event: 'placed', at: stampOn(order.date, 0, 9) },
    { event: 'paid', at: stampOn(order.date, 0, 9) },
  ];
  if (order.status === 'cancelled') {
    history.push({ event: 'cancelled', at: stampOn(order.date, 0, 18) });
    return history;
  }
  const reached = STATUS_STEPS.indexOf(order.status);
  if (reached >= 1) history.push({ event: 'processing', at: stampOn(order.date, 0, 15) });
  if (reached >= 2) history.push({ event: 'shipped', at: stampOn(order.date, 1, 11), carrier: 'GIG Logistics', tracking: `GIG${order.id.replace(/\D/g, '')}NG` });
  if (reached >= 3) history.push({ event: 'delivered', at: stampOn(order.date, 3, 14) });
  return history;
}
