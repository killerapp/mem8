# Editor-Level YAML Frontmatter and Markdown Viewer Implementation Plan

## Overview

Implement a dedicated editor page with Monaco Editor for YAML frontmatter editing and markdown preview, featuring a tabbed interface optimized for the terminal theme. The editor will provide deep-linking support via `/thought/[id]/edit` routes and maintain the existing mem8 terminal IDE aesthetic.

## Current State Analysis

**Existing Infrastructure:**
- **Terminal Theme**: Complete design system with terminal green (#00ff41), scanlines, and glow effects (`frontend/app/globals.css:152-174`)
- **Component System**: shadcn/ui components with terminal variants (`frontend/components/ui/button.tsx:21`)
- **State Management**: React Query with thought mutations ready (`frontend/hooks/useApi.ts:51-62`)
- **YAML Parsing**: Backend PyYAML processing complete (`backend/src/mem8_api/services/filesystem_thoughts.py:41-53`)

**Missing Components:**
- No markdown rendering libraries (react-markdown, remark-gfm)
- No Monaco Editor integration
- No dedicated editor routes or pages
- Missing thought card click handlers

## Desired End State

A fully functional thought editor accessible at `/thought/[id]/edit` that provides:
- **Tabbed Interface**: Toggle between YAML frontmatter editor and markdown preview
- **Monaco Editor**: YAML syntax highlighting and validation for frontmatter
- **Markdown Rendering**: Terminal-themed preview with syntax highlighting
- **Deep Linking**: Direct URLs to edit specific thoughts
- **Terminal Consistency**: Maintains mem8's terminal IDE aesthetic
- **Real-time Sync**: WebSocket integration for collaborative editing

**Verification**: Editor accessible via thought card clicks, proper routing, functional YAML editing, and markdown preview with terminal styling.

### Key Discoveries:
- Terminal theme CSS variables already defined for consistent styling (`frontend/app/globals.css:47-83`)
- React Query mutation hooks ready for editor integration (`frontend/hooks/useApi.ts:51-62`)
- Typography plugin available for markdown prose styling (`frontend/tailwind.config.ts:93`)
- WebSocket system available for real-time collaboration (`frontend/hooks/useWebSocket.ts`)
- Missing modal infrastructure - dedicated routes are the better choice

## What We're NOT Doing

- BAML integration (future phase)
- Split-pane layout (using tabbed interface instead)
- Modal/overlay editor (using dedicated routes)
- Real-time collaborative editing (Phase 1 focus on single-user editing)
- Advanced Monaco features like IntelliSense or custom languages
- Mobile-specific optimizations beyond responsive design

## Implementation Approach

**Strategy**: Build incrementally starting with dependencies and basic routing, then layer on Monaco integration, markdown rendering, and polish. Use Next.js App Router for clean URL structure and maintain terminal theme consistency throughout.

**Technical Stack**:
- **Monaco Editor**: `@monaco-editor/react` for YAML editing
- **Markdown**: `react-markdown` + `remark-gfm` + `rehype-highlight` 
- **UI**: Extend existing shadcn/ui Tab components
- **Routing**: Next.js App Router with `[id]` dynamic routes

## Phase 1: Foundation & Dependencies

### Overview
Add required dependencies and establish basic editor page structure with Next.js routing.

### Changes Required:

#### 1. Package Dependencies
**File**: `frontend/package.json`
**Changes**: Add Monaco Editor and markdown rendering libraries

```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "js-yaml": "^4.1.0"
  }
}
```

#### 2. Tab UI Components
**File**: `frontend/components/ui/tabs.tsx` (new file)
**Changes**: Create shadcn/ui tabs component with terminal styling

```typescript
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground font-mono",
      "border border-primary/20",
      className
    )}
    {...props}
  />
))

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow data-[state=active]:terminal-glow font-mono",
      className
    )}
    {...props}
  />
))

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

#### 3. Basic Editor Page Structure  
**File**: `frontend/app/thought/[id]/edit/page.tsx` (new file)
**Changes**: Create editor page with routing and basic layout

```typescript
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useThought } from '@/hooks/useApi'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function EditThoughtPage() {
  const params = useParams()
  const router = useRouter()
  const thoughtId = params.id as string
  
  const { data: thought, isLoading, error } = useThought(thoughtId)
  
  if (isLoading) return <div className="terminal-text">Loading thought...</div>
  if (error) return <div className="text-destructive">Error loading thought</div>
  if (!thought) return <div className="text-destructive">Thought not found</div>

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold terminal-glow text-primary font-mono">
            Edit: {thought.title}
          </h1>
        </div>

        {/* Editor Tabs */}
        <Tabs defaultValue="frontmatter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="frontmatter">YAML Frontmatter</TabsTrigger>
            <TabsTrigger value="preview">Markdown Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frontmatter" className="space-y-4">
            <div className="h-96 border border-primary/20 rounded-lg">
              {/* Monaco Editor will go here in Phase 3 */}
              <div className="p-4 font-mono text-sm">
                Monaco Editor Placeholder
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="h-96 border border-primary/20 rounded-lg p-4">
              {/* Markdown preview will go here in Phase 4 */}
              <div className="font-mono text-sm">
                Markdown Preview Placeholder
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

### Success Criteria:

#### Automated Verification:
- [x] Dependencies install successfully: `npm install`
- [x] TypeScript compilation passes: `npm run build`
- [x] No linting errors: `npm run lint` (pre-existing errors only)
- [x] Editor page accessible at `/thought/[id]/edit`
- [x] Tabs component renders without errors

#### Manual Verification:
- [x] Navigate to editor page via URL shows loading state then content
- [x] Tab switching works between frontmatter and preview
- [x] Back button returns to previous page
- [x] Terminal theme styling consistent with rest of application
- [x] Page responsive on different screen sizes

---

## Phase 2: Basic Editor Page

### Overview
Implement the editor page layout, routing integration, and click handlers to navigate from thought cards to the editor.

### Changes Required:

#### 1. Thought Card Click Handlers
**File**: `frontend/app/page.tsx`
**Changes**: Add onClick handlers to thought cards for navigation

```typescript
// Add useRouter import at top
import { useRouter } from 'next/navigation'

// Add router in component
const router = useRouter()

// Modify thought card rendering (around line 508-559)
<div 
  key={`${thought.id}-${index}`} 
  className="memory-cell p-4 rounded-lg cursor-pointer hover:scale-[1.02] transition-all"
  onClick={() => router.push(`/thought/${thought.id}/edit`)}
>
  {/* existing card content */}
</div>
```

#### 2. Enhanced Editor Layout
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Add proper loading states, error handling, and save functionality

```typescript
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useThought, useUpdateThought } from '@/hooks/useApi'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { parseYamlMetadata } from '@/lib/content-types'

export default function EditThoughtPage() {
  const params = useParams()
  const router = useRouter()
  const thoughtId = params.id as string
  
  const { data: thought, isLoading, error } = useThought(thoughtId)
  const updateThought = useUpdateThought()
  
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  
  // Initialize content when thought loads
  React.useEffect(() => {
    if (thought) {
      setContent(thought.content)
    }
  }, [thought])

  const handleSave = async () => {
    if (!thought || !hasChanges) return
    
    try {
      await updateThought.mutateAsync({
        id: thought.id,
        content
      })
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save thought:', error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="terminal-text animate-pulse">
            Loading thought editor...
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !thought) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-destructive font-mono">
            {error ? 'Error loading thought' : 'Thought not found'}
          </div>
        </div>
      </div>
    )
  }

  // Extract frontmatter and content
  const metadata = parseYamlMetadata(content)
  const yamlEnd = content.indexOf('---', content.indexOf('---') + 3)
  const frontmatter = yamlEnd > 0 ? content.substring(0, yamlEnd + 3) : '---\n---'
  const markdownContent = yamlEnd > 0 ? content.substring(yamlEnd + 3).trim() : content

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold terminal-glow text-primary font-mono">
              {thought.title}
            </h1>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateThought.isPending}
            className="font-mono"
            variant="terminal"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateThought.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>

        {/* Editor */}
        <div className="memory-cell rounded-lg p-6">
          <Tabs defaultValue="frontmatter" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="frontmatter">YAML Frontmatter</TabsTrigger>
              <TabsTrigger value="preview">Markdown Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frontmatter" className="space-y-4">
              <div className="h-96 border border-primary/20 rounded-lg bg-card">
                <div className="p-4 font-mono text-sm text-muted-foreground">
                  Monaco YAML Editor (Phase 3)
                  <br />
                  Content: {frontmatter.substring(0, 100)}...
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="h-96 border border-primary/20 rounded-lg bg-card p-4 overflow-auto">
                <div className="font-mono text-sm text-muted-foreground">
                  Markdown Preview (Phase 4)
                  <br />
                  Content: {markdownContent.substring(0, 200)}...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
```

#### 3. API Hook Enhancement
**File**: `frontend/hooks/useApi.ts`
**Changes**: Ensure individual thought fetching hook is available

```typescript
// Add this hook if it doesn't exist
export function useThought(id: string) {
  return useQuery({
    queryKey: ['thought', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/thoughts/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch thought')
      return response.json()
    },
    enabled: !!id,
  })
}
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compilation passes: `npm run build`
- [x] No console errors when navigating to editor
- [x] Routing works: clicking thought card navigates to `/thought/[id]/edit`
- [x] useThought API hook fetches data correctly

#### Manual Verification:
- [x] Click on thought card opens editor page
- [x] Editor page shows thought title and content preview
- [x] Tab switching works between frontmatter and preview tabs
- [x] Save button state reflects changes and loading
- [x] Back button returns to previous page
- [x] Loading and error states display appropriately
- [x] Terminal theme styling maintained throughout

---

## Phase 3: YAML Editor Integration

### Overview
Integrate Monaco Editor for YAML frontmatter editing with terminal theme customization and real-time validation.

### Changes Required:

#### 1. Monaco YAML Editor Component
**File**: `frontend/components/editor/YamlEditor.tsx` (new file)
**Changes**: Create Monaco-based YAML editor with terminal theme

```typescript
'use client'

import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface YamlEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
}

