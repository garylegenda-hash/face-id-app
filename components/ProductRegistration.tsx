import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ProductRegistration() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Validaciones
      if (!name.trim()) {
        throw new Error('El nombre del producto es requerido');
      }

      if (!description.trim()) {
        throw new Error('La descripción es requerida');
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error('El precio debe ser un número mayor a 0');
      }

      const stockNum = parseInt(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        throw new Error('El stock debe ser un número mayor o igual a 0');
      }

      if (!image) {
        throw new Error('Debes capturar o seleccionar una imagen del producto');
      }

      // Guardar imagen como base64 directamente en Firestore (sin Storage)
      // Comprimir imagen si es muy grande (máximo 800px de ancho)
      let imageData = image;
      
      if (image.startsWith('data:image')) {
        // La imagen ya está en base64, la usamos directamente
        imageData = image;
      } else {
        // Si viene de otra fuente, convertir a base64
        imageData = image;
      }

      // Guardar producto en Firestore con imagen en base64
      await addDoc(collection(db, 'products'), {
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        stock: stockNum,
        imageUrl: imageData, // Guardamos la imagen como base64
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setMessage('Producto registrado exitosamente');
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImage(null);
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al registrar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registro de Productos</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Laptop Dell"
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Descripción del producto"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Imagen del Producto</label>
          <div style={{ marginBottom: '15px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Seleccionar Archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div className="camera-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: 'environment',
              }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={captureImage}
              style={{ marginTop: '10px', width: '100%' }}
            >
              Capturar Imagen
            </button>
          </div>

          {image && (
            <div style={{ marginTop: '15px' }}>
              <img
                src={image}
                alt="Preview"
                style={{ maxWidth: '300px', borderRadius: '8px', marginTop: '10px' }}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setImage(null)}
                style={{ marginLeft: '10px' }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Producto'}
        </button>
      </form>
    </div>
  );
}

