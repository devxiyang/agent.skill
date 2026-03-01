# Installing git

## macOS

The simplest way — install Xcode Command Line Tools, which includes git:

```bash
xcode-select --install
```

A dialog will appear asking to install the tools. No Homebrew or admin configuration needed beyond the standard macOS install prompt.

If you already have Homebrew:

```bash
brew install git
```

As a last resort, download the macOS installer from https://git-scm.com/download/mac.

After installing, configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Windows

Download the installer from https://git-scm.com/download/win and run it — this is the most straightforward path.

If winget is available:

```powershell
winget install Git.Git
```

If Chocolatey is available:

```powershell
choco install git
```

After installing, restart your terminal and configure identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Linux

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git

# openSUSE
sudo zypper install git
```