export function YamlEditor({ 
  value, 
  onChange, 
  height = '384px', 
  readOnly = false 
}: YamlEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor
  }

  function handleEditorChange(value: string | undefined) {
    onChange(value || '')
  }

  // Configure Monaco with terminal theme
  useEffect(() => {
    import('monaco-editor').then((monaco) => {
      // Define terminal theme
      monaco.editor.defineTheme('terminal', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'string.yaml', foreground: '00ff41' },
          { token: 'number.yaml', foreground: '00ffff' },
          { token: 'key.yaml', foreground: 'ffb700' },
          { token: 'comment.yaml', foreground: '666666' },
        ],
        colors: {
          'editor.background': '#0a0e27',
          'editor.foreground': '#00ff41',
          'editorCursor.foreground': '#00ff41',
          'editor.lineHighlightBackground': '#1a1e37',
          'editorLineNumber.foreground': '#666666',
          'editorLineNumber.activeForeground': '#00ff41',
          'editor.selectionBackground': '#00ff4133',
          'editor.selectionHighlightBackground': '#00ff4122',
        }
      })
    })
  }, [])

  return (
    <div className="border border-primary/20 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language="yaml"
        theme="terminal"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: 'var(--font-mono), Consolas, Monaco, monospace',
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
          },
        }}
      />
    </div>
  )
}
```

#### 2. YAML Parsing Utilities
**File**: `frontend/lib/yaml-utils.ts` (new file)
**Changes**: Add proper YAML parsing and content separation

```typescript
import yaml from 'js-yaml'

