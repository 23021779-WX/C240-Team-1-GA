# Quick Start Guide - NutriGuide

Welcome to NutriGuide! This guide will get you up and running in minutes.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation (2 minutes)

```bash
# Navigate to project directory
cd "C:\Users\Wei Xuan\OneDrive - Republic Polytechnic\Documents\Year 3 AY2025\C240 AI Essentials & Innovations\C240 Team 1 GA"

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will open at `http://localhost:5173`

## 📋 Project Overview

### Pages Available

1. **Home** - Landing page with features and sample questions
2. **Chat Bot** - Interactive chatbot interface
3. **Contact** - Contact form and information

### Key Features

✅ Navigation bar with company logo  
✅ Minimalistic, professional design  
✅ Responsive on all devices  
✅ Sample questions for common allergies  
✅ Interactive chatbot interface  
✅ Contact page with form  

## 🔧 Customization

### 1. Change Company Logo
Edit `src/components/Navigation.jsx`:
```javascript
<span className="logo-text">YOUR_LOGO_HERE</span>
<span className="company-name">Your Company Name</span>
```

### 2. Update Colors
Edit CSS files and change:
- Primary Color: `#667eea` → Your color
- Secondary Color: `#2c5aa0` → Your color

### 3. Add Sample Questions
Edit `src/components/SampleQuestions.jsx`:
```javascript
const questions = [
  "Your question here?",
  // Add more questions
]
```

### 4. Update Contact Info
Edit `src/pages/Contact.jsx` with your:
- Email address
- Phone number
- Location
- Operating hours

## 🤖 Connect Flowwise Chatbot

### Step 1: Get Flowwise Credentials
1. Log into your Flowwise dashboard
2. Find your Bot ID and API Key
3. Note your API endpoint

### Step 2: Create .env File
Create a `.env` file in the project root:
```
VITE_FLOWWISE_API_URL=your_api_url
VITE_FLOWWISE_BOT_ID=your_bot_id
VITE_FLOWWISE_API_KEY=your_api_key
```

### Step 3: Update ChatBot Component
See `FLOWWISE_INTEGRATION.md` for detailed integration steps.

### Step 4: Test
```bash
npm run dev
# Test the chatbot on the Chat Bot page
```

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

## 🎨 File Structure

```
project-root/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx        (Top navigation bar)
│   │   ├── Navigation.css
│   │   ├── SampleQuestions.jsx   (Sample questions display)
│   │   └── SampleQuestions.css
│   ├── pages/
│   │   ├── Home.jsx              (Landing page)
│   │   ├── Home.css
│   │   ├── ChatBot.jsx           (Chat interface)
│   │   ├── ChatBot.css
│   │   ├── Contact.jsx           (Contact page)
│   │   └── Contact.css
│   ├── App.jsx                   (Main app component)
│   ├── App.css
│   ├── main.jsx                  (Entry point)
│   └── index.css                 (Global styles)
├── README.md                     (Full documentation)
├── FLOWWISE_INTEGRATION.md       (Chatbot integration guide)
├── package.json                  (Dependencies)
├── vite.config.js               (Build configuration)
└── index.html                   (HTML template)
```

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Issue: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Issue: Changes not reflecting
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Or do a hard refresh (Ctrl+Shift+R)
```

## 📱 Testing on Mobile

### Local Network Access
1. Find your computer's IP address:
```bash
ipconfig
```

2. Access from mobile:
```
http://YOUR_IP_ADDRESS:5173
```

## 💡 Tips

- Use the Sample Questions to pre-fill the chatbot
- The contact form currently displays a success message (no actual email sent)
- Animations are smooth and optimized for performance
- All code is well-commented for easy customization

## 📚 Documentation

- **Full README**: See `README.md` for complete documentation
- **Flowwise Integration**: See `FLOWWISE_INTEGRATION.md` for chatbot setup
- **Vite Documentation**: https://vitejs.dev
- **React Documentation**: https://react.dev

## 🤝 Support

- Email: support@nutriguide.com
- Check the documentation files in the project
- Review the inline code comments

## ⚡ Performance Tips

- The site uses lazy loading for images
- CSS animations are GPU-accelerated
- Chatbot uses debouncing to prevent excessive API calls
- Production build is optimized with code splitting

## 🔐 Security Notes

- Never commit `.env` files to version control
- Always use HTTPS in production
- Validate all user inputs
- Keep dependencies updated: `npm audit fix`

## 📈 Next Steps

1. Customize the design to match your brand
2. Integrate your Flowwise chatbot
3. Deploy to a hosting service (Vercel, Netlify, etc.)
4. Monitor chatbot conversations and improve responses
5. Add user authentication for conversation history

Enjoy building with NutriGuide! 🥗
