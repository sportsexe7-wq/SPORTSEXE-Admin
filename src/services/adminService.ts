import type { Product, Banner, Category, Coupon, MediaItem, StoreSettings, OrderStatus } from '@/types'
import { delay } from './api'
import * as db from '@/data/mock'

export const adminService = {
  // Dashboard
  async getDashboard() {
    await delay()
    return db.getDashboardStats()
  },

  // Products
  async getProducts() { await delay(); return [...db.products] },
  async getProduct(id: string) { await delay(); return db.products.find((p) => p.id === id) ?? null },
  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay()
    const product: Product = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    db.products.push(product)
    return product
  },
  async updateProduct(id: string, data: Partial<Product>) {
    await delay()
    const idx = db.products.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('Not found')
    db.products[idx] = { ...db.products[idx], ...data, updatedAt: new Date().toISOString() }
    return db.products[idx]
  },
  async deleteProduct(id: string) {
    await delay()
    const idx = db.products.findIndex((p) => p.id === id)
    if (idx >= 0) db.products.splice(idx, 1)
  },
  async duplicateProduct(id: string) {
    await delay()
    const original = db.products.find((p) => p.id === id)
    if (!original) throw new Error('Not found')
    const copy: Product = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.products.push(copy)
    return copy
  },

  // Banners
  async getBanners() { await delay(); return [...db.banners] },
  async createBanner(data: Omit<Banner, 'id'>) {
    await delay()
    const banner = { ...data, id: crypto.randomUUID() }
    db.banners.push(banner)
    return banner
  },
  async updateBanner(id: string, data: Partial<Banner>) {
    await delay()
    const idx = db.banners.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error('Not found')
    db.banners[idx] = { ...db.banners[idx], ...data }
    return db.banners[idx]
  },
  async deleteBanner(id: string) {
    await delay()
    const idx = db.banners.findIndex((b) => b.id === id)
    if (idx >= 0) db.banners.splice(idx, 1)
  },

  // Orders
  async getOrders(status?: OrderStatus) {
    await delay()
    return status ? db.orders.filter((o) => o.status === status) : [...db.orders]
  },
  async getOrder(id: string) { await delay(); return db.orders.find((o) => o.id === id) ?? null },
  async updateOrderStatus(id: string, status: OrderStatus) {
    await delay()
    const order = db.orders.find((o) => o.id === id)
    if (!order) throw new Error('Not found')
    order.status = status
    order.updatedAt = new Date().toISOString()
    return order
  },

  // Categories
  async getCategories() { await delay(); return [...db.categories] },
  async createCategory(data: Omit<Category, 'id' | 'productCount'>) {
    await delay()
    const cat = { ...data, id: crypto.randomUUID(), productCount: 0 }
    db.categories.push(cat)
    return cat
  },
  async updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'productCount'>>) {
    await delay()
    const idx = db.categories.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('Not found')
    db.categories[idx] = { ...db.categories[idx], ...data }
    return db.categories[idx]
  },
  async deleteCategory(id: string) {
    await delay()
    const idx = db.categories.findIndex((c) => c.id === id)
    if (idx >= 0) db.categories.splice(idx, 1)
  },

  // Coupons
  async getCoupons() { await delay(); return [...db.coupons] },
  async createCoupon(data: Omit<Coupon, 'id' | 'usageCount'>) {
    await delay()
    const coupon = { ...data, id: crypto.randomUUID(), usageCount: 0 }
    db.coupons.push(coupon)
    return coupon
  },
  async updateCoupon(id: string, data: Partial<Coupon>) {
    await delay()
    const idx = db.coupons.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('Not found')
    db.coupons[idx] = { ...db.coupons[idx], ...data }
    return db.coupons[idx]
  },
  async deleteCoupon(id: string) {
    await delay()
    const idx = db.coupons.findIndex((c) => c.id === id)
    if (idx >= 0) db.coupons.splice(idx, 1)
  },

  // Customers
  async getCustomers(search?: string) {
    await delay()
    if (!search) return [...db.customers]
    const q = search.toLowerCase()
    return db.customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  },
  async toggleBlockCustomer(id: string) {
    await delay()
    const customer = db.customers.find((c) => c.id === id)
    if (!customer) throw new Error('Not found')
    customer.blocked = !customer.blocked
    return customer
  },

  // Media
  async getMedia(search?: string) {
    await delay()
    if (!search) return [...db.media]
    const q = search.toLowerCase()
    return db.media.filter((m) => m.name.toLowerCase().includes(q))
  },
  async uploadMedia(file: { name: string; url: string; size: number }) {
    await delay(500)
    const item: MediaItem = { id: crypto.randomUUID(), ...file, createdAt: new Date().toISOString() }
    db.media.push(item)
    return item
  },
  async deleteMedia(id: string) {
    await delay()
    const idx = db.media.findIndex((m) => m.id === id)
    if (idx >= 0) db.media.splice(idx, 1)
  },

  // Settings
  async getSettings() { await delay(); return { ...db.settings } },
  async updateSettings(data: Partial<StoreSettings>) {
    await delay()
    Object.assign(db.settings, data)
    return db.settings
  },
}
