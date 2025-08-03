'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Client, Databases, Account, Storage } from 'appwrite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
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
import { Eye, Download, Loader2, LogOut, Trash2, RefreshCw, Settings, Users, FileText, Mail, BarChart3, TrendingUp, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { StatsCard } from "@/components/admin/stats-card"
import { DataTable } from "@/components/admin/data-table"
import { PageHeader } from "@/components/admin/page-header"
import { MarkdownEditor } from "@/components/admin/markdown-editor"
import { ImageUpload } from "@/components/admin/image-upload"
import { InvoiceManager } from "@/components/invoice/invoice-manager"
import { Invoice, InvoiceUI, InvoiceFormData } from "@/types/invoice"
import { exportInvoiceToPDF } from "@/lib/pdf-export"
import { convertAppwriteToUI, convertUIToAppwrite, calculateInvoiceTotals, numberToWords } from "@/lib/invoice-utils"

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const databases = new Databases(client)
const account = new Account(client)
const storage = new Storage(client)

export default function AdminPanel() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contacts, setContacts] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [invoices, setInvoices] = useState<InvoiceUI[]>([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditingBlog, setIsEditingBlog] = useState(false)
  const [currentBlog, setCurrentBlog] = useState(null)
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    slug: '',
    author_id: '',
    featuredImage: ''
  })

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        try {
          const session = await account.get()
          if (session) {
            setIsAuthenticated(true)
            setCurrentUser(session)
            await fetchData()
          }
        } catch (error) {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      fetchBlogs()
      fetchInvoices()
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await account.createEmailPasswordSession(email, password)
      
      const session = await account.get()
      if (session) {
        setIsAuthenticated(true)
        setCurrentUser(session)
        await fetchData()
        toast.success("Login successful")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Authentication failed. Please check your credentials.")
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
      setIsAuthenticated(false)
      setContacts([])
      setApplications([])
      setBlogs([])
      router.push('/admin')
      toast.success("Logged out successfully")
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Error logging out")
    }
  }

  const fetchData = async () => {
    if (!isAuthenticated) return
    
    setIsRefreshing(true)
    try {
      const [contactsResponse, applicationsResponse] = await Promise.all([
        databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID || ''
        ),
        databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          process.env.NEXT_PUBLIC_APPWRITE_CAREERS_COLLECTION_ID || ''
        )
      ])

      setContacts(contactsResponse.documents)
      setApplications(applicationsResponse.documents)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error("Error fetching data")
    } finally {
      setIsRefreshing(false)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID || ''
      )
      setBlogs(response.documents)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error("Error fetching blogs")
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID || ''
      )
      // Convert Appwrite format to UI format
      const uiInvoices = response.documents.map((doc: any) => convertAppwriteToUI(doc as Invoice))
      setInvoices(uiInvoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error("Error fetching invoices")
    }
  }

  const handleCreateInvoice = async (invoiceData: InvoiceFormData) => {
    try {
      // Calculate totals first
      const totals = calculateInvoiceTotals(invoiceData.items)
      const totalInWords = numberToWords(totals.total, invoiceData.currency)

      // Convert form data to UI format with calculated totals
      const uiInvoice: InvoiceUI = {
        ...invoiceData,
        ...totals,
        totalInWords
      }

      // Convert UI format to Appwrite format
      const appwriteData = convertUIToAppwrite(uiInvoice)

      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID || '',
        'unique()',
        appwriteData
      )
      await fetchInvoices()
      return response
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  }

  const handleUpdateInvoice = async (id: string, invoiceData: InvoiceFormData) => {
    try {
      // Calculate totals first
      const totals = calculateInvoiceTotals(invoiceData.items)
      const totalInWords = numberToWords(totals.total, invoiceData.currency)

      // Convert form data to UI format with calculated totals
      const uiInvoice: InvoiceUI = {
        ...invoiceData,
        ...totals,
        totalInWords
      }

      // Convert UI format to Appwrite format
      const appwriteData = convertUIToAppwrite(uiInvoice)

      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID || '',
        id,
        appwriteData
      )
      await fetchInvoices()
      return response
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID || '',
        id
      )
      await fetchInvoices()
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  const handleExportInvoice = (invoice: InvoiceUI) => {
    exportInvoiceToPDF(invoice)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const blogData = {
        ...blogFormData,
        slug: blogFormData.slug || generateSlug(blogFormData.title),
        author_id: currentUser?.$id || '',
        featuredImage: blogFormData.featuredImage || null
      }

      if (currentBlog) {
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID || '',
          currentBlog.$id,
          blogData
        )
        toast.success("Blog updated successfully")
      } else {
        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID || '',
          'unique()',
          blogData
        )
        toast.success("Blog created successfully")
      }
      setIsEditingBlog(false)
      setCurrentBlog(null)
      setBlogFormData({
        title: '',
        content: '',
        excerpt: '',
        published: false,
        slug: '',
        author_id: currentUser?.$id || '',
        featuredImage: ''
      })
      await fetchBlogs()
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error("Error saving blog")
    }
  }

  const editBlog = (blog: any) => {
    setCurrentBlog(blog)
    setBlogFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      published: blog.published,
      slug: blog.slug,
      author_id: blog.author_id || currentUser?.$id || '',
      featuredImage: blog.featuredImage || ''
    })
    setIsEditingBlog(true)
  }

  const startNewBlog = () => {
    setIsEditingBlog(true)
    setCurrentBlog(null)
    setBlogFormData({
      title: '',
      content: '',
      excerpt: '',
      published: false,
      slug: '',
      author_id: currentUser?.$id || '',
      featuredImage: ''
    })
  }

  const handleImageUpload = async (file: File) => {
    try {
      const upload = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID || '',
        'unique()',
        file
      )

      setBlogFormData(prev => ({
        ...prev,
        featuredImage: upload.$id
      }))

      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error("Error uploading image")
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    try {
      let collectionId
      switch (deleteItem.type) {
        case 'contact':
          collectionId = process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID
          break
        case 'application':
          collectionId = process.env.NEXT_PUBLIC_APPWRITE_CAREERS_COLLECTION_ID
          break
        case 'blog':
          collectionId = process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID
          break
        default:
          return
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        collectionId || '',
        deleteItem.$id
      )

      setDeleteItem(null)
      setIsDeleteDialogOpen(false)
      await fetchData()
      if (deleteItem.type === 'blog') await fetchBlogs()
      toast.success("Record deleted successfully")
    } catch (error) {
      console.error('Error deleting record:', error)
      toast.error("Error deleting record")
    }
  }

  const confirmDelete = (item: any, type: string) => {
    setDeleteItem({ ...item, type })
    setIsDeleteDialogOpen(true)
  }

  const viewDetails = (item: any) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Portal
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Please sign in to access the admin panel
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600"
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                Welcome back, {currentUser?.name || currentUser?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isRefreshing}
                className="border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-all duration-200 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-lg">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                Contacts ({contacts.length})
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                Applications ({applications.length})
              </TabsTrigger>
              <TabsTrigger
                value="blogs"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                Blogs ({blogs.length})
              </TabsTrigger>
              <TabsTrigger
                value="invoices"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 transition-all duration-200"
              >
                <Receipt className="w-4 h-4" />
                Invoices ({invoices.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-8"
              >
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Total Contacts",
                      value: contacts.length,
                      icon: Mail,
                      description: "Contact form submissions",
                      trend: { value: 12, isPositive: true }
                    },
                    {
                      title: "Job Applications",
                      value: applications.length,
                      icon: Users,
                      description: "Career applications",
                      trend: { value: 8, isPositive: true }
                    },
                    {
                      title: "Blog Posts",
                      value: blogs.length,
                      icon: FileText,
                      description: "Published and draft posts",
                      trend: { value: 5, isPositive: true }
                    },
                    {
                      title: "Invoices",
                      value: invoices.length,
                      icon: Receipt,
                      description: "Total invoices created",
                      trend: { value: 3, isPositive: true }
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <StatsCard {...stat} />
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Recent Contacts
                      </h3>
                      <div className="space-y-3">
                        {contacts.slice(0, 5).map((contact: any, index) => (
                          <motion.div
                            key={contact.$id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                          >
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {contact.firstName} {contact.lastName}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {contact.email}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(contact.$createdAt).toLocaleDateString()}
                            </span>
                          </motion.div>
                        ))}
                        {contacts.length === 0 && (
                          <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                            No contacts yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Recent Applications
                      </h3>
                      <div className="space-y-3">
                        {applications.slice(0, 5).map((application: any, index) => (
                          <motion.div
                            key={application.$id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                          >
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {application.name}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {application.position}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(application.$createdAt).toLocaleDateString()}
                            </span>
                          </motion.div>
                        ))}
                        {applications.length === 0 && (
                          <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                            No applications yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="contacts">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DataTable
              data={contacts}
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  sortable: true,
                  render: (_, row) => (
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {row.firstName} {row.lastName}
                    </span>
                  )
                },
                {
                  key: 'email',
                  label: 'Email',
                  sortable: true
                },
                {
                  key: 'companyname',
                  label: 'Company',
                  sortable: true
                },
                {
                  key: 'service',
                  label: 'Service',
                  render: (value) => (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {value}
                    </span>
                  )
                }
              ]}
              searchPlaceholder="Search contacts..."
              onRowClick={viewDetails}
              actions={(contact) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewDetails(contact)}
                    className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-400"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(contact, 'contact')}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
                  emptyMessage="No contacts found"
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="applications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DataTable
              data={applications}
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  sortable: true,
                  render: (value) => (
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {value}
                    </span>
                  )
                },
                {
                  key: 'email',
                  label: 'Email',
                  sortable: true
                },
                {
                  key: 'position',
                  label: 'Position',
                  render: (value) => (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {value}
                    </span>
                  )
                },
                {
                  key: 'experience',
                  label: 'Experience',
                  sortable: true,
                  render: (value) => `${value} years`
                }
              ]}
              searchPlaceholder="Search applications..."
              onRowClick={viewDetails}
              actions={(application) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewDetails(application)}
                    className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-400"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_CAREERS_BUCKET_ID}/files/${application.resumeFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, '_blank')}
                    className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-400"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(application, 'application')}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
                  emptyMessage="No applications found"
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="blogs">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Blog Posts</h2>
                <Button
                  onClick={startNewBlog}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  New Blog Post
                </Button>
              </div>

