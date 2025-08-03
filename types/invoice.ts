export interface InvoiceItem {
  id: string
  description: string
  hsnSac: string
  quantity: number
  rate: number
  igstRate: number
  igstAmount: number
  amount: number
}

export interface ClientInfo {
  name: string
  address: string
  phone?: string
  email?: string
}

export interface CompanyInfo {
  name: string
  registeredOffice: {
    address: string
    mobile: string
    gstin: string
    pan: string
  }
  branchOffice: {
    address: string
    indPhone: string
    usaPhone: string
    email: string
    website: string
  }
}

export interface BankDetails {
  bankName: string
  accountName: string
  accountNumber: string
  branchName: string
  ifscCode: string
  swiftCode: string
  bankAddress: string
}

// Appwrite database structure (flattened)
export interface Invoice {
  $id?: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  contactName: string
  contactNumber: string
  // Flattened client info for Appwrite
  clientName: string
  clientAddress: string
  clientPhone?: string
  clientEmail?: string
  subject: string
  // Items stored as JSON string in Appwrite
  itemsJson: string
  subTotal: number
  totalIgst: number
  total: number
  totalInWords: string
  notes: string
  paymentMethod: string
  // Bank details stored as JSON string in Appwrite
  bankDetailsJson: string
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  $createdAt?: string
  $updatedAt?: string
}

// Interface for the UI (with nested objects)
export interface InvoiceUI {
  $id?: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  contactName: string
  contactNumber: string
  client: ClientInfo
  subject: string
  items: InvoiceItem[]
  subTotal: number
  totalIgst: number
  total: number
  totalInWords: string
  notes: string
  paymentMethod: string
  bankDetails: BankDetails
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  $createdAt?: string
  $updatedAt?: string
}

export interface InvoiceFormData extends Omit<InvoiceUI, '$id' | '$createdAt' | '$updatedAt' | 'subTotal' | 'totalIgst' | 'total' | 'totalInWords'> {
  // Form data excludes calculated fields and uses UI structure
}

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

export const defaultBankDetails: BankDetails = {
  bankName: "HDFC Bank Ltd.",
  accountName: "APROMAX ENGINEERING LLP",
  accountNumber: "50200104107160",
  branchName: "Hatigaon",
  ifscCode: "HDFC0005671",
  swiftCode: "HDFCINBB",
  bankAddress: "Near Police Station, Hatigaon, Guwahati - 781038, Assam, India."
}
