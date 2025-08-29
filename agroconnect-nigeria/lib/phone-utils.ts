import { PHONE_PREFIX } from '../constants/nigeria';

// Phone number utilities for AgroConnect Nigeria

/**
 * Nigerian mobile network codes
 */
const NIGERIAN_NETWORK_CODES = [
  // MTN
  '0803', '0806', '0813', '0814', '0816', '0903', '0906', '0913', '0916',
  // Airtel
  '0701', '0708', '0802', '0808', '0812', '0902', '0907', '0912',
  // Glo
  '0705', '0805', '0811', '0815', '0905', '0915',
  // 9mobile
  '0809', '0817', '0818', '0909', '0908'
];

/**
 * Validate Nigerian phone number format
 */
export function isValidNigerianPhone(phone: string): boolean {
  if (!phone) return false;
  
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check different formats
  if (cleanPhone.startsWith('234')) {
    // International format: +234XXXXXXXXX
    if (cleanPhone.length !== 13) return false;
    const localPart = cleanPhone.substring(3);
    return isValidLocalNumber(localPart);
  } else if (cleanPhone.startsWith('0')) {
    // Local format: 0XXXXXXXXX
    if (cleanPhone.length !== 11) return false;
    return isValidLocalNumber(cleanPhone.substring(1));
  }
  
  return false;
}

/**
 * Validate local Nigerian phone number (without country code)
 */
function isValidLocalNumber(localNumber: string): boolean {
  if (localNumber.length !== 10) return false;
  
  // Check if it starts with valid network code
  const prefix = localNumber.substring(0, 3);
  const fullPrefix = '0' + prefix;
  
  return NIGERIAN_NETWORK_CODES.some(code => code.startsWith(fullPrefix));
}

/**
 * Format Nigerian phone number to international format
 */
export function formatNigerianPhone(phone: string): string {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('234')) {
    // Already international format
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('0')) {
    // Convert from local to international
    return `+234${cleanPhone.substring(1)}`;
  } else if (cleanPhone.length === 10) {
    // Add country code
    return `+234${cleanPhone}`;
  }
  
  return phone; // Return original if can't format
}

/**
 * Format phone number for display with spacing
 */
export function formatPhoneDisplay(phone: string): string {
  const formatted = formatNigerianPhone(phone);
  if (formatted.startsWith('+234')) {
    // Format as: +234 XXX XXX XXXX
    const number = formatted.substring(4);
    return `+234 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  return formatted;
}

/**
 * Mask phone number for display (show last 4 digits)
 */
export function maskPhoneNumber(phone: string): string {
  const formatted = formatNigerianPhone(phone);
  if (formatted.length >= 8) {
    const visible = formatted.slice(-4);
    const masked = '*'.repeat(formatted.length - 4);
    return masked + visible;
  }
  return formatted;
}

/**
 * Extract local phone number from international format
 */
export function getLocalPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('234')) {
    return '0' + cleanPhone.substring(3);
  } else if (cleanPhone.startsWith('0')) {
    return cleanPhone;
  }
  
  return phone;
}

/**
 * Get network provider from phone number
 */
export function getNetworkProvider(phone: string): string {
  const localPhone = getLocalPhoneNumber(phone);
  const prefix = localPhone.substring(0, 4);
  
  // MTN prefixes
  if (['0803', '0806', '0813', '0814', '0816', '0903', '0906', '0913', '0916'].includes(prefix)) {
    return 'MTN';
  }
  
  // Airtel prefixes
  if (['0701', '0708', '0802', '0808', '0812', '0902', '0907', '0912'].includes(prefix)) {
    return 'Airtel';
  }
  
  // Glo prefixes
  if (['0705', '0805', '0811', '0815', '0905', '0915'].includes(prefix)) {
    return 'Glo';
  }
  
  // 9mobile prefixes
  if (['0809', '0817', '0818', '0909', '0908'].includes(prefix)) {
    return '9mobile';
  }
  
  return 'Unknown';
}

/**
 * Generate OTP placeholder text
 */
export function getOTPPlaceholder(): string {
  return '• • • • • •';
}

/**
 * Format phone input as user types
 */
export function formatPhoneInput(value: string, previousValue: string = ''): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Handle different scenarios
  if (digits.length === 0) return '';
  
  // If starts with 234, format as international
  if (digits.startsWith('234')) {
    if (digits.length <= 3) return '+234';
    if (digits.length <= 6) return `+234 ${digits.substring(3)}`;
    if (digits.length <= 9) return `+234 ${digits.substring(3, 6)} ${digits.substring(6)}`;
    return `+234 ${digits.substring(3, 6)} ${digits.substring(6, 9)} ${digits.substring(9, 13)}`;
  }
  
  // If starts with 0, format as local
  if (digits.startsWith('0')) {
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 11)}`;
  }
  
  // If no prefix, assume local format
  if (digits.length <= 3) return `0${digits}`;
  if (digits.length <= 6) return `0${digits.substring(0, 3)} ${digits.substring(3)}`;
  return `0${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 10)}`;
}
