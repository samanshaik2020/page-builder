import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClientComponentClient } from "@/lib/supabase"
import { nanoid } from "nanoid" // Used for unique ID generation, add it to package.json if not present.

export interface ElementData {
  id: string
  type: "text" | "button" | "image" | "container"
  content?: string
  imageUrl?: string
  styles: {
    fontSize?: number
    fontWeight?: number
    color?: string
    backgroundColor?: string
    padding?: number[]
    margin?: number[]
    borderRadius?: number
    width?: number
    height?: number
    textAlign?: "left" | "center" | "right"
    xPosition?: number
    yPosition?: number
  }
  href?: string
  children?: string[]
}

export interface ProjectData {
  id: string // Supabase UUID
  user_id: string // Supabase auth user ID
  title: string
  slug: string
  elements: Record<string, ElementData>
  is_published: boolean
  created_at: string
  updated_at: string
}

interface EditorStore {
  currentProjectId: string | null
  currentUserId: string | null // New state to store current user ID
  elements: Record<string, ElementData>
  selectedElementId: string | null
  showElementsPanel: boolean
  showSectionsPanel: boolean
  draggedElement: ElementData | null
  insertionTargetId: string | null
  initialLoadComplete: boolean // To track initial loading of user/project

  // Actions
  setCurrentProject: (projectId: string, userId: string | null) => void
  setElements: (elements: Record<string, ElementData>) => void
  addElement: (element: ElementData, explicitTargetId?: string) => void
  updateElement: (id: string, updates: Partial<ElementData>) => void
  deleteElement: (id: string) => void
  setSelectedElement: (id: string | null) => void
  toggleElementsPanel: () => void
  toggleSectionsPanel: () => void
  setDraggedElement: (element: ElementData | null) => void
  setInsertionTarget: (id: string | null) => void
  setInitialLoadComplete: (status: boolean) => void // New action

  // Supabase interactions
  saveProject: () => Promise<void>
  loadProject: (projectId: string) => Promise<boolean>
  resetToOriginal: () => void
  publishProject: (projectId: string, isPublished: boolean) => Promise<void>
  createNewProject: (
    title: string,
    initialElements: Record<string, ElementData>,
    userId: string,
  ) => Promise<ProjectData | null>
  hasUnsavedChanges: () => boolean
}

const generateId = () => nanoid(9) // Using nanoid for shorter, unique IDs

