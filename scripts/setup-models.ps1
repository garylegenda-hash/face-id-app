Param()

$ErrorActionPreference = "Stop"

$modelsDir = Join-Path -Path (Resolve-Path ".") -ChildPath "public\models"
if (-not (Test-Path $modelsDir)) {
  New-Item -ItemType Directory -Path $modelsDir | Out-Null
}

$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

Write-Host "Descargando modelos de face-api.js en $modelsDir ..."

Invoke-WebRequest "$baseUrl/tiny_face_detector_model-weights_manifest.json" -OutFile (Join-Path $modelsDir "tiny_face_detector_model-weights_manifest.json")
Invoke-WebRequest "$baseUrl/tiny_face_detector_model-shard1" -OutFile (Join-Path $modelsDir "tiny_face_detector_model-shard1")

Invoke-WebRequest "$baseUrl/face_landmark_68_model-weights_manifest.json" -OutFile (Join-Path $modelsDir "face_landmark_68_model-weights_manifest.json")
Invoke-WebRequest "$baseUrl/face_landmark_68_model-shard1" -OutFile (Join-Path $modelsDir "face_landmark_68_model-shard1")

Invoke-WebRequest "$baseUrl/face_recognition_model-weights_manifest.json" -OutFile (Join-Path $modelsDir "face_recognition_model-weights_manifest.json")
Invoke-WebRequest "$baseUrl/face_recognition_model-shard1" -OutFile (Join-Path $modelsDir "face_recognition_model-shard1")
Invoke-WebRequest "$baseUrl/face_recognition_model-shard2" -OutFile (Join-Path $modelsDir "face_recognition_model-shard2")

Write-Host "¡Modelos descargados!"










