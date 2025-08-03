import { InvoiceUI } from '@/types/invoice'

export function exportInvoiceToPDF(invoice: InvoiceUI, signatureDataUrl?: string) {
  // Create a new window with the invoice content for printing/PDF export
  const printWindow = window.open('', '_blank', 'width=800,height=600')

  if (!printWindow) {
    alert('Please allow popups to export the invoice')
    return
  }

  const invoiceHTML = generateInvoiceHTML(invoice, signatureDataUrl)

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

function generateInvoiceHTML(invoice: InvoiceUI, signatureDataUrl?: string): string {
  const termsAndConditions = `
    <div class="terms-page">
      <h2>Terms & Conditions</h2>
      <div class="terms-content">
        <h3>1. Payment Terms</h3>
        <p>Unless otherwise specified, full payment is due within 30 days from the invoice date. Late payments will incur an interest charge of 1.5% per month on the overdue amount, calculated from the due date until full payment is received. AproMax Engineering LLP reserves the right to suspend ongoing services with a 10 day prior written notice if payment is not received within 30 days.</p>

        <h3>2. Currency and Payment</h3>
        <p>All payments must be made via wire transfer in USD to the bank account specified in the invoice. The Client shall bear all associated bank charges, currency conversion fees, and other transaction costs. Partial payments are not accepted unless explicitly agreed upon in writing.</p>

        <h3>3. Service Delivery</h3>
        <p>Services are deemed delivered and accepted upon completion in accordance with the agreed terms outlined in the Agreement. Any concerns or disputes regarding the quality, delivery or completion of services must be raised within thirty (30) days from the invoice date. Failure to raise objections within this period shall constitute unconditional acceptance of the services.</p>

        <h3>4. Taxes and Duties</h3>
        <p>The Client is responsible for any applicable taxes, duties, or levies related to the payment or services unless otherwise specified. All taxes will be outlined in the invoice where applicable.</p>

        <h3>5. Refund Policy</h3>
        <p>All fees paid are non-refundable unless explicitly stated otherwise. Any applicable refunds will be processed in accordance with the termination terms outlined in the Agreement. Non-refundable fees, if any, will be explicitly stated.</p>

        <h3>6. Governing Law and Jurisdiction</h3>
        <p>These terms are governed by the laws of India, with legal proceedings subject to the jurisdiction of the courts in Guwahati, Assam.</p>

        <h3>7. Dispute Resolution</h3>
        <p>Any disputes shall first be resolved through mutual negotiation. If no resolution is reached, the matter will be referred to mediation or arbitration as per the proposal accepted by the client before initiating any legal proceedings.</p>
      </div>

      <div class="signature-section">
        <h3>Authorized Signatory</h3>
        ${signatureDataUrl ? `<img src="${signatureDataUrl}" alt="Signature" class="signature-image" />` : '<div class="signature-placeholder"></div>'}
        <div class="signature-line"></div>
        <p class="signature-name">AproMax Engineering LLP</p>
      </div>
    </div>
  `;

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
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            @page {
                size: A4;
                margin: 10mm;
            }

            .invoice-container {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                page-break-after: always;
                padding: 10px;
                font-size: 9px;
            }

            .terms-page {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                padding: 15px;
                page-break-before: always;
                font-size: 9px;
            }

            .header {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                border-bottom: 2px solid #1e40af !important;
                padding-bottom: 10px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .logo {
                width: 120px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            }

            .company-title {
                flex: 1;
            }

            .company-title h1 {
                font-size: 18px;
                color: #1e40af !important;
                font-weight: bold;
                margin-bottom: 3px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .company-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 10px;
                font-size: 8px;
                line-height: 1.3;
            }

            .office-title {
                font-weight: bold;
                margin-bottom: 3px;
                color: #1e40af !important;
                font-size: 9px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .invoice-header {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 15px;
                margin-bottom: 10px;
            }

            .invoice-details {
                background: #f8f9fa !important;
                padding: 8px;
                border-radius: 3px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .invoice-number {
                font-size: 10px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .balance-due {
                text-align: center;
                background: #1e40af !important;
                color: white !important;
                padding: 8px;
                border-radius: 3px;
                margin-left: 10px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .balance-due h2 {
                font-size: 9px;
                margin-bottom: 3px;
                font-weight: normal;
                color: white !important;
            }

            .balance-due h1 {
                font-size: 16px;
                font-weight: bold;
                color: white !important;
            }
            
            .billing-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 10px;
            }

            .bill-to {
                background: #f8f9fa !important;
                padding: 8px;
                border-radius: 3px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .bill-to h3 {
                color: #1e40af !important;
                font-size: 10px;
                margin-bottom: 5px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .client-name {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .invoice-meta {
                font-size: 8px;
                line-height: 1.4;
            }

            .subject-section {
                margin-bottom: 8px;
                padding: 6px;
                background: #f8f9fa !important;
                border-radius: 3px;
                font-size: 9px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .subject-section strong {
                color: #1e40af !important;
                font-size: 9px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 8px;
                font-size: 8px;
            }

            .items-table th {
                background: #1e40af !important;
                color: white !important;
                padding: 6px 4px;
                text-align: left;
                font-weight: bold;
                font-size: 8px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .items-table td {
                padding: 5px 4px;
                border-bottom: 1px solid #ddd;
                font-size: 8px;
            }

            .items-table tr:nth-child(even) {
                background: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .text-right {
                text-align: right;
            }

            .text-center {
                text-align: center;
            }

            .totals-section {
                float: right;
                width: 250px;
                margin-bottom: 8px;
            }

            .totals-table {
                width: 100%;
                font-size: 8px;
            }

            .totals-table td {
                padding: 3px 6px;
                border-bottom: 1px solid #ddd;
                font-size: 8px;
            }

            .total-row {
                background: #1e40af !important;
                color: white !important;
                font-weight: bold;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .amount-words {
                clear: both;
                margin-bottom: 8px;
                font-style: italic;
                font-size: 8px;
            }

            .notes-section, .payment-section {
                margin-bottom: 8px;
                font-size: 8px;
                line-height: 1.3;
            }

            .notes-section h4, .payment-section h4 {
                color: #1e40af !important;
                font-size: 9px;
                margin-bottom: 5px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .bank-details {
                background: #f8f9fa !important;
                padding: 8px;
                border-radius: 3px;
                margin-top: 5px;
                font-size: 8px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            /* Terms & Conditions Page Styles */
            .terms-page h2 {
                color: #1e40af !important;
                font-size: 14px;
                margin-bottom: 15px;
                text-align: center;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 8px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .terms-content h3 {
                color: #1e40af !important;
                font-size: 10px;
                margin-top: 12px;
                margin-bottom: 6px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .terms-content p {
                font-size: 8px;
                line-height: 1.3;
                margin-bottom: 8px;
                text-align: justify;
            }

            .signature-section {
                margin-top: 30px;
                text-align: left;
            }

            .signature-section h3 {
                color: #1e40af !important;
                font-size: 10px;
                margin-bottom: 15px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .signature-image {
                max-width: 120px;
                max-height: 50px;
                margin-bottom: 8px;
            }

            .signature-placeholder {
                width: 120px;
                height: 50px;
                border: 1px dashed #ccc;
                margin-bottom: 8px;
            }

            .signature-line {
                width: 150px;
                height: 1px;
                background: #000;
                margin-bottom: 3px;
            }

            .signature-name {
                font-size: 9px;
                font-weight: bold;
            }

            @media print {
                .invoice-container {
                    margin: 0;
                    padding: 15px;
                }

                .terms-page {
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
                    <img src="/logo.png" alt="AproMax Engineering LLP" style="width: 120px; height: 48px; object-fit: contain;" />
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

        <!-- Terms & Conditions Page -->
        ${termsAndConditions}
    </body>
    </html>
  `
}
