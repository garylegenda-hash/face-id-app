/**
 * Script para verificar la configuración de Firebase
 * Ejecutar con: node scripts/check-firebase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Firebase...\n');

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ No se encontró el archivo .env.local');
  console.log('📝 Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:\n');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id');
  console.log('EMAIL_HOST=smtp.gmail.com');
  console.log('EMAIL_PORT=587');
  console.log('EMAIL_USER=tu_email@gmail.com');
  console.log('EMAIL_PASS=tu_app_password\n');
  process.exit(1);
}

console.log('✅ Archivo .env.local encontrado');

// Leer y verificar variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingVars = [];
const foundVars = [];

requiredVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=`, 'm');
  if (regex.test(envContent)) {
    foundVars.push(varName);
  } else {
    missingVars.push(varName);
  }
});

console.log(`\n📋 Variables de entorno:`);
foundVars.forEach((varName) => {
  console.log(`  ✅ ${varName}`);
});

if (missingVars.length > 0) {
  console.log('\n❌ Variables faltantes:');
  missingVars.forEach((varName) => {
    console.log(`  ❌ ${varName}`);
  });
  console.log('\n⚠️  Agrega las variables faltantes a tu archivo .env.local');
  process.exit(1);
}

// Verificar modelos de Face API
const modelsPath = path.join(process.cwd(), 'public', 'models');
const modelsExist = fs.existsSync(modelsPath);

if (modelsExist) {
  const modelFiles = fs.readdirSync(modelsPath);
  const requiredModels = [
    'tiny_face_detector_model-weights_manifest.json',
    'face_landmark_68_model-weights_manifest.json',
    'face_recognition_model-weights_manifest.json',
  ];

  console.log('\n📦 Modelos de Face API:');
  requiredModels.forEach((model) => {
    const exists = modelFiles.some((file) => file.includes(model.split('-')[0]));
    if (exists) {
      console.log(`  ✅ ${model.split('-')[0]} encontrado`);
    } else {
      console.log(`  ❌ ${model.split('-')[0]} no encontrado`);
    }
  });
} else {
  console.log('\n⚠️  Carpeta public/models no encontrada');
  console.log('   Los modelos de Face API deben estar en public/models/');
}

console.log('\n✅ Verificación básica completada');
console.log('\n💡 Para una verificación completa, ejecuta la aplicación y ve a:');
console.log('   http://localhost:3000/check-database\n');



