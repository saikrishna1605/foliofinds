# FolioFinds - Book Marketplace

A modern Next.js application for buying and selling used books with AI-powered features and beautiful dark mode support.

## ✨ Features

- 📚 **Book Marketplace** - Browse, search, and buy used books
- 🔥 **Firebase Authentication** - Secure user registration and login
- 💳 **PayPal Integration** - Secure payment processing
- 🤖 **AI-Powered Chatbot** - Google Genkit powered assistance
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark Mode Support** - Beautiful theme switching
- 💾 **MongoDB Database** - Reliable data storage
- ⚡ **Fast Performance** - Optimized for speed

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth
- **Payment**: PayPal API
- **AI**: Google Genkit with Gemini
- **Deployment**: Vercel (optimized)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas database
- Firebase project
- PayPal developer account
- Google AI API key

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Folio

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_APP_SECRET=your_paypal_app_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

# Google AI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd foliofinds
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see above)

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Option 1: Vercel (Recommended)

**Automatic Deployment:**
1. Push your code to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy automatically

**Manual Deployment:**
```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Option 2: Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables
5. Deploy

## 📁 Project Structure

```
foliofinds/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   └── ai/                  # AI/Genkit integrations
├── public/                  # Static assets
├── docs/                    # Documentation
└── deployment/              # Deployment scripts
```

## 🎯 Key Features Explained

### Book Marketplace
- Browse books by category
- Search functionality
- Book details with images
- Seller information

### User Authentication
- Firebase-powered login/signup
- Protected routes
- User profiles

### AI Chatbot
- Google Genkit integration
- Contextual responses
- Book recommendations

### Payment System
- PayPal integration
- Secure checkout
- Order tracking

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clean and reinstall
npm run clean
npm install
npm run build
```

**Development Server Issues:**
```bash
# Kill all Node processes
taskkill /f /im node.exe

# Clear Next.js cache
rm -rf .next
npm run dev
```

**Database Connection:**
- Verify MongoDB URI is correct
- Check network access settings
- Ensure database exists

### Performance Optimization

- ✅ Removed 3D model dependencies
- ✅ Optimized bundle size
- ✅ Webpack optimizations
- ✅ Image optimization
- ✅ Code splitting

## 📊 Performance Metrics

- **Bundle Size**: ~406KB (optimized)
- **First Load JS**: 406KB
- **Build Time**: ~30 seconds
- **Development Server**: Fast refresh enabled

## 🔒 Security Features

- Environment variable protection
- Firebase security rules
- PayPal secure payments
- MongoDB connection security
- Input validation with Zod

## 🌟 Recent Updates

- ✅ **Fixed OpenTelemetry errors**
- ✅ **Removed 3D model dependencies**
- ✅ **Added dark mode support**
- ✅ **Optimized performance**
- ✅ **Fixed webpack issues**
- ✅ **Ready for production deployment**

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review deployment logs
3. Verify environment variables
4. Check browser console for errors

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**FolioFinds** - Your next adventure is just a page turn away! 📚✨
