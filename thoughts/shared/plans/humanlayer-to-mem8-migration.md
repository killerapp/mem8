---
date: 2025-09-01T12:00:00-05:00
author: claude-code
git_commit: d4a784dc22487064b272f66b310f11477b1d8d2f
branch: codex/mark-semantic-search-as-experimental
repository: mem8
topic: "Humanlayer to mem8 CLI Migration"
tags: [migration, cli, templates, documentation, breaking-change]
status: draft
last_updated: 2025-09-01
last_updated_by: claude-code
---

# Humanlayer → mem8 CLI Migration Implementation Plan

## Overview

This plan migrates 26 files containing legacy "humanlayer" CLI command references to use the new "mem8" command structure. The migration affects command documentation across development files, cookiecutter templates, and packaged templates. This is a **breaking change** that requires updating all command references and file system paths.

## Current State Analysis

### Discovered References
Research identified **26 unique files** containing "humanlayer" references:
- **10 development command files** in `.claude/commands/`
- **8 template source files** in `claude-dot-md-template/`
- **8 packaged template files** in `mem8/templates/claude-dot-md-template/`

### Key Findings from Codebase Analysis

#### CLI Command Structure Analysis
**Research document findings vs. actual mem8 CLI status:**
- ⚠️ `humanlayer thoughts sync` → `mem8 sync` (command exists but **experimental/incomplete**)
- ✅ `humanlayer launch --model opus` → `mem8 dashboard` (dashboard command ready)  
- ✅ `npx humanlayer thoughts init` → `mem8 init` (init command ready)

#### File System Migration Confirmed
- ✅ `~/.humanlayer/` → `~/.mem8/` (confirmed in `mem8/core/config.py:15`)
- ✅ `~/.humanlayer/daemon.db` → Not applicable (mem8 has no daemon)
- ✅ `~/.humanlayer/logs/` → Handled by platformdirs in `~/.mem8/`

#### Template System Architecture
- **Dual-template system**: Development source + packaged distribution
- **No automated sync**: Changes must be manually applied to both locations
- **Cookiecutter integration**: Templates use cookiecutter for project initialization

## Desired End State

After migration completion:
1. All CLI command references use "mem8" instead of "humanlayer"
2. All file system paths reference `~/.mem8/` instead of `~/.humanlayer/`
3. All template files contain correct command syntax
4. Documentation reflects accurate command mappings
5. Both development and packaged templates are synchronized

### Success Verification:
- Search for "humanlayer" returns zero matches in all target files
- Template instantiation generates correct mem8 commands
- All commands in documentation are executable with mem8 CLI

## What We're NOT Doing

- **GitHub repository migrations**: Not changing any `github.com/humanlayer/*` URLs (context-dependent)
- **Breaking existing projects**: No changes to projects already created from old templates
- **Deprecation warnings**: No backward compatibility layer (clean break)
- **Daemon-related migrations**: mem8 has no daemon component to migrate to

## Implementation Approach

**Strategy**: Direct search-and-replace migration with command syntax verification. Handle three identical sets of files in parallel with manual synchronization verification.

**Risk Mitigation**: Pre-validate all command syntax against actual mem8 CLI capabilities before committing changes.

## Phase 1: Command Syntax Verification and Mapping

### Overview
Verify the correct mem8 command equivalents for each "humanlayer" reference found in the research.

### Changes Required:

#### 1. Create Command Mapping Reference
**File**: `thoughts/shared/research/humanlayer-mem8-command-mapping.md`
**Purpose**: Document exact command equivalents to ensure consistent migration

**Content to document**:
- `humanlayer thoughts sync` → `mem8 sync` (⚠️ **Note: sync is experimental and needs overhaul**)
- `humanlayer launch --model opus` → `mem8 dashboard` 
- `npx humanlayer thoughts init` → `mem8 init`
- `~/.humanlayer/` → `~/.mem8/`
- `~/wt/humanlayer/ENG-XXXX` → `~/wt/mem8/ENG-XXXX`

#### 2. Validate Command Syntax
**Test each mapped command**:
```bash
mem8 --help  # Verify available commands
mem8 sync --help  # Verify sync options
mem8 dashboard --help  # Verify dashboard options
mem8 init --help  # Verify init options
```

