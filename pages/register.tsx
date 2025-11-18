import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Webcam from 'react-webcam';
import { detectFace, faceDescriptorToArray } from '../lib/faceRecognition';
// La verificación de existencia y guardado se realiza vía API

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerFaceID, setRegisterFaceID] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  const captureFaceID = async () => {
    if (!webcamRef.current) {
      setError('Cámara no disponible');
      return;
    }

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('No se pudo capturar la imagen');
      }

      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const detection = await detectFace(img);
      if (!detection || !detection.descriptor) {
        throw new Error('No se detectó ningún rostro. Por favor, intenta de nuevo.');
      }

      const descriptorArray = faceDescriptorToArray(detection.descriptor);
      setFaceDescriptor(descriptorArray);
      setMessage('Rostro capturado exitosamente');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al capturar el rostro');
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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (registerFaceID && !faceDescriptor) {
      setError('Debes capturar tu rostro para Face ID');
      return;
    }

    setLoading(true);

    try {
      // Crear usuario usando API (guarda contraseña con hash y valida duplicados)
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        name,
        email,
          password,
          faceDescriptor: registerFaceID ? faceDescriptor : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el usuario');
      }

      setMessage('Usuario registrado exitosamente. Redirigiendo...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#667eea' }}>
          Registro de Usuario
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre"
            />
          </div>

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
              minLength={6}
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
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={registerFaceID}
                onChange={(e) => setRegisterFaceID(e.target.checked)}
              />
              Registrar Face ID (opcional)
            </label>
          </div>

          {registerFaceID && (
            <div className="form-group">
              <div className="camera-container">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: 'user',
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={captureFaceID}
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  Capturar Rostro para Face ID
                </button>
              </div>
              {faceDescriptor && (
                <div className="alert alert-success" style={{ marginTop: '10px' }}>
                  ✓ Rostro registrado correctamente
                </div>
              )}
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ color: '#667eea' }}>
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

