import { createServerClient } from "@/lib/supabase"
import { ElementRenderer } from "@/components/ElementRenderer"
import { notFound } from "next/navigation"
import { EmailCaptureModal } from "@/components/EmailCaptureModal"
import { headers } from "next/headers"

interface PublicPageProps {
  params: {
    slug: string
  }
}

export default async function PublicPage({ params }: PublicPageProps) {
  const supabase = createServerClient()
  const slug = params.slug

  const { data: page, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true) // Only show published pages
    .single()

  if (error || !page) {
    console.error("Error fetching public page:", error)
    notFound() // Show 404 if page not found or not published
  }

  // To check if the user has already submitted their email for this page,
  // we can use a cookie or session storage. For server components, we'll use a cookie.
  const headersList = headers()
  const hasSubmittedEmail = headersList.get("cookie")?.includes(`email_captured_${page.id}=true`)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ElementRenderer elementId="root" elements={page.elements} isEditing={false} />
      </div>

      {!hasSubmittedEmail && <EmailCaptureModal pageId={page.id} />}
    </div>
  )
}

// Add ElementRenderer to _app.tsx or similar if it's not globally accessible
// For Next.js App Router, ensure ElementRenderer is set up to receive 'elements' prop
// and render based on it, instead of relying solely on the zustand store for non-editing mode.
