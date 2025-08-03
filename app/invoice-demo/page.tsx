'use client'

import React from 'react'
import { InvoicePreview } from '@/components/invoice/invoice-preview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sampleInvoice } from '@/lib/sample-invoice'
import { exportInvoiceToPDF } from '@/lib/pdf-export'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function InvoiceDemoPage() {
  const handleExport = () => {
    exportInvoiceToPDF(sampleInvoice)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Demo</h1>
              <p className="text-gray-600">Preview of the invoice system</p>
            </div>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Invoice Preview */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sample Invoice Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InvoicePreview invoice={sampleInvoice} />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Setup Required:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Create an "invoices" collection in your Appwrite database</li>
                  <li>Update the <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID</code> in your .env.local file</li>
                  <li>Install dependencies: <code className="bg-gray-100 px-2 py-1 rounded">npm install @radix-ui/react-select</code></li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Create and edit invoices with a comprehensive form</li>
                  <li>Automatic calculations for totals and taxes</li>
                  <li>Professional invoice preview matching your design</li>
                  <li>PDF export functionality</li>
                  <li>Status tracking (Draft, Sent, Paid, Overdue)</li>
                  <li>Multi-currency support (USD, INR)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Access:</h3>
                <p className="text-gray-700">
                  Once setup is complete, you can access the invoice management system 
                  through the "Invoices" tab in your admin dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
