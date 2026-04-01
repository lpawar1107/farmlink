# MongoDB Setup Guide for Windows 11 - FarmLink

## Quick Start (5 minutes)

Choose one of two options:
1. **MongoDB Cloud (FREE)** - No installation, instant setup ⚡ (Recommended for beginners)
2. **MongoDB Local** - Install on your Windows 11 machine

---

## ⚡ Option 1: MongoDB Cloud (Atlas) - Recommended

### Why Cloud MongoDB?
- ✅ Free tier with 512MB storage
- ✅ No installation needed
- ✅ Automatic backups
- ✅ Easy to deploy to production
- ✅ Works immediately

### Step 1: Create Free Account

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **Sign Up Free**
3. Fill in your details:
   - Email
   - Password (strong - letters, numbers, symbols)
   - Product interest: "Don't specify"
4. Click **Create Account**
5. Verify your email (click link in email)

### Step 2: Create Your First Cluster

1. After login, click **Create** (green button)
2. Choose **M0 Sandbox** (Free tier)
3. Select **Cloud Provider**: AWS
4. Select **Region**: Choose nearest to you
   - For India: `ap-south-1` (Mumbai)
5. Click **Create Deployment**
6. Wait 2-3 minutes for cluster to deploy ⏳

### Step 3: Set Up Database Access

1. In left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Fill in:
   - **Username**: `farmlink`
   - **Password**: Make strong password (save this!)
   - **Built-in Role**: `Atlas admin`
4. Click **Add User**

### Step 4: Configure Network Access

1. In left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere**
   - Click **Confirm**
4. Wait 1-2 minutes for changes to apply

### Step 5: Get Connection String

1. Go to **Databases** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Drivers** tab
4. Select **Node.js** and version **4.x**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://farmlink:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>` with YOUR password** you created earlier

### Step 6: Add Connection String to .env

1. Open your project's **.env** file
2. Add:
   ```
   MONGODB_URI=mongodb+srv://farmlink:<password>@cluster0.xxxxx.mongodb.net/farmlink?retryWrites=true&w=majority
   ```
3. Replace with your actual password and cluster details

### Step 7: Update server.js

Replace the in-memory database with MongoDB connection:

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
      console.log('⚠️  No MongoDB configured, using mock data');
      return;
    }
    
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB Connected via Atlas!');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('📌 Using mock data fallback');
  }
};

connectDB();

// Define Schemas
const ProductSchema = new mongoose.Schema({
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

const Product = mongoose.model('Product', ProductSchema);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FarmLink Backend Running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌾 FarmLink Backend Server Running on port ${PORT}`);
  console.log(`📝 Visit: http://localhost:${PORT}/api/health`);
});
```

### Step 8: Install Mongoose

```bash
npm install mongoose
```

### Step 9: Test Connection

```bash
npm run server
```

You should see:
```
✅ MongoDB Connected via Atlas!
🌾 FarmLink Backend Server Running on port 5000
```

---

## 🖥️  Option 2: MongoDB Local Installation (Windows 11)

### Step 1: Download MongoDB

1. Go to **https://www.mongodb.com/try/download/community**
2. Select:
   - **Version**: Latest (8.0 or higher)
   - **OS**: Windows
   - **Package**: MSI
3. Click **Download**
4. You'll get: `mongodb-windows-x86_64-8.0.0-signed.msi` (about 250MB)

### Step 2: Install MongoDB

1. **Open Downloaded File**: Double-click the MSI file
2. **Follow Installation Wizard**:
   - Click **Next**
   - Accept License Agreement: Check box → **Next**
   - Install Path: Keep default `C:\Program Files\MongoDB\Server\8.0`
   - Click **Next**
3. **Service Configuration**:
   - ✅ Check **Install MongoDB as a Service**
   - ✅ Check **Run the service as Network Service user**
   - Click **Next**
4. **MongoD Configuration**:
   - Check **Install MongoDB Compass** (GUI tool - helpful!)
   - Click **Next**
5. **Finish Installation**:
   - Click **Install**
   - Wait for installation to complete
   - Click **Finish**

### Step 3: Verify Installation

Open **PowerShell as Administrator** and run:

```powershell
mongod --version
```

You should see: `mongod version v8.0.0`

### Step 4: Start MongoDB Service

MongoDB should auto-start as a Windows service. To manually start:

```powershell
net start MongoDB
```

To verify it's running:
```powershell
Get-Service MongoDB
```

Look for: `Status: Running`

### Step 5: Connect to MongoDB

Open a **new PowerShell** and run:

```bash
mongosh
```

You should see the MongoDB shell prompt:
```
test>
```

Type `exit` to close it.

### Step 6: Update .env File

In your project's **.env** file:

```
MONGODB_URI=mongodb://localhost:27017/farmlink
NODE_ENV=development
```

### Step 7: Install Mongoose (if not already installed)

```bash
npm install mongoose
```

### Step 8: Test Connection

```bash
npm run server
```

Should show:
```
✅ MongoDB Connected!
🌾 FarmLink Backend Server Running on port 5000
```

---

## 📊 MongoDB Compass (GUI Tool)

MongoDB Compass is like phpMyAdmin for MongoDB - see your data visually.

### Open Compass
- Windows Start Menu → Search **MongoDB Compass**
- Click to open
- It automatically connects to `localhost:27017`

### Browse Your Data:
1. Click your **farmlink** database
2. Click a collection (products, listings, etc.)
3. See all documents (records) in a table view
4. Click any document to view/edit

---

## 🔗 Connection Strings Reference

### Cloud (Atlas)
```
mongodb+srv://farmlink:PASSWORD@cluster.xxxxx.mongodb.net/farmlink?retryWrites=true&w=majority
```

### Local
```
mongodb://localhost:27017/farmlink
```

### Local with Authentication
```
mongodb://farmlink:password@localhost:27017/farmlink
```

---

## 🚨 Troubleshooting

### Problem: "mongosh: command not found" on Windows
**Solution:**
1. Open PowerShell **as Administrator**
2. Run: `$env:PATH`
3. Look for: `C:\Program Files\MongoDB\Server\8.0\bin`
4. If not there, add it manually (restart PowerShell after)

### Problem: "Connection refused" on localhost:27017
**Solution:**
1. Check MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```
2. If not running, start it:
   ```powershell
   net start MongoDB
   ```
