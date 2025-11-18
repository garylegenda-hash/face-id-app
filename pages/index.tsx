import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import CredentialLogin from '../components/CredentialLogin';
import FaceIDLogin from '../components/FaceIDLogin';
import Link from 'next/link';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'credentials' | 'faceid'>('credentials');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#667eea' }}>
          Sistema de Gestión
        </h1>
        
        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === 'credentials' ? 'active' : ''}`}
            onClick={() => setActiveTab('credentials')}
          >
            Credenciales
          </button>
          <button
            className={`login-tab ${activeTab === 'faceid' ? 'active' : ''}`}
            onClick={() => setActiveTab('faceid')}
          >
            Face ID
          </button>
        </div>

        {activeTab === 'credentials' ? <CredentialLogin /> : <FaceIDLogin />}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/forgot-password" style={{ color: '#667eea' }}>
            ¿Olvidaste tu contraseña?
          </Link>
          <br />
          <Link href="/register" style={{ color: '#667eea', marginTop: '10px', display: 'inline-block' }}>
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

