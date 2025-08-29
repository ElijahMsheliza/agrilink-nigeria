'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { LoginLayout } from '../../../components/auth/auth-layout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { PhoneInput } from '../../../components/auth/phone-input';
import { useAuth } from '../../../lib/auth-store';
import { validateLoginForm, validatePhoneNumber } from '../../../lib/validations';
import { getAuthErrorMessage } from '../../../lib/auth-utils';

type AuthMethod = 'email' | 'phone';

export default function LoginPage() {
  const { signIn, signInWithPhone, loading } = useAuth();
  
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateLoginForm(formData.email, formData.password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (!result.success) {
        setErrors({ submit: getAuthErrorMessage(result.error) });
      }
      // Success handling is done by the auth context (redirect)
    } catch (error) {
      setErrors({ submit: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.isValid) {
      setErrors({ phone: phoneValidation.error! });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signInWithPhone(formData.phone);
      
      if (result.success) {
        // Redirect to OTP verification page
        window.location.href = `/auth/verify?phone=${encodeURIComponent(formData.phone)}`;
      } else {
        setErrors({ submit: getAuthErrorMessage(result.error) });
      }
    } catch (error) {
      setErrors({ submit: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = authMethod === 'email' ? handleEmailLogin : handlePhoneLogin;

  return (
    <LoginLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Auth Method Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              authMethod === 'phone'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              authMethod === 'email'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </button>
        </div>

        {/* Phone Login Form */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
              disabled={loading}
            >
              Send Verification Code
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              We'll send a 6-digit verification code to your phone
            </p>
          </div>
        )}

        {/* Email Login Form */}
        {authMethod === 'email' && (
          <div className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
              disabled={loading}
            >
              Sign In
            </Button>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            New to AgroConnect Nigeria?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-green-600 hover:text-green-700"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </LoginLayout>
  );
}
