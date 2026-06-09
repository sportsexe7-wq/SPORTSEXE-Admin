import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Ban, CheckCircle } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/utils/format'
import { useDebounce } from '@/hooks/useDebounce'
import type { Customer } from '@/types'

export function CustomersPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const queryClient = useQueryClient()

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', debouncedSearch],
    queryFn: () => adminService.getCustomers(debouncedSearch || undefined),
  })

  const blockMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleBlockCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customers</h2>
        <p className="text-sm text-text-muted">{customers.length} customers</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input placeholder="Search customers..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <DataTable<Customer>
          data={customers}
          keyExtractor={(c) => c.id}
          columns={[
            { key: 'name', header: 'Name', cell: (c) => (
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-text-muted">{c.email}</p>
              </div>
            )},
            { key: 'orders', header: 'Orders', cell: (c) => c.orderCount },
            { key: 'spent', header: 'Total Spent', cell: (c) => formatCurrency(c.totalSpent) },
            { key: 'joined', header: 'Joined', cell: (c) => <span className="text-text-muted text-xs">{formatDate(c.createdAt)}</span> },
            { key: 'status', header: 'Status', cell: (c) => (
              <Badge variant={c.blocked ? 'destructive' : 'default'}>{c.blocked ? 'Blocked' : 'Active'}</Badge>
            )},
            { key: 'actions', header: '', cell: (c) => (
              <Button variant="ghost" size="sm" onClick={() => blockMutation.mutate(c.id)}>
                {c.blocked ? <><CheckCircle className="h-4 w-4" /> Unblock</> : <><Ban className="h-4 w-4" /> Block</>}
              </Button>
            )},
          ]}
        />
      )}
    </div>
  )
}
