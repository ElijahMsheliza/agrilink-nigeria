'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, RefreshCw } from 'lucide-react';
import { VerifyLayout } from '../../../components/auth/auth-layout';
import { Button } from '../../../components/ui/button';
import { OTPInput, OTPTimer } from '../../../components/auth/otp-input';
import { useAuth } from '../../../lib/auth-store';
import { validateOTP } from '../../../lib/validations';
import { getAuthErrorMessage } from '../../../lib/auth-utils';
import { maskPhoneNumber, formatPhoneDisplay } from '../../../lib/phone-utils';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyOTP, signInWithPhone, loading } = useAuth();
  
  const phone = searchParams.get('phone') || '';
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpTimer, setOTPTimer] = useState(600); // 10 minutes
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // Redirect if no phone number
  useEffect(() => {
    if (!phone) {
      router.push('/auth/login');
    }
  }, [phone, router]);

  const handleOTPChange = (value: string) => {
    setOTP(value);
    setError(''); // Clear error when user types
  };

  const handleOTPComplete = useCallback(async (otpValue: string) => {
    await handleVerifyOTP(otpValue);
  }, []);

  const handleVerifyOTP = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp;
    
    // Validate OTP
    const validation = validateOTP(otpToVerify);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyOTP(phone, otpToVerify);
      
      if (result.success) {
        // OTP verified successfully - auth context will handle redirect
        router.push('/auth/setup/role');
      } else {
        setAttempts(prev => prev + 1);
        
        if (attempts + 1 >= maxAttempts) {
          setError('Too many failed attempts. Please request a new code.');
        } else {
          setError(getAuthErrorMessage(result.error));
        }
      }
    } catch (error) {
      setAttempts(prev => prev + 1);
      setError(getAuthErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResending) return;

    setIsResending(true);
    setError('');

    try {
      const result = await signInWithPhone(phone);
      
      if (result.success) {
        setOTPTimer(600); // Reset timer
        setAttempts(0); // Reset attempts
        setOTP(''); // Clear current OTP
        setError('');
        
        // Show success message briefly
        setTimeout(() => {
          setError('');
        }, 3000);
      } else {
        setError(getAuthErrorMessage(result.error));
      }
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleTimerExpired = () => {
    setError('Verification code has expired. Please request a new one.');
  };

  const handleEditPhone = () => {
    router.push('/auth/login');
  };

  if (!phone) {
    return null; // Will redirect in useEffect
  }

  return (
    <VerifyLayout>
      <div className="space-y-6">
        {/* Phone Number Display */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Verification Code Sent
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            We've sent a 6-digit verification code to
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-semibold text-gray-900">
              {formatPhoneDisplay(phone)}
            </p>
          </div>
          
          <button
            onClick={handleEditPhone}
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Change phone number</span>
          </button>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <OTPInput
            value={otp}
            onChange={handleOTPChange}
            onComplete={handleOTPComplete}
            error={error}
            disabled={isVerifying || loading || attempts >= maxAttempts}
            autoSubmit={true}
          />

          {/* Timer and Resend */}
          <OTPTimer
            initialSeconds={otpTimer}
            onExpired={handleTimerExpired}
            onResend={handleResendOTP}
            isResending={isResending}
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerifyOTP()}
          className="w-full"
          size="lg"
          loading={isVerifying}
          disabled={otp.length !== 6 || isVerifying || loading || attempts >= maxAttempts}
        >
          Verify Phone Number
        </Button>

        {/* Resend Section */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          
          <button
            onClick={handleResendOTP}
            disabled={isResending || otpTimer > 0}
            className="inline-flex items-center space-x-2 text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
          </button>
        </div>

        {/* Attempts Warning */}
        {attempts > 0 && attempts < maxAttempts && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-700">
              {maxAttempts - attempts} attempt{maxAttempts - attempts !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}

        {/* Max Attempts Reached */}
        {attempts >= maxAttempts && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 mb-2">
              Maximum verification attempts reached.
            </p>
            <Button
              onClick={handleResendOTP}
              variant="outline"
              size="sm"
              loading={isResending}
            >
              Request New Code
            </Button>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-blue-900 mb-1">
            Having trouble?
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Make sure your phone has good signal strength</li>
            <li>• Check if the SMS was filtered to spam/promotions</li>
            <li>• Wait a few minutes for the SMS to arrive</li>
            <li>• Ensure you entered the correct phone number</li>
          </ul>
          <div className="mt-2">
            <Link
              href="/support"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </VerifyLayout>
  );
}
