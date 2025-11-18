# 🔥 Guía Completa: Configurar Firebase desde Cero

## 📋 PASO 1: Crear el Proyecto en Firebase

### 1.1. Ir a Firebase Console
1. Abre tu navegador
2. Ve a: **https://console.firebase.google.com**
3. Inicia sesión con tu cuenta de Google

### 1.2. Crear Nuevo Proyecto
1. Si es la primera vez, verás un botón **"Crear un proyecto"** o **"Add project"**
2. Haz clic en **"Crear un proyecto"**

### 1.3. Nombre del Proyecto
1. En el campo **"Ingresa el nombre de tu proyecto"** escribe:
   ```
   parcial-faceid
   ```
   ⚠️ **IMPORTANTE:** Usa exactamente este nombre (todo en minúsculas, con guión)

2. El Project ID se generará automáticamente como: `parcial-faceid` (o similar)
   - Si te sugiere otro ID, puedes cambiarlo a: `parcial-faceid`
   - O déjalo como esté si es similar

3. Haz clic en **"Continuar"** o **"Continue"**

### 1.4. Google Analytics (Opcional)
1. Te preguntará si quieres habilitar Google Analytics
2. **Puedes desactivarlo** (no es necesario para este proyecto)
3. O puedes activarlo si quieres (no afecta la funcionalidad)
4. Haz clic en **"Continuar"** o **"Crear proyecto"**

### 1.5. Esperar a que se cree
- Espera unos segundos mientras Firebase crea el proyecto
- Cuando termine, verás el mensaje: **"Tu proyecto está listo"**
- Haz clic en **"Continuar"** o **"Continue"**

---

## 📋 PASO 2: Habilitar Firestore Database

### 2.1. Ir a Firestore
1. En el menú izquierdo, busca **"Firestore Database"**
2. Haz clic en **"Firestore Database"**

### 2.2. Crear Base de Datos
1. Verás un botón **"Crear base de datos"** o **"Create database"**
2. Haz clic en **"Crear base de datos"**

### 2.3. Configurar Reglas de Seguridad
1. Te preguntará sobre las reglas de seguridad
2. **SELECCIONA: "Modo de prueba"** o **"Start in test mode"**
   - ⚠️ Esto es importante para desarrollo
   - Permite lectura y escritura durante 30 días
3. Haz clic en **"Siguiente"** o **"Next"**

### 2.4. Elegir Ubicación
1. Te pedirá elegir una ubicación para la base de datos
2. **SELECCIONA:** La ubicación más cercana a ti, por ejemplo:
   - `us-central` (Estados Unidos)
   - `southamerica-east1` (Brasil - recomendado si estás en Latinoamérica)
   - `europe-west` (Europa)
3. Haz clic en **"Habilitar"** o **"Enable"**

### 2.5. Esperar a que se cree
- Espera unos segundos
- Verás la interfaz de Firestore con el mensaje: **"Cloud Firestore está listo"**

✅ **Firestore está habilitado**

---

## 📋 PASO 3: Habilitar Authentication

### 3.1. Ir a Authentication
1. En el menú izquierdo, busca **"Authentication"** o **"Autenticación"**
2. Haz clic en **"Authentication"**

### 3.2. Comenzar
1. Verás un botón **"Comenzar"** o **"Get started"**
2. Haz clic en **"Comenzar"**

### 3.3. Habilitar Método Anónimo
1. Verás una lista de métodos de autenticación
2. Busca **"Anónimo"** o **"Anonymous"** en la lista
3. Haz clic en **"Anónimo"** o **"Anonymous"**

### 3.4. Activar Método
1. Verás un interruptor o botón para activar
2. **ACTIVA** el método Anónimo (toggle a la derecha)
3. Haz clic en **"Guardar"** o **"Save"**

✅ **Authentication está habilitado**

---

## 📋 PASO 4: Habilitar Storage

### 4.1. Ir a Storage
1. En el menú izquierdo, busca **"Storage"** o **"Almacenamiento"**
2. Haz clic en **"Storage"**

### 4.2. Comenzar
1. Verás un botón **"Comenzar"** o **"Get started"**
2. Haz clic en **"Comenzar"**

### 4.3. Configurar Reglas de Seguridad
1. Te preguntará sobre las reglas de seguridad
2. **SELECCIONA: "Modo de prueba"** o **"Start in test mode"**
3. Haz clic en **"Siguiente"** o **"Next"**

