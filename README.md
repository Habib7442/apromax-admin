# Apromax Admin Panel

A beautiful, modern admin panel built with Next.js, Appwrite, and shadcn/ui. This admin panel provides a comprehensive dashboard for managing contacts, job applications, and blog posts with a stunning user interface.

## ✨ Features

- **🎨 Beautiful UI**: Modern design with gradient backgrounds, animations, and glassmorphism effects
- **📊 Dashboard Overview**: Real-time statistics and recent activity widgets
- **👥 Contact Management**: View, search, and manage contact form submissions
- **💼 Application Management**: Handle job applications with resume download functionality
- **📝 Blog Management**: Create, edit, and manage blog posts
- **🧾 Invoice Management**: Complete invoice system with PDF export (NEW!)
- **🔍 Advanced Search**: Search and filter functionality across all data tables
- **📱 Responsive Design**: Fully responsive design that works on all devices
- **🌙 Dark Mode**: Built-in dark mode support
- **🔐 Secure Authentication**: Appwrite-powered authentication system
- **⚡ Real-time Updates**: Live data updates and refresh functionality

### 🧾 Invoice Management Features

- **Professional Invoices**: Create invoices matching your company branding
- **Automatic Calculations**: Real-time totals, taxes, and number-to-words conversion
- **Multi-currency Support**: USD and INR with proper formatting
- **PDF Export**: Print-ready invoice export functionality
- **Status Tracking**: Draft, Sent, Paid, Overdue status management
- **Client Management**: Store and manage client information
- **Bank Details**: Pre-configured with your company's bank information

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Appwrite (Database, Authentication, Storage)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apromax-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Appwrite configuration:
   ```env
   NEXT_PUBLIC_APPWRITE_URL=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=your_contact_collection_id
   NEXT_PUBLIC_APPWRITE_CAREERS_COLLECTION_ID=your_careers_collection_id
   NEXT_PUBLIC_APPWRITE_BLOGS_COLLECTION_ID=your_blogs_collection_id
   NEXT_PUBLIC_APPWRITE_CAREERS_BUCKET_ID=your_careers_bucket_id
   NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID=your_blog_images_bucket_id
   NEXT_PUBLIC_APPWRITE_ADMIN_PROFILES_COLLECTION_ID=your_admin_profiles_collection_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Appwrite Setup

### Database Collections

Create the following collections in your Appwrite database:

#### Contacts Collection
- `firstName` (string)
- `lastName` (string)
- `email` (string)
- `companyname` (string)
- `service` (string)
- `message` (string, optional)

#### Careers Collection
- `name` (string)
- `email` (string)
- `position` (string)
- `experience` (integer)
- `resumeFileId` (string)

#### Blogs Collection
- `title` (string)
- `content` (string)
- `excerpt` (string)
- `published` (boolean)
- `slug` (string)
- `author_id` (string)
- `featuredImage` (string, optional)

#### Admin Profiles Collection
- `user_id` (string)
- `linkedin_url` (string, optional)

### Storage Buckets

Create the following storage buckets:
- **Careers Bucket**: For storing resume files
- **Blog Images Bucket**: For storing blog featured images

### Authentication

Set up email/password authentication in your Appwrite project and create admin users.

## 🎨 UI Components

The admin panel includes several reusable components:

- **StatsCard**: Display key metrics with trends
- **DataTable**: Advanced table with search, sort, and filter
- **PageHeader**: Consistent page headers with actions
- **LoadingSkeleton**: Beautiful loading states

## 📱 Responsive Design

The admin panel is fully responsive and works seamlessly across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security

- Environment variables for sensitive data
- Appwrite authentication and authorization
- Row Level Security (RLS) ready
- Secure API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

Built with ❤️ using Next.js and Appwrite
