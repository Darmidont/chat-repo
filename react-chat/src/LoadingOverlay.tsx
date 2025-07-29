import React from 'react';

const LoadingOverlay: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(24,24,27,0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }}>
    <div style={{
      border: '4px solid #a78bfa33',
      borderTop: '4px solid #a78bfa',
      borderRadius: '50%',
      width: 48,
      height: 48,
      animation: 'spin 1s linear infinite',
      marginBottom: 16
    }} />
    <div style={{color: '#fff', fontWeight: 600, fontSize: 18}}>Loading...</div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingOverlay; 