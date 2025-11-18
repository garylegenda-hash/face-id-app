export interface VoiceCommand {
  type: 'sales' | 'stock' | 'customer';
  customerId?: string;
  customerName?: string;
}

export function parseVoiceCommand(text: string): VoiceCommand | null {
  const lowerText = text.toLowerCase();
  
  // Detectar tipo de reporte
  if (lowerText.includes('venta') || lowerText.includes('ventas') || lowerText.includes('sales')) {
    return { type: 'sales' };
  }
  
  if (lowerText.includes('inventario') || lowerText.includes('stock') || lowerText.includes('productos')) {
    return { type: 'stock' };
  }
  
  if (lowerText.includes('cliente') || lowerText.includes('customer') || lowerText.includes('compra')) {
    // Intentar extraer ID o nombre del cliente
    const idMatch = text.match(/\b\d+\b/);
    const nameMatch = text.match(/(?:cliente|customer|compra)\s+([A-Za-z\s]+)/i);
    
    return {
      type: 'customer',
      customerId: idMatch ? idMatch[0] : undefined,
      customerName: nameMatch ? nameMatch[1].trim() : undefined,
    };
  }
  
  return null;
}

export async function startVoiceRecognition(
  onResult: (command: VoiceCommand | null) => void,
  onError: (error: string) => void
): Promise<() => void> {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Tu navegador no soporta reconocimiento de voz');
    return () => {};
  }

  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    const command = parseVoiceCommand(transcript);
    onResult(command);
  };

  recognition.onerror = (event: any) => {
    onError(`Error en reconocimiento de voz: ${event.error}`);
  };

  recognition.start();

  return () => {
    recognition.stop();
  };
}

