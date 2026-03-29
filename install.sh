#!/bin/bash

# Installation script for Honey SRM

echo "🍯 Honey SRM - Installation Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy .env.local.example to .env.local"
    echo "2. Add your Supabase credentials to .env.local"
    echo "3. Run 'npm run dev' to start the development server"
    echo "4. Open http://localhost:3000 in your browser"
else
    echo "❌ Installation failed"
    exit 1
fi
