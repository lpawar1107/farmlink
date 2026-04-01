const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory mock database (for development without MongoDB)
let products = [
  { id: 1, name: "Organic Tomatoes", emoji: "🍅", price: 2.5, unit: "kg", farmer: "Ravi Kumar", farmerId: 2, dist: 1.2, cat: "veg", qty: 50, fresh: true, lat: 18.5220, lng: 73.8575 },
  { id: 2, name: "Sweet Corn", emoji: "🌽", price: 1.8, unit: "dozen", farmer: "Priya Farms", farmerId: 3, dist: 2.4, cat: "grain", qty: 30, fresh: true, lat: 18.5250, lng: 73.8620 },
  { id: 3, name: "Baby Spinach", emoji: "🥬", price: 1.2, unit: "bunch", farmer: "Green Valley", farmerId: 4, dist: 0.8, cat: "veg", qty: 20, fresh: false, lat: 18.5190, lng: 73.8540 },
];

let listings = [
  { id: 1, name: "Organic Tomatoes", emoji: "🍅", price: 2.5, unit: "kg", qty: 50, status: "active", orders: 12 },
  { id: 4, name: "Fresh Carrots", emoji: "🥕", price: 1.5, unit: "kg", qty: 8, status: "low", orders: 5 },
];

let convos = [
  { 
    id: 1, 
    name: "Ravi Kumar", 
    emoji: "👨‍🌾", 
    online: true, 
    unread: 2, 
    time: "10:32 AM", 
    preview: "Is the tomato still available?",
    messages: [
      { id: 1, from: "them", text: "Hello! I saw your listing for tomatoes.", time: "10:20 AM" },
      { id: 2, from: "me", text: "Yes! Fresh picked this morning 🍅", time: "10:22 AM" },
      { id: 3, from: "them", text: "Great! What's the minimum order?", time: "10:30 AM" },
      { id: 4, from: "them", text: "Is the tomato still available?", time: "10:32 AM" },
    ]
  },
  { 
    id: 2, 
    name: "Priya Farms", 
    emoji: "👩‍🌾", 
    online: true, 
    unread: 0, 
    time: "Yesterday", 
    preview: "I will deliver tomorrow morning",
    messages: [
      { id: 1, from: "me", text: "Hi! I want 5 dozen sweet corn 🌽", time: "Yesterday" },
      { id: 2, from: "them", text: "Sure! That will be $9 total.", time: "Yesterday" },
      { id: 3, from: "me", text: "Can you deliver?", time: "Yesterday" },
      { id: 4, from: "them", text: "I will deliver tomorrow morning", time: "Yesterday" },
    ]
  },
];

// ===== PRODUCTS API =====

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// CREATE product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  Object.assign(product, req.body);
  res.json(product);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

// ===== LISTINGS API =====

// GET all listings
app.get('/api/listings', (req, res) => {
  res.json(listings);
});

// GET single listing
app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === parseInt(req.params.id));
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json(listing);
});

// CREATE listing
app.post('/api/listings', (req, res) => {
  const newListing = {
    id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
    ...req.body
  };
  listings.push(newListing);
  res.status(201).json(newListing);
});

// UPDATE listing
app.put('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === parseInt(req.params.id));
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  Object.assign(listing, req.body);
  res.json(listing);
});

// DELETE listing
app.delete('/api/listings/:id', (req, res) => {
  const index = listings.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Listing not found" });
  const deleted = listings.splice(index, 1);
  res.json(deleted[0]);
});

// ===== CONVERSATIONS API =====

// GET all conversations
app.get('/api/convos', (req, res) => {
  res.json(convos);
});

// GET single conversation
app.get('/api/convos/:id', (req, res) => {
  const convo = convos.find(c => c.id === parseInt(req.params.id));
  if (!convo) return res.status(404).json({ message: "Conversation not found" });
  res.json(convo);
});

// CREATE conversation
app.post('/api/convos', (req, res) => {
  const newConvo = {
    id: convos.length > 0 ? Math.max(...convos.map(c => c.id)) + 1 : 1,
    ...req.body
  };
  convos.push(newConvo);
  res.status(201).json(newConvo);
});

// UPDATE conversation (e.g., add message)
app.put('/api/convos/:id', (req, res) => {
  const convo = convos.find(c => c.id === parseInt(req.params.id));
  if (!convo) return res.status(404).json({ message: "Conversation not found" });
  Object.assign(convo, req.body);
  res.json(convo);
});

// DELETE conversation
app.delete('/api/convos/:id', (req, res) => {
  const index = convos.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Conversation not found" });
  const deleted = convos.splice(index, 1);
  res.json(deleted[0]);
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({ status: "✅ Server is running", timestamp: new Date() });
});

// ===== 404 HANDLER =====

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== ERROR HANDLER =====

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  🚀 FarmLink Backend Server Running    ║
  ║     http://localhost:${PORT}              ║
  ╚════════════════════════════════════════╝
  
  📋 Available Endpoints:
  
  Products:
  - GET    /api/products
  - GET    /api/products/:id
  - POST   /api/products
  - PUT    /api/products/:id
  - DELETE /api/products/:id
  
  Listings:
  - GET    /api/listings
  - GET    /api/listings/:id
  - POST   /api/listings
  - PUT    /api/listings/:id
  - DELETE /api/listings/:id
  
  Conversations:
  - GET    /api/convos
  - GET    /api/convos/:id
  - POST   /api/convos
  - PUT    /api/convos/:id
  - DELETE /api/convos/:id
  
  Health:
  - GET    /api/health
  `);
});

module.exports = app;
