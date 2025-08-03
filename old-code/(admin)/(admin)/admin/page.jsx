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
import { Eye, Download, Loader2, LogOut, Trash2, RefreshCw } from 'lucide-react'
import { cn, slugify } from '@/lib/utils'
import { toast } from 'sonner'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import BlogEditor from './components/blog-editor'
import { ImageUpload } from './components/image-upload'

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

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
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [isEditingBlog, setIsEditingBlog] = useState(false)
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    slug: '',
    author_id: '',
    featuredImage: ''
  })
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [currentBlog, setCurrentBlog] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        try {
          const session = await account.get()
          if (session) {
            setIsAuthenticated(true)
            setCurrentUser(session)
            setBlogFormData(prev => ({
              ...prev,
              author_id: session.$id
            }))
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
  }, []) // Empty dependency array means this runs once on mount

  // Separate useEffect to handle data fetching when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      fetchBlogs()
    }
  }, [isAuthenticated])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Create email session
      await account.createEmailPasswordSession(email, password)
      
      // Verify session was created
      const session = await account.get()
      if (session) {
        setIsAuthenticated(true)
        await fetchData()
        toast("Login successful")
      }
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = "Authentication failed. Please check your credentials."
      
      if (error.type === 'user_unauthorized') {
        errorMessage = "Access denied. Please contact administrator."
      }
      
      toast("Error logging in")
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
      router.push('/admin')
      toast("Logged out successfully")
    } catch (error) {
      console.error('Logout error:', error)
        toast("Error logging out")
    }
  }

  const fetchData = async () => {
    if (!isAuthenticated) return
    
    setIsRefreshing(true)
    try {
      const [contactsResponse, applicationsResponse] = await Promise.all([
        databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID
        ),
        databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_CAREERS_COLLECTION_ID
        )
      ])

      setContacts(contactsResponse.documents)
      setApplications(applicationsResponse.documents)
    } catch (error) {
      console.error('Error fetching data:', error)
        toast("Error fetching data")
    } finally {
      setIsRefreshing(false)
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
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId,
        deleteItem.$id
      )

      setDeleteItem(null)
      setIsDeleteDialogOpen(false)
      await fetchData()
      toast("Record deleted successfully")
    } catch (error) {
      console.error('Error deleting record:', error)
      toast("Error deleting record")
    }
  }

  const generateSlug = (title) => {
    return slugify(title)
  }

  const handleBlogSubmit = async (e) => {
    e.preventDefault()
    try {
      const blogData = {
        ...blogFormData,
        slug: blogFormData.slug || generateSlug(blogFormData.title),
        author_id: currentUser.$id,
        featuredImage: blogFormData.featuredImage || null
      }

      if (currentBlog) {
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID,
          currentBlog.$id,
          blogData
        )
        toast("Blog updated successfully")
      } else {
        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID,
          'unique()',
          blogData
        )
        toast("Blog created successfully")
      }
      setIsEditingBlog(false)
      setCurrentBlog(null)
      setBlogFormData({
        title: '',
        content: '',
        excerpt: '',
        published: false,
        slug: '',
        author_id: currentUser.$id,
        featuredImage: ''
      })
      await fetchBlogs()
    } catch (error) {
      console.error('Error saving blog:', error)
      toast("Error saving blog")
    }
  }

  const editBlog = (blog) => {
    setCurrentBlog(blog)
    setBlogFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      published: blog.published,
      slug: blog.slug,
      author_id: blog.author_id || currentUser.$id,
      featuredImage: blog.featuredImage || null
    })
    setIsEditingBlog(true)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userId = (await account.get()).$id
      const profileResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_ADMIN_PROFILES_COLLECTION_ID
      )

      if (profileResponse.documents.length > 0) {
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADMIN_PROFILES_COLLECTION_ID,
          profileResponse.documents[0].$id,
          { linkedin_url: linkedinUrl }
        )
      } else {
        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_ADMIN_PROFILES_COLLECTION_ID,
          'unique()',
          { user_id: userId, linkedin_url: linkedinUrl }
        )
      }

      setIsEditingProfile(false)
      toast("Profile updated successfully")
    } catch (error) {
      console.error('Error updating profile:', error)
      toast("Error updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (item, type) => {
    setDeleteItem({ ...item, type })
    setIsDeleteDialogOpen(true)
  }

  const viewDetails = (item) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const fetchBlogs = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID
      )
      setBlogs(response.documents)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast("Error fetching blogs")
    }
  }

  const handleImageUpload = async (file) => {
    try {
      const upload = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID,
        'unique()',
        file
      )
      
      setBlogFormData(prev => ({
        ...prev,
        featuredImage: upload.$id
      }))
      
      toast("Image uploaded successfully")
    } catch (error) {
      console.error('Error uploading image:', error)
      toast("Error uploading image")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-t-4 border-t-blue-500">
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Admin Login
                </h1>
                <p className="text-center text-muted-foreground mb-6">
                  Please sign in to access the admin panel
                </p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      "w-full h-11",
                      "bg-gradient-to-r from-blue-600 to-cyan-600",
                      "hover:from-blue-700 hover:to-cyan-700",
                      "text-white font-medium",
                      "transition-all duration-200",
                      "rounded-lg"
                    )}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-10">
        <Tabs defaultValue="contacts" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="w-[400px] grid grid-cols-3">
              <TabsTrigger 
                value="contacts"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                )}
              >
                Contacts
              </TabsTrigger>
              <TabsTrigger 
                value="applications"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                )}
              >
                Applications
              </TabsTrigger>
              <TabsTrigger 
                value="blogs"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                )}
              >
                Blogs
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isRefreshing}
                className={cn(
                  "text-gray-600 hover:text-gray-900",
                  "dark:text-gray-400 dark:hover:text-gray-100"
                )}
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
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={cn(
                  "text-red-600 hover:text-red-700",
                  "dark:text-red-500 dark:hover:text-red-400"
                )}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <TabsContent value="contacts">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.$id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.companyname}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contact.service}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetails(contact)}
                            className="hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(contact, 'contact')}
                            className="hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.$id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{application.name}</TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                            {application.position}
                          </span>
                        </TableCell>
                        <TableCell>{application.experience} years</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetails(application)}
                            className="hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_CAREERS_BUCKET_ID}/files/${application.resumeFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, '_blank')}
                            className="hover:text-emerald-600"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(application, 'application')}
                            className="hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-2xl font-bold">Blog Posts</h2>
                  <Button
                    onClick={() => {
                      setIsEditingBlog(true)
                      setCurrentBlog(null)
                      setBlogFormData({
                        title: '',
                        content: '',
                        excerpt: '',
                        published: false,
                        slug: '',
                        author_id: '',
                        featuredImage: ''
                      })
                    }}
                  >
                    New Blog Post
                  </Button>
                </div>

                {isEditingBlog ? (
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={blogFormData.excerpt}
                        onChange={(e) => setBlogFormData(prev => ({
                          ...prev,
                          excerpt: e.target.value
                        }))}
                        required
                      />
                    </div>

                    <div>
                      <Label>Content</Label>
                      <BlogEditor
                        content={blogFormData.content}
                        onChange={(content) => setBlogFormData(prev => ({
                          ...prev,
                          content
                        }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="published"
                        checked={blogFormData.published}
                        onCheckedChange={(checked) => setBlogFormData(prev => ({
                          ...prev,
                          published: checked
                        }))}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>

                    <div>
                      <Label htmlFor="featuredImage">Featured Image</Label>
                      <ImageUpload
                        onUpload={handleImageUpload}
                        currentImageId={blogFormData.featuredImage}
                        bucketId={process.env.NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit">
                        {currentBlog ? 'Update' : 'Create'} Blog Post
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditingBlog(false)
                          setCurrentBlog(null)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog.$id}>
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              blog.published 
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            )}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(blog.$createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentBlog(blog)
                                setBlogFormData({
                                  title: blog.title,
                                  content: blog.content,
                                  excerpt: blog.excerpt,
                                  published: blog.published,
                                  slug: blog.slug,
                                  author_id: blog.author_id || currentUser.$id,
                                  featuredImage: blog.featuredImage || null
                                })
                                setIsEditingBlog(true)
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => confirmDelete(blog, 'blog')}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Details
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                {Object.entries(selectedItem).map(([key, value]) => {
                  if (key.startsWith('$')) return null
                  return (
                    <div key={key} className="grid grid-cols-3 items-start">
                      <span className="font-medium capitalize text-muted-foreground">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="col-span-2">{value?.toString()}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the record
                {deleteItem?.type === 'application' && ' and associated resume file'}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700"
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