// Template 1: Modern Landing Page
const template1Elements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero", "features", "cta"],
  },
  hero: {
    id: "hero",
    type: "container",
    styles: {
      backgroundColor: "#f8fafc",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0], // Added margin for spacing between sections
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero-title", "hero-subtitle", "hero-button"],
  },
  "hero-title": {
    id: "hero-title",
    type: "text",
    content: "Build Amazing Landing Pages",
    styles: {
      fontSize: 48,
      fontWeight: 700,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-subtitle": {
    id: "hero-subtitle",
    type: "text",
    content: "Create stunning, responsive landing pages with our drag-and-drop builder. No coding required.",
    styles: {
      fontSize: 20,
      color: "#6b7280",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-button": {
    id: "hero-button",
    type: "button",
    content: "Get Started Free",
    href: "#",
    styles: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      fontSize: 18,
      padding: [16, 32, 16, 32],
      borderRadius: 8,
      margin: [0, 0, 0, 0], // Added margin
      xPosition: 0,
      yPosition: 0,
    },
  },
  features: {
    id: "features",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0], // Added margin for spacing between sections
      xPosition: 0,
      yPosition: 0,
    },
    children: ["features-title", "features-text", "features-image"],
  },
  "features-title": {
    id: "features-title",
    type: "text",
    content: "Powerful Features",
    styles: {
      fontSize: 36,
      fontWeight: 600,
      color: "#1f2937",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "features-text": {
    id: "features-text",
    content:
      "Our platform provides everything you need to create professional landing pages that convert visitors into customers.",
    styles: {
      fontSize: 16,
      color: "#6b7280",
      margin: [0, 0, 24, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "features-image": {
    id: "features-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=300&width=500",
    styles: {
      width: 500,
      height: 300,
      borderRadius: 8,
      margin: [0, 0, 0, 0], // Added margin
      xPosition: 0,
      yPosition: 0,
    },
  },
  cta: {
    id: "cta",
    type: "container",
    styles: {
      backgroundColor: "#1f2937",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0], // Added margin for spacing between sections
      xPosition: 0,
      yPosition: 0,
    },
    children: ["cta-title", "cta-subtitle", "cta-button"],
  },
  "cta-title": {
    id: "cta-title",
    type: "text",
    content: "Ready to Transform Your Business?",
    styles: {
      fontSize: 36,
      fontWeight: 600,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "cta-subtitle": {
    id: "cta-subtitle",
    type: "text",
    content: "Join thousands of businesses that have already transformed their online presence with our platform.",
    styles: {
      fontSize: 18,
      color: "#d1d5db",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "cta-button": {
    id: "cta-button",
    type: "button",
    content: "Start Your Free Trial",
    href: "#",
    styles: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      fontSize: 18,
      padding: [16, 32, 16, 32],
      borderRadius: 8,
      margin: [0, 0, 0, 0], // Added margin
      xPosition: 0,
      yPosition: 0,
    },
  },
}

// Template 2: SaaS Product Page
const template2Elements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero", "stats", "features", "testimonial", "pricing", "cta"],
  },
  hero: {
    id: "hero",
    type: "container",
    styles: {
      backgroundColor: "#0f172a",
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero-title", "hero-subtitle", "hero-buttons"],
  },
  "hero-title": {
    id: "hero-title",
    type: "text",
    content: "The Future of SaaS is Here",
    styles: {
      fontSize: 56,
      fontWeight: 800,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-subtitle": {
    id: "hero-subtitle",
    type: "text",
    content: "Streamline your workflow with our cutting-edge platform. Trusted by 10,000+ companies worldwide.",
    styles: {
      fontSize: 22,
      color: "#cbd5e1",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-buttons": {
    id: "hero-buttons",
    type: "container",
    styles: {
      backgroundColor: "transparent",
      padding: [0, 0, 0, 0],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero-primary-btn", "hero-secondary-btn"],
  },
  "hero-primary-btn": {
    id: "hero-primary-btn",
    type: "button",
    content: "Start Free Trial",
    href: "#",
    styles: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      fontSize: 18,
      padding: [16, 32, 16, 32],
      borderRadius: 8,
      margin: [0, 10, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-secondary-btn": {
    id: "hero-secondary-btn",
    type: "button",
    content: "Watch Demo",
    href: "#",
    styles: {
      backgroundColor: "transparent",
      color: "#cbd5e1",
      fontSize: 18,
      padding: [16, 32, 16, 32],
      borderRadius: 8,
      margin: [0, 0, 0, 10],
      xPosition: 0,
      yPosition: 0,
    },
  },
  stats: {
    id: "stats",
    type: "container",
    styles: {
      backgroundColor: "#f1f5f9",
      padding: [60, 40, 60, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["stats-title", "stats-subtitle"],
  },
  "stats-title": {
    id: "stats-title",
    type: "text",
    content: "Trusted by Industry Leaders",
    styles: {
      fontSize: 32,
      fontWeight: 600,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "stats-subtitle": {
    id: "stats-subtitle",
    type: "text",
    content: "Join 10,000+ companies that have increased their productivity by 300% using our platform.",
    styles: {
      fontSize: 18,
      color: "#6b7280",
      textAlign: "center",
      xPosition: 0,
      yPosition: 0,
    },
  },
  features: {
    id: "features",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["features-title", "features-subtitle", "features-image"],
  },
  "features-title": {
    id: "features-title",
    type: "text",
    content: "Everything You Need to Scale",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "features-subtitle": {
    id: "features-subtitle",
    type: "text",
    content: "Powerful features designed to help your team collaborate better and ship faster.",
    styles: {
      fontSize: 20,
      color: "#6b7280",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "features-image": {
    id: "features-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=400&width=600",
    styles: {
      width: 600,
      height: 400,
      borderRadius: 12,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  testimonial: {
    id: "testimonial",
    type: "container",
    styles: {
      backgroundColor: "#f8fafc",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["testimonial-quote", "testimonial-author"],
  },
  "testimonial-quote": {
    id: "testimonial-quote",
    type: "text",
    content: '"This platform has completely transformed how we work. Our team is more productive than ever before."',
    styles: {
      fontSize: 28,
      fontWeight: 500,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 24, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "testimonial-author": {
    id: "testimonial-author",
    type: "text",
    content: "Sarah Johnson, CEO at TechCorp",
    styles: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      xPosition: 0,
      yPosition: 0,
    },
  },
  pricing: {
    id: "pricing",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pricing-title", "pricing-subtitle", "pricing-button"],
  },
  "pricing-title": {
    id: "pricing-title",
    type: "text",
    content: "Simple, Transparent Pricing",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pricing-subtitle": {
    id: "pricing-subtitle",
    type: "text",
    content: "Start free, then pay as you grow. No hidden fees, no surprises.",
    styles: {
      fontSize: 20,
      color: "#6b7280",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pricing-button": {
    id: "pricing-button",
    type: "button",
    content: "View Pricing Plans",
    href: "#",
    styles: {
      backgroundColor: "#10b981",
      color: "#ffffff",
      fontSize: 18,
      padding: [16, 32, 16, 32],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
  cta: {
    id: "cta",
    type: "container",
    styles: {
      backgroundColor: "#3b82f6",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["cta-title", "cta-subtitle", "cta-button"],
  },
  "cta-title": {
    id: "cta-title",
    type: "text",
    content: "Ready to Get Started?",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "cta-subtitle": {
    id: "cta-subtitle",
    type: "text",
    content: "Join thousands of teams already using our platform to build better products.",
    styles: {
      fontSize: 20,
      color: "#dbeafe",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "cta-button": {
    id: "cta-button",
    type: "button",
    content: "Start Your Free Trial",
    href: "#",
    styles: {
      backgroundColor: "#ffffff",
      color: "#3b82f6",
      fontSize: 18,
      padding: [16, 40, 16, 40],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
}

// Template 3: Portfolio/Agency
const template3Elements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero", "about", "services", "portfolio", "contact"],
  },
  hero: {
    id: "hero",
    type: "container",
    styles: {
      backgroundColor: "#fafafa",
      padding: [120, 40, 120, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["hero-title", "hero-subtitle", "hero-button"],
  },
  "hero-title": {
    id: "hero-title",
    type: "text",
    content: "Creative Digital Agency",
    styles: {
      fontSize: 52,
      fontWeight: 300,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-subtitle": {
    id: "hero-subtitle",
    type: "text",
    content: "We craft beautiful digital experiences that inspire and engage your audience.",
    styles: {
      fontSize: 24,
      fontWeight: 300,
      color: "#4b5563",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "hero-button": {
    id: "hero-button",
    type: "button",
    content: "View Our Work",
    href: "#",
    styles: {
      backgroundColor: "#1f2937",
      color: "#ffffff",
      fontSize: 16,
      padding: [16, 40, 16, 40],
      borderRadius: 0,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  about: {
    id: "about",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [100, 40, 100, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["about-title", "about-text", "about-image"],
  },
  "about-title": {
    id: "about-title",
    type: "text",
    content: "About Our Studio",
    styles: {
      fontSize: 38,
      fontWeight: 400,
      color: "#1f2937",
      margin: [0, 0, 30, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "about-text": {
    id: "about-text",
    type: "text",
    content:
      "We are a team of passionate designers and developers who believe in the power of great design. Our mission is to help brands tell their story through compelling digital experiences.",
    styles: {
      fontSize: 18,
      fontWeight: 300,
      color: "#6b7280",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "about-image": {
    id: "about-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=350&width=550",
    styles: {
      width: 550,
      height: 350,
      borderRadius: 0,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  services: {
    id: "services",
    type: "container",
    styles: {
      backgroundColor: "#f9fafb",
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["services-title", "services-subtitle"],
  },
  "services-title": {
    id: "services-title",
    type: "text",
    content: "Our Services",
    styles: {
      fontSize: 38,
      fontWeight: 400,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "services-subtitle": {
    id: "services-subtitle",
    type: "text",
    content: "Brand Identity • Web Design • Digital Marketing • UI/UX Design",
    styles: {
      fontSize: 20,
      fontWeight: 300,
      color: "#6b7280",
      textAlign: "center",
      xPosition: 0,
      yPosition: 0,
    },
  },
  portfolio: {
    id: "portfolio",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-title", "portfolio-subtitle", "portfolio-image"],
  },
  "portfolio-title": {
    id: "portfolio-title",
    type: "text",
    content: "Featured Work",
    styles: {
      fontSize: 38,
      fontWeight: 400,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-subtitle": {
    id: "portfolio-subtitle",
    type: "text",
    content: "A selection of our recent projects that showcase our creative approach.",
    styles: {
      fontSize: 18,
      fontWeight: 300,
      color: "#6b7280",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-image": {
    id: "portfolio-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=400&width=700",
    styles: {
      width: 700,
      height: 400,
      borderRadius: 0,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  contact: {
    id: "contact",
    type: "container",
    styles: {
      backgroundColor: "#1f2937",
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["contact-title", "contact-subtitle", "contact-button"],
  },
  "contact-title": {
    id: "contact-title",
    type: "text",
    content: "Let's Work Together",
    styles: {
      fontSize: 42,
      fontWeight: 400,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "contact-subtitle": {
    id: "contact-subtitle",
    type: "text",
    content: "Have a project in mind? We'd love to hear about it.",
    styles: {
      fontSize: 20,
      fontWeight: 300,
      color: "#d1d5db",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "contact-button": {
    id: "contact-button",
    type: "button",
    content: "Get In Touch",
    href: "#",
    styles: {
      backgroundColor: "transparent",
      color: "#ffffff",
      fontSize: 16,
      padding: [16, 40, 16, 40],
      borderRadius: 0,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
}

// New Template: Product Page
const productTemplateElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
    children: [
      "product-hero",
      "product-features",
      "product-testimonial",
      "product-pricing",
      "product-faq",
      "product-cta",
    ],
  },
  "product-hero": {
    id: "product-hero",
    type: "container",
    styles: {
      backgroundColor: "#f0f9ff",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-hero-title", "product-hero-subtitle", "product-hero-image", "product-hero-button"],
  },
  "product-hero-title": {
    id: "product-hero-title",
    type: "text",
    content: "Introducing Our Amazing Product",
    styles: {
      fontSize: 52,
      fontWeight: 700,
      color: "#0f172a",
      textAlign: "center",
      margin: [0, 0, 16, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-hero-subtitle": {
    id: "product-hero-subtitle",
    type: "text",
    content: "Solve your biggest problems with our innovative solution. Simple, powerful, and effective.",
    styles: { fontSize: 22, color: "#475569", textAlign: "center", margin: [0, 0, 40, 0], xPosition: 0, yPosition: 0 },
  },
  "product-hero-image": {
    id: "product-hero-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=350&width=600",
    styles: { width: 600, height: 350, borderRadius: 12, margin: [0, 0, 40, 0], xPosition: 0, yPosition: 0 },
  },
  "product-hero-button": {
    id: "product-hero-button",
    type: "button",
    content: "Buy Now",
    href: "#",
    styles: {
      backgroundColor: "#0ea5e9",
      color: "#ffffff",
      fontSize: 18,
      padding: [16, 32, 16, 32],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-features": {
    id: "product-features",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-features-title", "product-feature1-container", "product-feature2-container"],
  },
  "product-features-title": {
    id: "product-features-title",
    type: "text",
    content: "Key Features",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#0f172a",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-feature1-container": {
    id: "product-feature1-container",
    type: "container",
    styles: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      padding: [20, 20, 20, 20],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-feature1-icon", "product-feature1-content"],
  },
  "product-feature1-icon": {
    id: "product-feature1-icon",
    type: "text",
    content: "💡",
    styles: { fontSize: 48, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-feature1-content": {
    id: "product-feature1-content",
    type: "container",
    styles: { flexDirection: "column", gap: 5, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
    children: ["product-feature1-title", "product-feature1-description"],
  },
  "product-feature1-title": {
    id: "product-feature1-title",
    type: "text",
    content: "Intuitive Design",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-feature1-description": {
    id: "product-feature1-description",
    type: "text",
    content: "Enjoy a seamless user experience with our thoughtfully designed interface.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-feature2-container": {
    id: "product-feature2-container",
    type: "container",
    styles: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      padding: [20, 20, 20, 20],
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-feature2-icon", "product-feature2-content"],
  },
  "product-feature2-icon": {
    id: "product-feature2-icon",
    type: "text",
    content: "⚡",
    styles: { fontSize: 48, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-feature2-content": {
    id: "product-feature2-content",
    type: "container",
    styles: { flexDirection: "column", gap: 5, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
    children: ["product-feature2-title", "product-feature2-description"],
  },
  "product-feature2-title": {
    id: "product-feature2-title",
    type: "text",
    content: "Blazing Fast Performance",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-feature2-description": {
    id: "product-feature2-description",
    type: "text",
    content: "Experience lightning-fast speeds and responsiveness for all your tasks.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-testimonial": {
    id: "product-testimonial",
    type: "container",
    styles: {
      backgroundColor: "#f8fafc",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-testimonial-quote", "product-testimonial-author"],
  },
  "product-testimonial-quote": {
    id: "product-testimonial-quote",
    type: "text",
    content: '"This product changed my life! I highly recommend it to everyone."',
    styles: {
      fontSize: 28,
      fontWeight: 500,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 24, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-testimonial-author": {
    id: "product-testimonial-author",
    type: "text",
    content: "Jane Doe, Satisfied Customer",
    styles: { fontSize: 16, color: "#6b7280", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-pricing": {
    id: "product-pricing",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-pricing-title", "product-pricing-card1"],
  },
  "product-pricing-title": {
    id: "product-pricing-title",
    type: "text",
    content: "Affordable Pricing",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#0f172a",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-pricing-card1": {
    id: "product-pricing-card1",
    type: "container",
    styles: {
      backgroundColor: "#f1f5f9",
      padding: [30, 30, 30, 30],
      borderRadius: 12,
      minHeight: 250,
      alignItems: "center",
      gap: 15,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: [
      "product-pricing-card1-title",
      "product-pricing-card1-price",
      "product-pricing-card1-features",
      "product-pricing-card1-button",
    ],
  },
  "product-pricing-card1-title": {
    id: "product-pricing-card1-title",
    type: "text",
    content: "Basic Plan",
    styles: { fontSize: 28, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "product-pricing-card1-price": {
    id: "product-pricing-card1-price",
    type: "text",
    content: "$9/month",
    styles: { fontSize: 36, fontWeight: 700, color: "#0ea5e9", margin: [0, 0, 10, 0], xPosition: 0, yPosition: 0 },
  },
  "product-pricing-card1-features": {
    id: "product-pricing-card1-features",
    type: "text",
    content: "• 10 Users\n• 5GB Storage\n• Basic Support",
    styles: { fontSize: 16, color: "#6b7280", textAlign: "center", margin: [0, 0, 20, 0], xPosition: 0, yPosition: 0 },
  },
  "product-pricing-card1-button": {
    id: "product-pricing-card1-button",
    type: "button",
    content: "Choose Plan",
    href: "#",
    styles: {
      backgroundColor: "#0ea5e9",
      color: "#ffffff",
      fontSize: 16,
      padding: [12, 24, 12, 24],
      borderRadius: 6,
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-faq": {
    id: "product-faq",
    type: "container",
    styles: {
      backgroundColor: "#f0f9ff",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-faq-title", "product-faq-q1", "product-faq-a1"],
  },
  "product-faq-title": {
    id: "product-faq-title",
    type: "text",
    content: "Frequently Asked Questions",
    styles: {
      fontSize: 36,
      fontWeight: 600,
      color: "#0f172a",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-faq-q1": {
    id: "product-faq-q1",
    type: "text",
    content: "Q: How do I get started?",
    styles: { fontSize: 20, fontWeight: 600, color: "#1f2937", margin: [0, 0, 10, 0], xPosition: 0, yPosition: 0 },
  },
  "product-faq-a1": {
    id: "product-faq-a1",
    type: "text",
    content: "A: Simply sign up for a free trial and follow the onboarding steps.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 20, 0], xPosition: 0, yPosition: 0 },
  },
  "product-cta": {
    id: "product-cta",
    type: "container",
    styles: {
      backgroundColor: "#0ea5e9",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["product-cta-title", "product-cta-button"],
  },
  "product-cta-title": {
    id: "product-cta-title",
    type: "text",
    content: "Ready to Experience the Difference?",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "product-cta-button": {
    id: "product-cta-button",
    type: "button",
    content: "Get Your Product Now",
    href: "#",
    styles: {
      backgroundColor: "#ffffff",
      color: "#0ea5e9",
      fontSize: 18,
      padding: [16, 40, 16, 40],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
}

// New Template: Simple Landing Page
const simpleLandingPageElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
    children: ["lp-hero", "lp-benefits", "lp-social-proof", "lp-final-cta"],
  },
  "lp-hero": {
    id: "lp-hero",
    type: "container",
    styles: {
      backgroundColor: "#e0f2fe",
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["lp-hero-title", "lp-hero-subtitle", "lp-hero-cta-button"],
  },
  "lp-hero-title": {
    id: "lp-hero-title",
    type: "text",
    content: "Unlock Your Potential Today",
    styles: {
      fontSize: 56,
      fontWeight: 800,
      color: "#0f172a",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "lp-hero-subtitle": {
    id: "lp-hero-subtitle",
    type: "text",
    content: "Sign up for our exclusive offer and transform your business.",
    styles: { fontSize: 24, color: "#475569", textAlign: "center", margin: [0, 0, 40, 0], xPosition: 0, yPosition: 0 },
  },
  "lp-hero-cta-button": {
    id: "lp-hero-cta-button",
    type: "button",
    content: "Claim Your Free Access",
    href: "#",
    styles: {
      backgroundColor: "#0ea5e9",
      color: "#ffffff",
      fontSize: 20,
      padding: [18, 36, 18, 36],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
  "lp-benefits": {
    id: "lp-benefits",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["lp-benefits-title", "lp-benefit1", "lp-benefit2"],
  },
  "lp-benefits-title": {
    id: "lp-benefits-title",
    type: "text",
    content: "Why Choose Us?",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#0f172a",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "lp-benefit1": {
    id: "lp-benefit1",
    type: "text",
    content: "✅ Boost Productivity: Streamline your tasks and get more done in less time.",
    styles: { fontSize: 18, color: "#334155", margin: [0, 0, 15, 0], xPosition: 0, yPosition: 0 },
  },
  "lp-benefit2": {
    id: "lp-benefit2",
    type: "text",
    content: "✅ Save Money: Reduce operational costs with our efficient solutions.",
    styles: { fontSize: 18, color: "#334155", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "lp-social-proof": {
    id: "lp-social-proof",
    type: "container",
    styles: {
      backgroundColor: "#f8fafc",
      padding: [60, 40, 60, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["lp-social-proof-text", "lp-social-proof-image"],
  },
  "lp-social-proof-text": {
    id: "lp-social-proof-text",
    content: "Trusted by over 5,000 happy customers worldwide!",
    styles: {
      fontSize: 20,
      fontWeight: 500,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "lp-social-proof-image": {
    id: "lp-social-proof-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=80&width=400", // Placeholder for logos/ratings
    styles: { width: 400, height: 80, objectFit: "contain", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "lp-final-cta": {
    id: "lp-final-cta",
    type: "container",
    styles: {
      backgroundColor: "#0ea5e9",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["lp-final-cta-title", "lp-final-cta-button"],
  },
  "lp-final-cta-title": {
    id: "lp-final-cta-title",
    type: "text",
    content: "Don't Miss Out! Limited Time Offer.",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "lp-final-cta-button": {
    id: "lp-final-cta-button",
    type: "button",
    content: "Get Instant Access",
    href: "#",
    styles: {
      backgroundColor: "#ffffff",
      color: "#0ea5e9",
      fontSize: 20,
      padding: [18, 36, 18, 36],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
}

// New Template: Personal Portfolio
const personalPortfolioElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
    children: ["portfolio-hero", "portfolio-about", "portfolio-projects", "portfolio-skills", "portfolio-contact"],
  },
  "portfolio-hero": {
    id: "portfolio-hero",
    type: "container",
    styles: {
      backgroundColor: "#fdf2f8",
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-hero-image", "portfolio-hero-name", "portfolio-hero-tagline"],
  },
  "portfolio-hero-image": {
    id: "portfolio-hero-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=150&width=150",
    styles: {
      width: 150,
      height: 150,
      borderRadius: 9999,
      objectFit: "cover",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-hero-name": {
    id: "portfolio-hero-name",
    type: "text",
    content: "Hi, I'm Alex Johnson",
    styles: {
      fontSize: 48,
      fontWeight: 700,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 10, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-hero-tagline": {
    id: "portfolio-hero-tagline",
    type: "text",
    content: "A passionate Web Developer & Designer creating beautiful and functional digital experiences.",
    styles: { fontSize: 22, color: "#6b7280", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-about": {
    id: "portfolio-about",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-about-title", "portfolio-about-text"],
  },
  "portfolio-about-title": {
    id: "portfolio-about-title",
    type: "text",
    content: "About Me",
    styles: {
      fontSize: 36,
      fontWeight: 600,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 30, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-about-text": {
    id: "portfolio-about-text",
    type: "text",
    content:
      "I specialize in building responsive and user-friendly web applications using modern technologies. With a strong focus on clean code and intuitive design, I strive to deliver exceptional digital products that meet client needs and exceed expectations.",
    styles: { fontSize: 18, color: "#4b5563", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-projects": {
    id: "portfolio-projects",
    type: "container",
    styles: {
      backgroundColor: "#f8fafc",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-projects-title", "portfolio-project1-container", "portfolio-project2-container"],
  },
  "portfolio-projects-title": {
    id: "portfolio-projects-title",
    type: "text",
    content: "My Projects",
    styles: {
      fontSize: 36,
      fontWeight: 600,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 40, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-project1-container": {
    id: "portfolio-project1-container",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [20, 20, 20, 20],
      borderRadius: 8,
      minHeight: 250,
      gap: 15,
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-project1-image", "portfolio-project1-title", "portfolio-project1-description"],
  },
  "portfolio-project1-image": {
    id: "portfolio-project1-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=200&width=300",
    styles: {
      width: 300,
      height: 200,
      borderRadius: 8,
      objectFit: "cover",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-project1-title": {
    id: "portfolio-project1-title",
    type: "text",
    content: "Project Alpha",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-project1-description": {
    id: "portfolio-project1-description",
    type: "text",
    content: "A web application for managing tasks and projects efficiently.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-project2-container": {
    id: "portfolio-project2-container",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [20, 20, 20, 20],
      borderRadius: 8,
      minHeight: 250,
      gap: 15,
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-project2-image", "portfolio-project2-title", "portfolio-project2-description"],
  },
  "portfolio-project2-image": {
    id: "portfolio-project2-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=200&width=300",
    styles: {
      width: 300,
      height: 200,
      borderRadius: 8,
      objectFit: "cover",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-project2-title": {
    id: "portfolio-project2-title",
    type: "text",
    content: "Project Beta",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-project2-description": {
    id: "portfolio-project2-description",
    type: "text",
    content: "An e-commerce platform with a seamless checkout experience.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-skills": {
    id: "portfolio-skills",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-skills-title", "portfolio-skills-list"],
  },
  "portfolio-skills-title": {
    id: "portfolio-skills-title",
    type: "text",
    content: "Skills & Expertise",
    styles: {
      fontSize: 36,
      fontWeight: 600,
      color: "#1f2937",
      textAlign: "center",
      margin: [0, 0, 30, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-skills-list": {
    id: "portfolio-skills-list",
    type: "text",
    content: "React • Next.js • TypeScript • Tailwind CSS • Node.js • MongoDB • Git • UI/UX Design",
    styles: { fontSize: 18, color: "#4b5563", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-contact": {
    id: "portfolio-contact",
    type: "container",
    styles: {
      backgroundColor: "#1f2937",
      padding: [80, 40, 80, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["portfolio-contact-title", "portfolio-contact-email", "portfolio-contact-linkedin"],
  },
  "portfolio-contact-title": {
    id: "portfolio-contact-title",
    type: "text",
    content: "Get In Touch",
    styles: {
      fontSize: 42,
      fontWeight: 700,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 32, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "portfolio-contact-email": {
    id: "portfolio-contact-email",
    type: "text",
    content: "Email: alex.johnson@example.com",
    styles: { fontSize: 18, color: "#d1d5db", textAlign: "center", margin: [0, 0, 10, 0], xPosition: 0, yPosition: 0 },
  },
  "portfolio-contact-linkedin": {
    id: "portfolio-contact-linkedin",
    type: "text",
    content: "LinkedIn: /in/alexjohnson",
    styles: { fontSize: 18, color: "#d1d5db", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
}

// New Template: Professional Landing Page
const professionalLandingPageElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
    children: ["pro-hero", "pro-features", "pro-testimonials", "pro-cta"],
  },
  "pro-hero": {
    id: "pro-hero",
    type: "container",
    styles: {
      backgroundColor: "#f0f4f8", // Light blue-gray
      padding: [120, 40, 120, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-hero-title", "pro-hero-subtitle", "pro-hero-button"],
  },
  "pro-hero-title": {
    id: "pro-hero-title",
    type: "text",
    content: "Elevate Your Online Presence",
    styles: {
      fontSize: 60,
      fontWeight: 800,
      color: "#1a202c", // Dark gray
      textAlign: "center",
      margin: [0, 0, 24, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pro-hero-subtitle": {
    id: "pro-hero-subtitle",
    type: "text",
    content: "Craft stunning, high-converting landing pages with ease. No coding required.",
    styles: { fontSize: 24, color: "#4a5568", textAlign: "center", margin: [0, 0, 48, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-hero-button": {
    id: "pro-hero-button",
    type: "button",
    content: "Start Building Now",
    href: "#",
    styles: {
      backgroundColor: "#38b2ac", // Teal
      color: "#ffffff",
      fontSize: 20,
      padding: [18, 40, 18, 40],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pro-features": {
    id: "pro-features",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [100, 40, 100, 40],
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-features-title", "pro-feature1", "pro-feature2", "pro-feature3"],
  },
  "pro-features-title": {
    id: "pro-features-title",
    type: "text",
    content: "Powerful Features at Your Fingertips",
    styles: {
      fontSize: 48,
      fontWeight: 700,
      color: "#1a202c",
      textAlign: "center",
      margin: [0, 0, 60, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pro-feature1": {
    id: "pro-feature1",
    type: "container",
    styles: {
      flexDirection: "column",
      alignItems: "center",
      gap: 15,
      padding: [20, 20, 20, 20],
      margin: [0, 0, 30, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-feature1-icon", "pro-feature1-title", "pro-feature1-description"],
  },
  "pro-feature1-icon": {
    id: "pro-feature1-icon",
    type: "text",
    content: "✨",
    styles: { fontSize: 48, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature1-title": {
    id: "pro-feature1-title",
    type: "text",
    content: "Intuitive Drag & Drop",
    styles: { fontSize: 28, fontWeight: 600, color: "#2d3748", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature1-description": {
    id: "pro-feature1-description",
    type: "text",
    content: "Easily arrange elements and sections to create your perfect layout.",
    styles: { fontSize: 18, color: "#4a5568", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature2": {
    id: "pro-feature2",
    type: "container",
    styles: {
      flexDirection: "column",
      alignItems: "center",
      gap: 15,
      padding: [20, 20, 20, 20],
      margin: [0, 0, 30, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-feature2-icon", "pro-feature2-title", "pro-feature2-description"],
  },
  "pro-feature2-icon": {
    id: "pro-feature2-icon",
    type: "text",
    content: "🚀",
    styles: { fontSize: 48, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature2-title": {
    id: "pro-feature2-title",
    type: "text",
    content: "Blazing Fast Performance",
    styles: { fontSize: 28, fontWeight: 600, color: "#2d3748", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature2-description": {
    id: "pro-feature2-description",
    type: "text",
    content: "Your pages load instantly, ensuring a smooth experience for your visitors.",
    styles: { fontSize: 18, color: "#4a5568", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature3": {
    id: "pro-feature3",
    type: "container",
    styles: {
      flexDirection: "column",
      alignItems: "center",
      gap: 15,
      padding: [20, 20, 20, 20],
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-feature3-icon", "pro-feature3-title", "pro-feature3-description"],
  },
  "pro-feature3-icon": {
    id: "pro-feature3-icon",
    type: "text",
    content: "📈",
    styles: { fontSize: 48, margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature3-title": {
    id: "pro-feature3-title",
    type: "text",
    content: "Conversion Optimized",
    styles: { fontSize: 28, fontWeight: 600, color: "#2d3748", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-feature3-description": {
    id: "pro-feature3-description",
    type: "text",
    content: "Designed to help you turn visitors into loyal customers.",
    styles: { fontSize: 18, color: "#4a5568", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-testimonials": {
    id: "pro-testimonials",
    type: "container",
    styles: {
      backgroundColor: "#f7fafc", // Lighter gray
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 20, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-testimonials-title", "pro-testimonial-quote", "pro-testimonial-author"],
  },
  "pro-testimonials-title": {
    id: "pro-testimonials-title",
    type: "text",
    content: "What Our Users Say",
    styles: {
      fontSize: 48,
      fontWeight: 700,
      color: "#1a202c",
      textAlign: "center",
      margin: [0, 0, 60, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pro-testimonial-quote": {
    id: "pro-testimonial-quote",
    type: "text",
    content:
      '"This platform has revolutionized our marketing efforts. The ease of use and powerful features are unmatched!"',
    styles: {
      fontSize: 28,
      fontWeight: 500,
      color: "#2d3748",
      textAlign: "center",
      margin: [0, 0, 24, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pro-testimonial-author": {
    id: "pro-testimonial-author",
    type: "text",
    content: "— Jane Doe, Marketing Director at InnovateCo",
    styles: { fontSize: 18, color: "#4a5568", textAlign: "center", margin: [0, 0, 0, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-cta": {
    id: "pro-cta",
    type: "container",
    styles: {
      backgroundColor: "#38b2ac", // Teal
      padding: [100, 40, 100, 40],
      textAlign: "center",
      margin: [0, 0, 0, 0],
      xPosition: 0,
      yPosition: 0,
    },
    children: ["pro-cta-title", "pro-cta-subtitle", "pro-cta-button"],
  },
  "pro-cta-title": {
    id: "pro-cta-title",
    type: "text",
    content: "Ready to Build Your Dream Page?",
    styles: {
      fontSize: 48,
      fontWeight: 700,
      color: "#ffffff",
      textAlign: "center",
      margin: [0, 0, 24, 0],
      xPosition: 0,
      yPosition: 0,
    },
  },
  "pro-cta-subtitle": {
    id: "pro-cta-subtitle",
    type: "text",
    content: "Join thousands of satisfied users and start creating beautiful pages today.",
    styles: { fontSize: 22, color: "#e6fffa", textAlign: "center", margin: [0, 0, 48, 0], xPosition: 0, yPosition: 0 },
  },
  "pro-cta-button": {
    id: "pro-cta-button",
    type: "button",
    content: "Get Started Free",
    href: "#",
    styles: {
      backgroundColor: "#ffffff",
      color: "#38b2ac",
      fontSize: 20,
      padding: [18, 40, 18, 40],
      borderRadius: 8,
      xPosition: 0,
      yPosition: 0,
    },
  },
}

// Template selector function
const getTemplateElements = (templateId: string): Record<string, ElementData> => {
  switch (templateId) {
    case "template1":
      return template1Elements
    case "template2":
      return template2Elements
    case "template3":
      return template3Elements
    case "product-template":
      return productTemplateElements
    case "simple-landing-page":
      return simpleLandingPageElements
    case "personal-portfolio":
      return personalPortfolioElements
    case "professional-landing-page": // Add the new template here
      return professionalLandingPageElements
    default:
      return template1Elements
  }
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      currentProjectId: null,
      currentUserId: null,
      elements: {},
      selectedElementId: null,
      showElementsPanel: false,
      showSectionsPanel: false,
      draggedElement: null,
      insertionTargetId: null,
      initialLoadComplete: false,

      setCurrentProject: (projectId, userId) => {
        set({ currentProjectId: projectId, currentUserId: userId })
      },

      setElements: (elements) => {
        set({ elements })
      },

      addElement: (element, explicitTargetId) => {
        set((state) => {
          const newElements = { ...state.elements }

          if (!element.id) {
            element.id = generateId()
          }

          newElements[element.id] = { ...element }

          let actualParentId = "root"
          let insertIndex = -1

          const targetId = explicitTargetId || state.insertionTargetId || state.selectedElementId
          const targetElement = targetId ? newElements[targetId] : null

          if (state.insertionTargetId) {
            const parentOfInsertionTarget = Object.keys(newElements).find((key) =>
              newElements[key].children?.includes(state.insertionTargetId!),
            )
            if (parentOfInsertionTarget) {
              actualParentId = parentOfInsertionTarget
              const parentChildren = newElements[actualParentId].children || []
              insertIndex = parentChildren.indexOf(state.insertionTargetId!) + 1
            } else {
              actualParentId = "root"
            }
          } else if (state.selectedElementId) {
            if (targetElement && targetElement.type === "container") {
              actualParentId = state.selectedElementId
            } else {
              const parentOfSelected = Object.keys(newElements).find((key) =>
                newElements[key].children?.includes(state.selectedElementId!),
              )
              if (parentOfSelected) {
                actualParentId = parentOfSelected
                const parentChildren = newElements[actualParentId].children || []
                insertIndex = parentChildren.indexOf(state.selectedElementId!) + 1
              } else {
                actualParentId = "root"
              }
            }
          } else {
            actualParentId = "root"
          }

          const parentToModify = newElements[actualParentId]
          if (parentToModify) {
            const currentChildren = parentToModify.children ? [...parentToModify.children] : []
            if (insertIndex !== -1 && insertIndex <= currentChildren.length) {
              currentChildren.splice(insertIndex, 0, element.id)
            } else {
              currentChildren.push(element.id)
            }
            newElements[actualParentId] = {
              ...parentToModify,
              children: currentChildren,
            }
          } else {
            console.error("Attempted to add element to non-existent parent:", actualParentId)
          }

          return {
            elements: newElements,
            selectedElementId: element.id,
            insertionTargetId: null,
          }
        })
      },

      updateElement: (id, updates) => {
        set((state) => ({
          elements: {
            ...state.elements,
            [id]: {
              ...state.elements[id],
              ...updates,
              styles: {
                ...state.elements[id].styles,
                ...(updates.styles || {}),
              },
            },
          },
        }))
      },

      deleteElement: (id) => {
        set((state) => {
          const newElements = { ...state.elements }
          delete newElements[id]

          Object.keys(newElements).forEach((parentId) => {
            if (newElements[parentId].children) {
              newElements[parentId] = {
                ...newElements[parentId],
                children: newElements[parentId].children!.filter((childId) => childId !== id),
              }
            }
          })

          return {
            elements: newElements,
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
          }
        })
      },

      setSelectedElement: (id) => {
        set({ selectedElementId: id })
      },

      toggleElementsPanel: () => {
        set((state) => ({
          showElementsPanel: !state.showElementsPanel,
          showSectionsPanel: false,
          insertionTargetId: null,
        }))
      },

      toggleSectionsPanel: () => {
        set((state) => ({
          showSectionsPanel: !state.showSectionsPanel,
          showElementsPanel: false,
        }))
      },

      setDraggedElement: (element) => {
        set({ draggedElement: element })
      },

      setInsertionTarget: (id) => {
        set({ insertionTargetId: id })
      },

      setInitialLoadComplete: (status) => {
        set({ initialLoadComplete: status })
      },

      hasUnsavedChanges: () => {
        // This becomes more complex with DB persistence. For now, we'll
        // consider a change whenever an element is updated or added/deleted.
        // A more robust solution would involve comparing current state with
        // a 'last saved' state or tracking a dirty flag.
        return true // Simplistic: always assume changes are possible
      },

      createNewProject: async (title, initialElements, userId) => {
        const supabase = createClientComponentClient()
        const slug =
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") +
          "-" +
          nanoid(6)

        const { data, error } = await supabase
          .from("pages")
          .insert({
            user_id: userId,
            title: title,
            slug: slug,
            elements: initialElements,
            is_published: false, // Default to not published
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating new project:", error)
          return null
        }

        if (data) {
          set({
            currentProjectId: data.id,
            currentUserId: userId,
            elements: data.elements,
            selectedElementId: null,
            initialLoadComplete: true,
          })
          return data as ProjectData
        }
        return null
      },

      saveProject: async () => {
        const state = get()
        if (!state.currentProjectId || !state.currentUserId) {
          console.error("Cannot save project: No current project or user ID.")
          return
        }

        const supabase = createClientComponentClient()

        const { data, error } = await supabase
          .from("pages")
          .update({
            elements: state.elements,
            updated_at: new Date().toISOString(),
          })
          .eq("id", state.currentProjectId)
          .eq("user_id", state.currentUserId) // Ensure user owns the project

        if (error) {
          console.error("Error saving project:", error)
        } else {
          console.log("Project saved successfully.")
        }
      },

      loadProject: async (projectId) => {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase.from("pages").select("*").eq("id", projectId).single()

        if (error || !data) {
          console.error("Error loading project or project not found:", error)
          set({ initialLoadComplete: true }) // Mark load as complete even if failed
          return false
        }

        set({
          currentProjectId: data.id,
          currentUserId: data.user_id,
          elements: data.elements,
          selectedElementId: null,
          initialLoadComplete: true,
        })
        return true
      },

      resetToOriginal: async () => {
        const state = get()
        if (!state.currentProjectId) return

        // Fetch the original template elements based on the initial project's template type if available,
        // or a default empty state if not. For now, we don't store the "template type" in DB,
        // so we'll just revert to a basic template or load a fresh one if possible.
        // A more complex solution would save the initial template ID with the project.
        // For simplicity, let's reset to a generic default or an empty canvas.
        // Let's assume we want to reset to the first template's elements.
        const defaultTemplateId = "template1"
        const originalElements = getTemplateElements(defaultTemplateId)

        const supabase = createClientComponentClient()
        const { error } = await supabase
          .from("pages")
          .update({
            elements: originalElements,
            updated_at: new Date().toISOString(),
            // You might also want to reset is_published here if it was changed
          })
          .eq("id", state.currentProjectId)
          .eq("user_id", state.currentUserId)

        if (error) {
          console.error("Error resetting project:", error)
        } else {
          set({
            elements: originalElements,
            selectedElementId: null,
          })
          console.log("Project reset to original state.")
        }
      },

      publishProject: async (projectId, isPublished) => {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("pages")
          .update({ is_published: isPublished, updated_at: new Date().toISOString() })
          .eq("id", projectId)
          .select()
          .single()

        if (error) {
          console.error("Error updating publish status:", error)
        } else if (data) {
          set((state) => ({
            elements: {
              ...state.elements,
              // Update root element or a specific indicator if needed in the UI
            },
          }))
          console.log("Publish status updated:", data)
        }
      },
    }),
    {
      name: "litebuilder-editor",
      // Exclude functions and non-serializable parts
      partialize: (state) => ({
        currentProjectId: state.currentProjectId,
        elements: state.elements,
        selectedElementId: state.selectedElementId,
        showElementsPanel: state.showElementsPanel,
        showSectionsPanel: state.showSectionsPanel,
        draggedElement: state.draggedElement,
        insertionTargetId: state.insertionTargetId,
        currentUserId: state.currentUserId,
        initialLoadComplete: state.initialLoadComplete,
      }),
      // Migrate to prevent data issues when changing schema
      version: 1, // Increment version if schema changes to invalidate old local storage
      onRehydrateStorage: (state) => {
        console.log("rehydrating storage", state)
        // You can add logic here to handle migrations if needed
      },
    },
  ),
)
