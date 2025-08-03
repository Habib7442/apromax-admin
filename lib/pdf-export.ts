import { InvoiceUI } from '@/types/invoice'

export function exportInvoiceToPDF(invoice: InvoiceUI) {
  // Create a new window with the invoice content for printing/PDF export
  const printWindow = window.open('', '_blank', 'width=800,height=600')
  
  if (!printWindow) {
    alert('Please allow popups to export the invoice')
    return
  }

  const invoiceHTML = generateInvoiceHTML(invoice)
  
  printWindow.document.write(invoiceHTML)
  printWindow.document.close()
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print()
    // Close window after printing (optional)
    printWindow.onafterprint = () => {
      printWindow.close()
    }
  }
}

function generateInvoiceHTML(invoice: InvoiceUI): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AproMax Engineering LLP - Export Invoice</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                line-height: 1.4;
                color: #000;
                background: #fff;
            }
            
            .invoice-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
                background: white;
                min-height: 297mm;
            }
            
            .header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #0066cc;
                padding-bottom: 15px;
            }
            
            .logo {
                width: 150px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 20px;
            }
            
            .company-title {
                flex: 1;
            }
            
            .company-title h1 {
                font-size: 28px;
                color: #0066cc;
                font-weight: bold;
                margin-bottom: 5px;
            }
            

            
            .company-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 20px;
                font-size: 11px;
            }
            
            .office-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .invoice-header {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 30px;
                margin-bottom: 20px;
            }
            
            .invoice-details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
            }
            
            .invoice-number {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .balance-due {
                text-align: center;
                background: #0066cc;
                color: white;
                padding: 15px;
                border-radius: 5px;
                margin-left: 20px;
            }
            
            .balance-due h2 {
                font-size: 12px;
                margin-bottom: 5px;
                font-weight: normal;
            }
            
            .balance-due h1 {
                font-size: 24px;
                font-weight: bold;
            }
            
            .billing-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 20px;
            }
            
            .bill-to {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
            }
            
            .bill-to h3 {
                color: #0066cc;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .client-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .invoice-meta {
                font-size: 11px;
                line-height: 1.6;
            }
            
            .subject-section {
                margin-bottom: 20px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 5px;
            }
            
            .subject-section strong {
                color: #0066cc;
            }
            
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 11px;
            }
            
            .items-table th {
                background: #0066cc;
                color: white;
                padding: 12px 8px;
                text-align: left;
                font-weight: bold;
            }
            
            .items-table td {
                padding: 12px 8px;
                border-bottom: 1px solid #ddd;
            }
            
            .items-table tr:nth-child(even) {
                background: #f8f9fa;
            }
            
            .text-right {
                text-align: right;
            }
            
            .text-center {
                text-align: center;
            }
            
            .totals-section {
                float: right;
                width: 300px;
                margin-bottom: 20px;
            }
            
            .totals-table {
                width: 100%;
                font-size: 12px;
            }
            
            .totals-table td {
                padding: 5px 10px;
                border-bottom: 1px solid #ddd;
            }
            
            .total-row {
                background: #0066cc;
                color: white;
                font-weight: bold;
            }
            
            .amount-words {
                clear: both;
                margin-bottom: 20px;
                font-style: italic;
                font-size: 11px;
            }
            
            .notes-section, .payment-section {
                margin-bottom: 20px;
                font-size: 11px;
                line-height: 1.5;
            }
            
            .notes-section h4, .payment-section h4 {
                color: #0066cc;
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .bank-details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
            }
            
            @media print {
                .invoice-container {
                    margin: 0;
                    padding: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">
                    <img src="/logo.png" alt="AproMax Engineering LLP" style="width: 150px; height: 60px; object-fit: contain;" />
                </div>
                <div class="company-title">
                    <h1>AproMax Engineering LLP</h1>
                </div>
            </div>

            <!-- Company Information -->
            <div class="company-info">
                <div class="registered-office">
                    <div class="office-title">Registered Office:</div>
                    835, Katigorah Part - III, Katigorah, Cachar,<br>
                    Assam 788805, India<br>
                    Mobile: +91 9101362280<br>
                    GSTIN: 18ACGFA9077M1ZP PAN: ACGFA9077M
                </div>
                <div class="branch-office">
                    <div class="office-title">Branch Office:</div>
                    57, Idgah Rd, Hatigaon, Guwahati, Kamrup Metro,<br>
                    Assam 781038, India<br>
                    IND: +91 9577291349<br>
                    USA: +1 (312) 313-9125<br>
                    Email: Sufian.b@apromaxeng.com<br>
                    Website: www.apromaxeng.com
                </div>
            </div>

            <!-- Invoice Header -->
            <div class="invoice-header">
                <div class="invoice-details">
                    <div class="invoice-number">Invoice No.: ${invoice.invoiceNumber}</div>
                </div>
                <div class="balance-due">
                    <h2>Balance Due</h2>
                    <h1>${invoice.currency === 'USD' ? '$' : '₹'}${invoice.total.toFixed(2)}</h1>
                </div>
            </div>

            <!-- Billing Section -->
            <div class="billing-section">
                <div class="bill-to">
                    <h3>Bill To</h3>
                    <div class="client-name">${invoice.client.name}</div>
                    ${invoice.client.address.split('\n').map(line => `<div>${line}</div>`).join('')}
                    ${invoice.client.phone ? `<div>Phone: ${invoice.client.phone}</div>` : ''}
                </div>
                <div class="invoice-meta">
                    Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-US')}<br>
                    Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-US')}<br>
                    Contact Name: ${invoice.contactName}<br>
                    Contact No: ${invoice.contactNumber}
                </div>
            </div>

            <!-- Subject -->
            <div class="subject-section">
                <strong>Subject:</strong><br>
                ${invoice.subject}
            </div>

            <!-- Items Table -->
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Task & Description</th>
                        <th>HSN/SAC</th>
                        <th>Qty</th>
                        <th>Rate (in ${invoice.currency === 'USD' ? '$' : '₹'})</th>
                        <th>IGST</th>
                        <th class="text-right">Amount (in ${invoice.currency === 'USD' ? '$' : '₹'})</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map((item, index) => `
                        <tr>
                            <td class="text-center">${index + 1}</td>
                            <td>${item.description.split('\n').map(line => `<div>${line}</div>`).join('')}</td>
                            <td class="text-center">${item.hsnSac}</td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-right">${item.rate.toFixed(2)}</td>
                            <td class="text-center">
                                ${item.igstAmount.toFixed(2)}<br>
                                ${item.igstRate}%
                            </td>
                            <td class="text-right">${item.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- Totals -->
            <div class="totals-section">
                <table class="totals-table">
                    <tr>
                        <td>Sub Total</td>
                        <td class="text-right">${invoice.currency === 'USD' ? '$' : '₹'}${invoice.subTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>IGST (${invoice.items[0]?.igstRate || 0}%)</td>
                        <td class="text-right">${invoice.totalIgst.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Total</strong></td>
                        <td class="text-right"><strong>${invoice.currency === 'USD' ? '$' : '₹'}${invoice.total.toFixed(2)}</strong></td>
                    </tr>
                </table>
            </div>

            <div class="amount-words">
                <strong>Total In Words:</strong> <em>${invoice.totalInWords}</em>
            </div>

            <!-- Notes Section -->
            <div class="notes-section">
                <h4>Notes</h4>
                ${invoice.notes}
            </div>

            <!-- Payment Instructions -->
            <div class="payment-section">
                <h4>Payment Instructions</h4>
                <strong>Payment Method:</strong> ${invoice.paymentMethod}
                
                <div class="bank-details">
                    <strong>Bank Account Details for Payment</strong><br><br>
                    <strong>Bank Name:</strong> ${invoice.bankDetails.bankName}<br>
                    <strong>Account Name:</strong> ${invoice.bankDetails.accountName}<br>
                    <strong>Account Number:</strong> ${invoice.bankDetails.accountNumber}<br>
                    <strong>Branch Name:</strong> ${invoice.bankDetails.branchName}<br>
                    <strong>IFSC Code:</strong> ${invoice.bankDetails.ifscCode}<br>
                    <strong>Swift Code:</strong> ${invoice.bankDetails.swiftCode}<br>
                    <strong>Bank Address:</strong> ${invoice.bankDetails.bankAddress}
                </div>
            </div>
        </div>
    </body>
    </html>
  `
}
