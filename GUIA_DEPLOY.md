# 🚀 Guía Completa: Deploy en Vercel (GRATIS)

## ✅ Vercel es la MEJOR opción porque:
- ✅ **100% GRATIS** para proyectos personales
- ✅ Detecta Next.js automáticamente
- ✅ Deploy en menos de 5 minutos
- ✅ HTTPS automático
- ✅ Dominio personalizado gratis
- ✅ Ya tienes `vercel.json` configurado

---

## 📋 PASO 1: Preparar el Proyecto

### 1.1. Verificar que el proyecto compile
Ejecuta en tu terminal:
```bash
npm run build
```

**Si hay errores, corrígelos antes de continuar.**

### 1.2. Verificar .gitignore
Asegúrate de que `.gitignore` incluya:
```
.env.local
.next
node_modules
```

---

## 📋 PASO 2: Crear Cuenta en Vercel

1. Ve a: **https://vercel.com**
2. Haz clic en **"Sign Up"** o **"Iniciar sesión"**
3. **Opción más fácil:** Haz clic en **"Continue with GitHub"**
   - Si no tienes GitHub, puedes usar Google o Email
4. Completa el registro (es gratis)

---

## 📋 PASO 3: Conectar tu Proyecto

### Opción A: Desde GitHub (RECOMENDADO)

#### 3.1. Subir a GitHub
1. Si no tienes repositorio, crea uno en GitHub:
   - Ve a: **https://github.com/new**
   - Nombre: `parcial-face-id` (o el que quieras)
   - Haz clic en **"Create repository"**

2. En tu terminal, ejecuta:
```bash
# Si no tienes git inicializado
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/parcial-face-id.git
git push -u origin main
```

#### 3.2. Conectar en Vercel
1. En Vercel, haz clic en **"Add New..."** → **"Project"**
2. Haz clic en **"Import Git Repository"**
3. Selecciona tu repositorio de GitHub
4. Haz clic en **"Import"**

### Opción B: Subir desde tu Computadora (SIN GitHub)

1. En Vercel, haz clic en **"Add New..."** → **"Project"**
2. Haz clic en **"Browse"** o arrastra tu carpeta del proyecto
3. Vercel detectará automáticamente que es Next.js

---

## 📋 PASO 4: Configurar Variables de Entorno

**MUY IMPORTANTE:** Debes agregar las variables de entorno en Vercel.

1. En la página de configuración del proyecto, busca **"Environment Variables"**
2. Agrega cada variable una por una:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyC68czDBNA1ic8UeaMjf734-fK5YXi9mNc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = parcial-faceid-1837a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = parcial-faceid-1837a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = parcial-faceid-1837a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 302273362828
NEXT_PUBLIC_FIREBASE_APP_ID = 1:302273362828:web:a49659278a9e61b13fb4a9
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = tu_email@gmail.com
EMAIL_PASS = tu_app_password
```

3. Para cada variable:
   - Haz clic en **"Add"** o **"Agregar"**
   - Escribe el nombre de la variable
   - Escribe el valor
   - Selecciona los ambientes: **Production**, **Preview**, **Development**
   - Haz clic en **"Save"**

---

## 📋 PASO 5: Hacer el Deploy

1. Después de agregar las variables de entorno, haz clic en **"Deploy"**
2. Espera 2-5 minutos mientras Vercel:
   - Instala dependencias
   - Compila el proyecto
   - Despliega la aplicación

3. Cuando termine, verás:
   - ✅ **"Deployment successful"**
   - Un enlace tipo: `https://parcial-face-id.vercel.app`

---

## 📋 PASO 6: Verificar que Funcione

1. Haz clic en el enlace de tu aplicación
2. Prueba:
   - Registro de usuario
   - Login con credenciales
   - Login con Face ID
   - Registrar producto
   - Generar reportes

---

## 🎯 Resumen de Pasos Rápidos

1. ✅ `npm run build` (verificar que compile)
2. ✅ Crear cuenta en Vercel
3. ✅ Subir proyecto (GitHub o directo)
4. ✅ Agregar variables de entorno
5. ✅ Deploy
6. ✅ Probar

---

## ❓ Problemas Comunes

### Error: "Build failed"
- Verifica que `npm run build` funcione localmente
- Revisa los logs de Vercel para ver el error específico

### Error: "Environment variables missing"
- Asegúrate de agregar TODAS las variables de entorno
- Verifica que los nombres sean exactos (con `NEXT_PUBLIC_`)

### Error: "Firebase not initialized"
- Verifica que las credenciales de Firebase sean correctas
- Asegúrate de que Firestore y Authentication estén habilitados

---

## 🎉 ¡Listo!

Una vez desplegado, tendrás:
- ✅ URL pública de tu aplicación
- ✅ HTTPS automático
- ✅ Deploy automático cada vez que hagas push a GitHub (si usas GitHub)

**Tu aplicación estará en línea y accesible desde cualquier lugar** 🌐



