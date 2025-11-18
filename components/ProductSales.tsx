import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { generateInvoicePDF, InvoiceData } from '../lib/pdfGenerator';
import { v4 as uuidv4 } from 'uuid';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export default function ProductSales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsList);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      setError('Producto sin stock disponible');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        setError('No hay suficiente stock disponible');
        return;
      }
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        total: product.price,
      }]);
    }
    setError('');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      setError('No hay suficiente stock disponible');
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
    setError('');
  };

  const processSale = async () => {
    if (cart.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    if (!customerName || !customerId) {
      setError('Debes ingresar el nombre e ID del cliente');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Verificar stock y actualizar
      for (const item of cart) {
        const productDoc = await getDoc(doc(db, 'products', item.productId));
        if (!productDoc.exists()) {
          throw new Error(`Producto ${item.name} no encontrado`);
        }
        const productData = productDoc.data();
        if (productData.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.name}`);
        }
        await updateDoc(doc(db, 'products', item.productId), {
          stock: productData.stock - item.quantity,
        });
      }

      // Calcular totales
      const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.19; // IVA 19%
      const total = subtotal + tax;

      // Generar número de factura
      const invoiceNumber = `FAC-${Date.now()}`;

      // Guardar venta
      const saleData = {
        invoiceNumber,
        date: new Date().toISOString(),
        customerName,
        customerId,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        subtotal,
        tax,
        total,
      };

      await addDoc(collection(db, 'sales'), saleData);

      // Generar PDF
      const invoiceData: InvoiceData = {
        invoiceNumber,
        date: new Date().toLocaleDateString('es-ES'),
        customerName,
        customerId,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        subtotal,
        tax,
        total,
      };

      generateInvoicePDF(invoiceData);

      setMessage('Venta procesada exitosamente. Factura generada.');
      setCart([]);
      setCustomerName('');
      setCustomerId('');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <h2>Venta de Productos</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <h3>Productos Disponibles</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3>Carrito de Compras</h3>
          
          <div className="form-group">
            <label>Nombre del Cliente</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <div className="form-group">
            <label>ID del Cliente</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="ID o Cédula"
            />
          </div>

          {cart.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.productId}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.total.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '15px' }}>
                <strong>Total: ${cartTotal.toFixed(2)}</strong>
              </div>
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <button
            className="btn btn-primary"
            onClick={processSale}
            disabled={loading || cart.length === 0}
            style={{ width: '100%' }}
          >
            {loading ? 'Procesando...' : 'Procesar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
}

