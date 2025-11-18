# Instrucciones de Uso - Sistema de Gestión con Face ID

## Características Implementadas

### ✅ PARTE 1: LOGIN

#### Método 1: Credenciales
1. Ingresa tu email y contraseña
2. Haz clic en "Iniciar Sesión"
3. Si no tienes cuenta, haz clic en "¿No tienes cuenta? Regístrate"

#### Método 2: Face ID
1. Selecciona la pestaña "Face ID"
2. Asegúrate de tener buena iluminación
3. Mira directamente a la cámara
4. Haz clic en "Iniciar Sesión con Face ID"
5. El sistema reconocerá tu rostro si está registrado

#### Recuperación de Contraseña
1. En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. Revisa tu correo electrónico para el enlace de recuperación
4. Haz clic en el enlace y establece una nueva contraseña

### ✅ PARTE 2: MÓDULO DE OPERACIONES

#### 1. Registro de Productos
- **Ubicación**: Dashboard > "Registrar Producto"
- **Pasos**:
  1. Completa el formulario (nombre, descripción, precio, stock)
  2. Captura o selecciona una imagen del producto
  3. Haz clic en "Registrar Producto"

#### 2. Venta de Productos
- **Ubicación**: Dashboard > "Venta de Productos"
- **Pasos**:
  1. Selecciona productos del catálogo y agrega al carrito
  2. Ingresa nombre e ID del cliente
  3. Ajusta cantidades si es necesario
  4. Haz clic en "Procesar Venta"
  5. Se generará automáticamente un PDF con la factura

#### 3. Gestión de Inventario (CRUD)
- **Ubicación**: Dashboard > "Gestión de Inventario"
- **Funciones**:
  - **Ver**: Lista todos los productos con sus imágenes
  - **Editar**: Haz clic en "Editar" para modificar un producto
  - **Eliminar**: Haz clic en "Eliminar" para borrar un producto
  - **Actualizar**: Modifica cualquier campo y guarda los cambios

#### 4. Generación de Reportes
- **Ubicación**: Dashboard > "Reportes"
- **Tipos de Reportes**:
  
  **a) Valor Total de Ventas**
  - Genera un Excel con todas las ventas y el total
  
  **b) Total de Productos en Stock**
  - Genera un Excel con todos los productos y su stock
  
  **c) Total de Compras por Cliente**
  - Ingresa el nombre o ID del cliente
  - Genera un Excel con todas sus compras

### ✅ PARTE 3: IA Y COMANDOS DE VOZ (OPCIONAL)

#### Uso de Comandos de Voz
1. Haz clic en el botón flotante del micrófono (esquina inferior derecha)
2. Di uno de los siguientes comandos:
   - **"Generar reporte de ventas"** o **"reporte de ventas"**
   - **"Generar reporte de inventario"** o **"reporte de stock"**
   - **"Compras del cliente [nombre]"** o **"compras del cliente [ID]"**
3. El sistema procesará tu comando y generará el reporte automáticamente

## Estructura de la Base de Datos (Firestore)

### Colección: `users`
```javascript
{
  email: string,
  password: string, // En producción usar hash
  name: string,
  faceDescriptor: number[], // Opcional, para Face ID
  resetToken: string, // Opcional, para recuperación
  resetTokenExpiry: number, // Timestamp
  createdAt: string
}
```

### Colección: `products`
```javascript
{
  name: string,
  description: string,
  price: number,
  stock: number,
  imageUrl: string,
  createdAt: string
}
```

### Colección: `sales`
```javascript
{
  invoiceNumber: string,
  date: string,
  customerName: string,
  customerId: string,
  items: Array<{
    productId: string,
    name: string,
    quantity: number,
    price: number,
    total: number
  }>,
  subtotal: number,
  tax: number,
  total: number
}
```

## Comandos de Voz Soportados

El sistema reconoce los siguientes comandos en español:

- **Ventas**: "venta", "ventas", "sales"
- **Inventario**: "inventario", "stock", "productos"
- **Cliente**: "cliente", "customer", "compra" + nombre/ID

Ejemplos:
- "Generar reporte de ventas"
- "Quiero ver el reporte de inventario"
- "Compras del cliente Juan Pérez"
- "Reporte de compras del cliente 12345"

## Notas Importantes

1. **Face ID**: Requiere que el usuario se registre primero con su rostro
2. **Cámara**: Necesita permisos de cámara para capturar imágenes y Face ID
3. **Navegador**: Los comandos de voz funcionan mejor en Chrome o Edge
4. **Email**: Configura correctamente las credenciales de email para recuperación de contraseña
5. **Modelos**: Los modelos de face-api.js deben estar en `public/models/`

## Solución de Problemas

### Face ID no funciona
- Verifica que los modelos estén en `public/models/`
- Asegúrate de tener buena iluminación
- Verifica que el usuario tenga Face ID registrado

### Comandos de voz no funcionan
- Usa Chrome o Edge
- Verifica permisos del micrófono
- Habla claramente y cerca del micrófono

### Error al generar PDF
- Verifica que el navegador permita descargas
- Revisa la consola del navegador para errores

### Error al generar Excel
- Verifica que el navegador permita descargas
- Asegúrate de tener datos en la base de datos

