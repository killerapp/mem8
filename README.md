# mem8 - Claude Code Workspace Manager

A streamlined CLI tool for managing Claude Code customizations and documentation workflows. Create standardized project templates, manage thoughts/research documents, and enhance your Claude Code development experience.

## 🎯 Overview

mem8 is designed to work seamlessly with Claude Code, providing:
- **💻 Rich CLI Interface** - Manage Claude Code customizations and project templates  
- **📝 Thoughts Management** - Organize research, plans, and documentation in markdown
- **🎨 File Viewer** - Optional web interface to browse your thoughts directory
- **🏗️ Template System** - Cookiecutter templates for Claude Code configurations

## ✨ Core Features

### 💻 CLI Commands
```bash
mem8 init --template claude-config   # Initialize Claude Code workspace  
mem8 status                          # Check workspace health
mem8 search "query"                 # Search across all thoughts
```

### 📁 Template System
- **claude-dot-md-template** - Generate `.claude/[agents,commands]` configurations
- **shared-thoughts-template** - Create structured thoughts repositories
- **Cookiecutter integration** - Flexible, customizable project generation

### 🔍 Thoughts Organization
```
thoughts/
├── shared/
│   ├── research/      # Research documents
│   ├── plans/         # Implementation plans  
│   ├── prs/          # PR descriptions
│   └── decisions/     # Technical decisions
└── {project}/         # Project-specific thoughts
```

## 🚀 Quick Start

### 1. Install mem8
```bash
# Install with uv (recommended)
uv tool install mem8

# Or install from source
git clone https://github.com/killerapp/mem8.git
cd mem8
uv tool install --editable .
```

### 2. Initialize Your Workspace
```bash
# Create Claude Code configuration
mem8 init --template claude-config

# Create thoughts repository
mem8 init --template thoughts-repo

# Check everything is working
mem8 status
```

### 3. Optional: Start File Viewer
```bash
# Install dependencies and start web interface (optional)
cd frontend && npm install && npm run dev

# Access at http://localhost:3000 to browse thoughts
```

## 📋 Templates

### Claude Code Configuration (`claude-config`)
Generates `.claude/CLAUDE.md` with:
- Project-specific instructions
- Custom agents and commands
- Memory management settings
- Development workflows

**Example Usage:**
```bash
mem8 init --template claude-config
# Creates: .claude/CLAUDE.md, commands/, agents/
```

### Thoughts Repository (`thoughts-repo`)  
Creates structured documentation with:
- Research document templates
- Planning frameworks
- Decision logs
- Shared memory structure

**Example Usage:**
```bash
mem8 init --template thoughts-repo  
# Creates: thoughts/shared/, thoughts/research/, etc.
```

## 🎛️ Configuration

### Basic Setup
```bash
# Initialize in existing project
cd your-project
mem8 init --template claude-config

# Customize the generated .claude/CLAUDE.md
# Add project-specific instructions and workflows
```

### Advanced Configuration
```bash
# Use custom cookiecutter configs
mem8 init --template claude-config --config-file custom-config.yaml

# Link shared thoughts across projects
mem8 sync --link-shared ~/shared-thoughts
```

## 💻 Web Interface (Optional)

The included web interface provides a simple file browser for your thoughts:

### Features
- Browse research and planning documents
- Search across all markdown files  
- View file contents with syntax highlighting
- Navigate between different thought categories

### Start the Interface
```bash
# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

**Note:** The web interface is a simple file viewer - no authentication or database required.

## 🔧 Project Structure

```
your-project/
├── .claude/
│   ├── CLAUDE.md          # Main Claude Code configuration
│   ├── commands/          # Custom commands  
│   └── agents/           # Custom agent definitions
├── thoughts/
│   ├── shared/           # Shared documentation
│   ├── research/         # Research documents
│   └── plans/           # Implementation plans
└── mem8-config.yaml     # mem8 workspace settings
```

## 🛠️ Advanced Usage

### Search Functionality
```bash
# Full-text search
mem8 search "authentication"

# Search in specific directories
mem8 search "API" --path thoughts/shared/research

# Search with filters
mem8 search "bug" --tags "urgent" --type "plans"
```

### Sync and Sharing
```bash
# Sync with shared directory
mem8 sync

# Create symlinks to shared thoughts
mem8 sync --link ~/team-shared-thoughts

# Check sync status
mem8 status --verbose
```

### Custom Templates
```bash
# Create new template from existing project
mem8 template create my-template --from .

# Use custom template
mem8 init --template ./my-custom-template
```

## 📚 Integration with Claude Code

### Custom Agents
Place agent definitions in `.claude/agents/`:
```markdown
# .claude/agents/researcher.md
You are a research assistant focused on technical documentation...
```

### Custom Commands  
Add commands in `.claude/commands/`:
```bash
# .claude/commands/analyze.sh
#!/bin/bash
echo "Analyzing codebase structure..."
```

### Workspace Memory
Configure in `.claude/CLAUDE.md`:
```markdown
# Project Context
- Use `thoughts/research/` for background research
- Store implementation plans in `thoughts/plans/`
- Document decisions in `thoughts/decisions/`
```

## 🧰 Requirements

- **Python 3.8+** - For mem8 CLI
- **uv** - Package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **Node.js 18+** - For optional web interface
- **Git** - For sync functionality

## 🔄 Workflow Examples

### Research & Planning
```bash
# Start new research
mem8 init --template thoughts-repo
cd thoughts/research
# Create research-topic.md

# Plan implementation  
cd ../plans
# Create implementation-plan.md

# Search for related work
mem8 search "similar feature" --type research
```

### Claude Code Customization
```bash
# Set up Claude Code for new project
cd my-new-project  
mem8 init --template claude-config

# Customize .claude/CLAUDE.md with:
# - Project-specific context
# - Custom agent definitions  
# - Development workflows

# Test configuration
claude-code --help
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Focus areas:
1. **New Templates** - Create templates for different project types
2. **CLI Enhancements** - Improve search and sync functionality
3. **Web Interface** - Enhance the thoughts file viewer
4. **Documentation** - Improve setup and usage guides

---
*Designed for developers using Claude Code to enhance AI-assisted development workflows.*