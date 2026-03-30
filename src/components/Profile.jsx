import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Profile({ user, setUser }){
  const navigate = useNavigate();
  const location = useLocation();
  const welcome = location?.state?.welcome;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'buyer');
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    setName(user?.name || ''); setRole(user?.role || 'buyer');
  }, [user]);

  const logout = () => {
    try { localStorage.removeItem('fm_user'); } catch(e){}
    setUser(null);
    navigate('/login');
  };

  const save = () => {
    const u = { name: name.trim() || 'Guest', role };
    try { localStorage.setItem('fm_user', JSON.stringify(u)); } catch(e){}
    setUser(u);
    setSaved(true);
    setEditing(false);
    setTimeout(()=>setSaved(false), 1800);
  };

  if (!user) return (
    <div style={{padding:20}}>
      <h3 style={{marginBottom:8}}>You're not signed in</h3>
      <div style={{marginBottom:12}}>Sign in to view your profile and listings.</div>
      <button className="submit-btn" onClick={()=>navigate('/login')}>Sign in</button>
    </div>
  );

  const initials = (user.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();

  return (
    <div style={{padding:20}}>
      {welcome && <div style={{background:'#f0fff4',border:'1px solid #d4f5da',padding:12,borderRadius:10,marginBottom:12}}>🎉 Welcome, <strong>{user.name}</strong> — your account is ready.</div>}

      <div style={{display:'flex',gap:20,alignItems:'center',marginBottom:18}}>
        <div style={{width:88,height:88,borderRadius:22,background:'#f6f6f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,fontWeight:700}}>{initials}</div>
        <div>
          <div style={{fontSize:20,fontWeight:700}}>{user.name}</div>
          <div style={{color:'#666',marginTop:6}}>Role: <strong>{user.role}</strong></div>
        </div>
      </div>

      {!editing ? (
        <div style={{display:'flex',gap:10}}>
          <button className="submit-btn" onClick={()=>setEditing(true)}>Edit Profile</button>
          <button style={{background:'#f2f2f2',border:'none',padding:'10px 14px',borderRadius:10}} onClick={logout}>Sign out</button>
        </div>
      ) : (
        <div style={{width:'100%',background:'white',padding:16,borderRadius:12,boxShadow:'0 6px 18px rgba(0,0,0,0.06)',boxSizing:'border-box'}}>
          <div style={{marginBottom:10}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444'}}>Full name</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #eee'}} />
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444'}}>Role</label>
            <div style={{display:'flex',gap:8,marginTop:6}}>
              <button type="button" onClick={()=>setRole('buyer')} style={{flex:1,padding:10,borderRadius:8,background:role==='buyer'?'#4e7c44':'#f6f6f6',color: role==='buyer'?'white':'#333',border:'none'}}>Buyer</button>
              <button type="button" onClick={()=>setRole('farmer')} style={{flex:1,padding:10,borderRadius:8,background:role==='farmer'?'#4e7c44':'#f6f6f6',color: role==='farmer'?'white':'#333',border:'none'}}>Farmer</button>
            </div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="submit-btn" onClick={save}>Save</button>
            <button style={{background:'#f2f2f2',border:'none',padding:'10px 14px',borderRadius:10}} onClick={()=>setEditing(false)}>Cancel</button>
          </div>
          {saved && <div style={{marginTop:12,color:'#2a7a3a'}}>✅ Profile saved</div>}
        </div>
      )}
    </div>
  );
}
