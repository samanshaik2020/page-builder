import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function IndexPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/build")
  } else {
    redirect("/auth")
  }
}
