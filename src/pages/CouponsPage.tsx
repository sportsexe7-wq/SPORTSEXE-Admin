import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Coupon, CouponType } from '@/types'

export function CouponsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [code, setCode] = useState('')
  const [type, setType] = useState<CouponType>('percentage')
  const [value, setValue] = useState(10)
  const [minOrder, setMinOrder] = useState<number | ''>('')
  const queryClient = useQueryClient()

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => adminService.getCoupons(),
  })

  const createMutation = useMutation({
    mutationFn: () => adminService.createCoupon({
      code: code.toUpperCase(),
      type,
      value,
      minOrder: minOrder !== '' ? minOrder : undefined,
      active: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      setModalOpen(false)
      setCode('')
      setMinOrder('')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (coupon: Coupon) => adminService.updateCoupon(coupon.id, { active: !coupon.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coupons</h2>
          <p className="text-sm text-text-muted">Manage discount codes</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Coupon</Button>
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <DataTable<Coupon>
          data={coupons}
          keyExtractor={(c) => c.id}
          columns={[
            { key: 'code', header: 'Code', cell: (c) => <span className="font-mono font-bold">{c.code}</span> },
            { key: 'type', header: 'Type', cell: (c) => <Badge variant="secondary" className="capitalize">{c.type.replace('-', ' ')}</Badge> },
            {
              key: 'value', header: 'Value',
              cell: (c) => c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `₹${c.value}` : 'Free Shipping',
            },
            { key: 'minOrder', header: 'Min Order', cell: (c) => c.minOrder ? `₹${c.minOrder}` : '—' },
            { key: 'usage', header: 'Used', cell: (c) => c.usageCount },
            {
              key: 'active', header: 'Status',
              cell: (c) => <Badge variant={c.active ? 'default' : 'outline'}>{c.active ? 'Active' : 'Inactive'}</Badge>,
            },
            {
              key: 'actions', header: '',
              cell: (c) => (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMutation.mutate(c)}
                  >
                    {c.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Create Coupon">
        <div className="space-y-4">
          <div>
            <Label>Code</Label>
            <Input
              className="mt-1 font-mono uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SPORT10"
            />
          </div>
          <div>
            <Label>Type</Label>
            <select
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-surface-muted px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as CouponType)}
            >
              <option value="percentage">Percentage Discount</option>
              <option value="fixed">Fixed Discount</option>
              <option value="free-shipping">Free Shipping</option>
            </select>
          </div>
          {type !== 'free-shipping' && (
            <div>
              <Label>Value {type === 'percentage' ? '(%)' : '(₹)'}</Label>
              <Input
                type="number"
                className="mt-1"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </div>
          )}
          <div>
            <Label>Minimum Order Amount (₹) — optional</Label>
            <Input
              type="number"
              className="mt-1"
              value={minOrder}
              placeholder="e.g. 1999"
              onChange={(e) => setMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!code || createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