{isEditingBlog ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {currentBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingBlog(false)
                          setCurrentBlog(null)
                        }}
                        className="border-slate-200 dark:border-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>

                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Title *
                          </Label>
                          <Input
                            id="title"
                            value={blogFormData.title}
                            onChange={(e) => setBlogFormData(prev => ({
                              ...prev,
                              title: e.target.value
                            }))}
                            required
                            className="border-slate-200 dark:border-slate-600"
                            placeholder="Enter blog title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Slug
                          </Label>
                          <Input
                            id="slug"
                            value={blogFormData.slug}
                            onChange={(e) => setBlogFormData(prev => ({
                              ...prev,
                              slug: e.target.value
                            }))}
                            className="border-slate-200 dark:border-slate-600"
                            placeholder="Auto-generated from title"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Excerpt *
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={blogFormData.excerpt}
                          onChange={(e) => setBlogFormData(prev => ({
                            ...prev,
                            excerpt: e.target.value
                          }))}
                          required
                          rows={3}
                          className="border-slate-200 dark:border-slate-600"
                          placeholder="Brief description of the blog post"
                        />
                      </div>

                      <MarkdownEditor
                        value={blogFormData.content}
                        onChange={(content) => setBlogFormData(prev => ({
                          ...prev,
                          content
                        }))}
                        label="Content"
                        required
                        placeholder="Write your blog content in markdown..."
                      />

                      <ImageUpload
                        onUpload={handleImageUpload}
                        currentImageId={blogFormData.featuredImage}
                        bucketId={process.env.NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID || ''}
                      />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="published"
                          checked={blogFormData.published}
                          onCheckedChange={(checked) => setBlogFormData(prev => ({
                            ...prev,
                            published: checked as boolean
                          }))}
                        />
                        <Label htmlFor="published" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Publish immediately
                        </Label>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          {currentBlog ? 'Update Blog Post' : 'Create Blog Post'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditingBlog(false)
                            setCurrentBlog(null)
                          }}
                          className="border-slate-200 dark:border-slate-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <DataTable
                  data={blogs}
                  columns={[
                    {
                      key: 'featuredImage',
                      label: 'Image',
                      render: (value, row) => (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          {value ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID}/files/${value}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                              alt={row.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'title',
                      label: 'Title',
                      sortable: true,
                      render: (value) => (
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {value}
                        </span>
                      )
                    },
                    {
                      key: 'published',
                      label: 'Status',
                      render: (value) => (
                        <span className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                          value
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        )}>
                          {value ? 'Published' : 'Draft'}
                        </span>
                      )
                    },
                    {
                      key: '$createdAt',
                      label: 'Created At',
                      sortable: true,
                      render: (value) => new Date(value).toLocaleDateString()
                    }
                  ]}
                  searchPlaceholder="Search blog posts..."
                  actions={(blog) => (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editBlog(blog)}
                        className="h-8 px-3 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-400"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(blog, 'blog')}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  emptyMessage="No blog posts found"
                />
              )}
              </motion.div>
            </TabsContent>

            <TabsContent value="invoices">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <InvoiceManager
                  invoices={invoices}
                  onCreateInvoice={handleCreateInvoice}
                  onUpdateInvoice={handleUpdateInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                  onExportInvoice={handleExportInvoice}
                  isLoading={isLoading}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* View Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Details
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                {Object.entries(selectedItem).map(([key, value]) => {
                  if (key.startsWith('$')) return null
                  return (
                    <div key={key} className="grid grid-cols-3 items-start gap-4">
                      <span className="font-medium capitalize text-slate-600 dark:text-slate-400">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="col-span-2 text-slate-900 dark:text-slate-100 break-words">
                        {value?.toString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900 dark:text-slate-100">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                This action cannot be undone. This will permanently delete the record
                {deleteItem?.type === 'application' && ' and associated resume file'}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-200 dark:border-slate-700">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
