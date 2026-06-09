import { useState } from 'react'
import { setDoc, doc, getDocs, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import * as mock from '@/data/mock'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, AlertTriangle, Database } from 'lucide-react'

type SeedStatus = 'idle' | 'running' | 'done' | 'error'

export function SeedPage() {
  const [status, setStatus] = useState<SeedStatus>('idle')
  const [log, setLog] = useState<string[]>([])
  const [hasData, setHasData] = useState<boolean | null>(null)

  const checkExisting = async () => {
    const snap = await getDocs(collection(db, 'products'))
    setHasData(snap.size > 0)
  }

  const addLog = (msg: string) => setLog((prev) => [...prev, msg])

  const seed = async () => {
    setStatus('running')
    setLog([])
    try {
      // Products
      addLog('Seeding products…')
      for (const product of mock.products) {
        const { id, ...data } = product
        await setDoc(doc(db, 'products', id), data)
      }
      addLog(`✓ ${mock.products.length} products seeded`)

      // Categories
      addLog('Seeding categories…')
      for (const cat of mock.categories) {
        const { id, ...data } = cat
        await setDoc(doc(db, 'categories', id), data)
      }
      addLog(`✓ ${mock.categories.length} categories seeded`)

      // Banners
      addLog('Seeding banners…')
      for (const banner of mock.banners) {
        const { id, ...data } = banner
        await setDoc(doc(db, 'banners', id), data)
      }
      addLog(`✓ ${mock.banners.length} banners seeded`)

      // Coupons
      addLog('Seeding coupons…')
      for (const coupon of mock.coupons) {
        const { id, ...data } = coupon
        await setDoc(doc(db, 'coupons', id), data)
      }
      addLog(`✓ ${mock.coupons.length} coupons seeded`)

      // Orders
      addLog('Seeding orders…')
      for (const order of mock.orders) {
        const { id, ...data } = order
        await setDoc(doc(db, 'orders', id), data)
      }
      addLog(`✓ ${mock.orders.length} orders seeded`)

      // Customers
      addLog('Seeding customers…')
      for (const customer of mock.customers) {
        const { id, ...data } = customer
        await setDoc(doc(db, 'customers', id), data)
      }
      addLog(`✓ ${mock.customers.length} customers seeded`)

      // Settings
      addLog('Seeding settings…')
      await setDoc(doc(db, 'settings', 'store'), mock.settings)
      addLog('✓ settings seeded')

      addLog('🎉 All data seeded successfully!')
      setStatus('done')
    } catch (err) {
      addLog(`✗ Error: ${err instanceof Error ? err.message : String(err)}`)
      setStatus('error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Seed Database</h2>
        <p className="text-sm text-text-muted">
          One-time operation to populate Firestore with initial mock data.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
            <div>
              <p className="text-sm font-semibold">Warning: This will overwrite existing data</p>
              <p className="text-xs text-text-muted mt-1">
                Run this only once on a fresh Firestore database. Running again overwrites all documents
                with IDs from the mock data set.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={checkExisting} disabled={status === 'running'}>
              <Database className="mr-2 h-4 w-4" />
              Check if data exists
            </Button>
            {hasData !== null && (
              <span className={`self-center text-sm font-medium ${hasData ? 'text-yellow-500' : 'text-green-500'}`}>
                {hasData ? '⚠ Firestore already has product data' : '✓ Firestore is empty — safe to seed'}
              </span>
            )}
          </div>

          <Button onClick={seed} disabled={status === 'running'} className="w-full sm:w-auto">
            {status === 'running' ? 'Seeding…' : 'Seed All Mock Data → Firestore'}
          </Button>

          {log.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-muted p-4 font-mono text-xs space-y-1">
              {log.map((line, i) => (
                <div key={i} className={line.startsWith('✓') || line.startsWith('🎉') ? 'text-green-500' : line.startsWith('✗') ? 'text-red-500' : 'text-text-muted'}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {status === 'done' && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">Seed complete. Your store and admin are now using live Firestore data.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
