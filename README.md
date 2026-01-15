# NOM BOT - Dietary & Allergy Chatbot Website

A professional, minimalistic React-based website for dietary and allergy guidance with an integrated chatbot assistant.

## Features

✨ **Key Features:**
- **Responsive Navigation Bar** - Easy navigation with logo and contact page
- **Home Page** - Hero section with feature overview and sample questions
- **Interactive Chatbot** - Real-time chat interface for dietary and allergy queries
- **Sample Questions** - Quick-access common questions about allergies
- **Contact Page** - Professional contact form for user inquiries
- **Minimalistic Design** - Clean, modern UI with smooth animations
- **Mobile Responsive** - Works seamlessly on all devices

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── Navigation.css
│   │   ├── SampleQuestions.jsx
│   │   └── SampleQuestions.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── ChatBot.jsx
│   │   ├── ChatBot.css
│   │   ├── Contact.jsx
│   │   └── Contact.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Installation

1. Navigate to the project directory
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Flowwise Chatbot Integration

To integrate your Flowwise chatbot, follow these steps:

### 1. Get Your Flowwise Configuration
- Log into your Flowwise dashboard
- Navigate to your chatbot settings
- Note your **Bot ID** and **API Key**
- Note the **Embed URL** or **API Endpoint**

### 2. Update ChatBot.jsx

Replace the `generateBotResponse` function with actual Flowwise API calls. Here's an example:

```javascript
const handleSendMessage = async (e) => {
  e.preventDefault()
  
  if (!inputValue.trim()) return
  
  const userMessage = {
    type: 'user',
    text: inputValue
  }
  setMessages([...messages, userMessage])
  setInputValue('')
  setIsLoading(true)
  
  try {
    // Replace with your Flowwise API endpoint
    const response = await fetch('YOUR_FLOWWISE_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        question: inputValue,
        // Include other required parameters from Flowwise
      })
    })
    
    const data = await response.json()
    const botMessage = {
      type: 'bot',
      text: data.text // or whatever Flowwise returns
    }
    setMessages(prev => [...prev, botMessage])
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = {
      type: 'bot',
      text: 'Sorry, I encountered an error. Please try again.'
    }
    setMessages(prev => [...prev, errorMessage])
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Alternative: Embed Flowwise Widget

You can also embed Flowwise directly as an iframe or widget:

```javascript
// Add to ChatBot.jsx
<iframe
  src="YOUR_FLOWWISE_EMBED_URL"
  style={{ width: '100%', height: '100%', border: 'none' }}
  title="Flowwise Chatbot"
></iframe>
```

## Customization

### Change Company Logo
Edit the Navigation.jsx component to replace the 🥗 emoji with your actual logo:
```javascript
<span className="logo-text">YOUR_LOGO_HERE</span>
```

### Update Company Name
Change "NutriGuide" in Navigation.jsx to your company name

### Customize Colors
Edit the CSS files to change the color scheme. Main colors used:
- Primary: `#667eea` (Purple)
- Secondary: `#2c5aa0` (Blue)
- Background: `#f5f7fa` (Light)

### Add/Modify Sample Questions
Update the `questions` array in [src/components/SampleQuestions.jsx](src/components/SampleQuestions.jsx)

### Update Contact Information
Modify contact details in [src/pages/Contact.jsx](src/pages/Contact.jsx)

## Environment Variables

Create a `.env` file in the root directory if needed:

```
VITE_FLOWWISE_API_URL=your_flowwise_api_url
VITE_FLOWWISE_BOT_ID=your_bot_id
VITE_FLOWWISE_API_KEY=your_api_key
```

Then access in your code:
```javascript
const API_URL = import.meta.env.VITE_FLOWWISE_API_URL
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **CSS3** - Styling with animations
- **JavaScript ES6+** - Modern JavaScript

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Important Notes

⚠️ **Disclaimer**: This application provides general information only. Always consult with a healthcare professional for medical advice regarding allergies and dietary concerns.

## Future Enhancements

- [ ] User authentication and history
- [ ] Database to store conversations
- [ ] Advanced allergy database integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Analytics dashboard
- [ ] Mobile app version

## Support

For technical support or questions, contact support@nutriguide.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.
