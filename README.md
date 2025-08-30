# AI-Mem - AI Memory Management System

A comprehensive AI-assisted development toolkit with a beautiful terminal-style web interface for managing shared thoughts, team collaboration, and Claude Code configurations.

![AI-Mem Terminal Interface](docs/images/ai-mem-terminal.png)

## 🎯 Overview

AI-Mem provides both web-based and template-based tools for:
- **🌐 Web Terminal Interface** - Beautiful retro terminal UI for managing thoughts and teams
- **🔐 GitHub OAuth Authentication** - Secure login with user avatars and session management
- **👥 Team Collaboration** - Real-time synchronization of shared thoughts and knowledge
- **📝 Structured Knowledge** - Organized thoughts with search, tags, and metadata
- **⚙️ Claude Code Integration** - Templates for `.claude` configurations with agents and commands
- **🔄 Git Synchronization** - Automatic sync with version control workflows

## ✨ Features

### 🖥️ Web Interface
- **Terminal Aesthetic** - Retro green-on-black terminal design with Windows 11 emoji support
- **Real-time Updates** - WebSocket integration for live collaboration
- **Search & Filter** - Full-text and semantic search across all thoughts
- **User Management** - GitHub OAuth with avatar display and logout functionality
- **Responsive Design** - Works seamlessly across devices

### 🔒 Authentication & Security
- **GitHub OAuth 2.0** - Secure authentication with personal access tokens
- **JWT Tokens** - Stateless authentication with automatic expiration
- **Session Management** - Persistent login state with cross-tab synchronization
- **Protected Endpoints** - API security with user-scoped data access

### 📊 Team Collaboration
- **Team Status Dashboard** - Real-time view of active teams and members
- **Shared Thoughts** - Collaborative knowledge base with version tracking
- **Export Functionality** - Data export for backup and migration
- **Sync Status** - Visual indicators for synchronization state

## 🚀 Quick Start

### Development Setup
```bash
# Clone the repository
git clone https://github.com/killerapp/ai-mem.git
cd ai-mem

# Start with Docker (recommended)
docker-compose up -d

# Or see QUICKSTART.md for detailed setup
```

### Environment Configuration
```bash
# Backend (.env)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=postgresql://user:pass@localhost:5433/aimem

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Template Usage
```bash
# Install cookiecutter for templates
uv tool install cookiecutter

# Generate Claude configuration
cookiecutter claude-dot-md-template --config-file example-configs/claude-dot-md/default.yaml

# Generate thoughts repository  
cookiecutter shared-thoughts-template --config-file example-configs/shared-thoughts/default.yaml
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Redis
- **Authentication**: GitHub OAuth 2.0, JWT tokens
- **Real-time**: WebSocket connections
- **Deployment**: Docker, Docker Compose

### Project Structure
```
ai-mem/
├── frontend/                   # Next.js web interface
│   ├── app/                   # App router pages
│   │   ├── auth/             # Authentication pages
│   │   └── page.tsx          # Main terminal interface
│   ├── components/           # Reusable UI components
│   ├── hooks/               # React hooks (useAuth, useWebSocket)
│   └── lib/                 # Utilities (API client, auth manager)
├── backend/                 # FastAPI backend
│   └── src/aimem_api/      
│       ├── routers/         # API routes (auth, thoughts, teams)
│       ├── models/          # SQLAlchemy models
│       └── config.py        # Configuration management
├── claude-dot-md-template/  # Claude Code configuration template
├── shared-thoughts-template/ # Thoughts repository template
└── docs/                   # Documentation and screenshots
```

## 🎨 Terminal Interface

The web interface features a beautiful terminal aesthetic with:

- **Header Bar**: Connection status, user avatar, and logout controls
- **Sidebar**: Team status, search functionality, and quick actions  
- **Main Panel**: Command prompt simulation with recent thoughts
- **Status Bar**: Real-time system information and connection status
- **Color Scheme**: Classic green-on-black terminal with modern UI elements

### Key UI Elements
- ✅ **Connected/Disconnected** status indicators
- 👤 **User avatar** and username display  
- 🔍 **Search memories** with real-time filtering
- ⚡ **Quick actions** for new thoughts and sync operations
- 📊 **System stats** with live memory and thought counters
- 🖱️ **Interactive buttons** with terminal styling

