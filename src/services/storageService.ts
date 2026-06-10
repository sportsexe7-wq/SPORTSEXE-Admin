import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export interface UploadProgress {
  progress: number  // 0-100
  url?: string
}

export const storageService = {
  /**
   * Upload a file to Firebase Storage and return its public download URL.
   * onProgress is called with 0–100 as bytes transfer.
   */
  upload(
    file: File,
    folder: 'media' | 'products' = 'media',
    onProgress?: (pct: number) => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const storageRef = ref(storage, filename)
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          onProgress?.(pct)
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        },
      )
    })
  },

  async deleteByUrl(url: string): Promise<void> {
    try {
      // Extract path from the download URL
      const decodedUrl = decodeURIComponent(url)
      const match = decodedUrl.match(/\/o\/(.+?)\?/)
      if (!match) return
      const path = match[1]
      await deleteObject(ref(storage, path))
    } catch {
      // Ignore — file may not exist in storage (e.g. external URL)
    }
  },
}
