import React from 'react';

export default function ChatScreen({ activeConvo, setActiveConvo, sendMessage, chatInput, setChatInput, QUICK_REPLIES, messagesEndRef }) {
  if (!activeConvo) return null;

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="chat-back" onClick={()=>setActiveConvo(null)}>←</button>
        <div className="chat-avatar-lg">{activeConvo.emoji}</div>
        <div style={{flex:1}}>
          <div className="chat-user-name">{activeConvo.name}</div>
          <div className="chat-user-status">
            {activeConvo.online ? <><span className="online-dot"/>Online now</> : "Last seen recently"}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        <div className="date-divider"><span>Today</span></div>
        {activeConvo.messages.map(msg=> (
          <div key={msg.id} className={`msg-row ${msg.from}`}>
            {msg.from === "them" && <div className="msg-avatar">{activeConvo.emoji}</div>}
            <div className="msg-bubble">
              {msg.text}
              <span className="msg-time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}/>
      </div>

      <div className="quick-replies">
        {QUICK_REPLIES.map(r=>(
          <button key={r} className="quick-reply" onClick={()=>sendMessage(r)}>{r}</button>
        ))}
      </div>

      <div className="chat-input-bar">
        <input className="chat-input" placeholder="Type a message..." value={chatInput}
          onChange={e=>setChatInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&sendMessage()}/>
        <button className="send-btn" onClick={()=>sendMessage()}>➤</button>
      </div>
    </div>
  );
}
