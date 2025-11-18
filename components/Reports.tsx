import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { generateSalesReport, generateStockReport, generateCustomerReport } from '../lib/excelGenerator';
import { VoiceCommand } from '../lib/voiceAI';

export default function Reports() {
  const [reportType, setReportType] = useState<'sales' | 'stock' | 'customer'>('sales');
  const [customerSearch, setCustomerSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      if (reportType === 'sales') {
        const salesRef = collection(db, 'sales');
        const snapshot = await getDocs(salesRef);
        const sales = snapshot.docs.map(doc => ({
          date: new Date(doc.data().date).toLocaleDateString('es-ES'),
          customer: doc.data().customerName,
          total: doc.data().total,
        }));

        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

        generateSalesReport({
          totalSales,
          sales,
        });
      } else if (reportType === 'stock') {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          stock: doc.data().stock,
          price: doc.data().price,
        }));

        const totalProducts = products.reduce((sum, product) => sum + product.stock, 0);

        generateStockReport({
          totalProducts,
          products,
        });
      } else if (reportType === 'customer') {
        if (!customerSearch.trim()) {
          setError('Debes ingresar el nombre o ID del cliente');
          setLoading(false);
          return;
        }

        const salesRef = collection(db, 'sales');
        let q;

        // Buscar por ID o nombre
        if (/^\d+$/.test(customerSearch.trim())) {
          // Si es solo números, buscar por ID
          q = query(salesRef, where('customerId', '==', customerSearch.trim()));
        } else {
          // Buscar por nombre
          q = query(salesRef, where('customerName', '==', customerSearch.trim()));
        }

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError('No se encontraron compras para este cliente');
          setLoading(false);
          return;
        }

        const purchases = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            date: new Date(data.date).toLocaleDateString('es-ES'),
            invoiceNumber: data.invoiceNumber,
            total: data.total,
          };
        });

        const firstDoc = snapshot.docs[0].data();
        const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0);

        generateCustomerReport({
          customerId: firstDoc.customerId,
          customerName: firstDoc.customerName,
          totalPurchases,
          purchases,
        });
      }

      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  }, [reportType, customerSearch]);

  useEffect(() => {
    const handleVoiceCommand = (event: CustomEvent<VoiceCommand>) => {
      const command = event.detail;
      if (command.type === 'sales') {
        setReportType('sales');
        setTimeout(() => generateReport(), 500);
      } else if (command.type === 'stock') {
        setReportType('stock');
        setTimeout(() => generateReport(), 500);
      } else if (command.type === 'customer') {
        setReportType('customer');
        if (command.customerId) {
          setCustomerSearch(command.customerId);
          setTimeout(() => generateReport(), 500);
        } else if (command.customerName) {
          setCustomerSearch(command.customerName);
          setTimeout(() => generateReport(), 500);
        } else {
          setError('Por favor, especifica el nombre o ID del cliente');
        }
      }
    };

    window.addEventListener('voiceCommand', handleVoiceCommand as EventListener);
    return () => {
      window.removeEventListener('voiceCommand', handleVoiceCommand as EventListener);
    };
  }, [generateReport]);

  return (
    <div>
      <h2>Generación de Reportes</h2>

      <div className="form-group">
        <label>Tipo de Reporte</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'sales' | 'stock' | 'customer')}
          style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
        >
          <option value="sales">Valor Total de Ventas</option>
          <option value="stock">Total de Productos en Stock</option>
          <option value="customer">Total de Compras por Cliente</option>
        </select>
      </div>

      {reportType === 'customer' && (
        <div className="form-group">
          <label>Buscar Cliente (Nombre o ID)</label>
          <input
            type="text"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Ingresa el nombre o ID del cliente"
          />
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ marginTop: '20px' }}>
        <button
          className="btn btn-primary"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar Reporte Excel'}
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Instrucciones:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Valor Total de Ventas:</strong> Genera un reporte con todas las ventas realizadas y su valor total.</li>
          <li><strong>Total de Productos en Stock:</strong> Genera un reporte con todos los productos y su cantidad en inventario.</li>
          <li><strong>Total de Compras por Cliente:</strong> Busca un cliente por nombre o ID y genera un reporte de todas sus compras.</li>
        </ul>
        <p style={{ marginTop: '15px', color: '#666' }}>
          Los reportes se descargarán automáticamente en formato Excel (.xlsx)
        </p>
      </div>
    </div>
  );
}

