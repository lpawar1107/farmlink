# FarmLink Setup & Features Guide

## 🎉 New Features Added

### ✅ 1. Language Translation System
- **Multi-language support:** English, Hindi, Marathi, Tamil, Telugu
- **Fully integrated:** ALL UI text changes based on language selection
- Simply select a language from the dropdown at the top
- All navigation, buttons, labels, and messages update instantly

### ✅ 2. Messaging System Fixed
- Messages tab now works perfectly in bottom navigation
- Click "Messages 💬" to view all conversations
- Shows unread count badge
- Full chat interface with real-time messaging
- Auto-replies after 1.5 seconds

### ✅ 3. Currency Tab Removed
- Simplified the header interface
- Only language selector remains
- Prices are now in US dollars ($)

### ✅ 4. Backend Server Setup
- New Express.js backend server (`server.js`)
- MongoDB setup guide included (`MONGODB_SETUP.md`)
- API endpoints for products, listings, conversations
- Ready to integrate with MongoDB

---

## 🚀 How to Run the Project

### Option 1: Quick Start (Using Mock API)

```bash
# Install dependencies
npm install

# Start both React and Mock JSON API
npm run dev

# Open http://localhost:3000 in browser
```

**This uses:** 
- React frontend on port 3000
- JSON Server on port 4000

---

### Option 2: Using Backend Server (Recommended)

#### Terminal 1: Start Backend Server
```bash
npm run server
```

Output:
```
🚀 FarmLink Backend Server Running
http://localhost:5000
```

#### Terminal 2: Start React Frontend
```bash
npm start
```

**Runs on:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 🌍 Language System

### How to Test Language Features

1. Open the app at `http://localhost:3000`
2. Look at the top header - you'll see "Language:" dropdown
3. Select different languages to see the entire UI change:
   - **English** - Default
   - **हिंदी (Hindi)** - Indian language
   - **मराठी (Marathi)** - Indian language
   - **தமிழ் (Tamil)** - Indian language
   - **తెలుగు (Telugu)** - Indian language

### Supported Translations

The following text elements are translated:

**Navigation:**
- Home, Map, Cart, Messages, Profile

**Labels:**
- Product Name, Price, Unit, Quantity, Category
- Settings, Language selector

**Buttons:**
- Add to Cart, Chat, List My Produce, Sign In/Out

**Messages:**
- "Fresh Today", "Locally Grown", "Available"
- Success messages, error messages

**Section Titles:**
- Nearby Produce, My Dashboard, My Listings
- Manage Listings and Orders

---

## 💬 Messaging System

### How to Test Messages

1. Click the **"Messages 💬"** tab in bottom navigation
2. You'll see a list of conversations
3. Click on any conversation to open the chat
4. Type a message and send
5. Auto-reply will come back after 1.5 seconds
6. Badge shows unread message count

### Features:
- ✅ Conversation list with preview
- ✅ Online/offline status indicators
- ✅ Unread message badge
- ✅ Real-time chat interface
- ✅ Auto-reply simulation
- ✅ Quick reply suggestions
- ✅ Timestamps for all messages

---

## 🗄️ Backend Server Setup

### Available Endpoints

#### Products
```
GET    /api/products           - Get all products
GET    /api/products/:id       - Get single product
POST   /api/products           - Create product
PUT    /api/products/:id       - Update product
DELETE /api/products/:id       - Delete product
```

#### Listings
```
GET    /api/listings           - Get all listings
GET    /api/listings/:id       - Get single listing
POST   /api/listings           - Create listing
PUT    /api/listings/:id       - Update listing
DELETE /api/listings/:id       - Delete listing
```

#### Conversations
```
GET    /api/convos             - Get all conversations
GET    /api/convos/:id         - Get single conversation
POST   /api/convos             - Create conversation
PUT    /api/convos/:id         - Update conversation
DELETE /api/convos/:id         - Delete conversation
```

#### Health Check
```
GET    /api/health             - Check server status
```

### Example API Calls

```bash
# Get all products
curl http://localhost:5000/api/products

# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Carrots",
    "emoji": "🥕",
    "price": 1.5,
    "unit": "kg",
    "qty": 50
  }'

# Update a product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 2.0}'
```