### 4.4. Elegir Ubicación
1. Te pedirá elegir una ubicación
2. **SELECCIONA:** La misma ubicación que elegiste para Firestore
   - Si elegiste `southamerica-east1` para Firestore, elige la misma
3. Haz clic en **"Listo"** o **"Done"**

### 4.5. Esperar a que se cree
- Espera unos segundos
- Verás la interfaz de Storage

✅ **Storage está habilitado**

---

## 📋 PASO 5: Obtener las Credenciales

### 5.1. Ir a Configuración del Proyecto
1. En el menú izquierdo, busca el ícono de **⚙️ (engranaje)**
2. Haz clic en **"Configuración del proyecto"** o **"Project settings"**

### 5.2. Ir a la Sección de Apps
1. En la parte superior, verás pestañas
2. Busca la pestaña **"Tus apps"** o **"Your apps"**
3. Haz clic en esa pestaña

### 5.3. Agregar App Web
1. Verás un ícono de **`</>`** (código HTML) que dice **"Web"**
2. Haz clic en el ícono **"Web"**

### 5.4. Registrar App
1. Te pedirá un nombre para la app
2. Escribe: **`parcial-faceid-web`**
3. **NO marques** la casilla de Firebase Hosting (a menos que quieras usarlo)
4. Haz clic en **"Registrar app"** o **"Register app"**

### 5.5. Copiar las Credenciales
1. Verás un código JavaScript con tu configuración
2. **NO necesitas copiar todo el código**
3. Solo necesitas estos valores:
   - `apiKey`: "AIzaSy..."
   - `authDomain`: "parcial-faceid.firebaseapp.com"
   - `projectId`: "parcial-faceid"
   - `storageBucket`: "parcial-faceid.firebasestorage.app"
   - `messagingSenderId`: "871730742327"
   - `appId`: "1:871730742327:web:..."

4. **O simplemente verifica** que coincidan con los que ya tienes en tu `.env.local`

### 5.6. Continuar
1. Haz clic en **"Continuar en la consola"** o **"Continue to console"**
2. Ya no necesitas instalar nada más

---

## 📋 PASO 6: Verificar que Todo Esté Habilitado

### Checklist Final:
- [ ] ✅ Firestore Database está habilitado (verás datos en la interfaz)
- [ ] ✅ Authentication está habilitado (verás "Anónimo" activado)
- [ ] ✅ Storage está habilitado (verás archivos en la interfaz)
- [ ] ✅ Tienes las credenciales del proyecto

---

## 📋 PASO 7: Configurar el Archivo .env.local

### 7.1. Verificar que el archivo existe
Tu archivo `.env.local` ya debería tener estas credenciales (las que viste en el Paso 5.5):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDanvhWhXnGTf9T4RC_1PVbP-NahQakW5I
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=parcial-faceid.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=parcial-faceid
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=parcial-faceid.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=871730742327
NEXT_PUBLIC_FIREBASE_APP_ID=1:871730742327:web:4fa9cfe0acc49f14162bb2
```

### 7.2. Si las credenciales son diferentes
Si en el Paso 5.5 viste valores diferentes, actualiza el archivo `.env.local` con los nuevos valores.

---

## 📋 PASO 8: Probar la Conexión

### 8.1. Reiniciar el servidor
1. Detén el servidor (Ctrl + C en la terminal)
2. Limpia la caché:
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```
3. Reinicia:
   ```powershell
   npm run dev
   ```

### 8.2. Verificar en el navegador
1. Abre: `http://localhost:3000/check-database`
2. Haz clic en **"Ejecutar Verificación Completa"**
3. Deberías ver todo en verde ✅

---

## 🎯 Resumen de Nombres Usados

- **Nombre del Proyecto:** `parcial-faceid`
- **Project ID:** `parcial-faceid` (o el que Firebase genere)
- **Nombre de la App Web:** `parcial-faceid-web`
- **Ubicación Firestore:** La más cercana a ti (ej: `southamerica-east1`)
- **Ubicación Storage:** La misma que Firestore

---

## ❓ ¿Necesitas Ayuda?

Si en algún paso no encuentras algo o hay un error:
1. Toma una captura de pantalla
2. Dime en qué paso estás
3. Te ayudo a resolverlo

¡Vamos paso a paso! 🚀



