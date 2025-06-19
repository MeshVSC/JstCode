import React, { useState } from 'react';

export default function SampleComponent() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello from JstCode!');

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>
        {message}
      </h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
          Count: <strong>{count}</strong>
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => setCount(count - 1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            -
          </button>
          
          <button
            onClick={() => setCount(0)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          
          <button
            onClick={() => setCount(count + 1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            +
          </button>
        </div>
      </div>
      
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message..."
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            width: '100%',
            marginBottom: '1rem'
          }}
        />
      </div>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '1rem', 
        borderRadius: '0.5rem',
        marginTop: '1rem'
      }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          This is a sample React component created with JstCode!
          <br />
          Try editing the code and see the changes in real-time.
        </p>
      </div>
    </div>
  );
}