# Installing Python

## macOS

macOS ships with Python 3 from Xcode Command Line Tools:

```bash
xcode-select --install
```

To get a newer version, download from https://www.python.org/downloads/mac-osx/ and run the `.pkg` installer — no Homebrew needed.

If you have Homebrew:

```bash
brew install python3
```

## Windows

Download the installer from https://www.python.org/downloads/windows/ — pick the latest stable release and run the `.exe` installer. Check "Add Python to PATH" during installation.

If winget is available:

```powershell
winget install Python.Python.3
```

## Linux

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip

# Arch
sudo pacman -S python
```

## uv (optional, fast package manager)

uv is a fast Python package and environment manager. Install it separately:

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```
