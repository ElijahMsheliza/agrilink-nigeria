import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile, UserType } from '../types/database';
import { redirect } from 'next/navigation';

// Authentication utilities for AgroConnect Nigeria

export interface AuthUser extends User {
  profile?: Profile;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Get current authenticated user with profile
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      ...user,
      profile: profile || undefined
    };
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Get user session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    return { session: null, error };
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
}

/**
 * Check if profile is complete based on user type
 */
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;

  // Basic profile fields
  const hasBasicInfo = !!(
    profile.full_name &&
    profile.user_type
  );

  if (!hasBasicInfo) return false;

  return true; // Basic profile is considered complete
}

/**
 * Check if user has specific role profile
 */
export async function hasRoleProfile(userId: string, userType: UserType): Promise<boolean> {
  try {
    if (userType === 'farmer') {
      const { data } = await supabase
        .from('farmer_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      return !!data;
    } else if (userType === 'buyer') {
      const { data } = await supabase
        .from('buyer_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      return !!data;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get redirect URL based on user role and profile completion status
 */
export async function getRedirectUrl(user: AuthUser): Promise<string> {
  if (!user.profile) {
    return '/auth/setup/profile';
  }

  const profileComplete = isProfileComplete(user.profile);
  if (!profileComplete) {
    return '/auth/setup/profile';
  }

  // Check if user has role-specific profile
  const hasRole = await hasRoleProfile(user.id, user.profile.user_type);
  if (!hasRole) {
    return `/auth/setup/${user.profile.user_type}`;
  }

  // Redirect to appropriate dashboard
  switch (user.profile.user_type) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Redirect user based on their role and profile status
 */
export async function redirectByRole(user: AuthUser) {
  const redirectUrl = await getRedirectUrl(user);
  redirect(redirectUrl);
}

/**
 * Require authentication middleware
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return user;
}

/**
 * Require specific user type
 */
export async function requireUserType(userType: UserType): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!user.profile || user.profile.user_type !== userType) {
    redirect('/auth/unauthorized');
  }
  
  return user;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.profile?.user_type === 'admin';
}

/**
 * Check if user is farmer
 */
export function isFarmer(user: AuthUser | null): boolean {
  return user?.profile?.user_type === 'farmer';
}

/**
 * Check if user is buyer
 */
export function isBuyer(user: AuthUser | null): boolean {
  return user?.profile?.user_type === 'buyer';
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random verification code
 */
export function generateVerificationCode(length: number = 6): string {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if verification code is expired
 */
export function isCodeExpired(createdAt: Date, expiryMinutes: number = 10): boolean {
  const now = new Date();
  const expiry = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  return now > expiry;
}

/**
 * Format time remaining for OTP
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${remainingSeconds}s`;
}

/**
 * Get error message for auth errors
 */
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  const message = error.message || error.error_description || error.toString();
  
  // Common Supabase auth error messages
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link.';
  }
  
  if (message.includes('Too many requests')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('Password should be at least')) {
    return 'Password is too weak. Please choose a stronger password.';
  }
  
  if (message.includes('Phone number already registered')) {
    return 'This phone number is already registered. Please sign in instead.';
  }
  
  if (message.includes('Invalid phone number')) {
    return 'Please enter a valid Nigerian phone number.';
  }
  
  if (message.includes('Invalid verification code')) {
    return 'Invalid verification code. Please try again.';
  }
  
  if (message.includes('Verification code expired')) {
    return 'Verification code has expired. Please request a new one.';
  }
  
  return message;
}
