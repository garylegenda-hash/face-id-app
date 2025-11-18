# Script para reiniciar todo el proyecto
# Ejecutar con: .\scripts\reiniciar-todo.ps1

Write-Host "🔄 REINICIANDO PROYECTO..." -ForegroundColor Cyan
Write-Host ""

# 1. Detener procesos de Node
Write-Host "1. Deteniendo procesos de Node.js..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✅ Procesos detenidos" -ForegroundColor Green

# 2. Limpiar caché de Next.js
Write-Host ""
Write-Host "2. Limpiando caché de Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Caché limpiada" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No hay caché para limpiar" -ForegroundColor Gray
}

# 3. Verificar .env.local
Write-Host ""
Write-Host "3. Verificando archivo .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✅ Archivo .env.local encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Archivo .env.local NO encontrado" -ForegroundColor Red
    Write-Host "   📝 Crea el archivo antes de continuar" -ForegroundColor Yellow
    exit 1
}

# 4. Verificar servicios de Firebase
Write-Host ""
Write-Host "4. IMPORTANTE: Verifica en Firebase Console:" -ForegroundColor Yellow
Write-Host "   - Firestore Database debe estar habilitado (modo de prueba)" -ForegroundColor White
Write-Host "   - Authentication debe estar habilitado (método Anónimo)" -ForegroundColor White
Write-Host "   - Storage debe estar habilitado (modo de prueba)" -ForegroundColor White
Write-Host ""
$continue = Read-Host "¿Ya verificaste Firebase Console? (S/N)"
if ($continue -ne "S" -and $continue -ne "s") {
    Write-Host "   ⚠️  Ve a https://console.firebase.google.com y habilita los servicios" -ForegroundColor Yellow
    Write-Host "   Luego ejecuta este script de nuevo" -ForegroundColor Yellow
    exit 0
}

# 5. Iniciar servidor
Write-Host ""
Write-Host "5. Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host "   Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""
Start-Sleep -Seconds 2

npm run dev



