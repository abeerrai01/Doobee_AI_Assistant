import { TranscriptMessage, BISInquirySummary, BISSchemeType } from '../types';
import { generateId, getCurrentTimestamp } from './formatters';

interface StandardMatch {
  standard: string;
  title: string;
  departmentCode: string;
  departmentName: string;
  scheme: BISSchemeType;
  mandatory: 'Mandatory (QCO)' | 'Voluntary' | 'Verification Required';
}

const KNOWN_STANDARDS: Record<string, StandardMatch> = {
  '10500': {
    standard: 'IS 10500:2012',
    title: 'Drinking Water Specification',
    departmentCode: 'CHD',
    departmentName: 'Chemical Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Mandatory (QCO)',
  },
  '1293': {
    standard: 'IS 1293:2019',
    title: 'Plugs and Socket-Outlets of Rated Voltage up to and Including 250 Volts',
    departmentCode: 'ETD',
    departmentName: 'Electrotechnical Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Mandatory (QCO)',
  },
  '13252': {
    standard: 'IS 13252 (Part 1):2010',
    title: 'Information Technology Equipment — Safety',
    departmentCode: 'LITD',
    departmentName: 'Electronics and IT Department',
    scheme: 'CRS (Electronics)',
    mandatory: 'Mandatory (QCO)',
  },
  '15820': {
    standard: 'IS 15820:2009',
    title: 'General Requirements for Competence of Assaying and Hallmarking Centres',
    departmentCode: 'MTD',
    departmentName: 'Metallurgical Engineering Department',
    scheme: 'Hallmarking (6-Digit HUID)',
    mandatory: 'Mandatory (QCO)',
  },
  '1786': {
    standard: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
    departmentCode: 'MTD',
    departmentName: 'Metallurgical Engineering Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Mandatory (QCO)',
  },
  '4151': {
    standard: 'IS 4151:2015',
    title: 'Protective Helmets for Riders of Two-Wheeled Motor Vehicles',
    departmentCode: 'TED',
    departmentName: 'Transport Engineering Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Mandatory (QCO)',
  },
  '9873': {
    standard: 'IS 9873 (Part 1):2019',
    title: 'Safety of Toys — Mechanical and Physical Properties',
    departmentCode: 'PGD',
    departmentName: 'Production and General Engineering Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Mandatory (QCO)',
  },
  '14543': {
    standard: 'IS 14543:2004',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water)',
    departmentCode: 'FAD',
    departmentName: 'Food and Agriculture Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Mandatory (QCO)',
  },
  '456': {
    standard: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete — Code of Practice',
    departmentCode: 'CED',
    departmentName: 'Civil Engineering Department',
    scheme: 'Scheme-I (ISI Mark)',
    mandatory: 'Voluntary',
  },
};

/**
 * Parses user and AI transcript messages to extract key BIS Standards inquiry details.
 */