### Success Criteria:

#### Automated Verification:
- [x] All mem8 commands execute without errors: `mem8 --help && mem8 sync --help && mem8 dashboard --help && mem8 init --help`
- [x] Command mapping document created and validates against CLI
- [x] No syntax errors in proposed replacements

#### Manual Verification:
- [x] Command mappings accurately reflect mem8 CLI capabilities
- [x] All edge cases and options properly documented
- [x] Migration mapping covers 100% of found references

---

## Phase 2: Development Command Files Migration

### Overview
Migrate the 10 active development command files in `.claude/commands/` directory.

### Changes Required:

#### 1. CLI Command Updates (10 files)
**Files**: 
- `.claude/commands/create_plan.md` - Lines 54, 268, 288, 311, 398
- `.claude/commands/create_worktree.md` - Lines 23, 32, 37
- `.claude/commands/debug.md` - Lines 36, 37, 41, 52, 77, 78, 88, 121, 148, 172, 173, 178, 179, 180
- `.claude/commands/describe_pr.md` - Lines 9, 56
- `.claude/commands/linear.md` - Lines 55, 56, 57, 72
- `.claude/commands/local_review.md` - Lines 20, 22, 27, 43
- `.claude/commands/ralph_impl.md` - Line 26
- `.claude/commands/ralph_plan.md` - Line 27
- `.claude/commands/ralph_research.md` - Line 39
- `.claude/commands/research_codebase.md` - Line 141

**Migration patterns**:
```bash
# Replace CLI commands (note: sync is experimental)
s/humanlayer thoughts sync/mem8 sync/g  # ⚠️ experimental command
s/humanlayer launch --model opus/mem8 dashboard/g
s/npx humanlayer thoughts init/mem8 init/g
s/npx humanlayer launch/mem8 dashboard/g

# Replace file system paths
s/~\/.humanlayer\//~\/.mem8\//g
s/\$HOME\/.humanlayer\//\$HOME\/.mem8\//g

# Replace worktree paths  
s/~\/wt\/humanlayer\//~\/wt\/mem8\//g

# Replace directory references
s/humanlayer-wui\//mem8-wui\//g
```

### Success Criteria:

#### Automated Verification:
- [x] No "humanlayer" references remain: `grep -r "humanlayer" .claude/commands/ | wc -l` returns 0
- [x] All commands validate: Test each updated command syntax
- [x] Files contain valid markdown: `markdownlint .claude/commands/*.md`

#### Manual Verification:
- [x] Command documentation accurately reflects mem8 CLI behavior
- [x] File paths are correct for the mem8 system
- [x] No broken command examples or invalid syntax

---

## Phase 3: Template Source Migration

### Overview 
Migrate the 8 cookiecutter template source files in `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/`.

### Changes Required:

#### 1. Template Command Files (8 files)
**Files**:
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/create_worktree.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/debug.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/linear.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/local_review.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/ralph_impl.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/ralph_plan.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/ralph_research.md`
- `claude-dot-md-template/{{cookiecutter.project_slug}}/commands/research_codebase.md`

**Use identical migration patterns from Phase 2**

#### 2. Template Configuration Updates
**File**: `claude-dot-md-template/cookiecutter.json`
**Review for**: Any default values referencing "humanlayer"

### Success Criteria:

#### Automated Verification:
- [x] No "humanlayer" references in templates: `grep -r "humanlayer" claude-dot-md-template/ | wc -l` returns 0
- [x] Template instantiation test: `cookiecutter claude-dot-md-template --no-input --output-dir /tmp/test`
- [x] Generated files contain mem8 commands: `grep -r "mem8" /tmp/test/.claude/commands/`

#### Manual Verification:
- [x] Template generates correct command documentation
- [x] Cookiecutter variables properly substitute
- [x] No template syntax errors or broken references

---

## Phase 4: Packaged Template Migration

### Overview
Migrate the 8 packaged template files in `mem8/templates/claude-dot-md-template/` that are distributed with the package.

### Changes Required:

#### 1. Packaged Template Files (8 files)
**Files**:
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/create_worktree.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/debug.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/linear.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/local_review.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/ralph_impl.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/ralph_plan.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/ralph_research.md`
- `mem8/templates/claude-dot-md-template/{{cookiecutter.project_slug}}/commands/research_codebase.md`

