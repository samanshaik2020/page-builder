"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { recordLead } from "@/app/page/[slug]/actions"
import { useToast } from "@/hooks/use-toast"

interface EmailCaptureModalProps {
  pageId: string
}

export function EmailCaptureModal({ pageId }: EmailCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if email has already been captured for this page in session storage
    const hasCaptured = sessionStorage.getItem(`email_captured_${pageId}`)
    if (!hasCaptured) {
      setIsOpen(true)
    }
  }, [pageId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { success, message } = await recordLead(pageId, email)

    if (success) {
      toast({
        title: "Thank You!",
        description: message,
      })
      sessionStorage.setItem(`email_captured_${pageId}`, "true")
      setIsOpen(false)
    } else {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  // Do not render if already captured or not yet open
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Your Email to View Page</DialogTitle>
          <DialogDescription>
            Unlock the full content by providing your email address. We'll keep you updated!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@example.com"
              className="col-span-3"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Access Page"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
