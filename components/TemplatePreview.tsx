'use client'

import React from 'react'
import Image from 'next/image'
import { type TemplateInfo } from '@/lib/store'

interface TemplatePreviewProps {
  template: TemplateInfo
  className?: string
}

export function TemplatePreview({ template, className = '' }: TemplatePreviewProps) {
  // Map template IDs to their corresponding preview images
  const getPreviewImage = () => {
    switch (template.id) {
      case 'template1':
        return '/modern landing page.png'
      case 'template2':
        return '/saas product.png'
      case 'template3':
        return '/creative agency.png'
      case 'product-template':
        return '/product launch.png'
      default:
        return '/portfolio.png'
    }
  }

  const previewImage = getPreviewImage()

  return (
    <div className={`aspect-video bg-white rounded-lg border overflow-hidden ${className}`}>
      <Image
        src={previewImage}
        alt={`${template.name} template preview`}
        width={400}
        height={225}
        className="w-full h-full object-cover"
        priority={false}
      />
    </div>
  )
}
