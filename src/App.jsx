import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Registrar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err);
      });
    }

    // Recuperar sesión del localStorage
    const savedSession = localStorage.getItem('sessionId');
    const savedUsername = localStorage.getItem('username');
    if (savedSession && savedUsername) {
      setSessionId(savedSession);
      setUsername(savedUsername);
    }
  }, []);

  const handleLoginSuccess = (id, user) => {
    setSessionId(id);
    setUsername(user);
    localStorage.setItem('sessionId', id);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setSessionId(null);
    setUsername(null);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('username');
  };

  return (
    <div className="app">
      {!sessionId ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard 
          sessionId={sessionId} 
          username={username}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