export function extractBISInquiryFromTranscript(
  messages: TranscriptMessage[]
): BISInquirySummary {
  const fullText = messages.map((m) => m.text).join(' ').toLowerCase();

  // 1. Check for specific IS Standard numbers
  let matchedStandard: StandardMatch | null = null;
  const isMatch = fullText.match(/\bis\s*(\d{3,5})\b/i);
  if (isMatch && KNOWN_STANDARDS[isMatch[1]]) {
    matchedStandard = KNOWN_STANDARDS[isMatch[1]];
  } else {
    // Check product keywords if explicit number wasn't caught
    if (fullText.includes('drinking water') || fullText.includes('water test') || fullText.includes('tds') || fullText.includes('ph value')) {
      matchedStandard = KNOWN_STANDARDS['10500'];
    } else if (fullText.includes('plug') || fullText.includes('socket') || fullText.includes('adapter')) {
      matchedStandard = KNOWN_STANDARDS['1293'];
    } else if (fullText.includes('hallmark') || fullText.includes('huid') || fullText.includes('gold') || fullText.includes('silver') || fullText.includes('jewel')) {
      matchedStandard = KNOWN_STANDARDS['15820'];
    } else if (fullText.includes('laptop') || fullText.includes('mobile') || fullText.includes('it equipment') || fullText.includes('crs')) {
      matchedStandard = KNOWN_STANDARDS['13252'];
    } else if (fullText.includes('steel') || fullText.includes('tmt') || fullText.includes('rebar')) {
      matchedStandard = KNOWN_STANDARDS['1786'];
    } else if (fullText.includes('helmet') || fullText.includes('two wheeler')) {
      matchedStandard = KNOWN_STANDARDS['4151'];
    } else if (fullText.includes('toy') || fullText.includes('child safety')) {
      matchedStandard = KNOWN_STANDARDS['9873'];
    }
  }

  // 2. Determine scheme
  let scheme: BISSchemeType = 'General Standards Guidance';
  if (matchedStandard) {
    scheme = matchedStandard.scheme;
  } else if (fullText.includes('crs') || fullText.includes('registration')) {
    scheme = 'CRS (Electronics)';
  } else if (fullText.includes('fmcs') || fullText.includes('foreign') || fullText.includes('import')) {
    scheme = 'FMCS (Foreign Manufacturers)';
  } else if (fullText.includes('hallmark') || fullText.includes('huid')) {
    scheme = 'Hallmarking (6-Digit HUID)';
  } else if (fullText.includes('scheme-ii') || fullText.includes('simplified')) {
    scheme = 'Scheme-II (Simplified)';
  } else if (fullText.includes('isi') || fullText.includes('scheme-i') || fullText.includes('cml') || fullText.includes('cm/l')) {
    scheme = 'Scheme-I (ISI Mark)';
  }

  // 3. Determine topic
  let topic = 'General BIS Conformity Assessment';
  if (matchedStandard) {
    topic = `${matchedStandard.standard} — ${matchedStandard.title}`;
  } else if (fullText.includes('hallmark') || fullText.includes('huid')) {
    topic = 'Gold & Silver Hallmarking (6-Digit HUID)';
  } else if (fullText.includes('crs')) {
    topic = 'Compulsory Registration Scheme (CRS)';
  } else if (fullText.includes('fmcs')) {
    topic = 'Foreign Manufacturers Certification Scheme (FMCS)';
  } else if (fullText.includes('qco') || fullText.includes('quality control order')) {
    topic = 'Quality Control Orders (QCO) Regulatory Scope';
  } else if (fullText.includes('verify') || fullText.includes('cml') || fullText.includes('licence')) {
    topic = 'ISI Mark Licence Verification (CM/L)';
  }

  // 4. Generate Key Guidance Points
  const keyGuidance: string[] = [];
  if (scheme === 'Hallmarking (6-Digit HUID)') {
    keyGuidance.push('Verify 6-digit alphanumeric HUID on the BIS Care App before purchase');
    keyGuidance.push('Mandatory 3 hallmarks: BIS logo, purity/fineness mark (e.g. 22K916), and unique HUID');
    keyGuidance.push('Registration required for jewellers under BIS Hallmarking regulations');
  } else if (scheme === 'CRS (Electronics)') {
    keyGuidance.push('Self-declaration of conformity based on test reports from BIS-recognized labs');
    keyGuidance.push('Unique R-number must be displayed on product packaging alongside the BIS logo');
    keyGuidance.push('CRS applies to notified IT & electronics goods under MeitY / BIS orders');
  } else if (scheme === 'FMCS (Foreign Manufacturers)') {
    keyGuidance.push('Requires physical factory audit abroad by designated BIS technical officers');
    keyGuidance.push('Independent in-country testing and appointment of an Authorized Indian Representative (AIR)');
  } else {
    keyGuidance.push('Product certification follows Scheme-I (factory audit + sample lab testing)');
    keyGuidance.push('Verify CM/L number on manakonline.in or the BIS Care App for authenticity');
    keyGuidance.push('Ensure compliance with current Quality Control Orders (QCO) issued by the Ministry');
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    inquiryId: `BIS-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    inquiryDate: dateStr,
    topic,
    detectedStandard: matchedStandard?.standard,
    standardTitle: matchedStandard?.title,
    departmentCode: matchedStandard?.departmentCode || 'CHD',
    departmentName: matchedStandard?.departmentName || 'Bureau of Indian Standards Technical Division',
    scheme,
    mandatoryStatus: matchedStandard?.mandatory || 'Verification Required',
    keyGuidance,
    officialPortals: [
      { name: 'BIS Official Portal', url: 'https://www.bis.gov.in' },
      { name: 'e-BIS Manakonline', url: 'https://www.manakonline.in' },
      { name: 'Standards Portal', url: 'https://standards.bis.gov.in' },
      { name: 'National Single Window System', url: 'https://www.nsws.gov.in' },
    ],
    verificationMethod: scheme === 'Hallmarking (6-Digit HUID)'
      ? 'BIS Care App (Verify HUID feature)'
      : 'BIS Care App (Verify CM/L or R-Number) / manakonline.in',
    notes: 'Consult official BIS gazette notifications and manakonline.in for legally binding compliance determinations.',
    createdAt: getCurrentTimestamp(),
  };
}

// Backwards compatibility alias
export const extractBookingDetailsFromTranscript = extractBISInquiryFromTranscript;
