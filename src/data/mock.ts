import type {
  Product, Banner, Order, Category, Coupon, Customer, MediaItem, StoreSettings, DashboardStats,
} from '@/types'

const now = new Date().toISOString()
const sizes = ['S', 'M', 'L', 'XL'] as const

export let products: Product[] = [
  {
    id: '1', title: 'Argentina Home Jersey 2024', slug: 'argentina-home-jersey-2024',
    description: 'Official Argentina home jersey featuring the iconic blue and white stripes. Premium breathable fabric with moisture-wicking technology. Perfect for match day or casual wear.',
    shortDescription: 'Iconic blue & white home kit',
    price: 3499, salePrice: 2799, stock: 45, category: 'Countries', subCategory: 'Home',
    team: 'Argentina', league: 'International', country: 'Argentina', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'],
    tags: ['football', 'world-cup', 'messi', 'home'], featured: true, trending: true, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.8, reviewCount: 234, createdAt: now, updatedAt: now,
  },
  {
    id: '2', title: 'Brazil Home Jersey 2024', slug: 'brazil-home-jersey-2024',
    description: 'The legendary yellow Brazil home jersey. Crafted with advanced Dri-FIT technology for maximum comfort during intense matches.',
    shortDescription: 'Legendary Seleção yellow kit',
    price: 3299, salePrice: 2599, stock: 38, category: 'Countries', subCategory: 'Home',
    team: 'Brazil', league: 'International', country: 'Brazil', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80'],
    tags: ['world-cup', 'home'], featured: true, trending: true, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.7, reviewCount: 189, createdAt: now, updatedAt: now,
  },
  {
    id: '3', title: 'Real Madrid Home Jersey 2024/25', slug: 'real-madrid-home-jersey-2024-25',
    description: 'Real Madrid official home jersey for the 2024/25 season. Classic white with gold accents representing Los Blancos heritage.',
    shortDescription: 'Los Blancos home kit',
    price: 3999, stock: 22, category: 'Clubs', subCategory: 'Home',
    team: 'Real Madrid', league: 'La Liga', country: 'Spain', season: '2024/25',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80'],
    tags: ['la-liga', 'ucl'], featured: true, trending: false, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.9, reviewCount: 312, createdAt: now, updatedAt: now,
  },
  {
    id: '4', title: 'Barcelona Away Jersey 2024/25', slug: 'barcelona-away-jersey-2024-25',
    description: 'Barcelona away jersey with bold design inspired by Catalan culture. Lightweight and performance-ready.',
    shortDescription: 'Blaugrana away kit',
    price: 3799, salePrice: 3199, stock: 15, category: 'Clubs', subCategory: 'Away',
    team: 'Barcelona', league: 'La Liga', country: 'Spain', season: '2024/25',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1489944440615-453fc2c6a9a?w=800&q=80'],
    tags: ['la-liga'], featured: false, trending: true, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.6, reviewCount: 156, createdAt: now, updatedAt: now,
  },
  {
    id: '5', title: 'Manchester United Retro 1999', slug: 'manchester-united-retro-1999',
    description: 'Commemorative Manchester United 1999 Treble-winning season retro jersey. Authentic vintage design with modern comfort.',
    shortDescription: 'Treble winners retro kit',
    price: 4299, salePrice: 3599, stock: 8, category: 'Retro', subCategory: 'Classic',
    team: 'Manchester United', league: 'Premier League', country: 'England', season: '1998/99',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80'],
    tags: ['retro', 'premier-league', 'classic'], featured: true, trending: false, bestSeller: false,
    playerEdition: false, retroEdition: true, rating: 4.9, reviewCount: 98, createdAt: now, updatedAt: now,
  },
  {
    id: '6', title: 'France World Cup 2026 Home', slug: 'france-world-cup-2026-home',
    description: 'France national team World Cup 2026 home jersey. Designed for champions with premium French craftsmanship.',
    shortDescription: 'Les Bleus WC 2026 kit',
    price: 3599, stock: 50, category: 'World Cup', subCategory: 'Home',
    team: 'France', league: 'International', country: 'France', season: '2026',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80'],
    tags: ['world-cup', '2026'], featured: true, trending: true, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.5, reviewCount: 67, createdAt: now, updatedAt: now,
  },
  {
    id: '7', title: 'Mbappé Player Edition France', slug: 'mbappe-player-edition-france',
    description: 'Kylian Mbappé player edition France jersey with authentic player fit, name and number printing included.',
    shortDescription: 'Mbappé #10 player edition',
    price: 5499, salePrice: 4799, stock: 12, category: 'Player Edition', subCategory: 'Player',
    team: 'France', league: 'International', country: 'France', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80'],
    tags: ['player-edition', 'mbappe'], featured: false, trending: true, bestSeller: false,
    playerEdition: true, retroEdition: false, rating: 4.8, reviewCount: 145, createdAt: now, updatedAt: now,
  },
  {
    id: '8', title: 'Germany Home Jersey 2024', slug: 'germany-home-jersey-2024',
    description: 'Germany national team home jersey in classic white with black and red accents. Engineered for peak performance.',
    shortDescription: 'Die Mannschaft home kit',
    price: 3199, stock: 30, category: 'Countries', subCategory: 'Home',
    team: 'Germany', league: 'International', country: 'Germany', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80'],
    tags: ['euro', 'home'], featured: false, trending: false, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.4, reviewCount: 89, createdAt: now, updatedAt: now,
  },
  {
    id: '9', title: 'Liverpool Home Jersey 2024/25', slug: 'liverpool-home-jersey-2024-25',
    description: 'Liverpool FC home jersey in iconic red. Features YNWA detailing and premium Nike Dri-FIT ADV technology.',
    shortDescription: 'The Reds home kit',
    price: 3899, salePrice: 3299, stock: 25, category: 'Clubs', subCategory: 'Home',
    team: 'Liverpool', league: 'Premier League', country: 'England', season: '2024/25',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80'],
    tags: ['premier-league', 'ynwa'], featured: false, trending: true, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.7, reviewCount: 201, createdAt: now, updatedAt: now,
  },
  {
    id: '10', title: 'Portugal Away Jersey 2024', slug: 'portugal-away-jersey-2024',
    description: 'Portugal national team away jersey. Bold red design celebrating Portuguese football excellence.',
    shortDescription: 'Seleção away kit',
    price: 2999, stock: 40, category: 'Countries', subCategory: 'Away',
    team: 'Portugal', league: 'International', country: 'Portugal', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1489944440615-453fc2c6a9a?w=800&q=80'],
    tags: ['ronaldo', 'away'], featured: false, trending: false, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.3, reviewCount: 54, createdAt: now, updatedAt: now,
  },
  {
    id: '11', title: 'AC Milan Training Kit 2024/25', slug: 'ac-milan-training-kit-2024-25',
    description: 'Official AC Milan training kit. Lightweight fabric designed for practice sessions and gym workouts.',
    shortDescription: 'Rossoneri training top',
    price: 2499, salePrice: 1999, stock: 35, category: 'Training Kits', subCategory: 'Training',
    team: 'AC Milan', league: 'Serie A', country: 'Italy', season: '2024/25',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80'],
    tags: ['training', 'serie-a'], featured: false, trending: false, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.2, reviewCount: 32, createdAt: now, updatedAt: now,
  },
  {
    id: '12', title: 'Italy Home Jersey 2024', slug: 'italy-home-jersey-2024',
    description: 'Italy national team home jersey in classic Azzurri blue. A symbol of football excellence and style.',
    shortDescription: 'Azzurri home kit',
    price: 3299, stock: 28, category: 'Countries', subCategory: 'Home',
    team: 'Italy', league: 'International', country: 'Italy', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'],
    tags: ['euro', 'home'], featured: false, trending: false, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.5, reviewCount: 76, createdAt: now, updatedAt: now,
  },
  {
    id: '13', title: 'Pro Football Socks — Long', slug: 'pro-football-socks-long',
    description: 'Premium long football socks with cushioned sole, moisture-wicking fabric and anti-slip grip. Designed for 90 minutes of intense play.',
    shortDescription: 'Cushioned long match socks',
    price: 499, salePrice: 399, stock: 120, category: 'Accessories', subCategory: 'Socks',
    team: '', league: '', country: '', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    tags: ['accessories', 'socks', 'football'], featured: false, trending: true, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.3, reviewCount: 58, createdAt: now, updatedAt: now,
  },
  {
    id: '14', title: 'Pro Shin Guards', slug: 'pro-shin-guards',
    description: 'Lightweight EVA foam shin guards with anatomical fit. Provides superior protection without restricting movement. Fits inside long socks.',
    shortDescription: 'Lightweight EVA protection',
    price: 699, salePrice: 549, stock: 80, category: 'Accessories', subCategory: 'Shin Guards',
    team: '', league: '', country: '', season: '2024',
    sizes: ['S', 'M', 'L', 'XL'], images: ['https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80'],
    tags: ['accessories', 'shin-guards', 'protection'], featured: false, trending: false, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.1, reviewCount: 34, createdAt: now, updatedAt: now,
  },
  {
    id: '15', title: 'Mumbai Indians IPL Jersey 2024', slug: 'mumbai-indians-ipl-jersey-2024',
    description: 'Official-style Mumbai Indians IPL jersey. Classic blue with gold trim, premium polyester fabric with Dri-FIT technology.',
    shortDescription: 'MI IPL official-style jersey',
    price: 1799, salePrice: 1499, stock: 45, category: 'IPL', subCategory: 'Home',
    team: 'Mumbai Indians', league: 'IPL', country: 'India', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80'],
    tags: ['ipl', 'cricket', 'mumbai'], featured: true, trending: true, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.6, reviewCount: 112, createdAt: now, updatedAt: now,
  },
  {
    id: '16', title: 'Chennai Super Kings IPL Jersey 2024', slug: 'chennai-super-kings-ipl-jersey-2024',
    description: 'Official-style CSK IPL jersey. Iconic yellow with navy accents. Lightweight and breathable for match days.',
    shortDescription: 'CSK IPL official-style jersey',
    price: 1799, salePrice: 1499, stock: 50, category: 'IPL', subCategory: 'Home',
    team: 'Chennai Super Kings', league: 'IPL', country: 'India', season: '2024',
    sizes: [...sizes], images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'],
    tags: ['ipl', 'cricket', 'chennai', 'csk'], featured: true, trending: true, bestSeller: true,
    playerEdition: false, retroEdition: false, rating: 4.7, reviewCount: 143, createdAt: now, updatedAt: now,
  },
  {
    id: '17', title: 'World Cup Fan Flag — Argentina', slug: 'world-cup-fan-flag-argentina',
    description: 'Large Argentina national flag for fan zones and match watching. Durable polyester, vivid print, with eyelets for hanging.',
    shortDescription: 'Argentina supporter flag 3×5 ft',
    price: 399, stock: 200, category: 'Flags', subCategory: 'Fan Flags',
    team: 'Argentina', league: 'International', country: 'Argentina', season: '2024',
    sizes: ['S', 'M', 'L', 'XL'], images: ['https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80'],
    tags: ['flags', 'argentina', 'fan'], featured: false, trending: true, bestSeller: false,
    playerEdition: false, retroEdition: false, rating: 4.2, reviewCount: 27, createdAt: now, updatedAt: now,
  },
]

