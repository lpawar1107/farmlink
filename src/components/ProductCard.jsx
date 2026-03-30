import React from 'react';

export default function ProductCard({ product, cartSet, addToCart, onSelect }) {
  return (
    <div className="product-card" onClick={()=>onSelect(product)}>
      {product.fresh && <div className="fresh-badge">Fresh</div>}
      <button className={`add-to-cart ${cartSet.has(product.id)?"added":""}`} onClick={e=>{e.stopPropagation();addToCart(product,e);}}>{cartSet.has(product.id)?"✓":"+"}</button>
      <div className="product-img">{product.emoji}</div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-farmer">🧑‍🌾 {product.farmer}</div>
        <div className="product-bottom">
          <div className="product-price">${product.price}<span>/{product.unit}</span></div>
          <div className="dist-badge">{product.dist}km</div>
        </div>
      </div>
    </div>
  );
}
