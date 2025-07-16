import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  }
  href?: string
  children?: string[]
}

export interface ProjectData {
  templateId: string
  elements: Record<string, ElementData>
  lastModified: number
}

interface EditorStore {
  currentTemplateId: string | null
  elements: Record<string, ElementData>
  selectedElementId: string | null
  showElementsPanel: boolean
  showSectionsPanel: boolean
  draggedElement: ElementData | null
  insertionTargetId: string | null // New state for precise insertion

  // Actions
  setCurrentTemplate: (templateId: string) => void
  setElements: (elements: Record<string, ElementData>) => void
  addElement: (element: ElementData, explicitTargetId?: string) => void
  updateElement: (id: string, updates: Partial<ElementData>) => void
  deleteElement: (id: string) => void
  setSelectedElement: (id: string | null) => void
  toggleElementsPanel: () => void
  toggleSectionsPanel: () => void
  setDraggedElement: (element: ElementData | null) => void
  setInsertionTarget: (id: string | null) => void // New action

  // Save/Load/Reset
  saveProject: () => void
  loadProject: (templateId: string) => boolean
  resetToOriginal: () => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

// Template 1: Modern Landing Page
const template1Elements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
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
    },
  },
  features: {
    id: "features",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [80, 40, 80, 40],
      margin: [0, 0, 20, 0], // Added margin for spacing between sections
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
    },
  },
  "features-text": {
    id: "features-text",
    type: "text",
    content:
      "Our platform provides everything you need to create professional landing pages that convert visitors into customers.",
    styles: {
      fontSize: 16,
      color: "#6b7280",
      margin: [0, 0, 24, 0],
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
      padding: [16, 40, 16, 40],
      borderRadius: 8,
      margin: [0, 0, 0, 0], // Added margin
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
    },
  },
  about: {
    id: "about",
    type: "container",
    styles: {
      backgroundColor: "#ffffff",
      padding: [100, 40, 100, 40],
      margin: [0, 0, 20, 0],
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
    },
  },
}