export interface ParsedContent {
  frontmatter: string
  content: string
  metadata: Record<string, any>
}

export function parseContent(rawContent: string): ParsedContent {
  const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/s)
  
  if (!frontmatterMatch) {
    return {
      frontmatter: '---\n---',
      content: rawContent,
      metadata: {}
    }
  }

  const [, frontmatterStr, content] = frontmatterMatch
  let metadata: Record<string, any> = {}
  
  try {
    metadata = yaml.load(frontmatterStr) as Record<string, any> || {}
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error)
  }

  return {
    frontmatter: `---\n${frontmatterStr}\n---`,
    content: content.trim(),
    metadata
  }
}

export function combineContent(frontmatter: string, content: string): string {
  // Remove existing --- markers from frontmatter if present
  const cleanFrontmatter = frontmatter.replace(/^---\n?/, '').replace(/\n?---$/, '')
  
  return `---\n${cleanFrontmatter}\n---\n\n${content}`
}

export function validateYaml(yamlString: string): { isValid: boolean; error?: string } {
  try {
    yaml.load(yamlString)
    return { isValid: true }
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid YAML'
    }
  }
}
```

#### 3. Enhanced Editor Page with Monaco Integration
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Replace placeholder with actual Monaco YAML editor

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useThought, useUpdateThought } from '@/hooks/useApi'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { YamlEditor } from '@/components/editor/YamlEditor'
import { parseContent, combineContent, validateYaml } from '@/lib/yaml-utils'

export default function EditThoughtPage() {
  const params = useParams()
  const router = useRouter()
  const thoughtId = params.id as string
  
  const { data: thought, isLoading, error } = useThought(thoughtId)
  const updateThought = useUpdateThought()
  
  const [frontmatter, setFrontmatter] = useState('')
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [yamlError, setYamlError] = useState<string | null>(null)
  
  // Initialize content when thought loads
  useEffect(() => {
    if (thought) {
      const parsed = parseContent(thought.content)
      setFrontmatter(parsed.frontmatter.replace(/^---\n/, '').replace(/\n---$/, ''))
      setContent(parsed.content)
    }
  }, [thought])

  const handleFrontmatterChange = (value: string) => {
    setFrontmatter(value)
    setHasChanges(true)
    
    // Validate YAML
    const validation = validateYaml(value)
    setYamlError(validation.isValid ? null : validation.error!)
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!thought || !hasChanges || yamlError) return
    
    try {
      const combinedContent = combineContent(frontmatter, content)
      await updateThought.mutateAsync({
        id: thought.id,
        content: combinedContent
      })
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save thought:', error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="terminal-text animate-pulse">
            <span className="terminal-glow">></span> Loading thought editor...
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !thought) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-destructive font-mono">
            <span className="terminal-glow">></span> {error ? 'Error loading thought' : 'Thought not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold terminal-glow text-primary font-mono">
              {thought.title}
            </h1>
            {hasChanges && <Badge variant="syncing">Unsaved</Badge>}
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateThought.isPending || !!yamlError}
            className="font-mono"
            variant="terminal"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateThought.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>

        {/* YAML Error Alert */}
        {yamlError && (
          <div className="mb-4 p-3 border border-destructive/20 bg-destructive/10 rounded-lg">
            <div className="flex items-center gap-2 text-destructive font-mono text-sm">
              <AlertCircle className="w-4 h-4" />
              YAML Syntax Error: {yamlError}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="memory-cell rounded-lg p-6">
          <Tabs defaultValue="frontmatter" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="frontmatter">
                YAML Frontmatter
                {yamlError && <AlertCircle className="w-3 h-3 ml-2 text-destructive" />}
              </TabsTrigger>
              <TabsTrigger value="preview">Markdown Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frontmatter" className="space-y-4">
              <YamlEditor
                value={frontmatter}
                onChange={handleFrontmatterChange}
                height="500px"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="h-96 border border-primary/20 rounded-lg bg-card p-4 overflow-auto">
                <div className="font-mono text-sm text-muted-foreground">
                  Markdown Preview (Phase 4)
                  <br />
                  Content: {content.substring(0, 200)}...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
```

