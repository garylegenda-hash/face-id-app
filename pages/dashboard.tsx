import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ProductRegistration from '../components/ProductRegistration';
import ProductSales from '../components/ProductSales';
import InventoryManagement from '../components/InventoryManagement';
import Reports from '../components/Reports';
import VoiceCommandButton from '../components/VoiceCommandButton';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<string>('register');
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/');
      } else {
        setUser(currentUser);
        // Obtener información del usuario desde localStorage
        const storedUserInfo = localStorage.getItem('faceIdUser');
        if (storedUserInfo) {
          try {
            setUserInfo(JSON.parse(storedUserInfo));
          } catch (e) {
            console.error('Error parsing user info:', e);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Limpiar información del usuario
      localStorage.removeItem('faceIdUser');
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <header style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: '#667eea', margin: 0 }}>Sistema de Gestión</h1>
          {userInfo && (
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              Bienvenido, {userInfo.name || userInfo.email}
              {userInfo.loginMethod === 'faceId' && ' (Face ID)'}
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          Cerrar Sesión
        </button>
      </header>

      <nav style={{ 
        background: 'white', 
        padding: '15px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button
          className={`btn ${activeModule === 'register' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveModule('register')}
        >
          Registrar Producto
        </button>
        <button
          className={`btn ${activeModule === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveModule('sales')}
        >
          Venta de Productos
        </button>
        <button
          className={`btn ${activeModule === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveModule('inventory')}
        >
          Gestión de Inventario
        </button>
        <button
          className={`btn ${activeModule === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveModule('reports')}
        >
          Reportes
        </button>
      </nav>

      <div className="card">
        {activeModule === 'register' && <ProductRegistration />}
        {activeModule === 'sales' && <ProductSales />}
        {activeModule === 'inventory' && <InventoryManagement />}
        {activeModule === 'reports' && <Reports />}
      </div>

      <VoiceCommandButton 
        onCommand={(command) => {
          if (command) {
            setActiveModule('reports');
            // Pasar el comando al componente Reports usando un evento personalizado
            window.dispatchEvent(new CustomEvent('voiceCommand', { detail: command }));
          }
        }} 
      />
    </div>
  );
}

