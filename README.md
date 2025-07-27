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
   Navigate to [http://localhost:3001](http://localhost:3001)


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
