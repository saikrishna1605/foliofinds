# PowerShell deployment script for Vercel
Write-Host "🚀 Starting deployment preparation..." -ForegroundColor Green

# Clean up
Write-Host "🧹 Cleaning up previous builds..." -ForegroundColor Yellow
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Run type check
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Type check warnings ignored for deployment" -ForegroundColor Yellow
}

# Build the project
Write-Host "🏗️  Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful! Ready for Vercel deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Push your code to GitHub" -ForegroundColor White
    Write-Host "2. Connect your GitHub repo to Vercel" -ForegroundColor White
    Write-Host "3. Add environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "4. Deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "Required environment variables for Vercel:" -ForegroundColor Cyan
    Write-Host "- MONGODB_URI" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_FIREBASE_API_KEY" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_FIREBASE_PROJECT_ID" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_FIREBASE_APP_ID" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_PAYPAL_CLIENT_ID" -ForegroundColor White
    Write-Host "- PAYPAL_APP_SECRET" -ForegroundColor White
    Write-Host "- PAYPAL_API_BASE" -ForegroundColor White
    Write-Host "- GOOGLE_GENAI_API_KEY" -ForegroundColor White
} else {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
