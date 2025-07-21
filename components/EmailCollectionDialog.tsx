"use client"

import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface EmailCollectionDialogProps {
  shouldShow?: boolean
  onClose?: () => void
  onSubmit?: (email: string) => Promise<void>
  pageTitle?: string
}

export function EmailCollectionDialog({ 
  shouldShow = false, 
  onClose, 
  onSubmit,
  pageTitle = "Unlock Full Potential"
}: EmailCollectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    // Check if the dialog has been shown or email submitted in this session
    const emailSubmitted = localStorage.getItem("litebuilder_email_submitted")
    const dialogDismissed = sessionStorage.getItem("litebuilder_dialog_dismissed")

    if (shouldShow && !emailSubmitted && !dialogDismissed) {
      // Show the dialog when shouldShow is true and conditions are met
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500) // Short delay for better UX
      return () => clearTimeout(timer)
    }
  }, [shouldShow])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setIsValidEmail(false)
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // If onSubmit prop is provided (for published pages), use it
      if (onSubmit) {
        await onSubmit(email.trim())
      } else {
        // Fallback for editor mode - just simulate
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Mark as submitted
      localStorage.setItem('litebuilder_email_submitted', 'true')
      sessionStorage.setItem('litebuilder_email_submitted', 'true')
      
      setIsSubmitted(true)
      setIsOpen(false)
      
      toast({
        title: "Thank You!",
        description: "Your email has been received. Happy building!",
      })
      
      onClose?.()
    } catch (error) {
      setError('Something went wrong. Please try again.')
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem("litebuilder_dialog_dismissed", "true") // Mark as dismissed for this session
    setIsOpen(false)
    onClose?.()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center mb-2">
            {pageTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter your email to save your progress and access exclusive features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setIsValidEmail(validateEmail(e.target.value))
              }}
              className={!isValidEmail && email.length > 0 ? "border-red-500" : ""}
            />
            {!isValidEmail && email.length > 0 && <p className="text-sm text-red-500">Please enter a valid email.</p>}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDismiss}>Maybe Later</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={!isValidEmail || email.length === 0 || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
