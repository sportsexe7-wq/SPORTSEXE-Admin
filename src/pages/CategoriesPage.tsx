import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category } from '@/types'

const CATEGORY_TYPES = [
  'clubs', 'countries', 'world-cup', 'retro', 'training-kits', 'player-edition', 'new-arrivals',
] as const

const emptyForm = () => ({ name: '', type: 'clubs' as Category['type'] })

export function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<{ id?: string; name: string; type: Category['type'] }>(emptyForm())
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminService.getCategories(),
  })

  const createMutation = useMutation({
    mutationFn: () => adminService.createCategory({
      name: editing.name,
      slug: editing.name.toLowerCase().replace(/\s+/g, '-'),
      type: editing.type,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setModalOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: () => adminService.updateCategory(editing.id!, {
      name: editing.name,
      slug: editing.name.toLowerCase().replace(/\s+/g, '-'),
      type: editing.type,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setModalOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const openCreate = () => { setEditing(emptyForm()); setModalOpen(true) }
  const openEdit = (c: Category) => { setEditing({ id: c.id, name: c.name, type: c.type }); setModalOpen(true) }
  const handleSave = () => editing.id ? updateMutation.mutate() : createMutation.mutate()
  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-sm text-text-muted">Manage product categories</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create Category</Button>
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <DataTable<Category>
          data={categories}
          keyExtractor={(c) => c.id}
          columns={[
            { key: 'name', header: 'Name', cell: (c) => <span className="font-medium">{c.name}</span> },
            { key: 'slug', header: 'Slug', cell: (c) => <span className="text-text-muted">{c.slug}</span> },
            { key: 'type', header: 'Type', cell: (c) => <span className="capitalize">{c.type.replace(/-/g, ' ')}</span> },
            { key: 'count', header: 'Products', cell: (c) => c.productCount },
            {
              key: 'actions', header: '',
              cell: (c) => (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing.id ? 'Edit Category' : 'Create Category'}>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              className="mt-1"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="e.g. Clubs"
            />
          </div>
          <div>
            <Label>Type</Label>
            <select
              className="mt-1 flex h-10 w-full rounded-md border border-border bg-surface-muted px-3 text-sm"
              value={editing.type}
              onChange={(e) => setEditing({ ...editing, type: e.target.value as Category['type'] })}
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!editing.name || isPending}
          >
            {isPending ? 'Saving...' : editing.id ? 'Save Changes' : 'Create'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
