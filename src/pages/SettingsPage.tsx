import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import type { StoreSettings } from '@/types'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => adminService.getSettings(),
  })

  const [form, setForm] = useState<StoreSettings | null>(null)

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  const saveMutation = useMutation({
    mutationFn: (data: Partial<StoreSettings>) => adminService.updateSettings(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  })

  if (isLoading || !form) return <p className="text-text-muted">Loading...</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-text-muted">Store configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Shipping Charges (₹)</Label>
            <Input type="number" className="mt-1" value={form.shippingCharges} onChange={(e) => setForm({ ...form, shippingCharges: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Free Shipping Threshold (₹)</Label>
            <Input type="number" className="mt-1" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Return Policy</CardTitle></CardHeader>
        <CardContent>
          <textarea
            className="flex min-h-24 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm"
            value={form.returnPolicy}
            onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input className="mt-1" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input className="mt-1" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
          <div>
            <Label>Address</Label>
            <Input className="mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {form.socialLinks.map((link, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Input value={link.platform} onChange={(e) => {
                const links = [...form.socialLinks]
                links[i] = { ...links[i], platform: e.target.value }
                setForm({ ...form, socialLinks: links })
              }} />
              <Input value={link.url} onChange={(e) => {
                const links = [...form.socialLinks]
                links[i] = { ...links[i], url: e.target.value }
                setForm({ ...form, socialLinks: links })
              }} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}
