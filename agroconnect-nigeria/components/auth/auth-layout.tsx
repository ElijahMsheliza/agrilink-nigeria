import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  backHref = '/',
  currentStep,
  totalSteps,
  className
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='48' cy='48' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 text-green-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">AgroConnect</span>
              <span className="hidden sm:inline text-sm text-gray-500">Nigeria</span>
            </Link>

            {/* Back Button */}
            {showBackButton && (
              <Link
                href={backHref}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
            )}
          </div>

          {/* Progress Indicator */}
          {currentStep && totalSteps && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className={cn(
            "w-full max-w-md space-y-6",
            className
          )}>
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 AgroConnect Nigeria. Connecting Nigerian farmers with buyers.
            </p>
            <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-gray-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-gray-600 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Preset layouts for common auth pages
export function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your AgroConnect Nigeria account"
      showBackButton={true}
    >
      {children}
    </AuthLayout>
  );
}

export function SignupLayout({ 
  children, 
  currentStep, 
  totalSteps 
}: { 
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
}) {
  return (
    <AuthLayout
      title="Join AgroConnect Nigeria"
      subtitle="Create your account to start connecting with farmers and buyers"
      showBackButton={true}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      {children}
    </AuthLayout>
  );
}

export function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle="Enter the verification code sent to your phone"
      showBackButton={true}
      backHref="/auth/signup"
    >
      {children}
    </AuthLayout>
  );
}

export function SetupLayout({ 
  children, 
  title,
  subtitle,
  currentStep, 
  totalSteps 
}: { 
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
}) {
  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      currentStep={currentStep}
      totalSteps={totalSteps}
      className="max-w-lg"
    >
      {children}
    </AuthLayout>
  );
}
