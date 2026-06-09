import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Banner } from '@/types'

export function BannersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', buttonText: 'Shop Now', buttonLink: '/', priority: 1, active: true })
  const queryClient = useQueryClient()

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => adminService.getBanners(),
  })

  const createMutation = useMutation({
    mutationFn: () => adminService.createBanner(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminService.updateBanner(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Banners</h2>
          <p className="text-sm text-text-muted">Homepage hero carousel</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Banner</Button>
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onDelete={() => deleteMutation.mutate(banner.id)}
              onToggle={() => toggleMutation.mutate({ id: banner.id, active: !banner.active })}
            />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Create Banner">
        <div className="space-y-4">
          {(['title', 'subtitle', 'image', 'buttonText', 'buttonLink'] as const).map((field) => (
            <div key={field}>
              <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
              <Input className="mt-1" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <div>
            <Label>Priority</Label>
            <Input type="number" className="mt-1" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
          </div>
          <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!form.title}>Create</Button>
        </div>
      </Modal>
    </div>
  )
}

function BannerCard({ banner, onDelete, onToggle }: { banner: Banner; onDelete: () => void; onToggle: () => void }) {
  return (
    <div className="flex gap-4 overflow-hidden rounded-xl border border-border">
      <img src={banner.image} alt="" className="h-24 w-40 shrink-0 object-cover" />
      <div className="flex flex-1 items-center justify-between py-3 pr-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold">{banner.title}</p>
            <Badge variant={banner.active ? 'default' : 'outline'}>{banner.active ? 'Active' : 'Inactive'}</Badge>
            <Badge variant="secondary">P{banner.priority}</Badge>
          </div>
          <p className="text-sm text-text-muted">{banner.subtitle}</p>
          <p className="text-xs text-text-muted mt-1">{banner.buttonText} → {banner.buttonLink}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onToggle}>{banner.active ? 'Deactivate' : 'Activate'}</Button>
          <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
      </div>
    </div>
  )
}
