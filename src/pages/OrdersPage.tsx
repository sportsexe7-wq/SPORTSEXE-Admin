import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'
import { cn } from '@/utils/cn'

const FILTERS: (OrderStatus | 'all')[] = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', filter],
    queryFn: () => adminService.getOrders(filter === 'all' ? undefined : filter),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-sm text-text-muted">Manage customer orders</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <DataTable<Order>
          data={orders}
          keyExtractor={(o) => o.id}
          columns={[
            {
              key: 'id', header: 'Order',
              cell: (o) => <Link to={`/orders/${o.id}`} className="font-medium text-brand hover:underline">{o.id}</Link>,
            },
            { key: 'customer', header: 'Customer', cell: (o) => (
              <div>
                <p>{o.customerName}</p>
                <p className="text-xs text-text-muted">{o.customerEmail}</p>
              </div>
            )},
            { key: 'items', header: 'Items', cell: (o) => o.items.length },
            { key: 'total', header: 'Total', cell: (o) => formatCurrency(o.total) },
            {
              key: 'status', header: 'Status',
              cell: (o) => (
                <select
                  value={o.status}
                  onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                  className={cn('rounded-md border border-border bg-surface-muted px-2 py-1 text-xs capitalize')}
                >
                  {FILTERS.filter((f) => f !== 'all').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ),
            },
            { key: 'date', header: 'Date', cell: (o) => <span className="text-text-muted text-xs">{formatDate(o.createdAt)}</span> },
          ]}
        />
      )}
    </div>
  )
}
