'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, Edit, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

// Function to convert HTML to Markdown
const htmlToMarkdown = (html: string): string => {
  if (!html) return ''

  let markdown = html
    // Convert headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

    // Convert paragraphs (handle nested content)
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')

    // Convert line breaks
    .replace(/<br\s*\/?>/gi, '\n')

    // Convert bold and italic (handle nested)
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')

    // Convert links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

    // Convert blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      return content.split('\n').map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n'
    })

    // Convert lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n'
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let counter = 1
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n'
    })

    // Convert code blocks and inline code
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')

    // Convert horizontal rules
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')

    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')

    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

    // Clean up extra whitespace and normalize line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/[ \t]+$/gm, '') // Remove trailing spaces

  return markdown
}

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown...",
  className,
  label = "Content",
  required = false
}: MarkdownEditorProps) {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'live'>('live')
  const [markdownValue, setMarkdownValue] = useState('')

  // Convert HTML to Markdown when value changes
  useEffect(() => {
    if (value) {
      // Check if the content looks like HTML (contains HTML tags)
      const isHtml = /<[^>]+>/.test(value)
      if (isHtml) {
        const converted = htmlToMarkdown(value)
        setMarkdownValue(converted)
      } else {
        setMarkdownValue(value)
      }
    } else {
      setMarkdownValue('')
    }
  }, [value])

  const handleChange = (val: string | undefined) => {
    const newValue = val || ''
    setMarkdownValue(newValue)
    onChange(newValue)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <Button
            type="button"
            variant={previewMode === 'edit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('edit')}
            className="h-7 px-2 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant={previewMode === 'live' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('live')}
            className="h-7 px-2 text-xs"
          >
            <FileText className="w-3 h-3 mr-1" />
            Live
          </Button>
          <Button
            type="button"
            variant={previewMode === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('preview')}
            className="h-7 px-2 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
        <MDEditor
          value={markdownValue}
          onChange={handleChange}
          preview={previewMode}
          hideToolbar={false}
          visibleDragBar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }
          }}
          height={400}
          data-color-mode="auto"
        />
      </div>
      
      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        {value && /<[^>]+>/.test(value) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2 mb-2">
            <p className="text-blue-700 dark:text-blue-300">
              ℹ️ <strong>HTML detected:</strong> Your content has been automatically converted from HTML to Markdown for easier editing.
            </p>
          </div>
        )}
        <p>💡 <strong>Markdown Tips:</strong></p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <code># Heading 1</code> - Large heading
          </div>
          <div>
            <code>**bold text**</code> - Bold text
          </div>
          <div>
            <code>## Heading 2</code> - Medium heading
          </div>
          <div>
            <code>*italic text*</code> - Italic text
          </div>
          <div>
            <code>[link](url)</code> - Create link
          </div>
          <div>
            <code>`code`</code> - Inline code
          </div>
          <div>
            <code>![alt](image-url)</code> - Insert image
          </div>
          <div>
            <code>- item</code> - Bullet list
          </div>
        </div>
      </div>
    </div>
  )
}
