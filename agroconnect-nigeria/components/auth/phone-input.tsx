'use client';

import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { 
  isValidNigerianPhone, 
  formatPhoneInput, 
  formatNigerianPhone,
  getNetworkProvider 
} from '../../lib/phone-utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  onValidationChange,
  error,
  label = 'Phone Number',
  placeholder = '0803 123 4567',
  required = false,
  disabled = false,
  className
}: PhoneInputProps) {
  const [formattedValue, setFormattedValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [network, setNetwork] = useState<string>('');
  const [isTouched, setIsTouched] = useState(false);

  // Update formatted value when value changes
  useEffect(() => {
    if (value) {
      const formatted = formatPhoneInput(value);
      setFormattedValue(formatted);
      
      // Validate phone number
      const valid = isValidNigerianPhone(value);
      setIsValid(valid);
      
      // Get network provider
      if (valid) {
        const provider = getNetworkProvider(value);
        setNetwork(provider);
      } else {
        setNetwork('');
      }
      
      // Notify parent of validation state
      if (onValidationChange) {
        onValidationChange(valid);
      }
    } else {
      setFormattedValue('');
      setIsValid(false);
      setNetwork('');
      if (onValidationChange) {
        onValidationChange(false);
      }
    }
  }, [value, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove formatting and only keep digits and +
    const rawValue = inputValue.replace(/[^\d+]/g, '');
    
    // Update the raw value
    onChange(rawValue);
    setIsTouched(true);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const getValidationIcon = () => {
    if (!isTouched || !value) return null;
    
    if (isValid) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getValidationMessage = () => {
    if (!isTouched || !value) return '';
    
    if (isValid && network) {
      return `Valid ${network} number`;
    } else if (value && !isValid) {
      return 'Please enter a valid Nigerian phone number';
    }
    
    return '';
  };

  const getNetworkColor = () => {
    switch (network.toLowerCase()) {
      case 'mtn':
        return 'text-yellow-600';
      case 'airtel':
        return 'text-red-500';
      case 'glo':
        return 'text-green-600';
      case '9mobile':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <Input
        type="tel"
        value={formattedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={error || (isTouched && value && !isValid ? getValidationMessage() : undefined)}
        helperText={
          !error && isValid && network
            ? `Valid ${network} number`
            : 'Enter Nigerian phone number (e.g., 0803 123 4567)'
        }
        leftIcon={<Phone className="h-4 w-4" />}
        rightIcon={getValidationIcon()}
      />
      
      {/* Network Provider Indicator */}
      {isValid && network && (
        <div className="mt-2 flex items-center space-x-2">
          <div className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            getNetworkColor(),
            'bg-gray-100'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full mr-2',
              network.toLowerCase() === 'mtn' && 'bg-yellow-500',
              network.toLowerCase() === 'airtel' && 'bg-red-500',
              network.toLowerCase() === 'glo' && 'bg-green-500',
              network.toLowerCase() === '9mobile' && 'bg-blue-500'
            )} />
            {network} Network
          </div>
        </div>
      )}
    </div>
  );
}

// Nigerian Phone Number Info Component
export function PhoneNumberInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
      <h3 className="font-medium text-blue-900 mb-2">Supported Nigerian Networks</h3>
      <div className="grid grid-cols-2 gap-2 text-blue-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>MTN</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Airtel</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Glo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>9mobile</span>
        </div>
      </div>
      <p className="text-blue-700 mt-2">
        Enter your phone number in any format: 08031234567, 0803 123 4567, or +234 803 123 4567
      </p>
    </div>
  );
}
