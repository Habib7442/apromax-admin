'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Calculator } from 'lucide-react'
import { InvoiceUI, InvoiceItem, InvoiceFormData, defaultBankDetails } from '@/types/invoice'
import { 
  calculateItemAmount, 
  calculateItemIgst, 
  calculateInvoiceTotals, 
  numberToWords, 
  generateInvoiceNumber,
  validateInvoice 
} from '@/lib/invoice-utils'
import { toast } from 'sonner'

interface InvoiceFormProps {
  invoice?: InvoiceUI
  onSave: (invoice: InvoiceFormData) => void
  onCancel: () => void
  isLoading?: boolean
  showButtons?: boolean
}

export function InvoiceForm({ invoice, onSave, onCancel, isLoading = false, showButtons = true }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: invoice?.invoiceNumber || generateInvoiceNumber(),
    invoiceDate: invoice?.invoiceDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contactName: invoice?.contactName || 'Sufian Barbhuiya',
    contactNumber: invoice?.contactNumber || '+1 (312) 313-9125',
    client: {
      name: invoice?.client?.name || '',
      address: invoice?.client?.address || '',
      phone: invoice?.client?.phone || '',
      email: invoice?.client?.email || ''
    },
    subject: invoice?.subject || '',
    items: invoice?.items || [{
      id: '1',
      description: '',
      hsnSac: '998314',
      quantity: 1,
      rate: 0,
      igstRate: 0,
      igstAmount: 0,
      amount: 0
    }],
    notes: invoice?.notes || 'Thank you for choosing AproMax Engineering LLP. We sincerely value your business and are committed to providing you with exceptional service. We look forward to the opportunity to assist you continuously with your business.',
    paymentMethod: invoice?.paymentMethod || 'Wire transfer',
    bankDetails: invoice?.bankDetails || defaultBankDetails,
    currency: invoice?.currency || 'USD',
    status: invoice?.status || 'draft'
  })

  const [calculatedTotals, setCalculatedTotals] = useState({
    subTotal: 0,
    totalIgst: 0,
    total: 0,
    totalInWords: ''
  })

  // Calculate totals whenever items change
  useEffect(() => {
    const totals = calculateInvoiceTotals(formData.items)
    const totalInWords = numberToWords(totals.total, formData.currency)

    setCalculatedTotals({
      ...totals,
      totalInWords
    })
  }, [formData.items, formData.currency])



  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalculate amounts when quantity, rate, or igstRate changes
    if (field === 'quantity' || field === 'rate' || field === 'igstRate') {
      newItems[index].amount = calculateItemAmount(newItems[index])
      newItems[index].igstAmount = calculateItemIgst(newItems[index])
    }
    
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      hsnSac: '998314',
      quantity: 1,
      rate: 0,
      igstRate: 0,
      igstAmount: 0,
      amount: 0
    }
    setFormData({ ...formData, items: [...formData.items, newItem] })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const invoiceData = {
      ...formData,
      ...calculatedTotals
    }
    
    const errors = validateInvoice(invoiceData)
    if (errors.length > 0) {
      toast.error(`Please fix the following errors:\n${errors.join('\n')}`)
      return
    }
    
    onSave(invoiceData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.client.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  client: { ...formData.client, name: e.target.value }
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                value={formData.client.phone}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  client: { ...formData.client, phone: e.target.value }
                })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea
                id="clientAddress"
                value={formData.client.address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  client: { ...formData.client, address: e.target.value }
                })}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.client.email}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  client: { ...formData.client, email: e.target.value }
                })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Textarea
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              rows={2}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button type="button" onClick={addItem} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>HSN/SAC Code</Label>
                    <Input
                      value={item.hsnSac}
                      onChange={(e) => updateItem(index, 'hsnSac', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Rate ({formData.currency === 'USD' ? '$' : '₹'})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>IGST Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.igstRate}
                      onChange={(e) => updateItem(index, 'igstRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label>IGST Amount</Label>
                    <Input
                      type="number"
                      value={item.igstAmount.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <Label>Total Amount</Label>
                    <Input
                      type="number"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Totals Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">{calculatedTotals.subTotal.toFixed(2)} {formData.currency}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Total IGST:</span>
              <span className="font-medium">{calculatedTotals.totalIgst.toFixed(2)} {formData.currency}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{calculatedTotals.total.toFixed(2)} {formData.currency}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <strong>In Words:</strong> {calculatedTotals.totalInWords}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes and Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      {showButtons && (
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Invoice'}
          </Button>
        </div>
      )}
    </form>
  )
}
