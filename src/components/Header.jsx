import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ role, setRole, navigateHome, user, setUser }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const avatar = user ? (user.name.split(' ').map(s=>s[0]).slice(0,2).join('')) : '👨‍🌾';

  // dispatch a global event as a fallback so the container can react and show profile
  const handleProfileWithEvent = () => { setOpen(false); try { window.dispatchEvent(new Event('openProfile')); } catch(e){} nav('/profile'); };
  const handleLogin = () => { setOpen(false); nav('/login'); };
  const handleLogout = () => { try { localStorage.removeItem('fm_user'); } catch(e){} setUser(null); setOpen(false); nav('/login'); };

  return (
    <div className="header" ref={ref} style={{position:'relative'}}>
      <div className="header-top">
        <div className="logo"><div className="logo-icon">🌾</div>KisanLink</div>
        <div className="avatar" onClick={(e)=>{e.stopPropagation(); setOpen(o=>!o);}} title={user ? user.name : 'Sign in'} style={{cursor:'pointer'}}>{user ? avatar : '👨‍🌾'}</div>
      </div>
      <div className="role-toggle">
        <button className={`role-btn ${role==="buyer"?"active":""}`} onClick={()=>{setRole("buyer");navigateHome()}}>🛒 Buyer</button>
        <button className={`role-btn ${role==="farmer"?"active":""}`} onClick={()=>{setRole("farmer");navigateHome()}}>🌱 Farmer</button>
      </div>

      {open && (
        <div style={{position:'absolute',right:18,top:64,background:'white',borderRadius:10,boxShadow:'0 8px 30px rgba(0,0,0,0.12)',padding:8,width:180,zIndex:60}}>
          {user ? (
            <>
              <div style={{padding:'8px 10px',borderBottom:'1px solid #f0f0f0'}}><strong style={{fontSize:14}}>{user.name}</strong><div style={{fontSize:12,color:'#666'}}>Role: {user.role}</div></div>
              <button style={{width:'100%',padding:10,background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={handleProfileWithEvent}>👤 View Profile</button>
              <button style={{width:'100%',padding:10,background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>{nav('/'); setOpen(false);}}>🏠 Dashboard</button>
              <div style={{height:8}}/>
              <button style={{width:'100%',padding:10,background:'#f6f6f6',border:'none',borderRadius:8,cursor:'pointer'}} onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <div style={{padding:'8px 10px',borderBottom:'1px solid #f0f0f0'}}><strong style={{fontSize:14}}>Welcome</strong><div style={{fontSize:12,color:'#666'}}>Sign in to manage orders</div></div>
              <button style={{width:'100%',padding:10,background:'#4e7c44',color:'white',border:'none',borderRadius:8,cursor:'pointer'}} onClick={handleLogin}>Sign in</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
