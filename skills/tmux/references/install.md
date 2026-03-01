# Installing tmux

tmux runs on macOS and Linux only. On Windows, use WSL2 (see below).

## macOS

tmux has no official standalone installer for macOS. The available options are:

If you have Homebrew:

```bash
brew install tmux
```

If you have MacPorts:

```bash
sudo port install tmux
```

If neither is available, Homebrew is the recommended path. Install it with:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then retry `brew install tmux`.

## Linux

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install tmux

# Fedora
sudo dnf install tmux

# Arch
sudo pacman -S tmux

# openSUSE
sudo zypper install tmux
```

## Windows (WSL2)

tmux does not run natively on Windows. Use WSL2:

1. Install WSL2 if not present:
   ```powershell
   wsl --install
   ```
2. Open the WSL2 terminal, then:
   ```bash
   sudo apt update && sudo apt install tmux
   ```