### Success Criteria:

#### Automated Verification:
- [x] Monaco Editor loads without errors: `npm run dev`
- [x] YAML syntax validation works correctly
- [x] TypeScript compilation passes: `npm run build`
- [x] No console errors in YAML editor tab
- [x] Terminal theme applies to Monaco editor

#### Manual Verification:
- [x] YAML frontmatter displays in Monaco editor with syntax highlighting
- [x] Editor uses terminal color scheme (green, cyan, amber)
- [x] YAML validation shows errors in real-time
- [x] Saving combines frontmatter and content correctly
- [x] Terminal glow effects visible on editor interface
- [x] Keyboard shortcuts work in Monaco editor
- [x] Editor auto-resizes with window

---

## Phase 4: Markdown Preview & Rendering

### Overview
Implement terminal-themed markdown preview with syntax highlighting and proper prose styling.

### Changes Required:

#### 1. Markdown Renderer Component
**File**: `frontend/components/editor/MarkdownRenderer.tsx` (new file)
**Changes**: Create terminal-themed markdown preview component

```typescript
'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div 
      className={cn(
        // Base prose styling
        "prose prose-invert max-w-none font-mono text-sm",
        // Terminal color customizations
        "prose-headings:text-primary prose-headings:terminal-glow prose-headings:font-mono",
        "prose-strong:text-primary prose-strong:terminal-glow",
        "prose-code:bg-muted prose-code:text-accent prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono",
        "prose-pre:bg-card prose-pre:border prose-pre:border-primary/20 prose-pre:shadow-lg",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
        "prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground",
        "prose-table:border-primary/20 prose-th:border-primary/20 prose-td:border-primary/20",
        "prose-th:bg-muted prose-th:text-primary prose-th:font-mono",
        // Custom terminal effects
        "[&_h1]:text-xl [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-primary/20 [&_h1]:pb-2",
        "[&_h2]:text-lg [&_h2]:mb-3 [&_h2]:text-primary",
        "[&_h3]:text-base [&_h3]:mb-2 [&_h3]:text-accent",
        "[&_p]:mb-4 [&_p]:leading-relaxed",
        "[&_code]:before:content-none [&_code]:after:content-none",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom components for terminal styling
          h1: ({ children }) => (
            <h1 className="terminal-glow text-primary font-mono border-b border-primary/20 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="terminal-glow text-primary font-mono">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-accent font-mono">
              {children}
            </h3>
          ),
          code: ({ inline, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-muted text-accent px-1 py-0.5 rounded font-mono text-xs" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className="font-mono text-sm" {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children, ...props }) => (
            <pre className="bg-card border border-primary/20 p-4 rounded-lg overflow-x-auto" {...props}>
              {children}
            </pre>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground" {...props}>
              {children}
            </blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-accent hover:text-accent/80 underline transition-colors" 
              {...props}
            >
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-primary/20 w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-primary/20 bg-muted px-3 py-2 text-left font-mono text-primary" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-primary/20 px-3 py-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

#### 2. Syntax Highlighting Theme
**File**: `frontend/app/globals.css`
**Changes**: Add highlight.js terminal theme for code blocks

```css
/* Add after existing styles, around line 200+ */

