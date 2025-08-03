'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Download } from 'lucide-react'
import { InvoiceUI } from '@/types/invoice'
import { exportInvoiceToPDF } from '@/lib/pdf-export'

interface SignatureUploadProps {
  invoice: InvoiceUI
  onClose: () => void
}

export function SignatureUpload({ invoice, onClose }: SignatureUploadProps) {
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB')
        return
      }

      setSignatureFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setSignaturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveSignature = () => {
    setSignatureFile(null)
    setSignaturePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExportWithSignature = () => {
    exportInvoiceToPDF(invoice, signaturePreview || undefined)
    onClose()
  }

  const handleExportWithoutSignature = () => {
    exportInvoiceToPDF(invoice)
    onClose()
  }

  return (
    <div className="space-y-4">
        <div className="text-sm text-gray-600">
          You can add a signature to your invoice or export without one. 
          The signature will not be saved to the database.
        </div>

        {/* Signature Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Upload Signature (Optional)</label>
          
          {!signaturePreview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload signature</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
            </div>
          ) : (
            <div className="relative border rounded-lg p-4 bg-gray-50">
              <img 
                src={signaturePreview} 
                alt="Signature preview" 
                className="max-w-full max-h-24 mx-auto"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveSignature}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Export Buttons */}
        <div className="space-y-2 pt-4">
          <Button 
            onClick={handleExportWithSignature}
            className="w-full gap-2"
            disabled={!signaturePreview}
          >
            <Download className="w-4 h-4" />
            Export with Signature
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleExportWithoutSignature}
            className="w-full gap-2"
          >
            <Download className="w-4 h-4" />
            Export without Signature
          </Button>
        </div>
    </div>
  )
}
