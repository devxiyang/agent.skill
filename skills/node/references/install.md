# Installing Node.js

## macOS

Using nvm (recommended — manages multiple versions):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
```

If you have Homebrew:

```bash
brew install node
```

## Windows

Download the installer from https://nodejs.org/en/download — pick the LTS release and run the `.msi` installer. Check "Add to PATH" during installation.

If winget is available:

```powershell
winget install OpenJS.NodeJS.LTS
```

Or use nvm-windows:

```powershell
winget install CoreyButler.NVMforWindows
nvm install lts
nvm use lts
```

## Linux

```bash
# Debian/Ubuntu — via NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs

# Fedora
sudo dnf install nodejs

# Arch
sudo pacman -S nodejs npm
```

Using nvm (all platforms):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
```

## Verify

```bash
node --version
npm --version
```
