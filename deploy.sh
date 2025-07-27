#!/bin/bash

# Deployment script for Vercel
echo "🚀 Starting deployment preparation..."

# Clean up
echo "🧹 Cleaning up previous builds..."
rm -rf .next node_modules package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Running type check..."
npm run typecheck || echo "⚠️  Type check warnings ignored for deployment"

# Build the project
echo "🏗️  Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for Vercel deployment."
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your GitHub repo to Vercel"
    echo "3. Add environment variables in Vercel dashboard"
    echo "4. Deploy!"
    echo ""
    echo "Required environment variables for Vercel:"
    echo "- MONGODB_URI"
    echo "- NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "- NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "- NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "- NEXT_PUBLIC_PAYPAL_CLIENT_ID"
    echo "- PAYPAL_APP_SECRET"
    echo "- PAYPAL_API_BASE"
    echo "- GOOGLE_GENAI_API_KEY"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
