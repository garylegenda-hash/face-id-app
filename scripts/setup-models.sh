#!/bin/bash

# Script para descargar los modelos de face-api.js
# Estos modelos son necesarios para el reconocimiento facial

MODELS_DIR="public/models"

# Crear directorio si no existe
mkdir -p $MODELS_DIR

# URLs de los modelos
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

echo "Descargando modelos de face-api.js..."

# Tiny Face Detector
echo "Descargando Tiny Face Detector..."
curl -o $MODELS_DIR/tiny_face_detector_model-weights_manifest.json $BASE_URL/tiny_face_detector_model-weights_manifest.json
curl -o $MODELS_DIR/tiny_face_detector_model-shard1 $BASE_URL/tiny_face_detector_model-shard1

# Face Landmark 68
echo "Descargando Face Landmark 68..."
curl -o $MODELS_DIR/face_landmark_68_model-weights_manifest.json $BASE_URL/face_landmark_68_model-weights_manifest.json
curl -o $MODELS_DIR/face_landmark_68_model-shard1 $BASE_URL/face_landmark_68_model-shard1

# Face Recognition
echo "Descargando Face Recognition..."
curl -o $MODELS_DIR/face_recognition_model-weights_manifest.json $BASE_URL/face_recognition_model-weights_manifest.json
curl -o $MODELS_DIR/face_recognition_model-shard1 $BASE_URL/face_recognition_model-shard1
curl -o $MODELS_DIR/face_recognition_model-shard2 $BASE_URL/face_recognition_model-shard2

echo "¡Modelos descargados exitosamente!"

