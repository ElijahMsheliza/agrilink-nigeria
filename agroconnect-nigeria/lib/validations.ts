import { isValidNigerianPhone } from './phone-utils';
import { validateEmail, validatePassword } from './auth-utils';
import { MAJOR_CROPS, COMPANY_TYPES, PAYMENT_TERMS } from '../constants/nigeria';

// Form validation utilities for AgroConnect Nigeria

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): FieldValidation {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  return { isValid: true };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): FieldValidation {
  if (value && value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`
    };
  }
  return { isValid: true };
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): FieldValidation {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`
    };
  }
  return { isValid: true };
}

/**
 * Validate Nigerian phone number
 */
export function validatePhoneNumber(phone: string): FieldValidation {
  if (!phone) {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  if (!isValidNigerianPhone(phone)) {
    return {
      isValid: false,
      error: 'Please enter a valid Nigerian phone number'
    };
  }

  return { isValid: true };
}

/**
 * Validate email address
 */
export function validateEmailField(email: string): FieldValidation {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (!validateEmail(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
}

/**
 * Validate password
 */
export function validatePasswordField(password: string): FieldValidation {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  const validation = validatePassword(password);
  if (!validation.isValid) {
    return {
      isValid: false,
      error: validation.errors[0] // Return first error
    };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): FieldValidation {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Password confirmation is required'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }

  return { isValid: true };
}

/**
 * Validate full name
 */
export function validateFullName(name: string): FieldValidation {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Full name is required'
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters'
    };
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      error: 'Full name must not exceed 100 characters'
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: 'Full name can only contain letters, spaces, hyphens, and apostrophes'
    };
  }

  return { isValid: true };
}

/**
 * Validate OTP code
 */
export function validateOTP(otp: string): FieldValidation {
  if (!otp) {
    return {
      isValid: false,
      error: 'Verification code is required'
    };
  }

  if (otp.length !== 6) {
    return {
      isValid: false,
      error: 'Verification code must be 6 digits'
    };
  }

  if (!/^\d{6}$/.test(otp)) {
    return {
      isValid: false,
      error: 'Verification code must contain only numbers'
    };
  }

  return { isValid: true };
}

/**
 * Validate Nigerian CAC number
 */
export function validateCACNumber(cacNumber: string): FieldValidation {
  if (!cacNumber) {
    return { isValid: true }; // Optional field
  }

  // CAC number should be 6-8 digits
  if (!/^\d{6,8}$/.test(cacNumber)) {
    return {
      isValid: false,
      error: 'CAC number must be 6-8 digits'
    };
  }

  return { isValid: true };
}

/**
 * Validate tax ID
 */
export function validateTaxID(taxId: string): FieldValidation {
  if (!taxId) {
    return { isValid: true }; // Optional field
  }

  // Basic validation for Nigerian tax ID format
  if (taxId.length < 8 || taxId.length > 20) {
    return {
      isValid: false,
      error: 'Tax ID must be between 8 and 20 characters'
    };
  }

  return { isValid: true };
}

/**
 * Validate farm size
 */
export function validateFarmSize(size: number | string): FieldValidation {
  if (!size && size !== 0) {
    return { isValid: true }; // Optional field
  }

  const numSize = typeof size === 'string' ? parseFloat(size) : size;

  if (isNaN(numSize)) {
    return {
      isValid: false,
      error: 'Farm size must be a valid number'
    };
  }

  if (numSize < 0) {
    return {
      isValid: false,
      error: 'Farm size cannot be negative'
    };
  }

  if (numSize > 10000) {
    return {
      isValid: false,
      error: 'Farm size seems unreasonably large'
    };
  }

  return { isValid: true };
}

/**
 * Validate years of farming
 */
export function validateYearsFarming(years: number | string): FieldValidation {
  if (!years && years !== 0) {
    return { isValid: true }; // Optional field
  }

  const numYears = typeof years === 'string' ? parseInt(years) : years;

  if (isNaN(numYears)) {
    return {
      isValid: false,
      error: 'Years of farming must be a valid number'
    };
  }

  if (numYears < 0) {
    return {
      isValid: false,
      error: 'Years of farming cannot be negative'
    };
  }

  if (numYears > 80) {
    return {
      isValid: false,
      error: 'Years of farming seems unreasonably high'
    };
  }

  return { isValid: true };
}

/**
 * Validate purchase capacity
 */
export function validatePurchaseCapacity(capacity: number | string): FieldValidation {
  if (!capacity && capacity !== 0) {
    return { isValid: true }; // Optional field
  }

  const numCapacity = typeof capacity === 'string' ? parseFloat(capacity) : capacity;

  if (isNaN(numCapacity)) {
    return {
      isValid: false,
      error: 'Purchase capacity must be a valid number'
    };
  }

  if (numCapacity < 0) {
    return {
      isValid: false,
      error: 'Purchase capacity cannot be negative'
    };
  }

  return { isValid: true };
}

/**
 * Validate crop selection
 */
export function validateCrops(crops: string[]): FieldValidation {
  if (!crops || crops.length === 0) {
    return {
      isValid: false,
      error: 'Please select at least one crop'
    };
  }

  // Check if all crops are valid
  const invalidCrops = crops.filter(crop => !MAJOR_CROPS.includes(crop as any));
  if (invalidCrops.length > 0) {
    return {
      isValid: false,
      error: `Invalid crops selected: ${invalidCrops.join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Validate company type
 */
export function validateCompanyType(type: string): FieldValidation {
  if (!type) {
    return {
      isValid: false,
      error: 'Company type is required'
    };
  }

  if (!COMPANY_TYPES.includes(type as any)) {
    return {
      isValid: false,
      error: 'Please select a valid company type'
    };
  }

  return { isValid: true };
}

/**
 * Validate payment terms
 */
export function validatePaymentTerms(terms: string[]): FieldValidation {
  if (!terms || terms.length === 0) {
    return { isValid: true }; // Optional field
  }

  const invalidTerms = terms.filter(term => !PAYMENT_TERMS.includes(term as any));
  if (invalidTerms.length > 0) {
    return {
      isValid: false,
      error: `Invalid payment terms: ${invalidTerms.join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Validate login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  const emailValidation = validateEmailField(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  const passwordValidation = validateRequired(password, 'Password');
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate signup form
 */
export function validateSignupForm(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  userType: string,
  phone?: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const nameValidation = validateFullName(fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error!;
  }

  const emailValidation = validateEmailField(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  const passwordValidation = validatePasswordField(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }

  const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error!;
  }

  const userTypeValidation = validateRequired(userType, 'User type');
  if (!userTypeValidation.isValid) {
    errors.userType = userTypeValidation.error!;
  }

  if (phone) {
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate phone signup form
 */
export function validatePhoneSignupForm(
  fullName: string,
  phone: string,
  userType: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const nameValidation = validateFullName(fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error!;
  }

  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }

  const userTypeValidation = validateRequired(userType, 'User type');
  if (!userTypeValidation.isValid) {
    errors.userType = userTypeValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