// New Template: Product Page
const productTemplateElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0] },
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
    styles: { backgroundColor: "#f0f9ff", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["product-hero-title", "product-hero-subtitle", "product-hero-image", "product-hero-button"],
  },
  "product-hero-title": {
    id: "product-hero-title",
    type: "text",
    content: "Introducing Our Amazing Product",
    styles: { fontSize: 52, fontWeight: 700, color: "#0f172a", textAlign: "center", margin: [0, 0, 16, 0] },
  },
  "product-hero-subtitle": {
    id: "product-hero-subtitle",
    type: "text",
    content: "Solve your biggest problems with our innovative solution. Simple, powerful, and effective.",
    styles: { fontSize: 22, color: "#475569", textAlign: "center", margin: [0, 0, 40, 0] },
  },
  "product-hero-image": {
    id: "product-hero-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=350&width=600",
    styles: { width: 600, height: 350, borderRadius: 12, margin: [0, 0, 40, 0] },
  },
  "product-hero-button": {
    id: "product-hero-button",
    type: "button",
    content: "Buy Now",
    href: "#",
    styles: { backgroundColor: "#0ea5e9", color: "#ffffff", fontSize: 18, padding: [16, 32, 16, 32], borderRadius: 8 },
  },
  "product-features": {
    id: "product-features",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [80, 40, 80, 40], margin: [0, 0, 20, 0] },
    children: ["product-features-title", "product-feature1-container", "product-feature2-container"],
  },
  "product-features-title": {
    id: "product-features-title",
    type: "text",
    content: "Key Features",
    styles: { fontSize: 42, fontWeight: 700, color: "#0f172a", textAlign: "center", margin: [0, 0, 40, 0] },
  },
  "product-feature1-container": {
    id: "product-feature1-container",
    type: "container",
    styles: { flexDirection: "row", alignItems: "center", gap: 20, padding: [20, 20, 20, 20], margin: [0, 0, 20, 0] },
    children: ["product-feature1-icon", "product-feature1-content"],
  },
  "product-feature1-icon": {
    id: "product-feature1-icon",
    type: "text",
    content: "💡",
    styles: { fontSize: 48, margin: [0, 0, 0, 0] },
  },
  "product-feature1-content": {
    id: "product-feature1-content",
    type: "container",
    styles: { flexDirection: "column", gap: 5, margin: [0, 0, 0, 0] },
    children: ["product-feature1-title", "product-feature1-description"],
  },
  "product-feature1-title": {
    id: "product-feature1-title",
    type: "text",
    content: "Intuitive Design",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0] },
  },
  "product-feature1-description": {
    id: "product-feature1-description",
    type: "text",
    content: "Enjoy a seamless user experience with our thoughtfully designed interface.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0] },
  },
  "product-feature2-container": {
    id: "product-feature2-container",
    type: "container",
    styles: { flexDirection: "row", alignItems: "center", gap: 20, padding: [20, 20, 20, 20], margin: [0, 0, 0, 0] },
    children: ["product-feature2-icon", "product-feature2-content"],
  },
  "product-feature2-icon": {
    id: "product-feature2-icon",
    type: "text",
    content: "⚡",
    styles: { fontSize: 48, margin: [0, 0, 0, 0] },
  },
  "product-feature2-content": {
    id: "product-feature2-content",
    type: "container",
    styles: { flexDirection: "column", gap: 5, margin: [0, 0, 0, 0] },
    children: ["product-feature2-title", "product-feature2-description"],
  },
  "product-feature2-title": {
    id: "product-feature2-title",
    type: "text",
    content: "Blazing Fast Performance",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0] },
  },
  "product-feature2-description": {
    id: "product-feature2-description",
    type: "text",
    content: "Experience lightning-fast speeds and responsiveness for all your tasks.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0] },
  },
  "product-testimonial": {
    id: "product-testimonial",
    type: "container",
    styles: { backgroundColor: "#f8fafc", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["product-testimonial-quote", "product-testimonial-author"],
  },
  "product-testimonial-quote": {
    id: "product-testimonial-quote",
    type: "text",
    content: '"This product changed my life! I highly recommend it to everyone."',
    styles: { fontSize: 28, fontWeight: 500, color: "#1f2937", textAlign: "center", margin: [0, 0, 24, 0] },
  },
  "product-testimonial-author": {
    id: "product-testimonial-author",
    type: "text",
    content: "Jane Doe, Satisfied Customer",
    styles: { fontSize: 16, color: "#6b7280", textAlign: "center", margin: [0, 0, 0, 0] },
  },
  "product-pricing": {
    id: "product-pricing",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["product-pricing-title", "product-pricing-card1"],
  },
  "product-pricing-title": {
    id: "product-pricing-title",
    type: "text",
    content: "Affordable Pricing",
    styles: { fontSize: 42, fontWeight: 700, color: "#0f172a", textAlign: "center", margin: [0, 0, 40, 0] },
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
    styles: { fontSize: 28, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0] },
  },
  "product-pricing-card1-price": {
    id: "product-pricing-card1-price",
    type: "text",
    content: "$9/month",
    styles: { fontSize: 36, fontWeight: 700, color: "#0ea5e9", margin: [0, 0, 10, 0] },
  },
  "product-pricing-card1-features": {
    id: "product-pricing-card1-features",
    type: "text",
    content: "• 10 Users\n• 5GB Storage\n• Basic Support",
    styles: { fontSize: 16, color: "#6b7280", textAlign: "center", margin: [0, 0, 20, 0] },
  },
  "product-pricing-card1-button": {
    id: "product-pricing-card1-button",
    type: "button",
    content: "Choose Plan",
    href: "#",
    styles: { backgroundColor: "#0ea5e9", color: "#ffffff", fontSize: 16, padding: [12, 24, 12, 24], borderRadius: 6 },
  },
  "product-faq": {
    id: "product-faq",
    type: "container",
    styles: { backgroundColor: "#f0f9ff", padding: [80, 40, 80, 40], margin: [0, 0, 20, 0] },
    children: ["product-faq-title", "product-faq-q1", "product-faq-a1"],
  },
  "product-faq-title": {
    id: "product-faq-title",
    type: "text",
    content: "Frequently Asked Questions",
    styles: { fontSize: 36, fontWeight: 600, color: "#0f172a", textAlign: "center", margin: [0, 0, 40, 0] },
  },
  "product-faq-q1": {
    id: "product-faq-q1",
    type: "text",
    content: "Q: How do I get started?",
    styles: { fontSize: 20, fontWeight: 600, color: "#1f2937", margin: [0, 0, 10, 0] },
  },
  "product-faq-a1": {
    id: "product-faq-a1",
    type: "text",
    content: "A: Simply sign up for a free trial and follow the onboarding steps.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 20, 0] },
  },
  "product-cta": {
    id: "product-cta",
    type: "container",
    styles: { backgroundColor: "#0ea5e9", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 0, 0] },
    children: ["product-cta-title", "product-cta-button"],
  },
  "product-cta-title": {
    id: "product-cta-title",
    type: "text",
    content: "Ready to Experience the Difference?",
    styles: { fontSize: 42, fontWeight: 700, color: "#ffffff", textAlign: "center", margin: [0, 0, 32, 0] },
  },
  "product-cta-button": {
    id: "product-cta-button",
    type: "button",
    content: "Get Your Product Now",
    href: "#",
    styles: { backgroundColor: "#ffffff", color: "#0ea5e9", fontSize: 18, padding: [16, 40, 16, 40], borderRadius: 8 },
  },
}

