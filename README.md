# AI-Mem - AI Memory Management System

A comprehensive toolkit for managing AI-assisted development memory, providing structured knowledge repositories and Claude Code configurations for teams and individuals.

## 🎯 Overview

AI-Mem provides cookiecutter templates and tools for:
- **Claude Code Configuration** - Structured `.claude` directories with agents and commands
- **Shared Thoughts Repository** - Team knowledge management with git synchronization
- **Cross-Project Memory** - Unified search and reference across multiple projects

## 🚀 Quick Start

```bash
# Install cookiecutter
uv tool install cookiecutter

# Generate Claude configuration
cookiecutter claude-dot-md-template --config-file example-configs/claude-dot-md/default.yaml

# Generate thoughts repository
cookiecutter shared-thoughts-template --config-file example-configs/shared-thoughts/default.yaml
```

## 📦 Components

### 1. Claude Dot MD Template
Generates `.claude` directory configurations for Claude Code with:
- **Agents**: codebase-analyzer, codebase-locator, thoughts-analyzer, web-search-researcher
- **Commands**: commit, create_plan, research_codebase, implement_plan
- **Optional Integrations**: Linear tickets, Ralph workflows
- **Conditional Features**: Configurable based on team needs

### 2. Shared Thoughts Template
Creates structured knowledge repositories with:
- **Directory Structure**: shared/, personal/, global/, searchable/
- **Document Types**: plans, research, tickets, PRs, decisions
- **Sync Scripts**: Cross-platform git synchronization utilities
- **Searchable Links**: Unified search via symlinks/junctions

## 📁 Project Structure

```
ai-mem/
├── claude-dot-md-template/    # Claude Code configuration template
│   ├── {{cookiecutter.project_slug}}/
│   │   ├── agents/            # AI agent definitions
│   │   └── commands/          # Command workflows
│   └── hooks/                 # Post-generation scripts
├── shared-thoughts-template/  # Thoughts repository template
│   ├── {{cookiecutter.project_slug}}/
│   │   └── thoughts/          # Knowledge structure
│   └── hooks/                 # Setup scripts
├── example-configs/           # Example configurations
│   ├── claude-dot-md/        # Claude configs (default, minimal, enterprise)
│   └── shared-thoughts/      # Thoughts configs (default, team, personal)
└── claude-dot-md-ref/        # Reference implementations
```

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

### Minimal Personal Setup
```bash
# Lightweight configuration for individual use
cookiecutter claude-dot-md-template --config-file example-configs/claude-dot-md/minimal.yaml
cookiecutter shared-thoughts-template --config-file example-configs/shared-thoughts/personal-notes.yaml
```

## 🎨 Customization

### Override Configuration Values
```bash
cookiecutter claude-dot-md-template \
  --config-file example-configs/claude-dot-md/default.yaml \
  --no-input \
  include_linear_integration=true \
  organization_name="ACME Corp"
```

### Create Custom Configuration
1. Copy an example config from `example-configs/`
2. Modify values in the YAML file
3. Use with `--config-file` option

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

### File Naming Conventions
- **Research**: `YYYY-MM-DD_HH-MM-SS_topic.md`
- **Plans**: `descriptive-name.md`
- **Tickets**: `ENG-XXXX.md`
- **PRs**: `{number}_description.md`

## 🛠️ Tools & Scripts

### Sync Scripts (Generated)
- `sync-thoughts.bat` - Windows batch script
- `sync-thoughts.sh` - Unix/Linux shell script
- `sync-thoughts.ps1` - PowerShell script

### Features
- Automatic git commit and push
- Configurable commit messages
- Status reporting
- Cross-platform compatibility

## 📋 Requirements

- **Python 3.7+** - For cookiecutter
- **cookiecutter** - Template engine (`uv tool install cookiecutter`)
- **git** - Version control (optional, for sync features)
- **Windows**: May need admin privileges for directory junctions
- **Unix/Linux**: Standard permissions for symlinks

## 🚧 Roadmap

- [ ] AI-Mem CLI tool for lifecycle management
- [ ] Web frontend for browsing thoughts
- [ ] Backend API for team synchronization
- [ ] Self-hosted deployment options
- [ ] Integration with more AI assistants

## 📝 License

This project is designed for AI-assisted development workflows and knowledge management.

## 🤝 Contributing

Contributions welcome! The templates are designed to be extensible:
1. Add new agents to `claude-dot-md-template/`
2. Add new document types to `shared-thoughts-template/`
3. Create new example configurations
4. Improve sync scripts and utilities

## 📚 Documentation

- [Example Configurations](example-configs/README.md) - Pre-built configuration examples
- [Claude Template](claude-dot-md-template/README.md) - Claude Code configuration details
- [Thoughts Template](shared-thoughts-template/README.md) - Thoughts repository details

---
*Built for teams using AI-assisted development with Claude Code and similar tools.*