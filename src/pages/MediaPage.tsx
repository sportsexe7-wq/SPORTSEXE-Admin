import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Trash2, Search } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'

export function MediaPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const queryClient = useQueryClient()

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['media', debouncedSearch],
    queryFn: () => adminService.getMedia(debouncedSearch || undefined),
  })

  const uploadMutation = useMutation({
    mutationFn: () =>
      adminService.uploadMedia({
        name: `upload-${Date.now()}.jpg`,
        url: `https://images.unsplash.com/photo-${1551958219 + Math.floor(Math.random() * 1000)}-acbc608c6377?w=400&q=80`,
        size: Math.floor(Math.random() * 500000) + 100000,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteMedia(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-sm text-text-muted">{media.length} files</p>
        </div>
        <Button onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending}>
          <Upload className="h-4 w-4" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>

      <div
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center hover:border-brand/50 transition-colors cursor-pointer"
        onClick={() => uploadMutation.mutate()}
      >
        <Upload className="h-10 w-10 text-text-muted mb-3" />
        <p className="font-medium">Drag & drop images here</p>
        <p className="text-sm text-text-muted mt-1">or click to upload (auto-compressed)</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input placeholder="Search media..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? <p className="text-text-muted">Loading...</p> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border">
              <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium">{item.name}</p>
                  <p className="text-xs text-text-muted">{(item.size / 1024).toFixed(0)} KB</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => deleteMutation.mutate(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
