# 🔍 Cómo Verificar la Configuración de Firebase

Hay **3 formas** de verificar si tu base de datos está bien configurada:

---

## **Método 1: Verificación Rápida desde Terminal** ⚡

Ejecuta este comando en la terminal:

```bash
npm run check-firebase
```

Este script verifica:
- ✅ Si existe el archivo `.env.local`
- ✅ Si todas las variables de entorno están configuradas
- ✅ Si los modelos de Face API están presentes

**Resultado esperado:**
```
✅ Archivo .env.local encontrado
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
...
✅ Verificación básica completada
```

---

## **Método 2: Verificación Completa desde el Navegador** 🌐

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abre en tu navegador:**
   ```
   http://localhost:3000/check-database
   ```

3. **Haz clic en "Ejecutar Verificación Completa"**

Esta página verifica:
- ✅ Variables de entorno configuradas
- ✅ Conexión a Firebase App
- ✅ Firestore - Lectura
- ✅ Firestore - Escritura
- ✅ Storage - Lectura
- ✅ Storage - Escritura
- ✅ Authentication configurado
- ✅ Colecciones necesarias accesibles

**Resultado esperado:** Todos los checks en verde ✅

---

## **Método 3: Verificación Manual** 🔧

### **Paso 1: Verificar archivo .env.local**

Asegúrate de tener un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
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

### **Paso 2: Verificar Firebase Console**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Verifica que estén habilitados:
   - ✅ **Firestore Database** (en modo de prueba para desarrollo)
   - ✅ **Authentication** (con método "Anónimo" habilitado)
   - ✅ **Storage** (en modo de prueba para desarrollo)

### **Paso 3: Verificar Reglas de Seguridad**

**Firestore Rules** (deben estar en modo de prueba para desarrollo):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

**Storage Rules** (deben estar en modo de prueba para desarrollo):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

⚠️ **IMPORTANTE:** Estas reglas son solo para desarrollo. En producción, debes usar reglas más restrictivas.

---

## **Problemas Comunes y Soluciones** 🛠️

### **Error: "Faltan variables de entorno"**
- **Solución:** Crea el archivo `.env.local` en la raíz del proyecto
- **Verifica:** Que todas las variables empiecen con `NEXT_PUBLIC_` para Firebase

### **Error: "Firestore - Error de lectura/escritura"**
- **Solución:** 
  1. Ve a Firebase Console → Firestore Database
  2. Verifica que esté habilitado
  3. Revisa las reglas de seguridad (deben permitir lectura/escritura)

### **Error: "Storage no está habilitado"**
- **Solución:**
  1. Ve a Firebase Console → Storage
  2. Haz clic en "Comenzar"
  3. Selecciona "Modo de prueba"
  4. Revisa las reglas de seguridad

### **Error: "Authentication no está disponible"**
- **Solución:**
  1. Ve a Firebase Console → Authentication
  2. Haz clic en "Comenzar"
  3. Habilita el método "Anónimo"

### **Error: "No se pueden acceder a las colecciones"**
- **Solución:** 
  1. Verifica las reglas de Firestore
  2. Asegúrate de que estén en modo de prueba
  3. Las colecciones se crean automáticamente al usarlas

---

## **Checklist de Configuración** ✅

Antes de usar la aplicación, verifica:

- [ ] Archivo `.env.local` creado
- [ ] Todas las variables de entorno configuradas
- [ ] Firestore Database habilitado
- [ ] Authentication habilitado (método Anónimo)
- [ ] Storage habilitado
- [ ] Reglas de seguridad en modo de prueba
- [ ] Modelos de Face API en `/public/models/`
- [ ] Script `npm run check-firebase` ejecuta sin errores
- [ ] Página `/check-database` muestra todos los checks en verde

---

## **Próximos Pasos** 🚀

Una vez que todo esté verificado:

1. Ejecuta `npm run dev`
2. Ve a `http://localhost:3000`
3. Registra un usuario
4. Prueba el login con credenciales y Face ID
5. Prueba todas las funcionalidades del dashboard

¡Listo! Tu base de datos está configurada correctamente. 🎉



