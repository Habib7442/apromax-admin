// Quick test to verify invoice conversion functions work correctly
// Run with: node test-invoice-conversion.js

const sampleUIInvoice = {
  invoiceNumber: 'APRO/25-26/0104',
  invoiceDate: '2025-07-18',
  dueDate: '2025-08-18',
  contactName: 'Sufian Barbhuiya',
  contactNumber: '+1 (312) 313-9125',
  client: {
    name: 'Gray Group',
    address: '256 Seaboard Lane Suite F102\nFranklin,TN 37067\nU.S.A',
    phone: '+1 (859) 281-5000',
    email: 'contact@graygroup.com'
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
  notes: 'Thank you for choosing AproMax Engineering LLP.',
  paymentMethod: 'Wire transfer',
  bankDetails: {
    bankName: 'HDFC Bank Ltd.',
    accountName: 'APROMAX ENGINEERING LLP',
    accountNumber: '50200104107160',
    branchName: 'Hatigaon',
    ifscCode: 'HDFC0005671',
    swiftCode: 'HDFCINBB',
    bankAddress: 'Near Police Station, Hatigaon, Guwahati - 781038, Assam, India.'
  },
  currency: 'USD',
  status: 'draft'
}

// Simulate conversion to Appwrite format
function convertUIToAppwrite(invoiceUI) {
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

console.log('🧪 Testing Invoice Conversion...\n')

console.log('📝 Original UI Invoice:')
console.log('Client Name:', sampleUIInvoice.client.name)
console.log('Items Count:', sampleUIInvoice.items.length)
console.log('Total:', sampleUIInvoice.total)
console.log('')

const appwriteFormat = convertUIToAppwrite(sampleUIInvoice)

console.log('💾 Converted Appwrite Format:')
console.log('Client Name:', appwriteFormat.clientName)
console.log('Items JSON:', appwriteFormat.itemsJson.substring(0, 50) + '...')
console.log('Total:', appwriteFormat.total)
console.log('Has items field:', 'items' in appwriteFormat ? '❌ ERROR' : '✅ GOOD')
console.log('Has bankDetails field:', 'bankDetails' in appwriteFormat ? '❌ ERROR' : '✅ GOOD')
console.log('')

console.log('✅ Conversion test completed!')
console.log('The converted object should only contain fields that exist in your Appwrite collection.')
console.log('')
console.log('🔍 Fields to create in Appwrite:')
Object.keys(appwriteFormat).forEach(key => {
  console.log(`- ${key}`)
})
