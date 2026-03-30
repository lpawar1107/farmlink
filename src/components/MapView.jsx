import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ products = [], onSelect, onAddToCart, onStartChat }) {
  const center = [18.5204, 73.8567]; // Pune

  const coordsFor = (p) => {
    const baseLat = 18.5204;
    const baseLng = 73.8567;
    // deterministic-ish offset based on id to scatter markers
    const angle = (p.id * 57) % 360;
    const rad = (p.dist || 2) / 111; // approx degrees for kilometers
    const lat = baseLat + rad * Math.sin((angle * Math.PI) / 180);
    const lng = baseLng + rad * Math.cos((angle * Math.PI) / 180);
    return [lat, lng];
  };

  return (
    <div style={{ height: '60vh', padding: 12 }}>
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
            {products.map(p => {
              const centerCoord = p.lat && p.lng ? [p.lat, p.lng] : coordsFor(p);
              return (
                <CircleMarker
                  key={p.id}
                  center={centerCoord}
                  radius={10}
                  pathOptions={{ color: '#4e7c44', fillColor: '#7a9b6e' }}
                  eventHandlers={{ click: () => onSelect && onSelect(p) }}
                >
                  <Popup>
                    <div style={{ fontSize: 16 }}>
                      <div style={{ fontSize: 18 }}>{p.emoji} {p.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>🧑‍🌾 {p.farmer} · {p.dist}km</div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                        {onAddToCart && <button onClick={() => onAddToCart(p)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#4e7c44', color: 'white' }}>Add to cart</button>}
                        {onStartChat && <button onClick={() => onStartChat(p)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#2a6b8a', color: 'white' }}>Chat</button>}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
      </MapContainer>
    </div>
  );
}
