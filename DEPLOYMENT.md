# Vercel Deployment Checklist for FolioFinds

## ✅ Pre-deployment Checklist

### Code Preparation
- [x] Updated Next.js configuration for Vercel optimization
- [x] Removed hardcoded credentials from code
- [x] Added proper error handling and boundaries
- [x] Created loading states for better UX
- [x] Fixed MongoDB connection to use environment variables
- [x] Optimized webpack configuration for Genkit and Three.js
- [x] Added .vercelignore file to exclude unnecessary files
- [x] Updated package.json with deployment scripts

### Environment Variables Setup
- [x] All environment variables documented
- [x] Firebase configuration ready
- [x] MongoDB connection string prepared
- [x] PayPal credentials configured
- [x] Google AI API key ready

### Build Verification
- [x] Project builds successfully (`npm run build`)
- [x] No critical build errors
- [x] TypeScript compilation passes
- [x] All dependencies installed correctly

## 🚀 Deployment Steps

### 1. GitHub Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Vercel Setup
1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./ (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 3. Environment Variables in Vercel
Add these in Vercel Dashboard > Project Settings > Environment Variables:

**MongoDB:**
- `MONGODB_URI` = your_mongodb_connection_string

**Firebase:**
- `NEXT_PUBLIC_FIREBASE_API_KEY` = your_firebase_api_key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = your_firebase_auth_domain  
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = your_firebase_project_id
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = your_firebase_storage_bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = your_messaging_sender_id
- `NEXT_PUBLIC_FIREBASE_APP_ID` = your_firebase_app_id

**PayPal:**
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` = your_paypal_client_id
- `PAYPAL_APP_SECRET` = your_paypal_app_secret
- `PAYPAL_API_BASE` = https://api-m.sandbox.paypal.com

**Google AI:**
- `GOOGLE_GENAI_API_KEY` = your_google_genai_api_key

### 4. Deploy
Click "Deploy" in Vercel dashboard

## 🔧 Post-deployment Testing

### Test These Features:
- [ ] Homepage loads correctly
- [ ] User authentication (login/signup)
- [ ] Book browsing and search
- [ ] Shopping cart functionality
- [ ] PayPal payment process
- [ ] AI chatbot responses
- [ ] 3D book models render
- [ ] MongoDB data operations
- [ ] All API routes work

### Monitor:
- [ ] Vercel function logs for errors
- [ ] Browser console for client-side errors
- [ ] Performance metrics
- [ ] Database connections

## 🐛 Troubleshooting

### Common Issues:
1. **Build Failures:**
   - Check environment variables are set
   - Verify MongoDB connection string format
   - Check for missing dependencies

2. **Runtime Errors:**
   - Monitor Vercel function logs
   - Check Firebase configuration
   - Verify API keys are valid

3. **Database Issues:**
   - Ensure MongoDB allows connections from Vercel IPs (0.0.0.0/0)
   - Check connection string format
   - Verify database name and collections exist

4. **3D Model Issues:**
   - Check if Three.js assets are properly loaded
   - Verify WebGL support in browsers

5. **AI/Genkit Issues:**
   - Verify Google AI API key is correct
   - Check API quotas and limits
   - Monitor for rate limiting

## 📝 Notes
- Build time: ~2-3 minutes
- Function timeout: 30 seconds (configured)
- Region: iad1 (US East)
- Node.js version: 18.x (Vercel default)

## 🎉 Success Indicators
- Vercel deployment status shows "Ready"
- All pages load without errors
- Database operations work correctly
- Payment flow functions properly
- AI features respond correctly
