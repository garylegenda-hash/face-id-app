# 🔧 Solución Paso a Paso de Problemas

## 📋 PASO 1: Verificar que el archivo .env.local existe

Ejecuta en la terminal:
```bash
npm run check-firebase
```

**Si dice "Archivo .env.local encontrado"** → ✅ Continúa al Paso 2
**Si dice "No se encontró el archivo .env.local"** → Crea el archivo manualmente

---

## 📋 PASO 2: Detener TODOS los procesos de Node.js

**IMPORTANTE:** Debes detener completamente el servidor antes de continuar.

1. Ve a la terminal donde está corriendo `npm run dev`
2. Presiona `Ctrl + C` para detenerlo
3. Espera 5 segundos
4. Verifica que no haya procesos corriendo:
   ```bash
   tasklist | findstr node
   ```
   Si ves procesos, ciérralos desde el Administrador de Tareas

---

## 📋 PASO 3: Verificar el contenido del archivo .env.local

Abre el archivo `.env.local` en la raíz del proyecto y verifica que tenga EXACTAMENTE esto (sin espacios extra):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDanvhWhXnGTf9T4RC_1PVbP-NahQakW5I
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=parcial-faceid.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=parcial-faceid
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=parcial-faceid.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=871730742327
NEXT_PUBLIC_FIREBASE_APP_ID=1:871730742327:web:4fa9cfe0acc49f14162bb2

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

**IMPORTANTE:**
- No debe haber espacios antes o después del `=`
- No debe haber comillas alrededor de los valores
- Cada variable debe estar en una línea separada

---

## 📋 PASO 4: Limpiar caché de Next.js

Ejecuta estos comandos en orden:

```bash
# Limpiar caché de Next.js
rm -r .next
# O en Windows PowerShell:
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Limpiar node_modules (opcional, solo si hay problemas)
npm cache clean --force
```

---

## 📋 PASO 5: Reiniciar el servidor

```bash
npm run dev
```

**Espera a que veas:**
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
```

---

## 📋 PASO 6: Verificar en el navegador

1. Abre: `http://localhost:3000/check-database`
2. Haz clic en "Ejecutar Verificación Completa"
3. Espera máximo 1 minuto

**Si todo está bien, deberías ver:**
- ✅ Variables de Entorno - Todas las variables están configuradas
- ✅ Conexión Firebase App - Firebase App inicializado correctamente
- ✅ Firestore - Lectura - Puede leer de Firestore
- ✅ Firestore - Escritura - Puede escribir en Firestore
- ✅ Storage - Lectura - Puede leer de Storage
- ✅ Storage - Escritura - Puede escribir en Storage
- ✅ Authentication - Authentication está configurado
- ✅ Colecciones Necesarias - Todas las colecciones están accesibles

---

## 📋 PASO 7: Verificar Firebase Console

Si algunos checks fallan, verifica en [Firebase Console](https://console.firebase.google.com):

### 7.1 Firestore Database
1. Ve a **Firestore Database**
2. Si no existe, haz clic en **"Crear base de datos"**
3. Selecciona **"Modo de prueba"** (para desarrollo)
4. Elige una ubicación (puede ser la más cercana)

### 7.2 Authentication
1. Ve a **Authentication**
2. Si no está habilitado, haz clic en **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Habilita **"Anónimo"** (Anonymous)

### 7.3 Storage
1. Ve a **Storage**
2. Si no está habilitado, haz clic en **"Comenzar"**
3. Selecciona **"Modo de prueba"** (para desarrollo)
4. Usa la misma ubicación que Firestore

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Variables de entorno faltantes"
**Solución:**
1. Verifica que el archivo se llame exactamente `.env.local` (con el punto al inicio)
2. Verifica que esté en la raíz del proyecto (mismo nivel que `package.json`)
3. Reinicia el servidor completamente

### Problema 2: "Firestore - Error de lectura/escritura"
**Solución:**
1. Ve a Firebase Console → Firestore Database
2. Verifica que esté habilitado
3. Verifica las reglas de seguridad (deben estar en modo de prueba):
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

### Problema 3: "Storage - Error de lectura/escritura"
**Solución:**
1. Ve a Firebase Console → Storage
2. Verifica que esté habilitado
3. Verifica las reglas de seguridad (deben estar en modo de prueba):
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

### Problema 4: "La verificación se queda colgada"
**Solución:**
1. Espera máximo 1 minuto (agregué timeouts de 10 segundos)
2. Si se queda colgada, recarga la página
3. Verifica tu conexión a internet
4. Verifica que Firebase esté accesible

### Problema 5: "Authentication no está disponible"
**Solución:**
1. Ve a Firebase Console → Authentication
2. Habilita el método "Anónimo" (Anonymous)
3. Reinicia el servidor

---

## ✅ CHECKLIST FINAL

Antes de reportar un problema, verifica:

- [ ] Archivo `.env.local` existe en la raíz del proyecto
- [ ] Todas las variables tienen el formato correcto (sin espacios, sin comillas)
- [ ] El servidor se reinició después de crear/modificar `.env.local`
- [ ] Firestore Database está habilitado en Firebase Console
- [ ] Authentication está habilitado con método "Anónimo"
- [ ] Storage está habilitado en Firebase Console
- [ ] Las reglas de seguridad están en modo de prueba
- [ ] Tienes conexión a internet
- [ ] No hay errores en la consola del navegador (F12)

---

## 🆘 Si NADA funciona

1. Cierra completamente todas las terminales
2. Cierra el navegador completamente
3. Abre una nueva terminal
4. Ve a la carpeta del proyecto
5. Ejecuta:
   ```bash
   npm run check-firebase
   ```
6. Si todo está bien, ejecuta:
   ```bash
   npm run dev
   ```
7. Abre un navegador en modo incógnito
8. Ve a `http://localhost:3000/check-database`

Si aún así no funciona, comparte:
- El resultado de `npm run check-firebase`
- Los errores que ves en la consola del navegador (F12)
- Una captura de pantalla de la página de verificación



