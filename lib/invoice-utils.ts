import { InvoiceItem, Invoice, InvoiceUI, ClientInfo, BankDetails, defaultBankDetails } from '@/types/invoice'

export function calculateItemAmount(item: Partial<InvoiceItem>): number {
  const quantity = item.quantity || 0
  const rate = item.rate || 0
  return quantity * rate
}

export function calculateItemIgst(item: Partial<InvoiceItem>): number {
  const amount = calculateItemAmount(item)
  const igstRate = item.igstRate || 0
  return (amount * igstRate) / 100
}

export function calculateInvoiceTotals(items: InvoiceItem[]) {
  const subTotal = items.reduce((sum, item) => sum + item.amount, 0)
  const totalIgst = items.reduce((sum, item) => sum + item.igstAmount, 0)
  const total = subTotal + totalIgst
  
  return {
    subTotal,
    totalIgst,
    total
  }
}

export function numberToWords(num: number, currency: string = 'USD'): string {
  if (num === 0) return `Zero ${currency === 'USD' ? 'Dollars' : 'Rupees'}`
  
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ]
  
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ]
  
  const scales = ['', 'Thousand', 'Million', 'Billion']
  
  function convertHundreds(n: number): string {
    let result = ''
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)]
      if (n % 10 !== 0) {
        result += ' ' + ones[n % 10]
      }
    } else if (n > 0) {
      result += ones[n]
    }
    
    return result.trim()
  }
  
  function convert(n: number): string {
    if (n === 0) return ''
    
    let result = ''
    let scaleIndex = 0
    
    while (n > 0) {
      const chunk = n % 1000
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk)
        if (scaleIndex > 0) {
          result = chunkWords + ' ' + scales[scaleIndex] + ' ' + result
        } else {
          result = chunkWords + ' ' + result
        }
      }
      n = Math.floor(n / 1000)
      scaleIndex++
    }
    
    return result.trim()
  }
  
  const integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100)
  
  let result = ''
  
  if (integerPart > 0) {
    result += convert(integerPart)
    if (currency === 'USD') {
      result += integerPart === 1 ? ' Dollar' : ' Dollars'
    } else {
      result += integerPart === 1 ? ' Rupee' : ' Rupees'
    }
  }
  
  if (decimalPart > 0) {
    if (result) result += ' and '
    result += convert(decimalPart)
    if (currency === 'USD') {
      result += decimalPart === 1 ? ' Cent' : ' Cents'
    } else {
      result += decimalPart === 1 ? ' Paisa' : ' Paise'
    }
  }
  
  return result
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const nextYear = year + 1
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  
  return `APRO/${year.toString().slice(-2)}-${nextYear.toString().slice(-2)}/${month}${random}`
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function validateInvoice(invoice: Partial<InvoiceUI>): string[] {
  const errors: string[] = []

  if (!invoice.invoiceNumber?.trim()) {
    errors.push('Invoice number is required')
  }

  if (!invoice.invoiceDate) {
    errors.push('Invoice date is required')
  }

  if (!invoice.dueDate) {
    errors.push('Due date is required')
  }

  if (!invoice.client?.name?.trim()) {
    errors.push('Client name is required')
  }

  if (!invoice.client?.address?.trim()) {
    errors.push('Client address is required')
  }

  if (!invoice.subject?.trim()) {
    errors.push('Subject is required')
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.push('At least one item is required')
  } else {
    invoice.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Item ${index + 1}: Description is required`)
      }
      if (!item.hsnSac?.trim()) {
        errors.push(`Item ${index + 1}: HSN/SAC is required`)
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
      }
      if (!item.rate || item.rate <= 0) {
        errors.push(`Item ${index + 1}: Rate must be greater than 0`)
      }
    })
  }

  return errors
}

// Convert UI format to Appwrite format
export function convertUIToAppwrite(invoiceUI: InvoiceUI): any {
  return {
    invoiceNumber: invoiceUI.invoiceNumber,
    invoiceDate: invoiceUI.invoiceDate,
    dueDate: invoiceUI.dueDate,
    contactName: invoiceUI.contactName,
    contactNumber: invoiceUI.contactNumber,
    clientName: invoiceUI.client.name,
    clientAddress: invoiceUI.client.address,
    clientPhone: invoiceUI.client.phone || '',
    clientEmail: invoiceUI.client.email || '',
    subject: invoiceUI.subject,
    itemsJson: JSON.stringify(invoiceUI.items),
    subTotal: invoiceUI.subTotal,
    totalIgst: invoiceUI.totalIgst,
    total: invoiceUI.total,
    totalInWords: invoiceUI.totalInWords,
    notes: invoiceUI.notes || '',
    paymentMethod: invoiceUI.paymentMethod || 'Wire transfer',
    bankDetailsJson: JSON.stringify(invoiceUI.bankDetails),
    currency: invoiceUI.currency,
    status: invoiceUI.status
  }
}

// Convert Appwrite format to UI format
export function convertAppwriteToUI(invoice: Invoice): InvoiceUI {
  let items: InvoiceItem[] = []
  let bankDetails: BankDetails = defaultBankDetails

  try {
    items = JSON.parse(invoice.itemsJson || '[]')
  } catch (error) {
    console.error('Error parsing items JSON:', error)
    items = []
  }

  try {
    bankDetails = JSON.parse(invoice.bankDetailsJson || JSON.stringify(defaultBankDetails))
  } catch (error) {
    console.error('Error parsing bank details JSON:', error)
    bankDetails = defaultBankDetails
  }

  return {
    $id: invoice.$id,
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    contactName: invoice.contactName,
    contactNumber: invoice.contactNumber,
    client: {
      name: invoice.clientName,
      address: invoice.clientAddress,
      phone: invoice.clientPhone,
      email: invoice.clientEmail
    },
    subject: invoice.subject,
    items: items,
    subTotal: invoice.subTotal,
    totalIgst: invoice.totalIgst,
    total: invoice.total,
    totalInWords: invoice.totalInWords,
    notes: invoice.notes,
    paymentMethod: invoice.paymentMethod,
    bankDetails: bankDetails,
    currency: invoice.currency,
    status: invoice.status,
    $createdAt: invoice.$createdAt,
    $updatedAt: invoice.$updatedAt
  }
}
