# Installing gh (GitHub CLI)

## macOS

Download the `.pkg` installer from the releases page — no Homebrew required:

https://github.com/cli/cli/releases/latest

Look for the file ending in `macOS_amd64.pkg` (Intel) or `macOS_arm64.pkg` (Apple Silicon). Double-click to install.

If you have Homebrew:

```bash
brew install gh
```

If you have MacPorts:

```bash
sudo port install gh
```

## Windows

Download the `.msi` installer from https://github.com/cli/cli/releases/latest — this is the most straightforward path.

If winget is available:

```powershell
winget install GitHub.cli
```

If Chocolatey is available:

```powershell
choco install gh
```

## Linux

Debian/Ubuntu — add GitHub's official apt repository:

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

```bash
# Fedora
sudo dnf install gh

# Arch
sudo pacman -S github-cli
```

## Post-install: authenticate

```bash
gh auth login
```

Follow the prompts — choose GitHub.com, then authenticate via browser (recommended) or paste a personal access token.
