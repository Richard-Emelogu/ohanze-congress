import React from 'react';

function AdminLogin() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ color: '#7f1d1d', textAlign: 'center' }}>
          Admin Login Test
        </h1>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          If you see this, the route is working!
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;