import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: {
    default: 'SquPage - Landing Page Builder',
    template: '%s | SquPage'
  },
  description: 'Create stunning landing pages with our drag-and-drop builder. Build, customize, and deploy professional landing pages in minutes.',
  keywords: ['landing page builder', 'drag and drop', 'website builder', 'page builder', 'squpage'],
  authors: [{ name: 'SquPage Team' }],
  creator: 'SquPage',
  publisher: 'SquPage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://squpage.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SquPage - Landing Page Builder',
    description: 'Create stunning landing pages with our drag-and-drop builder',
    url: 'https://squpage.com',
    siteName: 'SquPage',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SquPage Landing Page Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SquPage - Landing Page Builder',
    description: 'Create stunning landing pages with our drag-and-drop builder',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
