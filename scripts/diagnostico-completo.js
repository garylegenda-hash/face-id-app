/**
 * Script de diagnóstico completo
 * Ejecutar con: node scripts/diagnostico-completo.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO COMPLETO DEL PROYECTO\n');
console.log('='.repeat(60));

// 1. Verificar archivo .env.local
console.log('\n📁 1. Verificando archivo .env.local...');
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('   ✅ Archivo .env.local encontrado');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  console.log('\n   📋 Verificando variables:');
  let allVarsOk = true;
  requiredVars.forEach((varName) => {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm');
    const match = envContent.match(regex);
    if (match && match[1] && match[1].trim() !== '') {
      const value = match[1].trim();
      // Verificar que no tenga espacios problemáticos
      if (value.includes(' ') && !value.startsWith('"')) {
        console.log(`   ⚠️  ${varName} - Tiene espacios, puede causar problemas`);
        allVarsOk = false;
      } else {
        console.log(`   ✅ ${varName}`);
      }
    } else {
      console.log(`   ❌ ${varName} - NO ENCONTRADA o VACÍA`);
      allVarsOk = false;
    }
  });

  if (!allVarsOk) {
    console.log('\n   ⚠️  ALGUNAS VARIABLES TIENEN PROBLEMAS');
  } else {
    console.log('\n   ✅ Todas las variables están configuradas correctamente');
  }
} else {
  console.log('   ❌ Archivo .env.local NO encontrado');
  console.log('   📝 Crea el archivo en la raíz del proyecto');
}

// 2. Verificar estructura del proyecto
console.log('\n📂 2. Verificando estructura del proyecto...');
const requiredDirs = ['components', 'lib', 'pages', 'public'];
const requiredFiles = ['package.json', 'next.config.js', 'tsconfig.json'];

requiredDirs.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ Carpeta ${dir}/ existe`);
  } else {
    console.log(`   ❌ Carpeta ${dir}/ NO existe`);
  }
});

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ Archivo ${file} existe`);
  } else {
    console.log(`   ❌ Archivo ${file} NO existe`);
  }
});

// 3. Verificar modelos de Face API
console.log('\n🤖 3. Verificando modelos de Face API...');
const modelsPath = path.join(process.cwd(), 'public', 'models');
if (fs.existsSync(modelsPath)) {
  const modelFiles = fs.readdirSync(modelsPath);
  const requiredModels = [
    'tiny_face_detector_model',
    'face_landmark_68_model',
    'face_recognition_model',
  ];

  requiredModels.forEach((model) => {
    const found = modelFiles.some((file) => file.includes(model));
    if (found) {
      console.log(`   ✅ ${model} encontrado`);
    } else {
      console.log(`   ❌ ${model} NO encontrado`);
    }
  });
} else {
  console.log('   ❌ Carpeta public/models/ NO existe');
}

// 4. Verificar node_modules
console.log('\n📦 4. Verificando dependencias...');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules existe');
  
  const requiredPackages = ['next', 'react', 'firebase', 'face-api.js'];
  requiredPackages.forEach((pkg) => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`   ✅ ${pkg} instalado`);
    } else {
      console.log(`   ❌ ${pkg} NO instalado - Ejecuta: npm install`);
    }
  });
} else {
  console.log('   ❌ node_modules NO existe - Ejecuta: npm install');
}

// 5. Verificar archivos de configuración
console.log('\n⚙️  5. Verificando archivos de configuración...');
const configFiles = {
  'lib/firebase.ts': 'Configuración de Firebase',
  'pages/check-database.tsx': 'Página de verificación',
  'components/FaceIDLogin.tsx': 'Componente Face ID',
};

Object.entries(configFiles).forEach(([file, description]) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${description} (${file})`);
  } else {
    console.log(`   ❌ ${description} (${file}) NO existe`);
  }
});

// 6. Recomendaciones
console.log('\n💡 RECOMENDACIONES:');
console.log('   1. Si hay errores, revisa SOLUCION_PROBLEMAS.md');
console.log('   2. Reinicia el servidor después de modificar .env.local');
console.log('   3. Verifica que Firebase Console tenga habilitados:');
console.log('      - Firestore Database (modo de prueba)');
console.log('      - Authentication (método Anónimo)');
console.log('      - Storage (modo de prueba)');
console.log('   4. Limpia la caché: Remove-Item -Recurse -Force .next');

console.log('\n' + '='.repeat(60));
console.log('✅ Diagnóstico completado\n');