/* Terminal-themed syntax highlighting */
.hljs {
  background: hsl(var(--card)) !important;
  color: hsl(var(--foreground)) !important;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-title {
  color: hsl(var(--primary)) !important;
  text-shadow: 0 0 3px hsl(var(--primary) / 0.5);
}

.hljs-string,
.hljs-attr,
.hljs-template-variable {
  color: hsl(var(--accent)) !important;
}

.hljs-number,
.hljs-literal {
  color: hsl(var(--secondary)) !important;
}

.hljs-comment {
  color: hsl(var(--muted-foreground)) !important;
  font-style: italic;
}

.hljs-meta {
  color: hsl(var(--primary) / 0.7) !important;
}

.hljs-function,
.hljs-class {
  color: hsl(var(--accent)) !important;
}

.hljs-variable {
  color: hsl(var(--foreground)) !important;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
  color: hsl(var(--primary)) !important;
}
```

#### 3. Complete Editor Integration
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Replace markdown preview placeholder with actual renderer

```typescript
// Add import
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'

// Replace the preview TabsContent with:
<TabsContent value="preview" className="space-y-4">
  <div className="border border-primary/20 rounded-lg bg-card overflow-hidden">
    <div className="h-96 overflow-auto p-6">
      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <div className="text-muted-foreground font-mono text-sm italic">
          No markdown content to preview
        </div>
      )}
    </div>
  </div>
</TabsContent>
```

#### 4. Content Editor Tab
**File**: `frontend/components/editor/ContentEditor.tsx` (new file)
**Changes**: Add markdown content editing with Monaco

```typescript
'use client'

import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
}

export function ContentEditor({ 
  value, 
  onChange, 
  height = '384px', 
  readOnly = false 
}: ContentEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor
  }

  function handleEditorChange(value: string | undefined) {
    onChange(value || '')
  }

  return (
    <div className="border border-primary/20 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language="markdown"
        theme="terminal"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: 'var(--font-mono), Consolas, Monaco, monospace',
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
          },
        }}
      />
    </div>
  )
}
```

#### 5. Three-Tab Editor Layout
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Add content editing tab between frontmatter and preview

```typescript
// Update imports
import { ContentEditor } from '@/components/editor/ContentEditor'

