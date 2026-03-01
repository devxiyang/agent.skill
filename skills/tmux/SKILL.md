---
name: tmux
description: Remote-control tmux sessions for interactive CLIs by sending keystrokes and reading pane output. Use when a command requires an interactive TTY.
requires: bin:tmux
os: darwin,linux
tags: terminal,tmux
---

# tmux Skill

## Preflight

Verify tmux is available before proceeding:

```bash
tmux -V
```

If missing, load `references/install.md` for installation instructions.

Use tmux only when you need an interactive TTY. For non-interactive long-running tasks, prefer background execution instead.

## Quickstart

```bash
SOCKET=/tmp/agent-tmux.sock
SESSION=agent

tmux -S "$SOCKET" new -d -s "$SESSION" -n shell
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- 'python3 -q' Enter
tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

After starting a session, always print monitor commands for the user:

```
To monitor:
  tmux -S "$SOCKET" attach -t "$SESSION"
  tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

## Socket convention

Use a dedicated socket file per agent instance to avoid conflicts:

```bash
SOCKET="${AGENT_TMUX_SOCKET:-/tmp/agent-tmux.sock}"
```

## Sending input

```bash
# Literal send (safe for special chars)
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -l -- "$cmd"

# With Enter
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- "$cmd" Enter

# Control keys
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 C-c
```

## Reading output

```bash
# Capture recent history
tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

## Session management

```bash
# List sessions
tmux -S "$SOCKET" list-sessions

# Kill session
tmux -S "$SOCKET" kill-session -t "$SESSION"

# Kill server (all sessions on socket)
tmux -S "$SOCKET" kill-server
```

## Tips

- Target format: `session:window.pane` (default `:0.0`)
- Set `PYTHON_BASIC_REPL=1` for Python REPLs to avoid readline issues
- Poll for shell prompt (`$` or `❯`) to detect command completion
