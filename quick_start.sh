#!/usr/bin/env bash
# QuickEats - Quick Start Script
# Run this file: bash quick_start.sh (on macOS/Linux) or PowerShell on Windows

echo "🚀 QuickEats Quick Start"
echo "========================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js/npm detected"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Check your internet connection."
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Step 2: Verify build
echo "🔨 Building project (this may take a minute)..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Check the error above."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 3: Ready to run
echo "🎯 Project is ready!"
echo ""
echo "To start the development server, run:"
echo ""
echo "    npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "========================"
echo "Happy coding! 🍕"
