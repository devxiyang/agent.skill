---
name: git
description: Local git operations — branching, committing, merging, rebasing, history inspection, and conflict resolution.
requires: bin:git
tags: vcs,git
---

# Git Skill

## Preflight

Verify git is available before proceeding:

```bash
git --version
```

If missing, load `references/install.md` for installation instructions.

## Common workflow

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
```

## Cherry-pick

```bash
# Apply a specific commit onto the current branch
git cherry-pick <commit>

# Cherry-pick a range
git cherry-pick <from>..<to>

# Cherry-pick without committing (stage only)
git cherry-pick -n <commit>
```

## Tags

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release 1.0.0"

# List tags
git tag

# Push tags to remote
git push origin --tags

# Delete a tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

## Undoing changes

```bash
# Unstage
git restore --staged <file>

# Discard working tree changes
git restore <file>

# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Interactive rebase to edit recent commits
git rebase -i HEAD~3
```

## Stashing

```bash
git stash push -m "description"
git stash list
git stash pop
```

## Merging & rebasing

```bash
# Merge
git merge feature/name

# Rebase onto main
git rebase main

# Abort on conflict
git rebase --abort
git merge --abort
```

## Conflict resolution

1. Open conflicting files, look for `<<<<<<<` markers
2. Edit to desired state
3. `git add <resolved-file>`
4. `git rebase --continue` or `git merge --continue`

## Worktrees

Check out multiple branches simultaneously in separate directories — useful for working on or reviewing a branch without touching the current working tree:

```bash
# Add a worktree for an existing branch
git worktree add ../project-fix fix/some-bug

# Add a worktree and create a new branch
git worktree add -b feature/new ../project-feature main

# List worktrees
git worktree list

# Remove a worktree when done
git worktree remove ../project-fix
```

Each worktree shares the same repository history but has its own working directory and HEAD.

## Debugging

```bash
# Find which commit introduced a bug (binary search)
git bisect start
git bisect bad                # current commit is broken
git bisect good <commit>      # last known good commit
# git will check out commits for you to test; mark each:
git bisect good
git bisect bad
git bisect reset              # done

# Show who last changed each line
git blame <file>
git blame -L 10,20 <file>    # specific line range
```

## Remotes

```bash
git remote -v
git fetch origin
git pull --rebase
git push -u origin HEAD
```
