# Invoice Management System Setup

## Overview
A comprehensive invoice management system has been added to your AproMax Admin Dashboard. This system allows you to create, edit, view, and export professional invoices with your company branding.

## Features Added

### 🧾 Invoice Management
- **Create Invoices**: Full-featured form with client details, items, and calculations
- **Edit Invoices**: Modify existing invoices with real-time calculations
- **View Invoices**: Professional preview matching your provided design
- **Export to PDF**: Print-ready PDF export functionality
- **Status Tracking**: Draft, Sent, Paid, Overdue status management

### 📊 Dashboard Integration
- **New Invoice Tab**: Added to your existing admin dashboard
- **Statistics**: Invoice count and revenue tracking in dashboard stats
- **Responsive Design**: Works on all device sizes

### 💰 Automatic Calculations
- **Real-time Totals**: Automatic calculation of subtotals, taxes, and totals
- **Number to Words**: Automatic conversion of amounts to written form
- **Multi-currency**: Support for USD and INR currencies
- **IGST Calculations**: Integrated Goods and Services Tax calculations

## Setup Instructions

### 1. Database Setup (Appwrite)

You need to create an Invoices collection in your Appwrite database:

1. **Go to your Appwrite Console**
2. **Navigate to Databases → Your Database**
3. **Create a new Collection named "invoices"**
4. **Add the following attributes exactly as shown:**

| Attribute Name | Type | Size/Options | Required | Default |
|----------------|------|--------------|----------|---------|
| `invoiceNumber` | String | 255 | ✅ | - |
| `invoiceDate` | Datetime | - | ✅ | - |
| `dueDate` | Datetime | - | ✅ | - |
| `contactName` | String | 255 | ✅ | - |
| `contactNumber` | String | 50 | ✅ | - |
| `clientName` | String | 255 | ✅ | - |
| `clientAddress` | String | 1000 | ✅ | - |
| `clientPhone` | String | 50 | ❌ | - |
| `clientEmail` | Email | 255 | ❌ | - |
| `subject` | String | 500 | ✅ | - |
| `itemsJson` | String | 10000 | ✅ | - |
| `subTotal` | Float | - | ✅ | 0 |
| `totalIgst` | Float | - | ✅ | 0 |
| `total` | Float | - | ✅ | 0 |
| `totalInWords` | String | 500 | ✅ | - |
| `notes` | String | 1000 | ❌ | - |
| `paymentMethod` | String | 100 | ❌ | Wire transfer |
| `bankDetailsJson` | String | 2000 | ❌ | - |
| `currency` | String | 10 | ✅ | USD |
| `status` | Enum | draft,sent,paid,overdue | ✅ | draft |

**Important Notes:**
- Use exact attribute names (case-sensitive)
- For Enum type (status), add these exact values: `draft`, `sent`, `paid`, `overdue`
- The `itemsJson` and `bankDetailsJson` fields store complex data as JSON strings
- Appwrite automatically adds `$id`, `$createdAt`, and `$updatedAt` fields

### 2. Environment Variables

Update your `.env.local` file with the new collection ID:

```env
NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID=YOUR_ACTUAL_COLLECTION_ID
```

Replace `YOUR_ACTUAL_COLLECTION_ID` with the actual collection ID from Appwrite.

### 3. Install Dependencies

Install the required dependencies:

```bash
npm install @radix-ui/react-select
```

## File Structure

The invoice system includes these new files:

```
types/
  invoice.ts                    # TypeScript interfaces and types

components/
  invoice/
    invoice-form.tsx           # Invoice creation/editing form
    invoice-preview.tsx        # Invoice preview component
    invoice-manager.tsx        # Main invoice management component
  ui/
    select.tsx                 # Select dropdown component
    badge.tsx                  # Badge component for status

lib/
  invoice-utils.ts             # Utility functions for calculations
  pdf-export.ts               # PDF export functionality
```

## Usage

### Creating an Invoice

1. **Navigate to the Invoices tab** in your admin dashboard
2. **Click "Create Invoice"**
3. **Fill in the form:**
   - Invoice details (number, dates, contact info)
   - Client information
   - Invoice items with descriptions, quantities, rates
   - Notes and payment information
4. **Save the invoice**

### Managing Invoices

- **View**: Click on any invoice row to see the full preview
- **Edit**: Click the edit icon to modify an invoice
- **Export**: Click the download icon to export as PDF
- **Delete**: Click the trash icon to delete an invoice

### Invoice Status

- **Draft**: Invoice is being prepared
- **Sent**: Invoice has been sent to client
- **Paid**: Payment has been received
- **Overdue**: Invoice is past due date

## Customization

### Company Information

The company details are defined in `types/invoice.ts`:

```typescript
export const defaultCompanyInfo: CompanyInfo = {
  name: "AproMax Engineering LLP",
  registeredOffice: {
    address: "835, Katigorah Part - III, Katigorah, Cachar,\nAssam 788805, India",
    mobile: "+91 9101362280",
    gstin: "18ACGFA9077M1ZP",
    pan: "ACGFA9077M"
  },
  branchOffice: {
    address: "57, Idgah Rd, Hatigaon, Guwahati, Kamrup Metro,\nAssam 781038, India",
    indPhone: "+91 9577291349",
    usaPhone: "+1 (312) 313-9125",
    email: "Sufian.b@apromaxeng.com",
    website: "www.apromaxeng.com"
  }
}
```

### Bank Details

Default bank details are also in `types/invoice.ts`:

```typescript
export const defaultBankDetails: BankDetails = {
  bankName: "HDFC Bank Ltd.",
  accountName: "APROMAX ENGINEERING LLP",
  accountNumber: "50200104107160",
  branchName: "Hatigaon",
  ifscCode: "HDFC0005671",
  swiftCode: "HDFCINBB",
  bankAddress: "Near Police Station, Hatigaon, Guwahati - 781038, Assam, India."
}
```

### Logo

The system uses your logo from `public/logo.png`. Make sure this file exists and is properly sized.

## Features

### Automatic Invoice Numbering

Invoices are automatically numbered in the format: `APRO/YY-YY/MMXX`
- YY-YY: Current and next year (e.g., 25-26)
- MM: Current month
- XX: Random 2-digit number

### PDF Export

The PDF export feature:
- Opens a new window with the formatted invoice
- Automatically triggers the print dialog
- Uses the exact styling from your provided HTML template
- Includes all invoice details and company branding

### Responsive Design

The invoice system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Troubleshooting

### Common Issues

1. **Collection ID Error**: Make sure you've updated the environment variable with the correct Appwrite collection ID

2. **Missing Dependencies**: Run `npm install @radix-ui/react-select` if you see import errors

3. **Logo Not Showing**: Ensure `public/logo.png` exists and is accessible

4. **PDF Export Not Working**: Check if popups are blocked in your browser

### Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the Appwrite collection is properly configured
4. Make sure all dependencies are installed

## Next Steps

The invoice system is now ready to use! You can:
1. Create your first invoice
2. Customize the styling if needed
3. Add additional features like email sending
4. Integrate with payment gateways
5. Add more detailed reporting features

The system is designed to be extensible, so you can easily add more features as your business grows.
