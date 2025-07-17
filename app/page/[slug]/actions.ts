"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function recordLead(pageId: string, email: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("leads").insert({ page_id: pageId, email: email }).select().single()

    if (error) {
      // Handle unique constraint error gracefully if email already exists for this page
      if (error.code === "23505") {
        // PostgreSQL unique violation error code
        return { success: true, message: "Welcome back! You've already accessed this page." }
      }
      console.error("Error recording lead:", error)
      return { success: false, message: `Failed to record email: ${error.message}` }
    }

    // Set a cookie to remember that this user has provided their email for this page
    cookies().set(`email_captured_${pageId}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: `/page/${pageId}`, // Only for this specific page
    })

    revalidatePath(`/page/${pageId}`) // Revalidate the page to hide the modal

    return { success: true, message: "Thank you for providing your email! Enjoy the page." }
  } catch (err) {
    console.error("Unexpected error in recordLead:", err)
    return { success: false, message: "An unexpected error occurred." }
  }
}
