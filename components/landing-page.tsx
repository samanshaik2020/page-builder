"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Zap, Rocket } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm sticky top-0 z-40">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <span className="text-lg font-bold text-gray-900">LiteBuilder</span>
          <span className="sr-only">LiteBuilder</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            Testimonials
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 xl:py-60 bg-gradient-to-br from-blue-600 to-purple-700 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10 z-0"></div> {/* Decorative pattern */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight animate-fade-in-up">
              Your Vision, Built in Minutes.
            </h1>
            <p className="max-w-[800px] text-lg md:text-xl animate-fade-in-up delay-200 opacity-90">
              Craft stunning, high-converting landing pages with LiteBuilder's intuitive drag-and-drop interface. No
              code, just creativity.
            </p>
            <div className="space-x-4 animate-fade-in-up delay-400">
              <Link href="/dashboard" prefetch={false}>
                <Button className="inline-flex h-12 items-center justify-center rounded-full bg-white text-blue-700 px-10 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features" prefetch={false}>
                <Button
                  variant="outline"
                  className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white text-white bg-transparent px-10 text-base font-semibold shadow-md transition-all hover:scale-105 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-28 lg:py-36 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                Unleash Your Creativity with Powerful Tools
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                LiteBuilder provides everything you need to design, launch, and optimize your landing pages.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-10 py-16 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2">
              <CardHeader className="flex flex-col items-center text-center">
                <CheckCircle className="h-10 w-10 text-blue-600 mb-4 transition-transform group-hover:scale-110" />
                <CardTitle className="text-2xl font-semibold text-gray-900">Intuitive Drag & Drop</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-center">
                Build visually with a seamless drag-and-drop editor. No coding expertise required.
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2">
              <CardHeader className="flex flex-col items-center text-center">
                <Zap className="h-10 w-10 text-purple-600 mb-4 transition-transform group-hover:scale-110" />
                <CardTitle className="text-2xl font-semibold text-gray-900">Fully Responsive</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-center">
                Your pages adapt beautifully to any screen size, ensuring a perfect user experience.
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2">
              <CardHeader className="flex flex-col items-center text-center">
                <Rocket className="h-10 w-10 text-green-600 mb-4 transition-transform group-hover:scale-110" />
                <CardTitle className="text-2xl font-semibold text-gray-900">Conversion Optimized</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-center">
                Access a library of high-converting templates designed to boost your results.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-28 lg:py-36 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900">
              Simple Steps to Your Perfect Page
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get your landing page live in three easy steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-3xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a Template</h3>
              <p className="text-gray-600">
                Start with one of our professionally designed, conversion-focused templates.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 text-3xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customize with Ease</h3>
              <p className="text-gray-600">
                Drag and drop elements, change text, colors, and images to match your brand.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Publish & Grow</h3>
              <p className="text-gray-600">
                Launch your page with a single click and start converting visitors into customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-16 md:py-28 lg:py-36 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900">What Our Users Are Saying</h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from businesses and individuals who have transformed their online presence with LiteBuilder.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardContent className="flex flex-col items-center text-center">
                <img
                  src="/placeholder-user.jpg"
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="rounded-full mb-4 object-cover"
                />
                <p className="text-lg italic text-gray-700 mb-4">
                  &quot;LiteBuilder made it incredibly easy to create a professional landing page for my new product.
                  The drag-and-drop interface is a game-changer!&quot;
                </p>
                <p className="font-semibold text-gray-900">- Jane Doe, Startup Founder</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardContent className="flex flex-col items-center text-center">
                <img
                  src="/placeholder-user.jpg"
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="rounded-full mb-4 object-cover"
                />
                <p className="text-lg italic text-gray-700 mb-4">
                  &quot;I&apos;m not a designer, but LiteBuilder allowed me to create a beautiful and responsive page
                  that looks amazing on all devices.&quot;
                </p>
                <p className="font-semibold text-gray-900">- John Smith, Small Business Owner</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardContent className="flex flex-col items-center text-center">
                <img
                  src="/placeholder-user.jpg"
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="rounded-full mb-4 object-cover"
                />
                <p className="text-lg italic text-gray-700 mb-4">
                  &quot;The templates are fantastic, and the customization options are endless. Highly recommend
                  LiteBuilder for anyone needing a quick and effective landing page.&quot;
                </p>
                <p className="font-semibold text-gray-900">- Emily White, Marketing Manager</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Ready to Transform Your Online Presence?
            </h2>
            <p className="max-w-[800px] text-lg md:text-xl opacity-90">
              Join thousands of successful users who are building amazing landing pages with LiteBuilder.
            </p>
            <Link href="/dashboard" prefetch={false}>
              <Button className="inline-flex h-12 items-center justify-center rounded-full bg-white text-blue-700 px-10 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white text-gray-600">
        <p className="text-xs">&copy; 2024 LiteBuilder. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