**Use identical migration patterns from Phases 2 & 3**

#### 2. Template Synchronization Verification
**Verify**: Development and packaged templates contain identical content after migration

```bash
# Verify templates are synchronized
diff -r claude-dot-md-template/ mem8/templates/claude-dot-md-template/
```

### Success Criteria:

#### Automated Verification:
- [x] No "humanlayer" references in packaged templates: `grep -r "humanlayer" mem8/templates/ | wc -l` returns 0
- [x] Template directory diff shows no differences: `diff -r claude-dot-md-template/ mem8/templates/claude-dot-md-template/`
- [x] Package installation test: `uv build && uv install dist/*.whl --force-reinstall`

#### Manual Verification:
- [x] Packaged templates match development templates exactly
- [x] Package installation includes updated templates
- [x] Template installation via mem8 CLI works correctly

---

## Phase 5: Documentation and Migration Guide

### Overview
Create comprehensive documentation for the migration and future reference.

### Changes Required:

#### 1. User Migration Guide
**File**: `thoughts/shared/plans/user-migration-humanlayer-to-mem8.md`
**Content**:
- How existing projects can update their .claude/commands/
- Command equivalent reference table
- File system migration steps for users
- Troubleshooting common migration issues

#### 2. Migration History Documentation  
**File**: `thoughts/shared/research/humanlayer-mem8-migration-history.md`
**Content**:
- Timeline of the name change (research needed)
- Rationale for the migration (research needed)
- Technical changes made during migration
- Impact assessment and lessons learned

### Success Criteria:

#### Automated Verification:
- [ ] Documentation files created and validated
- [ ] All links in documentation are accessible
- [ ] Documentation follows project markdown standards

#### Manual Verification:
- [ ] Migration guide is complete and actionable
- [ ] Historical documentation captures key decisions
- [ ] User impact is clearly communicated

---

## Testing Strategy

### Unit Tests:
- **Template instantiation**: Test that cookiecutter generates correct files
- **CLI command validation**: Verify all documented commands execute properly
- **File path verification**: Test that file system references are valid

### Integration Tests:
- **End-to-end template workflow**: Create new project from templates and verify functionality
- **Command documentation accuracy**: Test that all documented commands work as described
- **Package distribution**: Test template distribution via wheel package

### Manual Testing Steps:
1. **Template Generation Test**:
   ```bash
   cd /tmp && mem8 init --template-type full --force
   grep -r "humanlayer" .claude/ || echo "Migration successful"
   ```

2. **Command Functionality Test**:
   ```bash
   mem8 sync --dry-run
   mem8 dashboard --help
   mem8 init --help
   ```

3. **File System Test**:
   - Verify ~/.mem8/ directory is used correctly
   - Test that old ~/.humanlayer/ references don't break functionality

## Performance Considerations

**Template Package Size**: Migration doesn't affect package size significantly (text changes only)
**Build Time**: No impact on build performance
**Runtime Performance**: No performance implications for CLI commands

## Migration Notes

### Backward Compatibility
- **Breaking change**: Old "humanlayer" commands will not work
- **Clean migration**: No deprecation period or backward compatibility layer
- **User impact**: Users with existing projects need to update their command documentation manually

### Rollback Strategy
If migration needs to be rolled back:
1. Revert all file changes using git
2. No database or file system changes to undo
3. Templates can be re-instantiated from previous versions

## References

- Original research: `thoughts/shared/research/2025-09-01_09-37-55_humanlayer-to-mem8-migration.md`
- CLI framework migration: `thoughts/shared/plans/restore-typer-cli-functionality.md`
- Template packaging: `thoughts/shared/research/2025-09-01_wheel-packaging-templates.md`
- mem8 CLI structure: `mem8/cli_typer.py:28-34`
- Configuration handling: `mem8/core/config.py:15`
- Template system: `mem8/templates/__init__.py`