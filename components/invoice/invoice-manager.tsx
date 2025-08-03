'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  FileText, 
  DollarSign,
  Calendar,
  User
} from 'lucide-react'
import { InvoiceUI, InvoiceFormData } from '@/types/invoice'
import { InvoiceForm } from './invoice-form'
import { InvoicePreview } from './invoice-preview'
import { DataTable } from '@/components/admin/data-table'
import { formatCurrency, formatDate } from '@/lib/invoice-utils'
import { toast } from 'sonner'

interface InvoiceManagerProps {
  invoices: InvoiceUI[]
  onCreateInvoice: (invoice: InvoiceFormData) => Promise<void>
  onUpdateInvoice: (id: string, invoice: InvoiceFormData) => Promise<void>
  onDeleteInvoice: (id: string) => Promise<void>
  onExportInvoice: (invoice: InvoiceUI) => void
  isLoading?: boolean
}

export function InvoiceManager({
  invoices,
  onCreateInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  onExportInvoice,
  isLoading = false
}: InvoiceManagerProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'preview'>('list')
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceUI | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceUI | null>(null)

  const handleCreateInvoice = async (invoiceData: InvoiceFormData) => {
    try {
      await onCreateInvoice(invoiceData)
      setView('list')
      toast.success('Invoice created successfully')
    } catch (error) {
      toast.error('Failed to create invoice')
    }
  }

  const handleUpdateInvoice = async (invoiceData: InvoiceFormData) => {
    if (!selectedInvoice?.$id) return
    
    try {
      await onUpdateInvoice(selectedInvoice.$id, invoiceData)
      setView('list')
      setSelectedInvoice(null)
      toast.success('Invoice updated successfully')
    } catch (error) {
      toast.error('Failed to update invoice')
    }
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete?.$id) return
    
    try {
      await onDeleteInvoice(invoiceToDelete.$id)
      setDeleteDialogOpen(false)
      setInvoiceToDelete(null)
      toast.success('Invoice deleted successfully')
    } catch (error) {
      toast.error('Failed to delete invoice')
    }
  }

  const getStatusBadge = (status: InvoiceUI['status']) => {
    const variants = {
      draft: 'secondary',
      sent: 'default',
      paid: 'success',
      overdue: 'destructive'
    } as const

    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    }

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      sortable: true
    },
    {
      key: 'client',
      label: 'Client',
      render: (value: any, row: InvoiceUI) => row.client.name
    },
    {
      key: 'invoiceDate',
      label: 'Date',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'total',
      label: 'Amount',
      render: (value: number, row: InvoiceUI) => formatCurrency(value, row.currency)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: InvoiceUI['status']) => getStatusBadge(value)
    }
  ]

  const stats = [
    {
      title: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      description: "All invoices",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Total Revenue",
      value: formatCurrency(
        invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
        'USD'
      ),
      icon: DollarSign,
      description: "Paid invoices",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Pending Amount",
      value: formatCurrency(
        invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
        'USD'
      ),
      icon: Calendar,
      description: "Awaiting payment",
      trend: { value: 5, isPositive: false }
    },
    {
      title: "Overdue Amount",
      value: formatCurrency(
        invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
        'USD'
      ),
      icon: User,
      description: "Past due date",
      trend: { value: 2, isPositive: false }
    }
  ]

  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Invoice</h2>
          <Button variant="outline" onClick={() => setView('list')}>
            Back to List
          </Button>
        </div>
        <InvoiceForm
          onSave={handleCreateInvoice}
          onCancel={() => setView('list')}
          isLoading={isLoading}
        />
      </div>
    )
  }

  if (view === 'edit' && selectedInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Invoice</h2>
          <Button variant="outline" onClick={() => setView('list')}>
            Back to List
          </Button>
        </div>
        <InvoiceForm
          invoice={selectedInvoice}
          onSave={handleUpdateInvoice}
          onCancel={() => setView('list')}
          isLoading={isLoading}
        />
      </div>
    )
  }

  if (view === 'preview' && selectedInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Invoice Preview</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onExportInvoice(selectedInvoice)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => setView('list')}>
              Back to List
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <InvoicePreview invoice={selectedInvoice} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Management</h2>
          <p className="text-gray-600">Create, manage, and track your invoices</p>
        </div>
        <Button onClick={() => setView('create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={invoices}
            columns={columns}
            searchPlaceholder="Search invoices..."
            onRowClick={(invoice) => {
              setSelectedInvoice(invoice)
              setView('preview')
            }}
            actions={(invoice) => (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedInvoice(invoice)
                    setView('preview')
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedInvoice(invoice)
                    setView('edit')
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExportInvoice(invoice)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInvoiceToDelete(invoice)
                    setDeleteDialogOpen(true)
                  }}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            emptyMessage="No invoices found. Create your first invoice to get started."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice {invoiceToDelete?.invoiceNumber}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
