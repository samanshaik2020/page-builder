'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { databaseService } from '@/lib/database'
import { ElementRenderer } from '@/components/ElementRenderer'
import { EmailCollectionDialog } from '@/components/EmailCollectionDialog'
import { Editor, Frame, Element } from '@craftjs/core'
import type { LandingPage } from '@/lib/supabase'
import type { ElementData } from '@/lib/store'

export default function PublishedPage() {
  const params = useParams()
  const slug = params.slug as string
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  useEffect(() => {
    loadPage()
  }, [slug])

  useEffect(() => {
    // Show email collection dialog after page loads
    if (landingPage && !loading) {
      const timer = setTimeout(() => {
        setShowEmailDialog(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [landingPage, loading])

  const loadPage = async () => {
    if (!slug) return

    setLoading(true)
    setError(null)

    try {
      const { landingPage: page, error: dbError } = await databaseService.getLandingPageBySlug(slug)
      
      if (dbError) {
        setError('Page not found')
        console.error('Error loading page:', dbError)
      } else if (page) {
        setLandingPage(page)
      } else {
        setError('Page not found')
      }
    } catch (err) {
      setError('Failed to load page')
      console.error('Error loading page:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    if (!landingPage) return

    try {
      const { error } = await databaseService.collectEmail({
        landing_page_id: landingPage.id,
        email,
        user_agent: navigator.userAgent,
        // Note: IP address would need to be collected server-side for privacy/security
      })

      if (error) {
        console.error('Error collecting email:', error)
        throw new Error('Failed to save email')
      }
    } catch (err) {
      console.error('Error submitting email:', err)
      throw err
    }
  }

  const renderElements = (elements: Record<string, ElementData>) => {
    const rootElement = elements.root
    if (!rootElement) return null

    const renderElement = (elementData: ElementData): React.ReactNode => {
      const { id, type, content, imageUrl, styles, href, children } = elementData

      const elementProps = {
        id,
        style: {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          padding: styles.padding ? `${styles.padding[0]}px ${styles.padding[1]}px ${styles.padding[2]}px ${styles.padding[3]}px` : undefined,
          margin: styles.margin ? `${styles.margin[0]}px ${styles.margin[1]}px ${styles.margin[2]}px ${styles.margin[3]}px` : undefined,
          borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
          width: styles.width ? `${styles.width}px` : undefined,
          height: styles.height ? `${styles.height}px` : undefined,
          minHeight: styles.minHeight ? `${styles.minHeight}px` : undefined,
          textAlign: styles.textAlign,
          flexDirection: styles.flexDirection,
          alignItems: styles.alignItems,
          gap: styles.gap ? `${styles.gap}px` : undefined,
          fontFamily: styles.fontFamily,
          objectFit: styles.objectFit,
        }
      }

      switch (type) {
        case 'text':
        case 'paragraph':
          return (
            <div key={id} {...elementProps}>
              {content?.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          )

        case 'button':
          return (
            <button
              key={id}
              {...elementProps}
              onClick={() => href && window.open(href, '_blank')}
              className="cursor-pointer border-none outline-none"
            >
              {content}
            </button>
          )

        case 'image':
          return (
            <img
              key={id}
              src={imageUrl}
              alt={content || 'Image'}
              {...elementProps}
            />
          )

        case 'container':
          return (
            <div key={id} {...elementProps}>
              {children?.map(childId => {
                const childElement = elements[childId]
                return childElement ? renderElement(childElement) : null
              })}
            </div>
          )

        default:
          return null
      }
    }

    return renderElement(rootElement)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading page...</p>
        </div>
      </div>
    )
  }

  if (error || !landingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The page you are looking for does not exist.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen">
        <title>{landingPage.title}</title>
        {renderElements(landingPage.elements_data)}
      </div>
      
      <EmailCollectionDialog
        shouldShow={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        onSubmit={handleEmailSubmit}
        pageTitle={landingPage.title}
      />
    </>
  )
}
