import type { Product, Banner, Category, Coupon, MediaItem, StoreSettings, OrderStatus } from '@/types'
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDoc<T>(snap: DocumentSnapshot<any>): T {
  return { id: snap.id, ...snap.data() } as T
}

const col = (name: string) => collection(db, name)

export const adminService = {
  // ── Dashboard ──────────────────────────────────────────────
  async getDashboard() {
    const [productsSnap, ordersSnap] = await Promise.all([
      getDocs(col('products')),
      getDocs(col('orders')),
    ])
    const products = productsSnap.docs.map((d) => fromDoc<Product>(d))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = ordersSnap.docs.map((d) => fromDoc<any>(d))

    const revenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum: number, o) => sum + (o.total ?? 0), 0)

    return {
      totalOrders: orders.length,
      revenue,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
      topSellingJerseys: [] as { product: Product; sold: number }[],
      lowStockAlerts: products.filter((p) => p.stock < 10),
      recentOrders: orders.slice(0, 5),
    }
  },

  // ── Products ───────────────────────────────────────────────
  async getProducts(): Promise<Product[]> {
    const snap = await getDocs(col('products'))
    return snap.docs.map((d) => fromDoc<Product>(d))
  },

  async getProduct(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, 'products', id))
    return snap.exists() ? fromDoc<Product>(snap) : null
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date().toISOString()
    const ref = await addDoc(col('products'), { ...data, createdAt: now, updatedAt: now })
    return { ...data, id: ref.id, createdAt: now, updatedAt: now } as Product
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const updates = { ...data, updatedAt: new Date().toISOString() }
    await updateDoc(doc(db, 'products', id), updates)
    return { id, ...updates } as Product
  },

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, 'products', id))
  },

  async duplicateProduct(id: string): Promise<Product> {
    const original = await this.getProduct(id)
    if (!original) throw new Error('Not found')
    const { id: _, ...rest } = original
    return this.createProduct({
      ...rest,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
    })
  },

  // ── Banners ────────────────────────────────────────────────
  async getBanners(): Promise<Banner[]> {
    const snap = await getDocs(col('banners'))
    return snap.docs.map((d) => fromDoc<Banner>(d))
  },

  async createBanner(data: Omit<Banner, 'id'>): Promise<Banner> {
    const ref = await addDoc(col('banners'), data)
    return { ...data, id: ref.id }
  },

  async updateBanner(id: string, data: Partial<Banner>): Promise<Banner> {
    await updateDoc(doc(db, 'banners', id), data)
    return { id, ...data } as Banner
  },

  async deleteBanner(id: string): Promise<void> {
    await deleteDoc(doc(db, 'banners', id))
  },

  // ── Orders ─────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getOrders(status?: OrderStatus): Promise<any[]> {
    const snap = await getDocs(col('orders'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = snap.docs.map((d) => fromDoc<any>(d))
    return status ? orders.filter((o) => o.status === status) : orders
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getOrder(id: string): Promise<any | null> {
    const snap = await getDoc(doc(db, 'orders', id))
    return snap.exists() ? fromDoc(snap) : null
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    await updateDoc(doc(db, 'orders', id), { status, updatedAt: new Date().toISOString() })
  },

  // ── Categories ─────────────────────────────────────────────
  async getCategories(): Promise<Category[]> {
    const snap = await getDocs(col('categories'))
    return snap.docs.map((d) => fromDoc<Category>(d))
  },

  async createCategory(data: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
    const ref = await addDoc(col('categories'), { ...data, productCount: 0 })
    return { ...data, id: ref.id, productCount: 0 }
  },

  async updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'productCount'>>): Promise<Category> {
    await updateDoc(doc(db, 'categories', id), data)
    return { id, ...data } as Category
  },

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', id))
  },

  // ── Coupons ────────────────────────────────────────────────
  async getCoupons(): Promise<Coupon[]> {
    const snap = await getDocs(col('coupons'))
    return snap.docs.map((d) => fromDoc<Coupon>(d))
  },

  async createCoupon(data: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
    const ref = await addDoc(col('coupons'), { ...data, usageCount: 0 })
    return { ...data, id: ref.id, usageCount: 0 }
  },

  async updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon> {
    await updateDoc(doc(db, 'coupons', id), data)
    return { id, ...data } as Coupon
  },

  async deleteCoupon(id: string): Promise<void> {
    await deleteDoc(doc(db, 'coupons', id))
  },

  // ── Customers ──────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getCustomers(search?: string): Promise<any[]> {
    const snap = await getDocs(col('customers'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers = snap.docs.map((d) => fromDoc<any>(d))
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q),
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async toggleBlockCustomer(id: string): Promise<any> {
    const snap = await getDoc(doc(db, 'customers', id))
    if (!snap.exists()) throw new Error('Not found')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = fromDoc<any>(snap)
    await updateDoc(doc(db, 'customers', id), { blocked: !customer.blocked })
    return { ...customer, blocked: !customer.blocked }
  },

  // ── Media ──────────────────────────────────────────────────
  async getMedia(search?: string): Promise<MediaItem[]> {
    const snap = await getDocs(col('media'))
    const media = snap.docs.map((d) => fromDoc<MediaItem>(d))
    if (!search) return media
    const q = search.toLowerCase()
    return media.filter((m) => m.name?.toLowerCase().includes(q))
  },

  async uploadMedia(file: { name: string; url: string; size: number }): Promise<MediaItem> {
    const item = { ...file, createdAt: new Date().toISOString() }
    const ref = await addDoc(col('media'), item)
    return { ...item, id: ref.id }
  },

  async deleteMedia(id: string): Promise<void> {
    await deleteDoc(doc(db, 'media', id))
  },

  // ── Settings ───────────────────────────────────────────────
  async getSettings(): Promise<StoreSettings | null> {
    const snap = await getDoc(doc(db, 'settings', 'store'))
    return snap.exists() ? (snap.data() as StoreSettings) : null
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    await setDoc(doc(db, 'settings', 'store'), data, { merge: true })
    return data as StoreSettings
  },
}
