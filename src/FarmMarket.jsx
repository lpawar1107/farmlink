import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartModal from './components/CartModal';
import ChatScreen from './components/ChatScreen';
import MapView from './components/MapView';
import Profile from './components/Profile';

const GOOGLE_FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --soil: #3d2b1f; --bark: #6b4226; --clay: #c47c4a; --wheat: #e8c97a;
    --sage: #7a9b6e; --leaf: #4e7c44; --sprout: #a8c97a; --cream: #fdf6ec;
    --paper: #f5ede0; --mist: #e8ddd0; --sky: #d4e8f0; --sun: #f2a93b;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); min-height: 100vh; display: flex; justify-content: center; padding: 20px 10px; }
  .phone { width: 390px; min-height: 844px; background: var(--cream); border-radius: 0px; overflow: hidden; box-shadow: none; position: relative; display: flex; flex-direction: column; margin-left: auto; margin-right: auto; }
  .statusbar { background: var(--soil); height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; color: var(--wheat); font-size: 12px; font-weight: 600; flex-shrink: 0; position: sticky; top: 0; z-index: 15; }
  .header { background: var(--soil); padding: 14px 24px 20px; flex-shrink: 0; position: sticky; top: 44px; z-index: 15; }
  .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .logo { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--wheat); font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .logo-icon { width: 32px; height: 32px; background: var(--leaf); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--clay); display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid var(--wheat); cursor: pointer; }
  .role-toggle { display: flex; background: rgba(255,255,255,0.12); border-radius: 0px; padding: 3px; gap: 2px; }
  .role-btn { flex: 1; padding: 7px 12px; border-radius: 0px; border: none; background: transparent; color: rgba(232,201,122,0.7); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .role-btn.active { background: var(--wheat); color: var(--soil); font-weight: 600; }
  .scroll-area { flex: 1; overflow-y: auto; padding-bottom: 90px; overflow-x: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: rgba(78,124,68,0.6) transparent; }
  .scroll-area::-webkit-scrollbar { width: 8px; }
  .scroll-area::-webkit-scrollbar-track { background: transparent; }
  .scroll-area::-webkit-scrollbar-thumb { background: rgba(78,124,68,0.6); border-radius: 4px; }
  .section-pad { padding: 0 20px; }
  /* when a section is rendered at the very top (profile), reduce the extra top spacing */
  .section-pad.profile-pad { padding-top: 6px; }
  .section-pad.profile-pad .section-title { margin: 8px 0 4px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--soil); font-weight: 700; margin: 20px 0 4px; }
  .section-sub { font-size: 12px; color: var(--bark); margin-bottom: 14px; }
  .search-bar { margin: 16px 20px 0; background: var(--paper); border: 1.5px solid var(--mist); border-radius: 14px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; position: sticky; top: 0; z-index: 12; background: var(--cream); }
  .search-bar input { flex: 1; background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--soil); }
  .search-bar input::placeholder { color: #bbb; }
  .loc-banner { margin: 14px 20px 0; background: linear-gradient(135deg, var(--leaf), var(--sage)); border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; color: white; position: sticky; top: 0; z-index: 12; }
  .loc-icon { font-size: 24px; background: rgba(255,255,255,0.2); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .loc-text { flex: 1; }
  .loc-title { font-weight: 600; font-size: 14px; }
  .loc-sub { font-size: 11px; opacity: 0.85; margin-top: 2px; }
  .loc-btn { background: white; color: var(--leaf); border: none; border-radius: 10px; padding: 7px 12px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .cats { display: flex; gap: 8px; padding: 16px 20px 0; overflow-x: auto; scrollbar-width: none; position: sticky; top: 0; z-index: 12; background: var(--cream); }
  .cats::-webkit-scrollbar { display: none; }
  .cat-pill { flex-shrink: 0; padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--mist); background: white; font-size: 12px; font-weight: 500; color: var(--bark); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
  .cat-pill.active { background: var(--leaf); border-color: var(--leaf); color: white; }
  .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px 20px 0; }
  .product-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 12px rgba(61,43,31,0.08); cursor: pointer; border: 1.5px solid var(--mist); position: relative; transition: transform 0.2s; }
  .product-card:active { transform: scale(0.97); }
  .product-img { width: 100%; height: 110px; display: flex; align-items: center; justify-content: center; font-size: 50px; background: var(--paper); }
  .product-info { padding: 10px 12px 12px; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600; color: var(--soil); margin-bottom: 4px; }
  .product-farmer { font-size: 11px; color: var(--bark); margin-bottom: 6px; }
  .product-bottom { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-size: 15px; font-weight: 700; color: var(--leaf); }
  .product-price span { font-size: 10px; font-weight: 400; color: var(--bark); }
  .dist-badge { background: var(--sky); color: #2a6b8a; font-size: 10px; font-weight: 600; padding: 3px 7px; border-radius: 8px; }
  .fresh-badge { position: absolute; top: 8px; left: 8px; background: var(--sun); color: var(--soil); font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 8px; text-transform: uppercase; }
  .add-to-cart { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: var(--leaf); color: white; border: none; font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .add-to-cart.added { background: var(--clay); }
  .stats-row { display: flex; gap: 10px; padding: 16px 20px 0; }
  .stat-card { flex: 1; background: white; border-radius: 16px; padding: 14px 12px; border: 1.5px solid var(--mist); text-align: center; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--soil); }
  .stat-label { font-size: 10px; color: var(--bark); margin-top: 2px; }
  .stat-icon { font-size: 18px; margin-bottom: 4px; }
  .my-listings { padding: 0 20px; }
  .listing-row { background: white; border-radius: 16px; padding: 12px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; border: 1.5px solid var(--mist); cursor: pointer; }
  .listing-emoji { width: 50px; height: 50px; background: var(--paper); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
  .listing-info { flex: 1; }
  .listing-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 600; color: var(--soil); }
  .listing-meta { font-size: 11px; color: var(--bark); margin-top: 2px; }
  .listing-right { text-align: right; }
  .listing-price { font-size: 15px; font-weight: 700; color: var(--leaf); }
  .listing-qty { font-size: 10px; color: var(--bark); margin-top: 2px; }
  .status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 4px; }
  .add-btn-fab { position: absolute; bottom: 100px; right: 24px; width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, var(--leaf), var(--sage)); color: white; border: none; font-size: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(78,124,68,0.45); z-index: 10; }
  /* overlay leaves space for the bottom nav so nav items remain tappable */
  .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 86px; background: rgba(61,43,31,0.55); backdrop-filter: blur(3px); z-index: 20; display: flex; flex-direction: column; justify-content: flex-end; }
  .modal-sheet { background: var(--cream); border-radius: 28px 28px 0 0; padding: 6px 24px 40px; animation: slideUp 0.3s ease; max-height: 88%; overflow-y: auto; }
  .modal-sheet::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-handle { width: 40px; height: 4px; background: var(--mist); border-radius: 2px; margin: 12px auto 20px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--soil); margin-bottom: 20px; }
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--bark); margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid var(--mist); background: var(--paper); font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--soil); outline: none; }
  .form-input:focus { border-color: var(--leaf); }
  .form-row { display: flex; gap: 10px; }
  .form-row .form-group { flex: 1; }
  .emoji-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
  .emoji-option { width: 42px; height: 42px; border-radius: 10px; background: var(--paper); border: 2px solid transparent; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; }
  .emoji-option.selected { border-color: var(--leaf); background: rgba(78,124,68,0.1); }
  .submit-btn { width: 100%; padding: 15px; border-radius: 16px; background: linear-gradient(135deg, var(--soil), var(--bark)); color: var(--wheat); border: none; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 6px; }
  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid var(--mist); display: flex; padding: 10px 10px 24px; z-index: 11; width: 390px; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px; cursor: pointer; border-radius: 12px; }
  .nav-item.active { background: rgba(78,124,68,0.08); }
  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 10px; font-weight: 500; color: var(--bark); }
  .nav-item.active .nav-label { color: var(--leaf); font-weight: 700; }
  .badge-wrap { position: relative; display: inline-block; }
  .nav-badge { position: absolute; top: -4px; right: -4px; background: var(--clay); color: white; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .toast { position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); background: var(--soil); color: var(--wheat); padding: 10px 20px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; z-index: 30; animation: fadeInOut 2s forwards; pointer-events: none; }
  @keyframes fadeInOut { 0%{opacity:0;transform:translateX(-50%) translateY(10px)} 15%{opacity:1;transform:translateX(-50%) translateY(0)} 70%{opacity:1} 100%{opacity:0;transform:translateX(-50%) translateY(-6px)} }
  .detail-img { width: 100%; height: 160px; background: var(--paper); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 80px; margin-bottom: 16px; }
  .detail-name { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: var(--soil); }
  .detail-farmer { font-size: 13px; color: var(--bark); margin: 4px 0 12px; display: flex; align-items: center; gap: 6px; }
  .detail-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .detail-tag { background: var(--paper); color: var(--bark); font-size: 11px; padding: 5px 10px; border-radius: 8px; font-weight: 500; }
  .detail-price-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .detail-price { font-size: 26px; font-weight: 700; color: var(--leaf); font-family: 'Playfair Display', serif; }
  .qty-control { display: flex; align-items: center; gap: 14px; background: var(--paper); padding: 6px 14px; border-radius: 14px; }
  .qty-btn { width: 28px; height: 28px; border-radius: 50%; background: white; border: 1.5px solid var(--mist); font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .qty-num { font-size: 16px; font-weight: 700; color: var(--soil); min-width: 20px; text-align: center; }

  /* CHAT */
  .chat-screen { position: absolute; inset: 0; background: var(--cream); z-index: 15; display: flex; flex-direction: column; animation: slideInRight 0.3s ease; }
  @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .chat-header { background: var(--soil); padding: 44px 20px 16px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .chat-back { background: rgba(255,255,255,0.15); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .chat-avatar-lg { width: 42px; height: 42px; border-radius: 50%; background: var(--clay); display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid var(--wheat); flex-shrink: 0; }
  .chat-user-name { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--wheat); font-weight: 700; }
  .chat-user-status { font-size: 11px; color: rgba(232,201,122,0.75); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
  .online-dot { width: 7px; height: 7px; background: #6ddb6d; border-radius: 50%; display: inline-block; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f7f0e8; }
  .chat-messages::-webkit-scrollbar { display: none; }
  .msg-row { display: flex; align-items: flex-end; gap: 8px; }
  .msg-row.me { flex-direction: row-reverse; }
  .msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--mist); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .msg-bubble { max-width: 72%; padding: 10px 14px; font-size: 14px; line-height: 1.5; }
  .msg-row.them .msg-bubble { background: white; color: var(--soil); border-radius: 4px 18px 18px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .msg-row.me .msg-bubble { background: var(--leaf); color: white; border-radius: 18px 18px 4px 18px; }
  .msg-time { font-size: 10px; opacity: 0.6; margin-top: 4px; display: block; }
  .msg-row.me .msg-time { text-align: right; }
  .date-divider { text-align: center; margin: 4px 0 8px; }
  .date-divider span { background: rgba(0,0,0,0.08); color: var(--bark); font-size: 11px; padding: 4px 12px; border-radius: 10px; }
  .quick-replies { display: flex; gap: 8px; flex-wrap: wrap; padding: 10px 16px; background: white; border-top: 1px solid var(--mist); }
  .quick-reply { background: var(--paper); border: 1.5px solid var(--leaf); color: var(--leaf); font-size: 12px; padding: 6px 12px; border-radius: 16px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; white-space: nowrap; transition: all 0.2s; }
  .quick-reply:active { background: var(--leaf); color: white; }
  .chat-input-bar { background: white; border-top: 1px solid var(--mist); padding: 10px 14px 32px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .chat-input { flex: 1; background: var(--paper); border: 1.5px solid var(--mist); border-radius: 22px; padding: 10px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--soil); outline: none; }
  .chat-input:focus { border-color: var(--leaf); }
  .send-btn { width: 42px; height: 42px; border-radius: 50%; background: var(--leaf); color: white; border: none; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }

  /* CONVO LIST */
  .convo-list { padding: 0 20px; }
  .convo-item { background: white; border-radius: 16px; padding: 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; border: 1.5px solid var(--mist); cursor: pointer; }
  .convo-item.unread { border-color: var(--sprout); background: rgba(168,201,122,0.08); }
  .convo-avatar { width: 50px; height: 50px; border-radius: 50%; background: var(--paper); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; border: 2px solid var(--mist); position: relative; }
  .convo-online { position: absolute; bottom: 1px; right: 1px; width: 12px; height: 12px; background: #6ddb6d; border-radius: 50%; border: 2px solid white; }
  .convo-info { flex: 1; min-width: 0; }
  .convo-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 600; color: var(--soil); }
  .convo-preview { font-size: 12px; color: var(--bark); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .convo-right { text-align: right; flex-shrink: 0; }
  .convo-time { font-size: 10px; color: var(--bark); }
  .unread-badge { background: var(--leaf); color: white; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 4px; margin-left: auto; }
`;

const CATEGORIES = [
  { id: "all", label: "All", icon: "🌾" },
  { id: "veg", label: "Vegetables", icon: "🥦" },
  { id: "fruit", label: "Fruits", icon: "🍎" },
  { id: "grain", label: "Grains", icon: "🌽" },
  { id: "dairy", label: "Dairy", icon: "🥛" },
  { id: "herb", label: "Herbs", icon: "🌿" },
];

const PRODUCE_EMOJIS = ["🥕","🥦","🍅","🌽","🥬","🍆","🫑","🧅","🥔","🍠","🫘","🌾","🍎","🍊","🍋","🍇","🫐","🍓","🥝","🥛","🧀","🥚","🌿","🌱"];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Organic Tomatoes", emoji: "🍅", price: 2.5, unit: "kg", farmer: "Ravi Kumar", farmerId: 2, dist: 1.2, cat: "veg", qty: 50, fresh: true, lat: 18.5220, lng: 73.8575 },
  { id: 2, name: "Sweet Corn", emoji: "🌽", price: 1.8, unit: "dozen", farmer: "Priya Farms", farmerId: 3, dist: 2.4, cat: "grain", qty: 30, fresh: true, lat: 18.5250, lng: 73.8620 },
  { id: 3, name: "Baby Spinach", emoji: "🥬", price: 1.2, unit: "bunch", farmer: "Green Valley", farmerId: 4, dist: 0.8, cat: "veg", qty: 20, fresh: false, lat: 18.5190, lng: 73.8540 },
  { id: 4, name: "Fresh Carrots", emoji: "🥕", price: 1.5, unit: "kg", farmer: "Ravi Kumar", farmerId: 2, dist: 1.2, cat: "veg", qty: 40, fresh: true, lat: 18.5215, lng: 73.8555 },
  { id: 5, name: "Raw Milk", emoji: "🥛", price: 0.9, unit: "liter", farmer: "Anand Dairy", farmerId: 5, dist: 3.1, cat: "dairy", qty: 100, fresh: false, lat: 18.5150, lng: 73.8400 },
  { id: 6, name: "Fresh Basil", emoji: "🌿", price: 0.8, unit: "bunch", farmer: "Herb Garden", farmerId: 6, dist: 4.5, cat: "herb", qty: 15, fresh: true, lat: 18.5300, lng: 73.8700 },
  { id: 7, name: "Alphonso Mango", emoji: "🥭", price: 4.5, unit: "kg", farmer: "Mango Estate", farmerId: 7, dist: 6.2, cat: "fruit", qty: 25, fresh: true, lat: 18.5400, lng: 73.8800 },
  { id: 8, name: "Farm Eggs", emoji: "🥚", price: 3.0, unit: "dozen", farmer: "Anand Dairy", farmerId: 5, dist: 3.1, cat: "dairy", qty: 60, fresh: false, lat: 18.5130, lng: 73.8420 },
];

const MY_LISTINGS = [
  { id: 1, name: "Organic Tomatoes", emoji: "🍅", price: 2.5, unit: "kg", qty: 50, status: "active", orders: 12 },
  { id: 4, name: "Fresh Carrots", emoji: "🥕", price: 1.5, unit: "kg", qty: 8, status: "low", orders: 5 },
];

const INITIAL_CONVOS = [
  { id: 1, name: "Ravi Kumar", emoji: "👨‍🌾", online: true, unread: 2, time: "10:32 AM", preview: "Is the tomato still available?",
    messages: [
      { id: 1, from: "them", text: "Hello! I saw your listing for tomatoes.", time: "10:20 AM" },
      { id: 2, from: "me", text: "Yes! Fresh picked this morning 🍅", time: "10:22 AM" },
      { id: 3, from: "them", text: "Great! What's the minimum order?", time: "10:30 AM" },
      { id: 4, from: "them", text: "Is the tomato still available?", time: "10:32 AM" },
    ]},
  { id: 2, name: "Priya Farms", emoji: "👩‍🌾", online: true, unread: 0, time: "Yesterday", preview: "I will deliver tomorrow morning",
    messages: [
      { id: 1, from: "me", text: "Hi! I want 5 dozen sweet corn 🌽", time: "Yesterday" },
      { id: 2, from: "them", text: "Sure! That will be $9 total.", time: "Yesterday" },
      { id: 3, from: "me", text: "Can you deliver?", time: "Yesterday" },
      { id: 4, from: "them", text: "I will deliver tomorrow morning", time: "Yesterday" },
    ]},
  { id: 3, name: "Anand Dairy", emoji: "🧑‍🌾", online: false, unread: 0, time: "Mon", preview: "Thank you for your order!",
    messages: [
      { id: 1, from: "them", text: "Thank you for your order!", time: "Mon" },
      { id: 2, from: "me", text: "Great quality milk, will order again!", time: "Mon" },
    ]},
];

const QUICK_REPLIES = ["Is this available?", "What's the price?", "Can you deliver?", "I'll take 2 kg"];

export default function FarmMarket({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToNav = (p) => {
    if (p.startsWith('/chat')) return 'chat';
    if (p.startsWith('/cart')) return 'cart';
    if (p.startsWith('/profile')) return 'profile';
    if (p.startsWith('/map')) return 'map';
    return 'home';
  };

  const [role, setRole] = useState("buyer");
  const [activeNav, setActiveNav] = useState(pathToNav(location.pathname));
  const scrollRef = useRef(null);
  const profileRef = useRef(null);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [cartSet, setCartSet] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastKey, setToastKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [myListings, setMyListings] = useState(MY_LISTINGS);
  const [convos, setConvos] = useState(INITIAL_CONVOS);
  const [activeConvo, setActiveConvo] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);
  const [form, setForm] = useState({ name: "", price: "", unit: "kg", qty: "", cat: "veg", emoji: "🍅" });

  const totalUnread = convos.reduce((a, c) => a + c.unread, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo]);

  // Load data from mock API (json-server) if available, fallback to in-memory data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [pRes, lRes, cRes] = await Promise.all([
          fetch('http://localhost:4000/products'),
          fetch('http://localhost:4000/listings'),
          fetch('http://localhost:4000/convos'),
        ]);
        if (!mounted) return;
        if (pRes.ok) setProducts(await pRes.json());
        if (lRes.ok) setMyListings(await lRes.json());
        if (cRes.ok) setConvos(await cRes.json());
      } catch (err) {
        console.warn('Mock API not available, using local data', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const nav = pathToNav(location.pathname);
    setActiveNav(nav);
    // aggressively reset scroll so in-app views (profile) appear at top
    const reset = () => {
      try { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { if (scrollRef.current) scrollRef.current.scrollTop = 0; }
      try { window.scrollTo(0,0); } catch (e) {}
      try { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
    };
    reset();
    const t1 = setTimeout(reset, 50);
    const t2 = setTimeout(reset, 200);
    // additionally ensure profile section is visible at top when navigating to profile
    let p1 = null;
    let p2 = null;
    if (nav === 'profile') {
      const showProfile = () => {
        try { if (profileRef.current && profileRef.current.scrollIntoView) profileRef.current.scrollIntoView({ behavior: 'auto', block: 'start' }); } catch (e) {}
        try { if (scrollRef.current) scrollRef.current.scrollTop = 0; } catch (e) {}
      };
      showProfile();
      p1 = setTimeout(showProfile, 40);
      p2 = setTimeout(showProfile, 160);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); if (p1) clearTimeout(p1); if (p2) clearTimeout(p2); };
  }, [location.pathname]);

  // aggressive interval fallback: when profile is active, repeatedly force scroll for a short time
  useEffect(() => {
    if (activeNav !== 'profile') return;
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      try { if (scrollRef.current) scrollRef.current.scrollTop = 0; } catch (e) {}
      try { if (profileRef.current && profileRef.current.scrollIntoView) profileRef.current.scrollIntoView({ block: 'start', behavior: 'auto' }); } catch (e) {}
      try { window.scrollTo(0,0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
      if (tries > 12) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [activeNav]);

  // scroll the main content to top when changing nav (so profile appears at top)
  useEffect(() => {
    try { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { if (scrollRef.current) scrollRef.current.scrollTop = 0; }
  }, [activeNav]);

  // sync role with signed-in user (if any)
  useEffect(() => {
    if (user && user.role) setRole(user.role);
  }, [user]);

  // listen for fallback event from Header to open profile inside the app
  useEffect(() => {
    const handler = () => { setActiveNav('profile'); try { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'auto' }); } catch(e){ if (scrollRef.current) scrollRef.current.scrollTop = 0; } };
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg); setToastKey(k => k + 1);
    setTimeout(() => setToast(null), 2100);
  };

  const addToCart = (product, e) => {
    e?.stopPropagation();
    if (cartSet.has(product.id)) return;
    setCart(c => [...c, { ...product }]);
    setCartSet(s => new Set([...s, product.id]));
    showToast(`${product.emoji} Added to cart!`);
  };

  const openConvo = (convo) => {
    const cleared = { ...convo, unread: 0 };
    setConvos(cs => cs.map(c => c.id === convo.id ? cleared : c));
    setActiveConvo(cleared);
  };

  const sendMessage = (text) => {
    const msg = text || chatInput;
    if (!msg.trim()) return;
    const newMsg = { id: Date.now(), from: "me", text: msg, time: "Just now" };
    const updated = { ...activeConvo, messages: [...activeConvo.messages, newMsg], preview: msg, time: "Now" };
    setActiveConvo(updated);
    setConvos(cs => cs.map(c => c.id === updated.id ? updated : c));
    setChatInput("");
    setTimeout(() => {
      const replies = ["Sure! 👍", "Let me check and get back to you.", "Yes, available anytime!", "How much quantity do you need?", "Thank you for your interest! 🌾"];
      const reply = { id: Date.now() + 1, from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: "Just now" };
      setActiveConvo(prev => {
        if (!prev) return prev;
        const next = { ...prev, messages: [...prev.messages, reply] };
        setConvos(cs => cs.map(c => c.id === next.id ? next : c));
        return next;
      });
    }, 1500);
  };

  const startChat = (product) => {
    const existing = convos.find(c => c.name === product.farmer);
    if (existing) {
      setSelectedProduct(null); navigate('/chat');
      setTimeout(() => openConvo(existing), 50);
    } else {
      const nc = { id: Date.now(), name: product.farmer, emoji: "👨‍🌾", online: true, unread: 0, time: "Now",
        preview: `Hi! Interested in ${product.name}`,
        messages: [{ id: 1, from: "me", text: `Hi! I'm interested in your ${product.name} ${product.emoji}`, time: "Now" }]
      };
      setConvos(cs => [nc, ...cs]);
      setSelectedProduct(null); navigate('/chat');
      setTimeout(() => openConvo(nc), 50);
    }
  };

  const handleAddListing = async () => {
    if (!form.name || !form.price || !form.qty) { showToast("Fill all fields"); return; }
    // generate simple lat/lng near Pune
    const baseLat = 18.5204; const baseLng = 73.8567;
    const offset = (Math.random() - 0.5) * 0.02; // ~±1.1km
    const lat = baseLat + offset;
    const lng = baseLng + offset * 1.1;
    const np = { name: form.name, emoji: form.emoji, price: parseFloat(form.price), unit: form.unit, farmer: "My Farm", farmerId: 1, dist: 0, cat: form.cat, qty: parseInt(form.qty), fresh: true, lat, lng };

    // try posting to mock API; fallback to local update
    try {
      const resP = await fetch('http://localhost:4000/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(np)
      });
      const created = resP.ok ? await resP.json() : { id: Date.now(), ...np };

      const listing = { id: created.id, name: created.name, emoji: created.emoji, price: created.price, unit: created.unit, qty: created.qty, status: 'active', orders: 0 };
      // try add to listings too
      try {
        await fetch('http://localhost:4000/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(listing) });
      } catch (err) { console.warn('Could not POST listing', err); }

      setProducts(p => [created, ...p]);
      setMyListings(l => [listing, ...l]);
      setShowModal(false);
      setForm({ name: "", price: "", unit: "kg", qty: "", cat: "veg", emoji: "🍅" });
      showToast("✅ Listing added!");
    } catch (err) {
      // fallback local
      const local = { id: Date.now(), ...np };
      setProducts(p => [local, ...p]);
      setMyListings(l => [{ ...local, status: 'active', orders: 0 }, ...l]);
      setShowModal(false);
      setForm({ name: "", price: "", unit: "kg", qty: "", cat: "veg", emoji: "🍅" });
      showToast("✅ Listing added (offline)!");
    }
  };

  const filtered = products.filter(p => {
    const mc = activeCat === "all" || p.cat === activeCat;
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.farmer.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  }).sort((a, b) => a.dist - b.dist);

  return (
    <>
      <style>{GOOGLE_FONTS + styles}</style>
      <div style={{ display:"flex", justifyContent:"center", minHeight:"100vh", background:"linear-gradient(135deg,#d4e8c0,#e8dac0)", padding:"20px 10px" }}>
        <div className="phone">
            <div className="statusbar"><span>9:41</span><span>📶 🔋</span></div>

              <Header role={role} setRole={setRole} navigateHome={() => navigate('/')} user={user} setUser={setUser} />

          <div className="scroll-area" ref={scrollRef}>

            {/* CHAT LIST */}
            {activeNav === "chat" && (
              <>
                <div className="section-pad">
                  <div className="section-title">Messages 💬</div>
                  <div className="section-sub">{convos.length} conversations · {totalUnread} unread</div>
                </div>
                <div className="convo-list" style={{marginTop:12}}>
                  {convos.map(c => (
                    <div key={c.id} className={`convo-item ${c.unread>0?"unread":""}`} onClick={()=>openConvo(c)}>
                      <div className="convo-avatar">
                        {c.emoji}
                        {c.online && <div className="convo-online"/>}
                      </div>
                      <div className="convo-info">
                        <div className="convo-name">{c.name}</div>
                        <div className="convo-preview">{c.preview}</div>
                      </div>
                      <div className="convo-right">
                        <div className="convo-time">{c.time}</div>
                        {c.unread>0 && <div className="unread-badge">{c.unread}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* BUYER HOME */}
            {activeNav==="home" && role==="buyer" && (
              <>
                <div className="loc-banner">
                  <div className="loc-icon">📍</div>
                  <div className="loc-text"><div className="loc-title">Pune, Maharashtra</div><div className="loc-sub">Showing farms within 10 km</div></div>
                  <button className="loc-btn">Change</button>
                </div>
                <div className="search-bar">
                  <span style={{fontSize:15,color:"var(--bark)"}}>🔍</span>
                  <input placeholder="Search produce or farm..." value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <div className="cats">
                  {CATEGORIES.map(c=>(
                    <div key={c.id} className={`cat-pill ${activeCat===c.id?"active":""}`} onClick={()=>setActiveCat(c.id)}>{c.icon} {c.label}</div>
                  ))}
                </div>
                <div className="section-pad">
                  <div className="section-title">Nearby Produce</div>
                  <div className="section-sub">Sorted by distance · {filtered.length} listings</div>
                </div>
                <div className="product-grid">
                  {filtered.map(p=> (
                    <ProductCard key={p.id} product={p} cartSet={cartSet} addToCart={addToCart} onSelect={(prod)=>{setSelectedProduct(prod);setQty(1)}} />
                  ))}
                </div>
              </>
            )}

            {/* FARMER HOME */}
            {activeNav==="home" && role==="farmer" && (
              <>
                <div className="section-pad">
                  <div className="section-title">My Dashboard</div>
                  <div className="section-sub">Manage listings and orders</div>
                </div>
                <div className="stats-row">
                  <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-num">{myListings.length}</div><div className="stat-label">Listings</div></div>
                  <div className="stat-card"><div className="stat-icon">🛍️</div><div className="stat-num">{myListings.reduce((a,b)=>a+b.orders,0)}</div><div className="stat-label">Orders</div></div>
                  <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-num">$124</div><div className="stat-label">This Week</div></div>
                </div>
                <div className="section-pad" style={{marginTop:20}}>
                  <div className="section-title">My Listings</div>
                  <div className="section-sub">Tap + to add new produce</div>
                </div>
                <div className="my-listings">
                  {myListings.map(l=>(
                    <div key={l.id} className="listing-row">
                      <div className="listing-emoji">{l.emoji}</div>
                      <div className="listing-info">
                        <div className="listing-name">{l.name}</div>
                        <div className="listing-meta">
                          <span className="status-dot" style={{background:l.status==="active"?"var(--leaf)":"var(--sun)"}}/>
                          {l.status==="active"?"Active":"Low stock"} · {l.orders} orders
                        </div>
                      </div>
                      <div className="listing-right">
                        <div className="listing-price">${l.price}/{l.unit}</div>
                        <div className="listing-qty">{l.qty} left</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{margin:"20px 20px 0"}}>
                  <div className="loc-banner">
                    <div className="loc-icon">📍</div>
                    <div className="loc-text"><div className="loc-title">Your Farm Location</div><div className="loc-sub">Buyers within 10 km can find you</div></div>
                    <button className="loc-btn">Update</button>
                  </div>
                </div>
              </>
            )}

            {/* MAP VIEW */}
            {activeNav === "map" && (
              <>
                <div className="section-pad">
                  <div className="section-title">Nearby Farms Map</div>
                  <div className="section-sub">Tap markers to view produce</div>
                </div>
                <MapView products={products} onSelect={(p)=>{setSelectedProduct(p);setQty(1);navigate('/');}} onAddToCart={(p)=>{addToCart(p);}} onStartChat={(p)=>{startChat(p);}} />
              </>
            )}

                {/* PROFILE VIEW (renders inside scrollable area so it appears at top) */}
                {activeNav === "profile" && (
                  <>
                    <div className="section-pad profile-pad" ref={profileRef}>
                      <div className="section-title">Profile</div>
                      <div className="section-sub">Manage your account</div>
                    </div>
                    <div style={{padding: '0 20px 40px'}}>
                      <Profile user={user} setUser={setUser} />
                    </div>
                  </>
                )}
          </div>

          {role==="farmer" && activeNav==="home" && (
            <button className="add-btn-fab" onClick={()=>setShowModal(true)}>+</button>
          )}

          {/* BOTTOM NAV */}
          <div className="bottom-nav">
            <div className={`nav-item ${activeNav==="home"?"active":""}`} onClick={()=>navigate('/') }>
              <div className="nav-icon">{role==="farmer"?"🌾":"🏠"}</div>
              <div className="nav-label">Home</div>
            </div>
            <div className={`nav-item ${activeNav==="map"?"active":""}`} onClick={()=>{navigate('/map');showToast("🗺️ Map coming soon!")}}>
              <div className="nav-icon">🗺️</div>
              <div className="nav-label">Map</div>
            </div>
            {role==="buyer" && (
              <div className={`nav-item ${activeNav==="cart"?"active":""}`} onClick={()=>navigate('/cart')}>
                <div className="badge-wrap">
                  <div className="nav-icon">🛒</div>
                  {cart.length>0 && <div className="nav-badge">{cart.length}</div>}
                </div>
                <div className="nav-label">Cart</div>
              </div>
            )}
              <div className={`nav-item ${activeNav==="chat"?"active":""}`} onClick={()=>navigate('/chat')}>
              <div className="badge-wrap">
                <div className="nav-icon">💬</div>
                {totalUnread>0 && <div className="nav-badge">{totalUnread}</div>}
              </div>
              <div className="nav-label">Chat</div>
            </div>
            <div className={`nav-item ${activeNav==="profile"?"active":""}`} onClick={()=>{navigate('/profile');showToast("👤 Profile coming soon!")}}>
              <div className="nav-icon">👤</div>
              <div className="nav-label">Profile</div>
            </div>
          </div>

          {activeNav==="cart" && role==="buyer" && (
            <CartModal cart={cart} onClose={()=>navigate('/')} placeOrder={()=>{showToast("🎉 Order placed!");setCart([]);setCartSet(new Set());}} />
          )}

          {/* ADD LISTING MODAL */}
          {showModal && (
            <div className="modal-overlay" onClick={()=>setShowModal(false)}>
              <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
                <div className="modal-handle"/>
                <div className="modal-title">Add New Listing</div>
                <div className="form-group">
                  <label className="form-label">Choose Emoji</label>
                  <div className="emoji-grid">
                    {PRODUCE_EMOJIS.map(em=>(
                      <div key={em} className={`emoji-option ${form.emoji===em?"selected":""}`} onClick={()=>setForm(f=>({...f,emoji:em}))}>{em}</div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input className="form-input" placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input className="form-input" type="number" placeholder="0.00" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-input" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}>
                      <option>kg</option><option>dozen</option><option>bunch</option><option>liter</option><option>piece</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input className="form-input" type="number" placeholder="50" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                      <option value="veg">Vegetables</option><option value="fruit">Fruits</option>
                      <option value="grain">Grains</option><option value="dairy">Dairy</option><option value="herb">Herbs</option>
                    </select>
                  </div>
                </div>
                <button className="submit-btn" onClick={handleAddListing}>🌾 List My Produce</button>
              </div>
            </div>
          )}

          {/* PRODUCT DETAIL MODAL */}
          {selectedProduct && (
            <div className="modal-overlay" onClick={()=>setSelectedProduct(null)}>
              <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
                <div className="modal-handle"/>
                <div className="detail-img">{selectedProduct.emoji}</div>
                <div className="detail-name">{selectedProduct.name}</div>
                <div className="detail-farmer">
                  🧑‍🌾 {selectedProduct.farmer}
                  <span style={{background:"var(--sky)",color:"#2a6b8a",padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:600}}>{selectedProduct.dist}km away</span>
                </div>
                <div className="detail-tags">
                  {selectedProduct.fresh && <div className="detail-tag">🌟 Fresh Today</div>}
                  <div className="detail-tag">📦 {selectedProduct.qty} {selectedProduct.unit} available</div>
                  <div className="detail-tag">🌿 Locally grown</div>
                </div>
                <div className="detail-price-row">
                  <div className="detail-price">${(selectedProduct.price*qty).toFixed(2)} <span style={{fontSize:14,fontWeight:400,color:"var(--bark)"}}>/{qty} {selectedProduct.unit}</span></div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                    <span className="qty-num">{qty}</span>
                    <button className="qty-btn" onClick={()=>setQty(q=>q+1)}>+</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="submit-btn" style={{flex:1}} onClick={()=>{addToCart(selectedProduct);setSelectedProduct(null)}}>🛒 Add to Cart</button>
                  <button className="submit-btn" style={{flex:1,background:"linear-gradient(135deg,#2a6b8a,#4a9bc0)"}} onClick={()=>startChat(selectedProduct)}>💬 Chat</button>
                </div>
              </div>
            </div>
          )}

          {activeConvo && (
            <ChatScreen activeConvo={activeConvo} setActiveConvo={setActiveConvo} sendMessage={sendMessage} chatInput={chatInput} setChatInput={setChatInput} QUICK_REPLIES={QUICK_REPLIES} messagesEndRef={messagesEndRef} />
          )}

          {toast && <div key={toastKey} className="toast">{toast}</div>}
        </div>
      </div>
    </>
  );
}
