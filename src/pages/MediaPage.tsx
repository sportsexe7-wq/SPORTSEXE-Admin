import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Trash2, Search, Copy, CheckCircle } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { storageService } from '@/services/storageService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/utils/cn'

interface UploadingFile {
  name: string
  progress: number
}

export function MediaPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['media', debouncedSearch],
    queryFn: () => adminService.getMedia(debouncedSearch || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: async (item: { id: string; url: string }) => {
      await storageService.deleteByUrl(item.url)
      await adminService.deleteMedia(item.id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  })

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!fileArr.length) return

    setUploading(fileArr.map((f) => ({ name: f.name, progress: 0 })))

    await Promise.all(
      fileArr.map(async (file, idx) => {
        const url = await storageService.upload(file, 'media', (pct) => {
          setUploading((prev) =>
            prev.map((u, i) => (i === idx ? { ...u, progress: pct } : u)),
          )
        })
        await adminService.uploadMedia({ name: file.name, url, size: file.size })
      }),
    )

    setUploading([])
    queryClient.invalidateQueries({ queryKey: ['media'] })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    uploadFiles(e.dataTransfer.files)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-sm text-text-muted">{media.length} files</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4" /> Upload Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileInput}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer',
          dragging ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/50',
        )}
      >
        <Upload className="h-9 w-9 text-text-muted mb-3" />
        <p className="font-medium">Drag & drop images here</p>
        <p className="text-sm text-text-muted mt-1">or click to browse — PNG, JPG, WebP</p>
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u) => (
            <div key={u.name} className="rounded-lg border border-border bg-surface-elevated p-3">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="truncate font-medium">{u.name}</span>
                <span className="shrink-0 text-text-muted">{u.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-200"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Search media..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <p className="text-text-muted">Loading...</p>
      ) : media.length === 0 ? (
        <p className="text-center text-text-muted py-10">No images yet. Upload some above.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border">
              <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 bg-black/40 hover:bg-black/60"
                    onClick={() => copyUrl(item.url)}
                    title="Copy URL"
                  >
                    {copied === item.url
                      ? <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                      : <Copy className="h-3.5 w-3.5 text-white" />}
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 bg-black/40 hover:bg-red-500/80"
                    onClick={() => deleteMutation.mutate({ id: item.id, url: item.url })}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  </Button>
                </div>
                <div className="w-full">
                  <p className="truncate text-xs font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/60">{(item.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
