export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  price: number
  salePrice?: number
  stock: number
  category: string
  subCategory: string
  team: string
  league: string
  country: string
  season: string
  sizes: ProductSize[]
  images: string[]
  tags: string[]
  featured: boolean
  trending: boolean
  bestSeller: boolean
  playerEdition: boolean
  retroEdition: boolean
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  buttonText: string
  buttonLink: string
  priority: number
  active: boolean
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  title: string
  image: string
  size: ProductSize
  quantity: number
  price: number
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  shippingAddress: ShippingAddress
  paymentMethod: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  type: 'clubs' | 'countries' | 'world-cup' | 'retro' | 'training-kits' | 'player-edition' | 'new-arrivals'
  image?: string
  productCount: number
}

export type CouponType = 'percentage' | 'fixed' | 'free-shipping'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrder?: number
  active: boolean
  usageCount: number
  expiresAt?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  orderCount: number
  totalSpent: number
  blocked: boolean
  createdAt: string
}

export interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  createdAt: string
}

export interface StoreSettings {
  shippingCharges: number
  freeShippingThreshold: number
  returnPolicy: string
  socialLinks: { platform: string; url: string }[]
  contactEmail: string
  contactPhone: string
  address: string
}

export interface DashboardStats {
  totalOrders: number
  revenue: number
  pendingOrders: number
  deliveredOrders: number
  topSellingJerseys: { product: Product; sold: number }[]
  lowStockAlerts: Product[]
  recentOrders: Order[]
}
