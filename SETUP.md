# Guía de Configuración

## Pasos para Configurar la Aplicación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita los siguientes servicios:
   - **Firestore Database**: Base de datos NoSQL
   - **Authentication**: Autenticación de usuarios
   - **Storage**: Almacenamiento de imágenes

4. Obtén las credenciales de tu proyecto:
   - Ve a Configuración del Proyecto > Tus aplicaciones
   - Selecciona la opción Web (</>)
   - Copia las credenciales

5. Crea un archivo `.env.local` en la raíz del proyecto:

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

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configurar Email (Gmail)

Para usar Gmail como servicio de email:

1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación":
   - Ve a [Google Account Security](https://myaccount.google.com/security)
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Usa esta contraseña en `EMAIL_PASS`

### 4. Descargar Modelos de Face Recognition

Ejecuta el script para descargar los modelos necesarios:

```bash
chmod +x scripts/setup-models.sh
./scripts/setup-models.sh
```

O descarga manualmente desde:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Coloca los archivos en `public/models/`:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

### 5. Configurar Reglas de Firestore

En Firebase Console > Firestore Database > Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Configurar Reglas de Storage

En Firebase Console > Storage > Reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Despliegue

### Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en la configuración del proyecto
3. Vercel detectará automáticamente Next.js y desplegará

### Railway

1. Conecta tu repositorio a Railway
2. Agrega las variables de entorno
3. Railway usará el archivo `railway.json` para configurar el despliegue

### Render

1. Conecta tu repositorio a Render
2. Crea un nuevo Web Service
3. Render usará el archivo `render.yaml` para configurar el despliegue
4. Agrega las variables de entorno en la configuración

## Notas Importantes

- Los modelos de face-api.js deben estar en `public/models/` para que funcionen correctamente
- Asegúrate de que las reglas de Firestore y Storage permitan acceso autenticado
- Para producción, considera usar bcrypt para hashear contraseñas
- El reconocimiento de voz requiere un navegador compatible (Chrome, Edge)

