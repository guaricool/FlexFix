import { useState } from 'react';
import { createSession, getSession } from '../db/database';
import '../styles/Login.css';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Verificar si el usuario existe
        const session = await getSession(username);
        if (!session || btoa(password) !== session.passwordHash) {
          setError('Usuario o contraseña incorrectos');
          setLoading(false);
          return;
        }
        onLoginSuccess(session.id, username);
      } else {
        // Crear nuevo usuario
        if (username.length < 3 || password.length < 6) {
          setError('Usuario mín 3 caracteres, contraseña mín 6');
          setLoading(false);
          return;
        }
        
        const existing = await getSession(username);
        if (existing) {
          setError('El usuario ya existe');
          setLoading(false);
          return;
        }

        const sessionId = await createSession(username, password);
        onLoginSuccess(sessionId, username);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">FF</div>
          <h1>FlexFix</h1>
          <p>Gestión de paquetes Amazon Flex</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu usuario"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="toggle-button"
              disabled={loading}
            >
              {isLogin ? 'Crear una' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        <div className="login-info">
          <p>💡 Demo: Usuario: <strong>demo</strong> | Contraseña: <strong>123456</strong></p>
        </div>
      </div>
    </div>
  );
}
