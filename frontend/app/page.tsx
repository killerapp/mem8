"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Users, Zap, Database, Terminal } from 'lucide-react';
import Image from 'next/image';

interface ThoughtPreview {
  id: string;
  title: string;
  excerpt: string;
  path: string;
  team: string;
  lastModified: string;
  tags: string[];
}

interface TeamStatus {
  name: string;
  status: 'active' | 'syncing' | 'error';
  memberCount: number;
  thoughtCount: number;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in real app this would come from the backend API
  const recentThoughts: ThoughtPreview[] = [
    {
      id: '1',
      title: 'Phase 2 Backend Implementation',
      excerpt: 'Completed FastAPI backend with async SQLAlchemy integration...',
      path: '/thoughts/shared/projects/ai-mem-phase2.md',
      team: 'Development',
      lastModified: '2 hours ago',
      tags: ['backend', 'api', 'implementation']
    },
    {
      id: '2', 
      title: 'AgenticInsights Design System Research',
      excerpt: 'Analyzed terminal IDE aesthetic with green primary colors...',
      path: '/thoughts/shared/research/design-patterns.md',
      team: 'Design',
      lastModified: '4 hours ago',
      tags: ['design', 'research', 'ui']
    }
  ];

  const teamStatuses: TeamStatus[] = [
    {
      name: 'Development',
      status: 'active',
      memberCount: 3,
      thoughtCount: 127
    },
    {
      name: 'Design',
      status: 'syncing',
      memberCount: 2,
      thoughtCount: 89
    }
  ];

  useEffect(() => {
    // Simulate connection to backend
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Terminal Header */}
      <header className="h-8 bg-muted border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo_mark.png" 
            alt="AI-Mem" 
            width={16} 
            height={16} 
            className="opacity-70"
          />
          <span className="text-xs text-muted-foreground font-mono">
            AI-Mem Terminal v0.1.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'active' : 'syncing'} className="text-xs">
            {isConnected ? (
              <>
                <Database className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 mr-1" />
                Connecting...
              </>
            )}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside className="w-80 bg-card border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2 text-sm font-mono
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         placeholder:text-muted-foreground terminal-glow"
              />
            </div>
          </div>

          {/* Teams Status */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold mb-3 terminal-glow flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Status
            </h3>
            <div className="space-y-2">
              {teamStatuses.map((team) => (
                <div key={team.name} className="memory-cell p-3 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{team.name}</span>
                    <Badge 
                      variant={team.status === 'active' ? 'active' : team.status === 'syncing' ? 'syncing' : 'error'}
                      className="text-xs"
                    >
                      {team.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {team.memberCount} members • {team.thoughtCount} thoughts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 terminal-glow flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="terminal" className="w-full justify-start text-xs">
                <Brain className="w-4 h-4" />
                New Thought
              </Button>
              <Button variant="terminal" className="w-full justify-start text-xs">
                <Zap className="w-4 h-4" />
                Sync All
              </Button>
              <Button variant="terminal" className="w-full justify-start text-xs">
                <Database className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Dashboard */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Terminal Prompt */}
          <div className="p-4 border-b border-border bg-muted/50">
            <div className="terminal-text text-sm">
              <span className="text-primary">user@ai-mem</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-accent">~/memories</span>
              <span className="text-primary">$</span>
              <span className="ml-2">ls -la recent_thoughts</span>
              <span className="ml-2 animate-pulse">█</span>
            </div>
          </div>

          {/* Recent Thoughts */}
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 terminal-glow flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Recent Thoughts
              </h2>
              
              <div className="space-y-4">
                {recentThoughts.map((thought) => (
                  <div key={thought.id} className="memory-cell p-4 rounded-lg hover:scale-[1.02] transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-base">{thought.title}</h3>
                      <Badge variant="terminal" className="text-xs shrink-0">
                        {thought.team}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {thought.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-mono">{thought.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{thought.lastModified}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {thought.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 terminal-glow flex items-center gap-2">
                <Zap className="w-5 h-5" />
                System Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="memory-cell p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold terminal-glow text-primary">216</div>
                  <div className="text-sm text-muted-foreground">Total Thoughts</div>
                </div>
                <div className="memory-cell p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold terminal-glow text-accent">5</div>
                  <div className="text-sm text-muted-foreground">Active Teams</div>
                </div>
                <div className="memory-cell p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold terminal-glow text-secondary">98%</div>
                  <div className="text-sm text-muted-foreground">Sync Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="h-7 bg-muted border-t border-border flex items-center justify-between px-4 text-xs flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-primary">●</span>
          <span>Backend API: Connected</span>
          <span>•</span>
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Memory usage: 42MB</span>
          <span>•</span>
          <span>Thoughts indexed: 216</span>
        </div>
      </footer>
    </>
  );
}
