'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'

interface EmailConfirmationPopupProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function EmailConfirmationPopup({ isOpen, onClose, email }: EmailConfirmationPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Check Your Email
          </DialogTitle>
          <DialogDescription>
            We've sent a confirmation email to:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-center font-medium text-blue-800">{email}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Close this window and click the confirmation mail</p>
                <p className="text-sm text-gray-500">Check your email and click the link to verify your account</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Already have an account?</p>
                <p className="text-sm text-gray-500">Sign in with your existing credentials</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.open('https://mail.google.com', '_blank')}>
            Open Gmail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
