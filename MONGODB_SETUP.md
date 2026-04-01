# MongoDB Setup Guide for FarmLink

## Overview
This guide will help you set up MongoDB for the FarmLink application. We'll show you how to install MongoDB locally and connect it to your Node.js backend.

---

## Option 1: MongoDB Community Edition (Local Installation)

### Step 1: Download MongoDB

#### For Windows:
1. Go to https://www.mongodb.com/try/download/community
2. Select your OS (Windows)
3. Download the latest version (MSI Installer recommended)

#### For Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### For Linux (Ubuntu):
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Step 2: Install MongoDB

#### Windows:
1. Run the MSI installer
2. Follow the installation wizard
3. Choose "Install MongoDB as a Service" (recommended)
4. MongoDB will start automatically

#### Mac/Linux:
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 3: Verify Installation

```bash
mongosh
```

You should see a MongoDB shell prompt. If yes, you're good to go!

---

## Option 2: MongoDB Atlas (Cloud - Recommended for Production)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google account
4. Verify your email

### Step 2: Create a Cluster
1. Create Organization and Project
2. Click "Build a Cluster"
3. Select "M0 Free Tier" (free, perfect for learning)
4. Choose your region (closest to you)
5. Click "Create Cluster"
6. Wait for cluster to be created (5-10 minutes)

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Select "Built-in Role" → "readWriteAnyDatabase"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" for development
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Clusters" in the sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `<dbname>` with your database name

Example:
```
mongodb+srv://username:password@cluster0.mongodb.net/farmlink?retryWrites=true&w=majority
```

---

## Backend Setup

### Step 1: Install Dependencies

```bash
npm install mongoose dotenv
```

### Step 2: Create .env File

In your project root, create a file called `.env`:

```bash
# Windows
notepad .env

# Mac/Linux
nano .env
```

Add your MongoDB connection string:

```
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/farmlink

# For MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/farmlink?retryWrites=true&w=majority

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### Step 3: Create Backend Server (server.js)

Create a new file `server.js` in your project root:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

connectDB();

// Define Database Schemas

// Product Schema
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  emoji: String,
  price: Number,
  unit: String,
  farmer: String,
  farmerId: Number,
  dist: Number,
  cat: String,
  qty: Number,
  fresh: Boolean,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now }
});

// Listing Schema (Farmer's Products)
const listingSchema = new mongoose.Schema({
  id: Number,
  name: String,
  emoji: String,
  price: Number,
  unit: String,
  qty: Number,
  status: String,
  orders: Number,
  createdAt: { type: Date, default: Date.now }
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  id: Number,
  name: String,
  emoji: String,
  online: Boolean,
  unread: Number,
  time: String,
  preview: String,
  messages: [
    {
      id: Number,
      from: String,
      text: String,
      time: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

// Create Models
const Product = mongoose.model('Product', productSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const User = mongoose.model('User', userSchema);

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create listing
app.post('/api/listings', async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations
app.get('/api/convos', async (req, res) => {
  try {
    const convos = await Conversation.find();
    res.json(convos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create conversation
app.post('/api/convos', async (req, res) => {
  try {
    const convo = new Conversation(req.body);
    await convo.save();
    res.json(convo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### Step 4: Update package.json

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
```

Then install them:
```bash
npm install
```

### Step 5: Update API Calls in React

Update your React code to use the new MongoDB backend instead of json-server:

In `FarmMarket.jsx`, change:
```javascript
// Old (json-server):
const pRes = await fetch('http://localhost:4000/products');

// New (MongoDB backend):
const pRes = await fetch('http://localhost:5000/api/products');
```

---

## Running Everything Together

### Terminal 1: MongoDB (Local Only)
```bash
# Windows - MongoDB should start automatically as service
# Mac/Linux
mongosh
```

### Terminal 2: Backend
```bash
node server.js
```

### Terminal 3: React Frontend
```bash
npm start
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** 
- Check if MongoDB is running
- Verify connection string in .env
- For Atlas: Check IP whitelist and credentials

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  (Mac/Linux)
netstat -ano | findstr :5000  (Windows)

# Kill the process
kill -9 <PID>  (Mac/Linux)
taskkill /PID <PID> /F  (Windows)
```

### Issue: Cannot Connect to MongoDB Atlas
**Solution:**
- Check internet connection
- Verify IP is whitelisted
- Check username and password (special characters need URL encoding)
- Make sure cluster is running (not paused)

---

## Next Steps

1. **Create More Schemas:** Add schemas for orders, reviews, payments
2. **Add Authentication:** Implement JWT token-based auth
3. **Add Validation:** Use mongoose-validate for data validation
4. **Add Error Handling:** Implement proper error middleware
5. **Deploy:** Deploy to Heroku or AWS

---

## Useful MongoDB Commands

```bash
# Start MongoDB shell
mongosh

# Show all databases
show databases

# Use a database
use farmlink

# Show all collections
show collections

# View all documents
db.products.find()

# Find specific product
db.products.findOne({ name: "Tomatoes" })

# Update document
db.products.updateOne({ name: "Tomatoes" }, { $set: { price: 3.5 } })

# Delete document
db.products.deleteOne({ name: "Tomatoes" })

# Count documents
db.products.countDocuments()
```

---

## Resources

- MongoDB Official Docs: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/
- MongoDB Atlas Tutorial: https://docs.atlas.mongodb.com/
- Express.js Guide: https://expressjs.com/

---

Happy coding! 🚀
