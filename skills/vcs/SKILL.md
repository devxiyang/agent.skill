---
name: vcs
description: Version control and GitHub collaboration — local git operations (branching, committing, merging, rebasing, history) and GitHub interactions via gh CLI (PRs, issues, releases, CI, code review).
requires: bin:git
tags: vcs,git,github
---

# VCS Skill

## Preflight

```bash
git --version
gh --version   # optional, needed for GitHub operations
```

If git is missing, load `references/install-git.md`.
If gh is missing, load `references/install-gh.md`.

---

## Git — Common workflow

```bash
git status
git diff
git add <files>
git commit -m "message"
```

## Branching

```bash
git checkout -b feature/name
git switch main
git branch -d feature/name
```

## Inspecting history

```bash
git log --oneline -20
git log --oneline --graph --all
git show <commit>
git diff main...HEAD
git blame <file>
git blame -L 10,20 <file>
```

## Cherry-pick

```bash
git cherry-pick <commit>
git cherry-pick <from>..<to>
git cherry-pick -n <commit>   # stage only, no commit
```

## Tags

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git tag
git push origin --tags
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

## Undoing changes

```bash
git restore --staged <file>   # unstage
git reset --soft HEAD~1       # undo last commit, keep changes staged
git rebase -i HEAD~3          # edit recent commits interactively
```

## Stashing

```bash
git stash push -m "description"
git stash list
git stash pop
```

## Merging & rebasing

```bash
git merge feature/name
git rebase main
git rebase --abort
git merge --abort
```

## Conflict resolution

1. Open conflicting files, look for `<<<<<<<` markers
2. Edit to desired state
3. `git add <resolved-file>`
4. `git rebase --continue` or `git merge --continue`

## Worktrees

```bash
git worktree add ../project-fix fix/some-bug
git worktree add -b feature/new ../project-feature main
git worktree list
git worktree remove ../project-fix
```

## Bisect

```bash
git bisect start
git bisect bad
git bisect good <commit>
# mark each checkout as good/bad until found
git bisect reset
```

## Remotes

```bash
git remote -v
git fetch origin
git pull --rebase
git push -u origin HEAD
```

---

## GitHub (gh CLI)

Always specify `--repo owner/repo` when not inside a git directory.

## Pull Requests

```bash
gh pr list --repo owner/repo
gh pr view <number> --repo owner/repo
gh pr checks <number> --repo owner/repo
gh run view <run-id> --repo owner/repo --log-failed
gh pr merge <number> --repo owner/repo --squash
```

## Code review

```bash
gh pr review <number> --approve --repo owner/repo
gh pr review <number> --request-changes --body "Please fix X" --repo owner/repo
gh pr review <number> --comment --body "Looks good overall" --repo owner/repo

# Inline comment via API
gh api repos/owner/repo/pulls/<number>/comments \
  --method POST \
  --field body="Comment text" \
  --field commit_id="<sha>" \
  --field path="src/file.ts" \
  --field line=42
```

## Issues

```bash
gh issue list --repo owner/repo --state open
gh issue view <number> --repo owner/repo
gh issue create --title "Title" --body "Body" --repo owner/repo
gh issue comment <number> --body "Comment" --repo owner/repo
gh issue close <number> --repo owner/repo
gh issue reopen <number> --repo owner/repo
```

## Releases

```bash
gh release list --repo owner/repo
gh release create v1.0.0 --repo owner/repo --title "v1.0.0" --notes "Release notes"
gh release upload v1.0.0 dist/app.zip --repo owner/repo
```

## API & JSON output

```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
gh pr list --repo owner/repo --json number,title,author --jq '.[] | "\(.number): \(.title) by \(.author.login)"'
```

---

## Destructive Operations

Always confirm with the user before running any of the following:

| Command | Risk |
|---------|------|
| `git reset --hard` | Discards all uncommitted changes permanently |
| `git push --force` / `git push -f` | Overwrites remote history, affects all collaborators |
| `git branch -D <branch>` | Force-deletes branch regardless of merge status |
| `git clean -f` / `git clean -fd` | Deletes untracked files/directories permanently |
| `git rebase -i` on pushed commits | Rewrites shared history |
| `git restore <file>` | Discards working tree changes for that file |
| `gh pr merge` | Merges and closes PR; hard to revert cleanly |
| `gh release delete` | Permanently deletes a release and its assets |
| `gh issue delete` | Permanently deletes an issue |
| `gh repo delete` | Permanently deletes the entire repository |
| `gh api --method DELETE ...` | Any DELETE API call is irreversible |

Before executing, tell the user exactly what will be lost and ask for explicit confirmation.
