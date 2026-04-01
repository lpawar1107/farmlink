import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Profile({ user, setUser }){
  const navigate = useNavigate();
  const location = useLocation();
  const welcome = location?.state?.welcome;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'buyer');
  const [avatar, setAvatar] = useState(user?.avatar || '👨‍🌾');
  const [farmName, setFarmName] = useState(user?.farmName || '');
  const [location2, setLocation2] = useState(user?.location || 'Pune, MH');
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    setName(user?.name || '');
    setRole(user?.role || 'buyer');
    setAvatar(user?.avatar || '👨‍🌾');
    setFarmName(user?.farmName || '');
    setLocation2(user?.location || 'Pune, MH');
  }, [user]);

  const logout = () => {
    try { localStorage.removeItem('fm_user'); } catch(e){}
    setUser(null);
    navigate('/login');
  };

  const save = () => {
    const u = {
      name: name.trim() || 'Guest',
      role,
      avatar,
      farmName: role === 'farmer' ? farmName : '',
      location: location2
    };
    try { localStorage.setItem('fm_user', JSON.stringify(u)); } catch(e){}
    setUser(u);
    setSaved(true);
    setEditing(false);
    setTimeout(()=>setSaved(false), 1800);
  };

  const AVATAR_OPTIONS = ['👨‍🌾', '👩‍🌾', '👨‍💼', '👩‍💼', '🧑‍🌾', '🧔', '👨', '👩'];

  if (!user) return (
    <div style={{padding:20}}>
      <h3 style={{marginBottom:8}}>You're not signed in</h3>
      <div style={{marginBottom:12}}>Sign in to view your profile and listings.</div>
      <button className="submit-btn" onClick={()=>navigate('/login')}>Sign in</button>
    </div>
  );

  return (
    <div style={{padding:20}}>
      {welcome && <div style={{background:'#f0fff4',border:'1px solid #d4f5da',padding:12,borderRadius:10,marginBottom:12}}>🎉 Welcome, <strong>{user.name}</strong> — your account is ready.</div>}

      <div style={{display:'flex',gap:20,alignItems:'center',marginBottom:18}}>
        <div style={{width:88,height:88,borderRadius:22,background:'#f6f6f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontWeight:700,border:'3px solid #4e7c44'}}>
          {avatar || '👨‍🌾'}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:20,fontWeight:700}}>{user.name}</div>
          <div style={{color:'#666',marginTop:6,fontSize:13}}>📍 {location2}</div>
          {role === 'farmer' && user.farmName && <div style={{color:'#666',marginTop:4,fontSize:13}}>🌾 {user.farmName}</div>}
          <div style={{color:'#666',marginTop:4,fontSize:12,background:'#f0f0f0',display:'inline-block',padding:'3px 8px',borderRadius:6}}>
            {role === 'farmer' ? '👨‍🌾 Farmer' : '🛒 Buyer'}
          </div>
        </div>
      </div>

      {!editing ? (
        <div>
          {role === 'farmer' && (
            <div style={{marginBottom:16,background:'#f9f9f9',padding:14,borderRadius:12,border:'1px solid #eee'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>📊 Farm Stats</div>
              <div style={{display:'flex',gap:14}}>
                <div style={{flex:1,textAlign:'center',background:'white',padding:12,borderRadius:8,border:'1px solid #ddd'}}>
                  <div style={{fontSize:16,fontWeight:700,color:'#4e7c44'}}>12</div>
                  <div style={{fontSize:11,color:'#666',marginTop:4}}>Active Listings</div>
                </div>
                <div style={{flex:1,textAlign:'center',background:'white',padding:12,borderRadius:8,border:'1px solid #ddd'}}>
                  <div style={{fontSize:16,fontWeight:700,color:'#4e7c44'}}>₹2,450</div>
                  <div style={{fontSize:11,color:'#666',marginTop:4}}>This Week</div>
                </div>
                <div style={{flex:1,textAlign:'center',background:'white',padding:12,borderRadius:8,border:'1px solid #ddd'}}>
                  <div style={{fontSize:16,fontWeight:700,color:'#4e7c44'}}>4.8</div>
                  <div style={{fontSize:11,color:'#666',marginTop:4}}>Rating</div>
                </div>
              </div>
            </div>
          )}

          <div style={{display:'flex',gap:10,marginBottom:12}}>
            <button className="submit-btn" style={{flex:1}} onClick={()=>setEditing(true)}>✏️ Edit Profile</button>
            <button style={{flex:1,background:'white',border:'1px solid #ddd',padding:'10px 14px',borderRadius:10,color:'#333',fontWeight:500}} onClick={logout}>🚪 Sign out</button>
          </div>

          <div style={{background:'#f5f5f5',padding:12,borderRadius:10,fontSize:12,color:'#666',lineHeight:'1.6'}}>
            <div style={{marginBottom:10,fontWeight:600,color:'#333'}}>💡 Account Info</div>
            <div>• Member since: Jan 2024</div>
            <div>• Total orders: {role === 'buyer' ? '23' : '0'}</div>
            <div>• Verified: ✅ Yes</div>
          </div>
        </div>
      ) : (
        <div style={{width:'100%',background:'white',padding:16,borderRadius:12,boxShadow:'0 6px 18px rgba(0,0,0,0.06)',boxSizing:'border-box'}}>
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444',marginBottom:8}}>Profile Avatar</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {AVATAR_OPTIONS.map(av => (
                <button key={av} type="button" onClick={()=>setAvatar(av)} 
                  style={{width:48,height:48,borderRadius:10,border:avatar===av?'2px solid #4e7c44':'1px solid #ddd',background:'white',fontSize:24,cursor:'pointer',transition:'all 0.2s'}}>
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444',marginBottom:6}}>Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box',fontFamily:'inherit'}} />
          </div>

          {role === 'farmer' && (
            <>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444',marginBottom:6}}>Farm Name</label>
                <input value={farmName} onChange={e=>setFarmName(e.target.value)} placeholder="e.g., Green Valley Farm" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box',fontFamily:'inherit'}} />
              </div>
            </>
          )}

          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444',marginBottom:6}}>Location</label>
            <input value={location2} onChange={e=>setLocation2(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box',fontFamily:'inherit'}} />
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:'#444',marginBottom:6}}>Role</label>
            <div style={{display:'flex',gap:8}}>
              <button type="button" onClick={()=>setRole('buyer')} style={{flex:1,padding:10,borderRadius:8,background:role==='buyer'?'#4e7c44':'#f6f6f6',color: role==='buyer'?'white':'#333',border:'none',cursor:'pointer',fontWeight:500}}>🛒 Buyer</button>
              <button type="button" onClick={()=>setRole('farmer')} style={{flex:1,padding:10,borderRadius:8,background:role==='farmer'?'#4e7c44':'#f6f6f6',color: role==='farmer'?'white':'#333',border:'none',cursor:'pointer',fontWeight:500}}>🌾 Farmer</button>
            </div>
          </div>

          <div style={{display:'flex',gap:10}}>
            <button className="submit-btn" onClick={save} style={{flex:1}}>✅ Save Changes</button>
            <button style={{flex:1,background:'#f2f2f2',border:'none',padding:'10px 14px',borderRadius:10,cursor:'pointer'}} onClick={()=>setEditing(false)}>✕ Cancel</button>
          </div>
          {saved && <div style={{marginTop:12,color:'#2a7a3a',fontWeight:500}}>✅ Profile updated successfully</div>}
        </div>
      )}
    </div>
  );
}
