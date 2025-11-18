# Sistema de Gestión con Face ID

Aplicación web completa para gestión de inventario con autenticación facial y por credenciales.

## Características

### Parte 1: Login
- Autenticación por credenciales
- Autenticación por Face ID (reconocimiento facial)
- Recuperación de contraseña por email

### Parte 2: Módulo de Operaciones
- Registro de productos con imagen (captura desde dispositivo)
- Venta de productos con factura PDF
- CRUD de inventario
- Reportes en Excel:
  - Valor total de ventas
  - Total de productos en stock
  - Total de compras por cliente

### Parte 3: IA y Deploy (Opcional)
- Comandos de voz para generar reportes
- Procesamiento de lenguaje natural

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar Firebase:
   - Crear proyecto en Firebase Console
   - Habilitar Firestore Database
   - Habilitar Authentication
   - Habilitar Storage
   - Copiar las credenciales a `.env.local`

3. Configurar variables de entorno:
```env

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## Ejecutar el Programa

### 1. Instalar dependencias (si no lo has hecho):
```bash
npm install
```

### 2. Verificar configuración de Firebase:
Asegúrate de tener el archivo `.env.local` en la raíz del proyecto con todas las variables de entorno configuradas.

### 3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### 4. Abrir en el navegador:
La aplicación estará disponible en: `http://localhost:3000`

---

## Guía de Testing

### **PARTE 1: TESTING DEL LOGIN**

#### **Test 1: Registro de Usuario**
1. Ve a `http://localhost:3000/register`
2. Completa el formulario:
   - Nombre completo
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirma la contraseña
3. **Opcional**: Marca "Registrar Face ID" y captura tu rostro
4. Haz clic en "Registrarse"
5. ✅ **Resultado esperado**: Mensaje de éxito y redirección al login

#### **Test 2: Login con Credenciales**
1. Ve a `http://localhost:3000`
2. Asegúrate de estar en la pestaña "Credenciales"
3. Ingresa el email y contraseña registrados
4. Haz clic en "Iniciar Sesión"
5. ✅ **Resultado esperado**: Redirección al dashboard con mensaje "Bienvenido, [tu nombre]"

#### **Test 3: Login con Face ID**
1. Ve a `http://localhost:3000`
2. Cambia a la pestaña "Face ID"
3. Asegúrate de tener buena iluminación
4. Haz clic en "Iniciar Sesión con Face ID"
5. ✅ **Resultado esperado**: 
   - Detecta tu rostro
   - Muestra "¡Bienvenido, [tu nombre]!"
   - Redirección al dashboard con indicador "(Face ID)"

#### **Test 4: Recuperación de Contraseña**
1. Ve a `http://localhost:3000/forgot-password`
2. Ingresa el email registrado
3. Haz clic en "Enviar Enlace de Recuperación"
4. ✅ **Resultado esperado**: Mensaje confirmando que se envió el email
5. Revisa tu correo y haz clic en el enlace
6. Ingresa una nueva contraseña
7. ✅ **Resultado esperado**: Contraseña actualizada y redirección al login

---

### **PARTE 2: TESTING DEL MÓDULO DE OPERACIONES**

#### **Test 5: Registro de Producto con Imagen**
1. Desde el dashboard, haz clic en "Registrar Producto"
2. Completa el formulario:
   - Nombre del producto
   - Descripción
   - Precio
   - Stock
3. **Captura imagen**:
   - Usa la cámara para capturar una imagen del producto
   - O selecciona un archivo de imagen
4. Haz clic en "Registrar Producto"
5. ✅ **Resultado esperado**: 
   - Mensaje de éxito
   - Formulario se limpia
   - Producto aparece en el inventario

#### **Test 6: Venta de Productos con Factura PDF**
1. Haz clic en "Venta de Productos"
2. Ingresa:
   - Nombre del cliente
   - ID del cliente
3. Agrega productos al carrito:
   - Selecciona un producto
   - Ingresa cantidad
   - Haz clic en "Agregar al Carrito"
