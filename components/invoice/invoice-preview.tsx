'use client'

import React from 'react'
import Image from 'next/image'
import { InvoiceUI, defaultCompanyInfo } from '@/types/invoice'
import { formatCurrency, formatDate } from '@/lib/invoice-utils'

interface InvoicePreviewProps {
  invoice: InvoiceUI
  className?: string
}

export function InvoicePreview({ invoice, className = '' }: InvoicePreviewProps) {
  return (
    <div className={`max-w-4xl mx-auto bg-white text-black ${className}`}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
        
        .invoice-container {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #000;
          background: #fff;
          padding: 20px;
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
      `}</style>
      
      <div className="invoice-container">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <img
              src="/logo.png"
              alt="AproMax Engineering LLP"
              style={{ width: '150px', height: '60px', objectFit: 'contain' }}
            />
          </div>
          <div className="company-title">
            <h1>{defaultCompanyInfo.name}</h1>
          </div>
        </div>

        {/* Company Information */}
        <div className="company-info">
          <div className="registered-office">
            <div className="office-title">Registered Office:</div>
            {defaultCompanyInfo.registeredOffice.address.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div>Mobile: {defaultCompanyInfo.registeredOffice.mobile}</div>
            <div>GSTIN: {defaultCompanyInfo.registeredOffice.gstin} PAN: {defaultCompanyInfo.registeredOffice.pan}</div>
          </div>
          <div className="branch-office">
            <div className="office-title">Branch Office:</div>
            {defaultCompanyInfo.branchOffice.address.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div>IND: {defaultCompanyInfo.branchOffice.indPhone}</div>
            <div>USA: {defaultCompanyInfo.branchOffice.usaPhone}</div>
            <div>Email: {defaultCompanyInfo.branchOffice.email}</div>
            <div>Website: {defaultCompanyInfo.branchOffice.website}</div>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="invoice-details">
            <div className="invoice-number">Invoice No.: {invoice.invoiceNumber}</div>
          </div>
          <div className="balance-due">
            <h2>Balance Due</h2>
            <h1>{formatCurrency(invoice.total, invoice.currency)}</h1>
          </div>
        </div>

        {/* Billing Section */}
        <div className="billing-section">
          <div className="bill-to">
            <h3>Bill To</h3>
            <div className="client-name">{invoice.client.name}</div>
            {invoice.client.address.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {invoice.client.phone && <div>Phone: {invoice.client.phone}</div>}
            {invoice.client.email && <div>Email: {invoice.client.email}</div>}
          </div>
          <div className="invoice-meta">
            <div>Invoice Date: {formatDate(invoice.invoiceDate)}</div>
            <div>Due Date: {formatDate(invoice.dueDate)}</div>
            <div>Contact Name: {invoice.contactName}</div>
            <div>Contact No: {invoice.contactNumber}</div>
          </div>
        </div>

        {/* Subject */}
        <div className="subject-section">
          <strong>Subject:</strong><br />
          {invoice.subject}
        </div>

        {/* Items Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Task & Description</th>
              <th>HSN/SAC</th>
              <th>Qty</th>
              <th>Rate (in {invoice.currency === 'USD' ? '$' : '₹'})</th>
              <th>IGST</th>
              <th className="text-right">Amount (in {invoice.currency === 'USD' ? '$' : '₹'})</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td>{item.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}</td>
                <td className="text-center">{item.hsnSac}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{item.rate.toFixed(2)}</td>
                <td className="text-center">
                  {item.igstAmount.toFixed(2)}<br />
                  {item.igstRate}%
                </td>
                <td className="text-right">{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="totals-section">
          <table className="totals-table">
            <tbody>
              <tr>
                <td>Sub Total</td>
                <td className="text-right">{formatCurrency(invoice.subTotal, invoice.currency)}</td>
              </tr>
              <tr>
                <td>IGST ({invoice.items[0]?.igstRate || 0}%)</td>
                <td className="text-right">{invoice.totalIgst.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td><strong>Total</strong></td>
                <td className="text-right"><strong>{formatCurrency(invoice.total, invoice.currency)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="amount-words">
          <strong>Total In Words:</strong> <em>{invoice.totalInWords}</em>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <h4>Notes</h4>
          {invoice.notes}
        </div>

        {/* Payment Instructions */}
        <div className="payment-section">
          <h4>Payment Instructions</h4>
          <strong>Payment Method:</strong> {invoice.paymentMethod}
          
          <div className="bank-details">
            <strong>Bank Account Details for Payment</strong><br /><br />
            <strong>Bank Name:</strong> {invoice.bankDetails.bankName}<br />
            <strong>Account Name:</strong> {invoice.bankDetails.accountName}<br />
            <strong>Account Number:</strong> {invoice.bankDetails.accountNumber}<br />
            <strong>Branch Name:</strong> {invoice.bankDetails.branchName}<br />
            <strong>IFSC Code:</strong> {invoice.bankDetails.ifscCode}<br />
            <strong>Swift Code:</strong> {invoice.bankDetails.swiftCode}<br />
            <strong>Bank Address:</strong> {invoice.bankDetails.bankAddress}
          </div>
        </div>
      </div>
    </div>
  )
}
