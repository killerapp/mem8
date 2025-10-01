- Use conventional commits as this project uses github actions that auto-pubish .github\workflows\release.yml
- there's already a copy setup with @DOCKER.md that should be hot reloading and browsable to test

## Template Management

- The `.claude` directory in this repo is generated from `mem8\templates\claude-dot-md-template`
- When updating commands or agents, **always modify the cookiecutter template** in `mem8\templates\claude-dot-md-template\{{cookiecutter.project_slug}}\`
- Changes to the template will be applied to new projects when users run `mem8 init`
- The local `.claude` directory is just for testing the mem8 CLI itself - it will be regenerated from templates
- Same applies to the `thoughts` directory structure which comes from `mem8\templates\shared-thoughts-template`