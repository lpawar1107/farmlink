# MongoDB Setup Guide for Windows 11 - FarmLink

## ⚡ Quick Start (Choose One)

| Option | Difficulty | Time | When to Use |
|--------|-----------|------|-------------|
| **Cloud (Atlas)** | ⭐ Easy | 5 min | ✅ **Recommended** - No installation |
| **Local Windows** | ⭐⭐ Medium | 10 min | Testing locally, faster dev |

---

## **Option 1: MongoDB Cloud (Atlas) - RECOMMENDED** ⭐

### Why Cloud?
✅ **Free 512MB tier**  
✅ **No installation needed**  
✅ **Automatic backups**  
✅ **Deploy to production easily**  
✅ **Perfect for Windows users**  

### Step 1: Create Atlas Account (2 minutes)

1. Go → https://www.mongodb.com/cloud/atlas
2. Click **Sign Up Free**
3. Enter:
   - Email
   - Password (strong one!)
   - Checkbox: "I agree..."
4. Click **Create My Atlas Account**
5. **Check your email** → Click verification link

### Step 2: Create Free Cluster (3 minutes)

1. After email verified, click big green **+ Create** button
2. Select **M0 Sandbox** (Free tier)
3. Choose settings:
   - **Provider**: AWS ✓
   - **Region**: `ap-south-1` (Mumbai) if in India, else nearest
4. Click **Create Cluster**
5. ⏳ **Wait 2-3 minutes** for deployment

### Step 3: Create Database User

1. Left sidebar → **Database Access**
2. Click **Add New Database User**
3. Fill in:
   - **Username**: `farmlink`
   - **Password**: `YourSecurePassword#123` (save it!)
   - **Role**: `Atlas admin`
4. Click **Add User**

### Step 4: Allow Network Access

1. Left sidebar → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere**
4. Click **Confirm**

### Step 5: Get Connection String

1. **Databases** → **Connect** on your cluster
2. Click **Drivers** tab
3. Select **Node.js** version **4.x**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://farmlink:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>` with your actual password**

### Step 6: Update .env File

Edit `c:\Users\hp\farmlink\.env`:

```
MONGODB_URI=mongodb+srv://farmlink:YourSecurePassword#123@cluster0.xxxxx.mongodb.net/farmlink?retryWrites=true&w=majority
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Step 7: Install Mongoose

```bash
npm install mongoose
```

### Step 8: Update server.js

Replace entire `server.js` with:

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected!'))
.catch(err => {
  console.log('⚠️ Using mock data:', err.message);
});

// Define Schemas
const productSchema = new mongoose.Schema({
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

const Product = mongoose.model('Product', productSchema);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
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

// Similar endpoints for listings and conversations...
// (Add PUT, DELETE methods as needed)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌾 FarmLink Backend Running on port ${PORT}`);
});
```

### Step 9: Start Server

```bash
npm run server
```

Should show: **✅ MongoDB Atlas Connected!**

### Step 10: Verify

```bash
curl http://localhost:5000/api/health
```

Should show: `{"status":"OK","database":"Connected"}`

✅ **Done! MongoDB Cloud is ready!**

---

## **Option 2: MongoDB Local Installation**

### Requirements
- Windows 11
- ~250MB disk space
- Administrative privileges

### Step 1: Download MongoDB

1. Go → https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (8.0+)
   - **OS**: Windows
   - **Package**: MSI
3. Click **Download**
4. (File is ~250MB)

### Step 2: Install MongoDB

1. **Open the .msi file**
2. Accept License → **Next**
3. **Install Type**: Complete Install → **Next**
4. **Service Configuration**:
   - ✅ Install as Service
   - ✅ Run service as Network Service user
5. **MongoDB Compass**: ✅ Check (GUI tool)
6. Click **Install**
7. ⏳ Wait 2-3 minutes
8. Click **Finish**

### Step 3: Verify Installation

Open **PowerShell as Admin**:

```powershell
mongod --version
```

Should show: `mongod version v8.0.0` (or similar)

### Step 4: Start MongoDB Service

```powershell
Get-Service MongoDB
```

Should show: `Status: Running`

If stopped:
```powershell
net start MongoDB
```

### Step 5: Connect to Database

```bash
mongosh
```

Should show: `test>` prompt

Type `exit` to close.

### Step 6: Update .env

```
MONGODB_URI=mongodb://localhost:27017/farmlink
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Step 7: Install Mongoose

```bash
npm install mongoose
```

### Step 8: Use Same server.js as Option 1

Use the same updated `server.js` code from **Option 1, Step 8**

Just change connection line:
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmlink', {...})
```

### Step 9: Start Server

```bash
npm run server
```

Should show: **✅ MongoDB Connected!**

---

## 📊 MongoDB Compass - Visual Database Tool

MongoDB Compass = Excel for MongoDB

### Open Compass

1. Windows Start Menu → Search **MongoDB Compass**
2. Click to open
3. Connection: `mongodb://localhost:27017` (for local)
4. Click **Connect**

### Use Compass

1. Click **farmlink** database
2. Click **products** collection
3. See all records in table
4. Click any to edit/view details

---

## 🔗 Connection Strings

**Cloud (Atlas):**
```
mongodb+srv://farmlink:PASSWORD@cluster0.xxxxx.mongodb.net/farmlink?retryWrites=true&w=majority
```

**Local:**
```
mongodb://localhost:27017/farmlink
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Connection Timeout (Atlas)** | Check Network Access allows your IP |
| **"mongosh: command not found"** | Restart PowerShell, MongoDB not in PATH |
| **Port 27017 Already in Use** | MongoDB already running, or another app using it |
| **"Authentication failed"** | Wrong password, check .env file |
| **Can't see saved data** | Check you're connected to right database (local vs cloud) |

---

## ✅ Checklist

- [ ] Chose Option 1 (Cloud) or Option 2 (Local)
- [ ] Created account / Installed MongoDB
- [ ] Created user credentials
- [ ] Got connection string / Confirmed local running
- [ ] Updated .env file
- [ ] Installed mongoose: `npm install mongoose`
- [ ] Updated server.js with MongoDB code
- [ ] Started server: `npm run server`
- [ ] Verified works: `curl http://localhost:5000/api/health`

---

## 🎉 Success!

Your FarmLink app now has a real database!

**Next: Deploy to Vercel/production with MongoDB Atlas!**