3. Restart your backend:
   ```bash
   npm run server
   ```

### Problem: Atlas connection timeout
**Solution:**
1. Check Network Access in Atlas dashboard (allow your IP)
2. Verify connection string has correct password
3. Check internet connection
4. Try: `mongodb+srv://username:[email protected]/dbname`

### Problem: "Authentication failed"
**Solution:**
1. Verify username/password in connection string
2. Check it matches Database Access user in Atlas
3. Make sure password is URL-encoded if it has special chars
4. Test in MongoDB Compass first

### Problem: Connection works but can't see data
**Solution:**
1. Data created in local MongoDB won't be in Atlas (different servers)
2. Data created in Atlas won't be in local (different servers)
3. Check both places:
   - Local: MongoDB Compass → localhost
   - Cloud: Atlas → Collections

---

## 📋 Setup Checklist

### For Cloud (Recommended):
- [ ] Created MongoDB Atlas account
- [ ] Created M0 Sandbox cluster
- [ ] Created database user (farmlink)
- [ ] Added network access (Allow Anywhere)
- [ ] Got connection string
- [ ] Updated .env with MONGODB_URI
- [ ] npm install mongoose
- [ ] npm run server → See "Connected"

### For Local:
- [ ] Downloaded MongoDB MSI
- [ ] Installed as Windows Service
- [ ] Verified with `mongosh`
- [ ] Updated .env with localhost connection
- [ ] npm install mongoose
- [ ] npm run server → See "Connected"

---

## 🚀 Next Steps

After setup, your app can now:
1. ✅ Save products to database
2. ✅ Save listings to database
3. ✅ Save conversations to database
4. ✅ Data persists after server restart
5. ✅ Ready to deploy to production!

### To Deploy to Vercel/Heroku:
1. Keep MongoDB Atlas connection string in .env
2. Set NODE_ENV=production
3. Deploy with `vercel deploy` or `git push`
4. Data automatically saves to cloud!

---

## 📞 Quick Reference

**Start MongoDB (Windows 11):**
```powershell
net start MongoDB
```

**Stop MongoDB:**
```powershell
net stop MongoDB
```

**Connect locally:**
```bash
mongosh
```

**Connect to cloud:**
```bash
mongosh "mongodb+srv://farmlink:PASSWORD@cluster.xxxxx.mongodb.net/farmlink"
```

**Test backend:**
```bash
curl http://localhost:5000/api/health
```

---

## Resources

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- MongoDB Compass: https://www.mongodb.com/products/compass
- Atlas (Cloud): https://www.mongodb.com/cloud/atlas

---

**Questions? Common solutions above! MongoDB is ready after setup!** 🎉
