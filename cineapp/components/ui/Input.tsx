'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[hsl(var(--fg))]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-subtle))]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-[hsl(var(--input-bg))] border rounded-xl
              text-[hsl(var(--fg))] placeholder:text-[hsl(var(--fg-subtle))]
              px-4 py-3 text-sm
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))/0.3] focus:border-[hsl(var(--ring))]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-[hsl(var(--danger))] focus:ring-[hsl(var(--danger))/0.3] focus:border-[hsl(var(--danger))]' : 'border-[hsl(var(--border))]'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-[hsl(var(--danger))] flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[hsl(var(--fg-subtle))]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
