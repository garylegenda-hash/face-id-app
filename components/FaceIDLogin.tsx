import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Webcam from 'react-webcam';
import { detectFace, compareFaces, arrayToFaceDescriptor } from '../lib/faceRecognition';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function FaceIDLogin() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar modelos de reconocimiento facial
    import('../lib/faceRecognition').then(({ loadFaceModels }) => {
      loadFaceModels().catch((err) => {
        console.error('Error loading face models:', err);
        setError('Error al cargar modelos de reconocimiento facial');
      });
    });
  }, []);

  const captureAndVerify = async () => {
    if (!webcamRef.current) {
      setError('Cámara no disponible');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    setIsCapturing(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('No se pudo capturar la imagen');
      }

      // Crear elemento de imagen para procesar
      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Detectar rostro en la imagen capturada
      const detection = await detectFace(img);
      if (!detection || !detection.descriptor) {
        throw new Error('No se detectó ningún rostro. Por favor, intenta de nuevo.');
      }

      // Obtener todos los usuarios con Face ID registrado
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let matchedUser: { id: string; name?: string; email?: string; [key: string]: any } | null = null;
      let minDistance = Infinity;
      const threshold = 0.6; // Umbral de similitud

      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        if (userData.faceDescriptor && Array.isArray(userData.faceDescriptor)) {
          const storedDescriptor = arrayToFaceDescriptor(userData.faceDescriptor);
          const distance = await compareFaces(detection.descriptor, storedDescriptor);
          
          if (distance < threshold && distance < minDistance) {
            minDistance = distance;
            matchedUser = { id: doc.id, ...userData };
          }
        }
      }

      if (!matchedUser) {
        throw new Error('Rostro no reconocido. Por favor, regístrate primero.');
      }

      setSuccess(`¡Bienvenido, ${matchedUser.name || matchedUser.email || 'Usuario'}!`);
      
      // Autenticar usuario anónimamente para mantener sesión de Firebase
      try {
        await signInAnonymously(auth);
        
        // Guardar información del usuario real en localStorage
        // Esto permite identificar al usuario después del reconocimiento facial
        localStorage.setItem('faceIdUser', JSON.stringify({
          id: matchedUser.id,
          name: matchedUser.name || '',
          email: matchedUser.email || '',
          loginMethod: 'faceId',
          loginTime: new Date().toISOString()
        }));
      } catch (authError) {
        console.error('Auth error:', authError);
        throw new Error('Error al autenticar. Por favor, intenta de nuevo.');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Error en el reconocimiento facial');
    } finally {
      setLoading(false);
      setIsCapturing(false);
    }
  };

  return (
    <div>
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
          style={{ width: '100%' }}
        />
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <button
        onClick={captureAndVerify}
        className="btn btn-primary"
        style={{ width: '100%' }}
        disabled={loading || isCapturing}
      >
        {loading ? 'Verificando...' : isCapturing ? 'Capturando...' : 'Iniciar Sesión con Face ID'}
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '14px' }}>
        Asegúrate de tener buena iluminación y mirar directamente a la cámara
      </p>
    </div>
  );
}

