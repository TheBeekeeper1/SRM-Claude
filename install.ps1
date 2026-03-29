# Installation script for Honey SRM on Windows

Write-Host "🍯 Honey SRM - Installation for Windows" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install npm packages
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create .env.local from .env.local.example"
    Write-Host "2. Add your Supabase credentials"
    Write-Host "3. Run 'npm run dev' to start development server"
    Write-Host "4. Open http://localhost:3000"
} else {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    exit 1
}