// Update Tabs structure to have 3 tabs
<TabsList className="grid w-full grid-cols-3 mb-4">
  <TabsTrigger value="frontmatter">
    YAML Frontmatter
    {yamlError && <AlertCircle className="w-3 h-3 ml-2 text-destructive" />}
  </TabsTrigger>
  <TabsTrigger value="content">Markdown Content</TabsTrigger>
  <TabsTrigger value="preview">Preview</TabsTrigger>
</TabsList>

// Add content editing tab
<TabsContent value="content" className="space-y-4">
  <ContentEditor
    value={content}
    onChange={handleContentChange}
    height="500px"
  />
</TabsContent>
```

### Success Criteria:

#### Automated Verification:
- [x] Markdown renders without errors: `npm run dev`
- [x] Syntax highlighting loads for code blocks
- [x] TypeScript compilation passes: `npm run build`
- [x] No console errors in preview tab
- [x] Prose styles apply correctly to rendered markdown

#### Manual Verification:
- [x] Markdown content renders with terminal theme colors
- [x] Code blocks have syntax highlighting with terminal colors
- [x] Headings display with terminal glow effects
- [x] Links, tables, and other elements styled consistently
- [x] Preview updates when content changes
- [x] Scrolling works properly in preview pane
- [x] All markdown features render correctly (GFM support)

---

## Phase 5: Navigation & Polish

### Overview
Add final polish including keyboard shortcuts, auto-save, improved error handling, and responsive design optimizations.

### Changes Required:

#### 1. Keyboard Shortcuts
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Add Ctrl+S save shortcut and Escape to go back

```typescript
// Add keyboard shortcut handling
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    
    // Escape to go back
    if (e.key === 'Escape') {
      router.back()
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [handleSave, router])
```

#### 2. Auto-save Feature
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Add auto-save with debouncing

```typescript
// Add auto-save with debouncing
useEffect(() => {
  if (!hasChanges || yamlError) return
  
  const autoSaveTimer = setTimeout(() => {
    handleSave()
  }, 30000) // Auto-save after 30 seconds of inactivity
  
  return () => clearTimeout(autoSaveTimer)
}, [frontmatter, content, hasChanges, yamlError])
```

#### 3. Improved Error Handling
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Add toast notifications and better error messages

```typescript
// Add error state and success feedback
const [saveError, setSaveError] = useState<string | null>(null)
const [showSaveSuccess, setShowSaveSuccess] = useState(false)

const handleSave = async () => {
  if (!thought || !hasChanges || yamlError) return
  
  try {
    setSaveError(null)
    const combinedContent = combineContent(frontmatter, content)
    await updateThought.mutateAsync({
      id: thought.id,
      content: combinedContent
    })
    setHasChanges(false)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  } catch (error) {
    setSaveError(error instanceof Error ? error.message : 'Failed to save thought')
  }
}

