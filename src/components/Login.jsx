import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const LOGIN_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

  const LOGIN_STYLES = `
    :root{ --soil:#3d2b1f; --leaf:#4e7c44; --paper:#f5ede0; --cream:#fdf6ec; --bark:#6b4226; }
    *{box-sizing:border-box}
    body{font-family: 'DM Sans', sans-serif;background:linear-gradient(135deg,#d4e8c0,#e8dac0);margin:0;padding:20px;display:flex;justify-content:center}
    .phone{width:390px;min-height:700px;background:var(--cream);border-radius:28px;padding:18px;box-shadow:0 30px 60px rgba(61,43,31,0.25);}
    .login-card{background:var(--cream);border-radius:14px;padding:20px;}
    .form-label{display:block;font-size:12px;font-weight:600;color:var(--bark);margin-bottom:6px}
    .form-input{width:100%;padding:12px;border-radius:10px;border:1.5px solid #eee;background:var(--paper);outline:none;font-family:inherit}
    .form-input:focus{border-color:var(--leaf)}
    .submit-btn{width:100%;padding:12px;border-radius:12px;background:linear-gradient(135deg,var(--soil),var(--bark));color:var(--paper);border:none;font-weight:700;cursor:pointer}
    .role-row{display:flex;gap:8px;margin-top:10px}
    .role-btn{flex:1;padding:10px;border-radius:10px;border:none;cursor:pointer}
  `;

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!password) { setError('Please enter a password'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    // basic local account handling for demo: store users in fm_users localStorage
    let users = [];
    try { users = JSON.parse(localStorage.getItem('fm_users') || '[]'); } catch (e) { users = []; }
    const existing = users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      // validate password
      if (existing.password !== password) { setError('Incorrect password for this account'); return; }
      const u = { name: existing.name, role: existing.role };
      try { localStorage.setItem('fm_user', JSON.stringify(u)); } catch (err) {}
      setUser(u);
      navigate('/', { state: { welcome: true } });
      return;
    }

    // create new account (demo only)
    const newUser = { name: name.trim(), role, password };
    users = [newUser, ...users];
    try { localStorage.setItem('fm_users', JSON.stringify(users)); } catch (e) {}
    const u = { name: name.trim(), role };
    try { localStorage.setItem('fm_user', JSON.stringify(u)); } catch (err) {}
    setUser(u);
    navigate('/', { state: { welcome: true } });
  };

  return (
    <div>
      <style>{LOGIN_FONTS + LOGIN_STYLES}</style>
      <div className="phone">
        <div className="login-card">
          <form onSubmit={submit}>
            <h2 style={{marginBottom:8,fontFamily:'Playfair Display, serif', color:'var(--soil)'}}>Welcome to KisanLink</h2>
            <div style={{color:'var(--bark)',marginBottom:16}}>Sign in or create an account to discover local farms and manage your listings.</div>

            <label className="form-label">Name</label>
            <input className="form-input" value={name} onChange={e=>{setName(e.target.value);setError('');}} placeholder="Your full name" />

            <label className="form-label" style={{marginTop:8}}>Password</label>
            <div style={{position:'relative'}}>
              <input className="form-input" type={showPassword? 'text' : 'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="At least 6 characters" />
              <button type="button" onClick={()=>setShowPassword(s=>!s)} style={{position:'absolute',right:10,top:8,border:'none',background:'transparent',cursor:'pointer',color:'var(--leaf)'}}>{showPassword? 'Hide' : 'Show'}</button>
            </div>

            {error && <div style={{color:'crimson',marginTop:8,fontSize:13}}>{error}</div>}

            <label className="form-label" style={{marginTop:12}}>Role</label>
            <div className="role-row">
              <button type="button" onClick={()=>setRole('buyer')} className="role-btn" style={{background:role==='buyer'?'var(--leaf)':'var(--paper)',color: role==='buyer'?'white':'var(--bark)'}}>Buyer</button>
              <button type="button" onClick={()=>setRole('farmer')} className="role-btn" style={{background:role==='farmer'?'var(--leaf)':'var(--paper)',color: role==='farmer'?'white':'var(--bark)'}}>Farmer</button>
            </div>

            <div style={{display:'flex',gap:10,marginTop:14}}>
              <button className="submit-btn" style={{flex:1}} type="submit">Sign in / Create</button>
              <button type="button" onClick={()=>{navigate('/');}} style={{flex:1,background:'var(--paper)',borderRadius:10,border:'none'}}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
