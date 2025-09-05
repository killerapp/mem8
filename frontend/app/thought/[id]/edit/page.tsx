'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useFilesystemThought, useUpdateThought } from '@/hooks/useApi'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { YamlEditor } from '@/components/editor/YamlEditor'
import { ContentEditor } from '@/components/editor/ContentEditor'
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'
import { parseContent, combineContent, validateYaml } from '@/lib/yaml-utils'

export default function EditThoughtPage() {
  const params = useParams()
  const router = useRouter()
  const thoughtId = params.id as string
  
  const { data: thought, isLoading, error } = useFilesystemThought(thoughtId)
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
        thought: { content: combinedContent }
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
            <span className="terminal-glow">{'>'}</span> Loading thought editor...
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
            <span className="terminal-glow">{'>'}</span> {error ? 'Error loading thought' : 'Thought not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col">
      <div className="max-w-7xl mx-auto p-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
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
              {thought.title} • [EDITOR]
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
          <div className="mb-4 p-3 border border-destructive/20 bg-destructive/10 rounded-lg shrink-0">
            <div className="flex items-center gap-2 text-destructive font-mono text-sm">
              <AlertCircle className="w-4 h-4" />
              YAML Syntax Error: {yamlError}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="memory-cell rounded-lg p-6 flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="frontmatter" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4 shrink-0">
              <TabsTrigger value="frontmatter">
                YAML Frontmatter
                {yamlError && <AlertCircle className="w-3 h-3 ml-2 text-destructive" />}
              </TabsTrigger>
              <TabsTrigger value="content">Markdown Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frontmatter" className="flex-1 min-h-0">
              <YamlEditor
                value={frontmatter}
                onChange={handleFrontmatterChange}
                height="100%"
              />
            </TabsContent>
            
            <TabsContent value="content" className="flex-1 min-h-0">
              <ContentEditor
                value={content}
                onChange={handleContentChange}
                height="100%"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 min-h-0">
              <div className="h-full border border-primary/20 rounded-lg bg-card overflow-hidden">
                <div className="h-full overflow-auto p-6">
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
  )
}