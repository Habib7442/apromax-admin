import { InvoiceUI, defaultBankDetails } from '@/types/invoice'
import { calculateInvoiceTotals, numberToWords } from './invoice-utils'

export const sampleInvoice: InvoiceUI = {
  $id: 'sample-invoice-1',
  invoiceNumber: 'APRO/25-26/0104',
  invoiceDate: '2025-07-18',
  dueDate: '2025-08-18',
  contactName: 'Sufian Barbhuiya',
  contactNumber: '+1 (312) 313-9125',
  client: {
    name: 'Gray Group',
    address: '256 Seaboard Lane Suite F102\nFranklin,TN 37067\nU.S.A',
    phone: '+1 (859) 281-5000'
  },
  subject: 'Export Invoice for Power BI Dashboard Development',
  items: [
    {
      id: '1',
      description: 'Power BI\nData Visualization Project\n(Business Health)',
      hsnSac: '998314',
      quantity: 1,
      rate: 870.00,
      igstRate: 0,
      igstAmount: 0,
      amount: 870.00
    }
  ],
  subTotal: 870.00,
  totalIgst: 0.00,
  total: 870.00,
  totalInWords: 'United States Dollar Eight Hundred seventy',
  notes: 'Thank you for choosing AproMax Engineering LLP. We sincerely value your business and are committed to providing you with exceptional service. We look forward to the opportunity to assist you continuously with your business.',
  paymentMethod: 'Wire transfer',
  bankDetails: defaultBankDetails,
  currency: 'USD',
  status: 'sent',
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString()
}

// Function to create a sample invoice with calculated totals
export function createSampleInvoice(): InvoiceUI {
  const invoice = { ...sampleInvoice }
  const totals = calculateInvoiceTotals(invoice.items)
  
  return {
    ...invoice,
    ...totals,
    totalInWords: numberToWords(totals.total, invoice.currency)
  }
}
