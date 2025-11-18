import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '../lib/firebase';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenParam = router.query.token as string;
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    }
  }, [router.query]);

  const validateToken = async (resetToken: string) => {
    try {
      // Validación superficial: el API validará definitivamente
      setValidToken(true);
    } catch (err: any) {
      setError('Error al validar el token');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Error al actualizar la contraseña');
        setLoading(false);
        return;
      }

      setMessage('Contraseña actualizada exitosamente. Redirigiendo...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
      setLoading(false);
    }
  };

  if (!validToken && token) {
    return (
      <div className="login-container">
        <div className="login-card">
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/" style={{ color: '#667eea' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#667eea' }}>
          Restablecer Contraseña
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ color: '#667eea' }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