## 📡 API Endpoints

### Authentication
- `GET /api/v1/auth/github/url` - Get GitHub OAuth URL
- `POST /api/v1/auth/github/callback` - Handle OAuth callback
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/logout` - Logout user

### Thoughts Management  
- `GET /api/v1/thoughts` - List thoughts with filtering
- `POST /api/v1/thoughts` - Create new thought
- `GET /api/v1/thoughts/{id}` - Get specific thought
- `PUT /api/v1/thoughts/{id}` - Update thought
- `DELETE /api/v1/thoughts/{id}` - Delete thought

### Teams & Collaboration
- `GET /api/v1/teams` - List user teams
- `GET /api/v1/teams/{id}/stats` - Get team statistics  
- `POST /api/v1/sync/teams/{id}` - Sync team data

## 🔧 Configuration Examples

### Basic Developer Setup
```bash
# Generate both templates with defaults
cookiecutter claude-dot-md-template --config-file example-configs/claude-dot-md/default.yaml
cookiecutter shared-thoughts-template --config-file example-configs/shared-thoughts/default.yaml
```

### Enterprise Team Setup
```bash
# Full-featured configuration with Linear and Ralph workflows
cookiecutter claude-dot-md-template --config-file example-configs/claude-dot-md/enterprise-full.yaml
cookiecutter shared-thoughts-template --config-file example-configs/shared-thoughts/team-collaboration.yaml
```

## 🔄 Workflow Integration

### Thoughts Directory Structure
```
thoughts/
├── shared/                    # Team-wide documents
│   ├── plans/                # Implementation plans
│   ├── research/             # Research documents  
│   ├── tickets/              # Linear tickets (ENG-XXXX.md)
│   ├── prs/                  # PR descriptions
│   └── decisions/            # Technical decisions
├── {username}/               # Personal thoughts
│   ├── tickets/              # Personal ticket copies
│   ├── notes/               # Personal notes
│   └── archive/             # Archived thoughts
└── searchable/              # Unified search (auto-generated)
```

### Claude Code Integration
The system integrates seamlessly with Claude Code through:
- **Agent Definitions** - Pre-configured AI agents for development tasks
- **Command Workflows** - Automated task execution and planning
- **Memory Persistence** - Structured knowledge retention across sessions
- **Context Sharing** - Team-wide context and decision history

## 📋 Requirements

### System Requirements
- **Node.js 18+** - For frontend development
- **Python 3.11+** - For backend services
- **PostgreSQL 13+** - Primary database
- **Redis 6+** - Session and caching (optional)
- **Docker** - For containerized deployment (recommended)

### Development Tools
- **uv** - Python package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **cookiecutter** - Template engine (`uv tool install cookiecutter`)
- **git** - Version control for sync features

## 🚧 Roadmap

- [x] ✅ Web terminal interface with authentication
- [x] ✅ GitHub OAuth integration 
- [x] ✅ Real-time team collaboration
- [x] ✅ Docker development environment
- [ ] 🔄 Claude.md constructs integration (in progress)
- [ ] 🔄 Advanced search with semantic embeddings
- [ ] 🔄 Mobile-responsive terminal interface
- [ ] 🔄 Plugin system for custom integrations
- [ ] 🔄 Self-hosted deployment guides
- [ ] 🔄 Integration with more AI assistants

## 📝 License

This project is designed for AI-assisted development workflows and knowledge management.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
1. **Frontend Components** - Enhance the terminal UI experience
2. **Backend APIs** - Extend functionality and performance  
3. **Authentication** - Add more OAuth providers
4. **Templates** - Create new Claude Code configurations
5. **Documentation** - Improve setup and usage guides

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Development environment setup
- [Example Configurations](example-configs/README.md) - Pre-built configuration examples
- [Claude Template](claude-dot-md-template/README.md) - Claude Code configuration details
- [Thoughts Template](shared-thoughts-template/README.md) - Thoughts repository details

---
*Built for teams using AI-assisted development with Claude Code and modern web technologies.*