'use client'

import { useState } from 'react'
import { MarkdownEditor } from '@/components/admin/markdown-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestMarkdownPage() {
  const [content, setContent] = useState('')
  
  // Sample HTML content that would come from a rich text editor
  const sampleHtmlContent = `<p>In today's world, where environmental sustainability has become a critical concern, companies across industries are seeking innovative solutions to reduce energy consumption while maintaining operational efficiency. One technology leading this transformation is power electronics, a crucial field that enables businesses to create smarter and more energy-efficient systems.</p>

<p><strong>At Apromax Engineering LLP</strong>, we are at the forefront of developing advanced power electronics solutions that help companies reduce their carbon footprint and achieve their sustainability goals. Why Power Electronics Matters for Sustainability <em>Power electronics</em> is the technology that efficiently manages and converts electrical energy, making it essential for energy storage solutions and portable electronics.</p>

<h2>Key Applications in Power Electronics for Sustainability</h2>

<ul>
<li>Smart Power Management systems</li>
<li>Efficient power management in automotive applications</li>
<li>Renewable energy systems with minimal energy losses</li>
<li>Battery management systems for optimal performance</li>
</ul>

<p>We work closely with clients to integrate these technologies into their products and systems, helping them align with global sustainability goals and support their bottom line.</p>`

  const loadSampleContent = () => {
    setContent(sampleHtmlContent)
  }

  const clearContent = () => {
    setContent('')
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Markdown Editor Test</h1>
        <div className="space-x-2">
          <Button onClick={loadSampleContent} variant="outline">
            Load Sample HTML Content
          </Button>
          <Button onClick={clearContent} variant="outline">
            Clear Content
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Raw Content (What's stored in database)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {content || 'No content loaded'}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Markdown Editor (User-friendly editing)</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Start typing or load sample content..."
              label=""
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Problem Solved</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• HTML content is automatically converted to clean Markdown for editing</li>
              <li>• Users see readable text instead of HTML tags like &lt;p&gt;, &lt;strong&gt;, etc.</li>
              <li>• The editor provides a user-friendly interface with live preview</li>
              <li>• Content is saved as the format you provide (HTML or Markdown)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🔄 Conversion Features</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Headings: &lt;h1&gt; → # Heading</li>
              <li>• Bold text: &lt;strong&gt; → **bold**</li>
              <li>• Italic text: &lt;em&gt; → *italic*</li>
              <li>• Lists: &lt;ul&gt;&lt;li&gt; → - item</li>
              <li>• Links: &lt;a href=""&gt; → [text](url)</li>
              <li>• Paragraphs: &lt;p&gt; → clean line breaks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
