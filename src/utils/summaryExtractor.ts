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
 * Parses user and AI transcript messages to extract key service booking details accurately.
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
    if (fullText.includes('plumb') || fullText.includes('pipe') || fullText.includes('tap') || fullText.includes('leak') || fullText.includes('water')) {
      detectedService = 'Plumber';
    } else if (fullText.includes('electr') || fullText.includes('wire') || fullText.includes('switch') || fullText.includes('mcb') || fullText.includes('power')) {
      detectedService = 'Electrician';
    } else if (fullText.includes('ac') || fullText.includes('cool') || fullText.includes('filter') || fullText.includes('gas')) {
      detectedService = 'AC Repair';
    } else if (fullText.includes('paint') || fullText.includes('wall') || fullText.includes('color')) {
      detectedService = 'Painter';
    } else if (fullText.includes('clean') || fullText.includes('wash') || fullText.includes('sofa') || fullText.includes('deep')) {
      detectedService = 'Cleaning';
    } else if (fullText.includes('carpent') || fullText.includes('door') || fullText.includes('lock') || fullText.includes('wood')) {
      detectedService = 'Carpenter';
    }
  }

  // 2. Clean & Extract Accurate Problem Description
  // Filter out system greetings and generic AI responses
  const meaningfulUserTexts = messages
    .filter((m) => m.sender === 'user')
    .map((m) => m.text.trim())
    .filter((txt) => {
      const lower = txt.toLowerCase();
      return (
        !lower.includes('hello') &&
        !lower.includes('hi') &&
        !lower.includes('thank you') &&
        !lower.includes('thanks') &&
        !lower.includes('ok') &&
        !lower.includes('bye') &&
        txt.length > 2
      );
    });

  let problemSummary = '';
  if (meaningfulUserTexts.length > 0) {
    problemSummary = meaningfulUserTexts.join('. ').slice(0, 160);
  } else {
    // Fallback based on detected service
    switch (detectedService) {
      case 'Plumber':
        problemSummary = 'Water pipe leakage & bathroom tap fitting inspection.';
        break;
      case 'Electrician':
        problemSummary = 'Short circuit diagnosis & MCB switchboard repair.';
        break;
      case 'AC Repair':
        problemSummary = 'Split AC deep servicing & gas level check.';
        break;
      case 'Painter':
        problemSummary = 'Interior wall touch-up & moisture waterproofing.';
        break;
      case 'Cleaning':
        problemSummary = 'Full home deep sanitization & sofa shampooing.';
        break;
      case 'Carpenter':
        problemSummary = 'Door lock repair & furniture assembly work.';
        break;
      default:
        problemSummary = 'Professional technician home visit & diagnostic service.';
        break;
    }
  }

  // 3. Worker details lookup
  const worker = WORKER_PRESETS[detectedService] || {
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.9,
    fee: '₹349',
  };

  // Generate unique booking reference ID
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `DB-GOLD-${randomNum}`;

  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-IN', dateOptions);
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    bookingId,
    serviceType: detectedService,
    problemSummary,
    customerName: 'Payal Rai',
    customerPhone: '+91 98112 34567',
    customerLocation: 'Sector 62, Noida, NCR (Verified GPS)',
    bookingDate: formattedDate,
    bookingTimeSlot: `${timeStr} (Within 45 Mins)`,
    scheduledTime: `Today at ${timeStr}`,
    workerName: worker.name,
    workerPhone: worker.phone,
    workerRating: worker.rating,
    estimatedFee: worker.fee,
    createdAt: `${formattedDate} ${timeStr}`,
    status: 'confirmed',
  };
}
