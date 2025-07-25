'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Link, X } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export function ImageUpload({ value, onChange, label = "Image", placeholder = "https://example.com/image.jpg" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 data URL for immediate use
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onChange(dataUrl)
        setIsUploading(false)
      }
      reader.onerror = () => {
        alert('Error reading file')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
      setIsUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
  }

  const clearImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          <span className="text-xs text-muted-foreground">or</span>
          <Link className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">paste URL above</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview */}
      {value && (
        <div className="mt-2">
          <Label className="text-sm text-muted-foreground">Preview:</Label>
          <div className="mt-1 border rounded-lg overflow-hidden bg-gray-50">
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover"
              onError={() => {
                // If image fails to load, show error state
                console.error('Failed to load image:', value)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
