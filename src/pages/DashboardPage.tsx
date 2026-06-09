import { useQuery } from '@tanstack/react-query'
import { Package, IndianRupee, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Order } from '@/types'

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => adminService.getDashboard(),
  })

  if (isLoading || !stats) {
    return <p className="text-text-muted">Loading dashboard...</p>
  }

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: Package },
    { label: 'Revenue', value: formatCurrency(stats.revenue), icon: IndianRupee },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock },
    { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-text-muted">Store overview at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                <Icon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-sm text-text-muted">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Jerseys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topSellingJerseys.map(({ product, sold }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-text-muted">{sold} sold</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(product.salePrice ?? product.price)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockAlerts.length === 0 ? (
              <p className="text-sm text-text-muted">All products well stocked</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockAlerts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-sm">{p.title}</span>
                    <Badge variant="warning">{p.stock} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Order>
            data={stats.recentOrders}
            keyExtractor={(o) => o.id}
            columns={[
              { key: 'id', header: 'Order', cell: (o) => <span className="font-medium">{o.id}</span> },
              { key: 'customer', header: 'Customer', cell: (o) => o.customerName },
              { key: 'total', header: 'Total', cell: (o) => formatCurrency(o.total) },
              {
                key: 'status', header: 'Status',
                cell: (o) => <Badge variant={o.status === 'delivered' ? 'default' : o.status === 'pending' ? 'warning' : 'secondary'} className="capitalize">{o.status}</Badge>,
              },
              { key: 'date', header: 'Date', cell: (o) => <span className="text-text-muted">{formatDate(o.createdAt)}</span> },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
