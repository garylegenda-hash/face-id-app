import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceModels() {
  if (modelsLoaded) return;
  
  const MODEL_URL = '/models';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  } catch (error) {
    console.error('Error loading face models:', error);
    throw error;
  }
}

export async function detectFace(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
  await loadFaceModels();
  
  const detection = await faceapi
    .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  return detection;
}

export async function compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): Promise<number> {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance;
}

export function faceDescriptorToArray(descriptor: Float32Array): number[] {
  return Array.from(descriptor);
}

export function arrayToFaceDescriptor(array: number[]): Float32Array {
  return new Float32Array(array);
}

