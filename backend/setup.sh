#!/bin/bash

echo "🚀 Setting up TalentHub..."
echo

echo "📦 Installing dependencies..."
npm run install:all

echo
echo "🔧 Running setup script..."
npm run setup

echo
echo "✅ Setup complete! You can now run:"
echo "   npm run dev    # Start development servers"
echo
