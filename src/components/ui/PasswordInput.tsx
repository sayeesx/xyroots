"use client";

import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa6';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  label?: string;
  showIcon?: boolean;
  className?: string;
  required?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter password",
  error = false,
  label,
  showIcon = true,
  className = '',
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {showIcon && (
          <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        )}
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${showIcon ? 'pl-10' : 'pl-4'} pr-12 py-2.5 text-sm bg-gray-50 border ${
            error ? 'border-red-400' : 'border-gray-200'
          } rounded-lg outline-none focus:border-xyroots-teal transition-colors`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
