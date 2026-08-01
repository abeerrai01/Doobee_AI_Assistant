import { TranscriptMessage, ExtractedBookingDetails } from '../types';

const WORKER_PRESETS: Record<string, { name: string; phone: string; rating: number; fee: string }> = {
  Plumber: { name: 'Ramesh Kumar', phone: '+91 98765 43210', rating: 4.9, fee: '₹349' },
  Electrician: { name: 'Vikram Singh', phone: '+91 98123 45678', rating: 4.8, fee: '₹299' },
  Carpenter: { name: 'Suresh Sharma', phone: '+91 97654 32109', rating: 4.9, fee: '₹399' },
  Labour: { name: 'Amit Verma', phone: '+91 99887 76655', rating: 4.7, fee: '₹250' },
  Painter: { name: 'Anil Yadav', phone: '+91 96543 21098', rating: 4.8, fee: '₹499' },
  Cleaning: { name: 'Pooja Devi & Team', phone: '+91 95432 10987', rating: 4.9, fee: '₹599' },
  'AC Repair': { name: 'Rajesh Mishra', phone: '+91 94321 09876', rating: 4.9, fee: '₹449' },
};

/**
 * Parses user and AI transcript messages to extract key service booking details.
 */
export function extractBookingDetailsFromTranscript(
  messages: TranscriptMessage[],
  servicePreset?: string
): ExtractedBookingDetails {
  // Combine all transcript text
  const fullText = messages.map((m) => m.text).join(' ').toLowerCase();

  // 1. Detect Service Type
  let detectedService = servicePreset || 'Home Service';
  if (!servicePreset) {
    if (fullText.includes('plumb') || fullText.includes('pipe') || fullText.includes('tap') || fullText.includes('leak')) {
      detectedService = 'Plumber';
    } else if (fullText.includes('electr') || fullText.includes('wire') || fullText.includes('switch') || fullText.includes('mcb')) {
      detectedService = 'Electrician';
    } else if (fullText.includes('ac') || fullText.includes('cool') || fullText.includes('filter')) {
      detectedService = 'AC Repair';
    } else if (fullText.includes('paint') || fullText.includes('wall')) {
      detectedService = 'Painter';
    } else if (fullText.includes('clean') || fullText.includes('wash')) {
      detectedService = 'Cleaning';
    } else if (fullText.includes('carpent') || fullText.includes('door') || fullText.includes('wood')) {
      detectedService = 'Carpenter';
    }
  }

  // 2. Detect User Problem Summary
  let problemSummary = `${detectedService} inspection & repair service requested via Doobee AI`;
  const userMessages = messages.filter((m) => m.sender === 'user').map((m) => m.text);
  if (userMessages.length > 0) {
    problemSummary = userMessages.join('. ').slice(0, 140);
  }

  // 3. Worker details lookup or fallback
  const worker = WORKER_PRESETS[detectedService] || {
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.9,
    fee: '₹299',
  };

  // Generate unique booking reference ID
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `DB-${randomNum}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    bookingId,
    serviceType: detectedService,
    problemSummary: problemSummary || `${detectedService} assistance required at customer location.`,
    scheduledTime: `Today within 45 mins (${timeStr})`,
    workerName: worker.name,
    workerPhone: worker.phone,
    workerRating: worker.rating,
    estimatedFee: worker.fee,
    customerAddress: 'Verified GPS Location (Home Address)',
    createdAt: `${now.toLocaleDateString()} ${timeStr}`,
    status: 'confirmed',
  };
}
