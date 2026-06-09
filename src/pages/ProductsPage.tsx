import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Copy } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types'

const emptyProduct = (): Partial<Product> => ({
  title: '', slug: '', description: '', shortDescription: '',
  price: 0, stock: 0, category: 'Clubs', subCategory: 'Home',
  team: '', league: '', country: '', season: '2024/25',
  sizes: ['S', 'M', 'L', 'XL'], images: [], tags: [],
  featured: false, trending: false, bestSeller: false,
  playerEdition: false, retroEdition: false,
})

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => adminService.getProducts(),
  })

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      if (data.id) {
        return adminService.updateProduct(data.id, data)
      }
      return adminService.createProduct(data as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => adminService.duplicateProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const openCreate = () => { setEditing(emptyProduct()); setModalOpen(true) }
  const openEdit = (p: Product) => { setEditing({ ...p }); setModalOpen(true) }

  const handleSave = () => {
    if (!editing?.title) return
    const slug = editing.slug || editing.title.toLowerCase().replace(/\s+/g, '-')
    saveMutation.mutate({ ...editing, slug, images: editing.images?.length ? editing.images : ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&q=80'] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-text-muted">{products.length} products</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create Product</Button>
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <DataTable<Product>
          data={products}
          keyExtractor={(p) => p.id}
          columns={[
            {
              key: 'product', header: 'Product',
              cell: (p) => (
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-text-muted">{p.team}</p>
                  </div>
                </div>
              ),
            },
            { key: 'category', header: 'Category', cell: (p) => p.category },
            { key: 'price', header: 'Price', cell: (p) => formatCurrency(p.salePrice ?? p.price) },
            {
              key: 'stock', header: 'Stock',
              cell: (p) => <Badge variant={p.stock <= 10 ? 'warning' : 'secondary'}>{p.stock}</Badge>,
            },
            {
              key: 'flags', header: 'Flags',
              cell: (p) => (
                <div className="flex gap-1">
                  {p.featured && <Badge>Featured</Badge>}
                  {p.trending && <Badge variant="secondary">Trending</Badge>}
                </div>
              ),
            },
            {
              key: 'actions', header: '',
              cell: (p) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => duplicateMutation.mutate(p.id)}><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing?.id ? 'Edit Product' : 'Create Product'}>
        {editing && (
          <div className="space-y-4">
            {(['title', 'slug', 'shortDescription', 'team', 'category', 'country', 'season'] as const).map((field) => (
              <div key={field}>
                <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  className="mt-1"
                  value={(editing[field] as string) ?? ''}
                  onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input type="number" className="mt-1" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Sale Price</Label>
                <Input type="number" className="mt-1" value={editing.salePrice ?? ''} onChange={(e) => setEditing({ ...editing, salePrice: Number(e.target.value) || undefined })} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" className="mt-1" value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="mt-1 flex min-h-20 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm"
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {(['featured', 'trending', 'bestSeller', 'playerEdition', 'retroEdition'] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing[flag]} onChange={(e) => setEditing({ ...editing, [flag]: e.target.checked })} />
                  <span className="capitalize">{flag.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
