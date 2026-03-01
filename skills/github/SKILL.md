---
name: github
description: Interact with GitHub using the `gh` CLI. Use for issues, pull requests, CI runs, code review, and GitHub API queries.
requires: bin:gh
tags: vcs,github
---

# GitHub Skill

## Preflight

Verify gh is available before proceeding:

```bash
gh --version
```

If missing, load `references/install.md` for installation and authentication instructions.

Use the `gh` CLI to interact with GitHub. Always specify `--repo owner/repo` when not inside a git directory.

## Pull Requests

```bash
# List open PRs
gh pr list --repo owner/repo

# View a PR
gh pr view <number> --repo owner/repo

# Check CI status
gh pr checks <number> --repo owner/repo

# View failed CI logs
gh run view <run-id> --repo owner/repo --log-failed

# Merge a PR
gh pr merge <number> --repo owner/repo --squash
gh pr merge <number> --repo owner/repo --merge
gh pr merge <number> --repo owner/repo --rebase
```

## Code review

```bash
# Approve
gh pr review <number> --approve --repo owner/repo

# Request changes
gh pr review <number> --request-changes --body "Please fix X" --repo owner/repo

# Leave a comment
gh pr review <number> --comment --body "Looks good overall" --repo owner/repo

# Add inline comment via API
gh api repos/owner/repo/pulls/<number>/comments \
  --method POST \
  --field body="Comment text" \
  --field commit_id="<sha>" \
  --field path="src/file.ts" \
  --field line=42
```

## Issues

```bash
# List issues
gh issue list --repo owner/repo --state open

# View an issue
gh issue view <number> --repo owner/repo

# Create issue
gh issue create --title "Title" --body "Body" --repo owner/repo

# Comment on an issue
gh issue comment <number> --body "Comment" --repo owner/repo

# Close / reopen
gh issue close <number> --repo owner/repo
gh issue reopen <number> --repo owner/repo
```

## Releases

```bash
# List releases
gh release list --repo owner/repo

# Create a release
gh release create v1.0.0 --repo owner/repo --title "v1.0.0" --notes "Release notes"

# Upload assets to a release
gh release upload v1.0.0 dist/app.zip --repo owner/repo
```

## API

Use `gh api` for data not available via subcommands:

```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'
```

## JSON Output

Most commands support `--json` + `--jq`:

```bash
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
gh pr list --repo owner/repo --json number,title,author --jq '.[] | "\(.number): \(.title) by \(.author.login)"'
```
