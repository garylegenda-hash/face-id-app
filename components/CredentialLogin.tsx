import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default function CredentialLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Buscar usuario en Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verificar contraseña con bcrypt
      if (userData.password) {
        const isValid = await bcrypt.compare(password, userData.password);
        if (!isValid) {
        setError('Contraseña incorrecta');
          setLoading(false);
          return;
        }
      } else {
        setError('Usuario sin contraseña válida');
        setLoading(false);
        return;
      }

      // Iniciar sesión anónima para establecer sesión en Firebase
      await signInAnonymously(auth);
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('faceIdUser', JSON.stringify({
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        loginMethod: 'credentials',
        loginTime: new Date().toISOString()
      }));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

