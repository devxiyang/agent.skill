# Installing curl

curl is pre-installed on macOS and Windows 10 (version 1803+). Check first:

```bash
curl --version
```

Install only if the command is not found.

## macOS

curl ships with every macOS installation. If the command is somehow missing, it likely indicates a system issue rather than a missing package. Try reinstalling Xcode Command Line Tools:

```bash
xcode-select --install
```

If you need a newer version and have Homebrew:

```bash
brew install curl
```

## Windows

curl is bundled with Windows 10 version 1803+ as `curl.exe`. If missing:

Download from https://curl.se/windows/ and add the binary to your PATH.

If winget is available:

```powershell
winget install cURL.cURL
```

## Linux

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install curl

# Fedora
sudo dnf install curl

# Arch
sudo pacman -S curl

# openSUSE
sudo zypper install curl
```
