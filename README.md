# FolioFinds - Book Marketplace

A modern Next.js application for buying and selling used books with AI-powered features.

## Features

- 📚 Book marketplace with search functionality
- 🔥 Firebase authentication
- 💳 PayPal payment integration
- 🤖 AI-powered chatbot using Google Genkit
- 📱 Responsive design with Tailwind CSS
- 🎨 3D models with Three.js
- 💾 MongoDB database integration

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **Payment**: PayPal
- **AI**: Google Genkit
- **3D Graphics**: Three.js, React Three Fiber
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Firebase project
- PayPal developer account
- Google AI API key

## Environment Variables

Create a `.env` file with the following variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_APP_SECRET=your_paypal_app_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

# Google AI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see above)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Automated Deployment

Run the deployment script:

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Unix/Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Deploy to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

### Required Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

- `MONGODB_URI`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_APP_SECRET`
- `PAYPAL_API_BASE`
- `GOOGLE_GENAI_API_KEY`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Troubleshooting

### Build Issues
- Ensure all environment variables are set
- Run `npm install` to update dependencies
- Check Node.js version (18+ required)

### Deployment Issues
- Verify environment variables in Vercel
- Check build logs for specific errors
- Ensure MongoDB connection string is correct

### Runtime Errors
- Check browser console for client-side errors
- Monitor Vercel function logs for server-side issues
- Verify API keys are valid and not expired
