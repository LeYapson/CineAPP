'use client';

import { ReactNode, HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles = {
  default:
    'bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]',
  elevated:
    'bg-[hsl(var(--bg-card))] shadow-lg shadow-[hsl(var(--shadow-color)/0.1)]',
  outlined:
    'bg-transparent border-2 border-[hsl(var(--border))]',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, padding = 'md', variant = 'default', className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl transition-all duration-300
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hover ? 'hover:border-[hsl(var(--border-hover))] hover:shadow-xl hover:shadow-[hsl(var(--shadow-color)/0.15)] hover:-translate-y-1 cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