// New Template: Simple Landing Page
const simpleLandingPageElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0] },
    children: ["lp-hero", "lp-benefits", "lp-social-proof", "lp-final-cta"],
  },
  "lp-hero": {
    id: "lp-hero",
    type: "container",
    styles: { backgroundColor: "#e0f2fe", padding: [100, 40, 100, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["lp-hero-title", "lp-hero-subtitle", "lp-hero-cta-button"],
  },
  "lp-hero-title": {
    id: "lp-hero-title",
    type: "text",
    content: "Unlock Your Potential Today",
    styles: { fontSize: 56, fontWeight: 800, color: "#0f172a", textAlign: "center", margin: [0, 0, 20, 0] },
  },
  "lp-hero-subtitle": {
    id: "lp-hero-subtitle",
    type: "text",
    content: "Sign up for our exclusive offer and transform your business.",
    styles: { fontSize: 24, color: "#475569", textAlign: "center", margin: [0, 0, 40, 0] },
  },
  "lp-hero-cta-button": {
    id: "lp-hero-cta-button",
    type: "button",
    content: "Claim Your Free Access",
    href: "#",
    styles: { backgroundColor: "#0ea5e9", color: "#ffffff", fontSize: 20, padding: [18, 36, 18, 36], borderRadius: 8 },
  },
  "lp-benefits": {
    id: "lp-benefits",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [80, 40, 80, 40], margin: [0, 0, 20, 0] },
    children: ["lp-benefits-title", "lp-benefit1", "lp-benefit2"],
  },
  "lp-benefits-title": {
    id: "lp-benefits-title",
    type: "text",
    content: "Why Choose Us?",
    styles: { fontSize: 42, fontWeight: 700, color: "#0f172a", textAlign: "center", margin: [0, 0, 40, 0] },
  },
  "lp-benefit1": {
    id: "lp-benefit1",
    type: "text",
    content: "✅ Boost Productivity: Streamline your tasks and get more done in less time.",
    styles: { fontSize: 18, color: "#334155", margin: [0, 0, 15, 0] },
  },
  "lp-benefit2": {
    id: "lp-benefit2",
    type: "text",
    content: "✅ Save Money: Reduce operational costs with our efficient solutions.",
    styles: { fontSize: 18, color: "#334155", margin: [0, 0, 0, 0] },
  },
  "lp-social-proof": {
    id: "lp-social-proof",
    type: "container",
    styles: { backgroundColor: "#f8fafc", padding: [60, 40, 60, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["lp-social-proof-text", "lp-social-proof-image"],
  },
  "lp-social-proof-text": {
    id: "lp-social-proof-text",
    type: "text",
    content: "Trusted by over 5,000 happy customers worldwide!",
    styles: { fontSize: 20, fontWeight: 500, color: "#1f2937", textAlign: "center", margin: [0, 0, 20, 0] },
  },
  "lp-social-proof-image": {
    id: "lp-social-proof-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=80&width=400", // Placeholder for logos/ratings
    styles: { width: 400, height: 80, objectFit: "contain", margin: [0, 0, 0, 0] },
  },
  "lp-final-cta": {
    id: "lp-final-cta",
    type: "container",
    styles: { backgroundColor: "#0ea5e9", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 0, 0] },
    children: ["lp-final-cta-title", "lp-final-cta-button"],
  },
  "lp-final-cta-title": {
    id: "lp-final-cta-title",
    type: "text",
    content: "Don't Miss Out! Limited Time Offer.",
    styles: { fontSize: 42, fontWeight: 700, color: "#ffffff", textAlign: "center", margin: [0, 0, 32, 0] },
  },
  "lp-final-cta-button": {
    id: "lp-final-cta-button",
    type: "button",
    content: "Get Instant Access",
    href: "#",
    styles: { backgroundColor: "#ffffff", color: "#0ea5e9", fontSize: 20, padding: [18, 36, 18, 36], borderRadius: 8 },
  },
}

// New Template: Personal Portfolio
const personalPortfolioElements: Record<string, ElementData> = {
  root: {
    id: "root",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [0, 0, 0, 0], margin: [0, 0, 0, 0] },
    children: ["portfolio-hero", "portfolio-about", "portfolio-projects", "portfolio-skills", "portfolio-contact"],
  },
  "portfolio-hero": {
    id: "portfolio-hero",
    type: "container",
    styles: { backgroundColor: "#fdf2f8", padding: [100, 40, 100, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["portfolio-hero-image", "portfolio-hero-name", "portfolio-hero-tagline"],
  },
  "portfolio-hero-image": {
    id: "portfolio-hero-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=150&width=150",
    styles: { width: 150, height: 150, borderRadius: 9999, objectFit: "cover", margin: [0, 0, 20, 0] },
  },
  "portfolio-hero-name": {
    id: "portfolio-hero-name",
    type: "text",
    content: "Hi, I'm Alex Johnson",
    styles: { fontSize: 48, fontWeight: 700, color: "#1f2937", textAlign: "center", margin: [0, 0, 10, 0] },
  },
  "portfolio-hero-tagline": {
    id: "portfolio-hero-tagline",
    type: "text",
    content: "A passionate Web Developer & Designer creating beautiful and functional digital experiences.",
    styles: { fontSize: 22, color: "#6b7280", textAlign: "center", margin: [0, 0, 0, 0] },
  },
  "portfolio-about": {
    id: "portfolio-about",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [80, 40, 80, 40], margin: [0, 0, 20, 0] },
    children: ["portfolio-about-title", "portfolio-about-text"],
  },
  "portfolio-about-title": {
    id: "portfolio-about-title",
    type: "text",
    content: "About Me",
    styles: { fontSize: 36, fontWeight: 600, color: "#1f2937", textAlign: "center", margin: [0, 0, 30, 0] },
  },
  "portfolio-about-text": {
    id: "portfolio-about-text",
    type: "text",
    content:
      "I specialize in building responsive and user-friendly web applications using modern technologies. With a strong focus on clean code and intuitive design, I strive to deliver exceptional digital products that meet client needs and exceed expectations.",
    styles: { fontSize: 18, color: "#4b5563", textAlign: "center", margin: [0, 0, 0, 0] },
  },
  "portfolio-projects": {
    id: "portfolio-projects",
    type: "container",
    styles: { backgroundColor: "#f8fafc", padding: [80, 40, 80, 40], margin: [0, 0, 20, 0] },
    children: ["portfolio-projects-title", "portfolio-project1-container", "portfolio-project2-container"],
  },
  "portfolio-projects-title": {
    id: "portfolio-projects-title",
    type: "text",
    content: "My Projects",
    styles: { fontSize: 36, fontWeight: 600, color: "#1f2937", textAlign: "center", margin: [0, 0, 40, 0] },
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
    },
    children: ["portfolio-project1-image", "portfolio-project1-title", "portfolio-project1-description"],
  },
  "portfolio-project1-image": {
    id: "portfolio-project1-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=200&width=300",
    styles: { width: 300, height: 200, borderRadius: 8, objectFit: "cover", margin: [0, 0, 0, 0] },
  },
  "portfolio-project1-title": {
    id: "portfolio-project1-title",
    type: "text",
    content: "Project Alpha",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0] },
  },
  "portfolio-project1-description": {
    id: "portfolio-project1-description",
    type: "text",
    content: "A web application for managing tasks and projects efficiently.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0] },
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
    },
    children: ["portfolio-project2-image", "portfolio-project2-title", "portfolio-project2-description"],
  },
  "portfolio-project2-image": {
    id: "portfolio-project2-image",
    type: "image",
    imageUrl: "/placeholder.svg?height=200&width=300",
    styles: { width: 300, height: 200, borderRadius: 8, objectFit: "cover", margin: [0, 0, 0, 0] },
  },
  "portfolio-project2-title": {
    id: "portfolio-project2-title",
    type: "text",
    content: "Project Beta",
    styles: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: [0, 0, 0, 0] },
  },
  "portfolio-project2-description": {
    id: "portfolio-project2-description",
    type: "text",
    content: "An e-commerce platform with a seamless checkout experience.",
    styles: { fontSize: 16, color: "#6b7280", margin: [0, 0, 0, 0] },
  },
  "portfolio-skills": {
    id: "portfolio-skills",
    type: "container",
    styles: { backgroundColor: "#ffffff", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 20, 0] },
    children: ["portfolio-skills-title", "portfolio-skills-list"],
  },
  "portfolio-skills-title": {
    id: "portfolio-skills-title",
    type: "text",
    content: "Skills & Expertise",
    styles: { fontSize: 36, fontWeight: 600, color: "#1f2937", textAlign: "center", margin: [0, 0, 30, 0] },
  },
  "portfolio-skills-list": {
    id: "portfolio-skills-list",
    type: "text",
    content: "React • Next.js • TypeScript • Tailwind CSS • Node.js • MongoDB • Git • UI/UX Design",
    styles: { fontSize: 18, color: "#4b5563", textAlign: "center", margin: [0, 0, 0, 0] },
  },
  "portfolio-contact": {
    id: "portfolio-contact",
    type: "container",
    styles: { backgroundColor: "#1f2937", padding: [80, 40, 80, 40], textAlign: "center", margin: [0, 0, 0, 0] },
    children: ["portfolio-contact-title", "portfolio-contact-email", "portfolio-contact-linkedin"],
  },
  "portfolio-contact-title": {
    id: "portfolio-contact-title",
    type: "text",
    content: "Get In Touch",
    styles: { fontSize: 42, fontWeight: 700, color: "#ffffff", textAlign: "center", margin: [0, 0, 32, 0] },
  },
  "portfolio-contact-email": {
    id: "portfolio-contact-email",
    type: "text",
    content: "Email: alex.johnson@example.com",
    styles: { fontSize: 18, color: "#d1d5db", textAlign: "center", margin: [0, 0, 10, 0] },
  },
  "portfolio-contact-linkedin": {
    id: "portfolio-contact-linkedin",
    type: "text",
    content: "LinkedIn: /in/alexjohnson",
    styles: { fontSize: 18, color: "#d1d5db", textAlign: "center", margin: [0, 0, 0, 0] },
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
    default:
      return template1Elements
  }
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      currentTemplateId: null,
      elements: {},
      selectedElementId: null,
      showElementsPanel: false,
      showSectionsPanel: false,
      draggedElement: null,
      insertionTargetId: null, // Initialize new state

      setCurrentTemplate: (templateId) => {
        set({ currentTemplateId: templateId })
      },

      setElements: (elements) => {
        set({ elements })
      },

      addElement: (element, explicitTargetId) => {
        set((state) => {
          const newElements = { ...state.elements }

          // Ensure the element has an ID
          if (!element.id) {
            element.id = generateId()
          }

          // Add the new element to the elements object
          newElements[element.id] = { ...element }

          // Determine the actual parent and insertion point
          let actualParentId = "root" // Default to root
          let insertIndex = -1 // Default to append

          const targetId = explicitTargetId || state.insertionTargetId || state.selectedElementId
          const targetElement = targetId ? newElements[targetId] : null

          if (state.insertionTargetId) {
            // Case 1: Insertion via "Add Section Here" button (inserting a sibling section)
            // The insertionTargetId is the sibling element we want to insert AFTER.
            // We need to find its parent (which should be 'root' for top-level sections).
            const parentOfInsertionTarget = Object.keys(newElements).find((key) =>
              newElements[key].children?.includes(state.insertionTargetId!),
            )
            if (parentOfInsertionTarget) {
              actualParentId = parentOfInsertionTarget
              const parentChildren = newElements[actualParentId].children || []
              insertIndex = parentChildren.indexOf(state.insertionTargetId!) + 1
            } else {
              // Fallback if parent not found (shouldn't happen for root children)
              actualParentId = "root"
            }
          } else if (state.selectedElementId) {
            // Case 2: Insertion via Elements/Sections panel with an element selected
            if (targetElement && targetElement.type === "container") {
              // If selected element is a container, add as a child
              actualParentId = state.selectedElementId
            } else {
              // If selected element is not a container, add as a sibling after it
              const parentOfSelected = Object.keys(newElements).find((key) =>
                newElements[key].children?.includes(state.selectedElementId!),
              )
              if (parentOfSelected) {
                actualParentId = parentOfSelected
                const parentChildren = newElements[actualParentId].children || []
                insertIndex = parentChildren.indexOf(state.selectedElementId!) + 1
              } else {
                actualParentId = "root" // Fallback
              }
            }
          } else {
            // Case 3: No specific target, append to root
            actualParentId = "root"
          }

          // Perform the insertion
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
            insertionTargetId: null, // Reset after use
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

          // Remove from parent's children
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
          insertionTargetId: null, // Clear insertion target when opening elements panel
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

      saveProject: () => {
        const state = get()
        if (!state.currentTemplateId) return

        const projectData: ProjectData = {
          templateId: state.currentTemplateId,
          elements: state.elements,
          lastModified: Date.now(),
        }

        localStorage.setItem(`litebuilder_project_${state.currentTemplateId}`, JSON.stringify(projectData))

        const savedProjects = JSON.parse(localStorage.getItem("litebuilder_saved_projects") || "[]")
        const existingIndex = savedProjects.findIndex((p: any) => p.templateId === state.currentTemplateId)

        const projectSummary = {
          templateId: state.currentTemplateId,
          lastModified: Date.now(),
          title: `Landing Page ${state.currentTemplateId}`,
        }

        if (existingIndex >= 0) {
          savedProjects[existingIndex] = projectSummary
        } else {
          savedProjects.push(projectSummary)
        }

        localStorage.setItem("litebuilder_saved_projects", JSON.stringify(savedProjects))
      },

      loadProject: (templateId) => {
        const savedData = localStorage.getItem(`litebuilder_project_${templateId}`)

        if (!savedData) {
          // No saved project, load the default template
          const templateElements = getTemplateElements(templateId)
          set({
            currentTemplateId: templateId,
            elements: templateElements,
            selectedElementId: null,
          })
          return false
        }

        try {
          const projectData: ProjectData = JSON.parse(savedData)
          set({
            currentTemplateId: projectData.templateId,
            elements: projectData.elements,
            selectedElementId: null,
          })
          return true
        } catch (error) {
          console.error("Failed to load project:", error)
          // Fallback to default template on error
          const templateElements = getTemplateElements(templateId)
          set({
            currentTemplateId: templateId,
            elements: templateElements,
            selectedElementId: null,
          })
          return false
        }
      },

      resetToOriginal: () => {
        const state = get()
        if (state.currentTemplateId) {
          const templateElements = getTemplateElements(state.currentTemplateId)
          set({
            elements: templateElements,
            selectedElementId: null,
          })
        }
      },
    }),
    {
      name: "litebuilder-editor",
      partialize: (state) => ({
        currentTemplateId: state.currentTemplateId,
        elements: state.elements,
      }),
    },
  ),
)