export let banners: Banner[] = [
  { id: '1', title: 'World Cup 2026', subtitle: 'Get ready for the biggest tournament. Shop national team kits now.', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80', buttonText: 'Shop Now', buttonLink: '/category/world-cup', priority: 1, active: true },
  { id: '2', title: 'Retro Collection', subtitle: 'Relive football history with authentic vintage jerseys.', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80', buttonText: 'Explore Now', buttonLink: '/category/retro', priority: 2, active: true },
  { id: '3', title: 'Argentina Collection', subtitle: 'Celebrate La Albiceleste with premium home and away kits.', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600&q=80', buttonText: 'View Jerseys', buttonLink: '/category/argentina', priority: 3, active: true },
]

export let orders: Order[] = [
  {
    id: 'ORD-001', userId: 'c1', customerName: 'Rahul Sharma', customerEmail: 'rahul@example.com',
    items: [{ productId: '1', title: 'Argentina Home Jersey 2024', image: products[0].images[0], size: 'L', quantity: 1, price: 2799 }],
    status: 'delivered', subtotal: 2799, shipping: 99, discount: 0, total: 2898,
    shippingAddress: { fullName: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', address: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'Card ****4242', trackingNumber: 'TRK123456789', createdAt: '2025-12-15T10:00:00Z', updatedAt: '2025-12-18T14:30:00Z',
  },
  {
    id: 'ORD-002', userId: 'c2', customerName: 'Priya Patel', customerEmail: 'priya@example.com',
    items: [{ productId: '3', title: 'Real Madrid Home Jersey 2024/25', image: products[2].images[0], size: 'M', quantity: 2, price: 3999 }],
    status: 'pending', subtotal: 7998, shipping: 0, discount: 500, total: 7498, couponCode: 'SPORT10',
    shippingAddress: { fullName: 'Priya Patel', email: 'priya@example.com', phone: '+91 9876543211', address: '15 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    paymentMethod: 'UPI', createdAt: '2026-01-05T08:00:00Z', updatedAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'ORD-003', userId: 'c3', customerName: 'Arjun Mehta', customerEmail: 'arjun@example.com',
    items: [{ productId: '2', title: 'Brazil Home Jersey 2024', image: products[1].images[0], size: 'XL', quantity: 1, price: 2599 }],
    status: 'processing', subtotal: 2599, shipping: 99, discount: 0, total: 2698,
    shippingAddress: { fullName: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 9876543212', address: '88 Brigade Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    paymentMethod: 'Card ****1234', createdAt: '2026-02-01T12:00:00Z', updatedAt: '2026-02-02T09:00:00Z',
  },
  {
    id: 'ORD-004', userId: 'c4', customerName: 'Sneha Reddy', customerEmail: 'sneha@example.com',
    items: [
      { productId: '5', title: 'Manchester United Retro 1999', image: products[4].images[0], size: 'S', quantity: 1, price: 3599 },
      { productId: '11', title: 'AC Milan Training Kit 2024/25', image: products[10].images[0], size: 'M', quantity: 1, price: 1999 },
    ],
    status: 'shipped', subtotal: 5598, shipping: 0, discount: 0, total: 5598,
    shippingAddress: { fullName: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 9876543213', address: '22 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
    paymentMethod: 'Card ****5678', trackingNumber: 'TRK456789012', createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-11T15:00:00Z',
  },
  {
    id: 'ORD-005', userId: 'c5', customerName: 'Vikram Singh', customerEmail: 'vikram@example.com',
    items: [{ productId: '9', title: 'Liverpool Home Jersey 2024/25', image: products[8].images[0], size: 'L', quantity: 2, price: 3299 }],
    status: 'pending', subtotal: 6598, shipping: 0, discount: 500, total: 6098, couponCode: 'FLAT500',
    shippingAddress: { fullName: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543214', address: '7 Sector 15', city: 'Chandigarh', state: 'Punjab', pincode: '160015' },
    paymentMethod: 'UPI', createdAt: '2026-04-02T16:00:00Z', updatedAt: '2026-04-02T16:00:00Z',
  },
  {
    id: 'ORD-006', userId: 'c2', customerName: 'Priya Patel', customerEmail: 'priya@example.com',
    items: [{ productId: '7', title: 'Mbappé Player Edition France', image: products[6].images[0], size: 'M', quantity: 1, price: 4799 }],
    status: 'cancelled', subtotal: 4799, shipping: 99, discount: 0, total: 4898,
    shippingAddress: { fullName: 'Priya Patel', email: 'priya@example.com', phone: '+91 9876543211', address: '15 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    paymentMethod: 'Card ****9999', createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-11T08:00:00Z',
  },
]

export let categories: Category[] = [
  { id: '1', name: 'Clubs', slug: 'clubs', type: 'clubs', productCount: 4 },
  { id: '2', name: 'Countries', slug: 'countries', type: 'countries', productCount: 6 },
  { id: '3', name: 'World Cup', slug: 'world-cup', type: 'world-cup', productCount: 2 },
  { id: '4', name: 'Retro', slug: 'retro', type: 'retro', productCount: 1 },
  { id: '5', name: 'Training Kits', slug: 'training-kits', type: 'training-kits', productCount: 1 },
  { id: '6', name: 'Player Edition', slug: 'player-edition', type: 'player-edition', productCount: 1 },
  { id: '7', name: 'New Arrivals', slug: 'new-arrivals', type: 'new-arrivals', productCount: 17 },
  { id: '8', name: 'Accessories', slug: 'accessories', type: 'accessories', productCount: 2 },
  { id: '9', name: 'IPL', slug: 'ipl', type: 'ipl', productCount: 2 },
  { id: '10', name: 'Flags', slug: 'flags', type: 'flags', productCount: 1 },
]

export let coupons: Coupon[] = [
  { id: '1', code: 'SPORT10', type: 'percentage', value: 10, minOrder: 1999, active: true, usageCount: 45 },
  { id: '2', code: 'FLAT500', type: 'fixed', value: 500, minOrder: 2999, active: true, usageCount: 23 },
  { id: '3', code: 'FREESHIP', type: 'free-shipping', value: 0, active: true, usageCount: 67 },
  { id: '4', code: 'WELCOME20', type: 'percentage', value: 20, minOrder: 999, active: false, usageCount: 12 },
]

export let customers: Customer[] = [
  { id: 'c1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', orderCount: 3, totalSpent: 12500, blocked: false, createdAt: '2025-06-01T00:00:00Z' },
  { id: 'c2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 9876543211', orderCount: 2, totalSpent: 12396, blocked: false, createdAt: '2025-08-15T00:00:00Z' },
  { id: 'c3', name: 'Arjun Mehta', email: 'arjun@example.com', orderCount: 2, totalSpent: 5200, blocked: false, createdAt: '2025-10-20T00:00:00Z' },
  { id: 'c4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 9876543213', orderCount: 1, totalSpent: 5598, blocked: false, createdAt: '2026-01-10T00:00:00Z' },
  { id: 'c5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543214', orderCount: 1, totalSpent: 4847, blocked: false, createdAt: '2026-02-20T00:00:00Z' },
]

export let media: MediaItem[] = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&q=80', name: 'argentina-jersey.jpg', size: 245000, createdAt: now },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80', name: 'brazil-jersey.jpg', size: 312000, createdAt: now },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80', name: 'real-madrid-jersey.jpg', size: 198000, createdAt: now },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1489944440615-453fc2c6a9a?w=400&q=80', name: 'barcelona-jersey.jpg', size: 220000, createdAt: now },
  { id: 'm5', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80', name: 'man-utd-retro.jpg', size: 185000, createdAt: now },
  { id: 'm6', url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80', name: 'world-cup-banner.jpg', size: 420000, createdAt: now },
]

export let settings: StoreSettings = {
  shippingCharges: 99,
  freeShippingThreshold: 2999,
  returnPolicy: '30-day easy returns on unworn jerseys with tags attached.',
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/sportsexe' },
    { platform: 'Twitter', url: 'https://twitter.com/sportsexe' },
    { platform: 'YouTube', url: 'https://youtube.com/sportsexe' },
    { platform: 'WhatsApp', url: 'https://wa.me/919876543210' },
  ],
  contactEmail: 'support@sportsexe.com',
  contactPhone: '+91 1800-SPORTSEXE',
  address: 'Mumbai, Maharashtra, India',
}

export function getDashboardStats(): DashboardStats {
  return {
    totalOrders: orders.length + 44,
    revenue: orders.reduce((s, o) => s + o.total, 0) + 485000,
    pendingOrders: orders.filter((o) => o.status === 'pending').length + 3,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length + 38,
    topSellingJerseys: [
      { product: products[0], sold: 89 },
      { product: products[1], sold: 76 },
      { product: products[2], sold: 54 },
      { product: products[8], sold: 48 },
    ],
    lowStockAlerts: products.filter((p) => p.stock <= 10),
    recentOrders: [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  }
}