// Add success/error indicators to header
{showSaveSuccess && <Badge variant="active">Saved!</Badge>}
{saveError && <Badge variant="error">Save failed</Badge>}
```

#### 4. Responsive Design Improvements
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Improve mobile responsiveness

```typescript
// Update container and layout classes
<div className="min-h-screen bg-background bg-grid">
  <div className="max-w-7xl mx-auto p-4 md:p-6">
    {/* Header with responsive flex */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="font-mono flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-lg md:text-xl font-bold terminal-glow text-primary font-mono truncate">
          {thought.title}
        </h1>
        <div className="flex items-center gap-2">
          {hasChanges && <Badge variant="syncing">Unsaved</Badge>}
          {showSaveSuccess && <Badge variant="active">Saved!</Badge>}
          {saveError && <Badge variant="error">Error</Badge>}
        </div>
      </div>
      
      <Button
        onClick={handleSave}
        disabled={!hasChanges || updateThought.isPending || !!yamlError}
        className="font-mono w-full sm:w-auto"
        variant="terminal"
      >
        <Save className="w-4 h-4 mr-2" />
        {updateThought.isPending ? 'Saving...' : 'Save'}
      </Button>
    </div>

    {/* Responsive editor height */}
    <div className="memory-cell rounded-lg p-4 md:p-6">
      <Tabs defaultValue="frontmatter" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          {/* Responsive tab text */}
          <TabsTrigger value="frontmatter" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">YAML Frontmatter</span>
            <span className="sm:hidden">YAML</span>
            {yamlError && <AlertCircle className="w-3 h-3 ml-1 sm:ml-2 text-destructive" />}
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Markdown Content</span>
            <span className="sm:hidden">Content</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
        </TabsList>
        
        {/* Dynamic height based on screen size */}
        <TabsContent value="frontmatter" className="space-y-4">
          <YamlEditor
            value={frontmatter}
            onChange={handleFrontmatterChange}
            height="calc(100vh - 300px)"
          />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <ContentEditor
            value={content}
            onChange={handleContentChange}
            height="calc(100vh - 300px)"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <div className="border border-primary/20 rounded-lg bg-card overflow-hidden">
            <div className="overflow-auto p-4 md:p-6" style={{ height: 'calc(100vh - 300px)' }}>
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="text-muted-foreground font-mono text-sm italic">
                  No markdown content to preview
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</div>
```

#### 5. Loading States and Transitions
**File**: `frontend/app/thought/[id]/edit/page.tsx`
**Changes**: Improve loading states and add smooth transitions

```typescript
// Enhanced loading component
if (isLoading) {
  return (
    <div className="min-h-screen bg-background bg-grid p-6">
      <div className="max-w-7xl mx-auto">
        <div className="memory-cell rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
          <div className="terminal-text animate-pulse mt-4 text-center">
            <span className="terminal-glow">></span> Loading thought editor...
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compilation passes: `npm run build`
- [ ] No console errors during editor usage
- [ ] Auto-save functionality works after 30 seconds
- [ ] Keyboard shortcuts work correctly (Ctrl+S, Escape)
- [ ] Responsive design works on mobile devices

#### Manual Verification:
- [ ] Ctrl+S saves the thought successfully
- [ ] Escape key navigates back to previous page
- [ ] Auto-save triggers after period of inactivity
- [ ] Error messages display clearly when save fails
- [ ] Success indicator shows when save completes
- [ ] Editor is responsive and usable on mobile devices
- [ ] Loading states are smooth and informative
- [ ] Tab switching works smoothly with no visual glitches
- [ ] All terminal theme elements maintain consistency

---

## Testing Strategy

### Unit Tests:
- YAML parsing and validation functions (`parseContent`, `validateYaml`)
- Content combination logic (`combineContent`)
- Monaco Editor configuration and theme application
- Markdown rendering with custom components

### Integration Tests:
- Full editor workflow: load → edit → save → reload
- Tab switching between frontmatter, content, and preview
- Real-time YAML validation and error display
- Auto-save and manual save operations
- Navigation between thought list and editor

### Manual Testing Steps:
1. Navigate to a thought from the main dashboard by clicking a thought card
2. Verify editor loads with proper YAML frontmatter and content separation
3. Edit YAML frontmatter and verify real-time validation
4. Switch to content tab and edit markdown content
5. Switch to preview tab and verify markdown renders with terminal theme
6. Test save functionality (manual save button and Ctrl+S)
7. Test auto-save by waiting 30 seconds after making changes
8. Test error handling by introducing YAML syntax errors
9. Test responsive design on various screen sizes
10. Test keyboard navigation and shortcuts

## Performance Considerations

**Monaco Editor Loading**: Monaco Editor is a large library (~2MB). Consider:
- Code splitting to load Monaco only on editor pages
- Using Monaco's CDN version for better caching
- Implementing loading states during Monaco initialization

**Markdown Rendering**: For large documents:
- Consider virtualization for very long content
- Debounce preview updates to avoid excessive re-rendering
- Use React.memo for MarkdownRenderer component

**Auto-save Optimization**: 
- Implement debouncing to prevent excessive API calls
- Use optimistic updates for better perceived performance
- Consider local storage backup for unsaved changes

## Migration Notes

**Existing Data**: No migration required as we're working with existing thought content structure.

**URL Structure**: New routes at `/thought/[id]/edit` will not conflict with existing routes.

**Browser Compatibility**: Monaco Editor requires modern browsers. Consider graceful fallback for older browsers.

## References

- Original research: `thoughts/shared/research/2025-09-04_22-38-26_editor-level-yaml-frontmatter-markdown-viewer.md`
- Current thought display: `frontend/app/page.tsx:508-559`
- Existing API hooks: `frontend/hooks/useApi.ts:51-62`
- Terminal theme implementation: `frontend/app/globals.css:152-174`
- Component patterns: `frontend/components/MetadataPanel.tsx`