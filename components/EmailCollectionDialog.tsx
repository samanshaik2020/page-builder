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

export function EmailCollectionDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if the dialog has been shown or email submitted in this session
    const emailSubmitted = localStorage.getItem("litebuilder_email_submitted")
    const dialogDismissed = sessionStorage.getItem("litebuilder_dialog_dismissed")

    if (!emailSubmitted && !dialogDismissed) {
      // Show the dialog after a short delay to ensure page loads
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000) // 1 second delay
      return () => clearTimeout(timer)
    }
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = () => {
    if (validateEmail(email)) {
      // In a real application, you would send this email to your backend
      console.log("Email submitted:", email)
      localStorage.setItem("litebuilder_email_submitted", "true") // Mark as submitted
      setIsOpen(false)
      toast({
        title: "Thank You!",
        description: "Your email has been received. Happy building!",
      })
    } else {
      setIsValidEmail(false)
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem("litebuilder_dialog_dismissed", "true") // Mark as dismissed for this session
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unlock Full Potential</AlertDialogTitle>
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
          <Button onClick={handleSubmit} disabled={!isValidEmail || email.length === 0}>
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
