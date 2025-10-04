# PR Description

## What problem does this solve?

This PR addresses Issue #19: External Template Sources, enabling teams to share and collaborate on Claude Code workflows through GitHub-hosted templates. Additionally, it modernizes the documentation site with an improved UI, animations, and comprehensive workflow diagrams.

**Primary Problems Solved:**
1. **No template sharing mechanism** - Teams couldn't standardize Claude Code workflows across the organization
2. **Poor documentation** - No comprehensive guide for using mem8's workflow features
3. **Init command UX issues** - Repository name defaults were confusing and polluted by saved preferences
4. **Missing PR workflow tooling** - `/describe_pr` command lacked the required template file

**Related Issues:**
- Closes #19

## What changes were made?

### User-facing changes

#### External Template Sources (Issue #19)
- **GitHub shorthand support**: `mem8 init --template-source killerapp/mem8-templates`
- **Version pinning**: `mem8 init --template-source killerapp/mem8-templates@v2.10.0`
- **Subdirectory support**: `mem8 init --template-source org/repo#subdir=templates`
- **Template management commands**:
  - `mem8 templates list` - Browse available templates
  - `mem8 templates validate` - Verify template sources
  - `mem8 templates set-default` - Configure default source
- **Manifest-based discovery**: `mem8-templates.yaml` format for template repositories
- **Official templates repository**: https://github.com/killerapp/mem8-templates

#### Documentation Modernization
- **Modern Docusaurus site** with TypeScript at `/documentation`
- **Comprehensive workflow guides** with 15+ Mermaid diagrams showing:
  - Research → Plan → Implement → Commit cycle
  - Context engineering patterns
  - Sub-agent architecture
  - Parallel exploration workflows
