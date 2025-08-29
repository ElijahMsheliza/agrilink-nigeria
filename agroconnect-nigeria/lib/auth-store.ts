'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile, UserType } from '../types/database';
import { getAuthUser, type AuthUser, type AuthState } from './auth-utils';

// Authentication store for AgroConnect Nigeria

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get initial user state
  useEffect(() => {
    if (!mounted) return;

    const initializeAuth = async () => {
      try {
        const user = await getAuthUser();
        setState(prev => ({
          ...prev,
          user,
          loading: false
        }));
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
          error: 'Failed to initialize authentication'
        }));
      }
    };

    initializeAuth();
  }, [mounted]);

  // Listen for auth changes
  useEffect(() => {
    if (!mounted) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const user = await getAuthUser();
            setState(prev => ({
              ...prev,
              user,
              loading: false,
              error: null
            }));
          } else if (event === 'SIGNED_OUT') {
            setState(prev => ({
              ...prev,
              user: null,
              loading: false,
              error: null
            }));
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            const user = await getAuthUser();
            setState(prev => ({
              ...prev,
              user,
              error: null
            }));
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setState(prev => ({
            ...prev,
            error: 'Authentication error occurred'
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [mounted]);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // User state will be updated via the auth state change listener
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign in failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: userData.full_name,
            user_type: userData.user_type,
            phone: userData.phone || null
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the signup for profile creation errors
        }
      }

      setState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign up failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const signInWithPhone = async (phone: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Phone sign in failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // User state will be updated via the auth state change listener
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'OTP verification failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // User state will be updated via the auth state change listener
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign out failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) {
      return { success: false, error: 'User not authenticated' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // Refresh user data
      await refreshUser();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const refreshUser = async () => {
    try {
      const user = await getAuthUser();
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithPhone,
    verifyOTP,
    signOut,
    resetPassword,
    updateProfile,
    refreshUser
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hooks for specific auth states
export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

export function useProfile(): Profile | null {
  const { user } = useAuth();
  return user?.profile || null;
}

export function useUserType(): UserType | null {
  const profile = useProfile();
  return profile?.user_type || null;
}

export function useIsAuthenticated(): boolean {
  const { user } = useAuth();
  return !!user;
}

export function useIsLoading(): boolean {
  const { loading } = useAuth();
  return loading;
}

export function useAuthError(): string | null {
  const { error } = useAuth();
  return error;
}