---

## 🗄️ MongoDB Setup

For full integration with MongoDB database:

1. **Read the setup guide:**
   - Open `MONGODB_SETUP.md` in project root
   - Follow step-by-step instructions

2. **Two options:**
   - **Local MongoDB:** Install on your machine
   - **MongoDB Atlas:** Cloud-based (free tier available)

3. **Connect to backend:**
   - Update `.env` file with MongoDB connection string
   - Modify `server.js` to use Mongoose models
   - See `MONGODB_SETUP.md` for complete code examples

---

## 📝 Configuration

### .env File
```
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Change API Server
If using different backend:
```javascript
// In .env
REACT_APP_API_URL=http://your-backend-url/api
```

---

## 🔧 Troubleshooting

### Issue: Language not changing
**Solution:**
- Check browser console for errors (F12)
- Verify `t()` function is being called
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Messages not working
**Solution:**
- Make sure you're on `/messages` route
- Check if conversations data is loaded
- Click on a conversation to open chat

### Issue: Backend not connecting
**Solution:**
```bash
# Check if server is running
curl http://localhost:5000/api/health

# Restart backend
npm run server

# Check console for errors
```

### Issue: Port already in use
**Solution:**
```bash
# Kill process using port 5000
lsof -i :5000  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=5001 npm run server
```

---

## 📚 Project Structure

```
farmlink/
├── src/
│   ├── FarmMarket.jsx          ← Main component with language integration
│   ├── App.js
│   ├── component/
│   │   ├── Header.jsx          ← Updated with language support
│   │   ├── ChatScreen.jsx
│   │   ├── ProductCard.jsx
│   │   └── ...
├── server.js                    ← Backend server
├── package.json                 ← Updated with new scripts
├── .env                         ← Configuration file
├── MONGODB_SETUP.md            ← MongoDB guide
└── PROJECT_GUIDE.html          ← Detailed documentation
```

---

## ✨ Available npm Scripts

```bash
# Start with Mock API (json-server)
npm run dev

# Start React only
npm start

# Start Backend Server only
npm run server

# Start Backend + React (recommended)
npm run server-dev

# Build for production
npm build

# Run tests
npm test
```

---

## 🎯 Next Steps

1. **Test All Languages** 🌐
   - Select each language and verify all text changes
   - Test on different screen sizes

2. **Test Messaging** 💬
   - Open conversations
   - Send and receive messages
   - Check auto-replies work

3. **Setup MongoDB** 🗄️
   - Follow `MONGODB_SETUP.md`
   - Connect backend to real database
   - Persist data permanently

4. **Add More Features** ✨
   - Add payment integration
   - Add user authentication
   - Add real-time notifications
   - Add order tracking

---

## 📞 API Documentation

For detailed API documentation and examples, see endpoints listed above.

### Testing API with curl or Postman:
1. Start backend: `npm run server`
2. Use endpoints like:
   ```
   http://localhost:5000/api/products
   http://localhost:5000/api/listings
   http://localhost:5000/api/convos
   ```

---

## 🚀 Deployment

To deploy to production:

### Frontend
```bash
npm run build
# Deploy 'build' folder to Vercel, Netlify, or GitHub Pages
```

### Backend
Deploy server.js to:
- Heroku
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- Google Cloud
- Railway

---

## 💡 Tips & Best Practices

1. **Always test in console (F12)** for errors
2. **Keep .env file secure** (add to .gitignore)
3. **Use backend for persistent data** (not mock API)
4. **Test all languages** before releasing
5. **Check mobile responsiveness** (the design is mobile-first)

---

## ❓ FAQ

**Q: Can I switch between Mock API and Backend?**
A: Yes! The app tries backend first, then falls back to mock API if unavailable.

**Q: Where are translations stored?**
A: In `FarmMarket.jsx` in the `TRANSLATIONS` object.

**Q: How to add a new language?**
A: Add new language object to `TRANSLATIONS` and update `LANGUAGES` object.

**Q: Can I use this without MongoDB?**
A: Yes! Backend server works with in-memory data. MongoDB is optional for persistence.

---

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Check server console logs
3. Review error messages carefully
4. Restart servers
5. Clear browser cache

---

Happy coding! 🎉