- **Improved visual design**:
  - Clean dark theme with blue accents (#60a5fa, #79c0ff)
  - Animated components (shimmer buttons, fade-in cards, gradient text)
  - Interactive code blocks with copy functionality
  - Proper branding with centered infinity symbol logo
- **AI-friendly documentation**: `/llms.txt` endpoint via docusaurus-plugin-llms-txt
- **Cloudflare Pages deployment**: Replaces GitHub Pages with faster, global CDN
- **Split workflow docs**: 7 focused pages instead of single 700+ line file

#### CLI Improvements
- **Smart repository name defaults**: Uses current directory name instead of saved preference
- **Removed config pollution**: `github_repo` no longer saved globally (project-specific)
- **Better UX**: Each project gets sensible defaults based on its context

#### Template System
- **PR description template**: Added `thoughts/shared/pr_description.md` for `/describe_pr` command
- **Fixed duplicate templates**: Removed redundant files from cookiecutter templates

### Implementation details

#### New Modules
- **`mem8/core/template_source.py`** (561 lines):
  - `TemplateSource` abstract base class
  - `BuiltinTemplateSource` - Default bundled templates
  - `LocalTemplateSource` - Development and local templates
  - `GitHubTemplateSource` - Remote GitHub repositories
  - Manifest loading and validation (`mem8-templates.yaml`)
  - Template discovery with fallback to directory scanning

#### CLI Changes
- **`mem8/cli_typer.py`**:
  - Added `templates` command group with `list`, `validate`, `set-default` subcommands
  - Modified `init` command: `--template-source` parameter
  - Fixed repository name defaults (lines 612-616)
  - Removed `github_repo` from saved preferences (line 757)

#### Configuration
- **`mem8/core/config.py`**:
  - Added `default_template_source` config field
  - Removed `github_repo` from `save_workflow_preferences()` method
  - Added documentation explaining project-specific fields

#### Documentation Infrastructure
- **Created `/documentation` directory** with Docusaurus v3 + TypeScript
- **New workflows pages** (7 files):
  - `workflows/index.md` - Overview
  - `workflows/research.md` - Phase 1
  - `workflows/plan.md` - Phase 2
  - `workflows/implement.md` - Phase 3
  - `workflows/commit.md` - Phase 4
  - `workflows/advanced.md` - Team features
  - `workflows/best-practices.md` - Guidelines
- **Animated components** (Framer Motion):
  - `ShimmerButton.tsx` - Gradient shimmer effect
  - `AnimatedCard.tsx` - Fade-in with hover
  - `GradientText.tsx` - Animated text gradient
  - `CopyButton.tsx` - Clipboard with feedback
- **GitHub Actions workflows**:
  - `deploy-docs.yml` - Production deployment to Cloudflare
  - `preview-docs.yml` - PR preview deployments

#### Testing
- **`tests/test_template_source.py`** (366 lines):
  - GitHub shorthand parsing tests
  - Git URL detection tests
  - Manifest loading and validation tests
  - Template listing and discovery tests
  - Local and builtin source tests
- **Updated CLI tests** to work with new template output format

#### Dependencies Added
- **Documentation**:
  - `framer-motion` - Animations
  - `docusaurus-plugin-llms-txt` - AI documentation
  - `@docusaurus/theme-live-codeblock` - Interactive examples
  - `@docusaurus/theme-mermaid` - Diagram support
- **Development**:
  - `pillow` - Logo processing
  - `numpy` - Logo analysis

#### Architectural Decisions
1. **Template Source abstraction** - Enables future sources (GitLab, Bitbucket, S3, etc.)
2. **Manifest-first approach** - Explicit template definitions with fallback to directory scanning
3. **GitHub shorthand** - Simplified syntax for common case (org/repo)
4. **Immutable external sources** - Clone to temp dir, never modify
5. **Config separation** - User-level prefs vs project-specific context
6. **Documentation as code** - React components for reusable UI patterns

## How to verify it

### Automated verification
- [x] Unit tests pass: `uv run pytest` ✅ (55 passed, 2 skipped)
- [ ] Documentation build succeeds: `cd documentation && npm run build` ⚠️ **FAILING - Broken links detected**
- [ ] Linting passes: (no linting configured)
- [x] CLI install works: `uv tool install . --editable` ✅

### Manual verification
- [ ] External template sources work:
  ```bash
  # Test in clean directory
  cd /tmp/test-project
  mem8 init --template-source killerapp/mem8-templates
  ```
- [ ] Template management commands work:
  ```bash
  mem8 templates list --source killerapp/mem8-templates
  mem8 templates validate --source killerapp/mem8-templates
  mem8 templates set-default killerapp/mem8-templates
  ```
- [ ] Documentation site builds and renders correctly:
  ```bash
  cd documentation
  npm install
  npm start  # View at http://localhost:3000
  ```
- [ ] Mermaid diagrams render without errors
- [ ] Animated components work smoothly
- [ ] Copy buttons function correctly
- [ ] Logo displays properly in navbar
- [ ] Init command uses sensible defaults for new projects
- [ ] PR description template exists and works with `/describe_pr` command

## Breaking changes

**None** - All changes are backwards compatible:
- Default template source is `builtin` (existing behavior)
- Existing `mem8 init` commands work unchanged
- Config migration handled automatically (removes obsolete `github_repo` field)

## Changelog entry

```
### Added
- External template sources with GitHub shorthand support (org/repo@ref#subdir=path)
- Template management commands: `mem8 templates list/validate/set-default`
- Manifest-based template discovery (mem8-templates.yaml format)
- Official templates repository: https://github.com/killerapp/mem8-templates
- Comprehensive Docusaurus documentation site with 15+ Mermaid workflow diagrams
- Modern UI with animated components (shimmer buttons, fade-in cards, gradient text)
- AI-friendly documentation with /llms.txt endpoint
- Cloudflare Pages deployment with automated PR previews
- Split workflow documentation into 7 focused pages

### Fixed
- Init command now uses current directory name as default repo name
- Removed github_repo from global config (now project-specific)
- Added missing PR description template for /describe_pr command
- Fixed Mermaid diagram lexical errors (removed forward slashes from node labels)
- Improved logo display with centered 450x450 square icon

### Changed
- Documentation deployment: GitHub Pages → Cloudflare Pages
- Documentation URL: https://mem8.agenticinsights.com
- Dark theme colors: GitHub-inspired blue accents (#60a5fa, #79c0ff)
```

## Additional context

### Documentation Build Issue ⚠️
The documentation build is currently **failing due to broken links**. This needs to be fixed before merging:
- Multiple references to `/docs/intro` that don't exist
- Links to pages that were restructured during workflow split
- Relative link resolution issues

**Recommendation**: Fix broken links in a follow-up commit on this PR before merging.

### Team Collaboration Use Case
The external templates feature enables powerful team workflows:
1. **Fork killerapp/mem8-templates** to your organization
2. **Customize** Claude Code prompts, sub-agents, and workflows
3. **Distribute**: `mem8 init --template-source myorg/mem8-templates`
4. **Update centrally** - All team members get updates via `mem8 doctor --autofix`

### Performance
- External template sources are cached in `~/.mem8/template-cache/`
- GitHub clones use shallow clone (depth=1) for speed
- Template validation runs in parallel when checking multiple sources

### Migration Path
Existing projects are unaffected. To adopt external templates:
```bash
# Set org-wide default
mem8 templates set-default myorg/mem8-templates

# All future init commands use this source
mem8 init
```

### Visual Examples
- **Homepage**: http://localhost:3000 (after `npm start` in documentation/)
- **Workflows**: http://localhost:3000/docs/workflows/
- **External Templates**: http://localhost:3000/docs/external-templates
