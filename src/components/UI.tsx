import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-soft',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'hover:bg-black/5 text-charcoal',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider',
    md: 'px-6 py-3 text-sm font-semibold',
    lg: 'px-8 py-4 text-lg font-bold',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius,24px)] transition-all active:scale-95 disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-warm-bg rounded-[32px] overflow-hidden shadow-soft border border-black/5',
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full bg-[#f5f2ed] border-none rounded-2xl px-4 py-3 text-charcoal placeholder:text-text-light/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
        className
      )}
      {...props}
    />
  );
}

export function Badge({ children, variant = 'primary' }: { children: React.ReactNode, variant?: string }) {
  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
      variant === 'primary' ? 'bg-accent text-white' : 'bg-secondary/10 text-secondary'
    )}>
      {children}
    </span>
  );
}
