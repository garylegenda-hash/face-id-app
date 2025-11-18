import { useState } from 'react';
import { startVoiceRecognition, VoiceCommand } from '../lib/voiceAI';

interface VoiceCommandButtonProps {
  onCommand: (command: VoiceCommand | null) => void;
}

export default function VoiceCommandButton({ onCommand }: VoiceCommandButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');

  const handleVoiceCommand = async () => {
    if (isRecording) return;

    setIsRecording(true);
    setError('');

    try {
      const stopRecording = await startVoiceRecognition(
        (command) => {
          setIsRecording(false);
          if (command) {
            onCommand(command);
          } else {
            setError('No se pudo reconocer el comando. Intenta de nuevo.');
          }
        },
        (err) => {
          setIsRecording(false);
          setError(err);
        }
      );

      // Auto-stop después de 10 segundos
      setTimeout(() => {
        stopRecording();
        setIsRecording(false);
      }, 10000);
    } catch (err: any) {
      setIsRecording(false);
      setError(err.message || 'Error al iniciar reconocimiento de voz');
    }
  };

  return (
    <>
      <button
        className={`voice-button ${isRecording ? 'recording' : ''}`}
        onClick={handleVoiceCommand}
        title="Comando de voz para generar reportes"
      >
        {isRecording ? '⏹' : '🎤'}
      </button>
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '300px',
            zIndex: 101,
          }}
        >
          {error}
        </div>
      )}
      {isRecording && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            background: '#d1ecf1',
            color: '#0c5460',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '300px',
            zIndex: 101,
          }}
        >
          🎤 Escuchando... Di &quot;generar reporte de ventas&quot;, &quot;reporte de inventario&quot; o &quot;compras del cliente [nombre/ID]&quot;
        </div>
      )}
    </>
  );
}

