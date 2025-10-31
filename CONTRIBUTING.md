# Contributing to Textify

Thanks for wanting to contribute! This short guide explains how to open a helpful pull request so maintainers can review and merge quickly.

## Quick checklist
- Fork the repo and create a branch from `main`.
- Keep changes focused and small — one logical change per PR.
- Use clear commit messages and a descriptive PR title.
- Ensure linting and tests (if any) pass locally.

## Branch naming
Use descriptive, conventional branch names, for example:
- `feat/short-description` for new features
- `fix/short-description` for bug fixes
- `chore/short-description` for maintenance tasks
- `docs/short-description` for documentation only

## Commit messages
We follow conventional-style messages. Examples:
- `feat(auth): add remember-me option`
- `fix(sidebar): normalize id comparison for online status`
- `chore(deps): bump axios to 1.4.0`

Keep the subject line under 72 characters and include a short body if more context is needed.

## Pull request template (suggested)
- Title: a short summary, prefixed with the type (feat/fix/chore/docs)
- Description: short summary, what/why/how
- Checklist:
  - [ ] I added/updated tests (if applicable)
  - [ ] I updated relevant documentation (if applicable)
  - [ ] Linting passes locally

Example PR description:
```
feat(sidebar): add online filter toggle

Adds a checkbox to filter sidebar contacts to only show online users.
The toggle state is persisted in localStorage.

Checklist:
- [x] Manual tested locally
- [x] No new lint warnings
```

## Running linters & tests
Check `package.json` scripts for `lint`, `test`, or related commands and run them before opening a PR. If the project does not include scripts, please run any linters or tests you normally use.

## Review process
Small PRs are reviewed quickly. Larger PRs may need discussion — consider opening an issue first to propose the change.

## Code style
Follow the existing code style of the repository. If there is an ESLint configuration, prefer fixing lint issues in your PR.

## Need help?
If you're unsure where to start, open an issue with the label `help wanted` or ask in the repository's discussions.

Thanks — maintainers
