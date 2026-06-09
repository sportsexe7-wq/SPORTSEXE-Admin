import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/utils/format'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => adminService.getOrder(id!),
    enabled: !!id,
  })

  if (isLoading) return <p className="text-text-muted">Loading...</p>
  if (!order) return <p>Order not found</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/orders"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{order.id}</h2>
          <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className="ml-auto capitalize">{order.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Customer Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-text-muted">Name:</span> {order.customerName}</p>
            <p><span className="text-text-muted">Email:</span> {order.customerEmail}</p>
            <p><span className="text-text-muted">Phone:</span> {order.shippingAddress.phone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Payment Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-text-muted">Method:</span> {order.paymentMethod}</p>
            <p><span className="text-text-muted">Subtotal:</span> {formatCurrency(order.subtotal)}</p>
            <p><span className="text-text-muted">Shipping:</span> {formatCurrency(order.shipping)}</p>
            {order.discount > 0 && <p><span className="text-text-muted">Discount:</span> -{formatCurrency(order.discount)}</p>}
            <p className="font-bold"><span className="text-text-muted font-normal">Total:</span> {formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Shipping Info</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p>{order.shippingAddress.fullName}</p>
            <p className="text-text-muted">{order.shippingAddress.address}</p>
            <p className="text-text-muted">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tracking Info</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {order.trackingNumber ? (
              <p><span className="text-text-muted">Tracking:</span> {order.trackingNumber}</p>
            ) : (
              <p className="text-text-muted">No tracking number yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image} alt="" className="h-14 w-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-text-muted">Size {item.size} × {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
