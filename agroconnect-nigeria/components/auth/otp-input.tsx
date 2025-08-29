'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
  onComplete?: (otp: string) => void;
  autoSubmit?: boolean;
  className?: string;
}

export function OTPInput({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  error,
  onComplete,
  autoSubmit = false,
  className
}: OTPInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle completion
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const getOTPArray = () => {
    return value.split('').concat(Array(length - value.length).fill(''));
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    
    // Only allow digits
    if (val && !/^\d$/.test(val)) {
      return;
    }

    const otpArray = getOTPArray();
    otpArray[index] = val;
    const newOTP = otpArray.join('').slice(0, length);
    
    onChange(newOTP);

    // Move to next input if value is entered
    if (val && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const otpArray = getOTPArray();
      
      if (otpArray[index]) {
        // Clear current input
        otpArray[index] = '';
        onChange(otpArray.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        otpArray[index - 1] = '';
        onChange(otpArray.join(''));
        setActiveInput(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
    
    // Handle paste
    else if (e.key === 'Enter' && value.length === length && autoSubmit) {
      onComplete?.(value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    
    // Only allow digits and limit to length
    const pastedOTP = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (pastedOTP) {
      onChange(pastedOTP);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(pastedOTP.length, length - 1);
      setActiveInput(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-center space-x-2 sm:space-x-3">
        {getOTPArray().map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
              digit && !error && 'border-green-500 bg-green-50',
              !digit && !error && 'border-gray-300 hover:border-gray-400',
              error && 'border-red-500 bg-red-50',
              activeInput === index && !error && 'border-green-500 ring-2 ring-green-200'
            )}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">
          {error}
        </p>
      )}
      
      {!error && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Enter the {length}-digit code sent to your phone
        </p>
      )}
    </div>
  );
}

// OTP Timer Component
interface OTPTimerProps {
  initialSeconds: number;
  onExpired?: () => void;
  onResend?: () => void;
  isResending?: boolean;
  className?: string;
}

export function OTPTimer({
  initialSeconds,
  onExpired,
  onResend,
  isResending = false,
  className
}: OTPTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isExpired) {
      setIsExpired(true);
      onExpired?.();
    }
  }, [seconds, isExpired, onExpired]);

  // Reset timer when initialSeconds changes (e.g., after resend)
  useEffect(() => {
    setSeconds(initialSeconds);
    setIsExpired(false);
  }, [initialSeconds]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    if (!isResending && onResend) {
      onResend();
    }
  };

  return (
    <div className={cn('text-center', className)}>
      {!isExpired ? (
        <p className="text-sm text-gray-600">
          Code expires in{' '}
          <span className="font-semibold text-green-600">
            {formatTime(seconds)}
          </span>
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-red-600">
            Verification code has expired
          </p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className={cn(
              'text-sm font-medium transition-colors',
              'text-green-600 hover:text-green-700 focus:text-green-700',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
      )}
    </div>
  );
}
