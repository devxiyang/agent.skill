# Installing jq

## macOS

```bash
brew install jq
```

If Homebrew is not installed, download the binary from https://jqlang.github.io/jq/download/ and place it in `/usr/local/bin`.

## Windows

If winget is available:

```powershell
winget install jqlang.jq
```

Download the binary directly from https://jqlang.github.io/jq/download/ — pick `jq-windows-amd64.exe`, rename to `jq.exe`, and add its location to PATH.

If Chocolatey is available:

```powershell
choco install jq
```

## Linux

```bash
# Debian/Ubuntu
sudo apt install jq

# Fedora
sudo dnf install jq

# Arch
sudo pacman -S jq
```