4. Revisa el resumen del carrito
5. Haz clic en "Realizar Venta"
6. ✅ **Resultado esperado**:
   - Se genera y descarga un PDF con la factura
   - El stock se actualiza automáticamente
   - Mensaje de éxito

#### **Test 7: CRUD de Inventario**
1. Haz clic en "Gestión de Inventario"
2. **READ (Leer)**:
   - ✅ Ver lista de productos con imágenes
3. **UPDATE (Actualizar)**:
   - Haz clic en "Editar" en un producto
   - Modifica los campos
   - Opcionalmente cambia la imagen
   - Haz clic en "Actualizar"
   - ✅ **Resultado esperado**: Producto actualizado
4. **DELETE (Eliminar)**:
   - Haz clic en "Eliminar" en un producto
   - Confirma la eliminación
   - ✅ **Resultado esperado**: Producto eliminado de la lista

#### **Test 8: Generación de Reportes en Excel**

**Reporte 1: Valor Total de Ventas**
1. Haz clic en "Reportes"
2. Selecciona "Reporte de Ventas"
3. Haz clic en "Generar Reporte"
4. ✅ **Resultado esperado**: Se descarga `reporte-ventas.xlsx` con:
   - Lista de todas las ventas
   - Valor total de ventas al final

**Reporte 2: Total de Productos en Stock**
1. En "Reportes", selecciona "Reporte de Inventario"
2. Haz clic en "Generar Reporte"
3. ✅ **Resultado esperado**: Se descarga `reporte-inventario.xlsx` con:
   - Lista de productos con stock
   - Total de productos en stock

**Reporte 3: Total de Compras por Cliente**
1. En "Reportes", selecciona "Reporte por Cliente"
2. Ingresa el nombre o ID del cliente
3. Haz clic en "Generar Reporte"
4. ✅ **Resultado esperado**: Se descarga `reporte-cliente-[ID].xlsx` con:
   - Información del cliente
   - Lista de compras
   - Total de compras

#### **Test 9: Cerrar Sesión**
1. Haz clic en "Cerrar Sesión" en el header
2. ✅ **Resultado esperado**: Redirección al login

---

### **PARTE 3: TESTING DE IA Y COMANDOS DE VOZ**

#### **Test 10: Comandos de Voz para Reportes**
1. Inicia sesión y ve al dashboard
2. Localiza el botón de micrófono (🎤) en la esquina inferior derecha
3. Haz clic en el botón
4. Di uno de estos comandos:
   - "Generar reporte de ventas"
   - "Reporte de inventario"
   - "Compras del cliente [nombre o ID]"
5. ✅ **Resultado esperado**:
   - El sistema reconoce el comando
   - Se cambia automáticamente a la pestaña "Reportes"
   - Se genera el reporte correspondiente

---

## Solución de Problemas

### **Error: "Cámara no disponible"**
- Verifica que el navegador tenga permisos de cámara
- Asegúrate de usar HTTPS o localhost (no funciona en HTTP en algunos navegadores)

### **Error: "Error al cargar modelos de reconocimiento facial"**
- Verifica que los modelos estén en `/public/models/`
- Revisa la consola del navegador para más detalles

### **Error: "Firebase Storage no está habilitado"**
- Ve a Firebase Console > Storage
- Habilita Firebase Storage
- Configura las reglas de seguridad

### **Error: "Usuario no encontrado" o "Rostro no reconocido"**
- Asegúrate de haber registrado el usuario primero
- Para Face ID, verifica que hayas capturado tu rostro durante el registro

### **Los reportes no se descargan**
- Verifica que el navegador permita descargas
- Revisa la consola del navegador para errores

---

## Deploy

La aplicación está lista para desplegar en Vercel, Railway, o Render.

### **Vercel:**
```bash
npm install -g vercel
vercel
```

### **Railway:**
- Conecta tu repositorio
- Railway detectará automáticamente Next.js
- Configura las variables de entorno

### **Render:**
- Conecta tu repositorio
- Selecciona "Web Service"
- Usa el comando: `npm start`

