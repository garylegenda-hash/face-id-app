import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
      setError('Error al cargar productos');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const productRef = doc(db, 'products', editingProduct.id);
      const updateData: any = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        stock: editingProduct.stock,
      };

      // Si hay una nueva imagen, guardarla como base64 (sin Storage)
      if (editingProduct.imageUrl && editingProduct.imageUrl.startsWith('data:')) {
        // La imagen ya está en base64, la guardamos directamente
        updateData.imageUrl = editingProduct.imageUrl;
      }

      await updateDoc(productRef, updateData);
      setMessage('Producto actualizado exitosamente');
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      setMessage('Producto eliminado exitosamente');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({
          ...editingProduct,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2>Gestión de Inventario</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {editingProduct ? (
        <div className="card">
          <h3>Editar Producto</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {editingProduct.imageUrl && (
                <img
                  src={editingProduct.imageUrl}
                  alt="Preview"
                  style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }}
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingProduct(null)}
            >
              Cancelar
            </button>
          </form>
        </div>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(product)}
                      style={{ marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

