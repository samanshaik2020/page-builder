'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Users, Globe, Mail, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleGetStarted = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignIn = () => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Landing Page Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            🚀 Now with Multi-Admin Support
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Stunning Landing Pages
            <span className="text-blue-600"> in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional landing pages with our drag-and-drop builder. 
            Publish instantly, collect emails, and manage multiple pages - all with unique URLs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('/page/demo', '_blank')} className="text-lg px-8 py-3">
              View Demo Page
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern businesses and creators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Drag & Drop Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intuitive visual editor with pre-built components. No coding required.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Multi-Admin Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Each admin gets their own dashboard to create and manage multiple landing pages.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Unique URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every landing page gets a unique, SEO-friendly URL for easy sharing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Mail className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Email Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built-in email capture popups to grow your subscriber list automatically.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Check className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle>Instant Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Publish your pages instantly with one click. No deployment hassles.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <ArrowRight className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Analytics Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track email submissions and page performance with built-in analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your First Landing Page?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators and businesses using our platform
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Get Started Free - No Credit Card Required
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-lg font-semibold">Landing Page Builder</span>
          </div>
          <p className="text-gray-400">
            © 2024 Landing Page Builder. Built with Next.js and Supabase.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
