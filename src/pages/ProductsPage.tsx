import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Copy, Upload, X, ImagePlus } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { storageService } from '@/services/storageService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Product } from '@/types'

const CATEGORIES = ['Clubs', 'Countries', 'World Cup', 'Retro', 'Training Kits', 'Player Edition', 'Accessories', 'IPL', 'Flags']

const emptyProduct = (): Partial<Product> => ({
  title: '', slug: '', description: '', shortDescription: '',
  price: 0, stock: 0, category: 'Clubs', subCategory: 'Home',
  team: '', league: '', country: '', season: '2024/25',
  sizes: ['S', 'M', 'L', 'XL'], images: [], tags: [],
  featured: false, trending: false, bestSeller: false,
  playerEdition: false, retroEdition: false,
})

interface ImageUploadState {
  name: string
  progress: number
}

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [uploadingImages, setUploadingImages] = useState<ImageUploadState[]>([])
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => adminService.getProducts(),
  })

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      if (data.id) return adminService.updateProduct(data.id, data)
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
    saveMutation.mutate({ ...editing, slug })
  }

  // ── Image upload ───────────────────────────────────────────
  const uploadImages = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!fileArr.length) return

    setUploadingImages(fileArr.map((f) => ({ name: f.name, progress: 0 })))

    const urls = await Promise.all(
      fileArr.map(async (file, idx) => {
        const url = await storageService.upload(file, 'products', (pct) => {
          setUploadingImages((prev) =>
            prev.map((u, i) => (i === idx ? { ...u, progress: pct } : u)),
          )
        })
        // Also register in media library
        await adminService.uploadMedia({ name: file.name, url, size: file.size })
        return url
      }),
    )

    setUploadingImages([])
    setEditing((prev) => prev ? { ...prev, images: [...(prev.images ?? []), ...urls] } : prev)
    queryClient.invalidateQueries({ queryKey: ['media'] })
  }

  const removeImage = (idx: number) => {
    setEditing((prev) =>
      prev ? { ...prev, images: prev.images?.filter((_, i) => i !== idx) } : prev,
    )
  }

  const setCover = (idx: number) => {
    setEditing((prev) => {
      if (!prev?.images) return prev
      const imgs = [...prev.images]
      const [cover] = imgs.splice(idx, 1)
      return { ...prev, images: [cover, ...imgs] }
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadImages(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    uploadImages(e.dataTransfer.files)
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
                  {p.images[0]
                    ? <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                    : <div className="h-10 w-10 rounded bg-surface-muted flex items-center justify-center"><ImagePlus className="h-4 w-4 text-text-muted" /></div>
                  }
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
                <div className="flex gap-1 flex-wrap">
                  {p.featured && <Badge>Featured</Badge>}
                  {p.trending && <Badge variant="secondary">Trending</Badge>}
                  {p.bestSeller && <Badge variant="outline">Best Seller</Badge>}
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
          <div className="space-y-5">

            {/* ── Images ── */}
            <div>
              <Label>Product Images</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {editing.images?.map((url, i) => (
                  <div key={url} className="relative group">
                    <img src={url} alt="" className={cn('h-20 w-20 rounded-lg object-cover border-2 transition-colors', i === 0 ? 'border-brand' : 'border-border')} />
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 ? (
                      <span className="absolute bottom-1 left-1 rounded text-[9px] font-bold bg-brand text-black px-1">COVER</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCover(i)}
                        className="absolute bottom-1 left-1 rounded text-[9px] font-bold bg-black/70 text-white px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        Set cover
                      </button>
                    )}
                  </div>
                ))}

                {/* Upload tile */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                    dragging ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/50',
                  )}
                >
                  <Upload className="h-5 w-5 text-text-muted" />
                  <span className="mt-1 text-[10px] text-text-muted">Upload</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileInput} />
              </div>

              {/* Upload progress bars */}
              {uploadingImages.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {uploadingImages.map((u) => (
                    <div key={u.name}>
                      <div className="flex justify-between text-xs text-text-muted mb-0.5">
                        <span className="truncate">{u.name}</span>
                        <span>{u.progress}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-surface-muted">
                        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${u.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Basic fields ── */}
            {(['title', 'slug', 'shortDescription', 'team', 'country', 'season'] as const).map((field) => (
              <div key={field}>
                <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  className="mt-1"
                  value={(editing[field] as string) ?? ''}
                  onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                />
              </div>
            ))}

            {/* ── Category ── */}
            <div>
              <Label>Category</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-border bg-surface-muted px-3 text-sm"
                value={editing.category ?? 'Clubs'}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* ── Pricing & stock ── */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Price (₹)</Label>
                <Input type="number" className="mt-1" value={editing.price ?? 0}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Sale Price (₹)</Label>
                <Input type="number" className="mt-1" value={editing.salePrice ?? ''}
                  onChange={(e) => setEditing({ ...editing, salePrice: Number(e.target.value) || undefined })} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" className="mt-1" value={editing.stock ?? 0}
                  onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
              </div>
            </div>

            {/* ── Description ── */}
            <div>
              <Label>Description</Label>
              <textarea
                className="mt-1 flex min-h-20 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm"
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            {/* ── Flags ── */}
            <div className="flex flex-wrap gap-4">
              {(['featured', 'trending', 'bestSeller', 'playerEdition', 'retroEdition'] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={!!editing[flag]}
                    onChange={(e) => setEditing({ ...editing, [flag]: e.target.checked })} />
                  <span className="capitalize">{flag.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saveMutation.isPending || uploadingImages.length > 0}>
              {uploadingImages.length > 0 ? 'Uploading images…' : saveMutation.isPending ? 'Saving…' : 'Save Product'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
