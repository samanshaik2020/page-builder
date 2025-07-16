"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout, Columns, Grid3X3, X, MessageSquare } from "lucide-react"
import { useEditorStore, type ElementData } from "@/lib/store"

export function SectionsPanel() {
  const { showSectionsPanel, toggleSectionsPanel, addElement, selectedElementId, insertionTargetId } = useEditorStore()

  if (!showSectionsPanel) return null

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleAddSection = (sectionType: string) => {
    // Prioritize insertionTargetId, then selectedElementId (if it's a container), then root
    let targetIdForAdd = insertionTargetId || selectedElementId || "root"
    const currentElements = useEditorStore.getState().elements
    const targetElement = currentElements[targetIdForAdd]

    // If the selected element is not a container, we want to add the section as a sibling
    // The addElement function will handle finding the parent and inserting after the targetId
    if (targetElement && targetElement.type !== "container" && targetIdForAdd !== "root") {
      // Keep targetIdForAdd as is, addElement will treat it as insertAfterId
    } else if (targetElement && targetElement.type === "container") {
      // If a container is selected, add inside it
      targetIdForAdd = selectedElementId
    } else {
      // Fallback to root if no specific target or selected element is suitable
      targetIdForAdd = "root"
    }

    let sectionContainer: ElementData
    let childElements: ElementData[] = []

    switch (sectionType) {
      case "hero":
        const heroId = generateId()
        const heroTitleId = generateId()
        const heroSubtitleId = generateId()
        const heroButtonId = generateId()

        sectionContainer = {
          id: heroId,
          type: "container",
          styles: {
            backgroundColor: "#f8fafc",
            padding: [60, 40, 60, 40],
            textAlign: "center",
            margin: [0, 0, 20, 0],
          },
          children: [heroTitleId, heroSubtitleId, heroButtonId],
        }

        childElements = [
          {
            id: heroTitleId,
            type: "text",
            content: "Your Amazing Headline",
            styles: {
              fontSize: 48,
              fontWeight: 700,
              color: "#1f2937",
              textAlign: "center",
              margin: [0, 0, 16, 0],
            },
          },
          {
            id: heroSubtitleId,
            type: "text",
            content: "A compelling subtitle that explains your value proposition and engages your audience.",
            styles: {
              fontSize: 20,
              color: "#6b7280",
              textAlign: "center",
              margin: [0, 0, 32, 0],
            },
          },
          {
            id: heroButtonId,
            type: "button",
            content: "Get Started",
            href: "#",
            styles: {
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontSize: 18,
              padding: [16, 32, 16, 32],
              borderRadius: 8,
            },
          },
        ]
        break

      case "feature":
        const featureId = generateId()
        const featureTitleId = generateId()
        const featureTextId = generateId()
        const featureImageId = generateId()

        sectionContainer = {
          id: featureId,
          type: "container",
          styles: {
            backgroundColor: "#ffffff",
            padding: [60, 40, 60, 40],
            margin: [0, 0, 20, 0],
          },
          children: [featureTitleId, featureTextId, featureImageId],
        }

        childElements = [
          {
            id: featureTitleId,
            type: "text",
            content: "Amazing Features",
            styles: {
              fontSize: 36,
              fontWeight: 600,
              color: "#1f2937",
              margin: [0, 0, 20, 0],
            },
          },
          {
            id: featureTextId,
            type: "text",
            content: "Discover the powerful features that make our product stand out from the competition.",
            styles: {
              fontSize: 16,
              color: "#6b7280",
              margin: [0, 0, 24, 0],
            },
          },
          {
            id: featureImageId,
            type: "image",
            imageUrl: "/placeholder.svg?height=300&width=400",
            styles: {
              width: 400,
              height: 300,
              borderRadius: 8,
            },
          },
        ]
        break

      case "cta":
        const ctaId = generateId()
        const ctaTitleId = generateId()
        const ctaSubtitleId = generateId()
        const ctaButtonId = generateId()

        sectionContainer = {
          id: ctaId,
          type: "container",
          styles: {
            backgroundColor: "#1f2937",
            padding: [60, 40, 60, 40],
            textAlign: "center",
            margin: [0, 0, 20, 0],
          },
          children: [ctaTitleId, ctaSubtitleId, ctaButtonId],
        }

        childElements = [
          {
            id: ctaTitleId,
            type: "text",
            content: "Ready to Get Started?",
            styles: {
              fontSize: 36,
              fontWeight: 600,
              color: "#ffffff",
              textAlign: "center",
              margin: [0, 0, 16, 0],
            },
          },
          {
            id: ctaSubtitleId,
            type: "text",
            content: "Join thousands of satisfied customers who have transformed their business with our solution.",
            styles: {
              fontSize: 18,
              color: "#d1d5db",
              textAlign: "center",
              margin: [0, 0, 32, 0],
            },
          },
          {
            id: ctaButtonId,
            type: "button",
            content: "Start Free Trial",
            href: "#",
            styles: {
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontSize: 18,
              padding: [16, 32, 16, 32],
              borderRadius: 8,
            },
          },
        ]
        break

      case "testimonial":
        const testimonialId = generateId()
        const testimonialQuoteId = generateId()
        const testimonialAuthorId = generateId()

        sectionContainer = {
          id: testimonialId,
          type: "container",
          styles: {
            backgroundColor: "#f9fafb",
            padding: [60, 40, 60, 40],
            textAlign: "center",
            margin: [0, 0, 20, 0],
          },
          children: [testimonialQuoteId, testimonialAuthorId],
        }

        childElements = [
          {
            id: testimonialQuoteId,
            type: "text",
            content: '"This product has completely transformed how we work. Highly recommended!"',
            styles: {
              fontSize: 24,
              fontWeight: 500,
              color: "#1f2937",
              textAlign: "center",
              margin: [0, 0, 20, 0],
            },
          },
          {
            id: testimonialAuthorId,
            type: "text",
            content: "John Smith, CEO at TechCorp",
            styles: {
              fontSize: 16,
              color: "#6b7280",
              textAlign: "center",
            },
          },
        ]
        break
      default:
        return
    }

    // Add the main section container first, using the determined targetIdForAdd
    addElement(sectionContainer, targetIdForAdd)

    // Then add its children, specifying the sectionContainer.id as their parent
    childElements.forEach((child) => {
      addElement(child, sectionContainer.id)
    })

    toggleSectionsPanel()
  }

  const sections = [
    {
      name: "Hero Section",
      icon: Layout,
      description: "Header with title, subtitle, and CTA",
      type: "hero",
    },
    {
      name: "Feature Section",
      icon: Columns,
      description: "Feature content with image",
      type: "feature",
    },
    {
      name: "Testimonial",
      icon: MessageSquare,
      description: "Customer testimonial section",
      type: "testimonial",
    },
    {
      name: "CTA Section",
      icon: Grid3X3,
      description: "Call-to-action with dark background",
      type: "cta",
    },
  ]

  const insertionContext = insertionTargetId
    ? `Inserting after "${useEditorStore.getState().elements[insertionTargetId]?.type}"`
    : selectedElementId && useEditorStore.getState().elements[selectedElementId]?.type === "container"
      ? "Inserting into selected container"
      : selectedElementId && selectedElementId !== "root"
        ? `Inserting next to "${useEditorStore.getState().elements[selectedElementId]?.type}"`
        : "Inserting to page root"

  return (
    <Card className="fixed top-20 left-0 w-80 z-50 shadow-lg bg-white h-[calc(100vh-80px)] overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Add Sections</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleSectionsPanel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">{insertionContext}</p>
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Button
              key={section.name}
              variant="outline"
              className="w-full justify-start h-auto p-3 bg-transparent hover:bg-gray-50"
              onClick={() => handleAddSection(section.type)}
            >
              <Icon className="h-4 w-4 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-sm">{section.name}</div>
                <div className="text-xs text-muted-foreground">{section.description}</div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
