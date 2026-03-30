import React from 'react';

export default function CartModal({ cart, onClose, placeOrder }) {
  const total = cart.reduce((a,b)=>a+b.price,0).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">🛒 Your Cart ({cart.length})</div>
        {cart.length===0 ? (
          <div style={{textAlign:"center",padding:"30px",color:"var(--bark)"}}>
            <div style={{fontSize:48,marginBottom:12}}>🧺</div><div>Your cart is empty</div>
          </div>
        ) : (
          <>
            {cart.map(item=>(
              <div key={item.id} className="listing-row">
                <div className="listing-emoji">{item.emoji}</div>
                <div className="listing-info"><div className="listing-name">{item.name}</div><div className="listing-meta">🧑‍🌾 {item.farmer} · {item.dist}km</div></div>
                <div className="listing-right"><div className="listing-price">${item.price}/{item.unit}</div></div>
              </div>
            ))}
            <div style={{marginTop:16,padding:"14px 0",borderTop:"1.5px solid var(--mist)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"var(--soil)",fontWeight:700}}>Total</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--leaf)",fontWeight:700}}>${total}</span>
            </div>
            <button className="submit-btn" onClick={()=>{placeOrder();onClose();}}>Place Order</button>
          </>
        )}
      </div>
    </div>
  );
}
