'use client'

import { useState } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'



export function ImageUpload({ onUpload, currentImageId, bucketId }) {
  const [isUploading, setIsUploading] = useState(false)
  
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    try {
      await onUpload(file)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('imageUpload')?.click()}
          className={cn(
            "relative",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {currentImageId && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <Image
            src={`${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${bucketId}/files/${currentImageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
            alt="Blog featured image"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  )
} 