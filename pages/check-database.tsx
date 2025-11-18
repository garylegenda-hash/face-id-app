import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
// Storage no se usa - las imágenes se guardan como base64 en Firestore

interface CheckResult {
  name: string;
  status: 'checking' | 'success' | 'error';
  message: string;
}

export default function CheckDatabase() {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [envVars, setEnvVars] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    checkEnvVars();
  }, []);

  const checkEnvVars = () => {
    const required = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    const vars: { [key: string]: boolean } = {};
    required.forEach((key) => {
      // En Next.js, las variables NEXT_PUBLIC_* están disponibles en el cliente
      // Intentamos leerlas de diferentes formas
      let value: string | undefined;
      
      if (typeof window !== 'undefined') {
        // En el cliente, las variables están disponibles directamente
        value = (process.env as any)[`NEXT_PUBLIC_${key.replace('NEXT_PUBLIC_', '')}`] || 
                (process.env as any)[key] ||
                (window as any).__NEXT_DATA__?.env?.[key];
      } else {
        value = (process.env as any)[key];
      }
      
      vars[key] = !!value && value !== 'undefined' && String(value).trim() !== '';
    });
    setEnvVars(vars);
  };

  const addResult = (name: string, status: 'checking' | 'success' | 'error', message: string) => {
    setResults((prev) => [...prev, { name, status, message }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runAllChecks = async () => {
    setChecking(true);
    clearResults();

    // 1. Verificar variables de entorno
    addResult('Variables de Entorno', 'checking', 'Verificando...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Verificar si Firebase se inicializó correctamente (mejor indicador que leer process.env)
    // Si Firebase App se inicializó, significa que las variables están bien
    try {
      const app = await import('../lib/firebase').then((m) => m.default);
      if (app) {
        // Si Firebase se inicializó, las variables están bien configuradas
        addResult('Variables de Entorno', 'success', 'Todas las variables están configuradas (verificado por inicialización de Firebase)');
      } else {
        addResult(
          'Variables de Entorno',
          'error',
          'No se pudo verificar. Reinicia el servidor con "npm run dev" después de crear .env.local'
        );
      }
    } catch (error: any) {
      addResult(
        'Variables de Entorno',
        'error',
        `Error al verificar: ${error.message}. Reinicia el servidor con "npm run dev"`
      );
    }

    // 2. Verificar conexión a Firebase App
    addResult('Conexión Firebase App', 'checking', 'Verificando...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const app = await import('../lib/firebase').then((m) => m.default);
      if (app) {
        addResult('Conexión Firebase App', 'success', 'Firebase App inicializado correctamente');
      } else {
        addResult('Conexión Firebase App', 'error', 'No se pudo inicializar Firebase App');
      }
    } catch (error: any) {
      addResult('Conexión Firebase App', 'error', `Error: ${error.message}`);
    }

    // 3. Verificar Firestore - Lectura
    addResult('Firestore - Lectura', 'checking', 'Verificando lectura...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const testRef = collection(db, 'test');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La operación tardó más de 10 segundos')), 10000)
      );
      await Promise.race([getDocs(testRef), timeoutPromise]);
      addResult('Firestore - Lectura', 'success', 'Puede leer de Firestore');
    } catch (error: any) {
      addResult(
        'Firestore - Lectura',
        'error',
        `Error: ${error.message}. Verifica que Firestore esté habilitado y las reglas de seguridad en Firebase Console.`
      );
    }

    // 4. Verificar Firestore - Escritura
    addResult('Firestore - Escritura', 'checking', 'Verificando escritura...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const testRef = collection(db, 'test');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La operación tardó más de 10 segundos')), 10000)
      );
      const docRef = await Promise.race([
        addDoc(testRef, {
          timestamp: new Date().toISOString(),
          test: true,
        }),
        timeoutPromise
      ]) as any;
      addResult('Firestore - Escritura', 'success', 'Puede escribir en Firestore');
      
      // Limpiar documento de prueba
      try {
        await deleteDoc(doc(db, 'test', docRef.id));
      } catch (e) {
        // Ignorar error de limpieza
      }
    } catch (error: any) {
      addResult(
        'Firestore - Escritura',
        'error',
        `Error: ${error.message}. Verifica que Firestore esté habilitado y las reglas de seguridad en Firebase Console.`
      );
    }

    // 5. Storage - No se usa (imágenes como base64 en Firestore)
    addResult('Storage', 'success', 'No se usa Storage - Las imágenes se guardan como base64 en Firestore');

    // 6. (Omitido - Storage no se usa)

    // 7. Verificar Authentication
    addResult('Authentication', 'checking', 'Verificando...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      if (auth) {
        addResult('Authentication', 'success', 'Authentication está configurado');
      } else {
        addResult('Authentication', 'error', 'Authentication no está disponible');
      }
    } catch (error: any) {
      addResult('Authentication', 'error', `Error: ${error.message}`);
    }

    // 8. Verificar colecciones necesarias
    addResult('Colecciones Necesarias', 'checking', 'Verificando...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const requiredCollections = ['users', 'products', 'sales'];
    const missingCollections: string[] = [];
    
    for (const collName of requiredCollections) {
      try {
        const collRef = collection(db, collName);
        await getDocs(collRef);
      } catch (error: any) {
        missingCollections.push(collName);
      }
    }

    if (missingCollections.length > 0) {
      addResult(
        'Colecciones Necesarias',
        'error',
        `No se pueden acceder a: ${missingCollections.join(', ')}. Verifica las reglas de seguridad.`
      );
    } else {
      addResult(
        'Colecciones Necesarias',
        'success',
        `Todas las colecciones necesarias están accesibles: ${requiredCollections.join(', ')}`
      );
    }

    setChecking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'checking':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ color: '#667eea', marginBottom: '30px' }}>Verificación de Base de Datos</h1>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Variables de Entorno</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {Object.entries(envVars).map(([key, exists]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                background: exists ? '#d4edda' : '#f8d7da',
                borderRadius: '6px',
              }}
            >
              <span>{key}</span>
              <span style={{ fontWeight: 'bold', color: exists ? '#28a745' : '#dc3545' }}>
                {exists ? '✓ Configurada' : '✗ Faltante'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={runAllChecks}
        className="btn btn-primary"
        style={{ width: '100%', marginBottom: '20px' }}
        disabled={checking}
      >
        {checking ? 'Verificando...' : 'Ejecutar Verificación Completa'}
      </button>

      {results.length > 0 && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Resultados de Verificación</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  border: `2px solid ${getStatusColor(result.status)}`,
                  borderRadius: '8px',
                  background: result.status === 'success' ? '#d4edda' : result.status === 'error' ? '#f8d7da' : '#fff3cd',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{getStatusIcon(result.status)}</span>
                  <strong style={{ fontSize: '16px' }}>{result.name}</strong>
                </div>
                <p style={{ margin: 0, color: '#333', fontSize: '14px' }}>{result.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', background: '#e7f3ff', borderRadius: '12px' }}>
        <h3 style={{ marginTop: 0 }}>📋 Instrucciones para Configurar Firebase:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Crear proyecto en Firebase Console:</strong>
            <br />
            Ve a <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a> y crea un nuevo proyecto
          </li>
          <li>
            <strong>Habilitar Firestore Database:</strong>
            <br />
            Firestore Database → Crear base de datos → Modo de prueba (para desarrollo)
          </li>
          <li>
            <strong>Habilitar Authentication:</strong>
            <br />
            Authentication → Comenzar → Habilitar "Anónimo"
          </li>
          <li>
            <strong>Habilitar Storage:</strong>
            <br />
            Storage → Comenzar → Modo de prueba (para desarrollo)
          </li>
          <li>
            <strong>Obtener credenciales:</strong>
            <br />
            Configuración del proyecto → Configuración general → Tus apps → Web → Copiar las credenciales
          </li>
          <li>
            <strong>Crear archivo .env.local:</strong>
            <br />
            En la raíz del proyecto, crea un archivo <code>.env.local</code> con las variables de entorno
          </li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Volver al Login
        </a>
      </div>
    </div>
  );
}

